import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const LanguageToggler2 = ({ isMobile = false }) => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Inject Google Translate Script
    const googleTranslateScript = document.createElement("script");
    googleTranslateScript.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    googleTranslateScript.async = true;
    document.body.appendChild(googleTranslateScript);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,mr", layout: 0 },
        "google_translate_element"
      );
    };

    // Add padding to body to account for Google toolbar
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        top: 40px !important;
        position: relative !important;
      }
      .goog-te-banner-frame {
        height: 40px !important;
        display: block !important;
      }
      .goog-te-banner-frame.skiptranslate {
        display: block !important;
      }
      #google_translate_element select {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      delete window.googleTranslateElementInit;
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const handleToggleLanguage = () => {
    const newLang = currentLang === "en" ? "mr" : "en";
    setCurrentLang(newLang);

    const selectElement = document.querySelector(".goog-te-combo");
    if (selectElement) {
      selectElement.value = newLang;
      selectElement.dispatchEvent(new Event("change"));
    }
  };

  const containerClasses = isMobile ? "w-[100px] h-7" : "w-[140px] h-8";
  const buttonClasses = isMobile
    ? "w-[47px] h-6 text-xs"
    : "w-[66px] h-7 text-sm";
  const sliderLeft =
    currentLang === "en" ? "0.125rem" : isMobile ? "51px" : "72px";

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Language Toggle UI */}
      <div className="bg-gray-100/80 rounded-full shadow-inner">
        <div className={`relative flex items-center ${containerClasses}`}>
          <motion.div
            layout
            className={`absolute bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md transition-all duration-300 ease-in-out ${buttonClasses}`}
            style={{ left: sliderLeft }}
          />
          <button
            onClick={handleToggleLanguage}
            className={`relative z-10 flex items-center justify-center rounded-full font-medium transition-colors duration-300 ${buttonClasses} ${
              currentLang === "en"
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-pressed={currentLang === "en"}
          >
            English
          </button>
          <button
            onClick={handleToggleLanguage}
            className={`relative z-10 flex items-center justify-center rounded-full font-medium transition-colors duration-300 ${buttonClasses} ${
              currentLang === "mr"
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-pressed={currentLang === "mr"}
          >
            मराठी
          </button>
        </div>
      </div>
    </>
  );
};

export default LanguageToggler2;
