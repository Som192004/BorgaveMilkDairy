import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const ErrorDialog = ({ errors, onClose }) => {
  const dialogRef = useRef(null);

  // Auto-focus the dialog when it mounts
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.focus();
    }
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 z-50"
      role="alertdialog"
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative outline-none"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          aria-label="Close Error Dialog"
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

        {/* Header with Icon */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M5.121 5.121a9 9 0 0112.728 0M19.879 19.879a9 9 0 01-12.728 0"
              />
            </svg>
          </div>
          <h3
            id="error-dialog-title"
            className="text-2xl font-bold text-gray-800"
          >
            Validation Errors
          </h3>
        </div>

        {/* Error List */}
        <ul
          id="error-dialog-description"
          className="list-disc list-inside text-red-600 mb-6"
        >
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
