import { Link } from 'react-router-dom';
import PageHelmet from '../PageHelmet';
import blogData from '../../data/blogIndex.json';

export default function BlogTagIndex() {
  const sortedTags = Object.entries(blogData.tags)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHelmet
        title="Blog Tags"
        description="Browse blog posts by topic."
        path="/blog/tags"
      />

      <Link to="/blog" className="text-sm text-[#A31F34] hover:text-opacity-80 mb-6 inline-block">
        &larr; Back to blog
      </Link>

      <h1 className="text-3xl font-bold text-black font-serif mb-8">Tags</h1>

      {sortedTags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {sortedTags.map(([tag, count]) => (
            <Link
              key={tag}
              to={`/blog/tags/${tag}`}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-[#A31F34] hover:bg-[#A31F34] hover:text-white transition-colors"
            >
              {tag}
              <span className="ml-2 text-xs opacity-60">({count})</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tags yet.</p>
      )}
    </div>
  );
}
