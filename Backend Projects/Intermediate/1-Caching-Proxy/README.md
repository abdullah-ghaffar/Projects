# Caching Proxy Server

A lightweight CLI tool built with pure Node.js that starts a caching proxy server. It forwards requests to an actual server, caches the responses locally, and serves identical future requests instantly from the cache.

---

## Features

- **Zero Dependencies:** Built entirely using native Node.js modules (`http`, `fs`).
- **Performance Boost:** Prevents redundant network calls by caching API responses.
- **Custom Headers:** Injects `X-Cache: HIT` or `X-Cache: MISS` to track response origin.
- **Easy Cache Management:** Simple CLI command to wipe the cache cleanly.

---

## Usage & Commands

### 1. Start the Proxy Server

Run the command by specifying the local `--port` and the `--origin` URL you want to proxy.

    node caching-proxy.js --port 3000 --origin http://dummyjson.com

*(The server will now listen on `http://localhost:3000` and forward requests to the origin.)*

### 2. Test the Cache (Browser or cURL)

Make a request to your local server:

    curl -i http://localhost:3000/products

- **1st Request:** You will see `X-Cache: MISS` in the headers (Fetched from origin & cached).
- **2nd Request:** You will see `X-Cache: HIT` in the headers (Served instantly from local cache).

### 3. Clear the Cache

To delete all stored cache data, stop the server (Ctrl+C) and run:

    node caching-proxy.js --clear-cache

---

**Developed with ❤️.**
