// src/components/navBar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import logo from '../assets/logo-no-background.png';
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
          <img src={logo} alt="Sweet Home Finder" draggable="false" />
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
          <li><Link to="/about-us" onClick={toggleMenu}>About Us</Link></li>
          
          {/* Signed-out users see the SignIn button */}
          <SignedOut>
            <li><SignInButton /></li>
          </SignedOut>

          {/* Signed-in users see their UserButton (profile management) */}
          <SignedIn>
            <li><UserButton /></li>
          </SignedIn>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;