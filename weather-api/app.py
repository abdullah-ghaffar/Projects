import os
import json
import time
import requests
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# ─────────────────────────────────────
# Load environment variables
# ─────────────────────────────────────
load_dotenv()

app = Flask(__name__)

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# ─────────────────────────────────────
# Rate Limiter (abuse se bachao)
# ─────────────────────────────────────
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour", "10 per minute"]
)

# ─────────────────────────────────────
# In-Memory Cache (Redis na ho toh yeh)
# Simple dictionary cache with expiration
# ─────────────────────────────────────
class SimpleCache:
    """In-memory cache with expiration - Redis alternative"""
    
    def __init__(self):
        self._cache = {}
    
    def get(self, key):
        """Get value if not expired"""
        if key in self._cache:
            data, expiry = self._cache[key]
            if time.time() < expiry:
                return data
            else:
                # Expired — delete it
                del self._cache[key]
        return None
    
    def set(self, key, value, ex=43200):
        """Set value with expiration (default 12 hours)"""
        self._cache[key] = (value, time.time() + ex)
    
    def clear(self):
        """Clear all cache"""
        self._cache = {}


# ─────────────────────────────────────
# Try Redis first, fallback to SimpleCache
# ─────────────────────────────────────
cache = None

try:
    import redis
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    
    class RedisCache:
        """Redis-based cache"""
        def __init__(self, client):
            self.client = client
        
        def get(self, key):
            data = self.client.get(key)
            if data:
                return json.loads(data)
            return None
        
        def set(self, key, value, ex=43200):
            self.client.set(key, json.dumps(value), ex=ex)
        
        def clear(self):
            self.client.flushdb()
    
    cache = RedisCache(redis_client)
    print("✅ Connected to Redis!")

except Exception:
    cache = SimpleCache()
    print("⚠️ Redis not available — using in-memory cache")


# ─────────────────────────────────────
# Fetch weather from Visual Crossing API
# ─────────────────────────────────────
def fetch_weather(city):
    """Fetch weather data from Visual Crossing API"""
    
    base_url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
    
    params = {
        "unitGroup": "metric",
        "key": WEATHER_API_KEY,
        "contentType": "json"
    }
    
    url = f"{base_url}/{city}"
    
    response = requests.get(url, params=params, timeout=10)
    
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 400:
        return {"error": f"Invalid city: {city}"}
    elif response.status_code == 401:
        return {"error": "Invalid API key"}
    elif response.status_code == 429:
        return {"error": "API rate limit exceeded. Try later."}
    else:
        return {"error": f"API returned status {response.status_code}"}


# ─────────────────────────────────────
# Format weather response (clean output)
# ─────────────────────────────────────
def format_weather(data):
    """Extract useful info from raw API response"""
    
    if "error" in data:
        return data
    
    try:
        current = data.get("currentConditions", {})
        
        return {
            "city": data.get("resolvedAddress", "Unknown"),
            "timezone": data.get("timezone", "Unknown"),
            "current": {
                "temperature_c": current.get("temp"),
                "feels_like_c": current.get("feelslike"),
                "humidity": current.get("humidity"),
                "wind_speed_kph": current.get("windspeed"),
                "conditions": current.get("conditions"),
                "icon": current.get("icon"),
                "uv_index": current.get("uvindex"),
                "visibility_km": current.get("visibility"),
                "sunrise": current.get("sunrise"),
                "sunset": current.get("sunset"),
            },
            "forecast": [
                {
                    "date": day.get("datetime"),
                    "temp_max_c": day.get("tempmax"),
                    "temp_min_c": day.get("tempmin"),
                    "conditions": day.get("conditions"),
                    "description": day.get("description"),
                }
                for day in data.get("days", [])[:5]  # Next 5 days
            ]
        }
    except Exception as e:
        return {"error": f"Failed to parse weather data: {str(e)}"}


# ═══════════════════════════════════════
# API ROUTES
# ═══════════════════════════════════════

@app.route("/", methods=["GET"])
def home():
    """API welcome page"""
    return jsonify({
        "message": "🌤️ Weather API",
        "usage": "GET /weather/<city>",
        "example": "GET /weather/Lahore",
        "endpoints": {
            "/weather/<city>": "Get current weather + 5-day forecast",
            "/weather/<city>?days=3": "Get weather with custom forecast days",
            "/health": "API health check",
            "/cache/clear": "Clear weather cache"
        }
    })


@app.route("/weather/<city>", methods=["GET"])
@limiter.limit("10 per minute")
def get_weather(city):
    """
    Get weather for a city
    - Checks cache first
    - If not cached, fetches from API
    - Caches result for 12 hours
    """
    
    # Validate input
    if not city or len(city) < 2:
        return jsonify({"error": "Please provide a valid city name"}), 400
    
    city = city.strip().lower()
    cache_key = f"weather:{city}"
    
    # ── Step 1: Check cache ──
    cached_data = cache.get(cache_key)
    if cached_data:
        cached_data["source"] = "cache"
        return jsonify(cached_data), 200
    
    # ── Step 2: Check API key ──
    if not WEATHER_API_KEY:
        return jsonify({
            "error": "API key not configured. Set WEATHER_API_KEY in .env"
        }), 500
    
    # ── Step 3: Fetch from API ──
    try:
        raw_data = fetch_weather(city)
    except requests.exceptions.Timeout:
        return jsonify({"error": "Weather API timed out. Try again."}), 504
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Cannot reach weather API. Check internet."}), 503
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
    # ── Step 4: Check for API errors ──
    if "error" in raw_data:
        return jsonify(raw_data), 400
    
    # ── Step 5: Format response ──
    formatted = format_weather(raw_data)
    formatted["source"] = "api"
    
    # ── Step 6: Cache it (12 hours = 43200 seconds) ──
    cache.set(cache_key, formatted, ex=43200)
    
    return jsonify(formatted), 200


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "cache_type": "redis" if isinstance(cache, SimpleCache) == False else "in-memory",
        "api_key_set": bool(WEATHER_API_KEY)
    })


@app.route("/cache/clear", methods=["POST"])
def clear_cache():
    """Clear all cached weather data"""
    cache.clear()
    return jsonify({"message": "Cache cleared successfully ✅"})


# ═══════════════════════════════════════
# Error Handlers
# ═══════════════════════════════════════

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found. Try /weather/<city>"}), 404


@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({
        "error": "Rate limit exceeded. Max 10 requests per minute.",
        "retry_after": "60 seconds"
    }), 429


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


# ═══════════════════════════════════════
# Run Server
# ═══════════════════════════════════════

if __name__ == "__main__":
    print("=" * 50)
    print("🌤️  Weather API Starting...")
    print(f"📦 Cache: {'Redis' if not isinstance(cache, SimpleCache) else 'In-Memory'}")
    print(f"🔑 API Key: {'✅ Set' if WEATHER_API_KEY else '❌ Missing'}")
    print("=" * 50)
    
    app.run(debug=True, port=3000)