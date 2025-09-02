import { Link, useLocation } from "react-router-dom";
import course from "../../assets/Footer/Course.png";
import Logo from "/src/assets/logo/NewLogo.png";
import home from "../../assets/Footer/Home.png"
import about from "../../assets/Footer/About.png"
import contact from "../../assets/Footer/Contact.png"
import blog from "../../assets/Footer/Blog.png"
import useTheme from "/src/Hooks/ThemeHook.js";


function Footer() {
  const isDarkMode = useTheme();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000000" : "#ffffff",
  };

  const textColor = isDarkMode ? "text-gray-400" : "text-gray-800";
  const mutedText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverColor = "hover:text-orange-500";
  const location = useLocation()

 const picMap = {
  "/": {
    image: home,
    text: `"Empower your learning journey with our curated courses. Discover new skills and grow at your own pace. Join thousands of learners achieving their goals."`,
    className: "absolute -bottom-[105px] right-6 lg:w-[35%]"
  },
  "/about": {
    image: about,
    text: `"We make learning accessible and engaging for everyone. Our team is dedicated to helping you succeed. Be part of our growing community today."`,
    className: "absolute -bottom-[75px] right-6 lg:w-[32%]"
  },
  "/course": {
    image: course,
    text: `"Explore courses designed to boost your skills and career. Learn from expert instructors and interactive lessons. Start your journey to mastery today."`,
    className: "absolute bottom-0 right-6 lg:w-[38%]"
  },
  "/contact": {
    image: contact,
    text: `"Have questions or need support? We're here to help. Reach out via email or phone anytime. Your learning experience matters to us."`,
    className: "absolute -bottom-[65px] right-6 lg:w-[30%]"
  },
  "/blog": {
    image: blog,
    text: `"Stay updated with insights, tips, and tutorials. Learn from industry experts and improve your skills. Subscribe to our newsletter for the latest posts"`,
    className: "absolute -bottom-14 right-6 lg:w-[34%]"
  }
};


  const { text, image } = picMap[location.pathname] || home

  return (
    <div className="relative z-20" style={backgroundStyle}>
      <div className="w-full lg:pt-44 2xl:pt-52">
        <div className="block md:hidden h-1 w-full bg-orange-500 "></div>
        <div className="hidden md:flex relative top-10 left-1/2 transform -translate-x-1/2 translate-y-[-50%] bg-gradient-to-r from-orange-500 to-orange-700 w-[90%] h-[180px] rounded-xl justify-between items-center px-6 md:px-10 z-30 shadow-xl">
          <h1
            className="text-white font-medium text-base md:text-lg max-w-xl leading-relaxed"
            dangerouslySetInnerHTML={{__html:text}}
          />
          <img
  src={image}
  alt="Illustration"
  className={`hidden lg:block drop-shadow-lg ${picMap[location.pathname]?.className || "absolute bottom-0 right-6 lg:w-[35%]"}`}
/>
        </div>
      </div>
      <div className="relative mt-10 lg:mt-0 pb-8 pl-5 md:px-20 z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <Link to="/">
              <img src={Logo} className="w-20 md:w-24" alt="Logo" />
            </Link>
            <p
              className={`mt-5 text-sm xl:text-xl ${mutedText} max-w-xl leading-relaxed`}
            >
              Unlock your learning journey with Scopik. Quality education,
              anytime, anywhere. Designed to inspire, built for the future.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col sm:flex-row md:flex-wrap mb-4">
              <div className="flex flex-col md:flex-row items-start justify-center w-full gap-0">
                {/* Links */}
                <div className="w-1/2 flex flex-col gap-2 text-sm pb-2">
                  <h1 className="text-[#F97316] font-semibold text-xl pb-2">
                    Links
                  </h1>
                  <Link
                    to="/"
                    className={`${hoverColor} ${textColor} transition`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={`${hoverColor} ${textColor} transition`}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/course"
                    className={`${hoverColor} ${textColor} transition`}
                  >
                    Courses
                  </Link>
                  <Link
                    to="/contact"
                    className={`${hoverColor} ${textColor} transition`}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/blog"
                    className={`${hoverColor} ${textColor} transition`}
                  >
                    Blog
                  </Link>
                </div>
                <div className="w-1/2 flex flex-col text-sm gap-2 pb-2">
                  <h1 className="text-[#F97316] font-semibold text-xl pb-2">
                    Contact
                  </h1>
                  <h2 className={`${mutedText} py-1`}>044-2842 2843</h2>
                  <h2 className={`${mutedText} py-1`}>+91 23744 29424</h2>

                  <div className="w-1/2 md:w-full text-lg pb-2">
                    <h1 className="text-[#F97316] font-semibold text-xl pb-2">
                      Email
                    </h1>
                    <h1 className={`${mutedText} py-1`}>support@scopik.in</h1>
                  </div>
                </div>
                <div className="flex flex-col w-full text-md md:w-1/2">
                  <h1 className="text-[#F97316] font-semibold text-xl pb-2">
                    Address
                  </h1>
                  <h1 className={`py-1 max-w-sm ${mutedText}`}>
                    1st Floor, Amalpavi Office Complex Opp to National College,
                    Trichy-Dindigul RdC Block, Karumandapam, Tiruchirappalli,
                    Tamil Nadu 620001
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border-t mt-1 pt-4 flex flex-col md:flex-row justify-center md:justify-between items-center text-sm ${isDarkMode
            ? "border-gray-700 text-gray-500"
            : "border-gray-300 text-gray-500"
            }`}
        >
          <span>&copy; 2025 Scopik. All rights reserved.</span>
          <a
            href="https://thirdvizion.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 md:mt-0 text-gray-400 dark:text-orange-500 hover:text-orange-500 dark:hover:text-gray-400 transition"
          >
            Developed by Thirdvizion.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
