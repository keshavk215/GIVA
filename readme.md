# URL Shortener (Node.js + MongoDB)

## Overview

This is a simple URL shortener API similar to Bit.ly, built using Node.js and MongoDB. It provides endpoints to shorten URLs, redirect users, and track click statistics.

## Approach

1. **Shortening Logic** : Uses a randomly generated short code (`shortid`) or a custom alias provided by the user.
2. **Database Storage** : MongoDB stores long URLs, short codes, click counts, and optional expiry dates.
3. **Redirection** : When a short URL is accessed, it looks up the long URL and redirects the user.
4. **Statistics Tracking** : Tracks how many times a short URL has been accessed.
5. **Edge Cases** : Handles invalid URLs, duplicate aliases, and expired links.
6. **Scalability** : Can be improved with caching (Redis) and horizontal scaling.

## Running Locally

### Prerequisites

* Install [Node.js](https://nodejs.org/)
* Install [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/keshavk215/GIVA.git
   cd GIVA
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the server:
   ```sh
   node index.js
   ```
5. Server runs on `http://localhost:5000`

## API Usage

### Shorten a URL

**Request:**

```sh
curl -X POST http://localhost:5000/shorten \
     -H "Content-Type: application/json" \
     -d '{"longUrl": "https://example.com"}'
```

**Response:**

```json
{
  "shortUrl": "http://localhost:5000/abc123"
}
```

### Custom Alias

**Request:**

```sh
curl -X POST http://localhost:5000/shorten \
     -H "Content-Type: application/json" \
     -d '{"longUrl": "https://example.com", "alias": "myalias"}'
```

**Response:**

```json
{
  "shortUrl": "http://localhost:5000/myalias"
}
```

### Redirect to Original URL

**Request:**

```sh
curl -X GET http://localhost:5000/abc123
```

(Redirects to the original URL)

### Get URL Statistics

**Request:**

```sh
curl -X GET http://localhost:5000/stats/abc123
```

**Response:**

```json
{
  "longUrl": "https://example.com",
  "shortCode": "abc123",
  "clicks": 10,
  "expiryDate": null
}
```
