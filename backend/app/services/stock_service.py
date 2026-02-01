import yfinance as yf
import pandas as pd
from typing import List, Dict, Optional
from datetime import datetime
import requests


class StockService:
    """Service for fetching S&P 500 stock data."""

    def __init__(self):
        self._sp500_symbols: Optional[List[str]] = None
        self._symbols_cache_time: Optional[datetime] = None
        self._cache_duration_hours = 24

    def get_sp500_symbols(self) -> List[str]:
        """Fetch S&P 500 symbols from Wikipedia."""
        # Check cache
        if self._sp500_symbols and self._symbols_cache_time:
            hours_elapsed = (datetime.now() - self._symbols_cache_time).total_seconds() / 3600
            if hours_elapsed < self._cache_duration_hours:
                return self._sp500_symbols

        # Fetch from Wikipedia
        url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
        tables = pd.read_html(url)
        sp500_table = tables[0]

        self._sp500_symbols = sp500_table['Symbol'].tolist()
        self._symbols_cache_time = datetime.now()

        return self._sp500_symbols

    def get_sp500_list(self) -> List[Dict]:
        """Get list of S&P 500 stocks with current market data."""
        symbols = self.get_sp500_symbols()

        # Batch download for efficiency (limit to avoid timeouts)
        batch_size = 50
        all_stocks = []

        for i in range(0, len(symbols), batch_size):  # Fetch all S&P 500 stocks (500+)
            batch = symbols[i:i + batch_size]
            tickers_str = ' '.join(batch)

            try:
                tickers = yf.Tickers(tickers_str)

                for symbol in batch:
                    try:
                        ticker = tickers.tickers.get(symbol)
                        if ticker:
                            info = ticker.fast_info
                            all_stocks.append({
                                'symbol': symbol,
                                'price': round(info.last_price, 2) if hasattr(info, 'last_price') else None,
                                'change': round(info.last_price - info.previous_close, 2) if hasattr(info, 'last_price') and hasattr(info, 'previous_close') else None,
                                'changePercent': round(((info.last_price - info.previous_close) / info.previous_close) * 100, 2) if hasattr(info, 'last_price') and hasattr(info, 'previous_close') and info.previous_close else None,
                                'marketCap': info.market_cap if hasattr(info, 'market_cap') else None,
                            })
                    except Exception:
                        all_stocks.append({
                            'symbol': symbol,
                            'price': None,
                            'change': None,
                            'changePercent': None,
                            'marketCap': None,
                        })
            except Exception:
                continue

        return all_stocks

    def get_stock_details(self, symbol: str) -> Optional[Dict]:
        """Get detailed information for a specific stock."""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            fast_info = ticker.fast_info

            return {
                'symbol': symbol,
                'name': info.get('longName', info.get('shortName', symbol)),
                'sector': info.get('sector'),
                'industry': info.get('industry'),
                'price': round(fast_info.last_price, 2) if hasattr(fast_info, 'last_price') else None,
                'previousClose': round(fast_info.previous_close, 2) if hasattr(fast_info, 'previous_close') else None,
                'open': info.get('open'),
                'dayHigh': info.get('dayHigh'),
                'dayLow': info.get('dayLow'),
                'volume': info.get('volume'),
                'avgVolume': info.get('averageVolume'),
                'marketCap': info.get('marketCap'),
                'peRatio': info.get('trailingPE'),
                'eps': info.get('trailingEps'),
                'dividend': info.get('dividendYield'),
                'beta': info.get('beta'),
                'week52High': info.get('fiftyTwoWeekHigh'),
                'week52Low': info.get('fiftyTwoWeekLow'),
                'change': round(fast_info.last_price - fast_info.previous_close, 2) if hasattr(fast_info, 'last_price') and hasattr(fast_info, 'previous_close') else None,
                'changePercent': round(((fast_info.last_price - fast_info.previous_close) / fast_info.previous_close) * 100, 2) if hasattr(fast_info, 'last_price') and hasattr(fast_info, 'previous_close') and fast_info.previous_close else None,
                'description': info.get('longBusinessSummary'),
            }
        except Exception as e:
            print(f"Error fetching details for {symbol}: {e}")
            return None

    def get_stock_history(self, symbol: str, period: str = '1mo', interval: str = '1d') -> List[Dict]:
        """Get historical price data for a stock."""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)

            history = []
            for date, row in hist.iterrows():
                history.append({
                    'date': date.strftime('%Y-%m-%d %H:%M:%S') if interval in ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h'] else date.strftime('%Y-%m-%d'),
                    'open': round(row['Open'], 2),
                    'high': round(row['High'], 2),
                    'low': round(row['Low'], 2),
                    'close': round(row['Close'], 2),
                    'volume': int(row['Volume']),
                })

            return history
        except Exception as e:
            print(f"Error fetching history for {symbol}: {e}")
            return []

    def get_top_movers(self, mover_type: str = 'gainers', limit: int = 10) -> List[Dict]:
        """Get top gaining or losing stocks."""
        stocks = self.get_sp500_list()

        # Filter out stocks without change data
        stocks_with_data = [s for s in stocks if s['changePercent'] is not None]

        if mover_type == 'gainers':
            sorted_stocks = sorted(stocks_with_data, key=lambda x: x['changePercent'], reverse=True)
        else:
            sorted_stocks = sorted(stocks_with_data, key=lambda x: x['changePercent'])

        return sorted_stocks[:limit]
