import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 px-4">
      <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3">ClubSphere</h3>
          <p className="text-gray-600">
            clubSphere is a platform to discover, manage, and join clubs easily.
            Built to connect communities and encourage collaboration.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-gray-600">Email: support@clubsphere.com</p>
          <p className="text-gray-600">Location: Bangladesh</p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-600">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-700"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-500"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t py-4 text-center text-gray-400 text-sm">
        © clubSphere 2025. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
