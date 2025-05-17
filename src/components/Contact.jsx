function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
          <p className="text-gray-600">yibeichen@mit.edu</p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Office</h3>
          <p className="text-gray-600">McGovern Institute for Brain Research</p>
          <p className="text-gray-600">Massachusetts Institute of Technology</p>
          <p className="text-gray-600">43 Vassar Street</p>
          <p className="text-gray-600">Cambridge, MA 02139</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Social Media</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-600 hover:underline">Twitter</a>
            <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
            <a href="#" className="text-blue-600 hover:underline">Google Scholar</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact