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
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{stock.symbol}</h3>
          {stock.marketCap && (
            <p className="text-sm text-gray-500">
              {formatMarketCap(stock.marketCap)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">
            {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
          </p>
          <div
            className={`flex items-center justify-end gap-1 text-sm ${
              isPositive
                ? 'text-green-600'
                : isNegative
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
            <span>
              {stock.change !== null ? formatCurrency(stock.change) : 'N/A'}
              {' '}
              ({stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'})
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StockCard
