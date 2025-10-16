import { motion } from "framer-motion";
import React from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
import BannerPng from "../../assets/fruits/banner-bg.jpg";
import { FadeLeft } from '../../utility/animation';

const bgStyle = {
    backgroundImage: `url(${BannerPng})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
}

const Banner3 = () => {
    return (
        <section className="container mb-12">
            <div style={bgStyle} className="container grid grid-cols-1 md:grid-cols-2 space-x-6 md:space-y-0 py-14 rounded-3xl">
                {/*Blank div Image*/}
                <div>

                </div>
                {/*Brand Info*/}
                <div className="flex flex-col justify-center">
                    <div className="text-center md:text-left space-y-4 lg:max-w-[400px]">
                    <motion.h1 variants={FadeLeft(0.5)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-3xl lg:text-6xl font-bold font-averia uppercase"> <span className="text-red-500 font-bold">GET FRESH</span> <span className="text-secondary font-bold">Fruits</span> <span className="text-green-600 font-bold">TODAY!</span></motion.h1>
                    <motion.p variants={FadeLeft(0.7)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}>Start your day with nature's best! Our handpicked selection of premium fruits delivers essential vitamins, minerals, and antioxidants straight to your doorstep. Fresh, healthy, and delicious - just the way nature intended.</motion.p>
                    {/*Button Section*/}
                    <motion.div
                            variants={FadeLeft(0.9)}
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
                                <span>
                                    <IoBagHandleOutline/>
                                </span>
                                Order Now
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner3
