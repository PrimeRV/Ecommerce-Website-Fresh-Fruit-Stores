import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './PaymentPage.css';

const PaymentPage = ({ onCartClear }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-600">Invalid payment request</p>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      return handleError('Please select a payment method');
    }

    if (selectedMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        return handleError('Please fill all card details');
      }
    }

    if (selectedMethod === 'upi' && !upiId) {
      return handleError('Please enter UPI ID');
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: selectedMethod, // upi, card, or netbanking
          paymentStatus: 'completed',
          status: 'confirmed'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cart using parent function
        if (onCartClear) {
          onCartClear();
        }
        
        handleSuccess('Payment successful! Order confirmed!');
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else {
        handleError(result.message || 'Payment failed!');
      }
    } catch (error) {
      handleError('Payment failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2 mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-pulse">Complete Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
          {/* Order Summary */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/50 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.weight || '1kg'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">₹{orderData.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Payment Method</h2>
            </div>
          
            {/* UPI Payment */}
            <div className="mb-6">
              <label className={`group flex items-center gap-4 p-6 backdrop-blur-sm bg-white/30 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${selectedMethod === 'upi' ? 'upi-selected bg-white/50' : 'border-2 border-white/40 hover:bg-white/50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={selectedMethod === 'upi'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-purple-600 w-5 h-5"
                  />
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-700 transition-colors">UPI Payment</h3>
                    <p className="text-sm text-gray-600">Pay using any UPI app</p>
                  </div>
                  <div className="text-green-500 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">
                    Instant
                  </div>
                </label>
              {selectedMethod === 'upi' && (
                <div className="mt-4 ml-6">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., user@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-4 backdrop-blur-sm bg-white/50 border-2 border-white/60 rounded-2xl placeholder-gray-500 text-gray-800 focus:ring-4 focus:ring-purple-400/50 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
                  />
                </div>
              )}
            </div>

            {/* Card Payment */}
            <div className="mb-8">
              <label className={`group flex items-center gap-4 p-6 backdrop-blur-sm bg-white/30 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${selectedMethod === 'card' ? 'card-selected bg-white/50' : 'border-2 border-white/40 hover:bg-white/50'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod === 'card'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="text-purple-600 w-5 h-5"
                />
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-700 transition-colors">Credit/Debit Card</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard, RuPay accepted</p>
                </div>
                <div className="text-blue-500 font-bold text-sm bg-blue-100 px-3 py-1 rounded-full">
                  Secure
                </div>
              </label>
              {selectedMethod === 'card' && (
                <div className="mt-6 ml-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="w-full p-4 backdrop-blur-sm bg-white/50 border-2 border-white/60 rounded-2xl placeholder-gray-500 text-gray-800 focus:ring-4 focus:ring-purple-400/50 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
                    maxLength={16}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      className="p-4 backdrop-blur-sm bg-white/50 border-2 border-white/60 rounded-2xl placeholder-gray-500 text-gray-800 focus:ring-4 focus:ring-purple-400/50 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
                      maxLength={5}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      className="p-4 backdrop-blur-sm bg-white/50 border-2 border-white/60 rounded-2xl placeholder-gray-500 text-gray-800 focus:ring-4 focus:ring-purple-400/50 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
                      maxLength={3}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    className="w-full p-4 backdrop-blur-sm bg-white/50 border-2 border-white/60 rounded-2xl placeholder-gray-500 text-gray-800 focus:ring-4 focus:ring-purple-400/50 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
                  />
                </div>
              )}
            </div>



            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading || !selectedMethod}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform backdrop-blur-sm"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Pay ₹{orderData.totalAmount}</span>
                  <div className="bg-white/20 rounded-full p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </>
              )}
            </button>
          </div>
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

export default PaymentPage;