import React from 'react';
import { FaLeaf, FaMoon, FaSun, FaUser, FaUserCircle } from 'react-icons/fa';
import { MdMenu, MdOutlineShoppingCart } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ResponsiveMenu from './ResponsiveMenu';

const NavbarMenu = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "Products", link: "#menu" },
    { id: 3, title: "About", link: "#brand" },
    { id: 4, title: "Contacts", link: "#" },
    { id: 5, title: "My orders", link: "/my-orders" },
    { id: 6, title: "Login/Signup", link: "/signup" },
];

const Navbar = ({ cartCount = 0 }) => {
    const [open, setOpen] = React.useState(false);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const userMenuRef = React.useRef(null);
    const { isDarkMode, toggleTheme } = useTheme();
    const loggedInUser = localStorage.getItem('loggedInUser');
    const token = localStorage.getItem('token');
    const isLoggedIn = token && loggedInUser;
    
    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Auto logout after 1 minute (testing)
    React.useEffect(() => {
        if (isLoggedIn) {
            const autoLogoutTimer = setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartCount');
                alert('Session expired! Please login again.');
                window.location.href = '/login';
            }, 24 * 60 * 60 * 1000); // 24 hours = 86400000ms
            
            return () => clearTimeout(autoLogoutTimer);
        }
    }, [isLoggedIn]);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartCount');
        window.location.href = '/';
    };
    return (
        <>
            <nav className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="container flex justify-between items-center py-4 md:pt-4">
                    {/* Logo section */}
                    <div className="text-2xl flex items-center gap-2 font-bold uppercase">
                        <p className="text-primary">Fruit</p>
                        <p className="text-secondary">Store</p>
                        <FaLeaf className="text-green-500"/>
                    </div>
                    {/* Menu section */}
                    <div className="hidden md:block">
                        <ul className="flex items-center gap-6 text-gray-600 dark:text-gray-300">
                            {NavbarMenu.filter(menu => {
                                // Hide Login/Signup if user is logged in
                                if (menu.title === 'Login/Signup' && isLoggedIn) return false;
                                return true;
                            }).map((menu) => (
                                <li key={menu.id}>
                                    <button 
                                        onClick={() => {
                                            if (menu.link.startsWith('/')) {
                                                window.location.href = menu.link;
                                            } else if (menu.link.startsWith('#')) {
                                                const element = document.querySelector(menu.link);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold bg-transparent border-none cursor-pointer"
                                        title={menu.title === 'Login/Signup' ? 'Login/Signup' : ''}
                                    >
                                        {menu.title === 'Login/Signup' ? <FaUserCircle className="text-2xl text-black dark:text-white hover:text-primary transition-colors" /> : menu.title}
                                    </button>
                                </li>
                            ))}
                            
                            {/* Theme Toggle */}
                            <li>
                                <button 
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 py-1 px-3 hover:text-primary font-semibold transition-colors"
                                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                >
                                    {isDarkMode ? <FaSun className="text-lg text-yellow-500" /> : <FaMoon className="text-lg text-blue-600" />}
                                </button>
                            </li>

                            {/* User Profile Section */}
                            {isLoggedIn && (
                                <li className="relative" ref={userMenuRef}>
                                    <button 
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 py-1 px-3 hover:text-primary font-semibold"
                                    >
                                        <FaUser className="text-lg" />
                                        <span>{loggedInUser}</span>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-48 z-50">
                                            <Link 
                                                to="/my-orders" 
                                                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </li>
                            )}
                            <button 
                                onClick={() => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        alert('Please login first to view cart!');
                                    } else {
                                        window.location.href = '/cart';
                                    }
                                }}
                                className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200 relative"
                            >
                                <MdOutlineShoppingCart />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </ul>
                    </div>
                    {/* Mobile Hamburger Menu Section */}
                    <div className="md:hidden" onClick={() => setOpen(!open)}>
                        <MdMenu className="text-4xl"/>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Section */}
            <ResponsiveMenu open={open} setOpen={setOpen}/>
        </>
    );
}

export default Navbar;
