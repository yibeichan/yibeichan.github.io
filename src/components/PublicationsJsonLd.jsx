import React from 'react';

export default function PublicationsJsonLd({ publications = [], limit = 50 }) {
  const SITE_URL = 'https://yibeichen.me';
  const items = (publications || []).slice(0, limit).map((pub) => {
    const doiUrl = pub?.doi ? `https://doi.org/${pub.doi}` : undefined;
    const url = pub?.url || doiUrl;

    const obj = {
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      headline: pub?.title,
      name: pub?.title,
      author: Array.isArray(pub?.authors)
        ? pub.authors.filter(Boolean).map((name) => ({ '@type': 'Person', name }))
        : undefined,
      datePublished: pub?.year && /\d{4}/.test(String(pub.year)) ? String(pub.year) : undefined,
      isPartOf: pub?.journal ? { '@type': 'Periodical', name: pub.journal } : undefined,
      identifier: pub?.doi
        ? { '@type': 'PropertyValue', propertyID: 'DOI', value: pub.doi }
        : undefined,
      sameAs: doiUrl || undefined,
      url: url || undefined,
      mainEntityOfPage: `${SITE_URL}/publications`,
    };

    // Remove undefined keys for a clean payload
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
  });

  const payload = JSON.stringify(items.length === 1 ? items[0] : items);

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: payload }} />
  );
}

