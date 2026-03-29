import { Clock } from 'lucide-react';

const HourlyForecast = ({ data }) => {
  // Visual Crossing API se hourly data aata hai
  const hours = data.days?.[0]?.hours || [];

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('clear') || cond.includes('sun')) return '☀️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('snow')) return '❄️';
    return '🌤️';
  };

  return (
    <div className="weather-card hourly">
      <h3>
        <Clock size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        24-Hour Forecast
      </h3>

      <div className="hourly-grid">
        {hours.slice(0, 24).map((hour, index) => {
          const time = new Date(hour.datetimeEpoch * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
          });

          return (
            <div key={index} className="hour-card">
              <div style={{ fontSize: '1.1rem', marginBottom: '8px', opacity: 0.9 }}>
                {time}
              </div>
              <div style={{ fontSize: '2.2rem', margin: '12px 0' }}>
                {getWeatherIcon(hour.conditions)}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700' }}>
                {Math.round(hour.temp)}°
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '6px', opacity: 0.75 }}>
                {hour.conditions.split(',')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;