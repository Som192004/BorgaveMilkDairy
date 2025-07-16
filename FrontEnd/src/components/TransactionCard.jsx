// TransactionCard.jsx
import React from "react";
import { motion } from "framer-motion";

export const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
  availableProducts,
}) => {
  // Format the transaction time for display
  const transactionDate = new Date(transaction.time).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-[#e8f0ff] to-[#cfd9ff] shadow-lg rounded-xl overflow-hidden flex flex-col items-start p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-300 text-left transition-transform"
      role="article"
      aria-label={`Transaction card for ID ${transaction._id}`}
    >
      {/* Header with Transaction ID */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-[#4c76ba] transition">
        Transaction ID: {transaction._id}
      </h3>

      {/* Customer & Transaction Details */}
      <p className="text-base sm:text-lg text-gray-700">
        <span className="font-semibold">Customer:</span>{" "}
        {transaction.customerName}
      </p>
      <p className="text-base sm:text-lg text-gray-700">
        <span className="font-semibold">Mobile:</span>{" "}
        {transaction.mobileNumber}
      </p>
      <p className="text-base sm:text-lg text-gray-700">
        <span className="font-semibold">Date:</span> {transactionDate}
      </p>
      <p className="text-base sm:text-lg text-gray-700">
        <span className="font-semibold">Total Amount:</span> $
        {transaction.amount.toFixed(2)}
      </p>

      {/* Items List */}
      <div className="w-full">
        <h4 className="text-lg font-semibold text-gray-800">Items:</h4>
        <div className="space-y-2">
          {transaction.items.map((item, index) => {
            // Lookup product details using _id and correct field names
            const product = availableProducts.find(
              (p) => p._id === item.product
            );
            return (
              <div key={index} className="border p-2 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Product:</span>{" "}
                  {product ? product.productName : "Product not found"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Quantity:</span>{" "}
                  {item.quantity}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Unit Price:</span>{" "}
                  {product ? `$${product.productPrice.toFixed(2)}` : "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Item Total:</span> $
                  {item.pamount.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-2 w-full">
        <button
          onClick={() => onEdit(transaction._id)}
          className="bg-[#4c76ba] text-white text-sm sm:text-lg px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Edit transaction"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(transaction._id)}
          className="bg-[#d9534f] text-white text-sm sm:text-lg px-3 py-1 rounded-lg shadow-md hover:bg-red-600 hover:shadow-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          aria-label="Delete transaction"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};
