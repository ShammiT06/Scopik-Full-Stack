import { useEffect, useState } from "react";

export default function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(null); // <-- Start as null

  useEffect(() => {
    // Initial theme detection
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme(); // Call once immediately

    // Watch for further changes
    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}
