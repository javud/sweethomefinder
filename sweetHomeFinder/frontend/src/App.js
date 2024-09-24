// src/App.js

import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage';
import QuizPage from './pages/quizPage';
import NavBar from './components/navBar';
import Footer from './components/footer';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signupPage';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Route: Only signed-in users can access the Quiz */}
          <Route
            path="/quiz"
            element={
              <SignedIn>
                <QuizPage />
              </SignedIn>
            }
          />

          {/* Redirect to sign-in if the user is not signed in */}
          <Route
            path="/protected"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
        <Footer /> {/* Footer will be displayed on all pages */}
      </div>
    </Router>
  );
}

export default App;