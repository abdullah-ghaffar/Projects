import { useState, useEffect } from 'react';

const QuestionCard = ({ question, onAnswer, currentQuestion, totalQuestions }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Har nayi question pe state reset
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setTimeLeft(60);
  }, [currentQuestion]);

  // Timer (sirf tab tak chalega jab tak answer nahi diya)
  useEffect(() => {
    if (answered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answered]);

  // Time out ho gaya
  useEffect(() => {
    if (timeLeft <= 0 && !answered) {
      setAnswered(true);
      setSelected(null);
      onAnswer(null, false); // timed out
    }
  }, [timeLeft, answered]);

  const handleSelect = (index) => {
    if (answered) return;
    
    setSelected(index);
    setAnswered(true);
    // Ab auto next nahi hoga
  };

  const handleNext = () => {
    const isCorrect = selected === question.correct;
    onAnswer(selected, isCorrect);
  };

  return (
    <div className="question-container">
      <div className="timer">
        <div className="timer-circle">{timeLeft}</div>
        seconds left
      </div>

      <div className="progress">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <h2 className="question-text">
        {currentQuestion + 1}. {question.question}
      </h2>

      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              answered
                ? index === question.correct
                  ? 'correct'
                  : selected === index
                  ? 'wrong'
                  : ''
                : ''
            }`}
            onClick={() => handleSelect(index)}
            disabled={answered}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Next button sirf tab dikhega jab answer select ho chuka ho */}
      {answered && (
        <button className="next-btn" onClick={handleNext}>
          Next Question →
        </button>
      )}
    </div>
  );
};

export default QuestionCard;