import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Menu } from "lucide-react"; // For the hamburger icon
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const { accessToken } = useAuth();
  // Fetch admin details
  const fetchAdmin = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/admin/get-admin",
        { withCredentials: true , headers : {
          authorization: `Bearer ${accessToken}`
        }}
      );
      console.log(response);
      setAdmin(response.data.data.admin);
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  // Close sidebar when clicking the backdrop
  const handleBackdropClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Hamburger Menu */}
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-blue-700 text-white rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Open sidebar menu"
      >
        <Menu size={24} />
      </button>

      {/* Animated Sidebar and Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 lg:hidden bg-black backdrop-blur-sm"
              onClick={handleBackdropClick}
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:static"
            >
              <AdminSidebar
                isOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                admin={admin}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar always visible */}
      <div className="hidden lg:block">
        <AdminSidebar
          isOpen={true}
          setSidebarOpen={setSidebarOpen}
          admin={admin}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
          {/* <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1> */}
          {/* {admin && (
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">Welcome, {admin.adminName}</span>
              {admin.avatarUrl ? (
                <img
                  src={admin.avatarUrl}
                  alt={admin.adminName}
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                  {admin.adminName?.charAt(0)}
                </div>
              )}
            </div> */}
          {/* )} */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
