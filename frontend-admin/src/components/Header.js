import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center">
      <h2 className="text-lg font-bold">Plastic Request Admin</h2>
      <button
        onClick={handleSignOut}
        className="text-red-500 font-bold hover:text-red-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Header;