import React from "react";
import "../styles/aboutUsPage.scss";
import teamImage1 from "../assets/alex_nobg.png"; // Example image paths
import teamImage2 from "../assets/javid_nobg.png";
import teamImage3 from "../assets/graz_nobg.png";
import teamImage4 from "../assets/dhimitri_nobg.png";

function AboutUsPage() {
  return (
    <div className="about-us-page">
      <h1>Meet the Team</h1>
      <div className="team-grid">
        <a
          href="https://www.linkedin.com/in/alex-bernatowicz/"
          target="_blank"
          rel="noopener noreferrer"
        >
        <div className="team-member">
          <img src={teamImage1} alt="Alex Bernatowicz" />
          <h2>
              Alex Bernatowicz
          </h2>
          <p>Software Engineer</p>
          <p className="flag">🇵🇱</p>
        </div>
        </a>
        <a
          href="https://www.linkedin.com/in/javiduddin/"
          target="_blank"
          rel="noopener noreferrer"
        >
        <div className="team-member">
          <img src={teamImage2} alt="Javid Uddin" />
          <h2>
              Javid Uddin
          </h2>
          <p>Software Engineer</p>
          <p className="flag">🇵🇰</p>
        </div>
        </a>
        <a
          href="https://www.linkedin.com/in/grazvydas-revuckas-99377116b/"
          target="_blank"
          rel="noopener noreferrer"
        >
        <div className="team-member">
          <img src={teamImage3} alt="Grazvydas Revuckas" />
          <h2>
              Grazvydas Revuckas
          </h2>
          <p>Software Engineer</p>
          <p className="flag">🇱🇹</p>
        </div>
        </a>
        <a
          href="https://www.linkedin.com/in/dhimitridinella/"
          target="_blank"
          rel="noopener noreferrer"
        >
        <div className="team-member">
          <img src={teamImage4} alt="Dhimitri Dinella" />
          <h2>
              Dhimitri Dinella
          </h2>
          <p>Software Engineer</p>
          <p className="flag">🇦🇱</p>
        </div>
        </a>
      </div>
    </div>
  );
}

export default AboutUsPage;
