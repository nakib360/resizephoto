import React from "react";

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#082727] text-slate-400">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p><span className="font-bold text-white">Pixel<span className="text-lime-300">Fit</span></span> — simple image resizing, right in your browser.</p>
      <p>© {new Date().getFullYear()} PixelFit</p>
    </div>
  </footer>
);

export default Footer;
