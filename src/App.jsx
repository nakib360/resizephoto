import React, { useRef, useState } from "react";
import Header from "./Components/Header";
import ImageInput from "./Components/ImageInput";
import Footer from "./Components/Footer";
import EditPage from "./Components/EditPage";

const App = () => {
  const [image, setImage] = useState(null);
  const uploadSectionRef = useRef(null);
  const showUpload = () => {
    setImage(null);
    requestAnimationFrame(() => uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className="min-h-screen bg-[#0b3534] font-sans">
      <Header onGetStarted={showUpload} />
      <div ref={uploadSectionRef}>{image ? <EditPage image={image} onReset={showUpload} /> : <ImageInput setImage={setImage} />}</div>
      <Footer />
    </div>
  );
};

export default App;
