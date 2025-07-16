import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-lg shadow-2xl p-10 max-w-lg w-full text-center"
      >
        {/* Animated SVG Icon */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <svg
            className="w-24 h-24 mx-auto text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
            />
            <line
              x1="20"
              y1="20"
              x2="44"
              y2="44"
              strokeWidth="4"
              stroke="currentColor"
            />
            <line
              x1="44"
              y1="20"
              x2="20"
              y2="44"
              strokeWidth="4"
              stroke="currentColor"
            />
          </svg>
        </motion.div>

        {/* 404 Error Code */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl font-extrabold text-gray-800 mb-4"
        >
          404
        </motion.h1>

        {/* Main Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl font-bold text-gray-700 mb-3"
        >
          Page Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-600 mb-6"
        >
          The page you’re looking for doesn’t exist or has been moved. Let’s get
          you back on track.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          Go to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
