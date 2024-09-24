// src/pages/LoginPage.js

import React from 'react';
import '../styles/loginPage.scss';
// import loginBackground from '../assets/loginImg.jpg';
import loginBackground2 from '../assets/unsplash2.jpg';
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
      <div className="login-page" style={{ backgroundImage: `url(${loginBackground2})` }}>
        <div className="login-container">
          <h2>Welcome to Sweet Home Finder</h2>
          <div className="pet-icon">🐾</div>
          <form className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <button type="submit">Find Your mf Dawg</button>
          </form>
          <div className="login-options">
          <Link to="/signup">New to our shelter? Sign up</Link>
          </div>
        </div>
      </div>
    );
  }

export default LoginPage;