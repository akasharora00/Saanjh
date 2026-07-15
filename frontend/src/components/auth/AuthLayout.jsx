const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 text-white">

        {/* Background Blur */}

        <div className="absolute -top-24 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col justify-between h-full w-full p-12">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-xl">
              💬
            </div>

            <h1 className="text-3xl font-bold">
              Saanjh
            </h1>

          </div>

          {/* Content */}

          <div>

            <h2 className="text-5xl font-bold leading-tight">
              One platform.
              <br />
              Every campus need.
            </h2>

            <p className="text-violet-100 mt-8 text-lg leading-8 max-w-md">
              Notes, events, assignments and announcements —
              beautifully unified for the modern university experience.
            </p>

            {/* Stats */}

            <div className="grid grid-cols-2 gap-6 mt-14">

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">

                <h3 className="text-4xl font-bold">
                  15K+
                </h3>

                <p className="text-violet-200 mt-2">
                  Students
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">

                <h3 className="text-4xl font-bold">
                  800+
                </h3>

                <p className="text-violet-200 mt-2">
                  Faculty
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">

                <h3 className="text-4xl font-bold">
                  40K+
                </h3>

                <p className="text-violet-200 mt-2">
                  Notes Shared
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">

                <h3 className="text-4xl font-bold">
                  12
                </h3>

                <p className="text-violet-200 mt-2">
                  Universities
                </p>

              </div>

            </div>

          </div>

          {/* Footer */}

          <p className="text-violet-200 text-sm">
            © {new Date().getFullYear()} Saanjh Technologies
          </p>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex items-center justify-center p-8 bg-white">

        <div className="w-full max-w-lg">

          <h1 className="text-4xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="text-gray-500 mt-3 mb-10">
            {subtitle}
          </p>

          {children}

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;