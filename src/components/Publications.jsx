import { useState, useMemo } from 'react';
import PageHelmet from './PageHelmet';
import PublicationsJsonLd from './PublicationsJsonLd';
import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import publicationsData from '../data/publications.json';

function Publications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'published', 'preprint'

  const publications = useMemo(() => {
    return publicationsData.map(pub => ({
      ...pub,
      tags: pub.tags || [],
      status: pub.status || 'published'
    }));
  }, []);

  const publicationsByYear = useMemo(() => {
    const acc = {};
    publications.forEach(pub => {
      const year = pub.year || 'Unknown';
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
    });
    return acc;
  }, [publications]);

  const sortedYears = Object.keys(publicationsByYear).sort((a, b) => {
    return (parseInt(b) || 0) - (parseInt(a) || 0);
  });

  const allTags = useMemo(() => {
    return [...new Set(publications.flatMap(pub => pub.tags || []))].sort();
  }, [publications]);

  const filterPublications = (pub) => {
    const matchesSearch = searchTerm === '' ||
      (pub.title && pub.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pub.authors && pub.authors.some(author => author && author.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesTags = activeFilters.size === 0 ||
      (pub.tags && pub.tags.some(tag => activeFilters.has(tag)));

    const matchesStatus = statusFilter === 'all' || pub.status === statusFilter;

    return matchesSearch && matchesTags && matchesStatus;
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
    setStatusFilter('all');
  };

  const formatAuthor = (author) => {
    if (!author) return null;
    const isYibei = author.includes('Yibei Chen') || author === 'Chen, Y.' || author === 'Chen, Yibei';
    return isYibei ? <strong className="font-semibold">{author}</strong> : author;
  };

  const hasActiveFilters = searchTerm || activeFilters.size > 0 || statusFilter !== 'all';

  return (
    <div>
      <PageHelmet
        title="Publications"
        description="Peer-reviewed papers, preprints, and publications by Yibei Chen."
        path="/publications"
      />

      {/* Header */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-serif mb-4">
            Publications
          </h1>
          <p className="text-xl text-gray-300">
            Peer-reviewed papers, preprints, and conference proceedings.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <PublicationsJsonLd publications={publications} />

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34] py-3 pl-10 pr-4 bg-white"
            />
          </div>

          {/* Status tabs */}
          <div className="flex gap-2">
            {['all', 'published', 'preprint'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize
                  ${statusFilter === status
                    ? 'bg-[#A31F34] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {status === 'all' ? 'All' : status}{status !== 'all' && ` (${publications.filter(p => p.status === status).length})`}
              </button>
            ))}
          </div>

          {/* Topic tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                    ${activeFilters.has(tag)
                      ? 'bg-[#A31F34] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tag}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Publication list by year */}
        {sortedYears.map(year => {
          const yearPublications = publicationsByYear[year].filter(filterPublications);
          if (yearPublications.length === 0) return null;

          return (
            <div key={year} className="mb-10">
              <h3 className="text-lg font-semibold text-gray-400 mb-4 font-mono">
                {year}
              </h3>
              <div className="space-y-4">
                {yearPublications.map((pub, index) => (
                  <article
                    key={index}
                    className="group relative bg-white p-5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Status badge */}
                        <div className="flex items-center gap-2 mb-2">
                          {pub.status === 'preprint' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Preprint
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-[#A31F34] transition-colors">
                          {pub.title}
                        </h4>

                        {pub.authors && pub.authors.length > 0 && (
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {pub.authors.map((author, i) => (
                              <span key={i}>
                                {i > 0 && ', '}
                                {formatAuthor(author)}
                              </span>
                            ))}
                          </p>
                        )}

                        <div className="text-sm text-gray-400 mt-1.5 flex items-center gap-1">
                          <span className="italic">{pub.journal}</span>
                          {pub.doi && (
                            <>
                              <span className="mx-1">·</span>
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#A31F34] hover:underline inline-flex items-center gap-0.5"
                              >
                                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                DOI
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Year badge for quick scan */}
                      <span className="hidden sm:block text-sm font-mono text-gray-300 shrink-0">
                        {pub.year}
                      </span>
                    </div>

                    {/* Tags */}
                    {pub.tags && pub.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-50">
                        {pub.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs text-gray-500 bg-gray-50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400">
          {publications.length} publications · Updated via ORCID
        </div>
      </div>
    </div>
  );
}

export default Publications;
