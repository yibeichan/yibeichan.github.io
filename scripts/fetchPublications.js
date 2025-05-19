import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import querystring from 'querystring';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration from environment variables or GitHub secrets
const ORCID_ID = process.env.ORCID_ID;
const CLIENT_ID = process.env.ORCID_CLIENT_ID || process.env.GITHUB_ORCID_CLIENT_ID;
const CLIENT_SECRET = process.env.ORCID_CLIENT_SECRET || process.env.GITHUB_ORCID_CLIENT_SECRET;

// Validate required environment variables or GitHub secrets
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: ORCID_CLIENT_ID and ORCID_CLIENT_SECRET must be set in .env file or as GitHub secrets');
  process.exit(1);
}

// Validation for ORCID_ID (now correctly checks if it was provided by the environment)
if (!ORCID_ID) {
  console.error('Error: ORCID_ID must be set with your actual ORCID ID in .env file (for local use) or as a GitHub secret named ORCID_ID (for Actions)');
  process.exit(1);
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, maxRetries = 8, initialBackoff = 5000) {
  let lastError;
  let backoff = initialBackoff;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} for ${url}`);
      
      const response = await fetch(url, {
        ...options,
        timeout: 60000, // Increased timeout to 60 seconds
      });
      
      // Handle rate limiting explicitly
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
        console.log(`Rate limited. Waiting for ${retryAfter} seconds...`);
        await delay(retryAfter * 1000);
        continue;
      }
      
      // Log response status and headers for debugging
      console.log(`Response status: ${response.status}`);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, {
        error: error.message,
        code: error.code,
        type: error.type,
        name: error.name
      });
      
      // Check if we should retry based on error type
      const shouldRetry = error.code === 'ECONNRESET' ||
                         error.code === 'ECONNREFUSED' ||
                         error.code === 'ETIMEDOUT' ||
                         error.type === 'system' ||
                         error.message.includes('socket hang up');

      if (!shouldRetry || attempt === maxRetries) {
        throw new Error(`Failed after ${attempt} attempts. Last error: ${error.message}`);
      }

      console.log(`Waiting ${backoff}ms before retry...`);
      await delay(backoff);
      backoff *= 2; // Exponential backoff
    }
  }
}

async function getOrcidAccessToken() {
  try {
    console.log('Getting ORCID access token...');
    console.log('Using client ID:', CLIENT_ID.substring(0, 4) + '...');
    
    const tokenResponse = await fetchWithRetry('https://pub.orcid.org/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Node/FetchPublications'
      },
      body: querystring.stringify({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': '/read-public'
      })
    });

    const tokenData = await tokenResponse.json();
    console.log('Successfully obtained access token');
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    console.error('Full error details:', error);
    return null;
  }
}

async function fetchPublications() {
  try {
    const accessToken = await getOrcidAccessToken();
    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }

    const headers = {
      'Accept': 'application/vnd.orcid+json',
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Node/FetchPublications'
    };

    const response = await fetchWithRetry(
      `https://pub.orcid.org/v3.0/${ORCID_ID}/works`,
      { headers }
    );

    const data = await response.json();
    
    if (!data.group || !Array.isArray(data.group)) {
      throw new Error('Unexpected API response format');
    }
    
    console.log(`Fetching details for ${data.group.length} publications...`);
    
    const publications = [];
    
    // Process works sequentially to avoid rate limits
    for (const work of data.group) {
      try {
        const workSummary = work['work-summary'][0];
        
        // Add a small delay between requests to be respectful of the API
        await delay(300);
        
        // Get detailed work information
        const detailResponse = await fetchWithRetry(
          `https://pub.orcid.org/v3.0/${ORCID_ID}/work/${workSummary['put-code']}`,
          { headers }
        );
        
        const detailData = await detailResponse.json();

        // Extract contributors with proper formatting
        const contributors = detailData.contributors?.contributor || [];
        const authors = contributors.map(c => {
          if (c['credit-name']?.value) {
            return c['credit-name'].value;
          }
          const givenNames = c['given-names']?.value || '';
          const familyName = c['family-name']?.value || '';
          if (givenNames && familyName) {
            return `${givenNames} ${familyName}`;
          }
          if (familyName) {
            return `${familyName}, ${givenNames.charAt(0)}.`;
          }
          return null;
        }).filter(Boolean);

        publications.push({
          title: workSummary.title['title'].value,
          authors: authors,
          journal: workSummary['journal-title']?.value || 'Preprint',
          year: workSummary['publication-date']?.year?.value?.toString() || 'N/A',
          url: workSummary.url?.value || null,
          doi: workSummary['external-ids']?.['external-id']?.find(id => id['external-id-type'] === 'doi')?.['external-id-value'] || null,
          tags: []
        });
        
        console.log(`Processed: ${workSummary.title['title'].value}`);
      } catch (error) {
        console.error(`Error processing work: ${error.message}`);
        // Continue with next work instead of failing completely
      }
    }

    const outputDir = path.join(process.cwd(), 'src/data');
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'publications.json');
    
    // Backup existing file if it exists
    try {
      const stats = await fs.stat(outputPath);
      if (stats.isFile()) {
        const backupPath = path.join(outputDir, `publications.backup.${Date.now()}.json`);
        await fs.copyFile(outputPath, backupPath);
        console.log(`Backed up existing publications to ${backupPath}`);
      }
    } catch (error) {
      // File likely doesn't exist, continue
    }
    
    await fs.writeFile(
      outputPath,
      JSON.stringify(publications, null, 2)
    );

    console.log(`Successfully saved ${publications.length} publications!`);
  } catch (error) {
    console.error('Error fetching publications:', error.message);
    // Don't overwrite existing publications.json if fetch fails
    const outputPath = path.join(process.cwd(), 'src/data/publications.json');
    try {
      await fs.access(outputPath);
      console.log('Fetch failed but existing publications.json was preserved.');
    } catch {
      // If no existing file, create an empty array
      await fs.mkdir(path.join(process.cwd(), 'src/data'), { recursive: true });
      await fs.writeFile(outputPath, '[]');
      console.log('Created empty publications.json due to fetch failure.');
    }
  }
}

console.log('Starting ORCID publications fetch...');
fetchPublications();
