import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SubAdminSidebar } from "./SubAdminSidebar";
import { Menu } from "lucide-react"; // For the hamburger icon
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
export const SubAdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [subAdmin, setSubAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAuth();
  // Safely retrieve sub-admin info from localStorage
  const responseByLS = JSON.parse(localStorage.getItem("response") || "{}");

  //This should be asked that whether is it required to make this api call or not . . .
  const fetchSubAdmin = async () => {
    if (!responseByLS.data?.data?.subAdmin?.id) {
      console.error("No sub-admin info found in localStorage.");
      setIsLoading(false);
      return;
    }
    const subAdminId = responseByLS.data.data.subAdmin.id;
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/get/${subAdminId}`,
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      setSubAdmin(response.data.data);
    } catch (error) {
      console.error("Error fetching subadmin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmin();
  }, []);

  // Closes the mobile sidebar when the backdrop is clicked
  const handleBackdropClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-black backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0"
          >
            <SubAdminSidebar
              isOpen={isSidebarOpen}
              setSidebarOpen={setSidebarOpen}
              subAdmin={subAdmin}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible) */}
      <div className="hidden lg:block">
        <SubAdminSidebar
          isOpen={true}
          setSidebarOpen={setSidebarOpen}
          subAdmin={subAdmin}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};
