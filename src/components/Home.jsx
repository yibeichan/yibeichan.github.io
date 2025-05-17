import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Yibei Chen</h1>
          <p className="text-gray-600 mb-6">
            I am a postdoctoral associate at the{' '}
            <a 
              href="https://mcgovern.mit.edu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#00629b] hover:underline"
            >
              McGovern Institute for Brain Research
            </a>
            {' '}at{' '}
            <a 
              href="https://www.mit.edu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#A31F34] hover:underline"
            >
              MIT
            </a>
            . My research focuses on understanding the neural mechanisms underlying cognitive control and decision-making.
          </p>
          <div className="flex space-x-4">
            <Link to="/research" className="bg-[#A31F34] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-300">View Research</Link>
            <Link to="/publications" className="bg-[#A31F34] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-300">Publications</Link>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg"
            alt="Research"
            className="rounded-lg shadow-lg h-96 w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Home