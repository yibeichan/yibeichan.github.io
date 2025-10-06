import { Link } from 'react-router-dom';
import PageHelmet from './PageHelmet';
import { socialLinks } from '../data/socialLinks';

function Home() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center p-4 sm:px-4">
      <PageHelmet
        title="About"
        description="About Yibei Chen: research interests, affiliations, and links."
        path="/"
      />
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/4 lg:w-1/5 flex flex-col items-center md:items-stretch">
            <div className="space-y-6 w-full max-w-xs md:max-w-none">
              <div className="relative w-full aspect-square rounded-lg shadow-lg overflow-hidden">
                <img
                  src="/images/headshot.jpg"
                  alt="Yibei Chen"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Yibei Chen, Ph.D.</h1>
                <div className="space-y-1">
                  <p className="text-lg">Postdoctoral Associate</p>
                  <p className="text-lg">
                    <a 
                      href="https://sensein.group/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#A31F34] hover:underline"
                    >
                      Senseable Intelligence Group
                    </a>
                  </p>
                  <p className="text-base">
                    <a 
                      href="https://mcgovern.mit.edu/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#00629b] hover:underline"
                    >
                      McGovern Institute for Brain Research
                    </a>
                  </p>
                  <p className="text-base">
                    <a 
                      href="https://www.mit.edu/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600"
                    >
                      MIT
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons: mt-auto pushes to bottom, py-2 for padding */}
            <div className="flex justify-center space-x-3 sm:space-x-4 mt-6 md:mt-auto py-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300"
                  style={{ backgroundColor: link.color }}
                  title={link.name}
                >
                  <img
                    src={link.icon}
                    alt={link.name}
                    className="w-5 h-5 invert"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col">
            <div className="text-gray-700 leading-relaxed space-y-4 mb-4 md:mb-2 flex-grow">
              <p className="text-sm sm:text-base">
                At MIT, I study how the brain processes natural communication: how we perceive, interpret, and respond to the world around us. I use neuroimaging and computational methods to study brain dynamics during naturalistic experiences, especially when people watch videos or play games in an fMRI scanner. My work brings together social and cognitive neuroscience, communication science, and data-driven research. I also design open-source tools that support transparent, reproducible science, because I believe good research should be accessible, collaborative, and built for long-term impact.
              </p>
              <p className="text-sm sm:text-base">
                This focus grew out of years spent asking how environments shape behavior. With a foundation in computational social science, I examine both the structures that surround us and the ways we act within them. Whether analyzing discourse, mapping media effects, or modeling decision-making, I have always been drawn to the tension between individual agency and systemic influence.
              </p>
              <p className="text-sm sm:text-base">
                That curiosity first took shape at Wuhan University, where I trained as a journalist. I then turned to health communication during my master's at Fudan University, driven by the pressing public health needs in China at the time. These early experiences taught me how powerfully information can shape lives, and how critical it is to understand the systems behind it. At UC Santa Barbara, I brought those questions into the lab, combining communication research with neuroscience to study how people navigate messages on both cognitive and neural levels.
              </p>
              <p className="text-sm sm:text-base">
                Across every step, my goal has remained the same: to understand how people make sense of their worlds, and to build tools that help others explore those questions too.
              </p>
            </div>

            {/* Navigation Links: Removed pt-4 */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-end mt-4 sm:mt-0">
              <Link
                to="/research"
                className="w-full sm:w-auto text-center px-6 py-2 bg-[#A31F34] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Research
              </Link>
              <Link
                to="/publications"
                className="w-full sm:w-auto text-center px-6 py-2 bg-[#A31F34] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Publications
              </Link>
              <Link
                to="/softwares"
                className="w-full sm:w-auto text-center px-6 py-2 bg-[#A31F34] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Software
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
