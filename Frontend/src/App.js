import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AllSkills from './pages/AllSkills';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setIsLoading(false);
  };

  return (
    <Router>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      
      {/* Main App Content */}
      {!isLoading && (
        <Routes>
          <Route path="/" element={
            <div className="App scroll-smooth">
              <Navbar />
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Contact />
              <Footer />
            </div>
          } />
          <Route path="/all-skills" element={<AllSkills />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
