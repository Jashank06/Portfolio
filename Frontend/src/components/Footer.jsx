import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp, FaCopy, FaCheck } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { BsStars, BsArrowRight } from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';
import { motion, useScroll, useTransform } from 'framer-motion';

const Footer = () => {
  const [copiedField, setCopiedField] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);

  // Show/hide scroll to top button
  useEffect(() => {
    const updateScrollTop = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', updateScrollTop);
    return () => window.removeEventListener('scroll', updateScrollTop);
  }, []);

  // Copy to clipboard function
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/Jashank06', label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/jashank-308b83247', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: SiLeetcode, href: 'https://leetcode.com/u/Jashank_06/', label: 'LeetCode', color: 'hover:text-yellow-400' },
  ];

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const contactInfo = [
    { icon: FaEnvelope, label: 'Email', value: 'jaykumar0305@gmail.com', href: 'mailto:jaykumar0305@gmail.com' },
    { icon: FaPhone, label: 'Phone', value: '+91 99117 52744', href: 'tel:+919911752744' },
    { icon: FaMapMarkerAlt, label: 'Location', value: 'Faridabad, India', href: '#' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:shadow-amber-400/50 transition-all duration-300"
          style={{ opacity }}
        >
          <FaArrowUp className="text-xl" />
        </motion.button>
      )}

      {/* Main Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #F59E0B 2px, transparent 2px), radial-gradient(circle at 75% 75%, #F97316 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">J</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      Jashank Kumar
                    </h3>
                    <p className="text-gray-400 text-sm">Full Stack Developer</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed max-w-md">
                  Passionate full-stack developer creating innovative digital solutions. 
                  Specialized in modern web technologies and user-centric design.
                </p>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm font-medium">Follow me:</span>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-11 h-11 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-amber-400 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 group`}
                      >
                        <social.icon className="text-lg group-hover:scale-110 transition-transform duration-200" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <h4 className="text-xl font-bold text-white relative">
                  Quick Links
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                </h4>
                
                <nav className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ x: 5 }}
                      className="block text-gray-400 hover:text-amber-400 transition-all duration-300 group flex items-center"
                    >
                      <BsArrowRight className="opacity-0 group-hover:opacity-100 mr-2 text-sm transition-opacity duration-200" />
                      <span>{link.label}</span>
                    </motion.a>
                  ))}
                </nav>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                <h4 className="text-xl font-bold text-white relative">
                  Get In Touch
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                </h4>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="group"
                    >
                      {info.label === 'Location' ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <info.icon className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide">{info.label}</p>
                            <p className="text-white font-medium">{info.value}</p>
                          </div>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            if (info.href.startsWith('mailto:') || info.href.startsWith('tel:')) {
                              window.location.href = info.href;
                            } else {
                              copyToClipboard(info.value, info.label);
                            }
                          }}
                          className="flex items-center space-x-3 w-full text-left p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <info.icon className="text-white text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wide">{info.label}</p>
                            <p className="text-white font-medium group-hover:text-amber-400 transition-colors duration-200">{info.value}</p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {copiedField === info.label ? (
                              <FaCheck className="text-green-400 text-xs" />
                            ) : (
                              <FaCopy className="text-gray-400 text-xs" />
                            )}
                          </div>
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                
                {/* Copyright */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <span>© {currentYear} Jashank Kumar. Crafted with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <FaHeart className="text-red-500" />
                  </motion.div>
                  <span>and</span>
                  <HiSparkles className="text-amber-400" />
                  <span>in India</span>
                </motion.div>

                {/* Back to Top Link */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToTop}
                  className="flex items-center space-x-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 group"
                >
                  <span className="text-sm font-medium">Back to top</span>
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <FaArrowUp className="text-sm group-hover:text-amber-400" />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 opacity-20">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear" 
            }}
          >
            <BsStars className="text-amber-400 text-4xl" />
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
