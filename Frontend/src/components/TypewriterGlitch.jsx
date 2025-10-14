import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterGlitch = ({ text, delay = 0, speed = 80, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (currentIndex === 0) {
      const startTimeout = setTimeout(() => {
        setCurrentIndex(1);
      }, delay);
      return () => clearTimeout(startTimeout);
    }

    if (currentIndex > 0 && currentIndex <= text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex));
        setCurrentIndex(currentIndex + 1);

        // Random glitch effect while typing
        if (Math.random() > 0.85) {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 50);
        }
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, speed, text]);

  return (
    <span 
      className={`${className} ${isGlitching ? 'glitch-text' : ''}`}
      style={{
        display: 'inline-block',
        position: 'relative',
      }}
    >
      {displayText}
      {currentIndex <= text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block', marginLeft: '2px' }}
        >
          |
        </motion.span>
      )}
      
      <style jsx>{`
        .glitch-text {
          animation: glitch 0.3s ease-in-out;
        }
        
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </span>
  );
};

export default TypewriterGlitch;
