import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>

              <h2 className="text-2xl font-bold text-white">
                Saanjh
              </h2>

            </div>

            <p className="mt-6 leading-7 text-gray-400">
              Connecting students, faculty and administration
              through one modern digital campus platform.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="#about"
                  className="hover:text-violet-400 duration-300"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="hover:text-violet-400 duration-300"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#testimonials"
                  className="hover:text-violet-400 duration-300"
                >
                  Testimonials
                </a>
              </li>

            </ul>

          </div>

          {/* Services */}

          <div>

            <h3 className="text-white font-semibold text-lg mb-5">
              Platform
            </h3>

            <ul className="space-y-3">

              <li>📚 Notes Sharing</li>

              <li>📢 Announcements</li>

              <li>📅 Events</li>

              <li>📝 Assignments</li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-white font-semibold text-lg mb-5">
              Contact
            </h3>

            <p>📧 support@saanjh.com</p>

            <p className="mt-3">📞 +91 98765 43210</p>

            <p className="mt-3">
              📍 Chitkara University
            </p>

            <div className="flex gap-4 mt-6">

              <div className="w-10 h-10 rounded-full bg-slate-800 hover:bg-violet-600 transition flex items-center justify-center cursor-pointer">
                🌐
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-800 hover:bg-violet-600 transition flex items-center justify-center cursor-pointer">
                📷
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-800 hover:bg-violet-600 transition flex items-center justify-center cursor-pointer">
                💼
              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-500">
            © {new Date().getFullYear()} Saanjh. All rights reserved.
          </p>

          <div className="flex gap-6">

            <Link
              className="hover:text-violet-400"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="hover:text-violet-400"
              to="/register"
            >
              Register
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;