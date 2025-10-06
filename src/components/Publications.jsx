import { useState, useEffect } from 'react';
import PageHelmet from './PageHelmet';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import publicationsData from '../data/publications.json';

function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(new Set());

  useEffect(() => {
    try {
      const dataWithTags = publicationsData.map(pub => ({
        ...pub,
        tags: pub.tags || []
      }));
      
      setPublications(dataWithTags);
      setLoading(false);
    } catch (err) {
      console.error("Error loading publications:", err);
      setError(`Failed to load publications: ${err.message}`);
      setLoading(false);
    }
  }, []);

  const publicationsByYear = publications.reduce((acc, pub) => {
    const year = pub.year || 'Unknown';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(publicationsByYear).sort((a, b) => {
    const yearA = isNaN(parseInt(a)) ? 0 : parseInt(a);
    const yearB = isNaN(parseInt(b)) ? 0 : parseInt(b);
    return yearB - yearA;
  });

  const allTags = [...new Set(publications.flatMap(pub => pub.tags || []))].sort();

  const filterPublications = (pub) => {
    const matchesSearch = searchTerm === '' || 
      (pub.title && pub.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pub.authors && pub.authors.some(author => author && author.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesTags = activeFilters.size === 0 || 
      (pub.tags && pub.tags.some(tag => activeFilters.has(tag)));

    return matchesSearch && matchesTags;
  };

  const toggleFilter = (tag) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(tag)) {
        newFilters.delete(tag);
      } else {
        newFilters.add(tag);
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters(new Set());
  };

  const formatAuthor = (author) => {
    if (!author) return null;
    const isYibei = author.includes('Yibei Chen') || author === 'Chen, Y.' || author === 'Chen, Yibei';
    return isYibei ? <u>{author}</u> : author;
  };

  let content;

  if (loading) {
    content = (
      <div>
        <h2 className="text-3xl font-bold text-black mb-8 font-serif">Publications</h2>
        <div className="text-black">Loading publications...</div>
      </div>
    );
  } else if (error) {
    content = (
      <div>
        <h2 className="text-3xl font-bold text-black mb-8 font-serif">Publications</h2>
        <div className="text-black">{error}</div>
        <div className="mt-4">
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-[#A31F34] text-white hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34] py-3 px-4 bg-gray-50"
            />
          </div>

        {allTags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-900 mb-3 font-serif">Filter by topic:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${activeFilters.has(tag) 
                      ? 'bg-[#A31F34] text-white' 
                      : 'bg-gray-100 text-[#A31F34] hover:bg-[#A31F34] hover:text-white'}`}
                >
                  {tag}
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-opacity-90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {sortedYears.map(year => {
        const yearPublications = publicationsByYear[year].filter(filterPublications);
        
        if (yearPublications.length === 0) return null;

        return (
          <div key={year}>
            <h3 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-gray-200 font-serif">
              {year}
            </h3>
            <div className="space-y-6">
              {yearPublications.map((pub, index) => (
                <div key={index} className="publication-item bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  {pub.tags && pub.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pub.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#A31F34] bg-opacity-30 text-[#A31F34]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 font-serif">{pub.title}</h3>
                  
                  {pub.authors && pub.authors.length > 0 && (
                    <p className="text-gray-700 mt-2">
                      {pub.authors.map((author, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {formatAuthor(author)}
                        </span>
                      ))}
                    </p>
                  )}
                  
                  <div className="text-gray-600 mt-2 text-base">
                    {pub.journal && <span className="italic">{pub.journal}, </span>}
                    <span>{pub.year}</span>
                    {pub.doi && (
                      <span className="ml-1">
                        · DOI: <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-[#A31F34] hover:text-opacity-80">{pub.doi}</a>
                      </span>
                    )}
                  </div>

                  {(pub.url || pub.doi) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a 
                        href={pub.url || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-base text-[#A31F34] hover:text-opacity-80"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-1" />
                        Access Publication
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="mt-12 text-xs text-gray-400">
        Loaded {publications.length} publications
      </div>
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8"> 
      <PageHelmet
        title="Publications"
        description="Peer-reviewed papers, preprints, and publications by Yibei Chen."
        path="/publications"
      />
      {content}
    </div>
  );
}

export default Publications;
