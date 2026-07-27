import React from 'react';
import Header from './Components/Header';
import ImageInput from './Components/ImageInput';
import Footer from './Components/Footer';

const App = () => {
  return (
    <div className='bg-[#17433F] min-h-screen'>
      <Header />
      <ImageInput/>
      <Footer/>
    </div>
  );
};

export default App;