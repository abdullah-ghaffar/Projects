import { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import { questions } from './data/questions';
import './index.css';

function App() {
  const [stage, setStage] = useState('start'); // start | quiz | result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleStart = () => {
    setStage('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
  };

  const handleAnswer = (selectedIndex, isCorrect) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedIndex;
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStage('result');
    }
  };

  const handleRestart = () => {
    setStage('start');
  };

  if (stage === 'start') {
    return (
      <div className="container">
        <StartScreen onStart={handleStart} />
      </div>
    );
  }

  if (stage === 'quiz') {
    return (
      <div className="container">
        <QuestionCard
        key={currentQuestion}
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <ResultScreen
        score={score}
        total={questions.length}
        answers={userAnswers}
        questions={questions}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default App;