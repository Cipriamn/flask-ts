import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchTopGainers, fetchTopLosers } from '../api/stocks'
import { formatCurrency, formatPercentage } from '../utils/format'
import { TopMoversSkeleton } from './Skeleton'

function TopMovers() {
  const { data: gainers, isLoading: loadingGainers } = useQuery({
    queryKey: ['topGainers'],
    queryFn: () => fetchTopGainers(10),
  })

  const { data: losers, isLoading: loadingLosers } = useQuery({
    queryKey: ['topLosers'],
    queryFn: () => fetchTopLosers(10),
  })

  if (loadingGainers || loadingLosers) {
    return <TopMoversSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Top Gainers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Top Gainers</h2>
        </div>
        <div className="space-y-1">
          {gainers?.map((stock, index) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center justify-between hover:bg-green-50 p-2.5 rounded-lg -mx-2 transition-all group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-4">{index + 1}</span>
                <div>
                  <span className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {stock.symbol}
                  </span>
                  {stock.name && (
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900 tabular-nums">
                  {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
                </span>
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-semibold text-green-600 tabular-nums">
                    +{stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {(!gainers || gainers.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">No gainers data available</p>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Top Losers</h2>
        </div>
        <div className="space-y-1">
          {losers?.map((stock, index) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center justify-between hover:bg-red-50 p-2.5 rounded-lg -mx-2 transition-all group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-4">{index + 1}</span>
                <div>
                  <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                    {stock.symbol}
                  </span>
                  {stock.name && (
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900 tabular-nums">
                  {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
                </span>
                <div className="flex items-center justify-end gap-1">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-sm font-semibold text-red-600 tabular-nums">
                    {stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {(!losers || losers.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">No losers data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopMovers
