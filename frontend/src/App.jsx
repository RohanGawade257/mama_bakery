import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";

import HomePage from "./pages/customer/HomePage.jsx";
import ShopPage from "./pages/customer/ShopPage.jsx";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import CheckoutPage from "./pages/customer/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/customer/OrderSuccessPage.jsx";
import ProfilePage from "./pages/customer/ProfilePage.jsx";
import OrdersPage from "./pages/customer/OrdersPage.jsx";
import AboutPage from "./pages/customer/AboutPage.jsx";
import GalleryPage from "./pages/customer/GalleryPage.jsx";
import ContactPage from "./pages/customer/ContactPage.jsx";
import SignInPage from "./pages/customer/SignInPage.jsx";
import SignUpPage from "./pages/customer/SignUpPage.jsx";

const NotFound = () => (
  <div className="container-shell py-20 text-center">
    <h1 className="page-title text-[#4a4039]">Page not found</h1>
  </div>
);

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success/:id"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </>
);

export default App;
