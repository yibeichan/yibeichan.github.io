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

  const filteredPosts = blogData.posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = activeFilters.size === 0 ||
      post.tags.some(tag => activeFilters.has(tag));

    return matchesSearch && matchesTags;
  });

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
    <div className="max-w-4xl mx-auto px-4 py-8">
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
            {(searchTerm || activeFilters.size > 0) && (
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

      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <BlogPostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}
