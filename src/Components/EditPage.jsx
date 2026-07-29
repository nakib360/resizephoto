import React from 'react';

const EditPage = ({image}) => {
    return (
        <div>
            <img className='h-100 w-100 border border-[black]' src={image} alt="" />
        </div>
    );
};

export default EditPage;