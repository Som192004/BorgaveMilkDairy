// TransactionList.jsx
import React, { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ErrorDialog } from "../components/ErrorDialog";
import { useAuth } from "../context/AuthContext.jsx";
// Adjust the base URL as needed for your backend API
const API_BASE_URL = "https://borgavemilkdairybackend.onrender.com/api/v1";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [error , setError] = useState([]);
  const [msg , setMsg] = useState();
  const { accessToken } = useAuth();

  // Load transactions from API on mount
  useEffect(() => {

    const loadTransactions = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}/transaction/get-all-transactions`,
          { withCredentials: true , headers : {
            Authorization : `Bearer ${accessToken}`
          }}
        );
        console.log("Fetched transactions:", response.data.data);
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // setError([error.response.data.message])
        setMsg(error.response.data.message)
      }
    };
    loadTransactions();
  }, []);
  
  // Load available products from API on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}/category/get-all-products`,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        console.log("Fetched products:", response.data.data);
        setAvailableProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError([error.response.data.message])
      }
    };
    loadProducts();
  }, []);

  // Save new or updated transaction via API call
  const handleSaveTransaction = async (transactionData) => {
    if (editingTransaction) {
      // Update existing transaction
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.patch(
          `${API_BASE_URL}/transaction/update-transaction/${editingTransaction._id}`,
          transactionData,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        // Consistently extract the data from the ApiResponse wrapper
        const updatedTransaction = response.data.data;
        setTransactions(
          transactions.map((t) =>
            t._id === editingTransaction._id ? updatedTransaction : t
          )
        );
        setEditingTransaction(null);
      } catch (error) {
        setError([error.response.data.message])
        console.error("Error updating transaction:", error);
      }
    } else {
      // Create a new transaction
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/transaction/save-transaction`,
          transactionData,
          { withCredentials: true , headers : {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        const newTransaction = response.data.data;
        setTransactions([...transactions, newTransaction]);
      } catch (error) {
        setError([error.response.data.message])
        console.error("Error creating transaction:", error);
      }
    }
    setIsFormOpen(false);
  };

  const handleEdit = (transaction) => {
    console.log("transaction: " , transaction)
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(
        `${API_BASE_URL}/transaction/delete-transaction/${id}`,
        { withCredentials: true , headers : {
          Authorization: `Bearer ${accessToken}`
        }}
      );
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (error) {
      setError([error.response.data.message])
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {error.length > 0  && (
          <ErrorDialog errors={error} onClose={() => setError([])} />
        )}
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-[#2c447f]">
          Transactions
        </h2>

        {/* Transactions Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">
                  Transaction ID
                </th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">
                  Customer Name
                </th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">
                  Mobile
                </th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">
                  Date/Time
                </th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">
                  Product Name
                </th>
                <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-700">
                  Quantity
                </th>
                <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-700">
                  Unit Price
                </th>
                <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-700">
                  Item Total
                </th>
                <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-700">
                  Total Amount
                </th>
                <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody className="divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((transaction) =>
                    transaction.items.map((item, index) => {
                      // Lookup product details for each item
                      const product = availableProducts.find(
                        (p) => p._id === item.product
                      );
                      const unitPrice = product ? product.productPrice : 0;
                      return (
                        <motion.tr
                          key={`${transaction._id}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="hover:bg-gray-100 transition"
                        >
                          {index === 0 && (
                            <>
                              <td
                                className="px-2 sm:px-4 py-2 font-semibold bg-gray-50"
                                rowSpan={transaction.items.length}
                              >
                                {transaction._id}
                              </td>
                              <td
                                className="px-2 sm:px-4 py-2 font-semibold bg-gray-50"
                                rowSpan={transaction.items.length}
                              >
                                {transaction.customerName}
                              </td>
                              <td
                                className="px-2 sm:px-4 py-2 font-semibold bg-gray-50"
                                rowSpan={transaction.items.length}
                              >
                                {transaction.mobileNumber}
                              </td>
                              <td
                                className="px-2 sm:px-4 py-2 font-semibold bg-gray-50"
                                rowSpan={transaction.items.length}
                              >
                                {new Date(transaction.time).toLocaleString()}
                              </td>
                            </>
                          )}
                          <td className="px-2 sm:px-4 py-2">
                            {product
                              ? product.productName
                              : "Product not found"}
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-right">
                            ${unitPrice.toFixed(2)}
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-right">
                            ${item.pamount.toFixed(2)}
                          </td>
                          {index === 0 && (
                            <>
                              <td
                                className="px-2 sm:px-4 py-2 text-right font-bold bg-gray-50"
                                rowSpan={transaction.items.length}
                              >
                                ${transaction.amount.toFixed(2)}
                              </td>
                              <td
                                className="px-2 sm:px-4 py-2 bg-gray-50"
                                rowSpan={transaction.items.length}
                              >
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleEdit(transaction)}
                                    className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-yellow-600 transition cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(transaction._id)
                                    }
                                    className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-red-600 transition cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </motion.tr>
                      );
                    })
                  )
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td
                      colSpan="10"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      {msg}
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>

        {/* Floating "Add Transaction" Button */}
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingTransaction(null);
          }}
          className="fixed bottom-6 right-6 bg-[#2c447f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1b2d5b] transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        >
          + Add Transaction
        </button>

        {/* Transaction Form Modal */}
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
              <TransactionForm
                isEditing={!!editingTransaction}
                handleSaveTransaction={handleSaveTransaction}
                setIsFormOpen={setIsFormOpen}
                availableProducts={availableProducts}
                editingTransaction={editingTransaction}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionList;
