import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Computer Science Student",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review: "UniSphere has completely changed the way we access notes and university updates. Everything is available in one place.",
  },
  {
    name: "Priya Verma",
    role: "Faculty Member",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review: "Managing announcements and assignments has become much easier. Students never miss important updates anymore.",
  },
  {
    name: "Rohan Singh",
    role: "Event Coordinator",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    review: "Club registrations, event promotions and communication are now seamless. Highly recommended for every campus.",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-[#0F172A] to-slate-950/80 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center relative z-10">
          <span className="uppercase tracking-widest font-bold text-blue-500 text-xs">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">
            Loved by Students & Faculty
          </h2>
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            See how UniSphere is improving academic collaboration and logistics across campus.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 relative z-10">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card rounded-[24px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 border border-slate-800 hover:border-blue-500/30 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed italic text-sm md:text-base">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-850">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                />
                <div>
                  <h3 className="font-bold text-white text-base">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;