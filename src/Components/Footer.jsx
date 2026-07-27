import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Resize<span className="text-blue-500">Photo</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Resize your images quickly and easily. Upload, resize, preview, and
            download your images in just a few clicks.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-blue-600 transition"
            >
              GitHub
            </a>

            <a
              href="mailto:support@resizephoto.com"
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-green-600 transition"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ResizePhoto. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;