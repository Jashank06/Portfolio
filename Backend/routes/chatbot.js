const express = require('express');
const router = express.Router();

// Free AI Integration using Hugging Face Inference API
// No API key needed for basic models

const HUGGINGFACE_API = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

// Import fetch for Node.js (for older versions)
let fetch;
try {
  fetch = global.fetch || require('node-fetch');
} catch (err) {
  // If node-fetch is not available, fetch will be undefined
  console.log('⚠️ Fetch not available, using fallback responses only');
}

// Fallback knowledge base for offline/error scenarios
const knowledgeBase = {
  about: "I'm Jashank, a Full Stack Developer with expertise in React, Node.js, and Cloud Technologies. I love building scalable web applications and solving complex problems.",
  skills: "My technical skills include:\n\n🎨 Frontend: React.js, Next.js, JavaScript, TypeScript, Tailwind CSS\n⚙️ Backend: Node.js, Express.js, MongoDB, SQL, REST APIs\n☁️ DevOps: Docker, Kubernetes, Jenkins, AWS, CI/CD\n🛠️ Tools: Git, VS Code, Postman, Figma",
  projects: "I've worked on several exciting projects:\n\n🎓 E-Learning Platform (College Project) - Comprehensive platform with course management, interactive lessons, student progress tracking, and real-time assessments. Tech: React, Node.js, Express, MongoDB, Jenkins, Docker, AWS. Live: http://13.60.241.214/\n\n💇 Salon Management System (Client Project) - Full-featured system with appointment booking, service management, customer database, billing, and analytics. Tech: React, Tailwind, Node.js, MongoDB, Jenkins, Docker, AWS. Live: http://mxparlour.dpdns.org\n\n💼 Personal Portfolio - Modern responsive portfolio with smooth animations, interactive UI, and AI chatbot with voice input/output. Tech: React, Tailwind, Node.js, Framer Motion",
  contact: "📧 Email: jaykumar0305@gmail.com\n📱 Phone: +91 99117 52744\n📍 Location: Faridabad, India\n👤 LinkedIn: linkedin.com/in/jashank-308b83247",
  resume: "You can download my resume to learn more about my experience, education, and achievements.",
  github: "Check out my GitHub profile: github.com/jashank2003",
  experience: "I have 2+ years of experience in Full Stack Development, building scalable web applications, RESTful APIs, and cloud deployments.",
  education: "Bachelor's in Computer Science with certifications in AWS, Docker, and React."
};

// Context enhancement for better AI responses
const enhancePrompt = (userMessage) => {
  const context = `You are Jashy, an AI assistant for Jashank's portfolio website. Jashank is a Full Stack Developer skilled in React, Node.js, Cloud Technologies, and DevOps. 
  
Portfolio Info:
- Skills: React, Node.js, Express, MongoDB, Docker, AWS, Kubernetes, Jenkins
- Projects: E-Learning Platform, Salon Management System, Personal Portfolio
- E-Learning: http://13.60.241.214/ (College Project with course management)
- Salon System: http://mxparlour.dpdns.org (Client project with booking system)
- Contact: jaykumar0305@gmail.com, +91 99117 52744
- Location: Faridabad, India
- GitHub: github.com/jashank2003
- LinkedIn: linkedin.com/in/jashank-308b83247

User question: ${userMessage}

Respond in a friendly, helpful manner as Jashank's assistant. Keep responses concise and relevant.`;
  
  return context;
};

// Advanced NLP and context understanding
const analyzeIntent = (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Intent detection - order matters! More specific patterns first
  const intents = {
    greeting: /^(hi|hello|hey|greetings|sup|yo|namaste|hola)/,
    farewell: /(bye|goodbye|see you|talk later|gtg|gotta go)/,
    thanks: /(thank|thanks|appreciate|grateful)/,
    name_intro: /(my name is|i am|i'm|call me|this is)\s+([a-z]+)/i,
    skill_query: /(skill|technology|tech stack|programming|language|framework|what.*skill|your skill|tell.*skill)/,
    project_query: /(project|work|portfolio|built|created|made|what.*project|your project|show.*project)/,
    contact_query: /(contact|email|phone|reach|connect|hire|how.*contact|get in touch)/,
    experience_query: /(experience|worked|year|job|career|your experience)/,
    education_query: /(education|study|degree|college|university)/,
    resume_query: /(resume|cv|download|pdf)/,
    github_query: /(github|code|repository|repo)/,
    help_query: /(help|assist|support|guide|confused)/,
    casual: /(how are you|what's up|wassup|how r u)/,
    compliment: /(good|great|awesome|amazing|cool|nice|excellent|fantastic)/,
    capability: /(what can you|your capabilities|what do you do|features)/,
    hindi: /(kya|kaise|kaun|kaha|kyun|bata|batao|help karo)/,
    question: /(what|when|where|who|why|how|can you|do you|are you)/,  // Keep this last as it's generic
  };
  
  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(lowerMsg)) {
      return intent;
    }
  }
  
  return 'general';
};

// Extract entities from message
const extractEntities = (message) => {
  const nameMatch = message.match(/(?:my name is|i am|i'm|call me|this is)\s+([a-z]+)/i);
  const emailMatch = message.match(/([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/i);
  const phoneMatch = message.match(/(\+?\d[\d\s-]{8,})/i);
  
  return {
    name: nameMatch ? nameMatch[1] : null,
    email: emailMatch ? emailMatch[1] : null,
    phone: phoneMatch ? phoneMatch[1] : null
  };
};

// Smart context-aware response generator with NLP
const generateSmartResponse = (message, conversationHistory = []) => {
  const lowerMsg = message.toLowerCase();
  const intent = analyzeIntent(message);
  const entities = extractEntities(message);
  
  // Get conversation context
  const lastBotMessage = conversationHistory.slice(-2).find(m => m.type === 'bot')?.text || '';
  const conversationLength = conversationHistory.length;
  
  // Handle Hindi/Hinglish
  if (intent === 'hindi') {
    if (lowerMsg.includes('kya') && lowerMsg.includes('hai')) {
      return "Namaste! 🙏 Main Jashy hoon, Jashank ka AI assistant. Main aapko unke skills, projects, aur contact info ke baare mein bata sakta hoon. Kya jaanna chahenge?";
    }
    if (lowerMsg.includes('batao') || lowerMsg.includes('bata')) {
      return "Zaroor! Main Jashank ke baare mein sab kuch bata sakta hoon:\n\n💻 Technical Skills\n🚀 Projects\n📧 Contact Information\n📄 Resume\n\nAap kya jaanna chahoge?";
    }
  }
  
  // Personal introduction with context
  if (intent === 'name_intro' || entities.name) {
    const name = entities.name || 'there';
    const responses = [
      `Nice to meet you, ${name}! 😄 I'm Jashy, Jashank's AI assistant. How can I help you today?`,
      `Hey ${name}! 👋 Great to connect with you! I can tell you all about Jashank's skills, projects, and experience. What interests you?`,
      `Welcome ${name}! ✨ I'm here to help you learn about Jashank. Would you like to know about his technical skills, projects, or contact info?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Intent-based responses with context awareness
  if (intent === 'skill_query') {
    if (conversationLength > 4) {
      return knowledgeBase.skills + "\n\nWould you like to see projects where I've used these skills?";
    }
    return knowledgeBase.skills;
  }
  
  if (intent === 'project_query') {
    if (lastBotMessage.includes('skill')) {
      return "Great follow-up! " + knowledgeBase.projects;
    }
    return knowledgeBase.projects;
  }
  
  if (intent === 'contact_query') {
    if (entities.email) {
      return `Thanks for sharing ${entities.email}! Here's how you can reach Jashank:\n\n` + knowledgeBase.contact;
    }
    return knowledgeBase.contact;
  }
  
  if (intent === 'resume_query') return knowledgeBase.resume;
  if (intent === 'github_query') return knowledgeBase.github;
  if (intent === 'experience_query') return knowledgeBase.experience;
  if (intent === 'education_query') return knowledgeBase.education;
  
  // General queries about Jashank
  if (lowerMsg.includes('about') || lowerMsg.includes('who')) {
    if (conversationLength === 0) {
      return knowledgeBase.about + "\n\nWould you like to know more about skills or projects?";
    }
    return knowledgeBase.about;
  }
  
  // Context-aware greetings
  if (intent === 'greeting') {
    if (conversationLength === 0) {
      const greetings = [
        "Hello! 👋 I'm Jashy, Jashank's AI assistant. How can I help you today?",
        "Hey there! 😊 Welcome! I can tell you about Jashank's skills, projects, and experience. What interests you?",
        "Hi! ✨ I'm here to help you learn about Jashank. Ask me anything!",
        "Namaste! 🙏 I'm Jashy, ready to assist! Feel free to ask about skills, projects, or contact info!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    } else {
      return "Hey again! 👋 What else would you like to know?";
    }
  }
  
  // Farewell
  if (intent === 'farewell') {
    const farewells = [
      "Goodbye! 👋 Feel free to come back anytime you have questions!",
      "See you later! 😊 Don't hesitate to reach out if you need anything!",
      "Take care! ✨ Thanks for chatting with me!"
    ];
    return farewells[Math.floor(Math.random() * farewells.length)];
  }
  
  // Thanks with context
  if (intent === 'thanks') {
    if (conversationLength > 4) {
      return "You're very welcome! 😊 It's been great chatting with you. Anything else I can help with?";
    }
    const thanks = [
      "You're welcome! 😊 Anything else you'd like to know?",
      "Happy to help! ✨ Feel free to ask more questions!",
      "My pleasure! 😄 What else can I assist you with?",
      "Glad I could help! 🎉 Don't hesitate to ask more!"
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }
  
  // Smart help
  if (intent === 'help_query') {
    return "I can help you with:\n\n✨ Information about Jashank\n💻 Technical skills and expertise\n🚀 Project portfolio\n📧 Contact details\n📄 Resume download\n👨‍💻 GitHub and social links\n🌍 Hindi/English support\n\nTry asking: 'What are your skills?' or 'Show me projects' or use slash commands like /skills, /contact!";
  }
  
  // Advanced capabilities showcase
  if (intent === 'capability') {
    return "I'm Jashy, Jashank's AI assistant powered by smart NLP! 🧠\n\nI can:\n\n✨ Understand context and remember our conversation\n💻 Tell you about Jashank's skills & experience\n🚀 Show his amazing projects\n📧 Provide contact information\n📄 Share his resume\n👨‍💻 Connect you to his GitHub\n🌍 Understand Hindi/English/Hinglish\n🎯 Use slash commands (/skills, /contact)\n💡 Give smart suggestions based on context\n\nWhat would you like to explore?";
  }
  
  // Conversational with personality
  if (intent === 'casual') {
    const responses = [
      "I'm doing great, thanks for asking! 😊 I'm here to help you learn about Jashank. What would you like to know?",
      "I'm excellent! 🌟 Always ready to chat about Jashank's work. How can I assist you?",
      "Fantastic! 🚀 Thanks for asking! Now, what can I tell you about Jashank?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Compliment handling
  if (intent === 'compliment') {
    const responses = [
      "That's wonderful! 🎉 How can I assist you with information about Jashank today?",
      "Awesome! 🌟 Glad you're enjoying it! What else would you like to know?",
      "Thank you! 😊 That's great to hear! How else can I help?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Smart default with question detection
  if (intent === 'question') {
    const questionResponses = [
      "That's a great question! 🤔 I can tell you about Jashank's skills, projects, experience, or contact info. What specifically interests you?",
      "Interesting question! ✨ I'd be happy to help! Ask me about his technical skills, projects, or how to get in touch.",
      "Good question! 🚀 Let me help you with that. I know all about Jashank's work, skills, and experience. What would you like to know?"
    ];
    return questionResponses[Math.floor(Math.random() * questionResponses.length)];
  }
  
  // General default with context
  const defaults = [
    "I'd love to help! ✨ Would you like to know about Jashank's technical skills, projects, or contact info?",
    "Great! 🚀 I specialize in info about Jashank. Ask me about his skills, projects, or how to reach him!",
    "Interesting! 🤔 I can tell you about Jashank's experience, skills, projects, or provide contact details. What interests you?",
    "Sure thing! 💡 Try asking about skills, projects, experience, or use /help to see what I can do!"
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

// Slash command handler
const handleSlashCommand = (command) => {
  const commands = {
    '/skills': knowledgeBase.skills,
    '/projects': knowledgeBase.projects,
    '/contact': knowledgeBase.contact,
    '/resume': knowledgeBase.resume,
    '/github': knowledgeBase.github,
    '/experience': knowledgeBase.experience,
    '/education': knowledgeBase.education,
    '/help': "Available slash commands:\n\n/skills - View technical skills\n/projects - See project portfolio\n/contact - Get contact information\n/resume - Download resume\n/github - GitHub profile\n/experience - Work experience\n/education - Educational background"
  };
  
  return commands[command] || null;
};

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Chatbot route is working!' });
});

// POST /api/chatbot/message - AI Chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Try AI API first (Hugging Face - Free, no API key needed)
    if (fetch) {
      try {
        const enhancedPrompt = enhancePrompt(message);
        
        // Build conversation context
        const conversationContext = conversationHistory
          .slice(-6) // Last 3 exchanges
          .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
          .join('\n');
        
        const fullPrompt = conversationContext 
          ? `${conversationContext}\n\n${enhancedPrompt}`
          : enhancedPrompt;

        const response = await fetch(HUGGINGFACE_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              max_length: 200,
              temperature: 0.7,
              top_p: 0.9,
            }
          }),
        });

        if (response.ok) {
          const aiData = await response.json();
          let aiResponse = '';
          
          // Parse different response formats
          if (Array.isArray(aiData) && aiData.length > 0) {
            aiResponse = aiData[0].generated_text || aiData[0].summary_text || '';
          } else if (typeof aiData === 'string') {
            aiResponse = aiData;
          } else if (aiData.generated_text) {
            aiResponse = aiData.generated_text;
          }

          // Clean up AI response
          aiResponse = aiResponse.trim();
          
          // If AI response is too short or empty, use fallback
          if (aiResponse.length < 10) {
            aiResponse = generateSmartResponse(message);
          }

          return res.json({
            success: true,
            response: aiResponse,
            source: 'AI',
            suggestions: generateSuggestions(message)
          });
        }
      } catch (aiError) {
        console.error('AI API Error:', aiError.message);
        // Fallback to knowledge base
      }
    }

    // Check for slash commands first
    if (message.startsWith('/')) {
      const slashResponse = handleSlashCommand(message.trim());
      if (slashResponse) {
        return res.json({
          success: true,
          response: slashResponse,
          source: 'slash_command',
          suggestions: generateSuggestions(message)
        });
      }
    }
    
    // Fallback: Use local knowledge base with conversation context
    const fallbackResponse = generateSmartResponse(message, conversationHistory);
    
    return res.json({
      success: true,
      response: fallbackResponse,
      source: 'smart_knowledge_base',
      suggestions: generateSuggestions(message)
    });

  } catch (error) {
    console.error('Chatbot Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.',
      response: "I'm experiencing some technical difficulties. Feel free to ask me about Jashank's skills, projects, or contact information!"
    });
  }
});

// Generate contextual suggestions
const generateSuggestions = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('about') || lowerMsg.includes('who')) {
    return ["Tell me about your skills", "Show me your projects", "How can I contact you?"];
  }
  if (lowerMsg.includes('skill')) {
    return ["View projects", "Download resume", "Contact me"];
  }
  if (lowerMsg.includes('project')) {
    return ["What technologies did you use?", "Tell me more about a specific project", "View your GitHub"];
  }
  if (lowerMsg.includes('contact')) {
    return ["Go to contact form", "Visit GitHub", "Connect on LinkedIn"];
  }
  
  return ["Tell me about Jashank", "Show skills", "View projects"];
};

module.exports = router;
