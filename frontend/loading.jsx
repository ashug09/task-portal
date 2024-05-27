import React from 'react';

const Loading = ({ message }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-white mt-2">{message}</p>
      </div>
    </div>
  );
};

export default Loading;