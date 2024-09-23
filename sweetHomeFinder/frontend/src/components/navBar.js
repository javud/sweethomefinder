// src/components/navBar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navBar.scss';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          Sweet Home Finder
        </div>
        {/* Hamburger menu icon */}
        <div className={`menu-btn ${isOpen ? 'close' : ''}`} onClick={toggleMenu}>
          <div className="btn-line"></div>
          <div className="btn-line"></div>
          <div className="btn-line"></div>
        </div>
        {/* Dropdown menu */}
        <ul className={`navbar-links ${isOpen ? 'show' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/quiz" onClick={toggleMenu}>Find Your Pet</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About Us</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;