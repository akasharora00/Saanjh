const features = [
  {
    icon: "📚",
    title: "Smart Notes",
    description:
      "Upload, organize and access notes shared by students and faculty anytime.",
  },
  {
    icon: "📢",
    title: "Announcements",
    description:
      "Never miss important university updates, circulars or notices.",
  },
  {
    icon: "📅",
    title: "Events",
    description:
      "Discover workshops, hackathons, seminars and club activities in one place.",
  },
  {
    icon: "📝",
    title: "Assignments",
    description:
      "Track deadlines, submissions and course progress without the stress.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-white to-violet-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="text-violet-600 font-semibold uppercase tracking-widest">
            Features
          </span>

          <h2 className="text-5xl font-bold text-slate-900 mt-4">
            Everything your campus needs.
          </h2>

          <p className="text-gray-500 mt-6 text-lg max-w-3xl mx-auto">
            Designed for students, faculty and administrators to simplify
            campus life with one unified platform.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl group-hover:scale-110 transition">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mt-8 text-slate-900">
                {feature.title}
              </h3>

              <p className="text-gray-500 mt-5 leading-8">
                {feature.description}
              </p>

              <button className="mt-8 text-violet-600 font-semibold group-hover:translate-x-2 transition">
                Learn More →
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Features;