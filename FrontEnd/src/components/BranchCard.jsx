import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const BranchCard = ({ branch, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#F0F8FF] shadow-lg rounded-xl p-6 border-l-4 border-blue-600 min-h-[18rem] flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-blue-600 pb-2">
          {t("branch.card.branchIdLabel")}: {branch.branchId}
        </h2>
        <p className="text-lg text-gray-700">
          <strong>{t("branch.card.addressLabel")}:</strong>{" "}
          {branch.branchAddress}
        </p>
        <p className="text-lg text-gray-700">
          <strong>{t("branch.card.villageCityLabel")}:</strong>{" "}
          {branch.location}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6 space-x-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onEdit(branch.branchId)}
          aria-label={t("branch.buttons.edit")}
          className="flex-1 bg-blue-600 text-white text-lg font-medium px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {t("branch.buttons.edit")}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onDelete(branch.branchId)}
          aria-label={t("branch.buttons.delete")}
          className="flex-1 bg-red-600 text-white text-lg font-medium px-4 py-2 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
        >
          {t("branch.buttons.delete")}
        </motion.button>
      </div>
    </motion.div>
  );
};
