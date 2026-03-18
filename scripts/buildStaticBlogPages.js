import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://yibeichen.me';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPostPage(post) {
  const url = `${BASE_URL}/blog/${post.slug}`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Yibei Chen', url: BASE_URL },
    keywords: post.tags.join(', '),
    url,
    mainEntityOfPage: url,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(post.title)} | Yibei Chen</title>
  <meta name="description" content="${escapeHtml(post.summary)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Yibei Chen" />
  <meta property="og:title" content="${escapeHtml(post.title)} | Yibei Chen" />
  <meta property="og:description" content="${escapeHtml(post.summary)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${BASE_URL}/images/headshot.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(post.title)} | Yibei Chen" />
  <meta name="twitter:description" content="${escapeHtml(post.summary)}" />
  <meta name="twitter:image" content="${BASE_URL}/images/headshot.jpg" />
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header>
    <nav><a href="${BASE_URL}/">Yibei Chen</a> &middot; <a href="${BASE_URL}/blog">Random Seeds</a></nav>
  </header>
  <main>
    <article>
      <h1>${escapeHtml(post.title)}</h1>
      <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      ${post.tags.length > 0 ? `<p>Tags: ${post.tags.map(t => escapeHtml(t)).join(', ')}</p>` : ''}
      <div>${post.html}</div>
    </article>
  </main>
  <footer><a href="${BASE_URL}/blog">&larr; Back to blog</a></footer>
</body>
</html>
`;
}

function buildIndexPage(posts) {
  const listItems = posts.map(post => {
    const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `    <li>
      <a href="${BASE_URL}/blog/${post.slug}">${escapeHtml(post.title)}</a>
      <br /><small>${date} — ${escapeHtml(post.summary)}</small>
    </li>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Random Seeds | Yibei Chen</title>
  <meta name="description" content="Blog posts by Yibei Chen." />
  <link rel="canonical" href="${BASE_URL}/blog" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Random Seeds | Yibei Chen" />
  <meta property="og:description" content="Blog posts by Yibei Chen." />
  <meta property="og:url" content="${BASE_URL}/blog" />
</head>
<body>
  <header>
    <nav><a href="${BASE_URL}/">Yibei Chen</a></nav>
  </header>
  <main>
    <h1>Random Seeds</h1>
    <ul>
${listItems.join('\n')}
    </ul>
  </main>
</body>
</html>
`;
}

async function build() {
  const distDir = path.join(process.cwd(), 'dist');
  try {
    await fs.access(distDir);
  } catch {
    console.warn('dist/ not found. Run `npm run build` before generating static blog pages.');
    return;
  }

  let blogIndex;
  try {
    blogIndex = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/blogIndex.json'), 'utf-8'));
  } catch {
    blogIndex = { posts: [] };
  }

  if (blogIndex.posts.length === 0) {
    console.log('No blog posts found. Skipping static blog pages.');
    return;
  }

  // Generate individual post pages
  for (const post of blogIndex.posts) {
    const postDir = path.join(distDir, 'blog', post.slug);
    await fs.mkdir(postDir, { recursive: true });
    await fs.writeFile(path.join(postDir, 'index.html'), buildPostPage(post));
  }

  // Generate blog index page
  const blogDir = path.join(distDir, 'blog');
  await fs.mkdir(blogDir, { recursive: true });
  await fs.writeFile(path.join(blogDir, 'index.html'), buildIndexPage(blogIndex.posts));

  console.log(`Static blog pages written: ${blogIndex.posts.length} posts + index`);
}

build();
