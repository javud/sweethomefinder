// src/pages/homePage.js
import React from 'react';
import '../styles/homePage.scss';
import landingImage from '../assets/landingImage.jpg';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <img src={landingImage} alt="Pets" className="hero-image" />
        <div className="hero-text">
          <h1>Welcome to Sweet Home Finder</h1>
          <p>Helping you find the perfect pet for your family.</p>
          {/* Link the button to the /quiz page */}
          <Link to="/quiz">
            <button className="cta-button">Find Your Pet</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;