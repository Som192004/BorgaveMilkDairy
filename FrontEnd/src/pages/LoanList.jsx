import React, { useState, useEffect } from "react";
import LoanForm from "../components/LoanForm.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext" ;

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);

  // States for Deduct Loan Modal
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [loanToDeduct, setLoanToDeduct] = useState(null);
  const [deductAmount, setDeductAmount] = useState("");
  const { accessToken } = useAuth();
  // Fetch loans from the backend and flatten the embedded loan arrays
  const fetchLoans = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/loan/get-all-loans",
        { withCredentials: true, headers : {
          Authorization: `Bearer ${accessToken}`
        } }
      );
      console.log(response);

      if (response.data && response.data.data) {
        // Assume response.data.data is an array of farmers with a "loan" array.
        const farmers = response.data.data;
        let loansList = [];
        farmers.forEach((farmer) => {
          if (Array.isArray(farmer.loan) && farmer.loan.length > 0) {
            farmer.loan.forEach((loanI) => {
              // Filter out soft-deleted loans
              if (!loanI.isDeleted) {
                loansList.push({
                  id: loanI._id, // each loan must have a unique id
                  farmerName: farmer.farmerName,
                  farmerId: farmer.farmerId,
                  phoneNumber: farmer.mobileNumber,
                  dueAmount: loanI.loanAmount,
                  loanDate: loanI.loanDate,
                });
              }
            });
          }
        });
        setLoans(loansList);
        console.log("Loans fetched:", loansList);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Save (create or update) a loan via the backend
  const handleSaveLoan = async (loan) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (editingLoan) {
        // Update existing loan
        const response = await axios.put(
          `https://borgavemilkdairybackend.onrender.com/api/v1/loan/update/${editingLoan.id}`,
          loan,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        console.log("Loan updated:", response.data);
      } else {
        // Create new loan
        const response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/loan/add-loan",
          loan,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        console.log("Loan created:", response.data);
      }
      setIsFormOpen(false);
      setEditingLoan(null);
      fetchLoans();
    } catch (error) {
      console.error("Error saving loan:", error);
    }
  };

  // Open form for editing
  const handleEdit = (loan) => {
    setEditingLoan(loan);
    setIsFormOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (loan) => {
    setLoanToDelete(loan);
    setIsDeleteModalOpen(true);
  };

  // Delete loan via backend
  const handleDeleteConfirmed = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.delete(
        `https://borgavemilkdairybackend.onrender.com/api/v1/loan/delete/${id}`,
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      console.log("Loan deleted:", response.data);
      setIsDeleteModalOpen(false);
      setLoanToDelete(null);
      fetchLoans();
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  // Open Deduct Loan Modal
  const openDeductModal = (loan) => {
    setLoanToDeduct(loan);
    setDeductAmount(""); // Reset the deduction amount
    setIsDeductModalOpen(true);
  };

  // Handle changes in the deduct amount input
  const handleDeductInputChange = (e) => {
    setDeductAmount(e.target.value);
  };

  // Handle submission of the deduction amount
  const handleDeductSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(deductAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    if (amount > parseFloat(loanToDeduct.dueAmount)) {
      alert("Deduct amount cannot exceed the due amount.");
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `https://borgavemilkdairybackend.onrender.com/api/v1/loan/deduct/${loanToDeduct.id}`,
        { loanAmount: amount },
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      console.log("Loan deducted:", response.data);
      setIsDeductModalOpen(false);
      setLoanToDeduct(null);
      fetchLoans();
    } catch (error) {
      console.error("Error deducting loan:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 relative">
      <h2 className="text-4xl font-bold mb-10 text-center text-[#2c447f]">
        Loan Records
      </h2>

      {/* Loans Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Farmer ID</th>
              <th className="px-4 py-3 text-left">Farmer Name</th>
              <th className="px-4 py-3 text-left">Phone Number</th>
              <th className="px-4 py-3 text-left">Due Amount ($)</th>
              <th className="px-4 py-3 text-left">Loan Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.length > 0 ? (
              loans.map((loan, idx) => (
                <AnimatePresence key={loan.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3">{loan.farmerId}</td>
                    <td className="px-4 py-3">{loan.farmerName}</td>
                    <td className="px-4 py-3">{loan.phoneNumber}</td>
                    <td className="px-4 py-3">${loan.dueAmount}</td>
                    <td className="px-4 py-3">
                      {loan.loanDate &&
                        new Date(loan.loanDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(loan)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                        aria-label={`Edit loan for ${loan.farmerName}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeductModal(loan)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        aria-label={`Deduct loan for ${loan.farmerName}`}
                      >
                        Deduct Loan
                      </button>
                      <button
                        onClick={() => openDeleteModal(loan)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                        aria-label={`Delete loan for ${loan.farmerName}`}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                </AnimatePresence>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No loan records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Loan Button */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          setEditingLoan(null);
        }}
        className="fixed bottom-6 right-6 bg-[#2c447f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1b2d5b] transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        aria-label="Add new loan"
      >
        + Add Loan
      </button>

      {/* Loan Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
            aria-modal="true"
            role="dialog"
          >
            <LoanForm
              isEditing={!!editingLoan}
              handleSaveLoan={handleSaveLoan}
              setIsFormOpen={setIsFormOpen}
              editingLoan={editingLoan}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && loanToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
            >
              <h3 className="text-xl font-semibold text-center mb-4">
                Confirm Delete
              </h3>
              <p className="text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold">{loanToDelete.farmerName}</span>'s
                loan record?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteConfirmed(loanToDelete.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deduct Loan Modal */}
      <AnimatePresence>
        {isDeductModalOpen && loanToDeduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto"
            >
              <h3 className="text-xl font-semibold text-center mb-4">
                Deduct Loan
              </h3>
              <form onSubmit={handleDeductSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="deductAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount to Deduct ($)
                  </label>
                  <input
                    type="number"
                    id="deductAmount"
                    name="deductAmount"
                    value={deductAmount}
                    onChange={handleDeductInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsDeductModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    onClick={handleDeductSubmit}
                  >
                    Confirm Deduction
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoanList;
