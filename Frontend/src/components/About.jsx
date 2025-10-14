import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProfileImage from '../assets/profile1.jpg';
import ProfileCard from './ProfileCard';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const skills = [
    { name: 'AWS' },
    { name: 'Jenkins' },
    { name: 'Docker' },
    { name: 'Kubernetes' },
    { name: 'Node.js' },
    { name: 'Express.js' },
    { name: 'React.js' },
    { name: 'Next.js' },
    { name: 'MongoDB' },
    { name: 'SQL' },
  ];

  const stats = [
    { number: '1+', label: 'Year Of Experience' },
    { number: '10+', label: 'Project Completed' },
    { number: '100%', label: 'Learning Commitment' },
    { number: '10+', label: 'Tech Stacks Mastered' },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid lg:grid-cols-[1fr_1.4fr_0.9fr] gap-8 items-center">
            {/* Left - About Me Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-8 bg-white p-8 rounded-3xl"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-black">
                About Me
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Welcome to my creative space! I'm Jashank, A passionate Full Stack Developer on a mission to transform ideas into seamless digital experiences. From wireframes to pixel-perfect designs, I thrive on bringing innovation and user-centricity to every project.
              </p>

              {/* Skills List */}
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-300/50"></div>
                    <span className="text-gray-800 font-semibold">{skill.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Learn More Button */}
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              > */}
                {/* Learn More */}
              {/* </motion.button> */}
            </motion.div>

            {/* Center - Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center items-center"
            >
              <ProfileCard
                name=""
                title=""
                handle="Jashank06"
                status="Available for Work"
                contactText="Hire Me"
                avatarUrl={ProfileImage}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </motion.div>

            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 space-y-8 shadow-2xl border-2 border-amber-200"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center py-6 border-b-2 border-amber-300/30 last:border-b-0"
                >
                  <h3 className="text-5xl font-bold text-black mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-800 font-medium text-lg">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
