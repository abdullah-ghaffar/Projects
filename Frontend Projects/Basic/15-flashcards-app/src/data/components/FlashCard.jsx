import { useState } from 'react';

const FlashCard = ({ question, answer, isFlipped, onFlip }) => {
  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={onFlip}>
      <div className="card-inner">
        
        {/* Front Side - Question */}
        <div className="card-front">
          <div className="question">{question}</div>
        </div>

        {/* Back Side - Answer */}
        <div className="card-back">
          <div className="answer">{answer}</div>
        </div>

      </div>
    </div>
  );
};

export default FlashCard;