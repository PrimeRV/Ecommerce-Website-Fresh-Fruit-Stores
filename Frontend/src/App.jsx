import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Banner from './components/Banner/Banner';
import Banner2 from './components/Banner/Banner2';
import Banner3 from './components/Banner/Banner3';
import Chatbot from './components/Chatbot/Chatbot';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import Cart from './Pages/Cart';
import ForgotPassword from './Pages/ForgotPassword';
import Login from './Pages/Login';
import MyOrders from './Pages/MyOrders';
import OrderSummary from './Pages/OrderSummary';
import OTPLogin from './Pages/OTPLogin';
import PaymentPage from './Pages/PaymentPage';
import Signup from './Pages/Signup';

const App = () => {
  const [cartCount, setCartCount] = useState(() => {
    const saved = localStorage.getItem('cartCount');
    return saved ? parseInt(saved) : 0;
  });
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddToCart = (item, quantity) => {
    console.log('handleAddToCart called:', item, quantity);
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      let newItems;
      if (existingItem) {
        newItems = prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        newItems = [...prev, { ...item, quantity }];
      }
      console.log('New cart items:', newItems);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
    setCartCount(prev => {
      const newCount = prev + quantity;
      console.log('New cart count:', newCount);
      localStorage.setItem('cartCount', newCount.toString());
      return newCount;
    });
  };

  const handleUpdateQuantity = (id, change) => {
    setCartItems(prev => {
      const newItems = prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
    setCartCount(prev => {
      const newCount = Math.max(0, prev + change);
      localStorage.setItem('cartCount', newCount.toString());
      return newCount;
    });
  };

  const handleRemoveItem = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setCartCount(prev => {
        const newCount = prev - item.quantity;
        localStorage.setItem('cartCount', newCount.toString());
        return newCount;
      });
      setCartItems(prev => {
        const newItems = prev.filter(item => item.id !== id);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const clearCart = () => {
    setCartCount(0);
    setCartItems([]);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartCount');
  };

  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar cartCount={cartCount} />
              <main className="overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
                <Home />
                <Menu onAddToCart={handleAddToCart} />
                <Banner />
                <Banner2 />
                <Banner3 />
                <Footer />
              </main>
            </>
          }
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/order-summary" 
          element={
            <ProtectedRoute>
              <Navbar cartCount={cartCount} />
              <OrderSummary onCartClear={clearCart} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-orders" 
          element={
            <ProtectedRoute>
              <Navbar cartCount={cartCount} />
              <MyOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Navbar cartCount={cartCount} />
              <PaymentPage onCartClear={clearCart} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Navbar cartCount={cartCount} />
              <Cart 
                cartItems={cartItems} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
              {console.log('App - Passing cartItems to Cart:', cartItems)}
              {console.log('App - Cart count:', cartCount)}
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Chatbot />
    </ThemeProvider>
  );
};

export default App;
