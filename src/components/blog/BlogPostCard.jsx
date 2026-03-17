import { Link } from 'react-router-dom';

export default function BlogPostCard({ post }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
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

      <Link to={`/blog/${post.slug}`} className="group">
        <h3 className="text-lg font-semibold text-gray-900 font-serif group-hover:text-[#A31F34] transition-colors">
          {post.title}
        </h3>
      </Link>

      <div className="text-gray-500 mt-2 text-sm">
        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        <span className="mx-2">·</span>
        {post.readingTime} min read
      </div>

      {post.summary && (
        <p className="text-gray-700 mt-3">{post.summary}</p>
      )}
    </div>
  );
}
