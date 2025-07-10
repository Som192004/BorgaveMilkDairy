import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImage from "../assets/Borgave_Logo_BG_Removed.png";
import userProfile from "../assets/user_profile.png";
import { LanguageToggler } from "./LanguageToggler";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
export const AdminSidebar = ({ isOpen, setSidebarOpen, admin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showReports, setShowReports] = useState(false);
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  useEffect(() => {
    if (!location.pathname.includes("/admin/reports")) {
      setShowReports(false);
    }
  }, [location]);

  // Ensure sidebar state updates on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const handleReportSelection = (reportType) => {
    navigate(`/admin/reports?type=${reportType}`);
    setShowReports(false);
  };

  const handleLogout = async () => {
    logout();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        "https://borgavemilkdairybackend.onrender.com/api/v1/admin/logout",
        {},
        { withCredentials: true , headers : {
          authorization: `Bearer ${accessToken}`
        }}
      );
      console.log(response);
      console.log("Logout successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bg-gradient-to-br from-blue-200 to-blue-400 z-50 h-screen p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 w-64 lg:w-80 flex flex-col border-r border-blue-300`}
    >
      <div className="flex-1 mb-16">
        <div className="mb-8 flex items-center space-x-3">
          <img src={logoImage} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-blue-900">
            {t("adminSidebar.title")}
          </h1>
        </div>
        <nav>
          <ul className="text-left space-y-2">
            {[
              { name: t("adminSidebar.menu.home"), path: "/admin" },
              {
                name: t("adminSidebar.menu.subAdmin"),
                path: "/admin/subadmin",
              },
              { name: t("adminSidebar.menu.branch"), path: "/admin/branch" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-900 hover:bg-blue-100 hover:shadow-sm"
                  }`}
                  onClick={() => setShowReports(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex justify-between items-center"
                onClick={() => setShowReports((prev) => !prev)}
                aria-expanded={showReports}
                aria-controls="reports-dropdown"
              >
                {t("adminSidebar.reports.title")}{" "}
                <span className="text-sm">{showReports ? "▲" : "▼"}</span>
              </button>
              <AnimatePresence>
                {showReports && (
                  <motion.div
                    id="reports-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg overflow-hidden z-10"
                  >
                    {["daily", "weekly", "monthly"].map((type) => (
                      <button
                        key={type}
                        className="w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-50 transition-all duration-200"
                        onClick={() => handleReportSelection(type)}
                      >
                        {t(`adminSidebar.reports.${type}`)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-4 rounded-xl shadow-lg mb-4">
          <div className="flex flex-col items-center">
            <h3 className="text-base font-semibold text-blue-900 mb-2">
              {t("adminSidebar.language.select")}
            </h3>
            <LanguageToggler isMobile={false} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-4 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              src={userProfile}
              alt={t("adminSidebar.profile.userImageAlt")}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
            <div>
              <h3 className="text-base font-semibold text-blue-900">
                {admin?.adminName || "Admin"}
              </h3>
              <p className="text-sm text-blue-800">
                {t("adminSidebar.profile.role")}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            {t("adminSidebar.buttons.logout")}
          </button>
        </div>
      </div>
      <button
        className="lg:hidden mt-4 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition flex items-center justify-center"
        onClick={() => setSidebarOpen(false)}
        aria-label={t("adminSidebar.buttons.close")}
      >
        <X size={24} />
      </button>
    </aside>
  );
};
