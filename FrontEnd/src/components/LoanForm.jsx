import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const LoanForm = ({
  setIsFormOpen,
  handleSaveLoan,
  isEditing,
  editingLoan,
}) => {
  const initialFormData = {
    farmerId: "",
    farmerName: "",
    mobileNumber: "",
    loanAmount: "",
    loanDate: new Date().toISOString().split("T")[0],
  };
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [farmers, setFarmers] = useState([]);

  // When editing, prefill the form with the provided loan values.
  // Ensure each field is defined so that inputs remain controlled.
  useEffect(() => {
    if (isEditing && editingLoan) {
      setFormData({
        farmerId: editingLoan.farmerId || "",
        farmerName: editingLoan.farmerName || "",
        mobileNumber: editingLoan.mobileNumber || "",
        loanAmount: editingLoan.loanAmount || "",
        loanDate: editingLoan.loanDate
          ? editingLoan.loanDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [isEditing, editingLoan]);

  // Fetch the list of farmers from the backend
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          "https://borgavemilkdairybackend.onrender.com/api/v1/farmer/get-all-farmers",
          { withCredentials: true, headers : {
            authorization: `Bearer ${accessToken}`
          } }
        );
        const fetchedFarmers = response.data.data || response.data;
        setFarmers(fetchedFarmers);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };
    fetchFarmers();
  }, []);

  // Auto-populate farmer details when farmer ID changes
  useEffect(() => {
    if (formData.farmerId) {
      const selectedFarmer = farmers.find(
        (farmer) => farmer.farmerId === parseInt(formData.farmerId)
      );
      if (selectedFarmer) {
        setFormData((prev) => ({
          ...prev,
          farmerName: selectedFarmer.farmerName,
          mobileNumber: selectedFarmer.mobileNumber,
        }));
      }
    }
  }, [formData.farmerId, farmers]);

  // Update the form data and clear errors for the changed field
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate the form data
  const validate = () => {
    const newErrors = {};
    if (!formData.farmerId) {
      newErrors.farmerId = "Farmer ID is required.";
    }
    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = "Loan amount must be a positive number.";
    }
    if (!formData.loanDate) {
      newErrors.loanDate = "Loan date is required.";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await handleSaveLoan(formData);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving loan:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg relative"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Loan" : "New Loan"}
          </h3>
          <button
            onClick={() => setIsFormOpen(false)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close form"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Farmer Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Farmer ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farmer ID
                </label>
                <input
                  type="number"
                  name="farmerId"
                  value={formData.farmerId}
                  onChange={handleChange}
                  placeholder="Enter farmer ID"
                  className={`w-full px-4 py-2 border ${
                    errors.farmerId ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.farmerId && (
                  <p className="text-red-500 text-xs mt-1">{errors.farmerId}</p>
                )}
              </div>

              {/* Farmer Name (Auto-populated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>

            {/* Contact Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mobile Number (Auto-populated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  placeholder="Enter loan amount"
                  className={`w-full px-4 py-2 border ${
                    errors.loanAmount ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.loanAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.loanAmount}
                  </p>
                )}
              </div>
            </div>

            {/* Loan Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Date
              </label>
              <input
                type="date"
                name="loanDate"
                value={formData.loanDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.loanDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.loanDate && (
                <p className="text-red-500 text-xs mt-1">{errors.loanDate}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6 sm:mt-8 space-x-2 sm:space-x-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg transition duration-200 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#2c447f] hover:bg-[#1b2d5b] text-white px-3 sm:px-4 py-2 rounded-lg transition duration-200 focus:outline-none"
              >
                {isEditing ? "Update" : "Add"} Loan
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoanForm;
