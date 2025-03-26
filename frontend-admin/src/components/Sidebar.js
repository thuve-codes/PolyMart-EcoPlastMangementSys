import React from 'react';
import { FiList, FiPlus, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed h-full bg-gray-800 text-white w-64 p-5">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li
          className="flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-700"
          onClick={() => navigate('/admin/dashboard?view=list')}
        >
          <FiList className="mr-2" />
          <span>Requests List</span>
        </li>
        <li
          className="flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-700"
          onClick={() => navigate('/admin/dashboard?view=create')}
        >
          <FiPlus className="mr-2" />
          <span>Create Request</span>
        </li>
        {/* Detail is automatically opened by clicking on a list item. */}
      </ul>
    </div>
  );
};

export default Sidebar;