import { motion } from "framer-motion";
import { FaFacebook, FaGithub, FaInstagram, FaLeaf, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-primary/10 py-12">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 px-6"
            >
                {/* Logo Section */}
                <div className="flex items-center gap-2 text-2xl font-bold uppercase">
                    <p className="text-primary">Fruit</p>
                    <p className="text-secondary">Store</p>
                    <FaLeaf className="text-green-500" />
                </div>

                {/* Social Media Section */}
                <div className="flex gap-6">
                    <a
                        href="https://github.com/PrimeRV"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-400 transition duration-300"
                        aria-label="GitHub"
                    >
                        <FaGithub size={28} />
                    </a>
                    <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200"
                        aria-label="Facebook"
                    >
                        <FaFacebook className="text-3xl text-blue-600" />
                    </a>
                    <a
                        href="https://www.instagram.com/vrohit072003_/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition duration-300"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={28} />
                    </a>
                    <a
                        href="https://twitter.com/your-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition duration-300"
                        aria-label="Twitter"
                    >
                        <FaTwitter size={28} />
                    </a>
                </div>

                {/* Footer Text */}
                <div className="text-center md:text-right">
                    <p className="text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} Fruit Store. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-600">
                        Designed by Rohit
                    </p>
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
