import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems = [], onUpdateQuantity, onRemoveItem }) => {
  console.log('Cart component - cartItems:', cartItems);
  const navigate = useNavigate();
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const priceMatch = item.price.match(/₹([0-9.]+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Your Cart</h1>
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">Your cart is empty</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Add some delicious fruits to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Your Cart</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 py-4 last:border-b-0">
            <div className="flex items-center gap-4">
              <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-primary font-semibold">{item.price}</p>
                {item.weight && <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {item.weight}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center font-bold text-gray-700 dark:text-white"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold text-gray-800 dark:text-white">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center font-bold text-gray-700 dark:text-white"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-xl font-bold text-gray-800 dark:text-white">
            <span>Total: ₹{getTotalPrice()}</span>
            <button 
              onClick={() => navigate('/order-summary', { 
                state: { cartItems, totalAmount: getTotalPrice() } 
              })}
              className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;