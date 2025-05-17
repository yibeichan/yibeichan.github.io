import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import querystring from 'querystring';

// Configuration for ORCID API
const ORCID_ID = '0000-0003-2882-0900';
const CLIENT_ID = 'APP-EUPGISZZCIOR8G50';
const CLIENT_SECRET = 'dbd56f87-2adb-4ebe-b599-2ec679eae5c4';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 10000, // 10 second timeout
      });
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying in ${backoff}ms...`);
      await delay(backoff);
      backoff *= 2; // exponential backoff
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

    if (!tokenResponse.ok) {
      console.error(`Failed to get token: ${tokenResponse.status}`);
      return null;
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

async function fetchPublications() {
  try {
    const accessToken = await getOrcidAccessToken();
    const headers = {
      'Accept': 'application/vnd.orcid+json'
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetchWithRetry(
      `https://pub.orcid.org/v3.0/${ORCID_ID}/works`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const publications = await Promise.all(
      data.group.map(async work => {
        const workSummary = work['work-summary'][0];
        
        // Get detailed work information
        const detailResponse = await fetchWithRetry(
          `https://pub.orcid.org/v3.0/${ORCID_ID}/work/${workSummary['put-code']}`,
          { headers }
        );
        
        if (!detailResponse.ok) {
          console.warn(`Failed to fetch details for work ${workSummary['put-code']}`);
          return null;
        }

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

        // Extract journal title with fallback
        const journalTitle = workSummary['journal-title']?.value || 
                           detailData['journal-title']?.value || 
                           'Preprint';

        // Extract DOI
        const doi = workSummary['external-ids']?.['external-id']
          ?.find(id => id['external-id-type'] === 'doi')
          ?.['external-id-value'];

        // Extract URL with DOI fallback
        let url = workSummary.url?.value;
        if (!url && doi) {
          url = `https://doi.org/${doi}`;
        }

        // Extract year
        const year = workSummary['publication-date']?.year?.value?.toString() || 'N/A';

        // Generate intelligent tags based on content
        const tags = new Set();
        const lowerTitle = workSummary.title['title'].value.toLowerCase();
        const lowerJournal = journalTitle.toLowerCase();
        
        // Research areas
        if (lowerTitle.includes('neural') || lowerTitle.includes('brain') || lowerJournal.includes('neuro')) {
          tags.add('Neuroscience');
        }
        if (lowerTitle.includes('reproducible') || lowerTitle.includes('reproducibility')) {
          tags.add('Reproducibility');
        }
        if (lowerTitle.includes('software') || lowerTitle.includes('workflow')) {
          tags.add('Software Development');
        }
        if (lowerTitle.includes('neuroimaging') || lowerTitle.includes('fmri') || lowerTitle.includes('bids')) {
          tags.add('Neuroimaging');
        }
        if (lowerTitle.includes('social') || lowerTitle.includes('communication')) {
          tags.add('Social Science');
        }
        if (lowerTitle.includes('decision') || lowerTitle.includes('cognitive')) {
          tags.add('Cognitive Science');
        }
        if (lowerJournal.includes('comput') || lowerTitle.includes('computational')) {
          tags.add('Computational Methods');
        }
        if (lowerTitle.includes('media') || lowerTitle.includes('news')) {
          tags.add('Media Studies');
        }

        return {
          title: workSummary.title['title'].value,
          authors: authors,
          journal: journalTitle,
          year: year,
          url: url,
          doi: doi,
          tags: Array.from(tags).sort()
        };
      })
    );

    // Remove any null entries and sort publications
    const validPublications = publications.filter(Boolean).sort((a, b) => {
      if (b.year !== a.year) return parseInt(b.year) - parseInt(a.year);
      return a.title.localeCompare(b.title);
    });

    await fs.mkdir(path.join(process.cwd(), 'src/data'), { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), 'src/data/publications.json'),
      JSON.stringify(validPublications, null, 2)
    );

    console.log(`Successfully saved ${validPublications.length} publications!`);
  } catch (error) {
    console.error('Error fetching publications:', error);
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