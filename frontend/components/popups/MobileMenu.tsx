import React from 'react';
import Link from 'next/link';
export default function MobileMenu(props: {onCloseModal: any}){

    const handleCloseClick = () => {
        props.onCloseModal();
    };

    const addForm = () => {
        return (
          <div onClick={(e) => e.stopPropagation()} className="mx-auto rounded-lg w-3/4 h-1/2 border-4 border-black cursor-auto shadow-[12px_12px_0px_rgba(0,0,0,1)]">
          <div className="bg-white w-full h-full py-8 px-4 shadow rounded-md sm:px-10 " >
          <Link href="/"><p className='w-full text-center mt-12 text-2xl font-black cursor-pointer'>Home</p></Link>
              <Link href="/profile"><p className='w-full text-center mt-6 text-2xl font-black cursor-pointer'>Profile</p></Link>
              <button className='text-center w-full'><p className='w-full text-center mt-6 text-2xl font-black cursor-pointer'>Create New</p></button>
          </div>
          </div>
        )
    }

  return(
    <div className='fixed z-50 w-full h-screen flex justify-center items-center backdrop-blur-lg cursor-pointer' onClick={handleCloseClick}>
        {addForm()}
    </div>
  )
};