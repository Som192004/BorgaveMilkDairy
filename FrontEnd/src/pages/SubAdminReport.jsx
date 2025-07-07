import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; // Importing a date picker library
import "react-datepicker/dist/react-datepicker.css"; // Importing styles for the date picker
import { useAuth } from "../context/AuthContext";
export const SubAdminReport = () => {
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [farmerID, setFarmerID] = useState(""); // Updated variable name
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("farmersLoan");
  const [tmpData , setTmpDate] = useState(null);
  const BASE_URL = "https://borgavemilkdairybackend.onrender.com/api/v1";
  const { accessToken } = useAuth();
  // Function to handle start date selection and calculate end date
  const handleStartDateChange = (date) => {
    setStartDate(date);
    const selectedDay = date.getDate();
    setTmpDate(selectedDay)
    const month = date.getMonth();
    const year = date.getFullYear();

    if (selectedDay === 1) {
      setEndDate(new Date(year, month, 11));
    } else if (selectedDay === 11) {
      setEndDate(new Date(year, month, 21));
    } else if (selectedDay === 21) {
      setEndDate(new Date(year, month + 1, 1));
    }
  };

  const downloadReport = async (url, filename) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${url}`, {
        responseType: "blob",
        withCredentials: true,
        headers : {
          authorization: `Bearer ${accessToken}`
        }
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert(
        "Report for selected date range may not exist or internal server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Farmers' Reports
      </h2>
      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "farmerCombinedReport"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("farmerCombinedReport")}
        >
          Farmers' Combined Report
        </button>

        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "allfarmersCombinedReport"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("allfarmersCombinedReport")}
        >
          All Farmers' Combined Report
        </button>

        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "farmersLoan"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("farmersLoan")}
        >
          Farmers' Loan Report
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "loanByMobile"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("loanByMobile")}
        >
          Loan Report by Farmer ID
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "farmersTransaction"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("farmersTransaction")}
        >
          Farmers' Transaction Report
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "transactionByMobile"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("transactionByMobile")}
        >
          Transaction Report by Farmer ID
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === "productTransaction"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("productTransaction")}
        >
          Product Transaction Report
        </button>
      </div>
          
      {/* Common date picker section */}
      <div className="p-4 bg-gray-100 rounded-lg mb-4">
        <div className="flex items-center justify-between space-x-4">
          <h3 className="w-1/3 text-lg font-semibold text-gray-800 flex-shrink-0">
            Select Date Range:
          </h3>
          <div className="w-1/3">
            <label className="sr-only">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              filterDate={(date) => {
                const day = date.getDate();
                return day === 1 || day === 11 || day === 21; // Allow only 1, 11, 21
              }}
            />
          </div>
          <div className="w-1/3">
            <label className="sr-only">End Date:</label>
            <input
              type="text"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none "
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {activeTab === "allfarmersCombinedReport" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            All Farmers' Combined Report
          </h3>

          <button
            onClick={() =>
              downloadReport(
                `/farmer/combined-report-for-all-farmers/${tmpData}`,
                `$all_Farmers_Combined_Report.pdf`
              )
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading
              ? "Downloading..."
              : "Download All Farmers' Combined Report"}
          </button>
        </div>
      )}

      {activeTab === "farmerCombinedReport" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Farmers' Combined Report
          </h3>
          <input
            type="text"
            placeholder="Enter Farmer ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            value={farmerID} // Updated variable name
            onChange={(e) => setFarmerID(e.target.value)} // Updated variable name
          />

          <button
            onClick={() =>
              downloadReport(
                `/farmer/combined-report-by-mobileNumber/${farmerID}/${tmpData}`, // Updated variable name
                `${farmerID}_Farmer_Combined_Report.pdf` // Updated variable name
              )
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download Farmers' Combined Report"}
          </button>
        </div>
      )}

      {activeTab === "farmersLoan" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Farmers' Loan Report
          </h3>
          <button
            onClick={() => {
              if (startDate && endDate) {
                downloadReport(
                  `/loan/subAdmin/loans/report/${startDate}/${endDate}`,
                  `Farmers_Loan_Report_${startDate}_to_${endDate}.pdf`
                );
              } else {
                alert("Please select a valid date range");
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download Farmers' Loan Report"}
          </button>
        </div>
      )}

      {activeTab === "loanByMobile" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loan Report by Farmer ID
          </h3>
          <input
            type="text"
            placeholder="Enter Farmer ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            value={farmerID} // Updated variable name
            onChange={(e) => setFarmerID(e.target.value)} // Updated variable name
          />
          <button
            onClick={() => {
              if (farmerID) {
                // Updated variable name
                downloadReport(
                  `/loan/subAdmin/loans/report/${farmerID}/${startDate}/${endDate}`, // Updated variable name
                  `Loan_Report_${farmerID}.pdf` // Updated variable name
                );
              } else {
                alert("Please enter a Farmer ID");
              }
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download Loan Report by Farmer ID"}
          </button>
        </div>
      )}

      {activeTab === "farmersTransaction" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Farmers' Milk Transaction Report
          </h3>
          <button
            onClick={() =>
              downloadReport(
                `/milk/subAdmin/branch-transactions/${startDate}/${endDate}`,
                "Farmers_Transaction_Report.pdf"
              )
            }
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading
              ? "Downloading..."
              : "Download Farmers' Transaction Report"}
          </button>
        </div>
      )}

      {activeTab === "transactionByMobile" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Milk Transaction Report by Farmer ID
          </h3>
          <input
            type="text"
            placeholder="Enter Farmer ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            value={farmerID} // Updated variable name
            onChange={(e) => setFarmerID(e.target.value)} // Updated variable name
          />
          <button
            onClick={() => {
              if (farmerID) {
                // Updated variable name
                downloadReport(
                  `/milk/subAdmin/farmer/${farmerID}/${startDate}/${endDate}`, // Updated variable name
                  `Transaction_Report_${farmerID}.pdf` // Updated variable name
                );
              } else {
                alert("Please enter a Farmer ID");
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading
              ? "Downloading..."
              : "Download Transaction Report by Farmer ID"}
          </button>
        </div>
      )}
      {activeTab === "productTransaction" && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Product Transaction Report
          </h3>
          {/* <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Report Type:
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div> */}
          <button
            onClick={() =>
              downloadReport(
                `/transaction/subAdmin/customer/${startDate}/${endDate}`,
                `${startDate}_${endDate}_Product_Transaction_Report.pdf`
              )
            }
            className="w-full bg-black hover:bg-black-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download Product Transaction Report"}
          </button>
        </div>
      )}
    </div>
  );
};
