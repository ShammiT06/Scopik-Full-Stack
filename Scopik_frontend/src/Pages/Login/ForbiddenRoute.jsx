import React from "react";

const Forbidden403 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
      <h1 className="text-5xl font-bold text-red-600"> Error</h1>
      <p className="text-xl mt-4 text-gray-700 dark:text-gray-300">
         You don't have permission to access this page.
      </p>
    </div>
  );
};

export default Forbidden403;