import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MilkForm = ({
  isEditing,
  handleSaveMilkEntry,
  setIsFormOpen,
  editingEntry,
  farmers = [],
}) => {
  const getTransactionTime = () => {
    const currentHour = new Date().getHours();
    return currentHour < 15 ? "morning" : "evening"; // Before 3 PM → Morning, After 3 PM → Evening
  };

  const initialFormData = {
    farmerNumber: "",
    farmerId: "",
    transactionDate: new Date().toISOString().split("T")[0],
    transactionTime: getTransactionTime(),
    milkType: "",
    milkQuantity: "",
    fatPercentage: "",
    snfPercentage: "",
    pricePerLitre: "0", // Will be calculated
    transactionAmount: "0", // Will be calculated
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const defaultSnf = 8.0;
  const defaultFat = 3.0;
  const defaultValuePerLitre = 27.8;

  // Function to calculate updated valuePerLitre
  const calculateValuePerLitre = (inputSnf, inputFat) => {
    let valuePerLitre = defaultValuePerLitre;
    const snfChange = (inputSnf - defaultSnf).toFixed(2);
    const fatChange = (inputFat - defaultFat).toFixed(2);

    // console.log(snfChange, fatChange);

    if (Math.abs(snfChange) == parseFloat(0.4)) {
      valuePerLitre += 0.3 * 3 + 1.5;
    } else if (Math.abs(snfChange >= parseFloat(0.5))) {
      valuePerLitre += 0.4 * 3 + 1.5;
      valuePerLitre += snfChange - 0.5;
    } else {
      valuePerLitre += snfChange * 3;
    }

    if (Math.abs(fatChange)) {
      valuePerLitre += fatChange * 3;
    }

    return valuePerLitre;
  };

  // Auto-populate farmer name when farmer ID changes
  useEffect(() => {
    if (formData.farmerId) {
      const selectedFarmer = farmers.find(
        (farmer) => farmer.farmerId === parseInt(formData.farmerId)
      );
      if (selectedFarmer) {
        setFormData((prev) => ({
          ...prev,
          farmerNumber: selectedFarmer.mobileNumber,
        }));
      }
    }
  }, [formData.farmerId, farmers]);

  useEffect(() => {
    if (isEditing && editingEntry) {
      const {
        farmerNumber,
        farmerId,
        transactionDate,
        milkType,
        milkQuantity,
        fatPercentage,
        snfPercentage,
        pricePerLitre,
        transactionAmount,
      } = editingEntry;
      setFormData({
        farmerNumber: farmerNumber || "",
        farmerId: farmerId || "",
        transactionDate: transactionDate
          ? new Date(transactionDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        transactionTime: getTransactionTime() || "",
        milkType: milkType || "",
        milkQuantity: milkQuantity || "",
        fatPercentage: fatPercentage || "",
        snfPercentage: snfPercentage || "",
        pricePerLitre: pricePerLitre || "0",
        transactionAmount: transactionAmount || "0",
      });
    }
  }, [isEditing, editingEntry]);

  // Calculate price based on fat and SNF percentages
  // Backend Note: Price calculation formula - (fat% * PRICE_PER_FAT) + (snf% * PRICE_PER_SNF)
  const calculatePricePerLitre = (fat, snf, quantity) => {
    if (!fat || !snf || !quantity) return 0;
    const fatAmount =
      (parseFloat(fat) / 100) * parseFloat(quantity) * PRICE_PER_FAT;
    const snfAmount =
      (parseFloat(snf) / 100) * parseFloat(quantity) * PRICE_PER_SNF;
    return (fatAmount + snfAmount) / parseFloat(quantity);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Calculate price per litre and transaction amount when relevant fields change
    if (["fatPercentage", "snfPercentage", "milkQuantity"].includes(name)) {
      const snf = parseFloat(newFormData.snfPercentage) || defaultSnf;
      const fat = parseFloat(newFormData.fatPercentage) || defaultFat;
      const quantity = parseFloat(newFormData.milkQuantity) || 0;

      // Calculate pricePerLitre using available or default values
      const updatedValuePerLitre = calculateValuePerLitre(snf, fat);
      newFormData.pricePerLitre = updatedValuePerLitre.toFixed(2);

      // Calculate transactionAmount if quantity is available
      newFormData.transactionAmount = quantity
        ? (updatedValuePerLitre * quantity).toFixed(2)
        : "0";
    }

    setFormData(newFormData);
    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Backend Note: Validation rules for milk entry
  const validate = () => {
    const newErrors = {};
    if (!formData.farmerNumber) {
      newErrors.farmerNumber = "Please select a farmer.";
    }
    if (!formData.farmerId) {
      newErrors.farmerId = "Farmer ID is required.";
    } else if (isNaN(formData.farmerId) || parseInt(formData.farmerId) <= 0) {
      newErrors.farmerId = "Farmer ID must be a positive number.";
    }
    if (!formData.transactionDate) {
      newErrors.transactionDate = "Transaction date is required.";
    }
    if (!formData.transactionTime) {
      newErrors.transactionTime = "Please select transaction time.";
    }
    if (!formData.milkType) {
      newErrors.milkType = "Please select a milk type.";
    }
    if (!formData.milkQuantity) {
      newErrors.milkQuantity = "Milk quantity is required.";
    } else if (parseFloat(formData.milkQuantity) <= 0) {
      newErrors.milkQuantity = "Milk quantity must be greater than 0.";
    }
    if (!formData.fatPercentage) {
      newErrors.fatPercentage = "Fat percentage is required.";
    } else if (
      parseFloat(formData.fatPercentage) <= 0 ||
      parseFloat(formData.fatPercentage) > 100
    ) {
      newErrors.fatPercentage = "Fat percentage must be between 0 and 100.";
    }
    if (!formData.snfPercentage) {
      newErrors.snfPercentage = "SNF percentage is required.";
    } else if (
      parseFloat(formData.snfPercentage) <= 0 ||
      parseFloat(formData.snfPercentage) > 100
    ) {
      newErrors.snfPercentage = "SNF percentage must be between 0 and 100.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Backend Note: All monetary values are sent as strings with 2 decimal places
    handleSaveMilkEntry(formData);
    setIsFormOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 overflow-y-auto z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="milk-form-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg relative"
      >
        {/* Close Icon */}
        <button
          onClick={() => setIsFormOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          aria-label="Close Milk Form"
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

        <h3
          id="milk-form-title"
          className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6"
        >
          {isEditing ? "Edit Milk Entry" : "New Milk Entry"}
        </h3>

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
              <select
                name="farmerNumber"
                value={formData.farmerNumber}
                onChange={handleChange}
                disabled={!!formData.farmerId}
                className={`w-full px-4 py-2 border ${
                  errors.farmerNumber ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.farmerId ? "bg-gray-50" : ""
                }`}
                required
              >
                <option value="">Select Farmer</option>
                {farmers.map((farmer) => (
                  <option key={farmer._id} value={farmer.mobileNumber}>
                    {farmer.farmerName} ({farmer.mobileNumber})
                  </option>
                ))}
              </select>
              {errors.farmerNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.farmerNumber}
                </p>
              )}
            </div>
          </div>

          {/* Transaction Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transaction Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Date
              </label>
              <input
                type="date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.transactionDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.transactionDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.transactionDate}
                </p>
              )}
            </div>

            {/* Transaction Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Time
              </label>
              <input
                type="text"
                name="transactionTime"
                value={formData.transactionTime}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />

              {errors.transactionTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.transactionTime}
                </p>
              )}
            </div>
          </div>

          {/* Milk Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milk Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milk Type
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
                <option value="">Select type</option>
                <option value="Cow">Cow</option>
                <option value="Buffalo">Buffalo</option>
              </select>
              {errors.milkType && (
                <p className="text-red-500 text-xs mt-1">{errors.milkType}</p>
              )}
            </div>

            {/* Milk Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milk Quantity (Liters)
              </label>
              <input
                type="number"
                name="milkQuantity"
                value={formData.milkQuantity}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.milkQuantity ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.milkQuantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.milkQuantity}
                </p>
              )}
            </div>
          </div>

          {/* Quality Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fat Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fat Percentage (%)
              </label>
              <input
                type="number"
                name="fatPercentage"
                value={formData.fatPercentage}
                onChange={handleChange}
                placeholder="Enter fat percentage"
                className={`w-full px-4 py-2 border ${
                  errors.fatPercentage ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.fatPercentage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fatPercentage}
                </p>
              )}
            </div>

            {/* SNF Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SNF Percentage (%)
              </label>
              <input
                type="number"
                name="snfPercentage"
                value={formData.snfPercentage}
                onChange={handleChange}
                placeholder="Enter SNF percentage"
                className={`w-full px-4 py-2 border ${
                  errors.snfPercentage ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.snfPercentage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.snfPercentage}
                </p>
              )}
            </div>
          </div>

          {/* Price Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Per Litre (Calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Litre (₹)
              </label>
              <input
                type="number"
                name="pricePerLitre"
                value={formData.pricePerLitre}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* Transaction Amount (Calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Amount (₹)
              </label>
              <input
                type="number"
                name="transactionAmount"
                value={formData.transactionAmount}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
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
              {isEditing ? "Update" : "Save"} Milk Entry
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MilkForm;
