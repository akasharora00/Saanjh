import { GraduationCap } from "lucide-react";

const stats = [
  {
    number: "15K+",
    label: "Students",
  },
  {
    number: "800+",
    label: "Faculty",
  },
  {
    number: "40K+",
    label: "Notes Shared",
  },
  {
    number: "12",
    label: "Universities",
  },
];

const AuthLeftPanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 text-white p-12">

      {/* Background Blur */}

      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-300/10 blur-3xl"></div>

      {/* Logo */}

      <div className="relative z-10 flex items-center gap-3">

        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">

          <GraduationCap size={22} />

        </div>

        <h1 className="text-3xl font-bold">
          UniSphere
        </h1>

      </div>

      {/* Heading */}

      <div className="relative z-10">

        <h2 className="text-5xl font-bold leading-tight">

          One platform.

          <br />

          Every campus need.

        </h2>

        <p className="mt-8 text-violet-100 text-lg leading-8 max-w-md">

          Notes, events, assignments and announcements —
          beautifully unified for the modern university experience.

        </p>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-6 mt-16">

          {stats.map((item, index) => (

            <div
              key={index}
              className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/15 transition"
            >

              <h3 className="text-4xl font-bold">

                {item.number}

              </h3>

              <p className="text-violet-100 mt-2">

                {item.label}

              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Footer */}

      <div className="relative z-10 text-violet-200">

        © {new Date().getFullYear()} UniSphere Technologies

      </div>

    </div>
  );
};

export default AuthLeftPanel;
