// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { motion } from "framer-motion";

// export const AdminReport = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [reportData, setReportData] = useState(null);
//   const { t } = useTranslation();

//   // Sample data for reports
//   const fetchReportData = (type) => {
//     const data = {
//       daily: {
//         "Branch 1": 5000,
//         "Branch 2": -3000,
//         "Branch 3": 10000,
//       },
//       weekly: {
//         "Branch 1": 15000,
//         "Branch 2": -7000,
//         "Branch 3": 25000,
//       },
//       monthly: {
//         "Branch 1": 50000,
//         "Branch 2": -20000,
//         "Branch 3": 70000,
//       },
//     };
//     return data[type] || {};
//   };

//   const queryParams = new URLSearchParams(location.search);
//   const reportType = queryParams.get("type");

//   useEffect(() => {
//     if (reportType) {
//       const data = fetchReportData(reportType);
//       setReportData(data);
//     }
//   }, [reportType]);

//   const calculateTotal = () => {
//     if (!reportData) return 0;
//     return Object.values(reportData).reduce((acc, curr) => acc + curr, 0);
//   };

//   const handleBranchClick = (branch) => {
//     navigate(`/branch-details?branch=${branch}`);
//   };

//   // For hover effects on branch cards
//   const [hoveredBranch, setHoveredBranch] = useState(null);

//   // Framer Motion variants for branch cards
//   const branchVariants = {
//     initial: { opacity: 0, y: 10 },
//     animate: { opacity: 1, y: 0 },
//     hover: { scale: 1.02 },
//   };

//   // Variants for the summary box
//   const summaryVariants = {
//     initial: { opacity: 0, scale: 0.95 },
//     animate: { opacity: 1, scale: 1 },
//     hover: { scale: 1.02 },
//   };

//   // Allow keyboard navigation for branch cards
//   const handleKeyPress = (event, branch) => {
//     if (event.key === "Enter" || event.key === " ") {
//       handleBranchClick(branch);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#d0e1f9] to-[#a8c0ff] flex flex-col p-8">
//       <motion.h1
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="text-4xl font-semibold text-gray-800 mb-8 text-center"
//       >
//         {reportType &&
//           t("report.title", { type: t(`report.types.${reportType}`) })}
//       </motion.h1>

//       {reportData ? (
//         <div className="space-y-6">
//           <div className="space-y-4">
//             {Object.keys(reportData).map((branch) => (
//               <motion.div
//                 key={branch}
//                 variants={branchVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover="hover"
//                 transition={{ duration: 0.3 }}
//                 role="button"
//                 tabIndex={0}
//                 onKeyPress={(e) => handleKeyPress(e, branch)}
//                 className="flex justify-between items-center cursor-pointer bg-white p-6 rounded-lg transition-all duration-300 transform hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 style={{
//                   boxShadow:
//                     hoveredBranch === branch
//                       ? "0 4px 20px rgba(0, 0, 0, 0.15)"
//                       : "none",
//                 }}
//                 onClick={() => handleBranchClick(branch)}
//                 onMouseEnter={() => setHoveredBranch(branch)}
//                 onMouseLeave={() => setHoveredBranch(null)}
//               >
//                 <span className="text-xl font-medium text-gray-700">
//                   {branch}
//                 </span>
//                 <span
//                   className={`text-xl font-semibold ${
//                     reportData[branch] < 0 ? "text-red-600" : "text-green-600"
//                   }`}
//                 >
//                   {reportData[branch] < 0
//                     ? t("report.loss", { amount: Math.abs(reportData[branch]) })
//                     : t("report.profit", { amount: reportData[branch] })}
//                 </span>
//               </motion.div>
//             ))}
//           </div>

//           <motion.div
//             variants={summaryVariants}
//             initial="initial"
//             animate="animate"
//             whileHover="hover"
//             transition={{ duration: 0.5 }}
//             className="mt-8 p-8 rounded-lg shadow-xl bg-white opacity-95 transition-all duration-500"
//             role="region"
//             aria-label="Report Summary"
//           >
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//               {t("report.summary.title")}
//             </h2>
//             <p className="text-xl text-gray-600 mb-4">
//               {t("report.summary.description")}
//             </p>
//             <div className="flex justify-between items-center">
//               <span className="text-xl text-gray-800">
//                 {t("report.summary.totalLabel")}:
//               </span>
//               <div className="text-2xl font-semibold text-blue-700">
//                 {t("report.summary.amount", { amount: calculateTotal() })}
//               </div>
//             </div>
//             <p className="mt-4 text-gray-600">
//               {calculateTotal() < 0
//                 ? t("report.summary.lossMessage")
//                 : t("report.summary.profitMessage")}
//             </p>
//           </motion.div>
//         </div>
//       ) : (
//         <p className="text-gray-700 text-center mt-6">{t("report.noData")}</p>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import axios from "axios"; // Import Axios

export const AdminReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [branchList, setBranchList] = useState([]); 
  const [reportData, setReportData] = useState(null);
  const [hoveredBranch, setHoveredBranch] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const reportType = queryParams.get("type");

  // Fetch branch list from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("https://borgavemilkdairybackend.onrender.com/api/v1/branch/get-branches-for-customer"); // Adjust API URL
        setBranchList(response.data.data); // Assuming API returns an array of branch names
        // console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const calculateTotal = () => {
    if (!reportData) return 0;
    return Object.values(reportData).reduce((acc, curr) => acc + curr, 0);
  };

  const handleBranchClick = (branch) => {
    navigate(`/branch-details?branch=${branch}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d0e1f9] to-[#a8c0ff] flex flex-col p-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-semibold text-gray-800 mb-8 text-center"
      >
        {reportType && t("report.title", { type: t(`report.types.${reportType}`) })}
      </motion.h1>

      {branchList?.length === 0 ? (
        <p className="text-gray-700 text-center mt-6">{("Loading Reports")}</p>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {branchList?.map((branch) => (
              <motion.div
                key={branch.branchId}
                className="flex justify-between items-center cursor-pointer bg-white p-6 rounded-lg transition-all duration-300 transform hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  boxShadow: hoveredBranch === branch ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none",
                }}
                onClick={() => handleBranchClick(branch)}
                onMouseEnter={() => setHoveredBranch(branch)}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <span className="text-xl font-medium text-gray-700">{`${branch.branchId}. ${branch.branchAddress} ${branch.location}`}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
