import React, { useState, useEffect } from "react";
import axios from "axios";
import { ProductCard } from "../components/index.js";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";
import { ErrorDialog } from "../components/ErrorDialog.jsx";
import { useAuth } from "../context/AuthContext" ;
const socket = io("https://borgavemilkdairybackend.onrender.com");
export const ProductList = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors , setErrors] = useState([]) ;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const { accessToken } = useAuth();
  // ✅ Always reset selectedBranch when user visits ProductList
  useEffect(() => {
    setSelectedBranch(""); // Clear the selection every time user visits
    
  }, []);

  // ✅ Store selected branch in localStorage when changed
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    const branchName = e.target.options[e.target.selectedIndex].text;

    console.log("Selected Branch:", branchId, branchName);

    setSelectedBranch(branchId);

    // ✅ Store both values correctly in localStorage
    localStorage.setItem(
      "selectedBranch",
      JSON.stringify({ branchId, branchName })
    );

    setCategories([]); // Clear categories
    setProducts([]); // Clear products
  };

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        
        const response = await axios.get(
          "https://borgavemilkdairybackend.onrender.com/api/v1/branch/get-branches-for-customer"
        );
        setBranches(response.data.data);
      } catch (err) {
        setError("Failed to fetch branches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch categories when a branch is selected
  useEffect(() => {
    if (selectedBranch) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            `https://borgavemilkdairybackend.onrender.com/api/v1/category/get-categories-by-branch/${selectedBranch}`
          );

          const formattedCategories = response.data.data.map((category) => ({
            id: category._id,
            name: category.categoryName,
          }));

          setCategories([{ id: "all", name: "All" }, ...formattedCategories]);
          setSelectedCategory("all");
        } catch (err) {
          setError("Failed to fetch categories.");
        }
      };

      fetchCategories();
    }
  }, [selectedBranch]);

  // Fetch products when a category is selected
  useEffect(() => {
    if (selectedCategory && selectedBranch) {
      const fetchProducts = async () => {
        try {
          const url =
            selectedCategory === "all"
              ? `https://borgavemilkdairybackend.onrender.com/api/v1/category/get-all-products/${selectedBranch}`
              : `https://borgavemilkdairybackend.onrender.com/api/v1/category/get-category-from-branch-id/${selectedBranch}/${selectedCategory}`;

          const response = await axios.get(url);
          console.log(response.data.data);
          setProducts(response.data.data);
        } catch (err) {
          setError("Failed to fetch products.");
        }
      };

      fetchProducts();
    }
  }, [selectedCategory, selectedBranch]);

  useEffect(() => {
    socket.on("categoryUpdated", () => {
      if (selectedBranch) {
        axios.get(`https://borgavemilkdairybackend.onrender.com/api/v1/category/get-categories-by-branch/${selectedBranch}`)
          .then((response) => {
            setCategories([{ id: "all", name: "All" }, ...response.data.data.map((c) => ({ id: c._id, name: c.categoryName }))]);
          });
        
        axios.get(`https://borgavemilkdairybackend.onrender.com/api/v1/category/get-all-products/${selectedBranch}`)
          .then((response) => {
            setProducts(response.data.data);
          });
      }
    });
    return () => socket.off("categoryUpdated");
  }, [selectedBranch]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-6 px-4 sm:px-10">
        {/* ✅ Always show branch selection when user visits ProductList */}
        {!selectedBranch && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4 z-50">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-11/12 max-w-md text-center relative overflow-auto max-h-[90vh]">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Select Your Branch
              </h2>

              {loading ? (
                <p className="text-gray-500">Loading branches...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={handleBranchChange}
                  value={selectedBranch}
                >
                  <option value="">-- Select Branch --</option>
                  {branches.map((branch) => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.branchAddress}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {selectedBranch && (
          <>
            {/* Heading for Dairy Products */}
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
              {t("products.title")}
            </h2>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`cursor-pointer px-3 py-2 text-sm sm:text-base rounded-lg font-medium ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-500 hover:text-white transition`}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No categories available
                </p>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-fr">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.productName}
                    className="flex-shrink-0 w-full"
                  >
                    <ProductCard
                      product={product}
                      selectedBranch={selectedBranch}
                      categoryId={selectedCategory}
                      setGlobalErrors={setErrors}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  {t("products.noProducts")}
                </p>
              )}
            </div>
          </>
        )}
      {errors.length > 0 && (
        <ErrorDialog errors={errors} onClose={() => setErrors([])} />
      )}
      </div>
    </div>
  );
};
