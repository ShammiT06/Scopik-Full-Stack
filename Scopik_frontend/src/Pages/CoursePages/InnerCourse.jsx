import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseContext, loginContext } from "/src/App";
import AnchorLink from "react-anchor-link-smooth-scroll";

import WhatWeHave from "/src/Components/CourseComponents/WhatWeHave.jsx";
import Syllabus from "/src/Components/CourseComponents/Syllabus.jsx";
import Learning from "/src/Components/ReusableComponents/Learning.jsx";
import DarkStudent from "/src/Components/HomeComponents/Student.jsx";
import axios from "axios";
import { FaRupeeSign } from "react-icons/fa";
import BGOverlay from "/src/assets/newImage/BGOverlay.png";
import useTheme from "/src/Hooks/ThemeHook.js";

function InnerCourse() {
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [pay, setPay] = useState(false);
  const [showModal, setShowModal] = useState({ visible: false, message: "", action: null });
  const { id } = useParams();
  const [name, SetName] = useState("");
  const [Email, setEMail] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();
  const { Course } = useContext(CourseContext);
  const { login } = useContext(loginContext);
  const student_email = localStorage.getItem("userEmail");
  const isDarkMode = useTheme();

  const handleValidateAndPay = () => {
    if (!name || !student_email || !number) {
      setError("All fields are required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(number)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    handlePayment();
  };

  useEffect(() => {
    if (!id || !student_email) return;

    axios
      .get(import.meta.env.VITE_student_progress, {
        params: {
          email: student_email,
          course_id: id,
        },
      })
      .then((res) => {
        const { courses } = res.data;
        const isEnrolled = courses.course_details?.some(
          (course) => String(course.course_id) === String(id)
        );
        setEnrolled(isEnrolled ?? false);
      })
      .catch(() => {
        setEnrolled(false);
      });
  }, [id, student_email]);

  const individual = Course?.find((cor) => cor.id === Number(id)) || null;

  function handleEnroll() {
    if (!login) {
      setShowModal({
        visible: true,
        message: "Please Login to Proceed..!",
        action: () => navigate("/login"),
      });
    } else {
      setPay(true);
    }
  }

  if (!Course || !individual) {
    return (
      <div className="text-center text-red-600 mt-5">
        Loading Course Details....
      </div>
    );
  }

  async function handlePayment() {
    if (!name || !student_email || !number) {
      setShowModal({
        visible: true,
        message: "Please fill in all the details.",
      });
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_ENTROLLMENT,
        {
          email: student_email,
          name: name,
          number: number,
          amount: Number(individual.price),
          id: id,
        }
      );
      const orderData = response.data;

      const options = {
        key:import.meta.env.VITE_RAZOR_PAY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Course Enrollment",
        description: "Access to course content",
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              import.meta.env.VITE_PAY_SUCCESS,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                email: student_email,
              }
            );

            if (verifyRes.status === 200) {
              await axios.get(
                import.meta.env.VITE_COURSE_ENTROLL_PRO,
                {
                  params: {
                    course_id: Number(id),
                    email: student_email,
                    completion_counts: 0,
                  },
                }
              );

              setPay(false); // ? Auto-close payment popup
              setShowModal({
                visible: true,
                message: "You have been successfully enrolled!",
                action: () => {
                  setEnrolled(true);
                  navigate(`/individual/${individual.id}`);
                },
              });
            } else {
              setShowModal({
                visible: true,
                message: "Payment verification failed. Please try again.",
              });
            }
          } catch {
            setShowModal({
              visible: true,
              message: "Error during enrollment process.",
            });
          }
        },
        prefill: {
          name: name,
          email: student_email,
          contact: number,
        },
        theme: {
          color: "#084D90",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setShowModal({
        visible: true,
        message: "Something went wrong during payment initiation.",
      });
    }
  }

  return (
    <div className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>
      {showModal.visible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className={`p-6 rounded shadow-md max-w-md w-full text-center ${
            isDarkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-900"
          }`}>
            <p className="text-lg mb-4">{showModal.message}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowModal({ visible: false, message: "", action: null });
                if (showModal.action) showModal.action();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[480px] mt-16">
        <img
          src={individual.background_image}
          alt="Course Background"
          className="absolute inset-0 w-full h-full object-fill"  
        />
        <img
          src={BGOverlay}
          alt="Overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-12 pt-10 w-full font-['Inter','sans-serif']">
        {/* Main Content Area */}
        <div className="w-full lg:w-2/3 space-y-10 order-2 lg:order-1">
          <section>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {individual.name}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed">
              {individual.description}
            </p>
            {enrolled ? (
              <button
                className={`mt-6 px-6 py-3 border-2 border-orange-400 hover:bg-orange-500 hover:text-white transition font-semibold rounded-md ${
                  isDarkMode ? "text-orange-400" : "text-orange-700"
                } `}
                onClick={() => navigate(`/individual/${individual.id}`)}
              >
                Start Learning
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white font-semibold rounded-md hover:opacity-90 transition"
              >
                Enroll Now
              </button>
            )}
          </section>

          <nav
            className="sticky top-14 z-10 p-6 py-5 rounded-lg shadow-lg flex flex-wrap gap-10 text-base sm:text-xl font-medium"
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            <AnchorLink href="#whatwehave" className="hover:text-[#FFA705] transition">
              About
            </AnchorLink>
            <AnchorLink href="#syllabus" className="hover:text-[#FFA705] transition">
              Course
            </AnchorLink>
            <AnchorLink href="#learning" className="hover:text-[#FFA705] transition">
              Related
            </AnchorLink>
            <AnchorLink href="#student" className="hover:text-[#FFA705] transition">
              Reviews
            </AnchorLink>
          </nav>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 order-1 lg:order-2">
          <div className={`relative border border-orange-400/30 rounded-2xl p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(255,115,0,0.35)] overflow-hidden transition hover:scale-[1.01] duration-300 ${
            isDarkMode ? "bg-white/10 text-white" : "bg-gray-100 text-black"
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-800/30 to-indigo-900/20 rounded-2xl pointer-events-none blur-md opacity-60" />
            <div className="absolute top-4 right-4 bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow z-10">
              Most Popular
            </div>

            <h2 className="text-2xl font-bold mb-1 relative z-10">Premium Access</h2>
            <p className="text-sm mb-4 relative z-10">
              Unlock exclusive content, mentorship, and early access to all modules.
            </p>

            <div className="text-3xl font-semibold mb-4 relative z-10 flex items-center gap-1">
              <FaRupeeSign className="text-orange-500 mt-1" /> {individual.price}
              <span className="text-sm text-gray-400 font-normal">/lifetime</span>
            </div>

            {enrolled ? (
              <button
                className="w-full mt-6 px-6 py-3 border-2 border-orange-400 text-orange-300 hover:bg-orange-500 hover:text-white transition font-semibold rounded-md"
                onClick={() => navigate(`/individual/${individual.id}`)}
              >
                Start Learning
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white font-semibold rounded-md hover:opacity-90 transition"
              >
                Enroll Now
              </button>
            )}

            <div className="border-t border-gray-600 my-6 relative z-10"></div>

            <ul className="text-sm space-y-4 relative z-10">
              <li><strong>1-on-1 Mentorship</strong> with certified instructors</li>
              <li><strong>Early Module Access</strong> to all future content</li>
              <li><strong>Certificate of Excellence</strong> upon completion</li>
              <li><strong>Downloadable Resources</strong> and cheat sheets</li>
              <li><strong>Lifetime Access</strong> to updates and bonus content</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Full-width sections start here */}
      <div className="space-y-10 mt-10">
        <div id="whatwehave" className="px-4 sm:px-6 lg:px-12">
          <WhatWeHave />
        </div>
        <div id="syllabus" className="px-4 sm:px-6 lg:px-12">
          <Syllabus />
        </div>
        <div id="learning" className="px-4 sm:px-6 lg:px-12">
          <Learning />
        </div>
        <div id="student" className="px-4 sm:px-6 lg:px-12">
          <DarkStudent />
        </div>
      </div>
      {/* Full-width sections end here */}

      {pay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className={`rounded-xl shadow-lg w-full max-w-lg px-6 sm:px-10 py-6 relative transition-all duration-300 ${
            isDarkMode ? "bg-[#0c0c0c] text-white border border-gray-800" : "bg-white text-gray-900 border border-gray-300"
          }`}>
            <button
              onClick={() => setPay(false)}
              className="absolute top-3 right-4 text-2xl font-bold hover:text-orange-600 transition"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-center mb-2">Payment</h2>
            <p className={`text-sm text-center mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Enter correct details for your course completion certificate.
            </p>

            {error && (
              <p className="text-red-500 text-center text-sm mb-4">{error}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => SetName(e.target.value)}
                  className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
                    isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700 focus:ring-orange-400" : "bg-white text-black border-gray-300 focus:ring-blue-400"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={student_email}
                  readOnly
                  className={`w-full border p-2 rounded-md cursor-not-allowed ${
                    isDarkMode ? "bg-[#222] text-gray-400 border-gray-700" : "bg-gray-100 text-gray-500 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setNumber(value);
                  }}
                  className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
                    isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700 focus:ring-orange-400" : "bg-white text-black border-gray-300 focus:ring-blue-400"
                  }`}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">{individual.name}</h3>
                <div className="flex justify-between text-lg mt-1">
                  <span>Cost</span>
                  <span>-</span>
                  <span className="text-orange-500">&#8377;{individual.price}</span>
                </div>
              </div>
              <button
                onClick={handleValidateAndPay}
                className="w-full py-2 mt-4 rounded-md transition font-semibold bg-orange-500 hover:bg-orange-600 text-white"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InnerCourse;