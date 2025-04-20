import React, { useState, useEffect } from "react";
import { SubAdminCard } from "../components/SubAdminCard";
import { SubAdminForm } from "../components/SubAdminForm";
import axios from "axios";
import { ErrorDialog } from "../components/ErrorDialog";
import { motion, AnimatePresence } from "framer-motion";

export const SubAdminList = () => {
  // State for sub-admins and modal helpers
  const [subAdmins, setSubAdmins] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState([]);

  // Form state (image is kept as a file)
  const [formData, setFormData] = useState({
    name: "",
    image: null, // file object will be stored here
    mobile: "",
    password: "",
    address: "",
    branchId: "",
  });

  // Fetch sub-admins from the backend when component mounts
  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        const response = await axios.get(
          "https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/get-all-subadmins",
          { withCredentials: true }
        );
        console.log("Fetched sub-admins:", response.data.data);
        setSubAdmins(response.data.data);
      } catch (error) {
        console.error("Error fetching sub-admins:", error);
      }
    };
    fetchSubAdmins();
  }, []);

  // Handle opening edit mode
  const handleEdit = (id) => {
    const subAdminToEdit = subAdmins.find((subAdmin) => subAdmin._id === id);
    if (subAdminToEdit) {
      // For security reasons, we don't prefill the password.
      setFormData({
        name: subAdminToEdit.subAdminName,
        image: null,
        mobile: subAdminToEdit.mobileNumber,
        password: subAdminToEdit.subAdminPassword,
        address: subAdminToEdit.address,
        branchId: subAdminToEdit.branch.branchId,
      });
      setIsEditing(true);
      setEditId(id);
      setIsFormOpen(true);
    }
  };

  // Confirm deletion
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // Handle deletion API call
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/delete/${deleteId}`,
        { withCredentials: true }
      );
      setSubAdmins((prev) =>
        prev.filter((subAdmin) => subAdmin._id !== deleteId)
      );
    } catch (error) {
      console.error("Error deleting sub-admin:", error);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  // Handle input field changes (for text fields)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes; store the file (not a URL)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Handle saving (create or update) a sub-admin via API
  const handleSaveSubAdmin = async () => {
    try {
      if (isEditing) {
        // Update existing sub-admin using FormData to include file
        const dataUpdate = new FormData();
        dataUpdate.append("subAdminName", formData.name);
        if (formData.image) {
          dataUpdate.append("image", formData.image);
        }
        dataUpdate.append("mobileNumber", formData.mobile);
        dataUpdate.append("subAdminPassword", formData.password);
        dataUpdate.append("address", formData.address);
        dataUpdate.append("branchId", formData.branchId);

        const response = await axios.patch(
          `https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/update/${editId}`,
          dataUpdate,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.status === 200) {
          // Update state with the updated sub-admin returned from API
          setSubAdmins((prev) =>
            prev.map((subAdmin) =>
              subAdmin._id === editId ? response.data.data : subAdmin
            )
          );
        }
      } else {
        // Create new sub-admin using FormData
        const dataCreate = new FormData();
        dataCreate.append("subAdminName", formData.name);
        if (formData.image) {
          dataCreate.append("image", formData.image);
        }
        dataCreate.append("mobileNumber", formData.mobile);
        dataCreate.append("subAdminPassword", formData.password);
        dataCreate.append("address", formData.address);
        dataCreate.append("branchId", formData.branchId);

        const response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/addSubAdmin",
          dataCreate,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Sub-admin created:", response);
        if (response.status === 201 || response.status === 200) {
          setSubAdmins((prev) => [...prev, response.data.data]);
        }
      }
      // Reset form state after saving
      setIsFormOpen(false);
      setIsEditing(false);
      setEditId(null);
      setFormData({
        name: "",
        image: null,
        mobile: "",
        password: "",
        address: "",
        branchId: "",
      });
    } catch (error) {
      console.error("Error saving sub-admin:", error);
      if (error.response && error.response.status === 400) {
        setErrors([error.response.data.error]);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setErrors([error.response.data.error]);
      } else if (error.code === "ERR_NETWORK") {
        setErrors([
          "Network error. Please check your connection and try again.",
        ]);
      } else {
        setErrors(["An unexpected error occurred. Please try again."]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-[#2c447f]">
          Sub-Admin Management
        </h2>

        {/* SubAdmin Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {subAdmins.map((subAdmin) => (
              <motion.div
                key={subAdmin._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SubAdminCard
                  subAdmin={subAdmin}
                  onEdit={() => handleEdit(subAdmin._id)}
                  onDelete={() => confirmDelete(subAdmin._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating button to add a new sub-admin */}
        <button
          onClick={() => {
            setIsFormOpen(true);
            setIsEditing(false);
            setFormData({
              name: "",
              image: null,
              mobile: "",
              password: "",
              address: "",
              branchId: "",
            });
          }}
          className="fixed bottom-6 right-6 bg-[#2c447f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1b2d5b] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Add Sub-Admin
        </button>

        {/* Sub-admin Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 flex justify-center items-center px-4 z-50"
              role="dialog"
              aria-modal="true"
            >
              <SubAdminForm
                isEditing={isEditing}
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                handleSaveSubAdmin={handleSaveSubAdmin}
                setIsFormOpen={setIsFormOpen}
              />
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Confirm Deletion
                </h3>
                <p className="text-center mb-6">
                  Are you sure you want to delete this sub-admin?
                </p>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-[#4c76ba] text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-[#d9534f] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-150"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Dialog */}
        {errors.length > 0 && (
          <ErrorDialog errors={errors} onClose={() => setErrors([])} />
        )}
      </div>
    </div>
  );
};

export default SubAdminList;
