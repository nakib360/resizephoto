import React, { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const ImageInput = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    setImage({
      file,
      preview: URL.createObjectURL(file),
    });

    setIsDragging(false);
  };

  const handleChange = (e) => {
    handleImage(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImage(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      {!image ? (
        <div
          onClick={() => inputRef.current.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed
          ${
            isDragging
              ? "border-blue-500 bg-blue-100 scale-[1.02] animate-pulse"
              : "border-blue-400 hover:border-blue-600 hover:bg-blue-50"
          }`}
        >
          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <FiUploadCloud className="text-7xl text-blue-600 animate-bounce" />

              <h2 className="mt-4 text-2xl font-bold text-blue-700">
                Drop Image Here
              </h2>
            </div>
          )}

          {/* Default Content */}
          {!isDragging && (
            <>
              <FiUploadCloud className="mx-auto text-6xl text-blue-500 mb-5" />

              <h2 className="text-2xl font-semibold text-gray-800">
                Drag & Drop Your Image
              </h2>

              <p className="text-gray-500 mt-2">
                or click to browse from your computer
              </p>

              <p className="text-sm text-gray-400 mt-3">
                JPG, PNG, WEBP, GIF
              </p>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border rounded-2xl shadow-lg p-6 bg-white">
          <img
            src={image.preview}
            alt="Preview"
            className="w-full h-80 object-contain rounded-lg"
          />

          <div className="mt-5 flex justify-between items-center">
            <p className="font-medium text-gray-700 truncate">
              {image.file.name}
            </p>
            

            <button
              onClick={removeImage}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInput;