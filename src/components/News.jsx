import { Link } from 'react-router-dom';
import PageHelmet from './PageHelmet';
import newsMd from '../data/news.md?raw';
import { parseNewsMarkdown, sortNews } from '../utils/parseNews';

function formatDate(isoDate) {
  try {
    // Parse as UTC to avoid timezone shift (ISO date-only strings)
    const [y, m] = isoDate.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
  } catch {
    return isoDate;
  }
}

function isNew(isoDate, days = 90) {
  return Date.now() - new Date(isoDate).getTime() <= days * 86400000;
}

export default function News({ limit }) {
  const sorted = sortNews(parseNewsMarkdown(newsMd));
  const items = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!limit && (
        <PageHelmet title="News" description="Latest updates and activities." path="/news" />
      )}
      {!limit && (
        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-6">News</h1>
      )}
      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
        {items.map((item, idx) => (
          <li key={idx} className="p-4 flex items-start gap-3">
            <span className="font-mono text-gray-500 text-sm min-w-[6rem] whitespace-nowrap">
              {formatDate(item.date)}
            </span>
            <div className="flex-1 text-gray-800 text-sm sm:text-base">
              <span dangerouslySetInnerHTML={{
                __html: item.text
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#A31F34] hover:underline">$1</a>')
              }} />
              {isNew(item.date) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#A31F34]/10 text-[#A31F34]">
                  New
                </span>
              )}
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="p-4 text-gray-500">No news yet.</li>
        )}
      </ul>
      {limit && items.length > 0 && (
        <div className="mt-3 text-right">
          <Link to="/news" className="text-sm text-[#A31F34] hover:underline">
            All news →
          </Link>
        </div>
      )}
    </div>
  );
}
