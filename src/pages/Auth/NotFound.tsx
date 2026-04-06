import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-gray-900 font-sans">
      <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-medium text-[#00ace6] dark:text-blue-400 animate-fadeInSlow">
            404 error
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-800 dark:text-white animate-fadeInSlow delay-100">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 animate-fadeInSlow delay-200">
            Sorry, the page you are looking for doesn't exist. Here are some helpful links:
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <button
              onClick={() => navigate("/")}
              className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-transform duration-300 bg-[#00ace6] rounded-lg shrink-0 sm:w-auto animate-fadeInSlow delay-400"
            >
              Take me home
            </button>
          </div>
        </div>
        {/* Right Image */}
        <div className="relative w-full mt-8 lg:w-1/2 lg:mt-0 animate-fadeInUp">
          <img
            className="w-full lg:h-[32rem] h-80 md:h-96 rounded-lg object-cover transform transition-transform duration-500 hover:scale-110"
            src="https://images.unsplash.com/photo-1613310023042-ad79320c00ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Not Found"
          />
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeInSlow {
            animation: fadeInSlow 1s ease forwards;
          }

          .animate-fadeInUp {
            animation: fadeInUp 1s ease forwards;
          }

          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
        `}
      </style>
    </section>
  );
};

export default NotFound;
