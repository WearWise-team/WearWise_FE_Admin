"use client";

import React from "react";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ChartComponent from "../../components/ChartComponent";
import LineChart from "../../components/LineChart";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Revenue");
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const users = [
    {
      id: 1,
      name: "Justin Septimus",
      email: "example@email.com",
      status: "Active",
      revenue: "$200 USD",
    },
    {
      id: 2,
      name: "Anika Rhiel Madsen",
      email: "example@email.com",
      status: "Active",
      revenue: "$300 USD",
    },
    {
      id: 3,
      name: "Miracle Vaccaro",
      email: "example@email.com",
      status: "Active",
      revenue: "$250 USD",
    },
  ];

  const handleKeyDown = (event, user) => {
    if (event.key === "Enter") {
      setSelectedUser(user);
      setStatus(user.status);
      setShowForm(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Updated ${selectedUser.name} to ${status}`);
    setShowForm(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case "Revenue":
        return (
          <h1 className="text-2xl font-bold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((num) => (
                <div key={num} className="bg-white p-6 rounded shadow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Bar Chart {num}
                  </h2>
                  <div className="h-64">
                    <ChartComponent
                      chartId={`barChart${num}`}
                      data={[10 * num, 20 * num, 30 * num, 40 * num, 50 * num]}
                      title={`Bar Chart ${num}`}
                    />
                  </div>
                </div>
              ))}

              {[3, 4].map((num) => (
                <div key={num} className="bg-white p-6 rounded shadow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Line Chart {num}
                  </h2>
                  <div className="h-64">
                    <LineChart
                      chartId={`lineChart${num}`}
                      data={[5 * num, 15 * num, 25 * num, 35 * num, 45 * num]}
                      title={`Line Chart ${num}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </h1>
        );
      case "Suppliers":
        return (
          <div className="container mx-auto p-4">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded flex items-center">
                <i className="fas fa-filter mr-2"></i> Filter
              </button>
              <input
                className="ml-4 flex-1 bg-gray-100 px-4 py-2 rounded border border-gray-200"
                placeholder="Search Users by Name, Email or Date"
                type="text"
              />
            </div>
            <h1 className="text-xl font-semibold mb-4">SUPPLIER</h1>
            <div className="bg-white shadow rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Revenue</th>
                    <th className="py-3 px-6 text-left">action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          onKeyDown={(e) => handleKeyDown(e, user)}
                        />
                        {user.name}
                      </td>
                      <td className="py-3 px-6 text-left">{user.status}</td>
                      <td className="py-3 px-6 text-left">{user.revenue}</td>
                      <td className="py-3 px-6 text-left cursor-pointer">
                        View more
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showForm && selectedUser && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Update Status for {selectedUser.name}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <select
                      className="border text-black p-2 rounded w-full mb-3"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      case "Users":
        return (
          <div className="container mx-auto p-4">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded flex items-center">
                <i className="fas fa-filter mr-2"></i> Filter
              </button>
              <input
                className="ml-4 flex-1 bg-gray-100 px-4 py-2 rounded border border-gray-200"
                placeholder="Search Users by Name, Email or Date"
                type="text"
              />
            </div>
            <h1 className="text-xl font-semibold mb-4">SUPPLIER</h1>
            <div className="bg-white shadow rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          onKeyDown={(e) => handleKeyDown(e, user)}
                        />
                        {user.name}
                      </td>
                      <td className="py-3 px-6 text-left">{user.status}</td>
                      <td className="py-3 px-6 text-left cursor-pointer">
                        View more
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showForm && selectedUser && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Update Status for {selectedUser.name}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <select
                      className="border text-black p-2 rounded w-full mb-3"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <h1 className="text-2xl font-bold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((num) => (
                <div key={num} className="bg-white p-6 rounded shadow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Bar Chart {num}
                  </h2>
                  <div className="h-64">
                    <ChartComponent
                      chartId={`barChart${num}`}
                      data={[10 * num, 20 * num, 30 * num, 40 * num, 50 * num]}
                      title={`Bar Chart ${num}`}
                    />
                  </div>
                </div>
              ))}

              {[3, 4].map((num) => (
                <div key={num} className="bg-white p-6 rounded shadow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Line Chart {num}
                  </h2>
                  <div className="h-64">
                    <LineChart
                      chartId={`lineChart${num}`}
                      data={[5 * num, 15 * num, 25 * num, 35 * num, 45 * num]}
                      title={`Line Chart ${num}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </h1>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-100">
      <aside className="w-64">
        <Sidebar onSelect={setActivePage} />
      </aside>
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
