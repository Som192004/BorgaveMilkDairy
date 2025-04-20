import React, { useState, useEffect } from "react";
import {
  Cog as Cow,
  Milk,
  LeafyGreen,
  Award,
  Droplets,
  Sun,
  Factory,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import aboutUsImage from "../assets/AboutUs.jpeg";

// AnimatedCard: used to display each value in the grid
function AnimatedCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: parseFloat(delay), duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      <Icon className="w-12 h-12 text-blue-600 mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export function AboutUs() {
  const { t } = useTranslation();

  // Define team members with translation for roles
  const teamMembers = [
    {
      name: "John Anderson",
      role: t("aboutUs.team.members.john", {
        defaultValue: "Master Dairy Farmer",
      }),
      image:
        "https://images.unsplash.com/photo-1520451644838-906a72aa7c86?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Maria Thompson",
      role: t("aboutUs.team.members.maria", {
        defaultValue: "Quality Control Director",
      }),
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Robert Miller",
      role: t("aboutUs.team.members.robert", {
        defaultValue: "Production Manager",
      }),
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={aboutUsImage}
          alt={t("aboutUs.hero.imageAlt", {
            defaultValue: "Green dairy farm landscape",
          })}
          className="absolute w-full h-full object-cover"
        />
        {/* Dark gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative text-center text-white p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            {t("aboutUs.hero.title", { defaultValue: "Pure Dairy Excellence" })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md"
          >
            {t("aboutUs.hero.subtitle", {
              defaultValue:
                "From our family farms to your table, delivering nature's goodness since 1945",
            })}
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Heritage Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl font-bold mb-6">
            {t("aboutUs.heritage.title", { defaultValue: "Our Heritage" })}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t("aboutUs.heritage.description", {
              defaultValue:
                "For three generations, we've been committed to producing the finest dairy products while maintaining sustainable farming practices and supporting our local communities. Every glass of milk tells our story of dedication to quality and care.",
            })}
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <AnimatedCard
            icon={Cow}
            title={t("aboutUs.values.happyCows.title", {
              defaultValue: "Happy Cows",
            })}
            description={t("aboutUs.values.happyCows.description", {
              defaultValue:
                "Our cows graze freely on lush pastures, ensuring the highest quality milk",
            })}
            delay="0"
          />
          <AnimatedCard
            icon={LeafyGreen}
            title={t("aboutUs.values.sustainable.title", {
              defaultValue: "Sustainable",
            })}
            description={t("aboutUs.values.sustainable.description", {
              defaultValue:
                "Committed to environmentally friendly farming practices",
            })}
            delay="0.2"
          />
          <AnimatedCard
            icon={Award}
            title={t("aboutUs.values.premiumQuality.title", {
              defaultValue: "Premium Quality",
            })}
            description={t("aboutUs.values.premiumQuality.description", {
              defaultValue:
                "Award-winning dairy products that exceed industry standards",
            })}
            delay="0.4"
          />
          <AnimatedCard
            icon={Heart}
            title={t("aboutUs.values.familyValues.title", {
              defaultValue: "Family Values",
            })}
            description={t("aboutUs.values.familyValues.description", {
              defaultValue:
                "Three generations of dairy farming expertise and passion",
            })}
            delay="0.6"
          />
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-20">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t("aboutUs.process.title", { defaultValue: "Our Process" })}
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Sun,
                title: t("aboutUs.process.steps.0.title", {
                  defaultValue: "Natural Grazing",
                }),
                description: t("aboutUs.process.steps.0.description", {
                  defaultValue: "Free-range grazing on organic pastures",
                }),
              },
              {
                icon: Milk,
                title: t("aboutUs.process.steps.1.title", {
                  defaultValue: "Fresh Collection",
                }),
                description: t("aboutUs.process.steps.1.description", {
                  defaultValue: "Twice-daily milking schedule",
                }),
              },
              {
                icon: Factory,
                title: t("aboutUs.process.steps.2.title", {
                  defaultValue: "Processing",
                }),
                description: t("aboutUs.process.steps.2.description", {
                  defaultValue: "State-of-the-art facility",
                }),
              },
              {
                icon: Droplets,
                title: t("aboutUs.process.steps.3.title", {
                  defaultValue: "Quality Testing",
                }),
                description: t("aboutUs.process.steps.3.description", {
                  defaultValue: "Rigorous quality controls",
                }),
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="text-center p-4"
              >
                <step.icon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-12">
            {t("aboutUs.team.title", { defaultValue: "Our Dairy Experts" })}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="group relative overflow-hidden rounded-lg transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm opacity-90">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
