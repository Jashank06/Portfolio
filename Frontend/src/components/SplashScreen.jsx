import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Video ke end hone ke baad splash screen hide ho jayega
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        onFinish();
      }, 500); // Fade out animation ke liye wait
    }, 3000); // 3 seconds (video duration ke according adjust kar sakte ho)

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-white overflow-hidden flex items-center justify-center"
        >
          {/* Logo Video - Responsive Centered */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full h-full max-w-4xl max-h-4xl flex items-center justify-center px-4 sm:px-6 lg:px-8"
          >
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-auto max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] object-contain"
              onEnded={() => {
                setShowSplash(false);
                setTimeout(() => {
                  onFinish();
                }, 500);
              }}
            >
              <source src="/Logo.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Circular Loader - Responsive Bottom Position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-10 sm:bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
            >
              <div className="absolute inset-0 border-3 sm:border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-3 sm:border-4 border-transparent border-t-amber-400 border-r-amber-400 rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
