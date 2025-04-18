import { Home } from "../pages/Home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import ProfileEdit from "../components/ProfileEdit/ProfileEdit";
import Profile from "../components/ProfileInformation/Profile";
import Address from "../components/Address/Address";
import AddressList from "../components/Address/AddressList";
import AddressForm from "../components/Address/AddressForm";
import OrderSummary from "../components/OrderSummary/OrderSummary";
import MyProducts from "../components/ProfileInformation/MyProducts.jsx";
import Orders from "../components/OrderDetails/Orders";
import Login from "../components/Login/Login.jsx";
import Products from "../components/Products/Products";
import Register from "../components/Register/Register";
import ProductDetails from "../components/ProductDetails/ProductDetails.jsx";
import Cart from "../components/UserCart/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import SellProduct from "../components/SellProduct/SellProduct.jsx";
import ProductsUpload from "../components/SellProduct/ProductsUpload.jsx";
import AccountDetail from "../components/AccountDetails/AccountDetail.jsx";
import Wishlist from "../components/WishList/WishList.jsx";
import AdminPage from "../components/AdminPage/AdminPage.jsx";
import MyReviews from "../pages/MyReviews.jsx";

import ContactPage from "../pages/Contact.jsx";
import FAQsPage from "../pages/Faqs.jsx";
import HelpCenter from "../pages/Help.jsx";
import PrivacyPolicy from "../pages/Privacy.jsx";
import Terms from "../pages/Terms.jsx";
import RefundPolicy from "../pages/Refunds.jsx";

import { useEffect } from "react";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const Routers = () => {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/address-edit" element={<Address />} />
          <Route path="/addresses" element={<AddressList />} />
          <Route path="/add-address" element={<AddressForm />} />
          <Route path="/edit-address/:addressId" element={<AddressForm />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/items" element={<Products />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/account" element={<AccountDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/sell-product" element={<SellProduct />} />
          <Route path="/my-reviews" element={<MyReviews />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<RefundPolicy />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default Routers;