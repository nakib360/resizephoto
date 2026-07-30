import React, { useRef, useState } from "react";
import { FiCheck, FiImage, FiLock, FiUploadCloud, FiZap } from "react-icons/fi";

const ImageInput = ({ setImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    });
    setIsDragging(false);
  };

  return (
    <main className="relative overflow-hidden bg-[#0b3534] px-5 py-14 sm:px-8 sm:py-20">
      <div className="absolute -left-20 top-0 size-80 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute -right-16 bottom-0 size-72 rounded-full bg-lime-300/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-sm font-medium text-lime-200"><FiZap /> Fast, private & free</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">Make every image fit <span className="text-lime-300">perfectly.</span></h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Resize, preview and download your images without sending them anywhere. Your image stays in your browser.</p>

        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); handleImage(event.dataTransfer.files[0]); }}
          className={`mt-10 cursor-pointer rounded-3xl border p-4 transition sm:p-6 ${isDragging ? "border-lime-300 bg-lime-300/15 shadow-2xl shadow-lime-300/10" : "border-white/15 bg-[#0a2929]/80 hover:border-lime-300/60 hover:bg-[#0c3030]"}`}
        >
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 sm:py-16">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-lime-300 text-[#092d2c] shadow-lg shadow-lime-300/20"><FiUploadCloud size={32} /></span>
            <h2 className="mt-6 text-xl font-bold text-white">{isDragging ? "Drop your image here" : "Drop an image here"}</h2>
            <p className="mt-2 text-sm text-slate-400">or click to choose a file from your device</p>
            <span className="mt-6 inline-block rounded-lg bg-white/8 px-4 py-2 text-xs font-medium text-slate-300">JPG, PNG, WEBP and GIF supported</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={(event) => handleImage(event.target.files[0])} className="hidden" />
        </div>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          {[[FiZap, "Quick editing", "Change dimensions in seconds."], [FiLock, "Private by default", "Your file never leaves your device."], [FiImage, "Ready to export", "Download a crisp PNG when done."]].map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Icon className="text-lime-300" size={20} /><h3 className="mt-3 font-semibold text-white">{title}</h3><p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"><FiCheck className="text-lime-300" /> No sign-up required</p>
      </div>
    </main>
  );
};

export default ImageInput;
