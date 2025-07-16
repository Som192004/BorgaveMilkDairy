import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const BranchForm = ({
  isEditing,
  formData,
  handleInputChange,
  handleSaveBranch,
  setIsFormOpen,
}) => {
  const { t } = useTranslation();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsFormOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          aria-label={t("branch.form.cancel")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {isEditing ? t("branch.form.editTitle") : t("branch.form.addTitle")}
        </h3>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="branchId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("branch.form.branchId")}
            </label>
            <input
              type="text"
              id="branchId"
              name="branchId"
              placeholder={t("branch.form.branchIdPlaceholder")}
              value={formData.branchId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("branch.form.address")}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder={t("branch.form.addressPlaceholder")}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
            />
          </div>
          <div>
            <label
              htmlFor="villageCity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("branch.form.villageCity")}
            </label>
            <input
              type="text"
              id="villageCity"
              name="villageCity"
              placeholder={t("branch.form.villageCityPlaceholder")}
              value={formData.villageCity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 space-x-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
          >
            {t("branch.form.cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleSaveBranch}
            className="flex-1 bg-[#2c447f] hover:bg-[#1b2d5b] text-white px-4 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2c447f] cursor-pointer"
          >
            {t("branch.form.save")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
