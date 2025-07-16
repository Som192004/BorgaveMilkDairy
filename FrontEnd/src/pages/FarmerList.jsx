import React, { useState, useEffect } from "react";
import axios from "axios";
import FarmerForm from "../components/FarmerForm.jsx";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext" ;
export const FarmerList = () => {
  const { t } = useTranslation();

  // State for farmers, modal visibility, and deletion/editing helpers
  const [farmers, setFarmers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState(null);
  const { accessToken } = useAuth();
  // Fetch farmers from the backend API on mount
  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          "https://borgavemilkdairybackend.onrender.com/api/v1/farmer/get-all-farmers",
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        // Assume the API returns { data: [farmer1, farmer2, ...] } or simply an array.
        const fetchedFarmers = response.data.data || response.data;
        setFarmers(fetchedFarmers);
        setError(null);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError("Error fetching farmers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  // Automatically clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Save (add or update) a farmer via API
  const handleSaveFarmer = async (farmer) => {
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (editingFarmer) {
        // Update existing farmer (PATCH request)
        const response = await axios.patch(
          `https://borgavemilkdairybackend.onrender.com/api/v1/farmer/update/${editingFarmer._id}`,
          farmer,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        const updatedFarmer = response.data.data || response.data;
        setFarmers((prevFarmers) =>
          prevFarmers.map((f) =>
            f._id === editingFarmer._id ? updatedFarmer : f
          )
        );
        setEditingFarmer(null);
      } else {
        // Add new farmer (POST request)
        console.log("farmer: " , farmer)
        const response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/farmer/addFarmer",
          farmer,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        const newFarmer = response.data.data || response.data;
        setFarmers((prevFarmers) => [...prevFarmers, newFarmer]);
      }
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      console.error("Error saving farmer:", err);
      if (err.request.status === 409) {
        setError("Farmer already exists");
      } else if (err.request.status === 400) {
        setError("Please fill all fields");
      } else {
        setError(
          err.response?.data?.message ||
            "Error saving farmer. Please try again."
        );
      }
    }
  };

  // Open the form for editing a farmer
  const handleEdit = (farmer) => {
    setEditingFarmer(farmer);
    setIsFormOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (farmer) => {
    setFarmerToDelete(farmer);
    setDeleteModalOpen(true);
  };

  // Delete a farmer via API
  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`https://borgavemilkdairybackend.onrender.com/api/v1/farmer/delete/${id}`, {
        withCredentials: true,
        headers : {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setFarmers((prevFarmers) => prevFarmers.filter((f) => f._id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting farmer:", err);
      setError(
        err.response?.data?.message ||
          "Error deleting farmer. Please try again later."
      );
    } finally {
      setDeleteModalOpen(false);
      setFarmerToDelete(null);
    }
  };

  // Filter farmers based on search query
  const filteredFarmers = farmers.filter((farmer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      farmer.farmerName.toLowerCase().includes(searchLower) ||
      farmer.mobileNumber.includes(searchQuery) ||
      farmer.farmerId.toString().includes(searchQuery) ||
      farmer.address.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen p-6 relative">
      <h2 className="text-4xl font-bold text-blue-800 text-center mb-10">
        {t("Farmer")}
      </h2>

      {error && (
        <div className="bg-red-200 text-red-800 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Farmers Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Farmer ID</th>
              <th className="px-4 py-3 text-left">Farmer Name</th>
              <th className="px-4 py-3 text-left">Mobile Number</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  Loading farmers...
                </td>
              </tr>
            ) : filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer) => (
                <tr
                  key={farmer._id}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3">{farmer.farmerId}</td>
                  <td className="px-4 py-3">{farmer.farmerName}</td>
                  <td className="px-4 py-3">{farmer.mobileNumber}</td>
                  <td className="px-4 py-3">{farmer.address}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(farmer)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded mr-2 transition duration-150 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(farmer)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition duration-150 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No farmers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Farmer Button */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          setEditingFarmer(null);
        }}
        className="fixed bottom-6 right-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full shadow-lg transition duration-200 cursor-pointer"
      >
        + Add Farmer
      </button>

      {/* Farmer Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <FarmerForm
              isEditing={!!editingFarmer}
              handleSaveFarmer={handleSaveFarmer}
              setIsFormOpen={setIsFormOpen}
              editingFarmer={editingFarmer}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && farmerToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
            >
              <h3 className="text-xl font-semibold text-center mb-4">
                Confirm Delete
              </h3>
              <p className="text-center mb-6">
                Are you sure you want to delete{" "}
                <strong>{farmerToDelete.farmerName}</strong>?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(farmerToDelete._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerList;
