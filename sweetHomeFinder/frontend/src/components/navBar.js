// src/components/navBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Sweet Home Finder</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/quiz">Take Quiz</Link>
        </li>
        <li>
          <Link to="/search">Search Pets</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;