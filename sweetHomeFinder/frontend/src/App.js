import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react'; // Import useAuth from Clerk
import HomePage from './pages/homePage';
import QuizPage from './pages/quizPage';
import NavBar from './components/navBar';
import Footer from './components/footer';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signupPage';
import AboutUsPage from './pages/aboutUsPage'; // Import AboutUsPage

function App() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();  
  const [hasTakenQuiz, setHasTakenQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (isSignedIn && user) {
        await registerUser();
        await checkQuizStatus();
      } else {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [isSignedIn, user]);

  const registerUser = async () => {
    if (!user) return;

    try {
      const token = await getToken(); 
      const response = await fetch('http://localhost:5000/api/users/register', {
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

      const data = await response.json();
      console.log('Register response:', data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const checkQuizStatus = async () => {
    if (!user) return;

    try {
      const token = await getToken(); 
      const response = await fetch('http://localhost:5000/api/users/quiz-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHasTakenQuiz(data.hasTakenQuiz);
    } catch (error) {
      console.error('Error checking quiz status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={
            isSignedIn && hasTakenQuiz === false ? <Navigate to="/quiz" /> : <HomePage />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/quiz" element={
            isSignedIn ? (hasTakenQuiz ? <Navigate to="/" /> : <QuizPage />) : <Navigate to="/login" />
          } />
          <Route path="/about-us" element={<AboutUsPage />} /> {/* Updated the path to /about-us */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;