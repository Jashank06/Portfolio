import React, { useEffect, useRef } from 'react';

const MatrixRain = ({ cardRef = null }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Coding symbols - brackets, operators, etc.
    const characters = '{}[]()<>/\\|;:.,!@#$%^&*-+=?`~01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    
    // Array of drops - one per column
    const drops = Array(Math.floor(columns)).fill(1);
    
    // Track mouse/card position for interactive effect
    let attractX = null;
    let attractY = null;

    // Draw function
    const draw = () => {
      // Semi-transparent black - creates trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text style
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Color gradient - brighter at top, dimmer at bottom
        let opacity = 1;
        if (drops[i] > 10) {
          opacity = Math.max(0.3, 1 - (drops[i] - 10) / 20);
        }

        // Interactive effect - glow near card
        let glowIntensity = 0;
        if (attractX !== null && attractY !== null) {
          const distance = Math.sqrt(
            Math.pow(x - attractX, 2) + Math.pow(y - attractY, 2)
          );
          glowIntensity = Math.max(0, 1 - distance / 300);
        }

        // Set color with glow effect
        if (glowIntensity > 0.3) {
          // Near card - bright blue/cyan glow
          ctx.fillStyle = `rgba(96, 165, 250, ${opacity + glowIntensity * 0.5})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#60a5fa';
        } else {
          // Normal - primary blue with green tint
          ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#3b82f6';
        }

        // Draw the character
        ctx.fillText(char, x, y);

        // Reset drop to top randomly or when it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Handle card hover effect
    const handleMouseMove = (e) => {
      attractX = e.clientX;
      attractY = e.clientY;
    };

    const handleCardHover = () => {
      if (cardRef) {
        const rect = cardRef.getBoundingClientRect();
        attractX = rect.left + rect.width / 2;
        attractY = rect.top + rect.height / 2;
      }
    };

    const handleCardLeave = () => {
      attractX = null;
      attractY = null;
    };

    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    
    if (cardRef) {
      cardRef.addEventListener('mouseenter', handleCardHover);
      cardRef.addEventListener('mouseleave', handleCardLeave);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (cardRef) {
        cardRef.removeEventListener('mouseenter', handleCardHover);
        cardRef.removeEventListener('mouseleave', handleCardLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cardRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        zIndex: 0,
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)'
      }}
    />
  );
};

export default MatrixRain;
