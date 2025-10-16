import { motion } from "framer-motion";
import React from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
import { ReactTyped } from "react-typed";
import HomeImg from "../../assets/fruits/fruit-plate.png";
import LeafImg from "../../assets/fruits/leaf.png";
import { FadeRight } from "../../utility/animation";

const Home = () => {
    return (
        <section>
            <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
                {/*Brand Info*/}
                <div className="flex flex-col justify-center py-14 md:py-0 relative z-10">
                    <div className="text-center md:text-left space-y-4 lg:max-w-[400px]">
                        <motion.h1
                            variants={FadeRight(0.6)}
                            initial="hidden"
                            animate="visible"
                            className="text-5xl lg:text-6xl font-bold leading-tight xl:leading-snug font-averia">
                            Healthy
                            <br />
                            Fresh <span className="text-secondary font-bold">
                            <ReactTyped
                                strings={["Fruits!"]}
                                typeSpeed={40}
                                backSpeed={50}
                                loop
                            />
                        </span>
                        </motion.h1>
                        <motion.p
                            variants={FadeRight(0.9)}
                            initial="hidden"
                            animate="visible"
                            className="text-2xl tracking-wide">
                            Order Now For Fresh Healthy Life
                        </motion.p>
                        <motion.p
                            variants={FadeRight(1.2)}
                            initial="hidden"
                            animate="visible"
                            className="text-gray-500">
                            Transform your health with nature's candy! Our premium fruits are packed with essential nutrients, vitamins, and natural energy. Perfect for breakfast, snacks, or healthy desserts. Order now and get 40% off on your first order!
                        </motion.p>
                        {/*Button Section*/}
                        <motion.div
                            variants={FadeRight(1.5)}
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
                {/*Home Images*/}
                <div className="flex justify-center items-center">
                    <motion.img
                        initial={{ opacity: 0, x: 200, rotate: 75 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        src={HomeImg}
                        alt=""
                        className="w-[350px] md:w-[550px] drop-shadow">
                    </motion.img>
                </div>
                {/*Leaf Image*/}
                <div>
                    <motion.img
                        initial={{ opacity: 0, x: -200, rotate: 75 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        src={LeafImg}
                        alt=""
                        className="absolute top-14 md:top-0 right-1/2 blur-sm opacity-80 rotate-[40deg] w-full md:max-w-[400px]">
                    </motion.img>
                </div>
            </div>
        </section>
    )
}

export default Home;
