import React, { useEffect, useRef, useState } from "react";
import { FiDownload, FiImage, FiMaximize2, FiMove, FiRefreshCcw, FiRotateCcw } from "react-icons/fi";

const EditPage = ({ image, onReset }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchGesture = useRef(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [targetSize, setTargetSize] = useState("500");
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  const clampPosition = (x, y, canvasWidth, canvasHeight, currentZoom) => {
    const img = imgRef.current;
    if (!img) return { x, y };
    const maxX = Math.max(0, (img.width * currentZoom - canvasWidth) / 2);
    const maxY = Math.max(0, (img.height * currentZoom - canvasHeight) / 2);
    return { x: Math.min(Math.max(x, -maxX), maxX), y: Math.min(Math.max(y, -maxY), maxY) };
  };

  useEffect(() => {
    const img = new Image();
    img.src = image.url;
    img.onload = () => { imgRef.current = img; setWidth(img.width); setHeight(img.height); setZoom(1); setPosition({ x: 0, y: 0 }); };
  }, [image]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const canvasWidth = Number(width) || img.width;
    const canvasHeight = Number(height) || img.height;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext("2d");
    const imageWidth = img.width * zoom;
    const imageHeight = img.height * zoom;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(img, (canvasWidth - imageWidth) / 2 + position.x, (canvasHeight - imageHeight) / 2 + position.y, imageWidth, imageHeight);
  }, [width, height, zoom, position]);

  const constrainToCanvas = (nextWidth, nextHeight) => {
    const img = imgRef.current;
    if (!img) return;
    const minZoom = Math.max(nextWidth / img.width, nextHeight / img.height);
    setZoom((current) => {
      const nextZoom = Math.min(Math.max(current, minZoom), 5);
      setPosition((currentPosition) => clampPosition(currentPosition.x, currentPosition.y, nextWidth, nextHeight, nextZoom));
      return nextZoom;
    });
  };

  const updateDimension = (value, setter, otherDimension, isWidth) => {
    setter(value);
    const nextWidth = Number(isWidth ? value : otherDimension);
    const nextHeight = Number(isWidth ? otherDimension : value);
    if (nextWidth > 0 && nextHeight > 0) constrainToCanvas(nextWidth, nextHeight);
  };

  const pointInCanvas = (event) => {
    const bounds = canvasRef.current.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * (canvasRef.current.width / bounds.width), y: (event.clientY - bounds.top) * (canvasRef.current.height / bounds.height) };
  };

  const touchDistance = (firstTouch, secondTouch) => {
    const x = firstTouch.clientX - secondTouch.clientX;
    const y = firstTouch.clientY - secondTouch.clientY;
    return Math.hypot(x, y);
  };

  const startDrag = (event) => {
    const point = pointInCanvas(event);
    setDragging(true);
    dragStart.current = { x: point.x - position.x, y: point.y - position.y };
  };
  const moveDrag = (event) => {
    if (!dragging) return;
    const point = pointInCanvas(event);
    setPosition(clampPosition(point.x - dragStart.current.x, point.y - dragStart.current.y, Number(width), Number(height), zoom));
  };
  const resetView = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };
  const handleWheel = (event) => {
    if (!event.altKey || !imgRef.current) return;
    event.preventDefault();

    const canvasWidth = Number(width);
    const canvasHeight = Number(height);
    const minimumZoom = Math.max(canvasWidth / imgRef.current.width, canvasHeight / imgRef.current.height);
    const nextZoom = Math.min(5, Math.max(minimumZoom, zoom - event.deltaY * 0.001));

    setZoom(nextZoom);
    setPosition((current) => clampPosition(current.x, current.y, canvasWidth, canvasHeight, nextZoom));
  };

  const handleTouchStart = (event) => {
    if (!imgRef.current) return;
    event.preventDefault();
    const canvasWidth = Number(width) || imgRef.current.width;
    const canvasHeight = Number(height) || imgRef.current.height;

    if (event.touches.length === 1) {
      const point = pointInCanvas(event.touches[0]);
      touchGesture.current = {
        type: "drag",
        offsetX: point.x - position.x,
        offsetY: point.y - position.y,
      };
      setDragging(true);
    } else if (event.touches.length >= 2) {
      touchGesture.current = {
        type: "pinch",
        distance: touchDistance(event.touches[0], event.touches[1]),
        zoom,
        position,
        canvasWidth,
        canvasHeight,
      };
      setDragging(false);
    }
  };

  const handleTouchMove = (event) => {
    const gesture = touchGesture.current;
    if (!gesture || !imgRef.current) return;
    event.preventDefault();

    if (event.touches.length === 1 && gesture.type === "drag") {
      const point = pointInCanvas(event.touches[0]);
      setPosition(clampPosition(point.x - gesture.offsetX, point.y - gesture.offsetY, Number(width), Number(height), zoom));
    } else if (event.touches.length >= 2 && gesture.type === "pinch") {
      const minimumZoom = Math.max(gesture.canvasWidth / imgRef.current.width, gesture.canvasHeight / imgRef.current.height);
      const scale = touchDistance(event.touches[0], event.touches[1]) / gesture.distance;
      const nextZoom = Math.min(5, Math.max(minimumZoom, gesture.zoom * scale));
      setZoom(nextZoom);
      setPosition(clampPosition(gesture.position.x, gesture.position.y, gesture.canvasWidth, gesture.canvasHeight, nextZoom));
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length === 1) {
      const point = pointInCanvas(event.touches[0]);
      touchGesture.current = {
        type: "drag",
        offsetX: point.x - position.x,
        offsetY: point.y - position.y,
      };
      setDragging(true);   
    } else {
      touchGesture.current = null;
      setDragging(false);
    }
  };
  const createJpeg = (canvas, quality) => new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });

  const canvasAtSize = (source, nextWidth, nextHeight) => {
    const output = document.createElement("canvas");
    output.width = nextWidth;
    output.height = nextHeight;
    const context = output.getContext("2d");
    // JPEG has no transparency, so keep transparent PNG areas white.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, nextWidth, nextHeight);
    context.drawImage(source, 0, 0, nextWidth, nextHeight);
    return output;
  };

  const bestJpegForTarget = async (source, targetBytes) => {
    const highestQuality = await createJpeg(source, 0.98);
    if (highestQuality.size <= targetBytes) return highestQuality;

    const lowestQuality = await createJpeg(source, 0.02);
    if (lowestQuality.size > targetBytes) return null;

    let low = 0.02;
    let high = 0.98;
    let closest = lowestQuality;
    for (let attempt = 0; attempt < 14; attempt += 1) {
      const quality = (low + high) / 2;
      const candidate = await createJpeg(source, quality);
      if (candidate.size <= targetBytes) {
        closest = candidate;
        low = quality;
      } else {
        high = quality;
      }
    }
    return closest;
  };

  const download = async () => {
    const canvas = canvasRef.current;
    const exportWidth = Number(width);
    const exportHeight = Number(height);
    const requestedSize = Number(targetSize);
    if (!canvas || !exportWidth || !exportHeight || !requestedSize) return;
    const targetBytes = requestedSize * 1024;
    setIsExporting(true);
    setExportMessage("");

    let outputCanvas = canvasAtSize(canvas, exportWidth, exportHeight);
    let file = await bestJpegForTarget(outputCanvas, targetBytes);
    let outputWidth = exportWidth;
    let outputHeight = exportHeight;

    // When quality alone cannot reach the requested KB, progressively reduce
    // the export resolution. This makes the KB target effective even for very
    // large images or very small requested sizes.
    for (let attempt = 0; !file && attempt < 16; attempt += 1) {
      outputWidth = Math.max(1, Math.floor(outputWidth * 0.8));
      outputHeight = Math.max(1, Math.floor(outputHeight * 0.8));
      outputCanvas = canvasAtSize(canvas, outputWidth, outputHeight);
      file = await bestJpegForTarget(outputCanvas, targetBytes);
      if (outputWidth === 1 && outputHeight === 1) break;
    }

    const dimensionsChanged = outputWidth !== exportWidth || outputHeight !== exportHeight;
    const message = dimensionsChanged
      ? `Target reached by reducing export dimensions to ${outputWidth} × ${outputHeight}px.`
      : "Optimized to the closest size without going over your target.";

    if (file) {
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const baseName = image.name.replace(/\.[^/.]+$/, "") || "image";
      const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "").replace("T", "-");
      link.download = `${baseName}-${timestamp}-resizepicture.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setExportMessage(`${message} Exported ${(file.size / 1024).toFixed(1)} KB as JPG.`);
    } else {
      setExportMessage("This target is too small to create a usable image. Please use a larger KB value.");
    }
    setIsExporting(false);
  };
  const applyPreset = (presetWidth, presetHeight) => { setWidth(presetWidth); setHeight(presetHeight); constrainToCanvas(presetWidth, presetHeight); };

  const originalWidth = imgRef.current?.width;
  const originalHeight = imgRef.current?.height;
  const originalSize = image.size ? `${(image.size / 1024).toFixed(1)} KB` : "–";

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#0b3534] px-4 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold text-lime-300">IMAGE WORKSPACE</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Resize your image</h1><p className="mt-2 text-sm text-slate-400">Drag to reposition · Hold Alt and scroll to zoom · Pinch to zoom on touch screens</p></div>
          <button onClick={onReset} className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/35 hover:bg-white/5"><FiRotateCcw /> Choose another image</button>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
          <section className="rounded-3xl border border-white/10 bg-[#082b2b] p-3 shadow-2xl shadow-black/15 sm:p-5">
            <div className="mb-4 flex items-center justify-between px-1 text-xs font-medium text-slate-400"><span className="flex items-center gap-2"><FiImage className="text-lime-300" /> Live preview</span><span>{width || "–"} × {height || "–"} px</span></div>
            <div className="flex min-h-75 items-center justify-center overflow-auto rounded-2xl bg-[#061f20] p-3" style={{ backgroundImage: "linear-gradient(45deg, #0a2b2c 25%, transparent 25%), linear-gradient(-45deg, #0a2b2c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0a2b2c 75%), linear-gradient(-45deg, transparent 75%, #0a2b2c 75%)", backgroundSize: "22px 22px", backgroundPosition: "0 0, 0 11px, 11px -11px, -11px 0" }}>
              <div className="relative inline-block max-w-full">
                <canvas ref={canvasRef} onMouseDown={startDrag} onMouseMove={moveDrag} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)} onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd} className="block max-h-130 max-w-full touch-none cursor-move rounded-sm shadow-2xl" />
                <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, #d1fae5 1px, transparent 1px), linear-gradient(to bottom, #d1fae5 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-400"><span className="flex items-center gap-1.5"><FiMove /> Drag image to adjust framing</span><button onClick={resetView} className="inline-flex items-center gap-1.5 text-lime-300 hover:text-lime-200"><FiRefreshCcw /> Reset position</button></div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-[#f5f7f3] p-5 shadow-xl sm:p-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5"><span className="grid size-10 place-items-center rounded-xl bg-[#0b3534] text-lime-300"><FiMaximize2 /></span><div><h2 className="font-bold text-slate-900">Output size</h2><p className="text-xs text-slate-500">Set your exact dimensions</p></div></div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-slate-600">WIDTH<input type="number" min="1" value={width} onChange={(event) => updateDimension(event.target.value, setWidth, height, true)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15" /></label>
              <label className="text-xs font-semibold text-slate-600">HEIGHT<input type="number" min="1" value={height} onChange={(event) => updateDimension(event.target.value, setHeight, width, false)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15" /></label>
            </div>
            <div className="mt-6"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick presets</p><div className="mt-3 grid grid-cols-2 gap-2">{[[1080, 1080, "Square"], [1080, 1350, "Portrait"], [1200, 630, "Landscape"], [1920, 1080, "HD"]].map(([presetWidth, presetHeight, name]) => <button key={name} onClick={() => applyPreset(presetWidth, presetHeight)} className="rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800">{name}<span className="ml-1 text-slate-400">{presetWidth}×{presetHeight}</span></button>)}</div></div>
            <div className="mt-6 border-t border-slate-200 pt-6"><label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Target file size (KB)<input type="number" min="1" value={targetSize} onChange={(event) => setTargetSize(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15" /></label><p className="mt-2 text-xs leading-5 text-slate-500">Downloads as JPG and keeps the file at or below this KB target.</p></div>
            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-xs text-slate-600"><div className="flex justify-between"><span>Original</span><strong>{originalWidth || "–"} × {originalHeight || "–"}</strong></div><div className="mt-2 flex justify-between"><span>Original size</span><strong>{originalSize}</strong></div><div className="mt-2 flex justify-between"><span>Zoom</span><strong>{Math.round(zoom * 100)}%</strong></div></div>
            <button onClick={download} disabled={isExporting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b3534] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#124846] disabled:cursor-wait disabled:opacity-70"><FiDownload /> {isExporting ? "Optimizing…" : "Download JPG"}</button>
            {exportMessage && <p className="mt-3 text-center text-xs leading-5 text-teal-700">{exportMessage}</p>}
            </aside>
        </div>
      </div>
    </main>
  );
};

export default EditPage;  
