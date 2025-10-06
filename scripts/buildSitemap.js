import fs from 'fs/promises';
import path from 'path';

const BASE_URL = process.env.SITE_URL || 'https://yibeichen.me';
const ROUTES = ['/', '/research', '/publications', '/softwares', '/cv', '/contact'];

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

  const items = ROUTES.map((r) => url(r === '/' ? '/' : r));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    items.join('\n') +
    `\n</urlset>\n`;

  const out = path.join(distDir, 'sitemap.xml');
  await fs.writeFile(out, xml);
  console.log(`Sitemap written to ${out}`);
}

build();
