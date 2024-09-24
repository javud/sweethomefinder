// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage';
import QuizPage from './pages/quizPage';
import NavBar from './components/navBar';
import Footer from './components/footer';
import LoginPage from './pages/loginPage';
import SignupPage from './pages/signupPage';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;