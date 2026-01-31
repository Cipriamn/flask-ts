export interface Stock {
  symbol: string
  name?: string
  price: number | null
  change: number | null
  changePercent: number | null
  marketCap: number | null
}

export interface StockDetails extends Stock {
  name: string
  sector: string | null
  industry: string | null
  previousClose: number | null
  open: number | null
  dayHigh: number | null
  dayLow: number | null
  volume: number | null
  avgVolume: number | null
  peRatio: number | null
  eps: number | null
  dividend: number | null
  beta: number | null
  week52High: number | null
  week52Low: number | null
  description: string | null
}

export interface StockHistory {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
}
