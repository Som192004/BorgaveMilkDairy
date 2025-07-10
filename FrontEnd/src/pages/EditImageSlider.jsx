import React, { useState, useEffect } from "react";
import { ImageSlider } from "../components/ImageSlider";
import { SlideForm } from "../components/SlideForm";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext" ;
export const EditImageSlider = () => {
  const { t } = useTranslation();

  // States for slides, form, hover, loading, errors, and delete confirmation
  const [slides, setSlides] = useState([]);
  const [isFileModified, setIsFileModified] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    link: "",
    title: "",
    description: "",
  });
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const { accessToken } = useAuth();
  // Fetch slides from backend on mount
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      setError("");
      try {
        const accessToken = localStorage.getItem('accessToken');
        const { data } = await axios.get(
          "https://borgavemilkdairybackend.onrender.com/api/v1/new-offer/get-all-offers",
          { withCredentials: true, headers: {
            authorization: `Bearer ${accessToken}`,
          } }
        );
        console.log("Fetched slides:", data);
        let filteredSlides = [];
        if (Array.isArray(data?.data) && data.data.length > 0) {
          filteredSlides = data.data.map((item) => ({
            _id: item._id,
            title: item.title,
            description: item.description,
            link: item.link,
          }));
        } else {
          // Use a dummy slide if no slides exist
          filteredSlides = [
            {
              _id: "dummy",
              title: "Borgave Dugdhalaya",
              description:
                "शेतातून थेट तुमच्या घरापर्यंत सर्वोत्तम दुग्धजन्य पदार्थ आणत आहोत.",
              link: "https://images.pexels.com/photos/254178/pexels-photo-254178.jpeg",
            },
          ];
        }
        setSlides(filteredSlides);
      } catch (error) {
        console.error("Error fetching slides:", error);
        setError(
          t("imageSlider.alerts.fetchError") ||
            "Failed to load slides. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [t]);

  // Toggle body overflow when a modal is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isFormOpen);
  }, [isFormOpen]);

  useEffect(() => {
    if (slides.length === 0) {
      setSlides([
        {
          _id: "dummy",
          title: "Borgave Dugdhalaya",
          description:
            "शेतातून थेट तुमच्या घरापर्यंत सर्वोत्तम दुग्धजन्य पदार्थ आणत आहोत.",
          link: "https://images.pexels.com/photos/254178/pexels-photo-254178.jpeg",
        },
      ]);
    }
  }, [slides]);

  // Handlers for text and file input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file object in formData.link temporarily
      setFormData((prevData) => ({ ...prevData, link: file }));
      setIsFileModified(true);
    }
  };

  // Save slide (create or update)
  const handleSaveSlide = async () => {
    if (!formData.link || !formData.title || !formData.description) {
      alert(t("imageSlider.alerts.fillAllFields"));
      return;
    }

    try {
      if (formData._id) {
        // Update existing slide
        let response;
        const accessToken = localStorage.getItem('accessToken');
        if (isFileModified) {
          response = await axios.post(
            `https://borgavemilkdairybackend.onrender.com/api/v1/new-offer/edit-offer/${formData._id}`,
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" , authorization: `Bearer ${accessToken}`},
            }
          );
          console.log("Slide updated with new file:", response.data);
        } else {
          response = await axios.post(
            `https://borgavemilkdairybackend.onrender.com/api/v1/new-offer/edit-offer/${formData._id}`,
            { title: formData.title, description: formData.description },
            { withCredentials: true , headers : {
              authorization: `Bearer ${accessToken}`
            }}
          );
          console.log("Slide updated without new file:", response.data);
        }
        // Update the slide in the state with the returned data
        setSlides((prevSlides) =>
          prevSlides.map((slide) =>
            slide._id === formData._id ? response.data.data : slide
          )
        );
        setIsFileModified(false);
      } else {
        const accessToken = localStorage.getItem('accessToken');
        // Create a new slide
        const response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/new-offer/add-new-offer",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" ,
              authorization: `Bearer ${accessToken}`
            }}
        );
        console.log("New slide created:", response.data);
        const newSlide = {
          ...formData,
          _id: response.data.data._id,
          link: response.data.data.link,
        };
        setSlides((prevSlides) => [...prevSlides, newSlide]);
      }
    } catch (error) {
      console.error("Error saving slide:", error);
      alert(t("imageSlider.alerts.saveError") || "Error saving slide");
    } finally {
      setIsFormOpen(false);
      // Reset the form data after save
      setFormData({ _id: null, link: "", title: "", description: "" });
    }
  };

  // Delete slide handler with a confirmation modal
  const handleDelete = async (_id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `https://borgavemilkdairybackend.onrender.com/api/v1/new-offer/delete-offer/${_id}`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data",
            authorization: `Bearer ${accessToken}`
          } },
      );
      console.log("Slide deleted:", response.data);
      setSlides((prevSlides) =>
        prevSlides.filter((slide) => slide._id !== _id)
      );
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert(t("imageSlider.alerts.deleteError") || "Error deleting slide");
    } finally {
      setDeleteModalOpen(false);
      setSlideToDelete(null);
    }
  };

  // Handlers to open the add/edit form and the delete confirmation modal
  const handleAddSlide = () => {
    setFormData({ _id: null, link: "", title: "", description: "" });
    setIsFormOpen(true);
  };

  const handleEditSlide = (slide) => {
    setFormData(slide);
    setIsFormOpen(true);
  };

  const confirmDelete = (slide) => {
    setSlideToDelete(slide);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl mb-8">
        <h2 className="text-4xl font-bold mb-10 text-center text-[#2c447f]">
          {t("imageSlider.slideList")}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            {/* You can customize this loader CSS or component */}
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <motion.div
                key={slide._id}
                onMouseEnter={() => setHoveredSlide(slide._id)}
                onMouseLeave={() => setHoveredSlide(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br from-[#e8f0ff] to-[#cfd9ff] shadow-lg rounded-lg overflow-hidden p-4 flex flex-col transition-all duration-300 ease-in-out ${
                  hoveredSlide === slide._id
                    ? "shadow-2xl scale-105 bg-[#dae4ff]"
                    : ""
                }`}
              >
                <img
                  src={slide.link}
                  alt={slide.title}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-3">{slide.title}</h3>
                <p className="text-sm text-gray-600">{slide.description}</p>
                <div className="flex justify-between mt-4 space-x-2">
                  <button
                    className="flex-1 bg-[#4c76ba] text-white text-base px-3 py-2 rounded-md shadow-md hover:bg-[#3b5c94] transition"
                    onClick={() => handleEditSlide(slide)}
                  >
                    {t("imageSlider.buttons.edit")}
                  </button>
                  <button
                    className="flex-1 bg-[#d9534f] text-white text-base px-3 py-2 rounded-md shadow-md hover:bg-[#b52b27] transition"
                    onClick={() => confirmDelete(slide)}
                  >
                    {t("imageSlider.buttons.delete")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative w-full max-w-5xl z-0">
        <ImageSlider
          key={slides.length}
          slides={slides}
          className="h-[600px] w-full relative z-0"
          autoPlayInterval={5000}
        />
      </div>

      <button
        onClick={handleAddSlide}
        className="mt-6 px-6 py-3 bg-[#1b2d5b] text-white font-semibold rounded-lg shadow-md hover:bg-[#0f1e3e] transition"
      >
        {t("imageSlider.buttons.addSlide")}
      </button>

      {/* Slide Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <SlideForm
              isEditing={!!formData._id}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSaveSlide={handleSaveSlide}
              handleFileChange={handleFileChange}
              setIsFormOpen={setIsFormOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && slideToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
            >
              <h3 className="text-xl font-semibold text-center mb-4">
                {t("imageSlider.alerts.confirmDeleteTitle")}
              </h3>
              <p className="text-center mb-6">
                {t("imageSlider.alerts.confirmDeleteMessage")}
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
                >
                  {t("imageSlider.alerts.cancel")}
                </button>
                <button
                  onClick={() => handleDelete(slideToDelete._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  {t("imageSlider.alerts.confirm")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditImageSlider;
