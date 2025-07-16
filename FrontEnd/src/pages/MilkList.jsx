import React, { useState, useEffect } from "react";
import axios from "axios";
import MilkForm from "../components/MilkForm.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext" ;

const MilkList = () => {
  const [milkEntries, setMilkEntries] = useState([]); // Array of farmer documents (each contains transactions)
  const [farmers, setFarmers] = useState([]); // For populating the MilkForm dropdown
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null); // A flattened transaction object
  const [error, setError] = useState(null);
  const [loadingMilk, setLoadingMilk] = useState(false);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // In YYYY-MM-DD format
  const { accessToken } = useAuth();
  
  // New state for custom delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // Fetch milk entries (farmers with transactions) from the backend
  const fetchMilkEntries = async () => {
    setLoadingMilk(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/milk/get-all-milk",
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      // Expected response: array of farmer objects with fields: farmerName, mobileNumber, transaction (array)
      const fetchedEntries = response.data.data || response.data;
      console.log("Fetched milk entries:", fetchedEntries);
      setMilkEntries(fetchedEntries);
      setError(null);
    } catch (err) {
      console.error("Error fetching milk entries:", err);
      setError("Error fetching milk entries. Please try again later.");
    } finally {
      setLoadingMilk(false);
    }
  };

  // Fetch farmers for the dropdown in MilkForm
  const fetchFarmers = async () => {
    setLoadingFarmers(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/farmer/get-all-farmers",
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      const fetchedFarmers = response.data.data || response.data;
      setFarmers(fetchedFarmers);
    } catch (err) {
      console.error("Error fetching farmers:", err);
    } finally {
      setLoadingFarmers(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchMilkEntries();
    fetchFarmers();
  }, []);

  // Automatically clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Optimistically update local state when saving a milk transaction
  const handleSaveMilkEntry = async (entry) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (editingEntry) {
        // Update existing milk transaction
        const response = await axios.patch(
          `https://borgavemilkdairybackend.onrender.com/api/v1/milk/update-milk/${editingEntry.farmerId}/${editingEntry._id}`,
          entry,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        console.log("Update response:", response);
        // The response returns an updated farmer document.
        const updatedFarmer = response.data.data;
        // Update the farmer's transactions in local state:
        setMilkEntries((prevEntries) =>
          prevEntries.map((farmer) => {
            if (farmer.farmerId === editingEntry.farmerId) {
              return { ...farmer, transaction: updatedFarmer.transaction };
            }
            return farmer;
          })
        );
        setEditingEntry(null);
      } else {
        // Add new milk transaction
        const response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/milk/add-milk",
          entry,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          } }
        );
        console.log("Add response:", response.data.data);
        const updatedFarmer = response.data.data;
        // Update local state: if the farmer exists, update their transactions; otherwise, add the new farmer
        setMilkEntries((prevEntries) => {
          const index = prevEntries.findIndex(
            (farmer) => farmer.farmerId === updatedFarmer.farmerId
          );
          if (index !== -1) {
            const newEntries = [...prevEntries];
            newEntries[index] = updatedFarmer;
            return newEntries;
          } else {
            return [...prevEntries, updatedFarmer];
          }
        });
      }
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      console.error("Error saving milk transaction:", err);
      setError(
        err.response?.data?.message ||
          "Error saving milk entry. Please try again."
      );
    }
  };

  // Open the form for editing a flattened milk transaction
  const handleEdit = (flatEntry) => {
    setEditingEntry(flatEntry);
    setIsFormOpen(true);
  };

  // Open the custom delete confirmation modal
  const openDeleteModal = (flatEntry) => {
    setEntryToDelete(flatEntry);
    setIsDeleteModalOpen(true);
  };

  // Delete a milk transaction with optimistic local update (called after confirmation)
  const handleDeleteConfirmed = async (transactionId, farmerId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(
        `https://borgavemilkdairybackend.onrender.com/api/v1/milk/delete-milk/${farmerId}/${transactionId}`,
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      // Update local state: remove the transaction from the corresponding farmer
      setMilkEntries((prevEntries) =>
        prevEntries.map((farmer) => {
          if (farmer.farmerId === farmerId) {
            return {
              ...farmer,
              transaction: farmer.transaction.filter(
                (txn) => txn._id !== transactionId
              ),
            };
          }
          return farmer;
        })
      );
      setError(null);
    } catch (err) {
      console.error("Error deleting milk transaction:", err);
      setError(
        err.response?.data?.message ||
          "Error deleting milk transaction. Please try again later."
      );
    } finally {
      setIsDeleteModalOpen(false);
      setEntryToDelete(null);
    }
  };
  {
    console.log("milkEntries: ", milkEntries);
  }
  // Flatten the nested milkEntries into individual transaction rows.
  const flatMilkTransactions = milkEntries.flatMap((entry) =>
    entry.transaction.map((txn) => ({
      _id: txn._id,
      farmerName: entry.farmerName,
      farmerNumber: entry.mobileNumber,
      farmerId: entry.farmerId,
      transactionDate: txn.transactionDate,
      transactionTime: txn.transactionTime,
      milkType: txn.milkType,
      fatPercentage: txn.fat,
      snfPercentage: txn.snf,
      milkQuantity: txn.milkQuantity,
      pricePerLitre: txn.pricePerLitre,
      transactionAmount: txn.transactionAmount,
    }))
  );

  // Sort the transactions in descending order (newest first) based on the full timestamp
  const sortedMilkTransactions = [...flatMilkTransactions].sort(
    (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
  );

  // Calculate total milk quantity per milkType for the selected day.
  // We assume selectedDate is in YYYY-MM-DD format.
  const totalsForSelectedDate = sortedMilkTransactions.filter((txn) => {
    const txnDate = new Date(txn.transactionDate).toISOString().split("T")[0];
    return txnDate === selectedDate;
  });

  const totalsByMilkType = totalsForSelectedDate.reduce((acc, txn) => {
    const type = txn.milkType;
    acc[type] = (acc[type] || 0) + txn.milkQuantity;
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-screen-xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 border-b-2 border-blue-300 pb-4">
            Milk Collection List
          </h2>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center">
            {error}
          </div>
        )}

        {/* Date Picker & Totals Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-200 to-blue-700 text-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <label className="font-semibold text-lg mb-2 md:mb-0">
                Select a date to view daily totals:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-white rounded px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {selectedDate && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">
                  Totals for {new Date(selectedDate).toLocaleDateString()}:
                </h3>
                {Object.keys(totalsByMilkType).length > 0 ? (
                  <ul className="mt-2">
                    {Object.entries(totalsByMilkType).map(([type, total]) => (
                      <li key={type} className="text-lg">
                        <span className="font-bold">{type} Milk:</span> {total}{" "}
                        Liters
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg">
                    No transactions found for this date.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Milk Transactions Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Farmer ID</th>
                <th className="px-4 py-3 text-left">Farmer Name</th>
                <th className="px-4 py-3 text-left">Transaction Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Milk Type</th>
                <th className="px-4 py-3 text-left">Fat %</th>
                <th className="px-4 py-3 text-left">SNF %</th>
                <th className="px-4 py-3 text-left">Milk Quantity (Liters)</th>
                <th className="px-4 py-3 text-left">Price/Litre (₹)</th>
                <th className="px-4 py-3 text-left">Transaction Amount (₹)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingMilk ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Loading milk entries...
                  </td>
                </tr>
              ) : sortedMilkTransactions.length > 0 ? (
                sortedMilkTransactions.map((flatEntry, idx) => (
                  <tr
                    key={flatEntry._id}
                    className={`transition-colors duration-200 ${
                      idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{flatEntry.farmerId}</td>
                    <td className="px-4 py-3">{flatEntry.farmerName}</td>
                    <td className="px-4 py-3">
                      {new Date(flatEntry.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {flatEntry.transactionTime}
                    </td>
                    <td className="px-4 py-3">{flatEntry.milkType}</td>
                    <td className="px-4 py-3">{flatEntry.fatPercentage}%</td>
                    <td className="px-4 py-3">{flatEntry.snfPercentage}%</td>
                    <td className="px-4 py-3">{flatEntry.milkQuantity}</td>
                    <td className="px-4 py-3">₹{flatEntry.pricePerLitre}</td>
                    <td className="px-4 py-3">
                      ₹{flatEntry.transactionAmount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(flatEntry)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition duration-150 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(flatEntry)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-150 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No milk collections available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Floating Add Milk Entry Button */}
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingEntry(null);
          }}
          className="fixed bottom-6 right-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full shadow-lg transition duration-200 transform hover:scale-105 cursor-pointer"
        >
          + Add Milk Entry
        </button>

        {/* Milk Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50"
              role="dialog"
              aria-modal="true"
            >
              <MilkForm
                isEditing={!!editingEntry}
                handleSaveMilkEntry={handleSaveMilkEntry}
                setIsFormOpen={setIsFormOpen}
                editingEntry={editingEntry}
                farmers={farmers} // Passing farmers to MilkForm for dropdown
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && entryToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
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
                  Are you sure you want to delete the milk transaction for{" "}
                  <strong>{entryToDelete.farmerName}</strong>?
                </p>
                <div className="flex justify-around">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteConfirmed(
                        entryToDelete._id,
                        entryToDelete.farmerId
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-150 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MilkList;
