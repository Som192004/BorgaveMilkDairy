import React, { useState, useEffect } from "react";
import axios from "axios";
import { CategoryForm } from "../components/CategoryForm"; // Adjust path as needed
import { motion, AnimatePresence } from "framer-motion";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  // New state to track the category whose details should be shown
  const [detailCategory, setDetailCategory] = useState(null);

  // Fetch all categories from the backend API
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/category/get-all-categories",
        { withCredentials: true }
      );
      // Assume API returns an object with a data property that is an array of categories
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Error fetching categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Callback for when a category is added or updated successfully.
  // Instead of updating state locally, re-fetch categories to ensure consistency.
  const handleCategorySaved = (savedCategory) => {
    fetchCategories();
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  // Open form in edit mode for the selected category (preventing propagation)
  const handleEditCategory = (category, e) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // Delete a category via API and re-fetch categories
  const handleDeleteCategory = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(
        `https://borgavemilkdairybackend.onrender.com/api/v1/category/delete-category/${id}`,
        { withCredentials: true }
      );
      // Re-fetch categories to update state
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Error deleting category. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-[#2c447f]">
          Category List
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 text-center mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {categories.map((cat) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  // Make the entire card clickable to show full details
                  onClick={() => setDetailCategory(cat)}
                  className="w-full bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 cursor-pointer"
                >
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                    {cat.categoryName}
                  </h3>
                  {/* Truncate long descriptions; requires @tailwindcss/line-clamp */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {cat.categoryDescription}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={(e) => handleEditCategory(cat, e)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteCategory(cat._id, e)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No categories available.
          </div>
        )}

        {/* Floating "Add Category" Button */}
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingCategory(null);
          }}
          className="fixed bottom-6 right-6 bg-[#2c447f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1b2d5b] transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          + Add Category
        </button>

        {/* Category Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
              role="dialog"
              aria-modal="true"
            >
              <CategoryForm
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingCategory(null);
                }}
                onSuccess={handleCategorySaved}
                editingCategory={editingCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Detail Modal */}
        <AnimatePresence>
          {detailCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
              role="dialog"
              aria-modal="true"
              onClick={() => setDetailCategory(null)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg"
              >
                <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                  {detailCategory.categoryName}
                </h3>
                <p className="text-gray-700 mb-6">
                  {detailCategory.categoryDescription}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setDetailCategory(null)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryList;
