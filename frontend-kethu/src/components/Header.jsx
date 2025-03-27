import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

const Header = () => {

  const {userData} = useContext(AppContent);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hello {userData ? userData.name : 'Customer'}!
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to PolyMart
      </h2>

      <p className="mb-6 max-w-md">
      PolyMart is a plastic waste management system that allows users to recycle plastic and earn rewards. Non-registered users can browse products, registered users can order plastic items, and eco-registered users can drop off plastic waste at collection centers to earn points. The system promotes sustainability by encouraging plastic recycling through a reward-based approach. ♻️
      </p>

      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-300 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
