import { useEffect, useState } from "react";
import contactHeroImage from "/src/assets/newImage/ContactHeroimg.png";
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

  // const isDark = theme === "dark";

  return (
    <div className="relative w-full">
      {/* Top Image Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <img
          src={contactHeroImage} // Use the imported image
          alt="Scopik VR"
          className="w-full h-full object-cover object-top"
        />

        {/* Updated forward wave format */}
        {/* <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 220"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={isDark ? "#000000" : "#ffffff"}
            d="M0,160 C360,260 1080,60 1440,160 L1440,320 L0,320 Z"
          />
        </svg> */}
      </div>
    </div>
  );
}
