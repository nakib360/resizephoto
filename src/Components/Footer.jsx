import React from "react";
import logo from "../assets/resizepic logo full version.svg";

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#636D2F]/30 text-slate-400">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-7 text-sm text-center sm:flex-row sm:flex-wrap sm:justify-between sm:gap-3 sm:text-left sm:px-8">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
        <img className="h-7 w-auto" src={logo} alt="Resize Picture" />
        <span className="max-w-64 leading-5 sm:max-w-none">simple image resizing, right in your browser.</span>
      </div>
      <nav aria-label="Footer navigation" className="flex items-center gap-4 text-xs font-medium">
        <a href="/" className="transition hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300">Home</a>
        <a href="#resize-image" className="transition hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300">Resize image</a>
      </nav>
      <p>© {new Date().getFullYear()} Resize Picture</p>
    </div>
  </footer>
);

export default Footer;
