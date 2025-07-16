// Navbar.jsx
import React, { useState, useContext } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadout } from "./variants2";
import logoImage from "../assets/Borgave_Logo_BG_Removed.png";
import { useTranslation } from "react-i18next";
import { LanguageToggler } from "./LanguageToggler";
import { CartContext } from "../context/CartContext"; // import CartContext
import LanguageToggler2 from "./LanguageToggler2";

const NavLink = ({ to, children, className }) => (
  <Link
    to={to}
    className={`text-gray-700 hover:text-blue-600 px-4 py-2 text-base font-medium transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg  w-full top-0 z-50">
      <motion.div className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadout("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          className="flex items-center h-16"
        >
          {/* Logo */}
          <div className="flex items-center space-x-4 cursor-pointer">
            <img
              src={logoImage}
              alt="logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-auto space-x-6">
            {/* Language Toggler positioning for desktop */}
            <div className="px-2">
              <LanguageToggler isMobile={false} />
              {/* <LanguageToggler2 isMobile={false} /> */}
            </div>

            <NavLink to="/">{t("navbar.links.home")}</NavLink>
            <NavLink to="/products">{t("navbar.links.products")}</NavLink>
            <NavLink to="/about-us">{t("navbar.links.aboutUs")}</NavLink>
            <NavLink to="/contact-us">{t("navbar.links.contactUs")}</NavLink>
            <NavLink to="/cart" className="relative">
              <ShoppingCart className="inline-block h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {t("navbar.links.login")}
            </NavLink>
          </div>

          {/* Mobile menu button and language toggler */}
          <div className="md:hidden ml-auto flex items-center">
            {/* Language Toggler positioning for mobile */}
            <div className="mr-4">
              <LanguageToggler isMobile={true} />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-4 bg-white shadow-md grid grid-cols-2 gap-4">
            <NavLink to="/" className="text-center">
              {t("navbar.links.home")}
            </NavLink>
            <NavLink to="/products" className="text-center">
              {t("navbar.links.products")}
            </NavLink>
            <NavLink to="/about-us" className="text-center">
              {t("navbar.links.aboutUs")}
            </NavLink>
            <NavLink to="/contact-us" className="text-center">
              {t("navbar.links.contactUs")}
            </NavLink>
            <NavLink to="/cart" className="text-center relative">
              <ShoppingCart className="inline-block h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/login"
              className="bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition col-span-2"
            >
              {t("navbar.links.login")}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};
