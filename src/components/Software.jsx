import { CodeBracketIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const softwareProjects = [
  {
    title: "ReproSchema",
    description: "A comprehensive framework that standardizes survey data collection across research domains. This tool introduces machine-readable schemas, automated validation, and multilingual support, making research more reproducible and interoperable. The framework addresses critical challenges in data standardization while maintaining flexibility for diverse research needs.",
    image: "https://www.repronim.org/reproschema/img/reproschema_logo.png",
    code: "https://github.com/ReproNim/reproschema",
    paper: "https://doi.org/10.2196/63343",
    status: "Active Development",
    tags: ["Research Tools", "Data Standards", "Open Source"]
  },
  {
    title: "BIDS App Bootstrap (BABS)",
    description: "A containerized ecosystem for neuroimaging analysis that combines the Brain Imaging Data Structure (BIDS) with reproducible computing principles. BABS enables automated processing of large-scale datasets while ensuring computational reproducibility across institutions. The system streamlines complex neuroimaging workflows while maintaining strict version control and documentation.",
    image: "https://raw.githubusercontent.com/PennLINC/babs/main/docs/_static/babs_cli.png",
    code: "https://github.com/PennLINC/babs",
    paper: "https://doi.org/10.1162/imag_a_00074",
    status: "Stable Release",
    tags: ["Neuroimaging", "BIDS", "Workflow Management"]
  }
];

function Section({ children, background = 'white' }) {
  const bgClass = background === 'gray' ? 'bg-gray-50' : 'bg-white';
  
  return (
    <section className={`py-12 md:py-16 lg:py-24 ${bgClass}`}>
      {children}
    </section>
  );
}

function Software() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-24 -mx-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-serif mb-6">
            Open Source Projects
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Building tools and frameworks that advance scientific research through reproducible methods and standardized approaches.
          </p>
        </div>
      </div>

      <Section>
        <div className="space-y-16">
          {softwareProjects.map((project, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '240px' }}>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-contain p-4"
                    style={{ maxHeight: '240px' }}
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A31F34] bg-opacity-30 text-[#A31F34]"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {project.status}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-4">{project.title}</h2>
                <p className="text-gray-600 mb-6">{project.description}</p>
                
                <div className="flex gap-4">
                  <a 
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#A31F34] hover:bg-opacity-90 transition-colors"
                  >
                    <CodeBracketIcon className="w-5 h-5 mr-2" />
                    View Code
                  </a>
                  {project.paper && (
                    <a 
                      href={project.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <DocumentTextIcon className="w-5 h-5 mr-2" />
                      Documentation
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="gray">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-serif mb-4">Want to Contribute?</h2>
          <p className="text-lg text-gray-700 mb-8">
            All projects are open source and welcome contributions. Check out the repositories or get in touch to learn more.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#A31F34] hover:bg-opacity-90 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </Section>
    </div>
  );
}

export default Software;