import React from 'react';

const Sidebar = ({ onSelect }) => {
  return (
    <div className="h-full w-64 bg-[#FDCBD5] shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Dashboard</h2>
      <ul>
        <li className="mb-2">
          <button
            onClick={() => onSelect("Revenue")}
            className="block w-full text-left p-2 rounded hover:bg-pink-600 text-black"
          >
            Revenue
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => onSelect("Suppliers")}
            className="block w-full text-left p-2 rounded hover:bg-pink-600 text-black"
          >
            Suppliers
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => onSelect("Users")}
            className="block w-full text-left p-2 rounded hover:bg-pink-600 text-black"
          >
            Users
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => Logout()}
            className="block w-full text-left p-2 rounded hover:bg-pink-600 text-black"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
