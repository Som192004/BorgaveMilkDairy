import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// 1) Import the translation hook
import { useTranslation } from "react-i18next";

export function About() {
  const navigate = useNavigate();
  // 2) Access the `t` function for translations
  const { t } = useTranslation();

  return (
    <section className="bg-aliceblue py-16 mt-0">
      <motion.div
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black-100 mb-4">
            {/* 3) Use translation with a default fallback */}
            {t("about.title", { defaultValue: "About Us" })}
          </h2>
          <p className="text-xl text-black-300">
            {t("about.subtitle", {
              defaultValue:
                "We are dedicated to bringing you the freshest and most organic dairy products straight from the farm to your table!",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Image */}
          <div className="flex justify-center items-center">
            <img
              src="https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Dairy Farm"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column: Text */}
          <div className="flex flex-col justify-center items-start space-y-6">
            <h3 className="text-2xl font-semibold text-black-100">
              {t("about.journeyTitle", { defaultValue: "Our Journey" })}
            </h3>
            <p className="text-lg text-black-300 leading-relaxed">
              {t("about.paragraph1", {
                defaultValue:
                  "Founded on the principles of sustainability and quality, we have been providing premium dairy products to families for over 20 years. Our farms use eco-friendly methods and ethical practices to ensure that the milk and other dairy products we produce are fresh, nutritious, and free of harmful additives.",
              })}
            </p>
            <p className="text-lg text-black-300 leading-relaxed">
              {t("about.paragraph2", {
                defaultValue:
                  "Our farm is located in the heart of the countryside, where our cows roam freely and enjoy a natural, healthy lifestyle. We take pride in using traditional farming methods while embracing innovative practices to ensure the highest quality in every product we make.",
              })}
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/about-us")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transform transition duration-300"
              >
                {t("about.learnMore", { defaultValue: "Learn More" })}
              </button>
              <button
                onClick={() => navigate("/contact-us")}
                className="bg-transparent border-2 border-blue-500 hover:bg-blue-700 hover:text-white text-blue-900 py-2 px-6 rounded-lg shadow-md transform transition duration-300"
              >
                {t("about.contactUs", { defaultValue: "Contact Us" })}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
