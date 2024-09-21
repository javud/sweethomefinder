// src/pages/homePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homePage.css'; 

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to Sweet Home Finder</h1>
        <p>Find your perfect companion today.</p>
      </header>

      <div className="home-content">
        <Link to="/quiz">
          <button className="cta-button">Take the Pet Quiz</button>
        </Link>

        <div className="navigation-links">
          <Link to="/search">Search for Pets</Link> | 
          <Link to="/login">Login</Link> | 
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;