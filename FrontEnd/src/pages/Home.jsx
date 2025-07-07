import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImageSlider, ProductImageSlider, About } from "../components/index.js";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  // State for dynamic hero slides fetched from the backend
  const [heroSlides, setHeroSlides] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [heroError, setHeroError] = useState(null);

  // Static product slides array
  const staticProductSlides = [
    {
      image:
        "https://images.pexels.com/photos/799273/pexels-photo-799273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Fresh Milk",
      description:
        "Our pure, organic fresh milk delivered straight from the farm.",
    },
    {
      image:
        "https://images.pexels.com/photos/94443/pexels-photo-94443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Butter",
      description: "Our rich, creamy butter made from the finest dairy.",
    },
    {
      image:
        "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Cheese",
      description: "Delicious handcrafted cheese with an exquisite taste.",
    },
  ];

  // Translate the static product slides
  const translatedProductSlides = staticProductSlides.map((slide, index) => ({
    ...slide,
    title: t(`home.productSlides.${index}.title`, {
      defaultValue: slide.title,
    }),
    description: t(`home.productSlides.${index}.description`, {
      defaultValue: slide.description,
    }),
  }));

  // Function to fetch dynamic hero slides using axios
  const fetchHeroSlides = async () => {
    setLoadingHero(true);
    setHeroError(null);
    try {
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/new-offer/get-all-offers", { withCredentials: true , }
      );

      const data = response?.data?.data ?? [];
      let updatedHeroSlides = [];

      if (Array.isArray(data) && data.length > 0) {
        updatedHeroSlides = data.map((slide) => ({
          _id: slide._id,
          title: slide.title,
          description: slide.description,
          link: slide.link,
        }));
      } else {
        // Add a dummy slide when no slides exist
        updatedHeroSlides = [
          {
            _id: "dummy",
            title: "Borgave Dugdhalaya",
            description:
              "शेतातून थेट तुमच्या घरापर्यंत सर्वोत्तम दुग्धजन्य पदार्थ आणत आहोत.",
            link: "https://images.pexels.com/photos/254178/pexels-photo-254178.jpeg",
          },
        ];
      }
      setHeroSlides(updatedHeroSlides);
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      setHeroError(
        t("home.errorLoadingHero") ||
          "Error loading hero slides. Please try again."
      );
    } finally {
      setLoadingHero(false);
    }
  };

  // Poll for hero slides: initial fetch and then every 10 seconds
  useEffect(() => {
    fetchHeroSlides(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchHeroSlides();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [t]);

  // Preload images for the hero slides after they are fetched
  useEffect(() => {
    if (heroSlides.length) {
      heroSlides.forEach((slide) => {
        const img = new Image();
        img.src = slide.link;
      });
    }
  }, [heroSlides]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Dynamic Hero Section */}
      <section className="relative">
        {loadingHero ? (
          <div className="flex items-center justify-center h-[700px]">
            {/* Custom spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : heroError ? (
          <div className="flex flex-col items-center justify-center h-[700px]">
            <p className="text-red-600 text-xl mb-4">{heroError}</p>
            <button
              onClick={fetchHeroSlides}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              {t("home.retry")}
            </button>
          </div>
        ) : (
          <ImageSlider
            key={heroSlides.length} // Using slides length as a dynamic key forces re-mount when slides change.
            slides={heroSlides}
            className="h-[700px] w-full"
            autoPlayInterval={5000}
          />
        )}
      </section>

      {/* About Us Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <About />
      </motion.section>

      {/* Static Product Image Slider */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <ProductImageSlider
          slides={translatedProductSlides}
          autoPlayInterval={5000}
          className="h-[600px] w-full"
        />
      </motion.section>
    </motion.div>
  );
}
