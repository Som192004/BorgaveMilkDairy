import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/Borgave_Logo_BG_Removed.png";
import userProfile from "../assets/user_profile.png";
import { useTranslation } from "react-i18next";
import { LanguageToggler } from "./LanguageToggler";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { motion } from "framer-motion";
export const SubAdminSidebar = ({ isOpen, setSidebarOpen, subAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showReports, setShowReports] = useState(false);
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  useEffect(() => {
    if (!location.pathname.includes("/reports")) {
      setShowReports(false);
    }
  }, [location]);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const menuItems = [
    { name: t("subAdminSidebar.menu.transactions"), path: "/subadmin" },
    { name: t("subAdminSidebar.menu.addMilk"), path: "/subadmin/add_milk" },
    { name: t("subAdminSidebar.menu.addProduct"), path: "/subadmin/products" },
    { name: t("subAdminSidebar.menu.loan"), path: "/subadmin/loan" },
    { name: t("subAdminSidebar.menu.farmer"), path: "/subadmin/farmer" },
    { name: t("subAdminSidebar.menu.addProductCategory"), path: "/subadmin/category" },
    { name: t("subAdminSidebar.menu.report"), path: "/subadmin/report" },
    { name: t("subAdminSidebar.menu.OnlineOrders"), path: "/subadmin/online_orders" }, // Added Online Orders
  ];

  const handleLogout = async () => {
    logout();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        "https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/logout",
        {},
        { withCredentials: true, headers : {
          Authorization: `Bearer ${accessToken}`
        } }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.aside
      initial={{ x: isOpen ? 0 : -250 }}
      animate={{ x: isOpen ? 0 : -250 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 bg-gradient-to-br from-[#d0e1f9] to-[#a8c0ff] z-50 h-screen text-white p-4 transform transition-transform duration-300 lg:relative lg:translate-x-0 w-64 lg:w-74 flex flex-col`}
      aria-label="Sidebar Navigation"
    >
      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto">
        {/* Logo & Title */}
        <div className="mb-6 flex items-center space-x-3">
          <img src={logoImage} alt="Logo" className="w-10 h-10" />
          <h1 className="text-lg font-bold text-black">{t("subAdminSidebar.title")}</h1>
        </div>

        {/* Navigation Menu */}
        <ul className="text-left">
          {menuItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-black hover:bg-gray-300"
                }`}
                onClick={() => setShowReports(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Sections */}
      <div className="w-full">
        {/* Language Toggler */}
        <div className="bg-gradient-to-br from-[#d6e4fc] to-[#b3c7f7] p-4 rounded-xl shadow-lg mb-4">
          <div className="flex flex-col items-center">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              {t("subAdminSidebar.language.select")}
            </h3>
            <LanguageToggler isMobile={false} />
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="bg-gradient-to-br from-[#d6e4fc] to-[#b3c7f7] p-4 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              src={userProfile}
              alt="User Profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {subAdmin?.subAdminName}
              </h3>
              <p className="text-sm text-gray-700">{t("subAdminSidebar.profile.role")}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 mt-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          >
            {t("subAdminSidebar.buttons.logout")}
          </button>
        </div>
      </div>

      {/* Mobile Close Button */}
      <button
        className="lg:hidden mt-4 p-2 bg-gray-600 rounded text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
        onClick={() => setSidebarOpen(false)}
      >
        {t("subAdminSidebar.buttons.close")}
      </button>
    </motion.aside>
  );
};

export default SubAdminSidebar;
