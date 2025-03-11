import React, { useState } from "react";

const Sidebar = ({ onSelect }) => {
  const [activePage, setActivePage] = useState("Revenue");
  const [isUsersOpen, setIsUsersOpen] = useState(false);

  const handleSelect = (page) => {
    setActivePage(page);
    onSelect(page);
  };

  return (
    <div className="h-full w-64 bg-[#FDCBD5] shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Dashboard</h2>
      <ul>
        {["Revenue", "Suppliers"].map((page) => (
          <li key={page} className="mb-2">
            <button
              onClick={() => handleSelect(page)}
              className={`block w-full text-left p-2 rounded text-black transition ${
                activePage === page
                  ? "bg-pink-600 text-white"
                  : "hover:bg-pink-600"
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Users với submenu */}
        <li className="mb-2">
          <button
            onClick={() => setIsUsersOpen(!isUsersOpen)}
            className={`block w-full text-left p-2 rounded text-black transition ${
              activePage.includes("Users")
                ? "bg-pink-600 text-white"
                : "hover:bg-pink-600"
            }`}
          >
            Users
          </button>

          {/* Submenu */}
          {isUsersOpen && (
            <ul className="ml-4 mt-2">
              {["All Users", "Inactive Users"].map((subPage) => (
                <li key={subPage} className="mb-1">
                  <button
                    onClick={() => handleSelect(subPage)}
                    className={`block w-full text-left p-2 rounded text-black transition ${
                      activePage === subPage
                        ? "bg-pink-400 text-white"
                        : "hover:bg-pink-400"
                    }`}
                  >
                    {subPage}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
