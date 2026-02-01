import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchTopCryptoGainers, fetchTopCryptoLosers } from '../api/crypto'
import { formatCryptoPrice, formatPercentage } from '../utils/format'
import type { Crypto } from '../types/crypto'

function MoverCard({ crypto, type }: { crypto: Crypto; type: 'gainer' | 'loser' }) {
  const isGainer = type === 'gainer'

  return (
    <Link
      to={`/crypto/${crypto.id}`}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all hover:-translate-y-0.5"
    >
      {crypto.image && (
        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" loading="lazy" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{crypto.symbol}</p>
        <p className="text-xs text-gray-500 truncate">{crypto.name}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm tabular-nums">
          {crypto.price !== null ? formatCryptoPrice(crypto.price) : 'N/A'}
        </p>
        <p
          className={`text-sm font-medium tabular-nums flex items-center justify-end gap-1 ${
            isGainer ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isGainer ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {crypto.changePercent24h !== null ? formatPercentage(crypto.changePercent24h) : 'N/A'}
        </p>
      </div>
    </Link>
  )
}

function CryptoMovers() {
  const {
    data: gainers,
    isLoading: gainersLoading,
  } = useQuery({
    queryKey: ['cryptoGainers'],
    queryFn: () => fetchTopCryptoGainers(5),
    staleTime: 60000,
  })

  const {
    data: losers,
    isLoading: losersLoading,
  } = useQuery({
    queryKey: ['cryptoLosers'],
    queryFn: () => fetchTopCryptoLosers(5),
    staleTime: 60000,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Top Gainers (24h)</h3>
        </div>
        <div className="space-y-2">
          {gainersLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/50 rounded-lg animate-pulse" />
            ))
          ) : gainers && gainers.length > 0 ? (
            gainers.map((crypto) => (
              <MoverCard key={crypto.id} crypto={crypto} type="gainer" />
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No data available</p>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Top Losers (24h)</h3>
        </div>
        <div className="space-y-2">
          {losersLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/50 rounded-lg animate-pulse" />
            ))
          ) : losers && losers.length > 0 ? (
            losers.map((crypto) => (
              <MoverCard key={crypto.id} crypto={crypto} type="loser" />
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CryptoMovers
