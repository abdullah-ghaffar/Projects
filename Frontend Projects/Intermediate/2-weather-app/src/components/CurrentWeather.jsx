import { RefreshCw, MapPin, Wind, Droplet } from 'lucide-react';

const CurrentWeather = ({ data, location, onRefresh }) => {
  const current = data.currentConditions || data.days[0];

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('sun') || cond.includes('clear')) return '☀️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('rain') || cond.includes('shower')) return '🌧️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('thunder')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="weather-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <MapPin size={24} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600' }}>{location}</h2>
          </div>
          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <button 
          onClick={onRefresh}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            padding: '10px',
            borderRadius: '50%',
            cursor: 'pointer',
            color: 'white'
          }}
          title="Refresh Weather"
        >
          <RefreshCw size={22} />
        </button>
      </div>

      <div className="current-weather">
        <div>
          <div style={{ fontSize: '6rem', marginBottom: '-20px' }}>
            {getWeatherIcon(current.conditions)}
          </div>
          <div className="temp">{Math.round(current.temp)}°C</div>
          <div className="condition">{current.conditions}</div>
        </div>

        <div className="details">
          <div className="detail-item">
            <Wind size={28} style={{ marginBottom: '8px', opacity: 0.8 }} />
            <div style={{ fontSize: '1.4rem', fontWeight: '600' }}>{current.windspeed}</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>km/h Wind</div>
          </div>

          <div className="detail-item">
            <Droplet size={28} style={{ marginBottom: '8px', opacity: 0.8 }} />
            <div style={{ fontSize: '1.4rem', fontWeight: '600' }}>{current.humidity}%</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>Humidity</div>
          </div>

          <div className="detail-item">
            <div style={{ fontSize: '1.4rem', fontWeight: '600' }}>{current.feelslike}°C</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>Feels Like</div>
          </div>

          <div className="detail-item">
            <div style={{ fontSize: '1.4rem', fontWeight: '600' }}>{current.precipprob || 0}%</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>Rain Chance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;