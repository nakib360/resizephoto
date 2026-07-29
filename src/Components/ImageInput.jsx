import React, { useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

const ImageInput = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleImage = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;

    setFile(selectedFile);
    setIsDragging(false);
  };

  const handleChange = (e) => {
    handleImage(e.target.files[0]); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleImage(droppedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();

    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10">

      <div
        onClick={() => inputRef.current.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`relative w-full h-72 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed overflow-hidden
          ${
            isDragging
              ? "border-blue-500 bg-blue-100"
              : "border-blue-400 hover:border-blue-600 hover:bg-blue-50"
          }
        `}
      >

        {/* Drag Overlay */}
        {isDragging ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-500/10 backdrop-blur-[2px]">
            <FiUploadCloud className="text-7xl text-blue-600 animate-bounce" />

            <h2 className="mt-4 text-2xl font-bold text-blue-700">
              Drop Image Here
            </h2>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">

            <FiUploadCloud className="text-6xl text-blue-500 mb-5" />

            <h2 className="text-2xl font-semibold text-gray-800">
              Drag & Drop Your Image
            </h2>

            <p className="text-gray-500 mt-2">
              or click to browse from your computer
            </p>

            <p className="text-sm text-gray-400 mt-3">
              JPG, PNG, WEBP, GIF
            </p>


            {/* Selected File Name */}
            {file && (
              <div className="mt-5 flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg max-w-full">
                
                <p
                  className="text-gray-700 font-medium truncate max-w-xs"
                  title={file.name}
                >
                  {file.name}
                </p>

                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 shrink-0"
                >
                  <FiX size={20} />
                </button>

              </div>
            )}

          </div>
        )}


        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

      </div>

    </div>
  );
};

export default ImageInput;