import { useState, useEffect } from 'react';

// Since we're in a browser environment, we'll create an API endpoint
// to interact with the SQLite database
const API_BASE = '/api/publications';

export function usePublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      // For now, fall back to JSON file until we set up API endpoints
      const response = await fetch('/src/data/publications.json');
      if (!response.ok) {
        throw new Error('Failed to fetch publications');
      }
      const data = await response.json();
      setPublications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchPublications = async (searchTerm, tags = []) => {
    try {
      setLoading(true);
      // For now, implement client-side filtering
      // In the future, this would call the database API
      let filtered = publications;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(pub => 
          pub.title.toLowerCase().includes(term) ||
          pub.authors.some(author => author.toLowerCase().includes(term))
        );
      }
      
      if (tags.length > 0) {
        filtered = filtered.filter(pub => 
          tags.every(tag => pub.tags.includes(tag))
        );
      }
      
      return filtered;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    publications,
    loading,
    error,
    searchPublications,
    refetch: fetchPublications
  };
}