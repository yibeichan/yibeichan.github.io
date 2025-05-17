import { useState, useEffect } from 'react';

function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(new Set());

  useEffect(() => {
    fetch('/src/data/publications.json')
      .then(response => response.json())
      .then(data => {
        setPublications(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load publications');
        setLoading(false);
      });
  }, []);

  // Group publications by year
  const publicationsByYear = publications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(publicationsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // Extract all unique tags
  const allTags = [...new Set(publications.flatMap(pub => pub.tags || []))].sort();

  const filterPublications = (pub) => {
    const matchesSearch = searchTerm === '' || 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTags = activeFilters.size === 0 || 
      pub.tags?.some(tag => activeFilters.has(tag));

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
    const isYibei = author.includes('Yibei Chen') || author === 'Chen, Y.' || author === 'Chen, Yibei';
    return isYibei ? <u>{author}</u> : author;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-8">Publications</h2>
        <div className="text-black">Loading publications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-8">Publications</h2>
        <div className="text-black">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-black mb-8">Publications</h2>
      
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
          <div className="mt-4">
            <h3 className="text-sm font-medium text-black mb-2">Filter by topic:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${activeFilters.has(tag) 
                      ? 'bg-[#A31F34] text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-[#A31F34] hover:text-white'}`}
                >
                  {tag}
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#A31F34] text-white hover:bg-opacity-90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-12">
        {sortedYears.map(year => {
          const yearPublications = publicationsByYear[year].filter(filterPublications);
          
          if (yearPublications.length === 0) return null;

          return (
            <div key={year}>
              <h3 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-gray-200">
                {year}
              </h3>
              <div className="space-y-6">
                {yearPublications.map((pub, index) => (
                  <div key={index} className="publication-item bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pub.tags?.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 font-serif">{pub.title}</h3>
                    
                    <p className="text-gray-700 mt-2">
                      {pub.authors.map((author, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {formatAuthor(author)}
                        </span>
                      ))}
                    </p>
                    
                    <div className="text-gray-600 mt-1 text-sm">
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
                          className="inline-flex items-center text-sm text-[#A31F34] hover:text-opacity-80"
                        >
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
      </div>
    </div>
  );
}

export default Publications;