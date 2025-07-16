import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const SubAdminCard = ({ subAdmin, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [villageCity, setVillageCity] = useState("");

  useEffect(() => {
    // Retrieve branches from localStorage
    const storedBranches = JSON.parse(localStorage.getItem("branches")) || [];
    // Find the branch matching the subAdmin's branchId
    const branch = storedBranches.find(
      (branch) => branch.branchId === subAdmin.branch.branchId
    );
    if (branch) {
      setVillageCity(branch.villageCity);
    }
  }, [subAdmin.branch.branchId]);

  // Use the villageCity if available; otherwise, fallback to subAdmin.branch.location
  const displayedVillageCity = villageCity || subAdmin.branch.location;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
      }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-2xl overflow-hidden flex flex-col items-center p-6 space-y-4 border border-gray-200 text-center transition-transform"
      role="article"
      aria-label={`Sub-admin card for ${subAdmin.name}`}
    >
      {/* Profile Image */}
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
        <img
          src={subAdmin.profilePicture}
          alt={t("subAdmin.card.imageAlt", { name: subAdmin.name })}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Sub-Admin Name */}
      <h3 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
        {subAdmin.name}
      </h3>

      {/* Details Section */}
      <div className="w-full text-left space-y-2 text-gray-700">
        <p className="text-base">
          <span className="font-semibold">{t("subAdmin.card.mobile")}:</span>{" "}
          {subAdmin.mobileNumber}
        </p>

        {/* Password Field with Toggle */}
        <div className="relative flex items-center text-base">
          <span className="font-semibold">{t("subAdmin.card.password")}:</span>
          <span className="ml-2 font-mono">
            {showPassword ? subAdmin.subAdminPassword : "••••••••"}
          </span>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-3 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
            aria-label={t("subAdmin.card.togglePassword")}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        <p className="text-base">
          <span className="font-semibold">{t("subAdmin.card.address")}:</span>{" "}
          {subAdmin.address}
        </p>
        <p className="text-base">
          <span className="font-semibold">{t("subAdmin.card.branchId")}:</span>{" "}
          {subAdmin.branch.branchId}
        </p>
        <p className="text-base">
          <span className="font-semibold">
            {t("subAdmin.card.villageCity")}:
          </span>{" "}
          {displayedVillageCity}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between space-x-4 w-full">
        <button
          onClick={() => onEdit(subAdmin.id)}
          className="flex-1 bg-blue-600 text-white text-base px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          aria-label={t("subAdmin.buttons.edit")}
        >
          {t("subAdmin.buttons.edit")}
        </button>
        <button
          onClick={() => onDelete(subAdmin.id)}
          className="flex-1 bg-red-600 text-white text-base px-4 py-2 rounded-lg shadow-md hover:bg-red-500 hover:shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          aria-label={t("subAdmin.buttons.delete")}
        >
          {t("subAdmin.buttons.delete")}
        </button>
      </div>
    </motion.div>
  );
};

export default SubAdminCard;
