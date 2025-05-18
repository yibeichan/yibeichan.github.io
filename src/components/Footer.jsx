function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">    
        <p className="text-center text-base text-gray-400">
          &copy; {currentYear} Yibei Chen. All rights reserved. Created with{' '}
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#A31F34] hover:text-opacity-80"
          >
            Bolt.new
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;