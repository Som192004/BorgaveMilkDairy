import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./index.js";
import { Footer } from "./index.js";

export const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content Section */}
      <div className="flex-grow">
        {/* Ensure no unintended spacing */}
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
