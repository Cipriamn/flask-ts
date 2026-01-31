import type { Stock, StockDetails, StockHistory, ApiResponse } from '../types/stock'

const API_BASE = '/api/stocks'

export async function fetchStocks(): Promise<Stock[]> {
  const response = await fetch(`${API_BASE}/`)
  const data: ApiResponse<Stock[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch stocks')
  }

  return data.data
}

export async function fetchStockDetails(symbol: string): Promise<StockDetails> {
  const response = await fetch(`${API_BASE}/${symbol}`)
  const data: ApiResponse<StockDetails> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch stock details')
  }

  return data.data
}

export async function fetchStockHistory(
  symbol: string,
  period: string = '1mo',
  interval: string = '1d'
): Promise<StockHistory[]> {
  const response = await fetch(`${API_BASE}/${symbol}/history?period=${period}&interval=${interval}`)
  const data: ApiResponse<StockHistory[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch stock history')
  }

  return data.data
}

export async function fetchTopGainers(limit: number = 10): Promise<Stock[]> {
  const response = await fetch(`${API_BASE}/gainers?limit=${limit}`)
  const data: ApiResponse<Stock[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch top gainers')
  }

  return data.data
}

export async function fetchTopLosers(limit: number = 10): Promise<Stock[]> {
  const response = await fetch(`${API_BASE}/losers?limit=${limit}`)
  const data: ApiResponse<Stock[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch top losers')
  }

  return data.data
}
