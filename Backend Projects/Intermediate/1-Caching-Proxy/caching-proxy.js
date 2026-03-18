/**
 * FILE: caching-proxy.js
 * Pattern: Reverse Proxy with File-based Caching
 * Architecture: Intercept -> Check Cache -> Fetch (if MISS) -> Store -> Respond
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'cache.json');

// ==========================================
// LAYER 1: CACHE MANAGEMENT (SSD <-> RAM)
// ==========================================

function getCache() {
    if (!fs.existsSync(CACHE_FILE)) {
        return {}; // Khali database
    }
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    return data ? JSON.parse(data) : {};
}

function saveToCache(key, responseData) {
    const cache = getCache();
    cache[key] = responseData;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function clearCache() {
    if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE); // File ko hamesha ke liye delete kardo
        console.log("✅ Cache cleared successfully.");
    } else {
        console.log("📭 Cache is already empty.");
    }
}

// ==========================================
// LAYER 2: THE PROXY SERVER LOGIC
// ==========================================

async function handleRequest(req, res, origin) {
    // Cache Key: Kaunsa rasta manga gaya hai? (e.g., "/products")
    const cacheKey = req.url;
    const cache = getCache();

    // 1. CACHE HIT: Data pehle se mojood hai
    if (cache[cacheKey]) {
        console.log(`[HIT] ⚡ Returning cached response for: ${cacheKey}`);
        
        // Purane headers set karo aur X-Cache: HIT lagao
        const cachedData = cache[cacheKey];
        res.writeHead(200, {
            'Content-Type': cachedData.contentType,
            'X-Cache': 'HIT',
            'Access-Control-Allow-Origin': '*'
        });
        return res.end(cachedData.body);
    }

    // 2. CACHE MISS: Origin server se data mangwao
    console.log(`[MISS] 🌐 Fetching from origin: ${origin}${req.url}`);
    
    try {
        // Origin server ko Native fetch se call lagai
        const originResponse = await fetch(`${origin}${req.url}`, {
            method: req.method,
        });

        const body = await originResponse.text(); // Data ko text ki shakal mein parha
        const contentType = originResponse.headers.get('content-type') || 'application/json';

        // Data ko Hard Drive (cache) mein save karlo agli baar ke liye
        saveToCache(cacheKey, {
            contentType: contentType,
            body: body
        });

        // User ko data wapis bhej do with X-Cache: MISS
        res.writeHead(200, {
            'Content-Type': contentType,
            'X-Cache': 'MISS',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(body);

    } catch (error) {
        console.error("❌ Origin Error:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Internal Server Error: Could not reach origin.");
    }
}

// ==========================================
// LAYER 3: CLI ARGUMENT ROUTER
// ==========================================

const args = process.argv.slice(2);

if (args.includes('--clear-cache')) {
    clearCache();
    process.exit(0); // Kaam khatam, program band
}

// Arguments dhoondna (maslan --port 3000)
const portIndex = args.indexOf('--port');
const originIndex = args.indexOf('--origin');

if (portIndex !== -1 && originIndex !== -1) {
    const PORT = args[portIndex + 1];
    const ORIGIN = args[originIndex + 1];

    if (!PORT || !ORIGIN) {
        console.log("❌ Error: Port or Origin missing. Usage: caching-proxy --port <number> --origin <url>");
        process.exit(1);
    }

    // Server Start Karna
    const server = http.createServer((req, res) => {
        handleRequest(req, res, ORIGIN);
    });

    server.listen(PORT, () => {
        console.log(`🚀 Caching Proxy Server running on port ${PORT}`);
        console.log(`➡️  Forwarding requests to: ${ORIGIN}`);
    });
} else {
    console.log("⚠️ Usage:");
    console.log("  Start Server: caching-proxy --port <number> --origin <url>");
    console.log("  Clear Cache:  caching-proxy --clear-cache");
}