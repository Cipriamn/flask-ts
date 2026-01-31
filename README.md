# S&P 500 Stock Market Watcher

A full-stack application for monitoring S&P 500 stocks in real-time. Built with Flask (Python) backend and React (TypeScript) frontend.

## Features

- **Real-time S&P 500 Data**: Fetch and display current prices for all S&P 500 companies
- **Stock Details**: View detailed information for individual stocks including key metrics
- **Price History Charts**: Interactive charts showing price history with multiple timeframes
- **Top Movers**: See the day's top gainers and losers at a glance
- **Search**: Quickly filter stocks by symbol
- **Auto-refresh**: Data automatically refreshes to stay current

## Tech Stack

### Backend
- **Flask 3.0** - Python web framework
- **yfinance** - Yahoo Finance API for stock data
- **pandas** - Data manipulation
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **TanStack Query** - Data fetching & caching
- **Recharts** - Charting library
- **React Router** - Client-side routing

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py         # App factory
│   │   ├── routes/             # API endpoints
│   │   │   ├── health.py       # Health check
│   │   │   └── stocks.py       # Stock endpoints
│   │   └── services/
│   │       └── stock_service.py # Stock data service
│   ├── config/
│   │   └── __init__.py         # Configuration
│   ├── tests/
│   │   └── test_stocks.py      # API tests
│   ├── requirements.txt
│   └── run.py                  # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment file:
   ```bash
   cp .env.example .env
   ```

5. Run the Flask server:
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/stocks/` | GET | List all S&P 500 stocks with prices |
| `/api/stocks/{symbol}` | GET | Get detailed stock info |
| `/api/stocks/{symbol}/history` | GET | Get price history |
| `/api/stocks/gainers` | GET | Top gaining stocks |
| `/api/stocks/losers` | GET | Top losing stocks |

### Query Parameters

**History endpoint:**
- `period`: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
- `interval`: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

**Movers endpoints:**
- `limit`: Number of results (default: 10)

## License

MIT License
