import { useState, useEffect } from 'react';

function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("Work");

  // Timer Logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Session complete
          if (sessionType === "Work") {
            setSessionType("Short Break");
            setMinutes(5);
            setSeconds(0);
          } else {
            setSessionType("Work");
            setMinutes(25);
            setSeconds(0);
          }
          setIsRunning(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds, sessionType]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
    setSessionType("Work");
  };

  const formatTime = () => {
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e2937)',
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>Pomodoro Timer</h1>

      <div style={{
        fontSize: '6.5rem',
        fontWeight: 'bold',
        marginBottom: '50px',
        letterSpacing: '8px'
      }}>
        {formatTime()}
      </div>

      <div style={{ fontSize: '1.6rem', marginBottom: '50px', color: sessionType === "Work" ? '#22c55e' : '#eab308' }}>
        {sessionType}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={startTimer}
          style={{
            padding: '16px 50px',
            fontSize: '1.3rem',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer'
          }}
        >
          Start
        </button>

        <button 
          onClick={pauseTimer}
          style={{
            padding: '16px 50px',
            fontSize: '1.3rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer'
          }}
        >
          Pause
        </button>

        <button 
          onClick={resetTimer}
          style={{
            padding: '16px 40px',
            fontSize: '1.3rem',
            background: '#64748b',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;