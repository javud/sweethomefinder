// src/pages/quizPage.js

import React, { useState } from 'react';
import '../styles/quizPage.scss'; 

function QuizPage() {
  // Sample state: 5 total questions and currently on the first question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = 5; // This can be dynamic later

  // Sample questions (replace with real questions)
  const questions = [
    "What's your preferred pet size?",
    "Do you prefer a pet that is active or calm?",
    "Are you looking for a pet that requires a lot of care?",
    "Would you prefer an indoor or outdoor pet?",
    "Do you have any pet allergies?"
  ];

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Function to move to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Calculate progress
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="quiz-page">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <span className="questions-left">{totalQuestions - (currentQuestion + 1)} Questions Left</span>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <h2>Question {currentQuestion + 1}</h2>
        <p>{questions[currentQuestion]}</p>

        {/* Answer Buttons */}
        <div className="answer-buttons">
          <button className="answer-button">Option 1</button>
          <button className="answer-button">Option 2</button>
          <button className="answer-button">Option 3</button>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button className="prev-button" onClick={handlePreviousQuestion}>Previous</button>
          <button className="next-button" onClick={handleNextQuestion}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;