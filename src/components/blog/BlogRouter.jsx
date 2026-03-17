import { Routes, Route } from 'react-router-dom';
import BlogFeed from './BlogFeed';
import BlogPost from './BlogPost';
import BlogTagIndex from './BlogTagIndex';
import BlogTagPosts from './BlogTagPosts';
import BlogArchive from './BlogArchive';

export default function BlogRouter() {
  return (
    <Routes>
      <Route index element={<BlogFeed />} />
      <Route path=":slug" element={<BlogPost />} />
      <Route path="tags" element={<BlogTagIndex />} />
      <Route path="tags/:tag" element={<BlogTagPosts />} />
      <Route path="archive" element={<BlogArchive />} />
    </Routes>
  );
}
