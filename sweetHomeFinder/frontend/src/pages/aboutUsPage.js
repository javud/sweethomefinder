import React from 'react';
import '../styles/aboutUsPage.scss';
import teamImage1 from '../assets/placeholder.jpg'; // Example image paths
import teamImage2 from '../assets/placeholder.jpg';
import teamImage3 from '../assets/placeholder.jpg';
import teamImage4 from '../assets/placeholder.jpg';

function AboutUsPage() {
  return (
    <div className="about-us-page">
      <h1>About Us</h1>
      <div className="team-grid">
        <div className="team-member">
          <img src={teamImage1} alt="Alex Bernatowicz" />
          <h2>Alex Bernatowicz</h2>
        </div>
        <div className="team-member">
          <img src={teamImage2} alt="Javid Uddin" />
          <h2>Javid Uddin</h2>
        </div>
        <div className="team-member">
          <img src={teamImage3} alt="Grazvydas Revuckas" />
          <h2>Grazvydas Revuckas</h2>
        </div>
        <div className="team-member">
          <img src={teamImage4} alt="Dhimitri Dinella" />
          <h2>Dhimitri Dinella</h2>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;