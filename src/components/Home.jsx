import { Link } from 'react-router-dom';
import { socialLinks } from '../data/socialLinks';

function Home() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto w-full py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="md:w-1/3 space-y-6">
            <div className="relative w-full aspect-square rounded-lg shadow-lg overflow-hidden">
              <img
                src="/images/headshot.jpg"
                alt="Yibei Chen"
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

            {/* Social Icons */}
            <div className="flex justify-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
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
          <div className="md:w-2/3">
            <div className="text-gray-700 leading-relaxed space-y-4 mb-8">
              <p>
                At MIT, I study how the brain processes natural communication: how we perceive, interpret, and respond to the world around us. I use neuroimaging and computational methods to study brain dynamics during naturalistic experiences, especially when people watch videos or play games in an fMRI scanner. My work brings together social and cognitive neuroscience, communication science, and data-driven research. I also design open-source tools that support transparent, reproducible science, because I believe good research should be accessible, collaborative, and built for long-term impact.
              </p>
              <p>
                This focus grew out of years spent asking how environments shape behavior. With a foundation in computational social science, I examine both the structures that surround us and the ways we act within them. Whether analyzing discourse, mapping media effects, or modeling decision-making, I have always been drawn to the tension between individual agency and systemic influence.
              </p>
              <p>
                That curiosity first took shape at Wuhan University, where I trained as a journalist. I then turned to health communication during my master's at Fudan University, driven by the pressing public health needs in China at the time. These early experiences taught me how powerfully information can shape lives, and how critical it is to understand the systems behind it. At UC Santa Barbara, I brought those questions into the lab, combining communication research with neuroscience to study how people navigate messages on both cognitive and neural levels.
              </p>
              <p>
                Across every step, my goal has remained the same: to understand how people make sense of their worlds, and to build tools that help others explore those questions too.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-4 justify-end">
              <Link 
                to="/research" 
                className="px-6 py-2 bg-[#A31F34] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Research
              </Link>
              <Link 
                to="/publications" 
                className="px-6 py-2 bg-[#A31F34] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Publications
              </Link>
              <Link 
                to="/softwares" 
                className="px-6 py-2 bg-[#A31F34] text-white rounded-lg hover:bg-opacity-90 transition-colors"
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