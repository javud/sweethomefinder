import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react'; // Import useAuth from Clerk
import HomePage from './pages/homePage';
import QuizPage from './pages/quizPage';
import NavBar from './components/navBar';
import Footer from './components/footer';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signupPage';

function App() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();  // Destructure getToken from useAuth()
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
      console.log('Registering user:', user.fullName, user.primaryEmailAddress.emailAddress, user.id); // Debugging
  
      const token = await getToken(); // Retrieve the token
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from getToken
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          clerkUserId: user.id,  // Pass the Clerk User ID to the backend
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
      console.log('Checking quiz status for user:', user.id); // Debugging
      const token = await getToken(); // Retrieve the token
      const response = await fetch('http://localhost:5000/api/users/quiz-status', {
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from getToken
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
