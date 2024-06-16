import React, { useEffect, useState } from 'react';
import questionsData from './questions.json';

const TOTAL_TIME = 600; // 10 minutes in seconds

const QuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(TOTAL_TIME);
  const [quizData, setQuizData] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
    const savedTimer = localStorage.getItem('timer');
    if (savedQuestionIndex !== null) {
      setCurrentQuestionIndex(parseInt(savedQuestionIndex, 10));
    }
    if (savedTimer !== null) {
      setTimer(parseInt(savedTimer, 10));
    }
    setQuizData(questionsData);
  }, []);

  useEffect(() => {
    if (timer > 0 && !quizEnded) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          localStorage.setItem('timer', prev - 1);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, quizEnded]);

  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    document.onfullscreenchange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
  }, []);

  const handleOptionClick = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
      alert('Quiz completed!');
    }
  };

  if (!isFullScreen) {
    return (
      <div>
        <h2>Please enable full-screen mode to take the quiz.</h2>
        <button onClick={handleFullScreen}>Go Full Screen</button>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div>
        <h1>The quiz ends</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Quiz</h1>
      <div>
        <h2>Question {currentQuestionIndex + 1}: {quizData[currentQuestionIndex]?.question}</h2>
        {['A', 'B', 'C', 'D'].map((optionKey) => (
          <div key={optionKey}>
            <button onClick={handleOptionClick}>{quizData[currentQuestionIndex]?.[optionKey]}</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</h2>
      </div>
    </div>
  );
};

export default QuizApp;
