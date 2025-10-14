const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Middleware - Allow all origins for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://jashank.dpdns.org',
  'https://jashank.dpdns.org',
  'http://16.16.166.174',
  'https://16.16.166.174'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow all origins in development, specific ones in production
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all for now
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection (Optional - uncomment if using MongoDB)
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB Connected'))
// .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Contact Schema (if using MongoDB)
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Portfolio API is running!' });
});

// Health endpoint for Docker/Jenkins
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log('📧 Received contact form submission:');
    console.log('Body:', req.body);

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Save to database (if using MongoDB)
    // const newContact = new Contact({
    //   name,
    //   email,
    //   subject,
    //   message,
    // });
    // await newContact.save();

    // For now, just log the data
    console.log('📧 New Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('-------------------');

    // Try to send email notification (optional)
    try {
      await sendEmailNotification({ name, email, subject, message });
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but form submission successful:', emailError.message);
    }

    // Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! Thanks for reaching out.' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again later.' 
    });
  }
});

// Get all contacts (if using MongoDB - for admin panel)
app.get('/api/contacts', async (req, res) => {
  try {
    // Uncomment if using MongoDB
    // const contacts = await Contact.find().sort({ createdAt: -1 });
    // res.json({ success: true, contacts });
    
    res.json({ 
      success: true, 
      message: 'Contacts endpoint - Connect MongoDB to fetch data' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching contacts' 
    });
  }
});

// Email sending function using Nodemailer
const sendEmailNotification = async ({ name, email, subject, message }) => {
  const nodemailer = require('nodemailer');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `🚀 Portfolio Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%); padding: 20px; border-radius: 15px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #F59E0B; font-size: 28px; margin-bottom: 20px; text-align: center;">📧 New Portfolio Contact</h2>
          <hr style="border: 2px solid #F59E0B; margin: 20px 0;">
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">👤 Name:</strong>
            <p style="background: #F3F4F6; padding: 10px; border-radius: 8px; margin: 5px 0; font-size: 16px;">${name}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">📧 Email:</strong>
            <p style="background: #F3F4F6; padding: 10px; border-radius: 8px; margin: 5px 0; font-size: 16px;"><a href="mailto:${email}" style="color: #F59E0B; text-decoration: none;">${email}</a></p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">📝 Subject:</strong>
            <p style="background: #F3F4F6; padding: 10px; border-radius: 8px; margin: 5px 0; font-size: 16px;">${subject}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">💬 Message:</strong>
            <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 5px 0; font-size: 16px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <hr style="border: 1px solid #E5E7EB; margin: 25px 0;">
          <p style="text-align: center; color: #6B7280; font-size: 14px; margin: 0;">💼 Sent from your Portfolio Website | ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
});
