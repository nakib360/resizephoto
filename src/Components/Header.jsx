import React from "react";
import { FiImage, FiUpload } from "react-icons/fi";

const Header = ({ onGetStarted }) => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-[#092c2c]/85 backdrop-blur-xl">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
      <button onClick={onGetStarted} className="flex items-center gap-3 text-left">
        <span className="grid size-10 place-items-center rounded-xl bg-lime-400 text-[#082b2b] shadow-lg shadow-lime-400/20">
          <FiImage size={21} />
        </span>
        <span className="text-lg font-bold tracking-tight text-white">Resize<span className="text-lime-300">Photo</span></span>
      </button>
      <button onClick={onGetStarted} className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-[#082b2b] transition hover:bg-lime-300">
        <FiUpload />
        <span className="hidden sm:inline">Upload image</span> 
        <span className="sm:hidden">Upload</span>
      </button>
    </div> 
  </header>
);

export default Header;
