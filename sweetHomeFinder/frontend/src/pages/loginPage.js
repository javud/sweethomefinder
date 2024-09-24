// src/pages/LoginPage.js

import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import '../styles/loginPage.scss'; 
import loginBackground2 from '../assets/unsplash2.jpg';
import { Link } from 'react-router-dom';

function LoginPage() {
<<<<<<< HEAD
  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBackground2})` }}>
      <div className="login-container">
        <h2>Welcome to Sweet Home Finder</h2>
        <div className="pet-icon">🐾</div>

        {/* Clerk SignIn Component */}
        <SignIn path="/login" routing="path" signUpUrl="/signup" />

        {/* Optional Sign-Up link (Clerk handles routing) */}
        <div className="login-options">
          <a href="/signup">New to our shelter? Sign up</a>
=======
    return (
      <div className="login-page" style={{ backgroundImage: `url(${loginBackground2})` }}>
        <div className="login-container">
          <h2>Login to Sweet Home Finder</h2>
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
            <button type="submit">Find Your Perfect Pet</button>
          </form>
          <div className="login-options">
          <Link to="/signup">New to our shelter? Sign up</Link>
          </div>
>>>>>>> 1bd86e68acc1d4187f6cf66d60c64b3a0bc92317
        </div>
      </div>
    </div>
  );
}

export default LoginPage;