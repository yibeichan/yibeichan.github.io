import { Link } from 'react-router-dom';
import PageHelmet from '../PageHelmet';
import blogData from '../../data/blogIndex.json';

export default function BlogArchive() {
  const postsByYear = blogData.posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHelmet
        title="Blog Archive"
        description="Chronological archive of all blog posts."
        path="/blog/archive"
      />

      <Link to="/blog" className="text-sm text-[#A31F34] hover:text-opacity-80 mb-6 inline-block">
        &larr; Back to blog
      </Link>

      <h1 className="text-3xl font-bold text-black font-serif mb-8">Archive</h1>

      {sortedYears.map(year => (
        <div key={year} className="mb-8">
          <h2 className="text-2xl font-semibold text-black pb-2 border-b border-gray-200 font-serif mb-4">
            {year}
          </h2>
          <div className="space-y-3">
            {postsByYear[year].map(post => (
              <div key={post.slug} className="flex items-baseline gap-4">
                <span className="text-gray-400 text-sm whitespace-nowrap">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-gray-900 font-serif hover:text-[#A31F34] transition-colors"
                >
                  {post.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}

      {sortedYears.length === 0 && (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  );
}
