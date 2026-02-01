import requests
from typing import List, Dict, Optional
from datetime import datetime


class CryptoService:
    """Service for fetching cryptocurrency data using CoinGecko API."""

    COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

    # Top cryptocurrencies to track
    TOP_CRYPTOS = [
        "bitcoin", "ethereum", "tether", "binancecoin", "ripple",
        "usd-coin", "staked-ether", "cardano", "dogecoin", "solana",
        "tron", "polkadot", "matic-network", "litecoin", "shiba-inu",
        "wrapped-bitcoin", "dai", "avalanche-2", "chainlink", "uniswap"
    ]

    def __init__(self):
        self._cache: Dict = {}
        self._cache_time: Optional[datetime] = None
        self._cache_duration_seconds = 60  # Cache for 1 minute

    def _get_cached_or_fetch(self, cache_key: str, fetch_fn, cache_duration: int = 60):
        """Generic caching helper."""
        now = datetime.now()
        if cache_key in self._cache:
            cached_data, cached_time = self._cache[cache_key]
            if (now - cached_time).total_seconds() < cache_duration:
                return cached_data

        data = fetch_fn()
        self._cache[cache_key] = (data, now)
        return data

    def get_crypto_list(self) -> List[Dict]:
        """Get list of top cryptocurrencies with current market data."""
        def fetch():
            try:
                ids = ",".join(self.TOP_CRYPTOS)
                url = f"{self.COINGECKO_BASE_URL}/coins/markets"
                params = {
                    "vs_currency": "usd",
                    "ids": ids,
                    "order": "market_cap_desc",
                    "per_page": 100,
                    "page": 1,
                    "sparkline": False,
                    "price_change_percentage": "24h,7d"
                }
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                return [{
                    "id": coin["id"],
                    "symbol": coin["symbol"].upper(),
                    "name": coin["name"],
                    "image": coin["image"],
                    "price": coin["current_price"],
                    "change24h": coin["price_change_24h"],
                    "changePercent24h": coin["price_change_percentage_24h"],
                    "changePercent7d": coin.get("price_change_percentage_7d_in_currency"),
                    "marketCap": coin["market_cap"],
                    "volume24h": coin["total_volume"],
                    "circulatingSupply": coin["circulating_supply"],
                    "rank": coin["market_cap_rank"]
                } for coin in data]
            except Exception as e:
                print(f"Error fetching crypto list: {e}")
                return []

        return self._get_cached_or_fetch("crypto_list", fetch, 60)

    def get_crypto_details(self, crypto_id: str) -> Optional[Dict]:
        """Get detailed information for a specific cryptocurrency."""
        def fetch():
            try:
                url = f"{self.COINGECKO_BASE_URL}/coins/{crypto_id}"
                params = {
                    "localization": False,
                    "tickers": False,
                    "market_data": True,
                    "community_data": False,
                    "developer_data": False,
                    "sparkline": False
                }
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                market_data = data.get("market_data", {})

                return {
                    "id": data["id"],
                    "symbol": data["symbol"].upper(),
                    "name": data["name"],
                    "image": data.get("image", {}).get("large"),
                    "description": data.get("description", {}).get("en", "")[:500],
                    "price": market_data.get("current_price", {}).get("usd"),
                    "change24h": market_data.get("price_change_24h"),
                    "changePercent24h": market_data.get("price_change_percentage_24h"),
                    "changePercent7d": market_data.get("price_change_percentage_7d"),
                    "changePercent30d": market_data.get("price_change_percentage_30d"),
                    "marketCap": market_data.get("market_cap", {}).get("usd"),
                    "volume24h": market_data.get("total_volume", {}).get("usd"),
                    "circulatingSupply": market_data.get("circulating_supply"),
                    "totalSupply": market_data.get("total_supply"),
                    "maxSupply": market_data.get("max_supply"),
                    "ath": market_data.get("ath", {}).get("usd"),
                    "athDate": market_data.get("ath_date", {}).get("usd"),
                    "athChangePercent": market_data.get("ath_change_percentage", {}).get("usd"),
                    "atl": market_data.get("atl", {}).get("usd"),
                    "atlDate": market_data.get("atl_date", {}).get("usd"),
                    "high24h": market_data.get("high_24h", {}).get("usd"),
                    "low24h": market_data.get("low_24h", {}).get("usd"),
                    "rank": data.get("market_cap_rank")
                }
            except Exception as e:
                print(f"Error fetching crypto details for {crypto_id}: {e}")
                return None

        return self._get_cached_or_fetch(f"crypto_details_{crypto_id}", fetch, 60)

    def get_crypto_history(self, crypto_id: str, days: str = "30") -> List[Dict]:
        """Get historical price data for a cryptocurrency."""
        def fetch():
            try:
                url = f"{self.COINGECKO_BASE_URL}/coins/{crypto_id}/market_chart"
                params = {
                    "vs_currency": "usd",
                    "days": days,
                    "interval": "daily" if int(days) > 1 else "hourly"
                }
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                prices = data.get("prices", [])
                volumes = data.get("total_volumes", [])

                history = []
                for i, (timestamp, price) in enumerate(prices):
                    dt = datetime.fromtimestamp(timestamp / 1000)
                    history.append({
                        "date": dt.strftime('%Y-%m-%d %H:%M:%S') if int(days) <= 1 else dt.strftime('%Y-%m-%d'),
                        "price": round(price, 2) if price > 1 else round(price, 6),
                        "volume": int(volumes[i][1]) if i < len(volumes) else 0
                    })

                return history
            except Exception as e:
                print(f"Error fetching crypto history for {crypto_id}: {e}")
                return []

        cache_duration = 300 if int(days) > 7 else 60  # Longer cache for longer periods
        return self._get_cached_or_fetch(f"crypto_history_{crypto_id}_{days}", fetch, cache_duration)

    def get_top_gainers(self, limit: int = 10) -> List[Dict]:
        """Get top gaining cryptocurrencies in the last 24h."""
        cryptos = self.get_crypto_list()
        sorted_cryptos = sorted(
            [c for c in cryptos if c.get("changePercent24h") is not None],
            key=lambda x: x["changePercent24h"],
            reverse=True
        )
        return sorted_cryptos[:limit]

    def get_top_losers(self, limit: int = 10) -> List[Dict]:
        """Get top losing cryptocurrencies in the last 24h."""
        cryptos = self.get_crypto_list()
        sorted_cryptos = sorted(
            [c for c in cryptos if c.get("changePercent24h") is not None],
            key=lambda x: x["changePercent24h"]
        )
        return sorted_cryptos[:limit]

    def get_market_overview(self) -> Dict:
        """Get overall crypto market statistics."""
        def fetch():
            try:
                url = f"{self.COINGECKO_BASE_URL}/global"
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json().get("data", {})

                return {
                    "totalMarketCap": data.get("total_market_cap", {}).get("usd"),
                    "totalVolume24h": data.get("total_volume", {}).get("usd"),
                    "btcDominance": data.get("market_cap_percentage", {}).get("btc"),
                    "ethDominance": data.get("market_cap_percentage", {}).get("eth"),
                    "activeCryptocurrencies": data.get("active_cryptocurrencies"),
                    "marketCapChangePercent24h": data.get("market_cap_change_percentage_24h_usd")
                }
            except Exception as e:
                print(f"Error fetching market overview: {e}")
                return {}

        return self._get_cached_or_fetch("market_overview", fetch, 120)
