// src/components/AddProductCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export const AddProductCard = ({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
}) => {
  const [stockChange, setStockChange] = useState("");

  const handleStockChange = (e) => {
    setStockChange(e.target.value);
  };

  const handleStockUpdate = (type) => {
    const amount = parseInt(stockChange, 10);
    if (!isNaN(amount) && amount > 0) {
      onUpdateStock(type === "add" ? amount : -amount);
      setStockChange("");
    } else {
      toast.error("Enter a valid positive number.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl max-w-sm mx-auto"
    >
      {/* Product Image */}
      <div className="relative">
        {product.productImage ? (
          <img
            src={product.productImage}
            alt={product.productName || "Product"}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 w-full h-56">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">
          {product.productName || "Unnamed Product"}
        </h3>
        {product.categoryName && (
          <div className="text-center">
            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full inline-block">
              {product.categoryName}
            </span>
          </div>
        )}

        <div className="mt-3 text-gray-700 text-sm space-y-1 text-center">
          <p>
            <span className="font-medium">Price:</span> $
            {Number(product.productPrice).toFixed(2)}
          </p>
          <p>
            <span className="font-medium">Quantity:</span> {product.quantity}
          </p>
        </div>

        {/* Three-Row Layout for Controls */}
        <div className="mt-5 flex flex-col gap-4">
          {/* Row 1: Edit & Delete Buttons */}
          <div className="flex justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md transition-all hover:bg-blue-700 text-sm"
            >
              <Edit size={16} className="mr-1" /> Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="flex items-center bg-red-500 text-white py-2 px-4 rounded-md transition-all hover:bg-red-600 text-sm"
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </motion.button>
          </div>

          {/* Row 2: Stock Input */}
          <div className="w-full">
            <input
              type="number"
              value={stockChange}
              onChange={handleStockChange}
              placeholder="Enter stock amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center text-sm"
            />
          </div>

          {/* Row 3: Add & Subtract Buttons */}
          <div className="flex justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStockUpdate("add")}
              className="flex items-center bg-green-600 text-white py-2 px-4 rounded-md transition-all hover:bg-green-700 text-sm"
            >
              <Plus size={16} className="mr-1" /> Add
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStockUpdate("subtract")}
              className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-md transition-all hover:bg-yellow-600 text-sm"
            >
              <Minus size={16} className="mr-1" /> Subtract
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
