import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "/src/assets/logo/NewLogo.png";
import { loginContext } from "/src/App.jsx";
import axios from "axios";
import Toggle from "/src/Components/ToggleTheme.jsx";

function Header() {
  const { login, setLogin, userName, userEmail, setUserEmail, userImage, setUserImage } =
    useContext(loginContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [bgChange, setBgChange] = useState(false);

  const dropdownRef = useRef(null);  
  const avatarRef = useRef(null);  

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  const getProfileRoute = () => {
    const role = localStorage.getItem("userRole");
    if (!login) return "/login";
    if (role === "Superadmin") return "/superAdmin";
    if (role === "University_admin") return "/univAdmin";
    if (role === "Faculty") return "/faculty";
    return "/student";
  };

  const handleScroll = () => {
    const currentY = window.scrollY;
    setShowNavbar(currentY < lastScrollY);
    setLastScrollY(currentY);
    setBgChange(currentY > 10);
  };

  const handleLogout = () => {
  const logout_time = new Date().toLocaleString();
  const student_email = userEmail;
  const storedLoginTime = localStorage.getItem("login_time");

  if (!student_email) {
    alert("Student email not found.");
    return;
  }

  setShowConfirm(false);
  setTimeout(async () => {
    try {
      await axios.post(import.meta.env.VITE_LOGOUT, {
        logout_time,
        student_email,
        storedLoginTime,
      });

      localStorage.clear()
      setUserEmail(null);
      setUserImage(null);
      setLogin(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, 0);
};
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex items-center justify-between h-[45px] md:h-[55px] lg:h-[60px] transition-all duration-300 ${
        isHome && !bgChange
          ? "bg-gradient-to-b from-white/30 to-transparent dark:from-black/80 dark:to-transparent"
          : "bg-white dark:bg-black shadow-md"
      }`}
    >
      <Link to="/">
        <img
          src={Logo}
          alt="Scopik Logo"
          className="w-[45px] md:w-[60px] lg:w-[70px] h-auto mx-5 my-2 rounded-lg sticky top-0 z-40"
        />
      </Link>

      {/* Desktop Menu */}
      <div
        className={`hidden lg:flex gap-14 font-manrope md:text-md lg:text-xl xl:text-2xl transition ${
          isHome && !bgChange ? "text-white" : "text-gray-800 dark:text-white"
        }`}
      >
        <Link to="/" className="hover:text-[#F97316] transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-[#F97316] transition">
          About
        </Link>
        <Link to="/course" className="hover:text-[#F97316] transition">
          Courses
        </Link>
        <Link to="/contact" className="hover:text-[#F97316] transition">
          Contact
        </Link>
        <Link to="/blog" className="hover:text-[#F97316] transition">
          Blog
        </Link>
      </div>

      {/* Right Side */}
      {login ? (
        <div className="w-full lg:w-auto pr-6 sm:pr-5 hidden sm:flex items-center justify-end gap-3 relative">
          <div className="hidden lg:flex mr-8">
            <Toggle initialWhite={isHome && !bgChange} />
          </div>

          {/* Avatar / Initial */}
          <div ref={avatarRef} onClick={toggleDropdown} className="cursor-pointer">
            {userImage ? (
              <img
                src={userImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FF6A00] text-white flex items-center justify-center text-lg font-semibold hover:scale-105 transition">
                {(userName || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 w-44 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50 py-2"
            >
              <div className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700">
                {userName || "User"}
              </div>
              <Link
                to={getProfileRoute()}
                onClick={closeDropdown}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  closeDropdown();
                  setShowConfirm(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="gap-2 md:flex hidden pr-3 text-sm items-center">
          <div className="mr-8">
            <Toggle initialWhite={isHome && !bgChange} />
          </div>
          <Link
            to="/login"
            className="px-4 py-1 rounded-3xl border border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-1 rounded-3xl bg-[#F97316] text-white hover:bg-orange-600 transition"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Logout confirm popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96 h-[150px] flex flex-col justify-center items-center">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-5">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-[#F97316] text-white hover:bg-[#F97316]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className="lg:hidden flex relative">
        <svg
          onClick={toggleMenu}
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-black dark:text-white mr-4 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>

        {isOpen && (
          <div className="fixed top-0 right-0 w-full md:w-72 h-full bg-white dark:bg-black text-black dark:text-white z-50 shadow-lg transition-all duration-300 transform translate-x-0">
            <div className="flex justify-end p-4">
              <svg
                onClick={toggleMenu}
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-black dark:text-white cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex flex-col items-start px-6 space-y-4 text-lg">
              <div className="block lg:block">
                <Toggle initialWhite={isHome && !bgChange} />
              </div>

              <Link to="/" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                Home
              </Link>
              <Link to="/about" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                About
              </Link>
              <Link to="/course" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                Courses
              </Link>
              <Link to="/contact" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                Contact
              </Link>
              <Link to="/blog" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                Blog
              </Link>
              <Link to={getProfileRoute()} onClick={toggleMenu} className="hover:text-[#FF6A00]">
                Dashboard
              </Link>

              {!login ? (
                <div className="flex flex-col gap-2 md:hidden lg:block">
                  <Link to="/login" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                    Login
                  </Link>
                  <Link to="/register" onClick={toggleMenu} className="hover:text-[#FF6A00]">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    toggleMenu();
                    setShowConfirm(true);
                  }}
                  className="hover:text-[#FF6A00] block md:hidden lg:block"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
