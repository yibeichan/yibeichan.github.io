import React from 'react';
import { Helmet } from 'react-helmet-async';

function CV() {
  // Use the correct document ID
  const DOC_ID = "15RFQpX4Y62YOQIHZLkjakTlXX4eFw40bQLiQVLNj2oY";
  // Correct format for embedded viewing
  const EMBED_URL = `https://docs.google.com/document/d/${DOC_ID}/preview`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>CV | Yibei Chen</title>
        <meta name="description" content="Curriculum Vitae of Yibei Chen." />
        <link rel="canonical" href="https://yibeichen.me/cv" />
      </Helmet>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-4">Curriculum Vitae</h1>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingTop: '129%' }}>
          <iframe 
            src={EMBED_URL}
            className="absolute top-0 left-0 w-full h-full border-0"
            title="Yibei Chen's CV"
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CV;
