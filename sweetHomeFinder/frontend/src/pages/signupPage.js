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
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;