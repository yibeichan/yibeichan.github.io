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
        return {
          title: workSummary.title['title'].value,
          authors: workSummary['contributors']?.contributor?.map(c => c['credit-name'].value) || [],
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
    console.error('Error fetching publications:', error);
    await fs.writeFile(
      path.join(process.cwd(), 'src/data/publications.json'),
      JSON.stringify([], null, 2)
    );
  }
}

console.log('Starting ORCID publications fetch...');
fetchPublications();