import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Track active section
      const sections = ['home', 'about', 'skills', 'projects', 'profiles', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Profiles', href: '#profiles' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Desktop Navbar - Centered with Logo */}
      <div className="hidden lg:flex fixed top-4 left-0 right-0 z-50 justify-center">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-white/70 backdrop-blur-2xl rounded-full shadow-2xl border border-gray-200/50 px-6 py-3"
        >
          <div className="flex items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-amber-400 to-orange-500"
              >
                <img 
                  src="/Logo.png" 
                  alt="Jashank Logo" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Menu Items with Animated Blob */}
            <div className="flex items-center gap-1 relative bg-gray-100/50 rounded-full px-2 py-2">
            {/* Animated Blob Background */}
            <motion.div
              className="absolute bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg"
              layoutId="navbar-blob"
              initial={false}
              animate={{
                x: navItems.findIndex(item => item.href.replace('#', '') === activeSection) * 100 + 10,
                width: '80px',
              }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30
              }}
              style={{
                position: 'absolute',
                height: '40px',
                zIndex: 0,
              }}
            />
            
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-2 rounded-full font-semibold transition-all duration-300 z-10 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  {item.name}
                </motion.a>
              );
            })}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile & Tablet Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="lg:hidden fixed top-3 left-0 right-0 z-50 px-3"
      >
        <div className="bg-white/70 backdrop-blur-2xl rounded-full shadow-2xl border border-gray-200/50 px-4 py-2.5 mx-auto max-w-2xl">
          <div className="flex items-center justify-between relative">
            {/* Logo - Left Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-amber-400 to-orange-500"
              >
                <img 
                  src="/Logo.png" 
                  alt="Jashank Logo" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Brand Name - Center */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute left-1/2 -translate-x-1/2 font-bold text-lg bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent"
            >
              Jashank
            </motion.div>

            {/* Mobile Menu Button - Right Side */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              className="text-gray-700 hover:text-amber-500 focus:outline-none p-2 rounded-full hover:bg-gray-100/80 transition-all duration-200 z-10"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

    {/* Mobile Menu Floating */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed top-20 left-0 right-0 z-40 px-3"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 mx-auto max-w-md overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ x: 5 }}
                    className={`block px-5 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
                        : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50/80'
                    }`}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
