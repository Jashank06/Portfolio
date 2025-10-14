const http = require('http');
const url = require('url');
const nodemailer = require('nodemailer');

// Load environment variables
require('dotenv').config();

// CORS headers
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

// Email function
const sendEmail = async (formData) => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `🚀 Portfolio Contact: ${formData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%); padding: 20px; border-radius: 15px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #F59E0B; font-size: 28px; margin-bottom: 20px; text-align: center;">📧 New Portfolio Contact</h2>
          <hr style="border: 2px solid #F59E0B; margin: 20px 0;">
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">👤 Name:</strong>
            <p style="background: #F3F4F6; padding: 10px; border-radius: 8px; margin: 5px 0; font-size: 16px;">${formData.name}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">📧 Email:</strong>
            <p style="background: #F3F4F6; padding: 10px; border-radius: 8px; margin: 5px 0; font-size: 16px;"><a href="mailto:${formData.email}" style="color: #F59E0B; text-decoration: none;">${formData.email}</a></p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">📝 Subject:</strong>
            <p style="background: #F3F4F6; padding: 10px; border-radius: 8px; margin: 5px 0; font-size: 16px;">${formData.subject}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong style="color: #1F2937; font-size: 16px;">💬 Message:</strong>
            <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 5px 0; font-size: 16px; line-height: 1.6;">${formData.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <hr style="border: 1px solid #E5E7EB; margin: 25px 0;">
          <p style="text-align: center; color: #6B7280; font-size: 14px; margin: 0;">💼 Sent from your Portfolio Website | ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Create server
const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Handle OPTIONS (preflight) requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (method === 'GET' && path === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: '🚀 Portfolio API is running!' }));
    return;
  }

  // Contact form submission
  if (method === 'POST' && path === '/api/contact') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const formData = JSON.parse(body);
        console.log('📧 Contact form submission:', formData);

        // Validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: 'All fields are required' 
          }));
          return;
        }

        // Try to send email
        try {
          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await sendEmail(formData);
            console.log('✅ Email sent successfully');
          } else {
            console.log('⚠️ Email credentials not configured');
          }
        } catch (emailError) {
          console.error('⚠️ Email failed:', emailError.message);
        }

        // Send success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Message sent successfully! Thanks for reaching out.' 
        }));

      } catch (error) {
        console.error('❌ Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Something went wrong. Please try again later.' 
        }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not Found' }));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
  console.log(`📡 Ready to receive contact forms!`);
});