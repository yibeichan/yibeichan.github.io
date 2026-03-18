import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://yibeichen.me';
const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

async function build() {
  const distDir = path.join(process.cwd(), 'dist');
  try {
    await fs.access(distDir);
  } catch {
    console.warn('dist/ not found. Run `npm run build` before generating llms.txt.');
    return;
  }

  let blogIndex;
  try {
    blogIndex = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/blogIndex.json'), 'utf-8'));
  } catch {
    blogIndex = { posts: [] };
  }

  // --- llms.txt ---
  const lines = [
    '# Yibei Chen',
    '',
    '> Researcher working on neuroimaging, reproducibility, and open-source scientific software.',
    '',
    '## Blog: Random Seeds',
    '',
  ];

  for (const post of blogIndex.posts) {
    lines.push(`- [${post.title}](${BASE_URL}/blog/${post.slug}): ${post.summary}`);
  }

  lines.push('', '## Links', '');
  lines.push(`- [Research](${BASE_URL}/research)`);
  lines.push(`- [Publications](${BASE_URL}/publications)`);
  lines.push(`- [Software](${BASE_URL}/softwares)`);
  lines.push(`- [GitHub](https://github.com/yibeichan)`);
  lines.push(`- [Google Scholar](https://scholar.google.com/citations?user=TnalNNUAAAAJ&hl=en)`);
  lines.push('');

  await fs.writeFile(path.join(distDir, 'llms.txt'), lines.join('\n'));
  console.log('llms.txt written');

  // --- llms-full.txt ---
  const fullParts = ['# Yibei Chen — Full Blog Content\n'];

  for (const post of blogIndex.posts) {
    let markdown = '';
    try {
      const raw = await fs.readFile(path.join(CONTENT_DIR, `${post.slug}.md`), 'utf-8');
      const { content } = matter(raw);
      markdown = content.trim();
    } catch {
      markdown = '(content not available)';
    }

    fullParts.push(`---\n\n## ${post.title}\n\nDate: ${post.date}\nURL: ${BASE_URL}/blog/${post.slug}\n\n${markdown}\n`);
  }

  await fs.writeFile(path.join(distDir, 'llms-full.txt'), fullParts.join('\n'));
  console.log('llms-full.txt written');
}

build();
