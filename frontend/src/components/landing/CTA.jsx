import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-10 py-20 text-center">

          {/* Decorative circles */}

          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/10"></div>

          {/* Content */}

          <div className="relative z-10 max-w-3xl mx-auto">

            <span className="inline-block bg-white/20 text-white px-5 py-2 rounded-full font-medium mb-6">
              🚀 Join the Digital Campus Revolution
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to transform your
              <br />
              university experience?
            </h2>

            <p className="mt-6 text-lg text-violet-100 leading-8">
              Join thousands of students and faculty already using
              <span className="font-semibold text-white"> Saanjh </span>
              to stay connected, organized and informed.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

              <Link
                to="/register"
                className="bg-white text-violet-700 hover:bg-gray-100 transition px-8 py-4 rounded-xl font-bold shadow-lg"
              >
                Get Started Free
              </Link>

              <Link
                to="/login"
                className="border border-white text-white hover:bg-white hover:text-violet-700 transition px-8 py-4 rounded-xl font-bold"
              >
                Login
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;