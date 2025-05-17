import { useState, useEffect } from 'react';

function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/src/data/publications.json')
      .then(response => response.json())
      .then(data => {
        setPublications(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load publications');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#A31F34] mb-8">Publications</h2>
        <div className="text-[#8A8B8C]">Loading publications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#A31F34] mb-8">Publications</h2>
        <div className="text-[#8A8B8C]">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#A31F34] mb-8">Publications</h2>
      <div className="space-y-6">
        {publications.map((pub, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-[#A31F34] mb-2">{pub.title}</h3>
            <p className="text-[#8A8B8C]">{pub.authors.join(', ')}</p>
            <p className="text-[#8A8B8C]">{pub.journal}, {pub.year}</p>
            {pub.doi && (
              <a 
                href={`https://doi.org/${pub.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A31F34] hover:underline cursor-pointer"
              >
                DOI: {pub.doi}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Publications;