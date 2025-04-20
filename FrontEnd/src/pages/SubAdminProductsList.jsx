// src/pages/SubAdminProductsList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AddProductCard } from "../components/AddProductCard";
import { AddProductForm } from "../components/AddProductForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Set your backend API base URL (adjust as needed)
const API_URL = "http://localhost:8000/api/v1/category";

export const SubAdminProductsList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // flattened list of products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // product object (with category info)
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // product to be deleted

  // Fetch categories (with embedded products) from the backend
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-all-categories`, {
        withCredentials: true,
      });
      console.log(response);

      if (response.data && response.data.data) {
        const fetchedCategories = response.data.data;
        setCategories(fetchedCategories);
        // Flatten products: add the category ID and name to each product
        const allProducts = [];
        fetchedCategories.forEach((cat) => {
          if (cat.products && Array.isArray(cat.products)) {
            cat.products.forEach((prod) => {
              allProducts.push({
                ...prod,
                categoryId: cat._id,
                categoryName: cat.categoryName,
              });
            });
          }
        });
        setProducts(allProducts);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories and products");
      toast.error("Failed to fetch categories and products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product) => {
    setDeleteTarget(product);
    setShowConfirm(true);
  };

  // Unified handler to update stock based on a delta value (positive for add, negative for subtract)
  const handleUpdateStock = async (product, delta) => {
    try {
      const operation = delta > 0 ? "add" : "subtract";
      const value = Math.abs(delta);
      const url = `${API_URL}/${product.categoryId}/product/update-stock/${product._id}`;
      await axios.patch(url, { operation, value }, { withCredentials: true });
      toast.success("Stock updated successfully");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Error updating stock");
    }
  };

  // Save product (for add or update)
  const handleSaveProduct = async (categoryId, productData) => {
    try {
      if (isEditing && editingProduct) {
        const url = `${API_URL}/${editingProduct.categoryId}/product/update/${editingProduct._id}`;
        await axios.patch(url, productData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        const url = `${API_URL}/${categoryId}/product/add`;
        await axios.post(url, productData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully");
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      setIsEditing(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Error saving product");
    }
  };

  // Delete product
  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const url = `${API_URL}/${deleteTarget.categoryId}/product/delete/${deleteTarget._id}`;
        await axios.delete(url, { withCredentials: true });
        toast.success("Product deleted successfully");
        setShowConfirm(false);
        setDeleteTarget(null);
        fetchCategories();
      } catch (err) {
        console.error(err);
        toast.error("Error deleting product");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-[#2c447f]">
          Products
        </h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {products.length > 0
              ? products.map((product, index) => (
                  <motion.div
                    key={`${product.categoryId}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AddProductCard
                      product={product}
                      onEdit={() => handleEdit(product)}
                      onDelete={() => handleDelete(product)}
                      onUpdateStock={(delta) =>
                        handleUpdateStock(product, delta)
                      }
                    />
                  </motion.div>
                ))
              : !loading && (
                  <motion.div
                    className="col-span-full text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No products available.
                  </motion.div>
                )}
          </AnimatePresence>
        </div>

        {/* Floating "Add Product" Button */}
        <button
          onClick={handleAddClick}
          className="fixed bottom-6 right-6 bg-[#2c447f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1b2d5b] transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          + Add Product
        </button>

        {/* Product Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <AddProductForm
              isEditing={isEditing}
              initialData={editingProduct || {}}
              categories={categories}
              onClose={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
                setIsEditing(false);
              }}
              onSave={handleSaveProduct}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Confirm Deletion
                </h3>
                <p className="text-center mb-6">
                  Are you sure you want to delete this product?
                </p>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-[#4c76ba] text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-150"
                  >
                    No
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-[#d9534f] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-150"
                  >
                    Yes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SubAdminProductsList;
