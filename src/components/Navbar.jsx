import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Research', url: '/research' },
    { name: 'Publications', url: '/publications' },
    { name: 'Software', url: '/softwares' },
    { name: 'CV', url: '/cv' },
    { name: 'Contact', url: '/contact' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4">
                <span className={`font-serif text-lg ${location.pathname === '/' ? 'text-[#A31F34]' : 'text-[#8A8B8C] hover:text-[#A31F34]'} transition duration-300`}>
                  About
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                className={`py-4 px-2 font-serif ${location.pathname === item.url ? 'text-[#A31F34]' : 'text-[#8A8B8C] hover:text-[#A31F34]'} transition duration-300`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="outline-none mobile-menu-button">
              <svg
                className="w-6 h-6 text-gray-500 hover:text-[#A31F34]"
                x-show="!isOpen"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            className={`block py-2 px-4 text-sm font-serif ${location.pathname === item.url ? 'text-[#A31F34]' : 'text-[#8A8B8C] hover:text-[#A31F34]'} transition duration-300`}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
