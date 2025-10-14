import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaMicrophone, 
  FaDownload,
  FaCode,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaProjectDiagram,
  FaUser
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        type: 'bot',
        text: "👋 Hi! I'm Jashy, your AI assistant. How can I help you today?",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('chatbotTheme');
    return saved === 'dark';
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('chatbotAutoSpeak');
    return saved === 'true';
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Save chat history whenever messages change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text to speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Clear chat history
  const clearHistory = () => {
    const confirmClear = window.confirm('Are you sure you want to clear chat history?');
    if (confirmClear) {
      const initialMessage = {
        type: 'bot',
        text: "👋 Hi! I'm Jashy, your AI assistant. How can I help you today?",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
      localStorage.removeItem('chatHistory');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('chatbotTheme', !isDarkTheme ? 'dark' : 'light');
  };

  // Toggle auto-speak
  const toggleAutoSpeak = () => {
    const newValue = !autoSpeak;
    setAutoSpeak(newValue);
    localStorage.setItem('chatbotAutoSpeak', newValue.toString());
    
    // Stop speaking if turning off
    if (!newValue && isSpeaking) {
      stopSpeaking();
    }
  };

  // Quick action buttons
  const quickActions = [
    { icon: FaUser, text: "About", action: "about" },
    { icon: FaCode, text: "Skills", action: "skills" },
    { icon: FaProjectDiagram, text: "Projects", action: "projects" },
    { icon: FaEnvelope, text: "Contact", action: "contact" },
    { icon: FaDownload, text: "Resume", action: "resume" },
    { icon: FaGithub, text: "GitHub", action: "github" },
    { icon: FaLinkedin, text: "LinkedIn", action: "linkedin" },
  ];

  // Knowledge base - Portfolio information
  const knowledgeBase = {
    about: {
      response: "I'm Jashank, a Full Stack Developer with expertise in React, Node.js, and Cloud Technologies. I love building scalable web applications and solving complex problems. I have experience in modern JavaScript frameworks, DevOps, and creating seamless user experiences.",
      suggestions: ["Tell me about your skills", "Show me your projects", "How can I contact you?"]
    },
    skills: {
      response: "My technical skills include:\n\n🎨 Frontend: React.js, Next.js, JavaScript, TypeScript, Tailwind CSS, Framer Motion\n\n⚙️ Backend: Node.js, Express.js, MongoDB, SQL, REST APIs\n\n☁️ DevOps: Docker, Kubernetes, Jenkins, AWS, CI/CD\n\n🛠️ Tools: Git, VS Code, Postman, Figma",
      suggestions: ["View projects", "Download resume", "Contact me"]
    },
    projects: {
      response: "I've worked on several exciting projects:\n\n🚀 E-commerce Platform - Full-stack MERN application\n💼 Portfolio Website - You're looking at it!\n🤖 AI Chatbot - This assistant you're talking to\n📊 Analytics Dashboard - Real-time data visualization\n\nWould you like to know more about any specific project?",
      suggestions: ["Tell me about the e-commerce project", "What technologies did you use?", "View live demos"]
    },
    contact: {
      response: "📧 Email: jaykumar0305@gmail.com\n📱 Phone: +91 99117 52744\n📍 Location: Faridabad, India\n\nFeel free to reach out through the contact form or connect on social media!",
      suggestions: ["Go to contact form", "Visit GitHub", "Connect on LinkedIn"]
    },
    resume: {
      response: "📄 You can download my resume to learn more about my experience, education, and achievements. Would you like me to prepare it for you?",
      suggestions: ["Download PDF", "View online", "Tell me about your experience"]
    },
    github: {
      response: "🐙 Check out my GitHub profile to see my open-source contributions and projects:\n\nGitHub: github.com/jashank2003\n\nI regularly push code and contribute to interesting projects!",
      suggestions: ["View all projects", "What's your latest project?", "Tell me about your skills"]
    },
    experience: {
      response: "💼 I have experience in:\n\n• Full Stack Development (2+ years)\n• Building scalable web applications\n• RESTful API development\n• Database design and optimization\n• Cloud deployment and DevOps\n• Agile development methodologies",
      suggestions: ["Tell me about your projects", "What technologies do you use?", "View resume"]
    },
    education: {
      response: "🎓 Educational Background:\n\n• Bachelor's in Computer Science\n• Certifications in AWS, Docker, and React\n• Continuous learner - always exploring new technologies!",
      suggestions: ["What skills do you have?", "Show me your projects", "Any achievements?"]
    }
  };

  // AI Response Generator with Backend Integration
  const generateResponse = async (input) => {
    // Detect if running on localhost or production
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = process.env.REACT_APP_API_URL || (isLocalhost ? 'http://localhost:5001' : 'http://16.16.166.174:5000');
    
    try {
      // Call backend AI API
      const response = await fetch(`${API_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.slice(-6) // Send last 6 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          response: data.response,
          suggestions: data.suggestions || []
        };
      }
    } catch (error) {
      console.error('AI API Error:', error);
      // Fallback to local knowledge base if API fails
    }

    // Fallback: Local knowledge base
    const lowerInput = input.toLowerCase();
    
    // Exact matches
    if (lowerInput.includes('about') || lowerInput.includes('who are you') || lowerInput.includes('introduce')) {
      return knowledgeBase.about;
    }
    if (lowerInput.includes('skill') || lowerInput.includes('technology') || lowerInput.includes('tech stack')) {
      return knowledgeBase.skills;
    }
    if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('portfolio')) {
      return knowledgeBase.projects;
    }
    if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone') || lowerInput.includes('reach')) {
      return knowledgeBase.contact;
    }
    if (lowerInput.includes('resume') || lowerInput.includes('cv') || lowerInput.includes('download')) {
      return knowledgeBase.resume;
    }
    if (lowerInput.includes('github') || lowerInput.includes('code') || lowerInput.includes('repository')) {
      return knowledgeBase.github;
    }
    if (lowerInput.includes('experience') || lowerInput.includes('worked')) {
      return knowledgeBase.experience;
    }
    if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('degree')) {
      return knowledgeBase.education;
    }
    
    // Greetings
    if (lowerInput.match(/^(hi|hello|hey|greetings)/)) {
      return {
        response: "Hello! 👋 How can I assist you today? Feel free to ask me anything about Jashank's skills, projects, or experience!",
        suggestions: ["Tell me about Jashank", "Show me projects", "What are your skills?"]
      };
    }
    
    // Thanks
    if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      return {
        response: "You're welcome! 😊 Is there anything else you'd like to know?",
        suggestions: ["View projects", "Contact information", "Download resume"]
      };
    }
    
    // Help
    if (lowerInput.includes('help')) {
      return {
        response: "I can help you with:\n\n• Information about Jashank\n• Technical skills and expertise\n• Project portfolio\n• Contact details\n• Resume download\n• GitHub and social links\n\nJust ask me anything!",
        suggestions: ["About Jashank", "Skills", "Projects", "Contact"]
      };
    }
    
    // Default response
    return {
      response: "I'm not sure I understand. I can tell you about Jashank's skills, projects, experience, or how to get in touch. What would you like to know?",
      suggestions: ["Tell me about Jashank", "Show skills", "View projects", "Contact info"]
    };
  };

  // Handle quick actions with real functionality
  const handleQuickAction = (action) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    switch(action) {
      case 'github':
        // Add user message
        const githubUserMsg = {
          type: 'user',
          text: 'Show me your GitHub',
          time: currentTime
        };
        setMessages(prev => [...prev, githubUserMsg]);
        
        // Open GitHub profile in new tab
        window.open('https://github.com/jashank2003', '_blank');
        
        // Add bot message
        setTimeout(() => {
          const githubMessage = {
            type: 'bot',
            text: '👨‍💻 Opening GitHub profile in new tab! Check out my open-source contributions and projects.\n\nGitHub: github.com/jashank2003',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, githubMessage]);
        }, 300);
        break;
        
      case 'linkedin':
        // Add user message
        const linkedinUserMsg = {
          type: 'user',
          text: 'Connect on LinkedIn',
          time: currentTime
        };
        setMessages(prev => [...prev, linkedinUserMsg]);
        
        // Open LinkedIn profile in new tab
        window.open('https://www.linkedin.com/in/jashank-308b83247', '_blank');
        
        // Add bot message
        setTimeout(() => {
          const linkedinMessage = {
            type: 'bot',
            text: '👤 Opening LinkedIn profile in new tab! Let\'s connect professionally!\n\nLinkedIn: linkedin.com/in/jashank-308b83247',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, linkedinMessage]);
        }, 300);
        break;
        
      case 'resume':
        // Add user message
        const resumeUserMsg = {
          type: 'user',
          text: 'Download Resume',
          time: currentTime
        };
        setMessages(prev => [...prev, resumeUserMsg]);
        
        // Trigger resume download
        const resumeLink = document.createElement('a');
        resumeLink.href = '/assets/Resume.pdf';
        resumeLink.download = 'Jashank_Resume.pdf';
        resumeLink.click();
        
        // Add bot message
        setTimeout(() => {
          const resumeMessage = {
            type: 'bot',
            text: '📄 Resume download started! \n\nYou can also view my experience and achievements in the contact section of the portfolio.',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, resumeMessage]);
        }, 300);
        break;
        
      case 'contact':
        // Add user message
        const contactUserMsg = {
          type: 'user',
          text: 'How can I contact you?',
          time: currentTime
        };
        setMessages(prev => [...prev, contactUserMsg]);
        
        // Show contact details
        setTimeout(() => {
          const contactMessage = {
            type: 'bot',
            text: '📧 Here\'s how you can reach me:\n\n📧 Email: jaykumar0305@gmail.com\n📱 Phone: +91 99117 52744\n📍 Location: Faridabad, India\n\n🔗 Social Links:\n• GitHub: github.com/jashank2003\n• LinkedIn: Connect with me!\n\nFeel free to reach out through the contact form on the website!',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, contactMessage]);
          setSuggestions(['Go to contact form', 'Visit GitHub', 'Download resume']);
        }, 300);
        break;
        
      case 'skills':
        // Add user message
        const skillsUserMsg = {
          type: 'user',
          text: 'What are your skills?',
          time: currentTime
        };
        setMessages(prev => [...prev, skillsUserMsg]);
        
        // Show skills
        setTimeout(() => {
          const skillsMessage = {
            type: 'bot',
            text: 'My technical skills include:\n\n🎨 Frontend: React.js, Next.js, JavaScript, TypeScript, Tailwind CSS, Framer Motion\n\n⚙️ Backend: Node.js, Express.js, MongoDB, SQL, REST APIs\n\n☁️ DevOps: Docker, Kubernetes, Jenkins, AWS, CI/CD\n\n🛠️ Tools: Git, VS Code, Postman, Figma',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, skillsMessage]);
          setSuggestions(['View projects', 'Download resume', 'Contact me']);
        }, 300);
        break;
        
      case 'projects':
        // Add user message
        const projectsUserMsg = {
          type: 'user',
          text: 'Show me your projects',
          time: currentTime
        };
        setMessages(prev => [...prev, projectsUserMsg]);
        
        // Show projects
        setTimeout(() => {
          const projectsMessage = {
            type: 'bot',
            text: 'I\'ve worked on several exciting projects:\n\n🎓 E-Learning Platform (College Project)\nA comprehensive platform with course management, interactive lessons, student progress tracking, and real-time assessments. Deployed on AWS.\nTech: React, Node.js, Express, MongoDB, Jenkins, Docker, AWS\nLive: http://13.60.241.214/\n\n💇 Salon Management System (Client Project)\nFull-featured system with appointment booking, service management, customer database, billing, and analytics dashboard.\nTech: React, Tailwind, Node.js, MongoDB, Jenkins, Docker, AWS\nLive: http://mxparlour.dpdns.org\n\n💼 Personal Portfolio (You\'re here!)\nModern responsive portfolio with smooth animations, interactive UI, and AI chatbot. Features voice input/output and smart conversation.\nTech: React, Tailwind, Node.js, Framer Motion, Jenkins, Docker\n\nWould you like to know more about any specific project?',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, projectsMessage]);
          setSuggestions(['Visit E-Learning platform', 'Check Salon website', 'View GitHub']);
        }, 300);
        break;
        
      case 'about':
        // Add user message
        const aboutUserMsg = {
          type: 'user',
          text: 'Tell me about Jashank',
          time: currentTime
        };
        setMessages(prev => [...prev, aboutUserMsg]);
        
        // Show about info
        setTimeout(() => {
          const aboutMessage = {
            type: 'bot',
            text: 'I\'m Jashank, a Full Stack Developer with expertise in React, Node.js, and Cloud Technologies. I love building scalable web applications and solving complex problems. I have experience in modern JavaScript frameworks, DevOps, and creating seamless user experiences.',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aboutMessage]);
          setSuggestions(['Tell me about your skills', 'Show me your projects', 'How can I contact you?']);
        }, 300);
        break;
        
      default:
        // Fallback to sending message
        const actionMap = {
          about: "Tell me about Jashank",
          skills: "What are your skills?",
          projects: "Show me your projects",
          contact: "How can I contact you?",
          resume: "I want to download your resume",
          github: "Show me your GitHub"
        };
        
        const message = actionMap[action];
        if (message) {
          handleSendMessage(message);
        }
    }
  };

  // Handle send message with async AI response
  const handleSendMessage = async (customMessage = null) => {
    const message = customMessage || inputValue.trim();
    
    if (!message) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get AI response
    try {
      const { response, suggestions: newSuggestions } = await generateResponse(message);
      
      const botMessage = {
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setSuggestions(newSuggestions || []);
      
      // Auto-speak bot response if enabled
      if (autoSpeak) {
        speakText(response);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        type: 'bot',
        text: "I'm experiencing some technical difficulties. Please try again or use the quick action buttons!",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle suggestion click with smart actions
  const handleSuggestionClick = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Special actions for certain suggestions
    if (lowerSuggestion.includes('github') || lowerSuggestion.includes('visit github')) {
      handleQuickAction('github');
    } else if (lowerSuggestion.includes('e-learning') || lowerSuggestion.includes('elearning')) {
      // Add user message
      const userMsg = {
        type: 'user',
        text: suggestion,
        time: currentTime
      };
      setMessages(prev => [...prev, userMsg]);
      
      // Open E-Learning platform
      window.open('http://13.60.241.214/', '_blank');
      
      setTimeout(() => {
        const botMsg = {
          type: 'bot',
          text: '🎓 Opening E-Learning Platform in new tab!\n\nThis is a comprehensive educational platform with course management, interactive lessons, and student progress tracking. Built with React, Node.js, MongoDB, and deployed on AWS.\n\nLive: http://13.60.241.214/',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 300);
    } else if (lowerSuggestion.includes('salon') || lowerSuggestion.includes('mxparlour')) {
      // Add user message
      const userMsg = {
        type: 'user',
        text: suggestion,
        time: currentTime
      };
      setMessages(prev => [...prev, userMsg]);
      
      // Open Salon website
      window.open('http://mxparlour.dpdns.org', '_blank');
      
      setTimeout(() => {
        const botMsg = {
          type: 'bot',
          text: '💇 Opening Salon Management System in new tab!\n\nThis is a full-featured client project with appointment booking, service management, customer database, and billing system. Built with React, Tailwind, Node.js, and MongoDB.\n\nLive: http://mxparlour.dpdns.org',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 300);
    } else if (lowerSuggestion.includes('download') || lowerSuggestion.includes('resume')) {
      handleQuickAction('resume');
    } else if (lowerSuggestion.includes('contact form')) {
      // Add user message
      const userMsg = {
        type: 'user',
        text: suggestion,
        time: currentTime
      };
      setMessages(prev => [...prev, userMsg]);
      
      // Scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false); // Close chatbot
        
        setTimeout(() => {
          const scrollMessage = {
            type: 'bot',
            text: '✔️ Scrolling to contact form! Fill it out to get in touch with me.',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, scrollMessage]);
        }, 300);
      } else {
        handleSendMessage(suggestion);
      }
    } else if (lowerSuggestion.includes('view projects')) {
      handleQuickAction('projects');
    } else if (lowerSuggestion.includes('skills')) {
      handleQuickAction('skills');
    } else if (lowerSuggestion.includes('contact me') || lowerSuggestion.includes('contact info')) {
      handleQuickAction('contact');
    } else {
      // Default: send as message
      handleSendMessage(suggestion);
    }
    
    setSuggestions([]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Chatbot Button with Name Label */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Name Label and Quote - Shows when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col items-end gap-2"
            >
              {/* Quote Bubble */}
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white px-4 py-2 rounded-2xl rounded-br-sm shadow-xl border-2 border-amber-200 max-w-xs"
              >
                <p className="text-gray-800 text-sm font-medium">
                  👋 How can I help you?
                </p>
                {/* Small triangle pointer */}
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r-2 border-b-2 border-amber-200 transform rotate-45"></div>
              </motion.div>
              
              {/* Name Badge */}
              <motion.div
                whileHover={{ scale: 1.05, x: -5 }}
                className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 rounded-full shadow-lg"
              >
                <p className="text-white font-bold text-sm flex items-center gap-2">
                  <FaRobot className="text-base" />
                  Jashy
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-2xl flex items-center justify-center group hover:shadow-amber-500/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="robot"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaRobot className="text-white text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="text-white text-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75"></span>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxWidth: 'calc(100vw - 3rem)' }}
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between ${
              isDarkTheme 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
                : 'bg-gradient-to-r from-amber-400 to-orange-500'
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <FaRobot className="text-orange-500 text-xl" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Jashy</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Your AI Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice Output Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleAutoSpeak}
                  className={`p-2 rounded-lg transition-colors ${
                    autoSpeak
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                  title={autoSpeak ? 'Voice Output: ON' : 'Voice Output: OFF'}
                >
                  {autoSpeak ? '🔊' : '🔇'}
                </motion.button>
                
                {/* Stop Speaking (only show when speaking) */}
                {isSpeaking && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={stopSpeaking}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors animate-pulse"
                    title="Stop Speaking"
                  >
                    ⏸️
                  </motion.button>
                )}
                
                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  title={isDarkTheme ? 'Light Mode' : 'Dark Mode'}
                >
                  {isDarkTheme ? '☀️' : '🌙'}
                </motion.button>
                
                {/* Clear History */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearHistory}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  title="Clear Chat History"
                >
                  🗑️
                </motion.button>
                
                {/* Close */}
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FaTimes />
                </motion.button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-3 border-b overflow-x-auto ${
              isDarkTheme
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex gap-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-gray-700 hover:text-amber-600 border border-gray-200"
                  >
                    <action.icon className="text-amber-500" />
                    {action.text}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? isDarkTheme
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                        : isDarkTheme
                          ? 'bg-gray-800 text-gray-100 shadow-md border border-gray-700'
                          : 'bg-white text-gray-800 shadow-md'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mt-4"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 bg-white text-gray-700 rounded-lg text-sm border border-gray-200 hover:border-amber-400 hover:text-amber-600 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <HiSparkles className="text-amber-500" />
                      {suggestion}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              isDarkTheme
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isListening ? "Listening..." : "Type or speak your message..."}
                  className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDarkTheme
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-amber-500'
                  }`}
                />
                
                {/* Voice Input Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoiceInput}
                  className={`px-4 py-3 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : isDarkTheme
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Voice Input"
                >
                  <FaMicrophone />
                </motion.button>
                
                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className={`px-4 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow ${
                    isDarkTheme
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gradient-to-r from-amber-400 to-orange-500'
                  }`}
                >
                  <FaPaperPlane />
                </motion.button>
              </div>
              <p className={`text-xs mt-2 text-center flex items-center justify-center gap-2 ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <HiSparkles className={isDarkTheme ? 'text-blue-400' : 'text-amber-500'} />
                {isListening && '🎤 Listening... '}
                {isSpeaking && '🔊 Speaking... '}
                {!isListening && !isSpeaking && (
                  <span>
                    Powered by Smart AI {autoSpeak && '• 🔊 Voice ON'}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
