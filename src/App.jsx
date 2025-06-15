import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './components/ProductDetail';
import CartPage from './pages/CartPage';
import GuestShippingPage from './pages/GuestShippingPage';
import StripePaymentPage from './pages/StripePaymentPage';
import OrderSuccess from './pages/OrderSuccess';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
         <Route path="/guest-shipping" element={<GuestShippingPage />} />
          <Route path="/payment" element={<StripePaymentPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
