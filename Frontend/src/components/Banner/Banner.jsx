import { motion } from "framer-motion";
import React from 'react';
import BannerPng from "../../assets/fruits/fruits-splash.png";
import { FadeUp } from '../../utility/animation';

const Banner = () => {
    return (
        <section id="brand" className="bg-secondary/10">
            <div className="container grid grid-cols-1 md:grid-cols-2 space-x-6 md:space-y-0 py-14">
                {/*Banner Image*/}
                <div className="flex justify-center items-center">
                    <motion.img initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} viewport={{ once: true }} src={BannerPng} alt="" className="w-[300px] md:max-w-[400px] h-full object-cover drop-shadow"/>
                </div>
                {/*Brand Info*/}
                <div className="flex flex-col justify-center">
                    <div className="text-center md:text-left space-y-4 lg:max-w-[400px]">
                    <motion.h1 variants={FadeUp(0.5)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-3xl lg:text-6xl font-bold uppercase"><span className="text-primary">Why Choose</span> Us?</motion.h1>
                    <motion.p variants={FadeUp(0.7)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}>We are committed to bringing you the freshest, highest quality fruits directly from local farms. Our rigorous quality control ensures every fruit meets our premium standards before reaching your table.</motion.p>
                    <motion.p variants={FadeUp(0.9)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}>Experience the difference with our farm-to-table approach, supporting local farmers while delivering exceptional taste and nutrition to your family.</motion.p>
                    {/*Button Section*/}
                    <motion.div
                            variants={FadeUp(1.1)}
                            initial="hidden"
                            animate="visible"
                            className="flex justify-center md:justify-start">
                            <button 
                                onClick={() => {
                                    const menuSection = document.querySelector('#menu');
                                    if (menuSection) {
                                        menuSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="primary-btn flex items-center gap-2"
                            >
                                <span>🍎</span>
                                Shop Fresh Fruits
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
