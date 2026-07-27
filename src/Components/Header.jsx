import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-3xl font-bold cursor-pointer">
          <span className="text-white">Resize</span>
          <span className="text-blue-500">Photo</span>
        </h1>

        {/* Get Started Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;