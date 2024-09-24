// src/App.js

import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage';
import QuizPage from './pages/quizPage';
import NavBar from './components/navBar';
import Footer from './components/footer';
import LoginPage from './pages/loginPage';
<<<<<<< HEAD
import SignUpPage from './pages/signupPage';
=======
import SignupPage from './pages/signupPage';
>>>>>>> 1bd86e68acc1d4187f6cf66d60c64b3a0bc92317

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
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
=======
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <Footer />
>>>>>>> 1bd86e68acc1d4187f6cf66d60c64b3a0bc92317
      </div>
    </Router>
  );
}

export default App;