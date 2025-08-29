import React, { useContext } from "react";
import { CourseContext } from "/src/App";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function DigitalDreamsCard() {
  const { Course = [] } = useContext(CourseContext);

  const baseCourses = Course.slice(0, 5);
  const scrollingCourses = [...baseCourses, ...baseCourses];

  const handleMouseEnter = (e) => {
    e.currentTarget.style.animationPlayState = "paused";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.animationPlayState = "running";
  };

  return (
    <div className="w-full bg-white dark:bg-black flex flex-col items-center justify-center overflow-hidden px-4 py-16 transition-colors duration-500">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl xl:text-5xl mb-16 text-center text-[#F97316] font-news">
        Trending Courses
      </h1>

      {/* Marquee wrapper */}
      <div className="w-full relative mt-4 mb-10">
        <div
          className="flex gap-10 items-center w-max scroll"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {scrollingCourses.map((course, index) => (
            <div
              key={`course-${index}-${course.id}`}
              className="relative group w-[300px] h-[220px] sm:w-[300px] rounded-3xl overflow-hidden transition-all duration-500 hover:h-[340px] text-black dark:text-white bg-white dark:bg-transparent 
              hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {/* Image */}
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-[180px] object-cover rounded-2xl shadow-md z-10 transition-transform duration-500"
              />

              {/* Hidden Content */}
              <div className="absolute top-[160px] px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-200 w-full">
                <div className="flex flex-col items-center text-center">
                  {/* TRENDING Badge */}
                  <span className="inline-block bg-[#F97316] text-xs font-semibold px-3 py-1 rounded-full mb-2 text-white">
                    TRENDING
                  </span>

                  {/* Ratings */}
                  <div className="flex items-center space-x-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= Math.round(course.ratings) ? (
                        <Star
                          key={star}
                          size={14}
                          className="text-yellow-400 fill-yellow-400"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <Star
                          key={star}
                          size={14}
                          className="text-gray-400"
                          strokeWidth={1.5}
                          fill="none"
                        />
                      )
                    )}
                    <span className="text-xs text-[#F97316] ml-1">
                      {course.ratings}
                    </span>
                  </div>

                  {/* Course Name */}
                  <h2 className="text-lg xl:text-xl font-bold font-news leading-tight group-hover:text-[#F97316]">
                    {course.name}
                  </h2>

                  {/* View Course Button */}
                  <div className="mt-4">
                    <Link to={`/course/${course.id}`}>
                      <button className="py-2 px-6 border-2 border-[#F97316] text-[#F97316] rounded-full text-sm md:text-base font-semibold transition-all duration-300 hover:bg-[#F97316] hover:text-white dark:hover:text-[#0B1C3F]">
                        View Course
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
