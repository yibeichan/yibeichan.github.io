import { researchAreas } from '../data/researchAreas';
import { CodeBracketIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function Research() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-serif mb-6">
              Research Highlights
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              My research spans neuroimaging, research methods, and computational social science, with a focus on understanding human cognition and behavior through innovative methodological approaches.
            </p>
          </div>
        </div>
      </div>

      {/* Research Areas */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {researchAreas.map((area) => (
            <div key={area.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 font-serif">{area.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{area.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {area.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        {project.tags && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#A31F34] bg-opacity-30 text-[#A31F34]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 font-serif">{project.title}</h4>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="flex space-x-4">
                          {project.paper && (
                            <a
                              href={project.paper}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[#A31F34] hover:text-opacity-80 transition-colors"
                            >
                              <DocumentTextIcon className="w-5 h-5 mr-1" />
                              Paper
                            </a>
                          )}
                          {project.code && (
                            <a
                              href={project.code}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[#A31F34] hover:text-opacity-80 transition-colors"
                            >
                              <CodeBracketIcon className="w-5 h-5 mr-1" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Research;