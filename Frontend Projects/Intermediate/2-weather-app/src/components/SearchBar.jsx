import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Enter city name (e.g. Karachi, Lahore...)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: '100%',
              padding: '18px 50px 18px 20px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '1.1rem',
              background: 'rgba(255,255,255,0.9)',
              color: '#1e2937'
            }}
          />
          <button type="submit" style={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            padding: '10px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer'
          }}>
            <Search size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;