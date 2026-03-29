import { useState } from 'react';
import FlashCard from '../src/data/components/FlashCard';   // ← Yeh line sahi hai
import { questions } from '../src/data/questions';
import './index.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Flash Cards</h1>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-info">
          <span>{Math.round(progress)}%</span>
          <span>{currentIndex + 1} of {questions.length}</span>
        </div>
      </div>

      <div className="card-container">
        <FlashCard
          question={currentCard.question}
          answer={currentCard.answer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div className="navigation">
        <button 
          className="nav-btn" 
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <button 
          className="show-answer-btn" 
          onClick={handleFlip}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>

        <button 
          className="nav-btn" 
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default App;