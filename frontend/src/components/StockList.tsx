import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, RefreshCw } from 'lucide-react'
import { fetchStocks } from '../api/stocks'
import StockCard from './StockCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

function StockList() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: stocks,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
  })

  const filteredStocks = stocks?.filter((stock) =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <LoadingSpinner message="Loading S&P 500 stocks..." />
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load stocks'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStocks?.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {filteredStocks?.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No stocks found matching "{searchTerm}"
        </p>
      )}
    </div>
  )
}

export default StockList
