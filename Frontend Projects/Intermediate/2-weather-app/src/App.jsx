import { useState, useEffect } from 'react';

const WEATHER_API_KEY = "CHQ9AXJ6DGEDWU898HPWRVM9V";

const pakistanCities = [
  "Karachi, Pakistan", "Lahore, Pakistan", "Islamabad, Pakistan", "Rawalpindi, Pakistan",
  "Faisalabad, Pakistan", "Multan, Pakistan", "Peshawar, Pakistan", "Quetta, Pakistan",
  "Hyderabad, Pakistan", "Sialkot, Pakistan", "Gujranwala, Pakistan", "Bahawalpur, Pakistan",
  "Sukkur, Pakistan", "Larkana, Pakistan", "Sheikhupura, Pakistan", "Rahim Yar Khan, Pakistan",
  "Sahiwal, Pakistan", "Gujrat, Pakistan", "Jhang, Pakistan", "Mian Channu, Pakistan",
  "Kamalia, Pakistan", "Burewala, Pakistan", "Daska, Pakistan", "Wazirabad, Pakistan",
  "Muridke, Pakistan", "Chishtian, Pakistan", "Arifwala, Pakistan", "Haveli Lakha, Pakistan",
  "Gojra, Pakistan", "Abbottabad, Pakistan", "Mardan, Pakistan", "Swat, Pakistan",
  "Kohat, Pakistan", "Bannu, Pakistan", "Dera Ismail Khan, Pakistan", "Muzaffarabad, Pakistan",
  "Mirpur, Pakistan", "Gilgit, Pakistan", "Skardu, Pakistan"
];

function App() {
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [requestedCity, setRequestedCity] = useState("");
  const [resolvedCity, setResolvedCity] = useState("");

  const filterCities = (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const filtered = pakistanCities
      .filter(city => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
    setSuggestions(filtered);
  };

  const fetchWeather = async (location) => {
    setLoading(true);
    setError("");
    setShowSuggestions(false);
    setRequestedCity(location);

    try {
      const proxy = "https://corsproxy.io/?";
      // Important: Hum "Pakistan" ko strongly add kar rahe hain
      const safeLocation = location.includes("Pakistan") ? location : `${location}, Pakistan`;

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(safeLocation)}?unitGroup=metric&key=${WEATHER_API_KEY}&contentType=json`;

      const response = await fetch(proxy + encodeURIComponent(url));
      const data = await response.json();

      if (!data || !data.currentConditions) {
        throw new Error("Weather data not available.");
      }

      setWeather(data);
      setResolvedCity(data.address || safeLocation);

      // Extra safety check
      if (!data.address.toLowerCase().includes("pakistan")) {
        setError("Warning: API returned data from wrong country.");
      }
    } catch (err) {
      setError("Could not fetch weather. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Lahore, Pakistan");
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    filterCities(value);
    setShowSuggestions(true);
  };

  const handleSelectCity = (selectedCity) => {
    setCityInput(selectedCity);
    setShowSuggestions(false);
    fetchWeather(selectedCity);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(cityInput);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', 
      color: 'white', 
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '3.2rem', marginBottom: '20px' }}>WeatherCast</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', opacity: 0.9 }}>Pakistan Weather App</p>

      <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto 40px' }}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={cityInput}
            onChange={handleInputChange}
            placeholder="Type city name in Pakistan..."
            style={{
              width: '100%',
              padding: '18px 22px',
              fontSize: '1.15rem',
              borderRadius: '50px',
              border: 'none',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          />
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '62px',
            left: '0',
            right: '0',
            background: 'white',
            color: '#333',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {suggestions.map((city, index) => (
              <div
                key={index}
                onClick={() => handleSelectCity(city)}
                style={{
                  padding: '16px 22px',
                  cursor: 'pointer',
                  borderBottom: index !== suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

      {loading && <div style={{ textAlign: 'center', fontSize: '26px' }}>Fetching weather...</div>}

      {weather && !loading && (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Clear Confirmation */}
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '15px', 
            borderRadius: '12px',
            marginBottom: '25px',
            fontSize: '1.05rem'
          }}>
            You requested: <strong>{requestedCity}</strong><br/>
            API returned: <strong>{resolvedCity}</strong>
          </div>

          <h2 style={{ fontSize: '2.6rem', marginBottom: '15px' }}>{resolvedCity}</h2>
          
          <div style={{ fontSize: '7.5rem', fontWeight: '700', margin: '10px 0' }}>
            {Math.round(weather.currentConditions.temp)}°C
          </div>

          <p style={{ fontSize: '2.1rem', marginBottom: '35px' }}>
            {weather.currentConditions.conditions}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', fontSize: '1.45rem' }}>
            <div>Wind: <strong>{weather.currentConditions.windspeed} km/h</strong></div>
            <div>Humidity: <strong>{weather.currentConditions.humidity.toFixed(1)}%</strong></div>
            <div>Feels Like: <strong>{Math.round(weather.currentConditions.feelslike)}°C</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;