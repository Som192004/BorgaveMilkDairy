import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export const Login = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { role: savedRole, accessToken: savedaccessToken, login } = useAuth();

  useEffect(() => {
    if (savedRole === "Admin") {
      navigate("/admin");
    } else if (savedRole === "SubAdmin") {
      navigate("/subadmin");
    }
  }, [savedRole, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!role || !mobile || !password) {
      setError(t("login.errors.fillAllFields"));
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setError(t("login.errors.invalidMobile"));
      return;
    }

    try {
      
      let response;
      if (role === "Admin") {
        response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/admin/login",
          { adminMobileNumber: mobile, adminPassword: password },
          { withCredentials: true }
        );
      } else if (role === "SubAdmin") {
        response = await axios.post(
          "https://borgavemilkdairybackend.onrender.com/api/v1/subadmin/login",
          { mobileNumber: mobile, subAdminPassword: password },
          { withCredentials: true }
        );
      }
      // const response = await axios.post(
      //   "http://localhost:8000/api/v1/admin/login",
      //   { adminMobileNumber: mobile, adminPassword: password },
      //   { withCredentials: true }
      // );
      console.log(response);
      
      if (response.status === 404) {
        setError("Invalid Credentials");
      }
      if (response.status === 500) {
        setError("Internal Server Error");
      }
      console.log("Login successful:", response);
      localStorage.setItem("response", JSON.stringify(response))
      console.log(response.data.data.accessToken)
      localStorage.setItem("accessToken", (response.data.data.accessToken));
      login(role, response.data.data.accessToken);
      // Redirect based on role
      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "SubAdmin") {
        navigate("/subadmin");
      }
    } catch (err) {
      console.log(err.response.status);
      if (err?.response?.status === 401) {
        setError("Invalid Credentials");
      }
      if (err?.response?.status === 404) {
        if (role === "Admin") setError("Admin Not Found");
        if (role === "SubAdmin") {
          setError("SubAdmin Not Found");
        }
      }
      if (err?.response?.status === 500) {
        setError("Internal Server Error");
      }
    }

    // Password Validation: Min 8 characters, at least one special character
    // const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   setError(t("login.errors.invalidPassword"));
    //   return;
    // }

    // Clear form fields
    setRole("");
    setMobile("");
    setPassword("");
    // setError("");
  };

  return (
    <div className="flex items-center justify-center w-full h-screen overflow-y-auto">
      <button
        onClick={() => navigate("/")}
        className="absolute sm:top-10 sm:left-10 top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition cursor-pointer"
      >
        <ArrowLeft size={30} />
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-96 max-w-full"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          {t("login.title")}
        </h2>
        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-6 text-sm">
            {error}
          </p>
        )}

        <div className="mb-6 cursor-pointer">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("login.form.roleLabel")}
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
          >
            <option value="">{t("login.form.selectRole")}</option>
            <option value="Admin">{t("login.form.admin")}</option>
            <option value="SubAdmin">{t("login.form.subAdmin")}</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("login.form.mobileLabel")}
          </label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder={t("login.form.mobilePlaceholder")}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("login.form.passwordLabel")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.form.passwordPlaceholder")}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4c76ba] text-white py-3 rounded-lg shadow-md hover:bg-[#1b2d5b] transition duration-300 cursor-pointer"
        >
          {t("login.form.submitButton")}
        </button>
      </form>
    </div>
  );
};
