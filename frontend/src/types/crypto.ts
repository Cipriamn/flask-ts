export interface Crypto {
  id: string
  symbol: string
  name: string
  image: string
  price: number | null
  change24h: number | null
  changePercent24h: number | null
  changePercent7d: number | null
  marketCap: number | null
  volume24h: number | null
  circulatingSupply: number | null
  rank: number | null
}

export interface CryptoDetails extends Crypto {
  description: string | null
  changePercent30d: number | null
  totalSupply: number | null
  maxSupply: number | null
  ath: number | null
  athDate: string | null
  athChangePercent: number | null
  atl: number | null
  atlDate: string | null
  high24h: number | null
  low24h: number | null
}

export interface CryptoHistory {
  date: string
  price: number
  volume: number
}

export interface MarketOverview {
  totalMarketCap: number | null
  totalVolume24h: number | null
  btcDominance: number | null
  ethDominance: number | null
  activeCryptocurrencies: number | null
  marketCapChangePercent24h: number | null
}

export interface CryptoApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
}
