import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaUsers, FaCode, FaProjectDiagram, FaStar, FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';

const GitHubProfile = () => {
  const [githubData, setGithubData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate mock contribution data (since GitHub contribution API requires authentication)
  const generateContributionData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);
        
        // Generate random contribution count (0-20)
        const count = Math.floor(Math.random() * 20);
        weekData.push({
          date: date.toISOString().split('T')[0],
          count: count,
          level: count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 10 ? 3 : 4
        });
      }
      weeks.push(weekData);
    }
    
    return {
      weeks,
      totalContributions: weeks.flat().reduce((sum, day) => sum + day.count, 0),
      activeDays: weeks.flat().filter(day => day.count > 0).length,
      maxStreak: 85 // Mock max streak
    };
  };

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        // Fetch user profile data
        const userResponse = await fetch('https://api.github.com/users/Jashank06');
        if (!userResponse.ok) throw new Error('Failed to fetch GitHub user data');
        
        const userData = await userResponse.json();
        setGithubData(userData);

        // Fetch user repositories
        const reposResponse = await fetch('https://api.github.com/users/Jashank06/repos?sort=updated&per_page=6');
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        
        const reposData = await reposResponse.json();
        setRepos(reposData);
        
        // Generate contribution data
        setContributions(generateContributionData());
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500">Error loading GitHub data: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4">
        {/* Left Column - Header and Stats */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
              <FaGithub className="text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">GitHub Profile</h3>
              <p className="text-gray-400">@{githubData.login}</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaUsers className="text-amber-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">{githubData.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaCode className="text-green-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">{githubData.public_repos}</div>
              <div className="text-sm text-gray-400">Repositories</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaProjectDiagram className="text-blue-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">{githubData.public_gists}</div>
              <div className="text-sm text-gray-400">Gists</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaStar className="text-yellow-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">{githubData.starred_url ? '★' : '0'}</div>
              <div className="text-sm text-gray-400">Stars</div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Contribution Graph */}
        <div className="flex-1">
          {contributions && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 h-full">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-amber-400" />
                Contribution Activity
              </h4>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Contribution Stats */}
                <div className="w-full sm:w-32 space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{contributions.totalContributions}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{contributions.activeDays}</div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{contributions.maxStreak}</div>
                    <div className="text-xs text-gray-400">Streak</div>
                  </div>
                </div>

                {/* Contribution Grid */}
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <div className="inline-block">
                      <div className="flex gap-1 mb-1">
                        {contributions.weeks.slice(0, 52).map((week, weekIndex) => (
                          <div key={weekIndex} className="grid grid-rows-7 gap-1">
                            {week.map((day, dayIndex) => (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-2 h-2 rounded-sm ${
                                  day.level === 0 ? 'bg-gray-700' :
                                  day.level === 1 ? 'bg-green-900' :
                                  day.level === 2 ? 'bg-green-700' :
                                  day.level === 3 ? 'bg-green-500' :
                                  'bg-green-300'
                                }`}
                                title={`${day.count} contributions on ${day.date}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                        <span>Less</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>
                          <div className="w-2 h-2 bg-green-900 rounded-sm"></div>
                          <div className="w-2 h-2 bg-green-700 rounded-sm"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
                        </div>
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Profile Button */}
        <div className="col-span-full">
          <motion.a
            href={githubData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaGithub />
            View Full Profile
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubProfile;
