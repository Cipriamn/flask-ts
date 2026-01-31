import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, RefreshCw, ExternalLink } from 'lucide-react'
import { fetchStockDetails } from '../api/stocks'
import StockChart from '../components/StockChart'
import ErrorMessage from '../components/ErrorMessage'
import { StockDetailSkeleton } from '../components/Skeleton'
import { formatCurrency, formatPercentage, formatMarketCap, formatVolume } from '../utils/format'

function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>()
  const navigate = useNavigate()

  const {
    data: stock,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => fetchStockDetails(symbol!),
    enabled: !!symbol,
  })

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate('/')
    }
  }

  if (isLoading) {
    return <StockDetailSkeleton />
  }

  if (isError) {
    return (
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load stock details'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!stock) {
    return (
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <ErrorMessage message="Stock not found" />
      </div>
    )
  }

  const isPositive = stock.change !== null && stock.change > 0
  const isNegative = stock.change !== null && stock.change < 0

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Refresh stock data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <a
            href={`https://finance.yahoo.com/quote/${symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`View ${symbol} on Yahoo Finance`}
          >
            Yahoo Finance
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{stock.symbol}</h1>
              {stock.sector && (
                <span className="px-2.5 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                  {stock.sector}
                </span>
              )}
            </div>
            <p className="text-lg text-gray-600">{stock.name}</p>
            {stock.industry && (
              <p className="text-sm text-gray-500 mt-1">{stock.industry}</p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold tabular-nums">
              {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
            </p>
            <div
              className={`inline-flex items-center gap-1.5 text-lg font-medium px-2 py-0.5 rounded-lg ${
                isPositive
                  ? 'text-green-700 bg-green-50'
                  : isNegative
                  ? 'text-red-700 bg-red-50'
                  : 'text-gray-600 bg-gray-50'
              }`}
            >
              {isPositive && <TrendingUp className="w-5 h-5" />}
              {isNegative && <TrendingDown className="w-5 h-5" />}
              {!isPositive && !isNegative && <Minus className="w-5 h-5" />}
              <span className="tabular-nums">
                {stock.change !== null ? formatCurrency(stock.change) : 'N/A'}
                {' '}
                ({stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <Stat label="Open" value={stock.open !== null ? formatCurrency(stock.open) : 'N/A'} />
          <Stat label="Previous Close" value={stock.previousClose !== null ? formatCurrency(stock.previousClose) : 'N/A'} />
          <Stat label="Day High" value={stock.dayHigh !== null ? formatCurrency(stock.dayHigh) : 'N/A'} highlight={isPositive ? 'green' : undefined} />
          <Stat label="Day Low" value={stock.dayLow !== null ? formatCurrency(stock.dayLow) : 'N/A'} highlight={isNegative ? 'red' : undefined} />
          <Stat label="52 Week High" value={stock.week52High !== null ? formatCurrency(stock.week52High) : 'N/A'} />
          <Stat label="52 Week Low" value={stock.week52Low !== null ? formatCurrency(stock.week52Low) : 'N/A'} />
          <Stat label="Volume" value={stock.volume !== null ? formatVolume(stock.volume) : 'N/A'} />
          <Stat label="Avg Volume" value={stock.avgVolume !== null ? formatVolume(stock.avgVolume) : 'N/A'} />
          <Stat label="Market Cap" value={stock.marketCap !== null ? formatMarketCap(stock.marketCap) : 'N/A'} />
          <Stat label="P/E Ratio" value={stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A'} />
          <Stat label="EPS" value={stock.eps !== null ? formatCurrency(stock.eps) : 'N/A'} />
          <Stat label="Beta" value={stock.beta !== null ? stock.beta.toFixed(2) : 'N/A'} />
        </div>
      </div>

      <StockChart symbol={symbol!} />

      {stock.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-gray-900 mb-3">About {stock.name}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{stock.description}</p>
        </div>
      )}

      {/* Keyboard shortcut hint */}
      <div className="mt-6 text-center text-xs text-gray-400">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-gray-500">Esc</kbd> to go back
      </div>
    </div>
  )
}

interface StatProps {
  label: string
  value: string
  highlight?: 'green' | 'red'
}

function Stat({ label, value, highlight }: StatProps) {
  return (
    <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <p className="text-sm text-gray-500 mb-0.5">{label}</p>
      <p className={`font-semibold tabular-nums ${
        highlight === 'green' ? 'text-green-600' :
        highlight === 'red' ? 'text-red-600' :
        'text-gray-900'
      }`}>
        {value}
      </p>
    </div>
  )
}

export default StockDetailPage
