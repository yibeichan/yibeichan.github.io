import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4">
                <span className="font-semibold text-gray-500 text-lg">Yibei Chen</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Link to="/" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Home</Link>
            <Link to="/research" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Research</Link>
            <Link to="/publications" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Publications</Link>
            <Link to="/contact" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar