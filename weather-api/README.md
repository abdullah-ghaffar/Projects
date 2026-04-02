# 🌤️ Weather API

A weather API that fetches and returns weather data from Visual Crossing API with caching, rate limiting, and error handling.

## Architecture

```
Client Request
     │
     ▼
┌─────────────┐     ┌──────────────┐
│  Flask API   │────▶│  Cache Layer │
│  + Rate      │     │  (Redis or   │
│  Limiter     │     │  In-Memory)  │
└──────┬──────┘     └──────────────┘
       │                    │
       │  Cache Miss        │ Cache Hit
       ▼                    ▼
┌─────────────┐      Return cached
│ Visual       │      response
│ Crossing API │
└─────────────┘
```

## Features

- ✅ Fetch current weather + 5-day forecast
- ✅ Redis caching with 12-hour expiration
- ✅ Falls back to in-memory cache if Redis unavailable
- ✅ Rate limiting (10 requests/minute)
- ✅ Environment variables for configuration
- ✅ Proper error handling (invalid city, API down, rate limit)
- ✅ Health check endpoint

## Setup

```bash
# Clone
git clone https://github.com/abdullah-ghaffar/weather-api.git
cd weather-api

# Virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1    # Windows
source venv/bin/activate        # Mac/Linux

# Install
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env and add your Visual Crossing API key
# Get free key: https://www.visualcrossing.com/sign-up

# Run
python app.py
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and usage |
| GET | `/weather/<city>` | Get weather for a city |
| GET | `/health` | Health check |
| POST | `/cache/clear` | Clear cache |

## Example

```bash
# Get weather for Lahore
curl http://localhost:3000/weather/Lahore
```

Response:
```json
{
  "city": "Lahore, Punjab, Pakistan",
  "current": {
    "temperature_c": 35.2,
    "humidity": 45,
    "conditions": "Clear",
    "wind_speed_kph": 12.5
  },
  "forecast": ["..."],
  "source": "api"
}
```

Second request returns from cache:
```json
{
  "source": "cache"
}
```

## Tech Stack

- **Python 3.12** + **Flask** — API framework
- **Visual Crossing API** — Weather data (free tier)
- **Redis** — Caching (optional, falls back to in-memory)
- **Flask-Limiter** — Rate limiting

## Environment Variables

| Variable | Description |
|----------|-------------|
| `WEATHER_API_KEY` | Visual Crossing API key |
| `REDIS_URL` | Redis connection string |
