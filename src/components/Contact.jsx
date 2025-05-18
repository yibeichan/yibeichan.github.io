import { socialLinks } from '../data/socialLinks';

function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Send a Message</h2>
          <form 
            action="https://formsubmit.co/naturalisticbrain@gmail.com" 
            method="POST"
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="h-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34]"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="h-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34]"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="h-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34]"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A31F34] focus:ring-[#A31F34]"
              ></textarea>
            </div>

            {/* Honeypot field to prevent spam */}
            <input type="text" name="_honey" style={{ display: 'none' }} />
            
            {/* Disable captcha */}
            <input type="hidden" name="_captcha" value="false" />
            
            {/* Specify redirect after submission */}
            <input type="hidden" name="_next" value="https://yibei-chen.github.io/contact?submitted=true" />
            
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-[#A31F34] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A31F34] transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Connect on Social Media</h2>
          <div className="flex flex-col gap-4">
            {socialLinks.map(link => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm group"
              >
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-full mr-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: link.color }}
                >
                  <img 
                    src={link.icon} 
                    alt={link.name} 
                    className="w-5 h-5"
                    style={{ filter: 'invert(1) brightness(200%)' }}
                  />
                </div>
                <span className="text-gray-700 group-hover:text-gray-900">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Form submission success message */}
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('submitted') === 'true' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
            <p>Your message has been sent. I will get back to you soon.</p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="mt-4 px-4 py-2 bg-[#A31F34] text-white rounded hover:bg-opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;