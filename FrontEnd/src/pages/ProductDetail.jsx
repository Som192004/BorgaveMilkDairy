import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useLocation } from "react-router-dom";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState("200ml");
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state;
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // const fetchedProduct = products.find((p) => p.id === parseInt(id));
    setProduct(productData);
    console.log(productData)
  }, [id]);

  const handleBackClick = () => navigate("/products");

  const handleAddToCart = () => {
    addToCart({ ...product, selectedQuantity:product.productName });
    alert("Product added to cart! ✅");
  };

  if (!product) return <div className="text-center text-gray-600">Loading...</div>;

  const isInStock = product.productInstock;
  <p className={`mt-2 text-sm font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}>
  {isInStock ? "In Stock" : "Out of Stock"}
</p>

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-lg my-12 border border-gray-200">
      <button
        onClick={handleBackClick}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mb-6 transition duration-300 cursor-pointer"
      >
        <span className="text-lg">&#8592;</span>
        <span>Back to Products</span>
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
        <div className="relative w-60 h-60 md:w-80 md:h-80">
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full h-full object-cover rounded-lg shadow-md border border-gray-300"
          />
        </div>

        <div className="flex-1 text-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h2>
          <p className="text-2xl font-semibold text-green-600">${product.productPrice}</p>

          <p className={`mt-2 text-sm font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p> */}

          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Specifications:</h3>
            <ul className="text-gray-700 space-y-1">
              <li><strong>SNF:</strong> {product.snf || "N/A"}</li>
              <li><strong>Fat Content:</strong> {product.fat || "N/A"}</li>
              <li><strong>Quantity:</strong> {product.quantity || "N/A"}</li>
            </ul>
          </div>

          {/* Quantity Dropdown */}
          {/* <div className="mt-4">
            <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">Select Quantity:</label>
            <select
              id="quantity"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="200ml">200ml</option>
              <option value="300ml">300ml</option>
              <option value="500ml">500ml</option>
            </select>
          </div> */}

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`mt-6 w-full md:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md transform hover:scale-105 active:scale-100 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${
              isInStock ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
