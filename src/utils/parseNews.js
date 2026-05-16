export function parseNewsMarkdown(md) {
  if (!md) return [];
  const lines = md
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('<!--'));

  const items = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-*]\s*/, '');
    const m = cleaned.match(/^(\d{4}-\d{2}-\d{2})(?:\s*\[pinned\])?\s*[:—-]\s*(.*)$/i);
    if (!m) continue;

    const [, date, rest] = m;
    const pinned = /\[pinned\]/i.test(cleaned);
    // Split date from text — keep the rest as-is (including markdown links)
    items.push({ date, text: rest.trim(), pinned });
  }
  return items;
}

export function sortNews(items) {
  return [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });
}
