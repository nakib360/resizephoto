import React from "react";
import logo from "../assets/resizepic logo full version.svg";

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#082727] text-slate-400">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="flex items-center gap-2">
        <img className="h-7 w-auto" src={logo} alt="Resize Picture" />
        <span>simple image resizing, right in your browser.</span>
      </p>
      <p>© {new Date().getFullYear()} Resize Picture</p>
    </div>
  </footer>
);

export default Footer;
