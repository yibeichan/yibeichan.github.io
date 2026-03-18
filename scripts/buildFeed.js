import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://yibeichen.me';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function build() {
  const distDir = path.join(process.cwd(), 'dist');
  try {
    await fs.access(distDir);
  } catch {
    console.warn('dist/ not found. Run `npm run build` before generating feed.');
    return;
  }

  let blogIndex;
  try {
    blogIndex = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/blogIndex.json'), 'utf-8'));
  } catch {
    blogIndex = { posts: [] };
  }

  const updated = blogIndex.posts.length > 0
    ? new Date(blogIndex.posts[0].date).toISOString()
    : new Date().toISOString();

  const entries = blogIndex.posts.map(post => {
    const postDate = new Date(post.date).toISOString();
    const postUrl = `${BASE_URL}/blog/${post.slug}`;
    return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl}" rel="alternate" />
    <id>${postUrl}</id>
    <updated>${postDate}</updated>
    <summary>${escapeXml(post.summary)}</summary>
    <content type="html"><![CDATA[${post.html}]]></content>
  </entry>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Random Seeds</title>
  <subtitle>Blog by Yibei Chen</subtitle>
  <link href="${BASE_URL}/feed.xml" rel="self" />
  <link href="${BASE_URL}/" rel="alternate" />
  <id>${BASE_URL}/</id>
  <updated>${updated}</updated>
  <author>
    <name>Yibei Chen</name>
  </author>
${entries.join('\n')}
</feed>
`;

  await fs.writeFile(path.join(distDir, 'feed.xml'), xml);
  console.log('feed.xml written');
}

build();
