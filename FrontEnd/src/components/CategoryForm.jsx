import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export const CategoryForm = ({ onClose, onSuccess, editingCategory }) => {
  // Prefill fields if editingCategory is provided
  const [categoryName, setCategoryName] = useState(
    editingCategory ? editingCategory.categoryName : ""
  );
  const [description, setDescription] = useState(
    editingCategory ? editingCategory.categoryDescription : ""
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form fields when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.categoryName);
      setDescription(editingCategory.categoryDescription);
    } else {
      setCategoryName("");
      setDescription("");
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!categoryName.trim() || !description.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (editingCategory) {
        // Update category API call: PATCH /api/v1/category/update-category/:id
        response = await axios.patch(
          `http://localhost:8000/api/v1/category/update-category/${editingCategory._id}`,
          {
            categoryName: categoryName.trim(),
            categoryDescription: description.trim(),
          },
          { withCredentials: true }
        );
      } else {
        // Create category API call: POST /api/v1/category/create-category
        response = await axios.post(
          "http://localhost:8000/api/v1/category/addCategory",
          {
            categoryName: categoryName.trim(),
            categoryDescription: description.trim(),
          },
          { withCredentials: true }
        );
      }
      // On success, pass the new/updated category to the parent component
      onSuccess(response.data.data);
    } catch (err) {
      console.error("Error creating/updating category:", err);
      if (err.response && err.response.status === 409) {
        setError("Category name must be unique. This category already exists.");
      } else {
        setError(
          err.response?.data?.message ||
            "Error creating/updating category. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8"
    >
      <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        {editingCategory ? "Update Category" : "Add New Category"}
      </h3>

      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Saving..."
              : editingCategory
              ? "Update Category"
              : "Save Category"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CategoryForm;
