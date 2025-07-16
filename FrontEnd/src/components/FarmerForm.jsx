import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FarmerForm = ({
  isEditing,
  handleSaveFarmer,
  setIsFormOpen,
  editingFarmer,
}) => {
  const initialFormData = {
    farmerName: "",
    farmerId: "",
    mobileNumber: "",
    address: "",
    gender: "",
    milkType: "",
    joiningDate: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && editingFarmer) {
      // Ensure that the joiningDate is in YYYY-MM-DD format if needed
      setFormData(editingFarmer);
    }
  }, [isEditing, editingFarmer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    handleSaveFarmer(formData);
    setIsFormOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.farmerName) {
      newErrors.farmerName = "Farmer name is required.";
    }
    if (!formData.farmerId) {
      newErrors.farmerId = "Farmer ID is required.";
    } else if (isNaN(formData.farmerId) || parseInt(formData.farmerId) <= 0) {
      newErrors.farmerId = "Farmer ID must be a positive number.";
    }
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }
    if (!formData.address) {
      newErrors.address = "Address is required.";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }
    if (!formData.milkType) {
      newErrors.milkType = "Milk type is required.";
    }
    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required.";
    }
    return newErrors;
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
            {isEditing ? "Edit Farmer" : "New Farmer"}
          </h3>
          <button
            onClick={() => setIsFormOpen(false)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
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
            {/* Basic Details Row */}
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

              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                  placeholder="Enter farmer name"
                  className={`w-full px-4 py-2 border ${
                    errors.farmerName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.farmerName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.farmerName}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-2 border ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Address and Milk Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows="2"
                  className={`w-full px-4 py-2 border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* Milk Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Milk
                </label>
                <select
                  name="milkType"
                  value={formData.milkType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.milkType ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="">Select milk type</option>
                  <option value="Cow">Cow</option>
                  <option value="Buffalo">Buffalo</option>
                  <option value="Both">Both</option>
                </select>
                {errors.milkType && (
                  <p className="text-red-500 text-xs mt-1">{errors.milkType}</p>
                )}
              </div>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.joiningDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.joiningDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.joiningDate}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6 sm:mt-8 space-x-2 sm:space-x-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg transition duration-200 focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#2c447f] hover:bg-[#1b2d5b] text-white px-3 sm:px-4 py-2 rounded-lg transition duration-200 focus:outline-none cursor-pointer"
              >
                {isEditing ? "Update" : "Add"} Farmer
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerForm;
