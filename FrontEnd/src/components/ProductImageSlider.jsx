import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProductImageSlider({
  slides = [],
  autoPlayInterval = 5000, // Updated to 5000 ms (5 seconds)
  className = "",
}) {
  // Fallback if no slides are provided
  if (!slides || slides.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No products available at the moment.
      </div>
    );
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef();

  // Auto-advance slides, but pause when hovered
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoPlayInterval, slides.length, isPaused]);

  // Variants for slide fade transition
  const slideVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Handlers for manual navigation
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Product image slider"
    >
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Slide Image */}
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-105"
          />

          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg md:text-xl drop-shadow-lg">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-2 rounded-full transition-all focus:outline-none cursor-pointer"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-2 rounded-full transition-all focus:outline-none cursor-pointer"
        aria-label="Next slide"
      >
        <ArrowRight className="h-6 w-6 text-white cursor-pointer" />
      </button>



      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
              currentSlide === index ? "bg-yellow-500" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
