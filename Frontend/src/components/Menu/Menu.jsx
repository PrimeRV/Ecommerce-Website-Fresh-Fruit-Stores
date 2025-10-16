import { motion } from "framer-motion";
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Fruit1 from "../../assets/fruits/apple.png";
import Fruit3 from "../../assets/fruits/avocado.png";
import Fruit4 from "../../assets/fruits/cherry.png";
import Fruit2 from "../../assets/fruits/orange.png";
import { FadeLeft } from "../../utility/animation";
import { handleError, handleSuccess } from "../../utils";

const MenuData = [
    {
        id: 1,
        title: "Fresh Red Apple",
        link: "/",
        price: "₹217.60 / kg",
        img: Fruit1,
        delay: 0.3,
    },
    {
        id: 2,
        title: "Fresh Oranges",
        link: "/",
        price: "₹134.12 / kg",
        img: Fruit2,
        delay: 0.6,
    },
    {
        id: 3,
        title: "Fresh Avocado",
        link: "/",
        price: "₹300 / kg",
        img: Fruit3,
        delay: 0.9,
    },
    {
        id: 4,
        title: "Fresh Cherries",
        link: "/",
        price: "₹500 / kg",
        img: Fruit4,
        delay: 1.2,
    },
]

const Menu = ({ onAddToCart }) => {
    const [quantities, setQuantities] = useState({});
    const [weights, setWeights] = useState({}); // Weight selection state

    const weightOptions = [
        { value: 0.25, label: '250g', priceMultiplier: 0.25 },
        { value: 0.5, label: '500g', priceMultiplier: 0.5 },
        { value: 1, label: '1kg', priceMultiplier: 1 },
        { value: 2, label: '2kg', priceMultiplier: 2 }
    ];

    const updateQuantity = (id, change) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + change)
        }));
    };

    const updateWeight = (id, weight) => {
        setWeights(prev => ({ ...prev, [id]: weight }));
    };

    const getItemPrice = (item) => {
        // Extract price from "₹217.60 / kg" format
        const priceMatch = item.price.match(/₹([0-9.]+)/);
        const basePrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
        const selectedWeight = weights[item.id] || 1;
        const weightOption = weightOptions.find(w => w.value === selectedWeight);
        return (basePrice * weightOption.priceMultiplier).toFixed(2);
    };

    const addToCart = (item) => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const loggedInUser = localStorage.getItem('loggedInUser');
        
        if (!token || !loggedInUser) {
            handleError('Please login first to add items to cart!');
            return;
        }
        
        const quantity = quantities[item.id] || 0;
        const selectedWeight = weights[item.id] || 1;
        const weightOption = weightOptions.find(w => w.value === selectedWeight);
        
        if (quantity > 0) {
            const itemWithWeight = {
                ...item,
                weight: weightOption.label,
                price: `₹${getItemPrice(item)}`,
                originalPrice: item.price
            };
            console.log(`Added ${quantity} x ${item.title} (${weightOption.label}) to cart`);
            console.log('Calling onAddToCart with:', itemWithWeight, quantity);
            handleSuccess(`Added ${quantity} x ${item.title} (${weightOption.label}) to cart!`);
            
            if (onAddToCart) {
                onAddToCart(itemWithWeight, quantity);
            } else {
                console.error('onAddToCart function not found!');
            }
            // Reset quantity and weight
            setQuantities(prev => ({ ...prev, [item.id]: 0 }));
            setWeights(prev => ({ ...prev, [item.id]: 1 }));
        } else {
            handleError('Please select quantity first!');
        }
    };

    return (
        <section id="menu" className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="container pt-12 pb-20">
                <motion.h1  initial={{ opacity: 0, x: -200 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}  className="text-3xl font-bold text-left pb-10 uppercase text-gray-800 dark:text-white">Our Menu</motion.h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {MenuData.map((menu) => (
                        <motion.div variants={FadeLeft(menu.delay)} initial="hidden" whileInView={"visible"} whileHover={{ scale: 1.1 }} key={menu.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            <img src={menu.img} alt={menu.title} className="w-[80px] h-[80px] object-cover mb-4 mx-auto -translate-y-6" />
                            <div className="text-center pb-4 px-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{menu.title}</h2>
                                <p className="text-xl font-semibold text-primary mb-3">₹{getItemPrice(menu)}</p>
                                
                                {/* Weight Selector */}
                                <div className="mb-3">
                                    <select 
                                        value={weights[menu.id] || 1}
                                        onChange={(e) => updateWeight(menu.id, parseFloat(e.target.value))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                    >
                                        {weightOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Counter */}
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <button 
                                        onClick={() => updateQuantity(menu.id, -1)}
                                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center font-bold text-gray-700 dark:text-white"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-semibold text-gray-800 dark:text-white">{quantities[menu.id] || 0}</span>
                                    <button 
                                        onClick={() => updateQuantity(menu.id, 1)}
                                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center font-bold text-gray-700 dark:text-white"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => addToCart(menu)}
                                    className="w-full bg-primary hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
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
        </section>
    );
};

export default Menu;
