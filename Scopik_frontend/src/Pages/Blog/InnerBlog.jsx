import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook.js";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDarkMode = useTheme();

  useEffect(() => {
    axios.get(import.meta.env.VITE_BLOG_VIEW).then((res) => {
      const selectedBlog = res.data.find((item) => String(item.id) === id);
      setBlog(selectedBlog);
      setCurrentIndex(0);
    });
  }, [id]);

  if (!blog)
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? blog.image_urls.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === blog.image_urls.length - 1 ? 0 : prev + 1
    );
  };

  const iconBg = isDarkMode ? "bg-white" : "bg-gray-300";
  const iconColor = "#f97316";

  const isImageOnly = blog.content.trim() === "";

  return (
    <div
      className={`min-h-screen px-4 py-10 transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className={`${isImageOnly ? "max-w-5xl" : "max-w-4xl"} mt-20 mx-auto`}>
        <h1 className="text-3xl md:text-4xl font-news font-bold text-center text-orange-500 mt-6 mb-4">
          {blog.title}
        </h1>

        {isImageOnly ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {blog.image_urls.map((url, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsModalOpen(true);
                }}
                className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_30px_#f97316] shadow-md rounded-xl overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Blog image ${index + 1}`}
                  className="w-full h-72 object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="relative">
              <img
                src={blog.image_urls?.[currentIndex]}
                alt={`Blog image ${currentIndex + 1}`}
                className="w-full h-96 object-fill rounded-xl shadow-md cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
            </div>

            <div className="hidden md:flex justify-between items-center mt-4 mb-2">
              <button onClick={handlePrev} className={`${iconBg} p-2 rounded-full`}>
                <ChevronLeft className="w-6 h-6" color={iconColor} />
              </button>
              <button onClick={handleNext} className={`${iconBg} p-2 rounded-full`}>
                <ChevronRight className="w-6 h-6" color={iconColor} />
              </button>
            </div>

            <div className="flex md:hidden justify-center gap-10 mt-4 mb-2">
              <button onClick={handlePrev} className={`${iconBg} p-2 rounded-full shadow-lg`}>
                <ChevronLeft className="w-5 h-5" color={iconColor} />
              </button>
              <button onClick={handleNext} className={`${iconBg} p-2 rounded-full shadow-lg`}>
                <ChevronRight className="w-5 h-5" color={iconColor} />
              </button>
            </div>

            <div className="flex justify-center mt-2 gap-2">
              {blog.image_urls.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    index === currentIndex
                      ? "bg-orange-500"
                      : "bg-gray-400 dark:bg-gray-600"
                  }`}
                ></div>
              ))}
            </div>

            <div className="prose prose-base sm:prose-lg text-base sm:text-xl dark:prose-invert max-w-none mt-6 font-sans text-gray-800 dark:text-gray-300 leading-normal sm:leading-relaxed space-y-2 sm:space-y-3">
              {blog.content.split("\n").map((line, index) => {
                const trimmed = line.trim();
                const isHeading =
                  trimmed.endsWith(":") &&
                  ["Objectives:", "Key Highlights:", "Outcome:"].includes(trimmed);

                return (
                  <p
                    key={index}
                    className={`mb-2 ${
                      isHeading ? "font-semibold text-2xl text-orange-600" : ""
                    }`}
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={blog.image_urls?.[currentIndex]}
              alt="Full view"
              className="w-full max-h-[80vh] object-cover rounded-xl"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-white text-black p-1 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetails
