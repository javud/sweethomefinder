// src/pages/homePage.js
import React from 'react';
import '../styles/homePage.scss';
import unsplashImage from '../assets/unsplash.jpg';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <img src={unsplashImage} alt="Pets" className="hero-image" />
        <div className="hero-text">
          <h1>Welcome to Sweet Home Finder</h1>
          <p>Helping you find the perfect pet for your family.</p>
          {/* Link the button to the /quiz page */}
          <Link to="/quiz">
            <button className="cta-button">Find Your Perfect Pet</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;