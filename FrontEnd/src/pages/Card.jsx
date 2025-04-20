import React, { useContext, useState } from "react";
import { ShoppingCartContext } from "./ShoppingCartContext";
import { motion } from "framer-motion";
import { FaCartPlus } from "react-icons/fa";

export const Card = ({ product }) => {
  const { handleAddToCart } = useContext(ShoppingCartContext);
  const [added, setAdded] = useState(false);

  const onAddToCart = () => {
    handleAddToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
    >
      {/* Product Image with Out of Stock Overlay */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-1 text-gray-600 text-sm">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-blue-600 font-bold">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-gray-500 text-xs">
            SNF: {product.snf} | Fat: {product.fatContent}
          </span>
        </div>

        {/* Add to Cart Button or Out of Stock Message */}
        <div className="mt-4">
          {product.inStock ? (
            <motion.button
              onClick={onAddToCart}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              aria-label={`Add ${product.name} to Cart`}
            >
              {added ? (
                <span className="flex items-center">
                  <FaCartPlus className="mr-2" /> Added!
                </span>
              ) : (
                <span className="flex items-center">
                  <FaCartPlus className="mr-2" /> Add to Cart
                </span>
              )}
            </motion.button>
          ) : (
            <div className="w-full text-center py-2 text-red-500 font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
