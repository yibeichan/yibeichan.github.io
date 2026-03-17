import { useParams, Link } from 'react-router-dom';
import PageHelmet from '../PageHelmet';
import BlogPostCard from './BlogPostCard';
import blogData from '../../data/blogIndex.json';

export default function BlogTagPosts() {
  const { tag } = useParams();
  const posts = blogData.posts.filter(p => p.tags.includes(tag));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHelmet
        title={`Posts tagged "${tag}"`}
        description={`Blog posts tagged with "${tag}".`}
        path={`/blog/tags/${tag}`}
      />

      <div className="text-sm text-gray-500 mb-6">
        <Link to="/blog" className="text-[#A31F34] hover:text-opacity-80">Blog</Link>
        <span className="mx-2">/</span>
        <Link to="/blog/tags" className="text-[#A31F34] hover:text-opacity-80">Tags</Link>
        <span className="mx-2">/</span>
        <span>{tag}</span>
      </div>

      <h1 className="text-3xl font-bold text-black font-serif mb-8">
        Posts tagged &ldquo;{tag}&rdquo;
      </h1>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <BlogPostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-gray-500">No posts with this tag.</p>
        )}
      </div>
    </div>
  );
}
