import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import querystring from 'querystring';

// Configuration for ORCID API
const ORCID_ID = '0000-0003-2882-0900';
const CLIENT_ID = 'APP-EUPGISZZCIOR8G50';
const CLIENT_SECRET = 'dbd56f87-2adb-4ebe-b599-2ec679eae5c4';

async function getOrcidAccessToken() {
  try {
    console.log('Getting ORCID access token...');
    const tokenResponse = await fetch('https://pub.orcid.org/oauth/token', {
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

    const response = await fetch(
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
        const detailResponse = await fetch(
          workSummary['path'],
          { headers }
        );
        const detailData = await detailResponse.json();

        // Extract contributors with proper formatting
        const contributors = detailData.contributors?.contributor || [];
        const authors = contributors.map(c => {
          const creditName = c['credit-name']?.value;
          const givenNames = c['given-names']?.value;
          const familyName = c['family-name']?.value;
          
          if (creditName) {
            return creditName;
          } else if (givenNames && familyName) {
            return `${givenNames} ${familyName}`;
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

        // Add some default tags based on journal and title
        const tags = new Set();
        const lowerTitle = workSummary.title['title'].value.toLowerCase();
        
        if (lowerTitle.includes('neural') || lowerTitle.includes('brain')) tags.add('Neuroscience');
        if (lowerTitle.includes('reproducible') || lowerTitle.includes('reproducibility')) tags.add('Reproducibility');
        if (lowerTitle.includes('software') || lowerTitle.includes('workflow')) tags.add('Software Development');
        if (lowerTitle.includes('neuroimaging') || lowerTitle.includes('fmri')) tags.add('Neuroimaging');
        if (lowerTitle.includes('social') || lowerTitle.includes('communication')) tags.add('Social Science');
        if (journalTitle.toLowerCase().includes('comput')) tags.add('Computational Methods');

        return {
          title: workSummary.title['title'].value,
          authors: authors,
          journal: journalTitle,
          year: year,
          url: url,
          doi: doi,
          tags: Array.from(tags)
        };
      })
    );

    // Sort publications by year (descending) and then by title
    publications.sort((a, b) => {
      if (b.year !== a.year) return parseInt(b.year) - parseInt(a.year);
      return a.title.localeCompare(b.title);
    });

    await fs.mkdir(path.join(process.cwd(), 'src/data'), { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), 'src/data/publications.json'),
      JSON.stringify(publications, null, 2)
    );

    console.log(`Successfully saved ${publications.length} publications!`);
  } catch (error) {
    console.error('Error fetching publications:', error);
    await fs.writeFile(
      path.join(process.cwd(), 'src/data/publications.json'),
      JSON.stringify([], null, 2)
    );
  }
}

console.log('Starting ORCID publications fetch...');
fetchPublications();