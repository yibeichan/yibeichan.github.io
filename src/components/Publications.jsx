function Publications() {
  const publications = [
    {
      title: "Neural correlates of decision-making under uncertainty",
      authors: "Chen, Y., et al.",
      journal: "Nature Neuroscience",
      year: "2023",
      doi: "10.1038/s41593-023-1234-5"
    },
    {
      title: "Cognitive control networks in the human brain",
      authors: "Chen, Y., et al.",
      journal: "Neuron",
      year: "2022",
      doi: "10.1016/j.neuron.2022.56789"
    },
    {
      title: "Learning mechanisms in the prefrontal cortex",
      authors: "Chen, Y., et al.",
      journal: "Science",
      year: "2021",
      doi: "10.1126/science.2021.12345"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Publications</h2>
      <div className="space-y-6">
        {publications.map((pub, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{pub.title}</h3>
            <p className="text-gray-600">{pub.authors}</p>
            <p className="text-gray-500">{pub.journal}, {pub.year}</p>
            <p className="text-blue-600 hover:underline cursor-pointer">DOI: {pub.doi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Publications