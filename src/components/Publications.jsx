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

  const formatAuthors = (authors) => {
    return authors.map((author, index) => {
      const isYibei = author.includes('Yibei Chen') || author === 'Chen, Y.';
      return (
        <span key={index}>
          {index > 0 && ', '}
          <span className={isYibei ? 'underline font-medium' : ''}>
            {author}
          </span>
        </span>
      );
    });
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
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${activeFilters.has(tag) 
                      ? 'bg-[#A31F34] text-white' 
                      : 'bg-gray-100 text-black hover:bg-[#A31F34] hover:text-white'}`}
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
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-black mb-2">{pub.title}</h3>
                    <p className="text-black mb-2">{formatAuthors(pub.authors)}</p>
                    <p className="text-black mb-2">{pub.journal}, {pub.year}</p>
                    {pub.tags && pub.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {pub.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-black"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {pub.doi && (
                      <a 
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A31F34] hover:underline cursor-pointer block"
                      >
                        DOI: {pub.doi}
                      </a>
                    )}
                    {pub.url && !pub.url.includes(pub.doi) && (
                      <a 
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A31F34] hover:underline cursor-pointer block mt-1"
                      >
                        View Publication
                      </a>
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