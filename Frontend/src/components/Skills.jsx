import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaReact, FaNodeJs, FaAws, FaDocker, FaGitAlt, FaDatabase, FaPython } from 'react-icons/fa';
import { SiKubernetes, SiMongodb, SiExpress, SiNextdotjs, SiJenkins, SiMysql, SiJavascript, SiTypescript, SiTailwindcss, SiPostgresql } from 'react-icons/si';
import CardSwap, { Card } from './CardSwap';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const skillCategories = [
    {
      category: 'Frontend',
      icon: FaReact,
      color: 'from-amber-400 to-orange-500',
      skills: [
        { name: 'React.js', icon: FaReact, level: 90, desc: 'Component-based UI library' },
        { name: 'Next.js', icon: SiNextdotjs, level: 85, desc: 'React framework for production' },
        { name: 'JavaScript', icon: SiJavascript, level: 95, desc: 'Core web programming language' },
        { name: 'TypeScript', icon: SiTypescript, level: 80, desc: 'Typed JavaScript superset' },
      ]
    },
    {
      category: 'Backend',
      icon: FaNodeJs,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Node.js', icon: FaNodeJs, level: 90, desc: 'JavaScript runtime environment' },
        { name: 'Express.js', icon: SiExpress, level: 88, desc: 'Fast Node.js web framework' },
        { name: 'MongoDB', icon: SiMongodb, level: 85, desc: 'NoSQL database solution' },
        { name: 'SQL', icon: SiMysql, level: 82, desc: 'Relational database management' },
      ]
    },
    {
      category: 'DevOps',
      icon: FaAws,
      color: 'from-yellow-400 to-amber-500',
      skills: [
        { name: 'AWS', icon: FaAws, level: 85, desc: 'Cloud computing platform' },
        { name: 'Docker', icon: FaDocker, level: 88, desc: 'Container platform' },
        { name: 'Kubernetes', icon: SiKubernetes, level: 80, desc: 'Container orchestration' },
        { name: 'Jenkins', icon: SiJenkins, level: 75, desc: 'CI/CD automation server' },
      ]
    },
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-black mb-4"
            >
              Skills & Expertise
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto mb-8"
            >
              Technologies and tools I work with to build amazing digital experiences
            </motion.p>
            <motion.a
              href="/all-skills"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-300"
            >
              View All Skills
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>

          {/* Skills Animated Card Stacks */}
          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div key={category.category} className="relative" style={{ height: '500px' }}>
                <CardSwap
                  width={350}
                  height={450}
                  cardDistance={15}
                  verticalDistance={20}
                  delay={4000 + categoryIndex * 500}
                  pauseOnHover={false}
                  skewAmount={3}
                  easing="elastic"
                >
                  {category.skills.map((skill, skillIndex) => (
                    <Card key={skill.name}>
                      <div className="h-full bg-gradient-to-br from-white to-amber-50 p-6 flex flex-col items-center justify-center text-center">
                        {/* Skill Icon */}
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <skill.icon className="text-4xl text-white" />
                        </div>
                        
                        {/* Skill Name */}
                        <h4 className="text-2xl font-bold text-black mb-2">{skill.name}</h4>
                        
                        {/* Skill Description */}
                        <p className="text-gray-600 text-sm mb-4 px-4">{skill.desc}</p>
                        
                        {/* Progress Circle */}
                        <div className="relative w-24 h-24 mb-3">
                          <svg className="transform -rotate-90" width="96" height="96">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="#f3f4f6"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="url(#gradient-${categoryIndex}-${skillIndex})"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - skill.level / 100)}`}
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id={`gradient-${categoryIndex}-${skillIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#F97316" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-black">{skill.level}%</span>
                          </div>
                        </div>
                        
                        {/* Category Badge */}
                        <span className="px-4 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-semibold">
                          {category.category}
                        </span>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
