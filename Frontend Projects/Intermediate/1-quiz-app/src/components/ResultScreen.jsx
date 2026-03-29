const ResultScreen = ({ score, total, answers, questions, onRestart }) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="result-screen">
      <h1>Your Score</h1>
      <div className="score">{score} / {total}</div>
      <p style={{ fontSize: '1.4rem', color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
        {percentage}% — {percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Better Luck Next Time'}
      </p>

      <div className="review">
        <h3 style={{ marginBottom: '15px' }}>Review Answers</h3>
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correct;
          return (
            <div key={i} className="review-item">
              <strong>Q{i + 1}:</strong> {q.question}
              <br />
              <span style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>
                Your answer: {userAnswer !== null ? q.options[userAnswer] : 'Timed out'}
              </span>
              {!isCorrect && <br />}
              {!isCorrect && <span>Your answer was wrong. Correct: {q.options[q.correct]}</span>}
            </div>
          );
        })}
      </div>

      <button className="start-btn" onClick={onRestart} style={{ marginTop: '30px' }}>
        Restart Quiz
      </button>
    </div>
  );
};

export default ResultScreen;