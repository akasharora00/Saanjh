const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Computer Science Student",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Saanjh has completely changed the way we access notes and university updates. Everything is available in one place.",
  },
  {
    name: "Priya Verma",
    role: "Faculty Member",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "Managing announcements and assignments has become much easier. Students never miss important updates anymore.",
  },
  {
    name: "Rohan Singh",
    role: "Event Coordinator",
    image:
      "https://randomuser.me/api/portraits/men/67.jpg",
    review:
      "Club registrations, event promotions and communication are now seamless. Highly recommended for every campus.",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-24 bg-violet-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="uppercase tracking-widest font-semibold text-violet-600">
            Testimonials
          </span>

          <h2 className="text-5xl font-bold mt-5 text-slate-900">
            Loved by Students & Faculty
          </h2>

          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg">
            See how Saanjh is improving communication and collaboration
            across campus.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-3 transition duration-300"
            >

              {/* Stars */}

              <div className="flex gap-1 text-yellow-400 text-xl mb-6">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-gray-600 leading-8 italic">
                "{item.review}"
              </p>

              <div className="flex items-center gap-4 mt-8">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>

                  <h3 className="font-bold text-lg text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {item.role}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Testimonials;