import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://yibeichen.me';
const DEFAULT_IMAGE = `${SITE_URL}/images/headshot.jpg`;

export default function PageHelmet({ title, fullTitle, description, path = '/', image = DEFAULT_IMAGE }) {
  const computedTitle = fullTitle || (title ? `${title} | Yibei Chen` : 'Yibei Chen');
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <Helmet>
      <title>{computedTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Yibei Chen" />
      <meta property="og:title" content={computedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={computedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
