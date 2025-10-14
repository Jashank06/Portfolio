# 🚀 Modern Portfolio Website

Complete full-stack portfolio website with React, Tailwind CSS, Node.js, and Express.js.

## ✨ Features

### Frontend
- ⚛️ **React 18** - Latest version with hooks
- 🎨 **Tailwind CSS** - Modern, utility-first CSS framework
- 🎭 **Framer Motion** - Smooth animations and transitions
- 📱 **Fully Responsive** - Works on all devices
- 🎯 **Modern UI/UX** - Clean and professional design
- 🌈 **Gradient Colors** - Beautiful color coordination
- ⚡ **Fast Performance** - Optimized for speed

### Backend
- 🔧 **Node.js & Express** - RESTful API
- 📧 **Contact Form** - Working contact functionality
- 🗄️ **MongoDB Ready** - Database integration ready
- 📨 **Email Support** - Nodemailer integration
- 🔒 **Secure** - CORS enabled
- ⚙️ **Environment Variables** - Secure configuration

### Sections
1. **Hero** - Animated introduction with typing effect
2. **About** - Personal introduction with tech stack
3. **Skills** - Service cards with hover effects
4. **Projects** - Featured work with overlays
5. **Contact** - Working contact form
6. **Footer** - Social media links

## 📁 Project Structure

```
Portfolio/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── server.js           # Express server
│   ├── .env                # Environment variables
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for database)

### Installation

#### 1. Clone or navigate to the project
```bash
cd /Users/Jay/Documents/Portfolio
```

#### 2. Setup Frontend

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: **http://localhost:3000**

#### 3. Setup Backend (Open new terminal)

```bash
# Navigate to server folder
cd server

# Install dependencies (already done)
# npm install

# Start server
npm run dev
```

Backend will run on: **http://localhost:5000**

## 🔧 Configuration

### Frontend Configuration

**Client runs on port 3000 by default.**

To change API endpoint, update in `client/src/components/Contact.jsx`:
```javascript
const response = await axios.post('http://localhost:5000/api/contact', formData);
```

### Backend Configuration

Edit `server/.env` file:

```env
PORT=5000

# MongoDB (Optional)
MONGODB_URI=mongodb://localhost:27017/portfolio

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### MongoDB Setup (Optional)

1. Install MongoDB locally or use MongoDB Atlas
2. Uncomment MongoDB connection in `server/server.js`
3. Add your MongoDB URI to `.env` file

### Email Setup (Optional)

1. Use Gmail or any SMTP service
2. For Gmail: Create App Password
   - Go to Google Account → Security → 2-Step Verification → App passwords
3. Add credentials to `.env` file
4. Uncomment email function in `server/server.js`

## 📝 Customization

### Update Your Information

#### 1. Personal Details
- `client/src/components/Hero.jsx` - Name and roles
- `client/src/components/About.jsx` - About text and technologies
- `client/src/components/Contact.jsx` - Contact information

#### 2. Projects
Edit `client/src/components/Projects.jsx`:
```javascript
const projects = [
  {
    title: 'Your Project',
    type: 'Web Application',
    description: 'Your description',
    image: 'your-image-url',
    tags: ['React', 'Node.js'],
    github: 'github-link',
    live: 'live-demo-link',
  },
];
```

#### 3. Skills
Edit `client/src/components/Skills.jsx` to update your skills.

#### 4. Social Links
Update social media links in:
- `client/src/components/Hero.jsx`
- `client/src/components/Footer.jsx`

#### 5. Colors
Customize colors in `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#6366f1', // Change to your color
  },
}
```

#### 6. Images
Replace placeholder images with your own:
- Profile picture in About section
- Project screenshots in Projects section

## 🎨 Color Scheme

Current color palette:
- **Primary**: Indigo (#6366f1)
- **Secondary**: Pink (#ec4899)
- **Accent**: Teal (#14b8a6)
- **Background**: Slate (#0f172a)

## 📦 Build for Production

### Frontend
```bash
cd client
npm run build
```

Build files will be in `client/build/` directory.

### Backend
```bash
cd server
npm start
```

## 🚀 Deployment

### Frontend Deployment

**Vercel:**
```bash
cd client
npm install -g vercel
vercel
```

**Netlify:**
1. Drag and drop `client/build` folder to Netlify
2. Or connect GitHub repository

**GitHub Pages:**
```bash
cd client
npm install gh-pages
# Add to package.json:
"homepage": "https://username.github.io/portfolio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
npm run deploy
```

### Backend Deployment

**Heroku:**
```bash
cd server
heroku create your-app-name
git push heroku main
```

**Railway / Render:**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

**Update API URL in frontend after backend deployment!**

## 📱 Testing

### Test Frontend
```bash
cd client
npm test
```

### Test Backend API
```bash
# Test health check
curl http://localhost:5000

# Test contact endpoint
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Hello"}'
```

## 🛠️ Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- React Icons
- Axios
- React Intersection Observer

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer
- CORS
- dotenv

## 📋 Available Scripts

### Client
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

### CORS Issues
Make sure backend has CORS enabled and frontend is calling correct API URL.

### Contact Form Not Working
1. Check if backend is running
2. Verify API URL in Contact component
3. Check browser console for errors

## 📄 License

MIT License - Feel free to use this for your own portfolio!

## 👤 Author

**Jay**
- Portfolio: [Your URL]
- GitHub: [@yourusername]
- LinkedIn: [Your LinkedIn]

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Icons from React Icons
- Images from Unsplash

---

Made with ❤️ by Jay

Last Updated: October 2024
