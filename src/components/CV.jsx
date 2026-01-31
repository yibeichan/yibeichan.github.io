import React from 'react';
import PageHelmet from './PageHelmet';

function CV() {
  // Use the correct document ID
  const DOC_ID = "1G3Db4IXZNZl0PTRIeqW-Zq937CR8r6thRJDIeOTd_Js";
  // Correct format for embedded viewing
  const EMBED_URL = `https://docs.google.com/document/d/${DOC_ID}/preview`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PageHelmet title="CV" description="Curriculum Vitae of Yibei Chen." path="/cv" />
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
