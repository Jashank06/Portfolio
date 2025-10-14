import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { BsStars } from 'react-icons/bs';
import ProfileImage from '../assets/profile.jpg';
import TypewriterGlitch from './TypewriterGlitch';

const Hero = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/Jashank06', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/jashank-308b83247', label: 'LinkedIn' },
    { icon: SiLeetcode, href: 'https://leetcode.com/u/Jashank_06/', label: 'LeetCode' },
  ];
  
  const features = [
    { text: 'Fullstack Expertise' },
    { text: 'Smooth Deployment' },
    { text: 'Creative UI/UX' },
    { text: 'AI Integration' },
  ];

  return (
    <section id="home" className="min-h-screen bg-white relative overflow-hidden">
      {/* 3D Coding Symbols - Left Top {} */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute left-4 lg:left-12 z-0 pointer-events-none"
        style={{ top: '4px', perspective: '1000px' }}
      >
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            rotateX: [0, 15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="text-[8rem] lg:text-[14rem] font-bold leading-none bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent opacity-20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {'{}'}
        </motion.div>
      </motion.div>

      {/* 3D Coding Symbols - Right Top <> */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotateY: 180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="absolute right-4 lg:right-12 z-20 pointer-events-none"
        style={{ top: '4px', perspective: '1000px' }}
      >
        <motion.div
          animate={{ 
            rotateY: [360, 0],
            rotateX: [0, -15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="text-[8rem] lg:text-[14rem] font-bold leading-none bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent opacity-20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {'<>'}
        </motion.div>
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Text Content - Slide from Left */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 1, 
              ease: "easeOut",
              type: "spring",
              stiffness: 50,
              damping: 15
            }}
            className="space-y-8 text-left"
          >
            {/* Greeting Text */}
            <motion.div
              initial={{ opacity: 0, x: -80, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                type: "spring",
                stiffness: 60
              }}
              className="space-y-4"
            >
              <motion.h2 
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 1.8 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black"
              >
                <TypewriterGlitch 
                  text="Hello" 
                  delay={2600}
                  speed={100}
                />
              </motion.h2>
              <motion.h1 
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1.5, duration: 1.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black leading-tight"
              >
                I'm Jashank
              </motion.h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -60, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              transition={{ 
                delay: 2.2, 
                duration: 1.8,
                type: "spring",
                stiffness: 30
              }}
              className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xl"
            >
              <TypewriterGlitch 
                text="Welcome to my creative space! I'm Jashank, A passionate Full Stack Developer on a mission to transform ideas into seamless digital design."
                delay={4000}
                speed={50}
              />
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ 
                delay: 0.7, 
                duration: 0.7,
                type: "spring",
                stiffness: 70
              }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-md font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Schedule A Meeting
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.9, 
                duration: 0.6,
                type: "spring",
                stiffness: 80
              }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-6"
            >
              <span className="text-black font-medium text-sm sm:text-base">Follow Me On:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Image - Slide from Right */}
          <motion.div
            initial={{ opacity: 0, x: 150, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.2, 
              ease: "easeOut",
              type: "spring",
              stiffness: 50,
              damping: 15
            }}
            className="relative flex justify-center items-center order-first lg:order-last mb-8 lg:mb-0"
          >
            {/* Profile Image */}
            <div className="relative w-64 sm:w-80 md:w-96 lg:w-full lg:max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative z-10"
              >
                <img
                  src={ProfileImage}
                  alt="Jashank - Full Stack Developer"
                  className="w-full h-auto object-cover rounded-full lg:rounded-none"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Bar - Bottom Black Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 bg-black text-white py-8 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                className="flex items-center justify-center gap-2 sm:gap-3 text-center"
              >
                <BsStars className="text-amber-400 text-xl sm:text-2xl flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base lg:text-lg text-white">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
