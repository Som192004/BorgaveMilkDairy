import React, { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, X } from "lucide-react";

export const SlideForm = ({
  isEditing,
  formData,
  handleInputChange,
  handleFileChange,
  handleSaveSlide,
  setIsFormOpen,
}) => {
  const [image, setImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      handleFileChange(event);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  // Submit the form using onSubmit so that Enter works naturally.
  const onSubmit = (e) => {
    e.preventDefault();
    handleSaveSlide();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="slide-form-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg relative"
      >
        {/* Close Icon */}
        <button
          onClick={() => setIsFormOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close form"
        >
          <X className="h-6 w-6" />
        </button>

        <h3
          id="slide-form-title"
          className="text-2xl font-bold text-gray-800 text-center mb-6"
        >
          {isEditing ? "Edit Slide" : "Add New Slide"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="image"
              className="cursor-pointer bg-[#2c447f] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#1f3260] transition duration-200"
            >
              Choose Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {image && (
              <div className="relative mt-4 w-48 h-48 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={image}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition cursor-pointer"
                  aria-label="Remove image"
                >
                  <XCircle className="h-6 w-6 text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter Slide Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Slide Description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c447f]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 space-x-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-200 focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#2c447f] hover:bg-[#1b2d5b] text-white px-4 py-2 rounded-lg transition duration-200 focus:outline-none cursor-pointer"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SlideForm;
