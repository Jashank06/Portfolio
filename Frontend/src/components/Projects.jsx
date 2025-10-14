import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub, FaCode } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';

// Import project images
import Elearning1 from '../assets/E_learning1.png';
import Elearning2 from '../assets/E_learning2.png';
import Elearning3 from '../assets/E_learning3.png';
import Salon1 from '../assets/Salon1.png';
import Salon2 from '../assets/Salon2.png';
import Salon3 from '../assets/Salon3.png';
import Portfolio1 from '../assets/Portfolio1.png';
import Portfolio2 from '../assets/Portfolio2.png';
import Portfolio3 from '../assets/Portfolio3.png';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState([0, 0, 0]);

  const projects = useMemo(() => [
    {
      title: 'E-Learning Platform',
      type: 'College Project',
      description: 'A comprehensive e-learning platform developed for college with features including course management, interactive lessons, student progress tracking, and real-time assessments. Built with modern web technologies and deployed on AWS.',
      images: [Elearning1, Elearning2, Elearning3],
      tags: ['React', 'Tailwind', 'Node.js', 'Express.js', 'MongoDB', 'Jenkins', 'Docker', 'AWS', 'Git'],
      github: 'https://github.com/Jashank06/Edutainment.git',
      live: 'http://13.60.241.214/',
    },
    {
      title: 'Salon Management System',
      type: 'Client Project',
      description: 'A full-featured salon management system developed for a client with appointment booking, service management, customer database, billing system, and analytics dashboard. Includes automated notifications and payment integration.',
      images: [Salon1, Salon2, Salon3],
      tags: ['React', 'Tailwind', 'PostCSS', 'Node.js', 'Express.js', 'MongoDB', 'Jenkins', 'Docker', 'AWS', 'Git'],
      github: 'https://github.com/Jashank06/Freelancing_Project.git',
      live: 'http://mxparlour.dpdns.org',
    },
    {
      title: 'Personal Portfolio',
      type: 'Personal Project',
      description: 'A modern, responsive portfolio website showcasing my work and skills. Features smooth animations, interactive UI components, dark mode support, and optimized performance. Built with cutting-edge web technologies.',
      images: [Portfolio1, Portfolio2, Portfolio3],
      tags: ['React', 'Tailwind', 'PostCSS', 'Node.js', 'Jenkins', 'Docker', 'AWS', 'Git'],
      github: 'https://github.com/Jashank06/Portfolio.git',
      live: '#home',
    },
  ], []);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndices => 
        prevIndices.map((index, projectIndex) => 
          (index + 1) % projects[projectIndex].images.length
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [projects]);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
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
              <FaCode className="text-amber-600 text-sm sm:text-base" />
              <span className="text-amber-700 font-semibold text-xs sm:text-sm">MY PORTFOLIO</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4"
            >
              Featured Projects
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
            >
              Showcasing my best work in web development and design
            </motion.p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-12 lg:space-y-16">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 100 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  delay: 0.5 + index * 0.2, 
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="group relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  {/* Project Image with 3D Effect and Auto Slider */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      rotateY: index % 2 === 0 ? 5 : -5,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                    style={{ perspective: '1000px' }}
                  >
                    {/* Glowing Border Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                    
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ transformStyle: 'preserve-3d', aspectRatio: '16/10' }}>
                      {/* Image Slider with AnimatePresence */}
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={`${project.title}-${currentImageIndex[index]}`}
                          src={project.images[currentImageIndex[index]]}
                          alt={`${project.title} - Image ${currentImageIndex[index] + 1}`}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.7, ease: 'easeInOut' }}
                          className="w-full h-full object-cover absolute inset-0"
                        />
                      </AnimatePresence>
                      
                      {/* Image Counter Dots */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {project.images.map((_, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() => {
                              setCurrentImageIndex(prev => {
                                const newIndices = [...prev];
                                newIndices[index] = imgIndex;
                                return newIndices;
                              });
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              currentImageIndex[index] === imgIndex 
                                ? 'bg-amber-400 w-8' 
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Action Buttons Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
                        <motion.a
                          href={project.live}
                          target={project.live === '#home' ? '_self' : '_blank'}
                          rel={project.live === '#home' ? '' : 'noopener noreferrer'}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-amber-500/50 transition-shadow"
                        >
                          <FaExternalLinkAlt size={16} className="sm:text-xl" />
                        </motion.a>
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-amber-500/50 transition-shadow"
                        >
                          <FaGithub size={18} className="sm:text-2xl" />
                        </motion.a>
                      </div>
                      
                      {/* Decorative Corner Element */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                        <BsStars className="text-white text-lg sm:text-xl" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Project Content */}
                  <motion.div
                    className={`space-y-4 lg:space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                  >
                    {/* Project Type Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full"
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-amber-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                        {project.type}
                      </span>
                    </motion.div>

                    {/* Project Title */}
                    <motion.h3
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.7 + index * 0.2, duration: 0.6 }}
                      className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300"
                    >
                      {project.title}
                    </motion.h3>

                    {/* Project Description */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                      className="relative p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 group-hover:border-amber-400 transition-colors duration-300 shadow-lg"
                    >
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                        {project.description}
                      </p>
                      
                      {/* Decorative Glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
                    </motion.div>

                    {/* Tech Tags */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 + index * 0.2, duration: 0.6 }}
                      className="flex flex-wrap gap-2 sm:gap-3"
                    >
                      {project.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 1 + index * 0.2 + tagIndex * 0.1, duration: 0.4 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-amber-200 rounded-full text-xs sm:text-sm font-semibold text-amber-700 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-md cursor-pointer"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Action Links */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1.1 + index * 0.2, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
                    >
                      <motion.a
                        href={project.live}
                        target={project.live === '#home' ? '_self' : '_blank'}
                        rel={project.live === '#home' ? '' : 'noopener noreferrer'}
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-300 text-sm sm:text-base"
                      >
                        <FaExternalLinkAlt className="text-sm sm:text-base" />
                        <span>View Live</span>
                      </motion.a>
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-amber-400 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all duration-300 shadow-lg text-sm sm:text-base"
                      >
                        <FaGithub className="text-sm sm:text-base" />
                        <span>Source Code</span>
                      </motion.a>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Project Number Watermark */}
                <div className="absolute -top-6 lg:-top-8 -right-2 lg:-right-4 text-[100px] lg:text-[150px] font-bold text-amber-100 opacity-50 pointer-events-none select-none">
                  0{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
