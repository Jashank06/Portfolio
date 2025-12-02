import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaCode } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import GitHubProfile from './GitHubProfile';
import LeetCodeProfile from './LeetCodeProfile';

const ProfileStats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="profiles" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-amber-50 relative overflow-hidden">
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
              <span className="text-amber-700 font-semibold text-xs sm:text-sm">CODING PROFILES</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4"
            >
              Live Coding Stats
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
            >
              Real-time data from my GitHub and LeetCode profiles showcasing my coding journey and achievements
            </motion.p>
          </div>

          {/* Profiles Grid */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              <div className="relative">
                <GitHubProfile />
                
                {/* Decorative Corner Element */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg z-20">
                  <FaGithub className="text-white text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              <div className="relative">
                <LeetCodeProfile />
                
                {/* Decorative Corner Element */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg z-20">
                  <BsStars className="text-white text-xl" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-amber-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Data</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                Updated in real-time from official APIs
              </span>
            </div>
          </motion.div>

          {/* Background Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gray-200 rounded-full opacity-20 blur-xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileStats;
