// src/pages/signupPage.js

import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import '../styles/loginPage.scss'; 
import loginBackground2 from '../assets/unsplash2.jpg';

function SignUpPage() {
  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBackground2})` }}>
      <div className="login-container">
        
        

        {/* Clerk SignUp Component */}
        <SignUp path="/signup" routing="path" signInUrl="/login" />

        {/* Optional Login link */}
        <div className="login-options">
          
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
