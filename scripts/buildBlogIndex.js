import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/blogIndex.json');

async function buildBlogIndex() {
  let files;
  try {
    files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.md'));
  } catch {
    console.log('No content/blog directory found. Creating empty blog index.');
    await fs.writeFile(OUTPUT_PATH, JSON.stringify({ posts: [], tags: {}, similarPosts: {} }, null, 2));
    return;
  }

  if (files.length === 0) {
    console.log('No blog posts found. Creating empty blog index.');
    await fs.writeFile(OUTPUT_PATH, JSON.stringify({ posts: [], tags: {}, similarPosts: {} }, null, 2));
    return;
  }

  const posts = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
    const { data: frontmatter, content } = matter(raw);

    if (frontmatter.draft) continue;

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const html = marked(content);

    posts.push({
      slug: frontmatter.slug || file.replace(/\.md$/, ''),
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      summary: frontmatter.summary || '',
      readingTime,
      html,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Compute tag counts
  const tags = {};
  for (const post of posts) {
    for (const tag of post.tags) {
      tags[tag] = (tags[tag] || 0) + 1;
    }
  }

  // Compute similar posts (by shared tags, top 3)
  const similarPosts = {};
  for (const post of posts) {
    const scores = posts
      .filter(p => p.slug !== post.slug)
      .map(p => {
        const shared = post.tags.filter(t => p.tags.includes(t)).length;
        return { slug: p.slug, title: p.title, date: p.date, score: shared };
      })
      .filter(s => s.score >= 1)
      .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    if (scores.length > 0) {
      similarPosts[post.slug] = scores;
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify({ posts, tags, similarPosts }, null, 2));
  console.log(`Blog index built: ${posts.length} posts, ${Object.keys(tags).length} tags`);
}

buildBlogIndex();
