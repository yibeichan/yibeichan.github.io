import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Client } from '@notionhq/client';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

if (!process.env.NOTION_API_KEY || !databaseId) {
  console.error('NOTION_API_KEY and NOTION_DATABASE_ID must be set');
  process.exit(1);
}

// Notion rich_text blocks have a 2000-char limit
function chunkText(text, maxLen = 2000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

async function findPageBySlug(slug) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  });
  return response.results[0] || null;
}

async function syncPost(frontmatter, content) {
  const { title, date, tags, summary, slug } = frontmatter;

  const properties = {
    Title: { title: [{ text: { content: title } }] },
    Slug: { rich_text: [{ text: { content: slug } }] },
    Date: { date: { start: date } },
    Tags: { multi_select: tags.map(t => ({ name: t })) },
    Summary: { rich_text: [{ text: { content: summary || '' } }] },
    URL: { url: `https://yibeichen.me/blog/${slug}` },
  };

  const contentBlocks = chunkText(content).map(chunk => ({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: chunk } }],
    },
  }));

  const existing = await findPageBySlug(slug);

  if (existing) {
    // Update properties
    await notion.pages.update({
      page_id: existing.id,
      properties,
    });

    // Delete existing content blocks
    const children = await notion.blocks.children.list({ block_id: existing.id });
    for (const block of children.results) {
      await notion.blocks.delete({ block_id: block.id });
    }

    // Add new content blocks
    if (contentBlocks.length > 0) {
      await notion.blocks.children.append({
        block_id: existing.id,
        children: contentBlocks,
      });
    }

    console.log(`Updated: ${title}`);
  } else {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
      children: contentBlocks,
    });
    console.log(`Created: ${title}`);
  }
}

async function main() {
  const files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
    const { data: frontmatter, content } = matter(raw);

    if (frontmatter.draft) {
      console.log(`Skipping draft: ${file}`);
      continue;
    }

    await syncPost(frontmatter, content);
  }

  console.log('Notion sync complete.');
}

main().catch(err => {
  console.error('Notion sync failed:', err.message);
  process.exit(1);
});
