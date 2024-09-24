// src/pages/LoginPage.js

import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import '../styles/loginPage.scss'; 
import loginBackground2 from '../assets/unsplash2.jpg';
import { Link } from 'react-router-dom';

function LoginPage() {
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
        </div>
      </div>
    </div>
  );
}

export default LoginPage;