import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadout } from "./variants2";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 w-full">
      <motion.div
        variants={fadout("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Store Info */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              {t("footer.companyName")}
            </h3>
            <p className="text-lg text-gray-300">{t("footer.tagline")}</p>
            <p className="text-sm text-gray-400 mt-4">
              {t("footer.copyright")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="text-base text-gray-300 space-y-4">
              <li>
                <a
                  href="/"
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  {t("footer.quickLinks.home")}
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  {t("footer.quickLinks.products")}
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  {t("footer.quickLinks.aboutUs")}
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  {t("footer.quickLinks.contactUs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-white mb-6">
              {t("footer.social.title")}
            </h3>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.facebook")}
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebookF className="w-8 h-8" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.twitter")}
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.instagram")}
                className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back-to-Top Button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Back to Top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};
