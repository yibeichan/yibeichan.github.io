import { Link } from 'react-router-dom';

function Navbar() {
  const navItems = [
    { name: 'Research', url: '/research' },
    { name: 'Publications', url: '/publications' },
    { name: 'Software', url: '/softwares' },
    { name: 'CV', url: '/cv' },
    { name: 'Contact', url: '/contact' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4">
                <span className="font-semibold text-[#8A8B8C] hover:text-[#A31F34] transition duration-300 text-lg">About</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                className="py-4 px-2 text-[#8A8B8C] font-semibold hover:text-[#A31F34] transition duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar