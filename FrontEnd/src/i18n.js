// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      navbar: {
        links: {
          home: "Home",
          products: "Products",
          aboutUs: "About Us",
          contactUs: "Contact Us",
          login: "Login",
        },
        language: {
          english: "EN",
          marathi: "मराठी",
        },
      },
      footer: {
        companyName: "Borgave Dugdhalay",
        tagline:
          "Bringing the best dairy products straight from the farm to your home.",
        copyright: "© 2025 Dairy Fresh Store. All rights reserved.",
        quickLinks: {
          title: "Quick Links",
          home: "Home",
          products: "Products",
          aboutUs: "About Us",
          contactUs: "Contact Us",
        },
        social: {
          title: "Follow Us",
          facebook: "Facebook",
          twitter: "Twitter",
          instagram: "Instagram",
        },
      },
      home: {
        heroSlides: [
          {
            title: "Premium Dairy Solutions",
            description:
              "Streamline your dairy operations with our advanced management system",
          },
          {
            title: "Smart Herd Management",
            description:
              "Track and optimize your herd's health and productivity",
          },
          {
            title: "Quality Assurance",
            description: "Maintain the highest standards in dairy production",
          },
        ],
        productSlides: [
          {
            title: "Fresh Milk",
            description:
              "Our pure, organic fresh milk delivered straight from the farm.",
          },
          {
            title: "Butter",
            description: "Our rich, creamy butter made from the finest dairy.",
          },
          {
            title: "Cheese",
            description:
              "Delicious handcrafted cheese with an exquisite taste.",
          },
        ],
      },
      about: {
        title: "About Us",
        subtitle:
          "We are dedicated to bringing you the freshest and most organic dairy products straight from the farm to your table!",
        journeyTitle: "Our Journey",
        paragraph1:
          "Founded on the principles of sustainability and quality, we have been providing premium dairy products to families for over 20 years. Our farms use eco-friendly methods and ethical practices to ensure that the milk and other dairy products we produce are fresh, nutritious, and free of harmful additives.",
        paragraph2:
          "Our farm is located in the heart of the countryside, where our cows roam freely and enjoy a natural, healthy lifestyle. We take pride in using traditional farming methods while embracing innovative practices to ensure the highest quality in every product we make.",
        learnMore: "Learn More",
        contactUs: "Contact Us",
      },
      products: {
        title: "Dairy Products",
        categories: {
          all: "All",
          milk: "Milk",
          cheese: "Cheese",
          yogurt: "Yogurt",
          sweets: "Sweets",
          cooking: "Cooking",
        },
        noProducts: "No products available in this category.",
        productCard: {
          inStock: "In Stock",
          outOfStock: "Out of Stock",
          viewDetails: "View Details",
          price: "Price:",
        },
        productDetails: {
          loading: "Loading...",
          backToProducts: "Back",
          specifications: "Specifications",
          snf: "SNF",
          fatContent: "Fat Content",
          quantity: "Quantity",
          availability: "Availability",
          inStock: "In Stock",
          outOfStock: "Out of Stock",
          inquireUs: "Inquire Us",
          notAvailable: "N/A",
        },
      },
      aboutUs: {
        hero: {
          title: "Pure Dairy Excellence",
          subtitle:
            "From our family farms to your table, delivering nature's goodness since 1945",
          imageAlt: "Green dairy farm landscape",
        },
        heritage: {
          title: "Our Heritage",
          description:
            "For three generations, we've been committed to producing the finest dairy products while maintaining sustainable farming practices and supporting our local communities. Every glass of milk tells our story of dedication to quality and care.",
        },
        values: {
          happyCows: {
            title: "Happy Cows",
            description:
              "Our cows graze freely on lush pastures, ensuring the highest quality milk",
          },
          sustainable: {
            title: "Sustainable",
            description:
              "Committed to environmentally friendly farming practices",
          },
          premiumQuality: {
            title: "Premium Quality",
            description:
              "Award-winning dairy products that exceed industry standards",
          },
          familyValues: {
            title: "Family Values",
            description:
              "Three generations of dairy farming expertise and passion",
          },
        },
        process: {
          title: "Our Process",
          steps: [
            {
              title: "Natural Grazing",
              description: "Free-range grazing on organic pastures",
            },
            {
              title: "Fresh Collection",
              description: "Twice-daily milking schedule",
            },
            {
              title: "Processing",
              description: "State-of-the-art facility",
            },
            {
              title: "Quality Testing",
              description: "Rigorous quality controls",
            },
          ],
        },
        team: {
          title: "Our Dairy Experts",
          members: {
            john: "Master Dairy Farmer",
            maria: "Quality Control Director",
            robert: "Production Manager",
          },
        },
      },
      contactUs: {
        title: "Contact Us",
        imageAlt: "Contact Us",
        alert: {
          invalidMobile: "Please enter a valid 10-digit mobile number.",
          invalidOtp: "Invalid OTP. Please try again.",
        },
        confirmation:
          "Thank you for reaching out! Your inquiry has been received successfully, and our team will get in touch with you shortly. Rest assured, we value your trust and are here to assist you every step of the way.",
        form: {
          name: "Name",
          namePlaceholder: "Enter your name",
          address: "Address",
          addressPlaceholder: "Enter your address",
          mobile: "Mobile No.",
          mobilePlaceholder: "Enter your mobile number",
          sendOtp: "Send OTP",
          enterOtp: "Enter OTP",
          otpPlaceholder: "Enter the OTP",
          verifyOtp: "Verify OTP",
        },
        info: {
          title: "Our Contact Information",
          mainBranchLabel: "Main Branch:",
          mainBranch: "123 Main Street, City Center, Country",
          secondBranchLabel: "Second Branch:",
          secondBranch: "456 Second Avenue, Suburban Area, Country",
          thirdBranchLabel: "Third Branch:",
          thirdBranch: "789 Third Boulevard, Downtown, Country",
          contactNoLabel: "Contact No.:",
          contactNo: "+1234567890",
          shopLocationsTitle: "Our Shop Locations",
          mapTitle: "Shop Locations",
        },
      },
      login: {
        title: "Login",
        errors: {
          fillAllFields: "Please fill in all required fields",
          invalidMobile: "Please enter a valid 10-digit mobile number",
          invalidPassword:
            "Password must be at least 8 characters with one special character",
        },
        form: {
          roleLabel: "Select Role",
          selectRole: "Choose your role",
          admin: "Admin",
          subAdmin: "Sub Admin",
          mobileLabel: "Mobile Number",
          mobilePlaceholder: "Enter your mobile number",
          passwordLabel: "Password",
          passwordPlaceholder: "Enter your password",
          submitButton: "Login",
        },
      },
      imageSlider: {
        slideList: "Slide List",
        slides: {
          dairy: {
            title: "Premium Dairy Solutions",
            description:
              "Streamline your dairy operations with our advanced management system",
          },
          herd: {
            title: "Smart Herd Management",
            description:
              "Track and optimize your herd's health and productivity",
          },
          quality: {
            title: "Quality Assurance",
            description: "Maintain the highest standards in dairy production",
          },
        },
        buttons: {
          edit: "Edit",
          delete: "Delete",
          addSlide: "Add Slide",
          save: "Save",
          cancel: "Cancel",
        },
        alerts: {
          fillAllFields: "Please fill all fields",
          confirmDelete: "Are you sure you want to delete this slide?",
        },
        form: {
          title: "Title",
          titlePlaceholder: "Enter slide title",
          description: "Description",
          descriptionPlaceholder: "Enter slide description",
          image: "Image",
          imagePlaceholder: "Choose an image",
        },
      },
      subAdmin: {
        menu: {
          report: "SubAdmin",
        },
        title: "SubAdmins",
        form: {
          addTitle: "Add New SubAdmin",
          editTitle: "Edit SubAdmin",
          name: "Name",
          namePlaceholder: "Enter SubAdmin name",
          mobile: "Mobile Number",
          mobilePlaceholder: "Enter mobile number",
          password: "Password",
          passwordPlaceholder: "Enter password",
          address: "Address",
          addressPlaceholder: "Enter address",
          branchId: "Branch ID",
          branchIdPlaceholder: "Enter branch ID",
          image: "Image",
          imagePlaceholder: "Choose an image",
          cancel: "Cancel",
          save: "Save",
        },
        card: {
          imageAlt: "Profile image of {{name}}",
          mobile: "Mob. no",
          password: "Password",
          togglePassword: "Toggle password visibility",
          address: "Address",
          branchId: "Branch ID",
          villageCity: "Village/City",
        },
        alerts: {
          fillAllFields: "Please fill in all required fields",
          confirmDelete: "Are you sure you want to delete this SubAdmin?",
          confirmDeleteTitle: "Confirm Deletion",
          no: "No",
          yes: "Yes",
        },
        buttons: {
          addSubAdmin: "+ Add SubAdmin",
          edit: "Edit",
          delete: "Delete",
        },
      },
      branch: {
        title: "Branches",
        card: {
          branchIdLabel: "Branch ID",
          addressLabel: "Address",
          villageCityLabel: "Village/City",
        },
        form: {
          addTitle: "Add New Branch",
          editTitle: "Edit Branch",
          branchId: "Branch ID",
          branchIdPlaceholder: "Enter branch ID",
          address: "Address",
          addressPlaceholder: "Enter address",
          villageCity: "Village/City",
          villageCityPlaceholder: "Enter village or city name",
          save: "Save",
          cancel: "Cancel",
        },
        buttons: {
          addBranch: "+ Add Branch",
          edit: "Edit",
          delete: "Delete",
        },
        alerts: {
          confirmDelete: "Are you sure you want to delete this branch?",
          confirmDeleteTitle: "Confirm Deletion",
          fillAllFields: "Please fill in all required fields",
          no: "No",
          yes: "Yes",
        },
      },
      adminSidebar: {
        title: "Borgave Dugdhalay",
        menu: {
          home: "Home",
          subAdmin: "SubAdmin",
          branch: "Branch",
        },
        reports: {
          title: "Reports",
          daily: "Daily Report",
          weekly: "Weekly Report",
          monthly: "Monthly Report",
        },
        language: {
          select: "Select Language",
        },
        profile: {
          userImageAlt: "User Profile",
          name: "John Doe",
          role: "Admin",
        },
        buttons: {
          logout: "Logout",
          close: "Close",
        },
      },
      report: {
        title: "{{type}} Report",
        types: {
          daily: "Daily",
          weekly: "Weekly",
          monthly: "Monthly",
        },
        profit: "Profit: ₹{{amount}}",
        loss: "Loss: ₹{{amount}}",
        summary: {
          title: "Your Total Earnings/Expenditure",
          description:
            "Here's the overall summary based on the data collected for the selected report type.",
          totalLabel: "Total Amount",
          amount: "₹{{amount}}",
          profitMessage: "Great job! You're in profit.",
          lossMessage:
            "It seems there's a loss overall. Take necessary actions.",
        },
        noData: "No report data available.",
      },
      subAdminSidebar: {
        title: "Borgave Dugdhalay",
        logo: {
          alt: "Borgave Dugdhalay Logo",
        },
        menu: {
          transactions: "Transactions",
          addMilk: "Add Milk",
          addProduct: "Add Product",
          loan: "Loan",
          farmer: "Farmer",
          report: "Report",
          addProductCategory:"Add Product Category",
          OnlineOrders: "Online Orders",
        },
        language: {
          select: "Select Language",
        },
        profile: {
          userImageAlt: "User Profile",
          name: "John Doe",
          role: "Sub-Admin",
        },
        buttons: {
          logout: "Logout",
          close: "Close",
        },
      },
    },
  },
  mr: {
    translation: {
      navbar: {
        links: {
          home: "मुख्यपृष्ठ",
          products: "उत्पादने",
          aboutUs: "आमच्याबद्दल",
          contactUs: "संपर्क करा",
          login: "लॉगिन",
        },
        language: {
          english: "EN",
          marathi: "मराठी",
        },
      },
      footer: {
        companyName: "बोरगावे दुग्धालय",
        tagline:
          "शेतातून थेट तुमच्या घरापर्यंत सर्वोत्तम दुग्धजन्य पदार्थ आणत आहोत.",
        copyright: "© 2025 डेअरी फ्रेश स्टोअर. सर्व हक्क राखीव.",
        quickLinks: {
          title: "द्रुत दुवे",
          home: "मुख्यपृष्ठ",
          products: "उत्पादने",
          aboutUs: "आमच्याबद्दल",
          contactUs: "संपर्क करा",
        },
        social: {
          title: "आम्हाला फॉलो करा",
          facebook: "फेसबुक",
          twitter: "ट्विटर",
          instagram: "इन्स्टाग्राम",
        },
      },
      home: {
        heroSlides: [
          {
            title: "प्रिमियम डेअरी सोल्यूशन्स",
            description:
              "आमच्या प्रगत व्यवस्थापन प्रणालीसह तुमचे डेअरी ऑपरेशन्स सुलभ करा",
          },
          {
            title: "स्मार्ट पशुधन व्यवस्थापन",
            description:
              "तुमच्या पशुधनाचे आरोग्य आणि उत्पादकता ट्रॅक करा आणि अनुकूल करा",
          },
          {
            title: "गुणवत्ता हमी",
            description: "डेअरी उत्पादनामध्ये उच्चतम दर्जा राखा",
          },
        ],
        productSlides: [
          {
            title: "ताजे दूध",
            description:
              "आमचे शुद्ध, सेंद्रिय ताजे दूध थेट शेतातून वितरित केले जाते.",
          },
          {
            title: "लोणी",
            description:
              "आमच्या उत्कृष्ट डेअरीपासून बनवलेले समृद्ध, मलईयुक्त लोणी.",
          },
          {
            title: "चीज",
            description: "उत्तम चव असलेले स्वादिष्ट हस्तनिर्मित चीज.",
          },
        ],
      },
      about: {
        title: "आमच्याबद्दल",
        subtitle:
          "आम्ही तुम्हाला ताज्या आणि सेंद्रिय डेअरी उत्पादनांचे वितरण थेट शेतातून तुमच्या ताटात करतो!",
        journeyTitle: "आमची वाटचाल",
        paragraph1:
          "शाश्वतता आणि गुणवत्ता यांच्या तत्त्वांवर आमची स्थापना झाली असून, आम्ही वीस वर्षांपासून कुटुंबांना उच्च दर्जाची डेअरी उत्पादने पुरवत आहोत. आमची शेतं पर्यावरणपूरक पद्धती आणि नैतिक व्यवहारांचा वापर करतात ज्यामुळे आमचे दूध व इतर डेअरी उत्पादने ताजी, पौष्टिक आणि हानिकारक पदार्थांपासून मुक्त असतात.",
        paragraph2:
          "आमचे शेत ग्रामीण भागाच्या हृदयात आहे, जिथे आमच्या गायी मोकळेपणाने फिरतात आणि नैसर्गिक, आरोग्यदायी जीवनशैली उपभोगतात. आम्ही पारंपरिक शेती पद्धती वापरत असतानाच नावीन्यपूर्ण पद्धतींचे स्वागत करतो, जेणेकरून आम्ही तयार करतो प्रत्येक उत्पादन उच्च दर्जाचे असेल.",
        learnMore: "आधिक जाणून घ्या",
        contactUs: "संपर्क करा",
      },
      products: {
        title: "दुग्धजन्य पदार्थ",
        categories: {
          all: "सर्व",
          milk: "दूध",
          cheese: "चीज",
          yogurt: "दही",
          sweets: "मिठाई",
          cooking: "स्वयंपाक",
        },
        noProducts: "या श्रेणीमध्ये कोणतेही उत्पादने उपलब्ध नाहीत.",
        productCard: {
          inStock: "स्टॉक मध्ये",
          outOfStock: "स्टॉक मध्ये नाही",
          viewDetails: "तपशील पहा",
          price: "किंमत:",
        },
        productDetails: {
          loading: "लोड करत आहे...",
          backToProducts: "मागे",
          specifications: "वैशिष्ट्ये",
          snf: "एसएनएफ",
          fatContent: "फॅट कंटेंट",
          quantity: "प्रमाण",
          availability: "उपलब्धता",
          inStock: "स्टॉक मध्ये",
          outOfStock: "स्टॉक मध्ये नाही",
          inquireUs: "चौकशी करा",
          notAvailable: "उपलब्ध नाही",
        },
      },
      aboutUs: {
        hero: {
          title: "शुद्ध डेअरी उत्कृष्टता",
          subtitle:
            "आमच्या कौटुंबिक शेतांमधून तुमच्या टेबलपर्यंत, 1945 पासून नैसर्गिक सौम्यतेचे वितरण",
          imageAlt: "हिरव्या डेअरी शेताचे दृश्य",
        },
        heritage: {
          title: "आमची वारसा",
          description:
            "तीन पिढ्यांपासून, आम्ही टिकाऊ शेती पद्धतींचे पालन करून आणि स्थानिक समुदायांना पाठिंबा देत सर्वोत्तम डेअरी उत्पादने तयार करण्यात कटिबद्ध आहोत. प्रत्येक ग्लास दूध आमच्या गुणवत्ता आणि काळजीच्या समर्पणाची कथा सांगते.",
        },
        values: {
          happyCows: {
            title: "आनंदी गायी",
            description:
              "आमच्या गायी समृद्ध चराईवर मोकळ्या गवतावर चरतात, ज्यामुळे उत्कृष्ट दर्जाचे दूध मिळते",
          },
          sustainable: {
            title: "शाश्वत",
            description: "पर्यावरणपूरक शेती पद्धतींसाठी बांधिल",
          },
          premiumQuality: {
            title: "उत्कृष्ट दर्जा",
            description:
              "उद्योगमानाने पुढे जाणारी पुरस्कारप्राप्त डेअरी उत्पादने",
          },
          familyValues: {
            title: "कौटुंबिक मूल्ये",
            description: "डेअरी शेतीतील तीन पिढ्यांचे तज्ञता आणि उत्साह",
          },
        },
        process: {
          title: "आमची प्रक्रिया",
          steps: [
            {
              title: "नैसर्गिक चराई",
              description: "सेंद्रिय चराईवर मोकळ्या पद्धतीने चराई",
            },
            {
              title: "ताजे संकलन",
              description: "दिवसातून दोन वेळा दूध संकलन",
            },
            {
              title: "प्रक्रिया",
              description: "अत्याधुनिक सुविधा",
            },
            {
              title: "गुणवत्ता चाचणी",
              description: "कडक गुणवत्ता नियंत्रण",
            },
          ],
        },
        team: {
          title: "आमचे डेअरी तज्ञ",
          members: {
            john: "मुख्य डेअरी शेतकरी",
            maria: "गुणवत्ता नियंत्रण संचालक",
            robert: "उत्पादन व्यवस्थापक",
          },
        },
      },
      contactUs: {
        title: "संपर्क करा",
        imageAlt: "संपर्क करा",
        alert: {
          invalidMobile: "कृपया वैध 10-अंकी मोबाइल क्रमांक प्रविष्ट करा.",
          invalidOtp: "अवैध OTP. कृपया पुन्हा प्रयत्न करा.",
        },
        confirmation:
          "आपल्या चौकशीबद्दल धन्यवाद! आपली चौकशी यशस्वीपणे प्राप्त झाली आहे आणि आमचा टीम लवकरच आपल्याशी संपर्क साधेल. आमचा विश्वास आपल्यावर आहे आणि आम्ही प्रत्येक पावलावर आपली मदत करण्यास तयार आहोत.",
        form: {
          name: "नाव",
          namePlaceholder: "तुमचे नाव प्रविष्ट करा",
          address: "पत्ता",
          addressPlaceholder: "तुमचा पत्ता प्रविष्ट करा",
          mobile: "मोबाईल क्रमांक",
          mobilePlaceholder: "तुमचा मोबाईल क्रमांक प्रविष्ट करा",
          sendOtp: "OTP पाठवा",
          enterOtp: "OTP प्रविष्ट करा",
          otpPlaceholder: "OTP प्रविष्ट करा",
          verifyOtp: "OTP सत्यापित करा",
        },
        info: {
          title: "आमची संपर्क माहिती",
          mainBranchLabel: "मुख्य शाखा:",
          mainBranch: "123 मुख्य रस्ता, सिटी सेंटर, देश",
          secondBranchLabel: "दुसरी शाखा:",
          secondBranch: "456 सेकंड एवेन्यू, उपनगरीय भाग, देश",
          thirdBranchLabel: "तिसरी शाखा:",
          thirdBranch: "789 तिसरा ब्लवार्ड, डाउनटाउन, देश",
          contactNoLabel: "संपर्क क्रमांक:",
          contactNo: "+1234567890",
          shopLocationsTitle: "आमचे दुकान स्थान",
          mapTitle: "दुकान स्थान",
        },
      },
      login: {
        title: "लॉगिन",
        errors: {
          fillAllFields: "कृपया सर्व आवश्यक फील्ड भरा",
          invalidMobile: "कृपया वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा",
          invalidPassword:
            "पासवर्ड किमान 8 अक्षरे आणि एक विशेष अक्षर असणे आवश्यक आहे",
        },
        form: {
          roleLabel: "भूमिका निवडा",
          selectRole: "तुमची भूमिका निवडा",
          admin: "प्रशासक",
          subAdmin: "उप प्रशासक",
          mobileLabel: "मोबाईल नंबर",
          mobilePlaceholder: "तुमचा मोबाईल नंबर प्रविष्ट करा",
          passwordLabel: "पासवर्ड",
          passwordPlaceholder: "तुमचा पासवर्ड प्रविष्ट करा",
          submitButton: "लॉगिन करा",
        },
      },
      imageSlider: {
        slideList: "स्लाइड यादी",
        slides: {
          dairy: {
            title: "प्रीमियम डेअरी सोल्यूशन्स",
            description:
              "आमच्या प्रगत व्यवस्थापन प्रणालीसह तुमचे डेअरी ऑपरेशन्स सुलभ करा",
          },
          herd: {
            title: "स्मार्ट कळप व्यवस्थापन",
            description:
              "तुमच्या कळपाचे आरोग्य आणि उत्पादकता ट्रॅक करा आणि ऑप्टिमाइझ करा",
          },
          quality: {
            title: "गुणवत्ता हमी",
            description: "डेअरी उत्पादनात सर्वोच्च मानके राखा",
          },
        },
        buttons: {
          edit: "संपादित करा",
          delete: "हटवा",
          addSlide: "स्लाइड जोडा",
          save: "जतन करा",
          cancel: "रद्द करा",
        },
        alerts: {
          fillAllFields: "कृपया सर्व फील्ड भरा",
          confirmDelete:
            "तुम्हाला खात्री आहे की तुम्ही ही स्लाइड हटवू इच्छिता?",
        },
        form: {
          title: "शीर्षक",
          titlePlaceholder: "स्लाइड शीर्षक प्रविष्ट करा",
          description: "वर्णन",
          descriptionPlaceholder: "स्लाइड वर्णन प्रविष्ट करा",
          image: "प्रतिमा",
          imagePlaceholder: "प्रतिमा निवडा",
        },
      },
      subAdmin: {
        menu: {
          report: "उपप्रशासक",
        },
        title: "उप प्रशासक",
        form: {
          addTitle: "नवीन उप प्रशासक जोडा",
          editTitle: "उप प्रशासक संपादित करा",
          name: "नाव",
          namePlaceholder: "उप प्रशासकाचे नाव प्रविष्ट करा",
          mobile: "मोबाईल क्रमांक",
          mobilePlaceholder: "मोबाईल क्रमांक प्रविष्ट करा",
          password: "पासवर्ड",
          passwordPlaceholder: "पासवर्ड प्रविष्ट करा",
          address: "पत्ता",
          addressPlaceholder: "पत्ता प्रविष्ट करा",
          branchId: "शाखा आयडी",
          branchIdPlaceholder: "शाखा आयडी प्रविष्ट करा",
          image: "प्रतिमा",
          imagePlaceholder: "प्रतिमा निवडा",
          cancel: "रद्द करा",
          save: "जतन करा",
        },
        card: {
          imageAlt: "{{name}} ची प्रोफाइल प्रतिमा",
          mobile: "मोबाईल क्र",
          password: "पासवर्ड",
          togglePassword: "पासवर्ड दृश्यता टॉगल करा",
          address: "पत्ता",
          branchId: "शाखा आयडी",
          villageCity: "गाव/शहर",
        },
        alerts: {
          fillAllFields: "कृपया सर्व आवश्यक फील्ड भरा",
          confirmDelete:
            "तुम्हाला खात्री आहे की तुम्ही हा उप प्रशासक हटवू इच्छिता?",
          confirmDeleteTitle: "हटविण्याची पुष्टी करा",
          no: "नाही",
          yes: "होय",
        },
        buttons: {
          addSubAdmin: "+ उप प्रशासक जोडा",
          edit: "संपादित करा",
          delete: "हटवा",
        },
      },
      branch: {
        title: "शाखा",
        card: {
          branchIdLabel: "शाखा आयडी",
          addressLabel: "पत्ता",
          villageCityLabel: "गाव/शहर",
        },
        form: {
          addTitle: "नवीन शाखा जोडा",
          editTitle: "शाखा संपादित करा",
          branchId: "शाखा आयडी",
          branchIdPlaceholder: "शाखा आयडी प्रविष्ट करा",
          address: "पत्ता",
          addressPlaceholder: "पत्ता प्रविष्ट करा",
          villageCity: "गाव/शहर",
          villageCityPlaceholder: "गाव किंवा शहराचे नाव प्रविष्ट करा",
          save: "जतन करा",
          cancel: "रद्द करा",
        },
        buttons: {
          addBranch: "+ शाखा जोडा",
          edit: "संपादित करा",
          delete: "हटवा",
        },
        alerts: {
          confirmDelete: "तुम्हाला खात्री आहे की तुम्ही ही शाखा हटवू इच्छिता?",
          confirmDeleteTitle: "हटविण्याची पुष्टी करा",
          fillAllFields: "कृपया सर्व आवश्यक फील्ड भरा",
          no: "नाही",
          yes: "होय",
        },
      },
      adminSidebar: {
        title: "बोरगावे दुग्धालय",
        menu: {
          home: "मुख्यपृष्ठ",
          subAdmin: "उप-प्रशासक",
          branch: "शाखा",
        },
        reports: {
          title: "अहवाल",
          daily: "दैनिक अहवाल",
          weekly: "साप्ताहिक अहवाल",
          monthly: "मासिक अहवाल",
        },
        language: {
          select: "भाषा निवडा",
        },
        profile: {
          userImageAlt: "वापरकर्ता प्रोफाइल",
          name: "जॉन डो",
          role: "प्रशासक",
        },
        buttons: {
          logout: "बाहेर पडा",
          close: "बंद करा",
        },
      },
      report: {
        title: "{{type}} अहवाल",
        types: {
          daily: "दैनिक",
          weekly: "साप्ताहिक",
          monthly: "मासिक",
        },
        profit: "नफा: ₹{{amount}}",
        loss: "तोटा: ₹{{amount}}",
        summary: {
          title: "तुमची एकूण कमाई/खर्च",
          description:
            "निवडलेल्या अहवाल प्रकारासाठी संकलित केलेल्या डेटावर आधारित एकूण सारांश येथे आहे.",
          totalLabel: "एकूण रक्कम",
          amount: "₹{{amount}}",
          profitMessage: "छान काम! तुम्ही नफ्यात आहात.",
          lossMessage: "असे दिसते की एकूण तोटा आहे. आवश्यक कारवाई करा.",
        },
        noData: "कोणताही अहवाल डेटा उपलब्ध नाही.",
      },
      subAdminSidebar: {
        title: "बोरगावे दुग्धालय",
        logo: {
          alt: "बोरगावे दुग्धालय लोगो",
        },
        menu: {
          transactions: "व्यवहार",
          addMilk: "दूध जोडा",
          addProduct: "उत्पादन जोडा",
          loan: "कर्ज",
          farmer: "शेतकरी",
          report: "अहवाल",
          addProductCategory : "उत्पादन श्रेणी जोडा",
          OnlineOrders : "ऑनलाईन ऑर्डर",

        },
        language: {
          select: "भाषा निवडा",
        },
        profile: {
          userImageAlt: "वापरकर्ता प्रोफाइल",
          name: "जॉन डो",
          role: "उप-प्रशासक",
        },
        buttons: {
          logout: "बाहेर पडा",
          close: "बंद करा",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
});

export default i18n;
