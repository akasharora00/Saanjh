import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950/50 text-slate-400 border-t border-slate-850/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-slate-850/80 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/10">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                UniSphere
              </h2>
            </div>
            <p className="mt-6 leading-relaxed text-sm text-slate-400">
              Connecting students, faculty and administration through one modern digital campus platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="hover:text-blue-500 transition duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-500 transition duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-blue-500 transition duration-200">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">📚 Notes Sharing</li>
              <li className="flex items-center gap-2">📢 Announcements</li>
              <li className="flex items-center gap-2">📅 Events Tracker</li>
              <li className="flex items-center gap-2">📝 Course Materials</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <p>📧 support@unisphere.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Chitkara University</p>
            </div>

            <div className="flex gap-3 mt-6">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-550 transition flex items-center justify-center cursor-pointer text-sm">
                🌐
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-550 transition flex items-center justify-center cursor-pointer text-sm">
                📷
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-550 transition flex items-center justify-center cursor-pointer text-sm">
                💼
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-850 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} UniSphere. All rights reserved.
          </p>

          <div className="flex gap-6 font-semibold">
            <Link className="hover:text-blue-500 transition" to="/login">
              Login
            </Link>
            <Link className="hover:text-blue-500 transition" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;