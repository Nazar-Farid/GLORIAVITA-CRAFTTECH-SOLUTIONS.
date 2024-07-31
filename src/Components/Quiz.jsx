import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { data } from '../data';
import './Quiz.css';

// Function to shuffle an array
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(10);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedHighestScore = localStorage.getItem('highestScore');
    if (storedHighestScore) {
      setHighestScore(parseInt(storedHighestScore));
    }

    // Shuffle the questions when the component mounts
    setQuestions(shuffleArray(data));
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer]);

  useEffect(() => {
    if (!showScore && timer > 0) {
      const id = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [showScore, timer]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const correctAnswer = questions[currentQuestion].ans;
    if (parseInt(option) === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! The correct answer is: ${questions[currentQuestion][`option${correctAnswer}`]}`);
    }
  };

  const handleNextQuestion = () => {
    if (parseInt(selectedOption) === questions[currentQuestion].ans) {
      setScore(score + 1);
    }

    setSelectedOption(null);
    setFeedback('');
    setTimer(10);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      clearInterval(intervalId);
      if (score > highestScore) {
        localStorage.setItem('highestScore', score);
        setHighestScore(score);
      }
    }
  };

  const handleRetry = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setFeedback('');
    setTimer(10);
    setShowReview(false);
    setQuestions(shuffleArray(data)); // Reshuffle questions on retry
  };

  const handleReview = () => {
    navigate('/review'); 
  };

  return (
    <div className="container quiz-container">
      <h1>Quiz App</h1>
      <hr />

      {showScore ? (
        <div className="score-card card p-4">
          <div className="card-body text-center">
            <h5 className="card-title">Your Score</h5>
            <p className="card-text">
              You scored {score} out of {questions.length} ({((score / questions.length) * 100).toFixed(2)}%)
            </p>
            <p className="card-text">
              Highest Score: {highestScore}
            </p>
            <button
              onClick={handleRetry}
              className="btn btn-primary mt-3"
            >
              Try Again
            </button>
            <button
              onClick={handleReview}
              className="btn btn-secondary mt-3 ms-1"
            >
              Review Answers
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4">
          <div className="question-section">
            <h5 className="card-title">
              {currentQuestion + 1}. {questions[currentQuestion]?.question}
            </h5>
            <div className="timer">Time Left: {timer}s</div>
          </div>
          <div className="answer-section">
            {Object.keys(questions[currentQuestion] || {})
              .filter((key) => key.startsWith('option'))
              .map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index + 1)}
                  className={`btn btn-outline-primary btn-block my-2 ${
                    selectedOption === index + 1 ? 'selected' : ''
                  } ${
                    selectedOption && index + 1 === questions[currentQuestion].ans
                      ? 'correct'
                      : selectedOption === index + 1 && index + 1 !== questions[currentQuestion].ans
                      ? 'incorrect'
                      : ''
                  }`}
                  tabIndex={0}
                  aria-pressed={selectedOption === index + 1}
                >
                  {questions[currentQuestion][option]}
                </button>
              ))}
          </div>
          <div className="feedback-section text-center mt-3">
            <p className="feedback">{feedback}</p>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="btn btn-primary"
            >
              Next
            </button>
          </div>
          <div className="text-center mt-2">
            <small>
              {currentQuestion + 1} of {questions.length} questions
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
