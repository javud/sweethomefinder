import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import '../styles/quizPage.scss';

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const response = await fetch('/quiz_questions.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        
        const categories = Array.from(xmlDoc.getElementsByTagName('category'));
        const quizQuestions = categories.flatMap(category => 
          Array.from(category.getElementsByTagName('question')).map(q => ({
            text: q.getElementsByTagName('text')[0].textContent,
            options: Array.from(q.getElementsByTagName('option')).map(option => ({
              answer: option.textContent,
              tag: option.getAttribute('tag'),
            }))
          }))
        );

        setQuestions(quizQuestions);
      } catch (error) {
        console.error("Error loading quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, []);

  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion] || null);
  }, [currentQuestion, answers]);

  const totalQuestions = questions.length;

  const getProgress = () => {
    const progress = Math.round((currentQuestion / (totalQuestions - 1)) * 100);
    if(progress == 100) {
      return "Done!";
    } else {
      return progress + "%";
    }
  }

  const handleQuizCompletion = async () => {
    try {
      console.log('test');
      console.log('Marking quiz as completed for user:', user.id); // fix
      const response = await fetch('/api/users/quiz-completed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Quiz marked as completed');
        navigate('/'); // Redirect to home page after quiz completion
      } else {
        console.error('Failed to mark quiz as completed');
      }
    } catch (error) {
      console.error('Error marking quiz as completed:', error);
    }
  };

  const handleNextQuestion = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleQuizCompletion();
      }
      setIsAnimating(false);
    }, 300);
  };

  const handlePreviousQuestion = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
    setTimeout(() => {
      handleNextQuestion();
    }, 200);
  };

  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (totalQuestions === 0) {
    return <div>No questions available</div>;
  }

  return (
    <div className="quiz-page">
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <span className="questions-left">{getProgress()}</span>
      </div>

      <div className={`question-card ${isAnimating ? 'fade' : ''}`}>
        <h2>Question {currentQuestion + 1}<span class="total">/{totalQuestions}</span></h2>
        <p>{questions[currentQuestion].text}</p>

        <div className="answer-buttons">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`answer-button ${selectedAnswer === option.answer ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(option.answer)}
            >
              {option.answer}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          <button className="prev-button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
            Previous
          </button>
          <button 
            className="next-button" 
            onClick={handleNextQuestion} 
            disabled={currentQuestion === totalQuestions - 1 && !selectedAnswer}
          >
            {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
