import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 30 seconds to sync with database
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  


  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/orders/user-orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.orders);
      } else {
        handleError(result.message || 'Failed to fetch orders');
      }
    } catch (error) {
      handleError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/orders/cancel/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(prev => prev.map(order => 
          order.orderId === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
        handleSuccess('Order cancelled successfully!');
      } else {
        handleError(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      handleError('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">No orders found</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Order #{order.orderId}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentMethod === 'cod' ? '💵 COD' : 
                       order.paymentMethod === 'upi' ? '📱 UPI' :
                       order.paymentMethod === 'card' ? '💳 Card' :
                       order.paymentMethod === 'netbanking' ? '🏦 NetBanking' : '💳 Online'}
                      {' - '}{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors duration-300">
                        <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">{item.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.weight} × {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Delivery Details</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-800 dark:text-white">Name:</span> {order.userDetails.name}</p>
                    <p><span className="font-medium text-gray-800 dark:text-white">Email:</span> {order.userDetails.email}</p>
                    <p><span className="font-medium text-gray-800 dark:text-white">Phone:</span> {order.userDetails.phone}</p>
                    <p><span className="font-medium text-gray-800 dark:text-white">Address:</span> {order.userDetails.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800 dark:text-white">Total: ₹{order.totalAmount}</span>
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
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

export default MyOrders;