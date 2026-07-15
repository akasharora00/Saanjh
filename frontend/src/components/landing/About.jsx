const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div className="relative">

            <div className="rounded-3xl overflow-hidden shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900"
                alt="Students"
                className="w-full h-[600px] object-cover"
              />

            </div>

            {/* Stats */}

            <div className="absolute -bottom-10 left-10 bg-white rounded-3xl shadow-xl p-6 flex gap-10">

              <div>
                <h3 className="text-3xl font-bold text-violet-600">
                  10K+
                </h3>

                <p className="text-gray-500">
                  Students
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-violet-600">
                  500+
                </h3>

                <p className="text-gray-500">
                  Faculty
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-violet-600">
                  50+
                </h3>

                <p className="text-gray-500">
                  Clubs
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <span className="text-violet-600 font-semibold uppercase tracking-widest">
              Why Saanjh
            </span>

            <h2 className="text-5xl font-bold text-slate-900 mt-5 leading-tight">
              A complete digital
              <br />
              campus ecosystem.
            </h2>

            <p className="text-gray-500 text-lg leading-8 mt-8">
              Saanjh brings together students, faculty and administration
              on one modern platform to improve communication,
              collaboration and campus engagement.
            </p>

            <div className="space-y-8 mt-10">

              <div className="flex gap-5">

                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xl">
                  ✓
                </div>

                <div>

                  <h3 className="font-bold text-xl">
                    Centralized Information
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Notes, announcements, assignments and schedules
                    all in one place.
                  </p>

                </div>

              </div>

              <div className="flex gap-5">

                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xl">
                  ✓
                </div>

                <div>

                  <h3 className="font-bold text-xl">
                    Better Collaboration
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Connect students, clubs and faculty without relying
                    on multiple apps.
                  </p>

                </div>

              </div>

              <div className="flex gap-5">

                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xl">
                  ✓
                </div>

                <div>

                  <h3 className="font-bold text-xl">
                    Faster Communication
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Receive instant updates about exams, events,
                    placements and campus activities.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;