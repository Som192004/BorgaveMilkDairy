// TransactionForm.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const TransactionForm = ({
  isEditing,
  handleSaveTransaction,
  setIsFormOpen,
  editingTransaction,
  availableProducts,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    time: "", // for datetime-local input
    products: [], // local mapping of items (each with productId, name, price, quantity)
    netTotalPrice: 0,
  });

  // When editing, map the backend's "items" to the local "products" state.
  useEffect(() => {
    if (isEditing && editingTransaction && availableProducts.length > 0) {
      const mappedProducts = editingTransaction.items.map((item) => {
        const product = availableProducts.find((p) => p._id === item.product);
        return {
          productId: item.product,
          name: product ? product.productName : "",
          price: product ? product.productPrice : 0,
          quantity: item.quantity,
        };
      });
      const totalPrice = mappedProducts.reduce(
        (sum, prod) => sum + prod.price * prod.quantity,
        0
      );
      setFormData({
        customerName: editingTransaction.customerName || "",
        mobileNumber: editingTransaction.mobileNumber || "",
        time: editingTransaction.time
          ? new Date(editingTransaction.time).toISOString().slice(0, 16)
          : "",
        products: mappedProducts,
        netTotalPrice: totalPrice,
      });
    }
  }, [isEditing, editingTransaction, availableProducts]);

  // General input handler for customer details and time
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes to product selection and quantity
  const handleProductChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...formData.products];

    if (name === "productId") {
      const selectedProduct = availableProducts.find((p) => p._id === value);
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: value,
        name: selectedProduct ? selectedProduct.productName : "",
        price: selectedProduct ? selectedProduct.productPrice : 0,
        quantity: updatedProducts[index]?.quantity || 0,
      };
    } else if (name === "quantity") {
      const newQuantity =
        value === "" ? "" : Math.max(parseInt(value, 10) || 0, 0);
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: newQuantity,
      };
    }

    // Recalculate net total price
    const totalPrice = updatedProducts.reduce(
      (sum, prod) => sum + prod.price * (prod.quantity || 0),
      0
    );
    setFormData({
      ...formData,
      products: updatedProducts,
      netTotalPrice: totalPrice,
    });
  };

  // Add a new product row
  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { productId: "", name: "", price: 0, quantity: 0 },
      ],
    });
  };

  // Remove a product row
  const removeProduct = (index) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    const totalPrice = updatedProducts.reduce(
      (sum, prod) => sum + prod.price * (prod.quantity || 0),
      0
    );
    setFormData({
      ...formData,
      products: updatedProducts,
      netTotalPrice: totalPrice,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.customerName || !formData.mobileNumber || !formData.time) {
      alert(
        "Please fill out customer name, mobile number, and transaction date/time"
      );
      return;
    }
    if (formData.products.length === 0) {
      alert("Please add at least one product!");
      return;
    }
    // Build payload according to backend schema.
    // The payload includes "customerName", "mobileNumber", "time", and an "items" array.
    const transactionPayload = {
      customerName: formData.customerName,
      mobileNumber: formData.mobileNumber,
      time: formData.time,
      items: formData.products.map((item) => ({
        product: item.productId,
        productName : item.name,
        quantity: item.quantity,
        pamount: item.price * item.quantity,
      })),
    };

    handleSaveTransaction(transactionPayload);
    setIsFormOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 overflow-y-auto z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
      >
        <h3
          id="transaction-form-title"
          className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6"
        >
          {isEditing ? "Edit Transaction" : "New Transaction"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto max-h-[65vh] pr-2 space-y-4 sm:space-y-6"
        >
          {/* Customer Details */}
          <div className="border p-4 rounded-md shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
              required
            />
          </div>
          <div className="border p-4 rounded-md shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
              required
            />
          </div>
          <div className="border p-4 rounded-md shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Date & Time
            </label>
            <input
              type="datetime-local"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
              required
            />
          </div>

          {/* Product Items */}
          {formData.products.map((product, index) => (
            <div key={index} className="border p-4 rounded-md shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                name="productId"
                value={product.productId}
                onChange={(e) => handleProductChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
                required
              >
                <option value="">Select a product</option>
                {availableProducts.length > 0 ? (
                  availableProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName} - ${p.productPrice.toFixed(2)}
                    </option>
                  ))
                ) : (
                  <option disabled>No products available</option>
                )}
              </select>

              <label className="block mt-3 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
                required
              />

              <p className="mt-2 text-sm text-gray-600">
                Price: ${product.price.toFixed(2)} | Total: $
                {(product.price * (product.quantity || 0)).toFixed(2)}
              </p>

              {formData.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add Another Product
          </button>

          <p className="text-lg font-bold mt-4">
            Net Total Price: ${formData.netTotalPrice.toFixed(2)}
          </p>

          <div className="mt-6 sm:mt-8 flex justify-between space-x-2 sm:space-x-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 bg-gray-400 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#2c447f] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1b2d5b] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
            >
              {isEditing ? "Update Transaction" : "Save Transaction"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionForm;
