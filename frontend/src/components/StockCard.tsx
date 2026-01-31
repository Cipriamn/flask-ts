import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Stock } from '../types/stock'
import { formatCurrency, formatPercentage, formatMarketCap } from '../utils/format'

interface StockCardProps {
  stock: Stock
}

function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change !== null && stock.change > 0
  const isNegative = stock.change !== null && stock.change < 0

  return (
    <Link
      to={`/stock/${stock.symbol}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:border-primary-200 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`View details for ${stock.name || stock.symbol}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
            {stock.symbol}
          </h3>
          {stock.name && (
            <p className="text-sm text-gray-600 truncate" title={stock.name}>
              {stock.name}
            </p>
          )}
          {stock.marketCap && (
            <p className="text-xs text-gray-400 mt-1">
              {formatMarketCap(stock.marketCap)}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-lg tabular-nums">
            {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
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
              {stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Subtle progress bar showing relative daily movement */}
      {stock.changePercent !== null && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-gray-300'
            }`}
            style={{
              width: `${Math.min(Math.abs(stock.changePercent) * 10, 100)}%`,
            }}
          />
        </div>
      )}
    </Link>
  )
}

export default StockCard
