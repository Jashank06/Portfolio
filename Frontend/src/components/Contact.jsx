import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaComments, FaCopy, FaCheck, FaCheckCircle } from 'react-icons/fa';
import { BsStars, BsArrowRight } from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';
import axios from 'axios';

// Confetti Animation Component
const SuccessConfetti = ({ isActive }) => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
  }));

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-full"
          initial={{ 
            x: `50%`,
            y: `-10%`,
            opacity: 1,
            scale: 0,
            rotate: piece.rotation
          }}
          animate={{ 
            x: [`50%`, `${piece.x}%`],
            y: [`-10%`, `110%`],
            opacity: [1, 1, 0],
            scale: [0, 1, 1],
            rotate: [piece.rotation, piece.rotation + 180]
          }}
          transition={{
            duration: 3,
            ease: [0.17, 0.67, 0.83, 0.67],
            times: [0, 0.2, 1]
          }}
          style={{
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
          }}
        />
      ))}
    </div>
  );
};

// Typing Animation Component
const TypingPlaceholder = ({ text, isActive, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, isActive, delay]);

  return (
    <span className="flex items-center">
      {displayText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1 text-amber-500"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`,
            scale: 0,
            opacity: 0
          }}
          animate={{ 
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x - 5}%`, `${particle.x}%`],
            scale: [0, 1, 0.5, 1],
            opacity: [0, 0.7, 0.3, 0.7]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
        />
      ))}
    </div>
  );
};

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Trigger typing animation when form comes into view
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsTypingActive(true);
      }, 2000); // Start typing animation after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [inView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Update character count for message field
    if (name === 'message') {
      setCharCount(value.length);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate character limit
    if (charCount > 500) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
      return;
    }
    
    try {
      setStatus('sending');
      
      const response = await axios.post('http://localhost:5001/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      if (response.data.success) {
        setStatus('success');
        setShowConfetti(true);
        
        // Clear form data
        setFormData({ name: '', email: '', subject: '', message: '' });
        setCharCount(0);
        
        // Hide confetti after 4 seconds
        setTimeout(() => setShowConfetti(false), 4000);
        
        // Clear success message after 5 seconds
        setTimeout(() => setStatus(''), 5000);
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'jaykumar0305@gmail.com',
      href: 'mailto:jaykumar0305@gmail.com',
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+91 99117 52744',
      href: 'tel:+919911752744',
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'Faridabad, India',
      href: '#',
    },
  ];

  return (
    <>
      {/* Fullscreen Loading Overlay */}
      {status === 'sending' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <FaPaperPlane className="text-white text-2xl" />
              </motion.div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sending Message</h3>
            <p className="text-gray-600 mb-4">Please wait while we process your request...</p>
            <motion.div
              className="w-full bg-gray-200 rounded-full h-2"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Fullscreen Success Overlay */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden"
          >
            {/* Success Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50"></div>
            
            <div className="relative z-10">
              {/* Success Icon with Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <FaCheckCircle className="text-white text-4xl" />
                </motion.div>
              </motion.div>
              
              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-green-800 mb-4">Message Sent Successfully!</h2>
                <p className="text-green-700 text-lg mb-6">
                  Thanks for reaching out! I'll get back to you soon. 🎉
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStatus('')}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Continue
                </motion.button>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 text-green-400 text-2xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-4 left-4 text-green-400 text-xl"
              >
                🎊
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Fullscreen Error Overlay */}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden"
          >
            {/* Error Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-50"></div>
            
            <div className="relative z-10">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <span className="text-white text-3xl font-bold">!</span>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-red-800 mb-4">Oops! Something went wrong</h2>
                <p className="text-red-700 text-lg mb-6">
                  Please check your connection and try again, or email me directly at{' '}
                  <a href="mailto:jaykumar0305@gmail.com" className="text-red-600 underline">
                    jaykumar0305@gmail.com
                  </a>
                </p>
                
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStatus('')}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStatus('')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Confetti Animation */}
      <SuccessConfetti isActive={showConfetti} />

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Interactive Cursor Effect */}
      <motion.div
        className="fixed w-4 h-4 bg-amber-400/20 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Section Title */}
          <div className="text-center mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4"
            >
              <FaComments className="text-amber-600 text-sm sm:text-base" />
              <span className="text-amber-700 font-semibold text-xs sm:text-sm">CONTACT ME</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              Get In Touch
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto"
            >
              Ready to bring your ideas to life? Let's collaborate and create something amazing together
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -80, scale: 0.9 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 80
              }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Info Header */}
              <div className="relative">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                >
                  Let's Work Together
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-gray-300 text-base sm:text-lg leading-relaxed"
                >
                  I'm currently available for freelance work and exciting project opportunities.
                  If you have a project in mind or just want to say hi, feel free to reach out!
                </motion.p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      x: 10,
                      rotateY: 5,
                      rotateX: 2
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative block cursor-pointer"
                    style={{ perspective: '1000px' }}
                    onClick={() => info.label !== 'Location' && copyToClipboard(info.value.replace('+91 ', ''), info.label)}
                  >
                    {/* Enhanced Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-300/30 to-orange-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
                    
                    <div className="relative flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 group-hover:border-amber-400 transition-all duration-300 shadow-lg overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Ripple Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-2xl scale-0 group-active:scale-100 transition-transform duration-300 origin-center"></div>
                      
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg relative z-10">
                        <info.icon className="text-white text-lg sm:text-2xl group-hover:animate-pulse" />
                      </div>
                      <div className="flex-1 relative z-10">
                        <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1">{info.label}</p>
                        <p className="text-gray-800 font-semibold text-base sm:text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300">{info.value}</p>
                        {info.label !== 'Location' && (
                          <p className="text-amber-600 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Click to copy {info.label.toLowerCase()}
                          </p>
                        )}
                      </div>
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-amber-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
                        {copiedField === info.label ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-600"
                          >
                            <FaCheck className="text-sm" />
                          </motion.div>
                        ) : (
                          info.label !== 'Location' ? (
                            <FaCopy className="text-amber-600 text-sm" />
                          ) : (
                            <BsStars className="text-amber-600 text-sm" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ 
                delay: 0.7, 
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 80
              }}
              className="relative"
            >
              {/* Enhanced Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-lg opacity-40 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-300/40 to-orange-400/40 rounded-3xl blur-xl opacity-30"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-200/20 to-red-300/20 rounded-3xl blur-2xl opacity-20"></div>
              
              <form onSubmit={handleSubmit} className="relative bg-gradient-to-br from-white to-amber-50 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border-2 border-amber-200 space-y-4 sm:space-y-6">
                {/* Form Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <FaPaperPlane className="text-white text-lg sm:text-2xl" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
                  >
                    Send Message
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.0, duration: 0.6 }}
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    Drop me a line and let's make magic happen
                  </motion.p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="relative"
                  >
                    <motion.input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => {
                        setFocusedField('name');
                        setIsTypingActive(false); // Stop typing animation when user focuses
                      }}
                      onBlur={() => setFocusedField('')}
                      placeholder={!isTypingActive || focusedField === 'name' || formData.name ? "Your Name" : ""}
                      required
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-amber-200 rounded-2xl text-black placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 shadow-lg hover:shadow-xl peer"
                    />
                    {/* Typing Animation Overlay */}
                    {isTypingActive && !focusedField && !formData.name && (
                      <div className="absolute left-4 sm:left-6 top-3 sm:top-4 pointer-events-none text-gray-500">
                        <TypingPlaceholder 
                          text="Your Name" 
                          isActive={isTypingActive}
                          delay={0}
                        />
                      </div>
                    )}
                    
                    {/* Floating Label Effect */}
                    <motion.div
                      className="absolute left-4 sm:left-6 top-3 sm:top-4 text-gray-500 pointer-events-none transition-all duration-300"
                      animate={{
                        y: formData.name || focusedField === 'name' ? -35 : 0,
                        x: formData.name || focusedField === 'name' ? -10 : 0,
                        scale: formData.name || focusedField === 'name' ? 0.85 : 1,
                        color: focusedField === 'name' ? '#F59E0B' : '#6B7280',
                        opacity: isTypingActive && !focusedField && !formData.name ? 0 : 1
                      }}
                    >
                      {formData.name || focusedField === 'name' ? '' : (isTypingActive ? '' : 'Your Name')}
                    </motion.div>
                    {/* Input Icon */}
                    <motion.div
                      className="absolute right-3 sm:right-4 top-3 sm:top-4 text-amber-400 opacity-0"
                      animate={{ opacity: focusedField === 'name' ? 1 : 0 }}
                    >
                      <HiSparkles className="text-xl" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="relative"
                  >
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => {
                        setFocusedField('email');
                        setIsTypingActive(false);
                      }}
                      onBlur={() => setFocusedField('')}
                      placeholder={!isTypingActive || focusedField === 'email' || formData.email ? "Your Email" : ""}
                      required
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-amber-200 rounded-2xl text-black placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    />
                    
                    {/* Typing Animation Overlay */}
                    {isTypingActive && !focusedField && !formData.email && (
                      <div className="absolute left-4 sm:left-6 top-3 sm:top-4 pointer-events-none text-gray-500">
                        <TypingPlaceholder 
                          text="Your Email" 
                          isActive={isTypingActive}
                          delay={1500}
                        />
                      </div>
                    )}
                    
                    {/* Input Icon */}
                    <motion.div
                      className="absolute right-3 sm:right-4 top-3 sm:top-4 text-amber-400 opacity-0"
                      animate={{ opacity: focusedField === 'email' ? 1 : 0 }}
                    >
                      <HiSparkles className="text-xl" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.3, duration: 0.6 }}
                    className="relative"
                  >
                    <motion.input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => {
                        setFocusedField('subject');
                        setIsTypingActive(false);
                      }}
                      onBlur={() => setFocusedField('')}
                      placeholder={!isTypingActive || focusedField === 'subject' || formData.subject ? "Subject" : ""}
                      required
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-amber-200 rounded-2xl text-black placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    />
                    
                    {/* Typing Animation Overlay */}
                    {isTypingActive && !focusedField && !formData.subject && (
                      <div className="absolute left-4 sm:left-6 top-3 sm:top-4 pointer-events-none text-gray-500">
                        <TypingPlaceholder 
                          text="Subject" 
                          isActive={isTypingActive}
                          delay={3000}
                        />
                      </div>
                    )}
                    
                    {/* Input Icon */}
                    <motion.div
                      className="absolute right-3 sm:right-4 top-3 sm:top-4 text-amber-400 opacity-0"
                      animate={{ opacity: focusedField === 'subject' ? 1 : 0 }}
                    >
                      <HiSparkles className="text-xl" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="relative"
                  >
                    <motion.textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Your Message"
                      rows="6"
                      required
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-amber-200 rounded-2xl text-black placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 resize-none shadow-lg hover:shadow-xl"
                    ></motion.textarea>
                    {/* Character Counter */}
                    <motion.div
                      className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm font-medium"
                      animate={{
                        color: charCount > 500 ? '#EF4444' : charCount > 400 ? '#F59E0B' : '#10B981'
                      }}
                    >
                      {charCount}/500
                    </motion.div>
                    {/* Typing Animation Overlay */}
                    {isTypingActive && !focusedField && !formData.message && (
                      <div className="absolute left-4 sm:left-6 top-3 sm:top-4 pointer-events-none text-gray-500">
                        <TypingPlaceholder 
                          text="Your Message..." 
                          isActive={isTypingActive}
                          delay={4500}
                        />
                      </div>
                    )}
                    
                    {/* Floating Label Effect */}
                    <motion.div
                      className="absolute left-4 sm:left-6 top-3 sm:top-4 text-gray-500 pointer-events-none transition-all duration-300"
                      animate={{
                        y: formData.message || focusedField === 'message' ? -35 : 0,
                        x: formData.message || focusedField === 'message' ? -10 : 0,
                        scale: formData.message || focusedField === 'message' ? 0.85 : 1,
                        color: focusedField === 'message' ? '#F59E0B' : '#6B7280',
                        opacity: isTypingActive && !focusedField && !formData.message ? 0 : 1
                      }}
                    >
                      {formData.message || focusedField === 'message' ? '' : (isTypingActive ? '' : 'Your Message')}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced Submit Button */}
                <motion.div className="relative">
                  <motion.button
                    type="submit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'sending'}
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden group"
                  >
                    {/* Button Background Animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ borderRadius: '1rem' }}
                    />
                    
                    {/* Button Content */}
                    <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                      {status === 'sending' ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="rounded-full h-5 w-5 border-b-2 border-white"
                          />
                          <span>Sending...</span>
                          <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-lg"
                          >
                            ✈️
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ x: 5, rotate: 15 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaPaperPlane className="text-lg" />
                          </motion.div>
                          <span>Send Message</span>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <BsArrowRight className="text-lg" />
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.button>
                  
                  {/* Progress Bar */}
                  {status === 'sending' && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  )}
                </motion.div>

              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </section>
    </>
  );
};

export default Contact;
