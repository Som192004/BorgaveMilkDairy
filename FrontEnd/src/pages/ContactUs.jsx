// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import inquiryImage from "../assets/Inquiry_image.png";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// export const ContactUs = () => {
//   const { t } = useTranslation();

//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     address: "",
//   });
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpInput, setOtpInput] = useState("");
//   const [confirmationMessage, setConfirmationMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // Update form fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Update OTP input field
//   const handleOtpChange = (e) => {
//     setOtpInput(e.target.value);
//   };

//   // Send OTP with basic mobile number validation
//   const sendOtp = () => {
//     setErrorMessage("");
//     if (formData.mobile.length === 10 && /^\d+$/.test(formData.mobile)) {
//       setLoading(true);
//       axios
//         .post("http://localhost:8000/api/v1/otp-verification/send-sms", 
//           {
//             phone: formData.mobile,
//             name: formData.name,
//           }
//         )
//         .then((response) => {
//           console.log("Response:", response.data);
//           setOtpSent(true);
//           // setOtp(response.data.data); // Hardcoded OTP for now
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           setErrorMessage(
//             t("contactUs.alert.smsError") ||
//               "Failed to send OTP. Please try again."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setErrorMessage(
//         t("contactUs.alert.invalidMobile") || "Invalid mobile number"
//       );
//     }
//   };

//   // Verify OTP and show confirmation message
//   const verifyOtp = () => {
//     axios.post("http://localhost:8000/api/v1/otp-verification/verify-otp", 
//           {
//             phone: formData.mobile,
//             otp: otpInput,
//           }
//         )
//         .then((response) => {
//           console.log("Response:", response.data);
//           setOtpVerified(true);
//           setConfirmationMessage(
//             t("contactUs.confirmation") ||
//               "Your inquiry has been received. We will contact you soon."
//           );
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           setErrorMessage(
//             t("contactUs.alert.invalidOtp") ||
//               "The OTP you entered is invalid. Please try again."
//           );
//         })

//         setErrorMessage("");
//     }
  

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="flex flex-col items-center justify-center w-full min-h-screen py-10 px-6 bg-gradient-to-br from-blue-50 to-green-50"
//     >
//       <motion.div
//         className="w-full sm:max-w-5xl bg-white p-8 rounded-xl shadow-lg"
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-4xl font-semibold text-blue-700 text-center mb-8">
//           {t("contactUs.title")}
//         </h1>

//         {/* Main Form & Image Section */}
//         <div className="flex flex-col sm:flex-row gap-6">
//           {/* Left: Image */}
//           <motion.div
//             className="flex-1"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <img
//               src={inquiryImage}
//               alt={t("contactUs.imageAlt")}
//               className="w-full h-auto rounded-lg shadow-md"
//             />
//           </motion.div>

//           {/* Right: Form */}
//           <motion.div
//             className="flex-1"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {!otpVerified ? (
//               <form className="space-y-6">
//                 {/* Name Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-blue-700 mb-2">
//                     {t("contactUs.form.name")}
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder={t("contactUs.form.namePlaceholder")}
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   />
//                 </div>

//                 {/* Address Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-blue-700 mb-2">
//                     {t("contactUs.form.address")}
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     placeholder={t("contactUs.form.addressPlaceholder")}
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   />
//                 </div>

//                 {/* Mobile Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-blue-700 mb-2">
//                     {t("contactUs.form.mobile")}
//                   </label>
//                   <input
//                     type="text"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleInputChange}
//                     placeholder={t("contactUs.form.mobilePlaceholder")}
//                     required
//                     className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   />
//                 </div>

//                 {/* Error Message */}
//                 {errorMessage && (
//                   <div className="text-red-600 text-sm text-center">
//                     {errorMessage}
//                   </div>
//                 )}

//                 {/* OTP Section */}
//                 {!otpSent ? (
//                   <button
//                     type="button"
//                     onClick={sendOtp}
//                     disabled={loading}
//                     className={`w-full ${
//                       loading
//                         ? "bg-blue-400"
//                         : "bg-gradient-to-r from-blue-500 to-blue-600"
//                     } text-white py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                   >
//                     {loading
//                       ? t("contactUs.form.sendingOtp") || "Sending OTP..."
//                       : t("contactUs.form.sendOtp")}
//                   </button>
//                 ) : (
//                   <div className="mt-6 space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-blue-700 mb-2">
//                         {t("contactUs.form.enterOtp")}
//                       </label>
//                       <input
//                         type="text"
//                         value={otpInput}
//                         onChange={handleOtpChange}
//                         placeholder={t("contactUs.form.otpPlaceholder")}
//                         className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={verifyOtp}
//                       className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     >
//                       {t("contactUs.form.verifyOtp")}
//                     </button>
//                   </div>
//                 )}
//               </form>
//             ) : (
//               <div className="mt-6 text-center">
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="p-6 bg-green-100 rounded-lg shadow-md"
//                 >
//                   <h2 className="text-lg font-semibold text-blue-700">
//                     {confirmationMessage}
//                   </h2>
//                   <p className="mt-2 text-blue-600">
//                     {t("contactUs.thankYouMessage") ||
//                       "Thank you for contacting us!"}
//                   </p>
//                 </motion.div>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </motion.div>

      {/* Shop Information & Map Section */}
      // <motion.div
      //   className="mt-10 w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg"
      //   initial={{ opacity: 0, y: 20 }}
      //   animate={{ opacity: 1, y: 0 }}
      //   transition={{ duration: 0.5 }}
      // >
      //   <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
      //     <div className="w-full sm:max-w-xl">
      //       <h3 className="text-xl font-semibold text-blue-700 mb-4">
      //         {t("contactUs.info.title")}
      //       </h3>
      //       <p className="mb-4">
      //         <strong>{t("contactUs.info.mainBranchLabel")}</strong>
      //         <span className="block">{t("contactUs.info.mainBranch")}</span>
      //       </p>
      //       <p className="mb-4">
      //         <strong>{t("contactUs.info.secondBranchLabel")}</strong>
      //         <span className="block">{t("contactUs.info.secondBranch")}</span>
      //       </p>
      //       <p className="mb-4">
      //         <strong>{t("contactUs.info.thirdBranchLabel")}</strong>
      //         <span className="block">{t("contactUs.info.thirdBranch")}</span>
      //       </p>
      //       <p className="mb-4">
      //         <strong>{t("contactUs.info.contactNoLabel")}</strong>
      //         <span className="block">{t("contactUs.info.contactNo")}</span>
      //       </p>
      //     </div>

      //     <div className="w-full sm:max-w-xl">
      //       <h3 className="text-xl font-semibold text-blue-700 mb-4">
      //         {t("contactUs.info.shopLocationsTitle")}
      //       </h3>
      //       <iframe
      //         width="100%"
      //         height="300"
      //         src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJE9on3F3HwoAR9fzzD5n4F4A&key=YOUR_API_KEY"
      //         title={t("contactUs.info.mapTitle")}
      //         frameBorder="0"
      //         style={{ border: 0 }}
      //         allowFullScreen
      //       ></iframe>
      //     </div>
      //   </div>
      // </motion.div>
    // </motion.div>
//   );
// };


import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import inquiryImage from "../assets/Borgave_Logo.jpg";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext";


export const ContactUs = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [branches , setAllBranches] = useState([]);
  

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtpInput(e.target.value);
  };

  // Function to start the timer
  const startTimer = (seconds) => {
    setTimer(seconds);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getAllBranches = async () => {
    try
    {
      const response = await axios.get(
        "https://borgavemilkdairybackend.onrender.com/api/v1/branch//get-branches-for-customer",
        { withCredentials: true }
      );
      console.log("Branches fetched:", response.data.data);

      setAllBranches(response.data.data);
      
    }catch(err){
      console.log("error: " , err)
    }
  }

  useEffect(() => {
    getAllBranches();
  }, [])

  // Send OTP and start the timer
  const sendOtp = () => {
    setErrorMessage("");
    if (formData.mobile.length === 10 && /^\d+$/.test(formData.mobile)) {
      setLoading(true);
      axios
        .post("https://borgavemilkdairybackend.onrender.com/api/v1/otp-verification/send-sms", {
          phone: formData.mobile,
          name: formData.name,
        })
        .then((response) => {
          console.log("R esponse:", response.data);
          setOtpSent(true);
          setOtpInput(""); // Reset OTP input
          startTimer(30); // Start 30-second timer
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage(
            "Note: This website uses Twilio's free trial. OTP messages can be sent only to verified phone numbers for now."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setErrorMessage(
        "Invalid mobile number"
      );
    }
  };

  // Verify OTP
  const verifyOtp = () => {
    axios
      .post("https://borgavemilkdairybackend.onrender.com/api/v1/otp-verification/verify-otp", {
        phone: formData.mobile,
        otp: otpInput,
      })
      .then((response) => {
        console.log("Response:", response.data);
        setOtpVerified(true);
  
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
        if (cartItems?.length === 0) {
          setErrorMessage("Your cart is empty. Please add items before placing an order.");
          return;
        }
  
        const formattedCartItems = cartItems.map((item) => ({
          productName: item.productName,
          productPrice: item.productPrice,
          productImage: item.productImage,
          quantity: item.quantity,
        }));
  
        const orderData = {
          name: formData.name,
          mobile: formData.mobile,
          address: formData.address,
          branch : cartItems[0].branchId,
          cartItems: formattedCartItems,
          isOrderdPlaced:false,
        };
  
        // Place order
        axios
          .post("https://borgavemilkdairybackend.onrender.com/api/v1/online-order/create-order", {orderData}, { withCredentials: true })
          .then((orderResponse) => {
            console.log("Order Created:", orderResponse.data);
            
            setConfirmationMessage(
              "Your order has been placed successfully!"
            );
  
            // Clear cart after successful order
            localStorage.removeItem("cartItems");

            

            setTimeout(() => {
              window.location.reload();
            }, 3000);
          })
          .catch((orderError) => {
            console.error("Order Creation Error:", orderError);
            setErrorMessage("Failed to place order. Please try again later.");
          });
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage(
          "The OTP you entered is invalid. Please try again."
        );
      });
  
    setErrorMessage("");
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full min-h-screen py-10 px-6 bg-gradient-to-br from-blue-50 to-green-50"
    >
      <motion.div
        className="w-full sm:max-w-5xl bg-white p-8 rounded-xl shadow-lg"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold text-blue-700 text-center mb-8">
          {t("contactUs.title")}
        </h1>

        {/* Main Form & Image Section */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left: Image */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={inquiryImage}
              alt={t("contactUs.imageAlt")}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!otpVerified ? (
              <form className="space-y-6">
                {/* Name, Address, Mobile Fields */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("contactUs.form.namePlaceholder")}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t("contactUs.form.addressPlaceholder")}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder={t("contactUs.form.mobilePlaceholder")}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />

                {/* Error Message */}
                {errorMessage && <div className="text-red-600 text-sm text-center">{errorMessage}</div>}

                {/* OTP Section */}
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg"
                  >
                    {loading ? "Sending OTP..." : t("contactUs.form.sendOtp")}
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    {timer > 0 ? (
                      <>
                        <input
                          type="text"
                          value={otpInput}
                          onChange={handleOtpChange}
                          placeholder={t("contactUs.form.otpPlaceholder")}
                          className="w-full p-4 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={verifyOtp}
                          className="w-full bg-blue-500 text-white py-3 rounded-lg"
                        >
                          {t("contactUs.form.verifyOtp")} ({timer}s)
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={sendOtp}
                        className="w-full bg-red-500 text-white py-3 rounded-lg"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <div className="mt-6 text-center">
                <h2 className="text-lg font-semibold text-blue-700">{confirmationMessage}</h2>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
            {/* Shop Information & Map Section */}
       <motion.div
        className="mt-10 w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="w-full sm:max-w-xl">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              {t("contactUs.info.title")}
            </h3>
            {
              branches?.map((branch) => {
                return <p key={branch?.branchId} className="mb-4">
                  <strong>{"Branch: " + branch?.branchId}</strong>
                  <span className="block">{branch?.branchAddress + " " + branch?.location}</span>
                </p>
              })
            }
            <p className="mb-4">
              <strong>{t("contactUs.info.contactNoLabel")}</strong>
              <span className="block">{t("contactUs.info.contactNo")}</span>
            </p>
          </div>

{/*           <div className="w-full sm:max-w-xl">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              {t("contactUs.info.shopLocationsTitle")}
            </h3>
            <iframe
              width="100%"
              height="300"
              src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJE9on3F3HwoAR9fzzD5n4F4A&key=YOUR_API_KEY"
              title={t("contactUs.info.mapTitle")}
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          </div> */}
        </div>
      </motion.div>
    </motion.div>
  );
};
