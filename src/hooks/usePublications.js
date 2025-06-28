import { useState, useEffect } from 'react';

// Mock API functions that simulate database operations
// In a real implementation, these would call actual API endpoints
async function mockDatabaseAPI() {
  try {
    // Load from JSON file as fallback
    const response = await fetch('/src/data/publications.json');
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    const data = await response.json();
    
    // Simulate database-like operations
    return {
      getAllPublications: () => data,
      searchPublications: (searchTerm, tags = []) => {
        let filtered = data;
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(pub => 
            (pub.title && pub.title.toLowerCase().includes(term)) ||
            (pub.authors && pub.authors.some(author => author && author.toLowerCase().includes(term)))
          );
        }
        
        if (tags.length > 0) {
          filtered = filtered.filter(pub => 
            pub.tags && tags.every(tag => pub.tags.includes(tag))
          );
        }
        
        return filtered;
      },
      getAllTags: () => {
        const allTags = new Set();
        data.forEach(pub => {
          if (pub.tags) {
            pub.tags.forEach(tag => allTags.add(tag));
          }
        });
        return Array.from(allTags).sort();
      },
      getStats: () => ({
        publications: data.length,
        authors: new Set(data.flatMap(pub => pub.authors || [])).size,
        tags: new Set(data.flatMap(pub => pub.tags || [])).size,
        yearRange: {
          min_year: Math.min(...data.map(pub => parseInt(pub.year) || 0)),
          max_year: Math.max(...data.map(pub => parseInt(pub.year) || 0))
        }
      })
    };
  } catch (error) {
    console.error('Error loading publications:', error);
    return null;
  }
}

export function usePublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api, setApi] = useState(null);

  useEffect(() => {
    initializeAPI();
  }, []);

  const initializeAPI = async () => {
    try {
      setLoading(true);
      const apiInstance = await mockDatabaseAPI();
      if (!apiInstance) {
        throw new Error('Failed to initialize publications API');
      }
      
      setApi(apiInstance);
      const data = apiInstance.getAllPublications();
      
      // Ensure all publications have the required structure
      const normalizedData = data.map(pub => ({
        title: pub.title || '',
        authors: pub.authors || [],
        journal: pub.journal || '',
        year: pub.year || 'Unknown',
        url: pub.url || null,
        doi: pub.doi || null,
        tags: pub.tags || []
      }));
      
      setPublications(normalizedData);
    } catch (err) {
      console.error('Error initializing publications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchPublications = async (searchTerm, tags = []) => {
    if (!api) return [];
    
    try {
      return api.searchPublications(searchTerm, tags);
    } catch (err) {
      console.error('Error searching publications:', err);
      setError(err.message);
      return [];
    }
  };

  const getAllTags = () => {
    if (!api) return [];
    return api.getAllTags();
  };

  const getStats = () => {
    if (!api) return null;
    return api.getStats();
  };

  return {
    publications,
    loading,
    error,
    searchPublications,
    getAllTags,
    getStats,
    refetch: initializeAPI
  };
}