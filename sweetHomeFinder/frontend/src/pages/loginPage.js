// src/pages/LoginPage.js

import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import '../styles/loginPage.scss'; 
import loginBackground2 from '../assets/unsplash2.jpg';
// import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBackground2})` }}>
      <div className="login-container">
        
        

        {/* Clerk SignIn Component */}
        <SignIn path="/login" routing="path" signUpUrl="/signup" />

        {/* Optional Sign-Up link (Clerk handles routing) */}
        <div className="login-options">
        
        </div>
      </div>
    </div>
  );
}

export default LoginPage;