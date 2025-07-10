import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './components/ProductDetail';
import CartPage from './pages/CartPage';
import GuestShippingPage from './pages/GuestShippingPage';
import StripePaymentPage from './pages/StripePaymentPage';
import OrderSuccess from './pages/OrderSuccess';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyOrders from './pages/MyOrders';
import MemberShippingPage from './pages/MemberShippingPage';
import StripePaymentForUser from './pages/StripePaymentForUser';
import HomePage from './pages/HomePage';
// import 'country-flag-icons/react/3x2';
// import 'country-flag-icons/css/flag-icons.min.css';
import './assets/css/flag-icons.min.css';
import Footer from './components/Footer ';
import MyFavourite from './pages/MyFavourite';
import OrderItem from './pages/OrderItem';



function App() {
  const token = localStorage.getItem('token');

  

  return (
    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        {/* <Route path="/" element={<ProductsPage />} /> */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/guest-shipping" element={<GuestShippingPage />} />
        <Route path="/member-shipping" element={<MemberShippingPage />} />        
        <Route path="/payment" element={<StripePaymentPage />} />
        <Route path="/user-payment" element={<StripePaymentForUser />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<Navigate to="/my-orders" replace />} />
        <Route
          path="/my-orders"
          element={token ? <MyOrders /> : <Navigate to="/login" replace />}
        />
        <Route path="/orderitem/:orderId" element={<OrderItem />} />
        <Route path="/men" element={<ProductsPage genderFilter="Men" />} />
        <Route path="/women" element={<ProductsPage genderFilter="Women" />} />
        <Route path="/kids" element={<ProductsPage genderFilter="Kid" />} />

        <Route path="/my-favourites" element={<MyFavourite />} />

        <Route path="*" element={<div className="p-6 text-center text-red-500">Page Not Found</div>} />
      </Routes>
        <Footer/>
    </Router>
  );
}

export default App;
