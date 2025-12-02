import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaTrophy, FaFire, FaChartLine, FaExternalLinkAlt, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const LeetCodeProfile = () => {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [submissionCalendar, setSubmissionCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate submission calendar data from LeetCode submissionCalendar
  const generateSubmissionCalendar = (calendarString) => {
    if (!calendarString) return null;
    
    const calendar = JSON.parse(calendarString);
    const submissions = [];
    let totalSubmissions = 0;
    let activeDays = 0;
    
    Object.entries(calendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      submissions.push({
        date: date.toISOString().split('T')[0],
        count: count,
        level: count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4
      });
      totalSubmissions += count;
      if (count > 0) activeDays++;
    });
    
    // Sort by date
    submissions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Group into weeks
    const weeks = [];
    for (let i = 0; i < submissions.length; i += 7) {
      weeks.push(submissions.slice(i, i + 7));
    }
    
    return {
      weeks: weeks.slice(-52), // Last 52 weeks
      totalSubmissions,
      activeDays,
      maxStreak: 85 // Mock max streak
    };
  };

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from our backend proxy first
        try {
          const response = await fetch('/api/leetcode/Jashank_06');
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data) {
              setLeetcodeData(result.data);
              setRecentSubmissions(result.data.recentSubmissionList || []);
              
              if (result.data.matchedUser.submissionCalendar) {
                setSubmissionCalendar(generateSubmissionCalendar(result.data.matchedUser.submissionCalendar));
              }
              
              setLoading(false);
              return;
            }
          }
        } catch (proxyError) {
          console.log('Backend proxy not available');
        }
        
        // If backend fails, use enhanced mock data
        const mockData = {
          matchedUser: {
            username: 'Jashank_06',
            profile: {
              realName: 'Jashank',
              userAvatar: '',
              ranking: 133260 // Use real ranking from API
            },
            submitStats: {
              acSubmissionNum: [
                { difficulty: 'Easy', count: 138 },
                { difficulty: 'Medium', count: 323 },
                { difficulty: 'Hard', count: 97 }
              ]
            },
            problemsSolvedBeatsStats: [
              { difficulty: 'Easy', percentage: 94.44 },
              { difficulty: 'Medium', percentage: 97.35 },
              { difficulty: 'Hard', percentage: 97.1 }
            ],
            submissionCalendar: JSON.stringify(generateMockCalendar())
          },
          recentSubmissionList: [
            {
              title: 'Avoid Flood in The City',
              titleSlug: 'avoid-flood-in-the-city',
              timestamp: Date.now() / 1000 - 86400,
              statusDisplay: 'Accepted',
              lang: 'java'
            },
            {
              title: 'Trapping Rain Water II',
              titleSlug: 'trapping-rain-water-ii',
              timestamp: Date.now() / 1000 - 172800,
              statusDisplay: 'Accepted',
              lang: 'java'
            },
            {
              title: 'Find Triangular Sum of an Array',
              titleSlug: 'find-triangular-sum-of-an-array',
              timestamp: Date.now() / 1000 - 259200,
              statusDisplay: 'Accepted',
              lang: 'java'
            }
          ]
        };

        setLeetcodeData(mockData);
        setRecentSubmissions(mockData.recentSubmissionList);
        setSubmissionCalendar(generateSubmissionCalendar(mockData.matchedUser.submissionCalendar));
        
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeData();
  }, []);

  // Generate mock calendar data
  const generateMockCalendar = () => {
    const calendar = {};
    const today = Date.now() / 1000;
    const oneYearAgo = today - (365 * 24 * 60 * 60);
    
    for (let day = oneYearAgo; day <= today; day += 86400) {
      if (Math.random() > 0.7) {
        calendar[day.toString()] = Math.floor(Math.random() * 5) + 1;
      }
    }
    
    return calendar;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBgColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 border-green-500';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500';
      case 'hard': return 'bg-red-500/20 border-red-500';
      default: return 'bg-gray-500/20 border-gray-500';
    }
  };

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
        <p className="text-red-500">Error loading LeetCode data: {error}</p>
      </div>
    );
  }

  const user = leetcodeData.matchedUser;
  const totalSolved = user.submitStats.acSubmissionNum.reduce((acc, curr) => acc + curr.count, 0);
  const ranking = user.profile.ranking;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-amber-900 to-orange-900 rounded-3xl p-8 text-white relative overflow-hidden"
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
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <FaCode className="text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">LeetCode Profile</h3>
              <p className="text-gray-300">@{user.username}</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaTrophy className="text-yellow-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">#{ranking.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Ranking</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaCheckCircle className="text-green-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalSolved}</div>
              <div className="text-sm text-gray-400">Solved</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaFire className="text-orange-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">{user.submissionCalendar ? Object.keys(JSON.parse(user.submissionCalendar)).length : 0}</div>
              <div className="text-sm text-gray-400">Active Days</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <FaChartLine className="text-blue-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {user.problemsSolvedBeatsStats[0]?.percentage ? 
                  Math.round(user.problemsSolvedBeatsStats[0].percentage) : 0}%
              </div>
              <div className="text-sm text-gray-400">Beat Rate</div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Submission Calendar */}
        <div className="flex-1">
          {submissionCalendar && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 h-full">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-amber-400" />
                Submission Activity
              </h4>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Submission Stats */}
                <div className="w-full sm:w-32 space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{submissionCalendar.totalSubmissions}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{submissionCalendar.activeDays}</div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{submissionCalendar.maxStreak}</div>
                    <div className="text-xs text-gray-400">Streak</div>
                  </div>
                </div>

                {/* Submission Grid */}
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <div className="inline-block">
                      <div className="flex gap-1 mb-1">
                        {submissionCalendar.weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="grid grid-rows-7 gap-1">
                            {week.map((day, dayIndex) => (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-2 h-2 rounded-sm ${
                                  day.level === 0 ? 'bg-gray-700' :
                                  day.level === 1 ? 'bg-orange-900' :
                                  day.level === 2 ? 'bg-orange-700' :
                                  day.level === 3 ? 'bg-orange-500' :
                                  'bg-orange-300'
                                }`}
                                title={`${day.count} submissions on ${day.date}`}
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
                          <div className="w-2 h-2 bg-orange-900 rounded-sm"></div>
                          <div className="w-2 h-2 bg-orange-700 rounded-sm"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-sm"></div>
                          <div className="w-2 h-2 bg-orange-300 rounded-sm"></div>
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

        {/* Recent Submissions */}
        <div className="col-span-full">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaChartLine className="text-amber-400" />
              Recent Submissions
            </h4>
            
            <div className="grid gap-3">
              {recentSubmissions.map((submission, index) => (
                <motion.div
                  key={`${submission.titleSlug}-${submission.timestamp}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-all duration-300 border ${
                    submission.statusDisplay === 'Accepted' ? 
                    'border-green-500/50' : 'border-gray-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-white text-sm">
                          {submission.title}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyBgColor('Easy')}`}>
                          Solved
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className={`flex items-center gap-1 ${
                          submission.statusDisplay === 'Accepted' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {submission.statusDisplay === 'Accepted' ? <FaCheckCircle /> : <FaCode />}
                          {submission.statusDisplay}
                        </span>
                        <span>{submission.lang}</span>
                        <span>{formatTimestamp(submission.timestamp)}</span>
                      </div>
                    </div>
                    
                    <motion.a
                      href={`https://leetcode.com/problems/${submission.titleSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-4 p-2 bg-amber-500 rounded-full hover:bg-amber-600 transition-colors"
                    >
                      <FaExternalLinkAlt className="text-white text-xs" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <div className="col-span-full">
          <motion.a
            href={`https://leetcode.com/u/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaCode />
            View Full Profile
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default LeetCodeProfile;
