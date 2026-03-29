const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1>🧠 JS Quiz</h1>
      <p>8 Questions • 60 seconds each • Test your JavaScript knowledge</p>
      <button className="start-btn" onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
};

export default StartScreen;