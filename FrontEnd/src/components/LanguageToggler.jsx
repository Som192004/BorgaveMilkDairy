import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const LanguageToggler = ({ isMobile = false }) => {
  const { t, i18n } = useTranslation();

  // Function to explicitly set language
  const handleChangeLanguage = (lang) => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  };

  // Define container and button dimensions based on mobile prop
  const containerClasses = isMobile ? "w-[100px] h-7" : "w-[140px] h-8";
  const buttonClasses = isMobile
    ? "w-[47px] h-6 text-xs"
    : "w-[66px] h-7 text-sm";

  // Calculate the left position of the sliding background.
  // These values can be adjusted to match your design requirements.
  const sliderLeft =
    i18n.language === "en"
      ? "0.125rem" // For English, slide to the left.
      : isMobile
      ? "51px" // For mobile when Marathi is active.
      : "72px"; // For desktop when Marathi is active.

  return (
    <div className="bg-gray-100/80 rounded-full shadow-inner">
      <div className={`relative flex items-center ${containerClasses}`}>
        {/* Animated Sliding Background */}
        <motion.div
          layout
          className={`absolute bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md transition-all duration-300 ease-in-out ${buttonClasses}`}
          style={{ left: sliderLeft }}
        />
        {/* English Button */}
        <button
          onClick={() => handleChangeLanguage("en")}
          className={`relative z-10 flex items-center justify-center rounded-full font-medium transition-colors duration-300 ${buttonClasses} ${
            i18n.language === "en"
              ? "text-white"
              : "text-gray-600 hover:text-gray-900"
          } cursor-pointer`}
          aria-pressed={i18n.language === "en"}
        >
          <span className="tracking-wide">{t("navbar.language.english")}</span>
        </button>
        {/* Marathi Button */}
        <button
          onClick={() => handleChangeLanguage("mr")}
          className={`relative z-10 flex items-center justify-center rounded-full font-medium transition-colors duration-300 ${buttonClasses} ${
            i18n.language === "mr"
              ? "text-white"
              : "text-gray-600 hover:text-gray-900"
          } cursor-pointer`}
          aria-pressed={i18n.language === "mr"}
        >
          <span>{t("navbar.language.marathi")}</span>
        </button>
      </div>
    </div>
  );
};
