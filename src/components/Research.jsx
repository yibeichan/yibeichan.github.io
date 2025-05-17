function Research() {
  const projects = [
    {
      title: "Neural Mechanisms of Decision Making",
      description: "Investigating how the brain processes information to make decisions under uncertainty.",
      image: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg",
    },
    {
      title: "Cognitive Control Networks",
      description: "Studying the neural networks involved in cognitive control and executive function.",
      image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg",
    },
    {
      title: "Learning and Memory",
      description: "Exploring the mechanisms of learning and memory formation in the brain.",
      image: "https://images.pexels.com/photos/3825578/pexels-photo-3825578.jpeg",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Research Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <div className="mt-4 flex space-x-2">
                <button className="bg-[#A31F34] text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300">View Code</button>
                <button className="bg-[#A31F34] text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300">Documentation</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Research