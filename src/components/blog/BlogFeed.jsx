import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHelmet from '../PageHelmet';
import BlogPostCard from './BlogPostCard';
import blogData from '../../data/blogIndex.json';

export default function BlogFeed() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(new Set());

  const allTags = Object.entries(blogData.tags)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const isFiltering = searchTerm !== '' || activeFilters.size > 0;

  const filteredPosts = blogData.posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = activeFilters.size === 0 ||
      post.tags.some(tag => activeFilters.has(tag));

    return matchesSearch && matchesTags;
  });

  const latestPost = !isFiltering && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = !isFiltering ? filteredPosts.slice(1) : filteredPosts;

  // Group all posts by year for the archive sidebar
  const postsByYear = blogData.posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
  const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);

  const toggleFilter = (tag) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHelmet
        title="Blog"
        description="Thoughts on neuroscience, open-source software, and reproducible science by Yibei Chen."
        path="/blog"
      />

      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-3xl font-bold text-black font-serif">Blog</h1>
        <div className="flex gap-4 text-sm">
          <Link to="/blog/tags" className="text-[#A31F34] hover:text-opacity-80">All tags</Link>
          <Link to="/blog/archive" className="text-[#A31F34] hover:text-opacity-80">Archive</Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34] py-3 px-4 bg-gray-50"
        />

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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
            {isFiltering && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-opacity-90 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {filteredPosts.length === 0 && (
            <p className="text-gray-500">No posts found.</p>
          )}

          {/* Hero card for latest post */}
          {latestPost && (
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
              <div className="p-8">
                {latestPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {latestPost.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/blog/tags/${tag}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#A31F34] bg-opacity-30 text-[#A31F34] hover:bg-opacity-50 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                <Link to={`/blog/${latestPost.slug}`} className="group">
                  <h2 className="text-2xl font-bold text-gray-900 font-serif group-hover:text-[#A31F34] transition-colors mb-3">
                    {latestPost.title}
                  </h2>
                </Link>

                <div className="text-gray-500 text-sm mb-4">
                  {new Date(latestPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  <span className="mx-2">·</span>
                  {latestPost.readingTime} min read
                  {latestPost.shoulderline && (
                    <>
                      <span className="mx-2">·</span>
                      <span className="italic">{latestPost.shoulderline}</span>
                    </>
                  )}
                </div>

                {latestPost.summary && (
                  <p className="text-gray-700 text-lg leading-relaxed">{latestPost.summary}</p>
                )}

                <Link
                  to={`/blog/${latestPost.slug}`}
                  className="inline-block mt-4 text-[#A31F34] hover:text-opacity-80 font-medium"
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Remaining posts as smaller cards in grid */}
          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remainingPosts.map(post => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Archive sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Archive</h3>
            {sortedYears.map(year => (
              <div key={year} className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">{year}</h4>
                <ul className="space-y-1">
                  {postsByYear[year].map(post => (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm text-gray-700 hover:text-[#A31F34] transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
