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
    const savedQuizEnded = localStorage.getItem('quizEnded');
    if (savedQuizEnded === 'true') {
      setQuizEnded(true);
      setCurrentQuestionIndex(0);
      setTimer(TOTAL_TIME);
    } else {
      const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
      const savedTimer = localStorage.getItem('timer');
      if (savedQuestionIndex !== null) {
        setCurrentQuestionIndex(parseInt(savedQuestionIndex, 10));
      }
      if (savedTimer !== null) {
        setTimer(parseInt(savedTimer, 10));
      }
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

  useEffect(() => {
    localStorage.setItem('quizEnded', quizEnded);
  }, [quizEnded]);

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
      document.exitFullscreen();
      setIsFullScreen(false);
      setQuizEnded(true);
      localStorage.setItem('quizEnded', 'true');
      // alert('Quiz completed!'); 
    }
  };

  const onClose = () => {
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('timer');
    localStorage.removeItem('quizEnded');
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  if (quizEnded || timer === 0) {
    return (
      <div className='quizEnds'>
        <button onClick={onClose} className='endBtn'>The Quiz Ends</button>
      </div>
    );
  }
  if (!isFullScreen) {
    return (
      <div className='head-container'>
        <p className='header'>Please enable full-screen mode to take the quiz.</p>
        <button onClick={handleFullScreen} id='fsBtn'>Full Screen</button>
      </div>
    );
  }
  return (
    <div className='quizContainer'>

      <div className='navBar'>
        <h1>Quiz</h1>
        <h2>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</h2>
      </div>

      <div className='queContainer'>

        <p>Question {currentQuestionIndex + 1 }:{quizData[currentQuestionIndex]?.question}</p>
        {['A', 'B', 'C', 'D'].map((optionKey) => (
          <div key={optionKey} className='quizBtn'>
            <button onClick={handleOptionClick}>{optionKey} : {quizData[currentQuestionIndex]?.[optionKey]}</button>
          </div>
        ))}

      </div>

    </div>
  );
};

export default QuizApp;
