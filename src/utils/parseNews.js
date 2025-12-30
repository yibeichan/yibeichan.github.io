export function parseNewsMarkdown(md) {
  if (!md) return [];
  const lines = md
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const items = [];
  for (const line of lines) {
    // Accept formats like:
    // - 2025-10-01: Text ... [link](https://...)
    // - 2025-10-01 [pinned]: Text ...
    // - * 2025-10-01 — Text ...
    const cleaned = line.replace(/^[-*]\s*/, '');

    // Capture date, optional [pinned], and the rest
    const m = cleaned.match(/^(\d{4}-\d{2}-\d{2})(?:\s*\[pinned\])?\s*[:—-]\s*(.*)$/i);
    const pinned = /\[pinned\]/i.test(cleaned);

    if (!m) {
      // If no match, try simple split on first space for date
      const maybeDate = cleaned.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(maybeDate)) {
        items.push({ date: maybeDate, text: cleaned.slice(10).replace(/^[:—-]\s*/, ''), pinned: false });
      }
      continue;
    }

    const [, date, rest] = m;
    // Extract first markdown link URL if present
    const linkMatch = rest.match(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/);
    const url = linkMatch ? linkMatch[1] : undefined;
    const text = rest.replace(/\s*\[[^\]]+\]\(https?:\/\/[^)\s]+\)/, '').trim();

    items.push({ date, text, url, pinned });
  }

  return items;
}

export function sortNews(items) {
  return [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });
}

