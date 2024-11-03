import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import HomePage from './pages/homePage';
import QuizPage from './pages/quizPage';
import NavBar from './components/navBar';
import Footer from './components/footer';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signupPage';
import AboutUsPage from './pages/aboutUsPage';
import PetsPage from './pages/petsPage';
import AdminPortal from './pages/AdminPortal';


function App() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [hasTakenQuiz, setHasTakenQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const registerUser = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getToken();
      await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          clerkUserId: user.id,
        }),
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }, [user, getToken]);

  const checkQuizStatus = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/users/quiz-status?clerkUserId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Quiz status checked:', data.hasTakenQuiz);
      setHasTakenQuiz(data.hasTakenQuiz);
    } catch (error) {
      console.error('Error checking quiz status:', error);
      setHasTakenQuiz(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, getToken]);

  useEffect(() => {
    if (isSignedIn && user) {
      registerUser();
      checkQuizStatus();
    } else {
      setHasTakenQuiz(null);
      setIsLoading(false);
    }
  }, [isSignedIn, user, registerUser, checkQuizStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          {/* Home page accessible to everyone */}
          <Route path="/" element={<HomePage />} />

          {/* Login and Signup routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/quiz" element={
            isSignedIn
              ? (hasTakenQuiz
                ? <Navigate to="/pets" />
                : <QuizPage onQuizComplete={() => setHasTakenQuiz(true)} />)
              : <Navigate to="/login" />
          } />

          <Route path="/pets" element={
            isSignedIn && hasTakenQuiz ? <PetsPage /> : <Navigate to="/quiz" />
          } />

          {/* Pets page, only accessible if logged in and quiz completed */}
          <Route path="/pets" element={
            isSignedIn && hasTakenQuiz ? <PetsPage /> : <Navigate to="/quiz" />
          } />

          {/* Admin route */}
          <Route path="/admin" element={
            isSignedIn ? <AdminPortal /> : <Navigate to="/login" />
          } />
   
          <Route path="/about-us" element={<AboutUsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;