import { motion } from "framer-motion";
import React from "react";
import BannerPng from "../../assets/fruits/fruit-plate2.png";
import { FadeUp } from "../../utility/animation";

const Banner = () => {
    return (
        <section className="">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-14 md:py-24 px-6">
                
                {/* Brand Info */}
                <div className="flex flex-col justify-center">
                    <div className="text-center md:text-left space-y-6 lg:max-w-[500px]">
                        <motion.h1 
                            variants={FadeUp(0.5)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-4xl lg:text-6xl font-bold uppercase text-gray-800"
                        >
                            <span className="text-primary">Fresh</span>{" "}
                            <span className="text-secondary">Fruits</span>{" "}
                            for <span className="text-green-500">You</span>
                        </motion.h1>
                        
                        <motion.p 
                            variants={FadeUp(0.7)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-gray-600"
                        >
                        Discover the goodness of nature with our premium selection of fresh, handpicked fruits, grown to bring health and happiness to your table.
                        </motion.p>
                        
                        <motion.p
                            variants={FadeUp(0.9)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-gray-600"
                        >
                            Experience the best taste and quality, harvested with care.
                        </motion.p>
                        
                        {/* Button Section */}
                        <motion.div
                            variants={FadeUp(1.1)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex justify-center md:justify-start"
                        >
                            <button 
                                className="primary-btn bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                                aria-label="Download the app"
                            >
                                Download the App
                                <span className="material-icons">cloud_download</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
                
                {/* Banner Image */}
                <div className="flex justify-center items-center">
                    <motion.img
                        initial={{ opacity: 0, x: 200, rotate: 75 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        src={BannerPng}
                        alt="A plate of fresh fruits"
                        className="w-[350px] md:max-w-[500px] h-full object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>
        </section>
    );
};

export default Banner;
