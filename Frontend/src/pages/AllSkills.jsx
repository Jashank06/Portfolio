import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaAws, FaDocker, FaPython, FaGitAlt } from 'react-icons/fa';
import { SiKubernetes, SiMongodb, SiExpress, SiNextdotjs, SiJenkins, SiMysql, SiJavascript, SiTypescript, SiTailwindcss, SiPostgresql, SiRedis, SiGraphql } from 'react-icons/si';

const AllSkills = () => {
  const allSkillsData = [
    {
      category: 'Frontend Development',
      icon: FaReact,
      color: 'from-amber-400 to-orange-500',
      skills: [
        { name: 'React.js', icon: FaReact, level: 90, desc: 'Component-based UI library' },
        { name: 'Next.js', icon: SiNextdotjs, level: 85, desc: 'React framework for production' },
        { name: 'JavaScript', icon: SiJavascript, level: 95, desc: 'Core web programming language' },
        { name: 'TypeScript', icon: SiTypescript, level: 80, desc: 'Typed JavaScript superset' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, level: 92, desc: 'Utility-first CSS framework' },
      ]
    },
    {
      category: 'Backend Development',
      icon: FaNodeJs,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Node.js', icon: FaNodeJs, level: 90, desc: 'JavaScript runtime environment' },
        { name: 'Express.js', icon: SiExpress, level: 88, desc: 'Fast Node.js web framework' },
        { name: 'Python', icon: FaPython, level: 78, desc: 'High-level programming language' },
        { name: 'GraphQL', icon: SiGraphql, level: 75, desc: 'Query language for APIs' },
      ]
    },
    {
      category: 'Database',
      icon: SiMongodb,
      color: 'from-green-400 to-emerald-500',
      skills: [
        { name: 'MongoDB', icon: SiMongodb, level: 85, desc: 'NoSQL database solution' },
        { name: 'MySQL', icon: SiMysql, level: 82, desc: 'Relational database management' },
        { name: 'PostgreSQL', icon: SiPostgresql, level: 80, desc: 'Advanced SQL database' },
        { name: 'Redis', icon: SiRedis, level: 70, desc: 'In-memory data structure store' },
      ]
    },
    {
      category: 'DevOps & Cloud',
      icon: FaAws,
      color: 'from-yellow-400 to-amber-500',
      skills: [
        { name: 'AWS', icon: FaAws, level: 85, desc: 'Cloud computing platform' },
        { name: 'Docker', icon: FaDocker, level: 88, desc: 'Container platform' },
        { name: 'Kubernetes', icon: SiKubernetes, level: 80, desc: 'Container orchestration' },
        { name: 'Jenkins', icon: SiJenkins, level: 75, desc: 'CI/CD automation server' },
        { name: 'Git', icon: FaGitAlt, level: 93, desc: 'Version control system' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-amber-400 to-orange-500 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </motion.a>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            All Skills & Expertise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/90 max-w-3xl"
          >
            A comprehensive overview of my technical skills, tools, and technologies I work with
          </motion.p>
        </div>
      </motion.div>

      {/* Skills Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {allSkillsData.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.2, duration: 0.8 }}
            className="mb-20 last:mb-0"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-10">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                <category.icon className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-black">{category.category}</h2>
                <div className={`h-1 w-24 bg-gradient-to-r ${category.color} rounded-full mt-2`}></div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gradient-to-br from-white to-amber-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-amber-200/50 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300"
                >
                  {/* Skill Icon & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                      <skill.icon className="text-2xl text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black">{skill.name}</h3>
                      <p className="text-sm text-gray-600">{skill.desc}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-semibold">Proficiency</span>
                      <span className="text-amber-600 font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full shadow-md`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-amber-400 to-orange-500 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to work together?</h2>
          <p className="text-xl text-white/90 mb-8">Let's build something amazing!</p>
          <motion.a
            href="/#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get In Touch
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default AllSkills;
