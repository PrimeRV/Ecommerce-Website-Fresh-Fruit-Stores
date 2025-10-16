import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const OrderSummary = ({ onCartClear }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };
  
  const [userDetails, setUserDetails] = useState({
    name: localStorage.getItem('loggedInUser') || '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    const { name, email, phone, address } = userDetails;
    if (!name || !email || !phone || !address) {
      return handleError('All fields are required!');
    }
    
    if (paymentMethod === 'online') {
      // Redirect to payment page for online payment
      navigate('/payment', {
        state: {
          orderData: {
            items: cartItems,
            totalAmount: parseFloat(totalAmount),
            userDetails
          }
        }
      });
      return;
    }
    
    // Handle COD order
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: parseFloat(totalAmount),
          userDetails,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          status: 'pending'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cart using parent function
        if (onCartClear) {
          onCartClear();
        }
        
        handleSuccess('Order placed! Pay on delivery.');
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else {
        handleError(result.message || 'Failed to place order!');
      }
    } catch (error) {
      handleError('Failed to place order!');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Summary</h1>
        <p className="text-center text-gray-600">No items to checkout</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Order Summary</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Order Items</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 py-3 last:border-b-0">
              <div className="flex items-center gap-3">
                <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.weight}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-white">{item.price}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
              <span>Total: ₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* User Details Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Delivery Details</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-800 dark:text-white">Name</label>
              <input
                type="text"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-800 dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-800 dark:text-white">Phone</label>
              <input
                type="tel"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-800 dark:text-white">Address</label>
              <textarea
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter your delivery address"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-800 dark:text-white">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span className="text-gray-800 dark:text-white">💵 Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span className="text-gray-800 dark:text-white">💳 Online Payment</span>
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {paymentMethod === 'online' ? 'Processing Payment...' : 'Placing Order...'}
                </>
              ) : (
                paymentMethod === 'online' ? 'Pay Now' : 'Place Order'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default OrderSummary;