const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Portfolio API is running!' });
});

// Email sending function
const sendEmailNotification = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
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

  return transporter.sendMail(mailOptions);
};

// Contact form submission
app.post('/api/contact', async (req, res) => {
  console.log('📧 Contact form submission received');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    console.log('✅ Validation passed');

    // Log the contact form data
    console.log('📧 New Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('-------------------');

    // Try to send email notification
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmailNotification({ name, email, subject, message });
        console.log('✅ Email sent successfully');
      } else {
        console.log('⚠️ Email credentials not configured, skipping email');
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    // Send success response
    console.log('✅ Sending success response');
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! Thanks for reaching out.' 
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again later.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err.stack);
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
  console.log(`🌐 Frontend URL: http://localhost:3000`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
});