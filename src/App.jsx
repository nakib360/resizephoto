import React from 'react';
import Header from './Components/Header';
import ImageInput from './Components/ImageInput';
import Footer from './Components/Footer';
import EditPage from './Components/EditPage';

const App = () => {
  return (
    <div className='bg-[#17433F] min-h-screen'>
      <Header />
      <ImageInput/>
      <EditPage/>
      <Footer/>
    </div>
  );
};

export default App;