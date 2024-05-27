import React from "react";

const HorizontalCard = ({ title, rewards, category }) => {
  return (
    <div className="lg:w-[70%] mx-auto relative bg-gray-100 rounded-lg p-6 shadow-md flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
      <div className="flex-shrink-0">
        <img
          className="h-24 w-24 rounded-full"
          src="https://via.placeholder.com/150"
          alt="Card Image"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800">
          Social Media Marketing
        </h2>
        <p className="text-gray-600 mb-2 bg-white rounded-lg py-1 px-5 w-max border-2 border-blue-500">Marketing</p>
      </div>
      <div className="bg-white rounded-l-lg shadow-md py-1 px-5 absolute bottom-1/2 right-0 border-2 border-green-500">
        $0.002
      </div>
    </div>
  );
};

export default HorizontalCard;
