import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Crypto } from '../types/crypto'
import { formatCryptoPrice, formatPercentage, formatMarketCap } from '../utils/format'

interface CryptoCardProps {
  crypto: Crypto
}

function CryptoCard({ crypto }: CryptoCardProps) {
  const isPositive = crypto.changePercent24h !== null && crypto.changePercent24h > 0
  const isNegative = crypto.changePercent24h !== null && crypto.changePercent24h < 0

  return (
    <Link
      to={`/crypto/${crypto.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:border-primary-200 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`View details for ${crypto.name}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <div className="flex items-center gap-2">
            {crypto.image && (
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-8 h-8 rounded-full"
                loading="lazy"
              />
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                {crypto.symbol}
              </h3>
              <p className="text-sm text-gray-600 truncate" title={crypto.name}>
                {crypto.name}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            {crypto.rank && <span>Rank #{crypto.rank}</span>}
            {crypto.marketCap && (
              <>
                <span>|</span>
                <span>{formatMarketCap(crypto.marketCap)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-lg tabular-nums">
            {crypto.price !== null ? formatCryptoPrice(crypto.price) : 'N/A'}
          </p>
          <div
            className={`flex items-center justify-end gap-1 text-sm font-medium ${
              isPositive
                ? 'text-green-600'
                : isNegative
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
            <span className="tabular-nums">
              {crypto.changePercent24h !== null ? formatPercentage(crypto.changePercent24h) : 'N/A'}
            </span>
          </div>
          {crypto.changePercent7d !== null && (
            <p className={`text-xs mt-1 ${crypto.changePercent7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              7d: {formatPercentage(crypto.changePercent7d)}
            </p>
          )}
        </div>
      </div>

      {/* Subtle progress bar showing relative daily movement */}
      {crypto.changePercent24h !== null && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-gray-300'
            }`}
            style={{
              width: `${Math.min(Math.abs(crypto.changePercent24h) * 5, 100)}%`,
            }}
          />
        </div>
      )}
    </Link>
  )
}

export default CryptoCard
