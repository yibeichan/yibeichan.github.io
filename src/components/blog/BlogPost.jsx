import { useParams, Link } from 'react-router-dom';
import PageHelmet from '../PageHelmet';
import BlogPostCard from './BlogPostCard';
import blogData from '../../data/blogIndex.json';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogData.posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black font-serif mb-4">Post not found</h1>
        <Link to="/blog" className="text-[#A31F34] hover:text-opacity-80">Back to blog</Link>
      </div>
    );
  }

  const similar = blogData.similarPosts[slug] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHelmet
        title={post.title}
        description={post.summary}
        path={`/blog/${post.slug}`}
        ogType="article"
      />

      <Link to="/blog" className="text-sm text-[#A31F34] hover:text-opacity-80 mb-6 inline-block">
        &larr; Back to blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black font-serif mb-3">{post.title}</h1>
          <div className="text-gray-500 text-sm">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            <span className="mx-2">·</span>
            {post.readingTime} min read
            {post.shoulderline && (
              <>
                <span className="mx-2">·</span>
                <span className="italic">{post.shoulderline}</span>
              </>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
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
        </header>

        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-[#A31F34] prose-a:no-underline hover:prose-a:text-opacity-80"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      {similar.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-black font-serif mb-6">Similar posts</h2>
          <div className="space-y-4">
            {similar.map(s => {
              const similarPost = blogData.posts.find(p => p.slug === s.slug);
              return similarPost ? (
                <BlogPostCard key={s.slug} post={similarPost} />
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
