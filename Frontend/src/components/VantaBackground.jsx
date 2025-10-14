import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const VantaBackground = ({ 
  effect = 'NET',
  children,
  className = '',
  cardRef = null
}) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [attractPoint, setAttractPoint] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x3b82f6, // primary blue color
          backgroundColor: 0x0f172a, // dark background
          points: 12.00,
          maxDistance: 28.00,
          spacing: 16.00,
          showDots: true
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Handle card hover effect
  useEffect(() => {
    if (!cardRef || !vantaEffect) return;

    const handleMouseEnter = (e) => {
      const rect = e.target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setAttractPoint({ x: centerX, y: centerY });
      
      // Simulate mouse position at card center to attract lines
      if (vantaEffect.uniforms) {
        const interval = setInterval(() => {
          if (vantaEffect.uniforms.iMouse) {
            vantaEffect.uniforms.iMouse.value.x = centerX;
            vantaEffect.uniforms.iMouse.value.y = window.innerHeight - centerY;
          }
        }, 16);
        
        cardRef.dataset.intervalId = interval;
      }
    };

    const handleMouseLeave = () => {
      setAttractPoint(null);
      const intervalId = cardRef.dataset.intervalId;
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        delete cardRef.dataset.intervalId;
      }
    };

    cardRef.addEventListener('mouseenter', handleMouseEnter);
    cardRef.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardRef.removeEventListener('mouseenter', handleMouseEnter);
      cardRef.removeEventListener('mouseleave', handleMouseLeave);
      const intervalId = cardRef.dataset.intervalId;
      if (intervalId) {
        clearInterval(parseInt(intervalId));
      }
    };
  }, [cardRef, vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 0 }}
    >
      {children}
    </div>
  );
};

export default VantaBackground;
