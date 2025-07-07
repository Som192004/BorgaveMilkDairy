import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BranchCard } from "../components/BranchCard";
import { BranchForm } from "../components/BranchForm";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext" ;

export const BranchList = () => {
  const { t } = useTranslation();

  // States for branches, modals, form data, loading and errors
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    branchId: "",
    address: "",
    villageCity: "",
  });

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          "https://borgavemilkdairybackend.onrender.com/api/v1/branch/get-branches",
          { 
          withCredentials: true , 
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        });
        console.log("Branches fetched:", response.data.data);

        setBranches(response.data.data);

        if (response.status === 200) {
          setBranches(response.data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch (error) {
        if (error.response) {
          // The request was made, and the server responded with a status code outside 2xx
          if (error.response.status === 400) {
            setError("Bad Request: Please check your input.");
          } else if (error.response.status === 401) {
            setError("Unauthorized: Please log in again.");
          } else if (error.response.status === 403) {
            setError(
              "Forbidden: You don’t have permission to access this resource."
            );
          } else if (error.response.status === 404) {
            setError("Not Found: The requested resource was not found.");
          } else if (error.response.status === 500) {
            setError("Internal Server Error: Please try again later.");
          } else {
            setError(
              `Error ${error.response.status}: ${error.response.statusText}`
            );
          }
        } else if (error.request) {
          // The request was made, but no response was received
          setError(
            "Network Error: Unable to reach the server. Please check your internet connection."
          );
        } else {
          // Something else happened in setting up the request
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [t]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open the form in edit mode
  const handleEdit = (id) => {
    const branchToEdit = branches.find((branch) => branch.branchId === id);
    if (branchToEdit) {
      setFormData({
        branchId: branchToEdit.branchId,
        address: branchToEdit.branchAddress || branchToEdit.address,
        villageCity: branchToEdit.location || branchToEdit.villageCity,
      });
      setIsEditing(true);
      setEditId(id);
      setIsFormOpen(true);
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // Delete branch and update state
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://borgavemilkdairybackend.onrender.com/api/v1/branch/delete-branch/${deleteId}`,
        { withCredentials: true , 
          headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch.branchId !== deleteId)
      );
    } catch (err) {
      console.error("Error deleting branch:", err);
      setError("Failed to delete branch.");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  // Save branch (create or update)
  const handleSaveBranch = async () => {
    if (!formData.branchId || !formData.address || !formData.villageCity) {
      alert("All Fields are required!");
      return;
    }

    try {
      if (isEditing) {
        const response = await axios.patch(
          `https://borgavemilkdairybackend.onrender.com/api/v1/branch/update-branch/${editId}`,
          {
            branchId: formData.branchId,
            branchAddress: formData.address,
            location: formData.villageCity,
          },
          { withCredentials: true , headers: {
            authorization: `Bearer ${accessToken}`,
          },}
        );
        if (response.status === 200) {
          setBranches((prevBranches) =>
            prevBranches.map((branch) =>
              branch.branchId === editId
                ? {
                    ...branch,
                    branchId: formData.branchId,
                    branchAddress: formData.address,
                    location: formData.villageCity,
                  }
                : branch
            )
          );
        }
      } else {
        const response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/branch/create-branch",
          {
            branchId: formData.branchId,
            branchAddress: formData.address,
            location: formData.villageCity,
          },
          { withCredentials: true ,headers: {
            authorization: `Bearer ${accessToken}`,
          },}
        );
        if (response.status === 200 || response.status === 201) {
          setBranches((prevBranches) => [...prevBranches, response.data.data]);
        }
      }
      // Reset form state after saving
      setIsFormOpen(false);
      setIsEditing(false);
      setEditId(null);
      setFormData({ branchId: "", address: "", villageCity: "" });
      setError("");
    } catch (err) {
      console.error("Error saving branch:", err);
      setError("Failed to save branch.");
    }
  };

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      <h2 className="text-4xl font-bold mb-10 text-center text-[#2c447f]">
        {t("branch.title")}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {/* Branch List / Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : branches.length === 0 ? (
        <p className="text-center text-gray-700">
          {"No branches available."}
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {branches.map((branch) => (
            <motion.div
              key={branch.branchId}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <BranchCard
                branch={branch}
                onEdit={() => handleEdit(branch.branchId)}
                onDelete={() => confirmDelete(branch.branchId)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating Add Branch Button */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          setIsEditing(false);
          setFormData({ branchId: "", address: "", villageCity: "" });
        }}
        className="fixed bottom-6 right-6 bg-[#2c447f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1b2d5b] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c447f]"
        aria-label={t("branch.buttons.addBranch")}
      >
        {t("branch.buttons.addBranch")}
      </button>

      {/* Branch Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 overflow-y-auto z-50"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-xl font-semibold">
                  {isEditing
                    ? t("branch.buttons.editBranch")
                    : t("branch.buttons.addBranch")}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  aria-label="Close Modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Modal Content */}
              <BranchForm
                isEditing={isEditing}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSaveBranch={handleSaveBranch}
                setIsFormOpen={setIsFormOpen}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Close Confirmation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-xl font-semibold mb-4 text-center">
                {t("branch.alerts.confirmDeleteTitle")}
              </h3>
              <p className="text-center mb-4">
                {t("branch.alerts.confirmDelete")}
              </p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 focus:outline-none"
                >
                  {t("branch.alerts.no")}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:outline-none"
                >
                  {t("branch.alerts.yes")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
