import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchTopGainers, fetchTopLosers } from '../api/stocks'
import { formatCurrency, formatPercentage } from '../utils/format'
import LoadingSpinner from './LoadingSpinner'

function TopMovers() {
  const { data: gainers, isLoading: loadingGainers } = useQuery({
    queryKey: ['topGainers'],
    queryFn: () => fetchTopGainers(5),
  })

  const { data: losers, isLoading: loadingLosers } = useQuery({
    queryKey: ['topLosers'],
    queryFn: () => fetchTopLosers(5),
  })

  if (loadingGainers || loadingLosers) {
    return <LoadingSpinner message="Loading market movers..." />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Top Gainers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-900">Top Gainers</h2>
        </div>
        <div className="space-y-3">
          {gainers?.map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded -mx-2 transition-colors"
            >
              <span className="font-medium">{stock.symbol}</span>
              <div className="text-right">
                <span className="text-sm text-gray-900">
                  {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
                </span>
                <span className="ml-2 text-sm text-green-600">
                  +{stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-gray-900">Top Losers</h2>
        </div>
        <div className="space-y-3">
          {losers?.map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded -mx-2 transition-colors"
            >
              <span className="font-medium">{stock.symbol}</span>
              <div className="text-right">
                <span className="text-sm text-gray-900">
                  {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
                </span>
                <span className="ml-2 text-sm text-red-600">
                  {stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopMovers
