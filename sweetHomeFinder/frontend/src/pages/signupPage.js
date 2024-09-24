<<<<<<< HEAD
// src/pages/signupPage.js

import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import '../styles/loginPage.scss'; 
import loginBackground2 from '../assets/unsplash2.jpg';

function SignUpPage() {
  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBackground2})` }}>
      <div className="login-container">
        <h2>Join Sweet Home Finder</h2>
        <div className="pet-icon">🐾</div>

        {/* Clerk SignUp Component */}
        <SignUp path="/signup" routing="path" signInUrl="/login" />

        {/* Optional Login link */}
        <div className="login-options">
          <a href="/login">Already have an account? Log in</a>
=======
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/signupPage.scss';
import signupBackground from '../assets/unsplash2.jpg';

function SignupPage() {
  return (
    <div className="signup-page" style={{ backgroundImage: `url(${signupBackground})` }}>
      <div className="signup-container">
        <h2>Create an Account</h2>
        <div className="pet-icon">🐾</div>
        <form className="signup-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className="signup-options">
          <Link to="/login">Already have an account? Log in</Link>
>>>>>>> 1bd86e68acc1d4187f6cf66d60c64b3a0bc92317
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default SignUpPage;
=======
export default SignupPage;
>>>>>>> 1bd86e68acc1d4187f6cf66d60c64b3a0bc92317
