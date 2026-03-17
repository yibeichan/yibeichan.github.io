import fs from 'fs/promises';
import path from 'path';

const BASE_URL = process.env.SITE_URL || 'https://yibeichen.me';
const ROUTES = ['/', '/research', '/publications', '/softwares', '/cv', '/contact', '/blog', '/blog/tags', '/blog/archive'];

function url(loc, priority = '0.7', changefreq = 'weekly') {
  return `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function build() {
  const distDir = path.join(process.cwd(), 'dist');
  try {
    await fs.access(distDir);
  } catch {
    console.warn('dist/ not found. Run `npm run build` before generating sitemap.');
    return;
  }

  // Add blog post URLs from the blog index
  let blogRoutes = [];
  try {
    const blogIndex = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/blogIndex.json'), 'utf-8'));
    blogRoutes = blogIndex.posts.map(p => `/blog/${p.slug}`);
  } catch {
    // Blog index may not exist yet
  }

  const items = [...ROUTES, ...blogRoutes].map((r) => url(r === '/' ? '/' : r));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    items.join('\n') +
    `\n</urlset>\n`;

  const out = path.join(distDir, 'sitemap.xml');
  await fs.writeFile(out, xml);
  console.log(`Sitemap written to ${out}`);
}

build();
