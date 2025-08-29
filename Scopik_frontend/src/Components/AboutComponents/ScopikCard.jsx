import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "/src/assets/AboutPage/AboutBanner.png";

export default function ScopikBanner() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(localStorage.getItem("theme") || "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Curve — first thing on the page */}
      <div className="absolute top-0 left-0 w-full z-0">
        <svg
          className="block w-full h-[120px] transition-colors duration-500"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={isDark ? "#000000" : "#ffffff"}
            d="M0,0 C360,100 1080,-100 1440,0 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      {/* Main Banner Content */}
      <div className="relative z-10">
        {/* Your existing image and content below */}
        <div className="w-full h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt="Scopik VR"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Content Section */}
        <div className="w-full bg-white dark:bg-black text-black dark:text-white py-16 px-6 md:px-12 lg:px-20 flex items-center justify-center transition-colors duration-500">
          <div className="w-full text-center">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-semibold font-serif drop-shadow-lg ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Learn in{" "}
              <span
                className={`${isDark ? "text-orange-400" : "text-[#FF6A00]"}`}
              >
                Scopik
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 pt-6 leading-relaxed text-justify md:text-center">
              SCOPIK is deeply focused on AR/VR skill development, offering a
              NSQF, NSDC, and MESC-recognized curriculum tailored to the needs
              of Industry 4.0. As an authorized Unity Education reseller, SCOPIK
              emphasizes project-based learning backed by strong industry
              tie-ups. The organization supports institutions with immersive lab
              setups and delivers AICTE-aligned undergraduate programs to ensure
              academic excellence. With robust placement support, regular guest
              lectures, and meaningful academic partnerships, SCOPIK bridges the
              gap between education and employability.
            </p>

            <div className="pt-8">
              <Link to="/course">
                <button className="bg-[#F97316] hover:bg-orange-600 text-white dark:text-black font-news text-lg px-6 py-3 rounded transition-all duration-300 border-2 border-transparent hover:border-orange-500 dark:hover:border-orange-400">
                  Explore Course
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
