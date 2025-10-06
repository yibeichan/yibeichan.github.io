import PageHelmet from './PageHelmet';
import newsMd from '../data/news.md?raw';
import { parseNewsMarkdown, sortNews } from '../utils/parseNews';

function formatDateMMDDYYYY(isoDate) {
  try {
    const d = new Date(isoDate);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    if (Number.isNaN(yyyy)) return isoDate;
    return `${mm}/${dd}/${yyyy}`;
  } catch {
    return isoDate;
  }
}

function isNew(isoDate, days = 30) {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return false;
  return now - then <= days * 24 * 60 * 60 * 1000;
}

function sortNews(items) {
  return [...items].sort((a, b) => {
    // pinned first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // then by date desc
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });
}

export default function News({ limit }) {
  const parsed = parseNewsMarkdown(newsMd);
  const sorted = sortNews(parsed);
  const sliced = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!limit && (
        <PageHelmet
          title="News"
          description="Latest updates, talks, and activities."
          path="/news"
        />
      )}

      {!limit && (
        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-6">News</h1>
      )}

      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
        {sliced.map((item, idx) => (
          <li key={idx} className="p-4 flex items-start gap-3">
            <span className="font-mono text-gray-600 min-w-[7.5rem]">{formatDateMMDDYYYY(item.date)}</span>
            <div className="flex-1 text-gray-800">
              <span>
                {item.text}
                {item.url && (
                  <>
                    {" "}
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#A31F34] hover:text-opacity-80 underline">
                      link
                    </a>
                  </>
                )}
              </span>
              {isNew(item.date) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#A31F34] bg-opacity-20 text-[#A31F34]">New</span>
              )}
            </div>
          </li>
        ))}
        {sliced.length === 0 && (
          <li className="p-4 text-gray-500">No news yet.</li>
        )}
      </ul>
    </div>
  );
}
