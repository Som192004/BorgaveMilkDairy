// App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ContactUs } from "./pages/ContactUs";
import { ProductList } from "./pages/ProductList";
import { ProductDetails } from "./pages/ProductDetail";
import { Home } from "./pages/Home";
import { AboutUs } from "./pages/AboutUs";
import { EditImageSlider } from "./pages/EditImageSlider.jsx";
import { BranchList } from "./pages/BranchList.jsx";
import { SubAdminList } from "./pages/SubAdminList.jsx";
import { AdminReport } from "./pages/AdminReport.jsx";
import { Login } from "./pages/Login.jsx";
import {
  CustomerLayout,
  AdminLayout,
  SubAdminLayout,
} from "./components/index.js";
import { SubAdminProductsList } from "./pages/SubAdminProductsList.jsx";
import TransactionList from "./pages/TransactionList.jsx";
import { SubAdminReport } from "./pages/SubAdminReport.jsx";
import MilkList from "./pages/MilkList.jsx";
import LoanList from "./pages/LoanList.jsx";
import FarmerList from "./pages/FarmerList.jsx";
import Cart from "./pages/Cart.jsx"; // import the new Cart page
import { CartProvider } from "./context/CartContext"; // import CartProvider
import { ProtectedRoute } from "./components/ProtectedRoute"; // make sure this is imported
import CategoryList from "./pages/CategoryList.jsx";
import OnlineOrders from "./pages/OnlineOrders.jsx";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:selectedBranch/:categoryId/:id" element={<ProductDetails />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="products/:id" element={<ProductDetails />} />

        <Route path="/admin" element={<ProtectedRoute allowedRole="Admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<EditImageSlider />} />
            <Route path="branch" element={<BranchList />} />
            <Route path="subadmin" element={<SubAdminList />} />
            <Route path="reports" element={<AdminReport />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />

        <Route
          path="/subadmin"
          element={<ProtectedRoute allowedRole="SubAdmin" />}
        >
          <Route element={<SubAdminLayout />}>
            <Route index element={<TransactionList />} />
            <Route path="products" element={<SubAdminProductsList />} />
            <Route path="report" element={<SubAdminReport />} />
            <Route path="add_milk" element={<MilkList />} />
            <Route path="loan" element={<LoanList />} />
            <Route path="farmer" element={<FarmerList />} />
            <Route path="category" element={<CategoryList />} />
            <Route path="online_orders" element={<OnlineOrders />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
