import { researchAreas } from '../data/researchAreas';
import { CodeBracketIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import PageHelmet from './PageHelmet';
import { Link } from 'react-router-dom';

function Research() {
  return (
    <div>
      <PageHelmet
        title="Research"
        description="Research spanning neuroimaging, reproducibility, and computational social science."
        path="/research"
      />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-serif mb-6">
            Research
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            I study how the brain makes sense of the world — during stories, games, and real-life
            experiences. I also build open-source tools that make science more reproducible.
          </p>
        </div>
      </div>

      {/* Research Areas */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-16">
          {researchAreas.map((area) => (
            <section key={area.id}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-3">{area.title}</h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl">{area.description}</p>
              </div>

              <div className="space-y-4">
                {area.projects.map((project, index) => (
                  <article
                    key={index}
                    className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      {project.image && (
                        <div className="md:w-64 shrink-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-5">
                        {project.tags && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#A31F34] bg-opacity-10 text-[#A31F34]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="text-lg font-semibold text-gray-900 font-serif mb-2 group-hover:text-[#A31F34] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4">
                          {project.paper && (
                            <a
                              href={project.paper}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-[#A31F34] hover:underline font-medium"
                            >
                              <DocumentTextIcon className="w-4 h-4" />
                              Paper
                            </a>
                          )}
                          {project.code && (
                            <a
                              href={project.code}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-[#A31F34] hover:underline font-medium"
                            >
                              <CodeBracketIcon className="w-4 h-4" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Link to full publications list */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 text-[#A31F34] hover:underline font-medium text-lg group"
          >
            View all publications
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Research;
