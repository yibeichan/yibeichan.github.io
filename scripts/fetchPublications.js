import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import querystring from 'querystring';

// Configuration for ORCID API
const ORCID_ID = '0000-0003-2882-0900';
const CLIENT_ID = 'APP-EUPGISZZCIOR8G50';
const CLIENT_SECRET = 'dbd56f87-2adb-4ebe-b599-2ec679eae5c4';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, maxRetries = 5, initialBackoff = 2000) {
  let lastError;
  let backoff = initialBackoff;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 30000, // 30 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Check if we should retry based on error type
      const shouldRetry = error.code === 'ECONNRESET' ||
                         error.code === 'ECONNREFUSED' ||
                         error.code === 'ETIMEDOUT' ||
                         error.type === 'system';

      if (!shouldRetry || attempt === maxRetries) {
        throw new Error(`Failed after ${attempt} attempts. Last error: ${error.message}`);
      }

      console.log(`Attempt ${attempt} failed, retrying in ${backoff}ms...`);
      await delay(backoff);
      backoff *= 2; // Exponential backoff
    }
  }
}

async function getOrcidAccessToken() {
  try {
    console.log('Getting ORCID access token...');
    const tokenResponse = await fetchWithRetry('https://pub.orcid.org/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': '/read-public'
      })
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
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
      'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetchWithRetry(
      `https://pub.orcid.org/v3.0/${ORCID_ID}/works`,
      { headers }
    );

    const data = await response.json();
    const publications = await Promise.all(
      data.group.map(async work => {
        const workSummary = work['work-summary'][0];
        
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

        return {
          title: workSummary.title['title'].value,
          authors: authors,
          journal: workSummary['journal-title']?.value || 'Preprint',
          year: workSummary['publication-date']?.year?.value?.toString() || 'N/A',
          url: workSummary.url?.value || null,
          doi: workSummary['external-ids']?.['external-id']?.find(id => id['external-id-type'] === 'doi')?.['external-id-value'] || null,
          tags: []
        };
      })
    );

    await fs.mkdir(path.join(process.cwd(), 'src/data'), { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), 'src/data/publications.json'),
      JSON.stringify(publications, null, 2)
    );

    console.log(`Successfully saved ${publications.length} publications!`);
  } catch (error) {
    console.error('Error fetching publications:', error.message);
    // Don't overwrite existing publications.json if fetch fails
    const existingPublications = await fs.readFile(
      path.join(process.cwd(), 'src/data/publications.json')
    ).catch(() => '[]');
    
    if (existingPublications === '[]') {
      await fs.writeFile(
        path.join(process.cwd(), 'src/data/publications.json'),
        '[]'
      );
    }
  }
}

console.log('Starting ORCID publications fetch...');
fetchPublications();