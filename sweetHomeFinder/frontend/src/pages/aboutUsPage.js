import React from "react";
import "../styles/aboutUsPage.scss";
import teamImage1 from "../assets/placeholder.jpg"; // Example image paths
import teamImage2 from "../assets/placeholder.jpg";
import teamImage3 from "../assets/placeholder.jpg";
import teamImage4 from "../assets/dhimitri_dinella.jpg";

function AboutUsPage() {
  return (
    <div className="about-us-page">
      <h1>About Us</h1>
      <div className="team-grid">
        <div className="team-member">
          <img src={teamImage1} alt="Alex Bernatowicz" />
          <h2>
            <a
              href="https://www.linkedin.com/in/alex-bernatowicz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alex Bernatowicz
            </a>
          </h2>
        </div>
        <div className="team-member">
          <img src={teamImage2} alt="Javid Uddin" />
          <h2>
            <a
              href="https://www.linkedin.com/in/javiduddin/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Javid Uddin
            </a>
          </h2>
        </div>
        <div className="team-member">
          <img src={teamImage3} alt="Grazvydas Revuckas" />
          <h2>
            <a
              href="https://www.linkedin.com/in/grazvydas-revuckas-99377116b/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Grazvydas Revuckas
            </a>
          </h2>
        </div>
        <div className="team-member">
          <img src={teamImage4} alt="Dhimitri Dinella" />
          <h2>
            <a
              href="https://www.linkedin.com/in/dhimitridinella/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dhimitri Dinella
            </a>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
