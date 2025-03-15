"use client"

import React, { useState } from "react"
import { deleteSupplier } from "@/api/supplier/page"
import { useNotification } from "./NotificationService";

const Supplier = ({ suppliers, updateStatus }) => {
  const [status, setStatus] = useState("")
  const [localShowForm, setLocalShowForm] = useState(false)
  const [localSelectedSupplier, setLocalSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const notify = useNotification()

  const handleKeyDown = (event, supplier) => {
    if (event.key === "Enter") {
      handleViewMore(supplier)
    }
  }

  const handleViewMore = (supplier) => {
    setLocalSelectedSupplier(supplier)
    setStatus(supplier.deleted_at ? "Inactive" : "Active")
    setLocalShowForm(true)
  }

  const handleSubmit = async (id) => {
    try {
      const response = await deleteSupplier(id);
      if (!response) throw new Error("No response from server");
  
      notify("Supplier has been deleted.", "", "topRight");
      updateStatus(); 
    } catch (error) {
      console.error("Error deleting supplier:", error);
      notify("An error occurred. Please try again.", "error", "topRight");
    }
  
    setLocalShowForm(false);
  };
  
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">SUPPLIERS</h1>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left flex items-center">
                  {supplier.name}
                </td>
                <td className="py-3 px-6 text-left">{supplier.phone}</td>
                <td className="py-3 px-6 text-left">{supplier.address}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      supplier.deleted_at ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                    }`}
                  >
                    {supplier.deleted_at ? "Inactive" : "Active"}
                  </span>
                </td>
                <td
                  className="py-3 px-6 text-left cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => handleViewMore(supplier)}
                >
                  View more
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {localShowForm && localSelectedSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Update Status for {localSelectedSupplier.name}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  className="border text-black p-2 rounded w-full mb-3 bg-gray-100"
                  value={localSelectedSupplier.name}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input
                  type="text"
                  className="border text-black p-2 rounded w-full mb-3 bg-gray-100"
                  value={localSelectedSupplier.phone}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input
                  type="text"
                  className="border text-black p-2 rounded w-full mb-3 bg-gray-100"
                  value={localSelectedSupplier.address}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select
                  className="border text-black p-2 rounded w-full mb-3"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setLocalShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(localSelectedSupplier.id)}
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
  )
}

export default Supplier
