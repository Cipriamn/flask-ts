import type { Crypto, CryptoDetails, CryptoHistory, MarketOverview, CryptoApiResponse } from '../types/crypto'

const API_BASE = '/api/crypto'

export async function fetchCryptos(): Promise<Crypto[]> {
  const response = await fetch(`${API_BASE}/`)
  const data: CryptoApiResponse<Crypto[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch cryptocurrencies')
  }

  return data.data
}

export async function fetchMarketOverview(): Promise<MarketOverview> {
  const response = await fetch(`${API_BASE}/market`)
  const data: CryptoApiResponse<MarketOverview> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch market overview')
  }

  return data.data
}

export async function fetchCryptoDetails(cryptoId: string): Promise<CryptoDetails> {
  const response = await fetch(`${API_BASE}/${cryptoId}`)
  const data: CryptoApiResponse<CryptoDetails> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch crypto details')
  }

  return data.data
}

export async function fetchCryptoHistory(
  cryptoId: string,
  days: string = '30'
): Promise<CryptoHistory[]> {
  const response = await fetch(`${API_BASE}/${cryptoId}/history?days=${days}`)
  const data: CryptoApiResponse<CryptoHistory[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch crypto history')
  }

  return data.data
}

export async function fetchTopCryptoGainers(limit: number = 10): Promise<Crypto[]> {
  const response = await fetch(`${API_BASE}/gainers?limit=${limit}`)
  const data: CryptoApiResponse<Crypto[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch top gainers')
  }

  return data.data
}

export async function fetchTopCryptoLosers(limit: number = 10): Promise<Crypto[]> {
  const response = await fetch(`${API_BASE}/losers?limit=${limit}`)
  const data: CryptoApiResponse<Crypto[]> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch top losers')
  }

  return data.data
}
