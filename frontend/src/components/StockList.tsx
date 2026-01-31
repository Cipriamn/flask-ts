import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, RefreshCw, Clock } from 'lucide-react'
import { fetchStocks } from '../api/stocks'
import StockCard from './StockCard'
import ErrorMessage from './ErrorMessage'
import { StockListSkeleton } from './Skeleton'

function StockList() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: stocks,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    refetchInterval: 60000, // Auto-refresh every minute
  })

  const filteredStocks = useMemo(() => {
    if (!stocks) return []
    const term = searchTerm.toLowerCase()
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(term) ||
        (stock.name && stock.name.toLowerCase().includes(term))
    )
  }, [stocks, searchTerm])

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symbol or company name..."
              disabled
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            />
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg opacity-50 cursor-not-allowed"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
        <StockListSkeleton />
      </div>
    )
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by symbol or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            aria-label="Search stocks"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Updated {lastUpdated}</span>
            </div>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all active:scale-95"
            aria-label={isFetching ? 'Refreshing...' : 'Refresh stocks'}
          >
            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isFetching ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {isFetching && !isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-primary-600 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Updating prices...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {filteredStocks.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No stocks found matching "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {stocks && stocks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredStocks.length} of {stocks.length} stocks
        </div>
      )}
    </div>
  )
}

export default StockList
