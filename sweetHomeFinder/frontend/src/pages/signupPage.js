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
        </div>
      </div>
    </div>
  );
}

export default SignupPage;