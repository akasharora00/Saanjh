import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <div>

          <span className="inline-flex items-center bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
            ⚡ Now live at 12+ universities
          </span>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mt-8">
            Connecting Campus,
            <br />
            <span className="text-violet-600">
              Empowering Every Student.
            </span>
          </h1>

          <p className="text-gray-500 text-xl mt-8 leading-9">
            Replace fragmented WhatsApp groups, scattered PDFs,
            and broken ERP portals with one unified platform
            built for modern university life.
          </p>

          <div className="flex gap-5 mt-10">

            <Link
              to="/register"
              className="bg-violet-600 hover:bg-violet-700 transition text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
            >
              Get Started Free →
            </Link>

            <button className="border border-gray-300 hover:bg-gray-100 transition px-8 py-4 rounded-xl font-semibold">
              ▶ Watch Demo
            </button>

          </div>

        </div>

        {/* Right */}

        <div className="relative">

          <div className="rounded-[35px] bg-violet-100 p-5 shadow-xl">

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
              alt="students"
              className="rounded-[25px] w-full h-[500px] object-cover"
            />

          </div>

          {/* Announcement */}

          <div className="absolute -top-4 right-0 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xl">
              🔔
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                New Announcement
              </h3>

              <p className="text-gray-500 text-sm">
                Exam schedule released
              </p>
            </div>

          </div>

          {/* Assignment */}

          <div className="absolute -bottom-6 left-5 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              ✅
            </div>

            <div>
              <h3 className="font-bold">
                Assignment Submitted
              </h3>

              <p className="text-gray-500 text-sm">
                CS301 • Just now
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;