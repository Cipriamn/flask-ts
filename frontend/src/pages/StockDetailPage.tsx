import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { fetchStockDetails } from '../api/stocks'
import StockChart from '../components/StockChart'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { formatCurrency, formatPercentage, formatMarketCap, formatVolume } from '../utils/format'

function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>()

  const {
    data: stock,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => fetchStockDetails(symbol!),
    enabled: !!symbol,
  })

  if (isLoading) {
    return <LoadingSpinner message={`Loading ${symbol} details...`} />
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load stock details'}
        onRetry={() => refetch()}
      />
    )
  }

  if (!stock) {
    return <ErrorMessage message="Stock not found" />
  }

  const isPositive = stock.change !== null && stock.change > 0
  const isNegative = stock.change !== null && stock.change < 0

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{stock.symbol}</h1>
            <p className="text-lg text-gray-600">{stock.name}</p>
            {stock.sector && (
              <p className="text-sm text-gray-500">
                {stock.sector} · {stock.industry}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {stock.price !== null ? formatCurrency(stock.price) : 'N/A'}
            </p>
            <div
              className={`flex items-center justify-end gap-1 text-lg ${
                isPositive
                  ? 'text-green-600'
                  : isNegative
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {isPositive && <TrendingUp className="w-5 h-5" />}
              {isNegative && <TrendingDown className="w-5 h-5" />}
              {!isPositive && !isNegative && <Minus className="w-5 h-5" />}
              <span>
                {stock.change !== null ? formatCurrency(stock.change) : 'N/A'}
                {' '}
                ({stock.changePercent !== null ? formatPercentage(stock.changePercent) : 'N/A'})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Open" value={stock.open !== null ? formatCurrency(stock.open) : 'N/A'} />
          <Stat label="Previous Close" value={stock.previousClose !== null ? formatCurrency(stock.previousClose) : 'N/A'} />
          <Stat label="Day High" value={stock.dayHigh !== null ? formatCurrency(stock.dayHigh) : 'N/A'} />
          <Stat label="Day Low" value={stock.dayLow !== null ? formatCurrency(stock.dayLow) : 'N/A'} />
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-2">About {stock.name}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{stock.description}</p>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}

export default StockDetailPage
