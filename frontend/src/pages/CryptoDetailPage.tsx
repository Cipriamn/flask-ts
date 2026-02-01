import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, RefreshCw, ExternalLink } from 'lucide-react'
import { fetchCryptoDetails } from '../api/crypto'
import CryptoChart from '../components/CryptoChart'
import ErrorMessage from '../components/ErrorMessage'
import { CryptoDetailSkeleton } from '../components/Skeleton'
import { formatCryptoPrice, formatPercentage, formatMarketCap, formatSupply } from '../utils/format'

function CryptoDetailPage() {
  const { cryptoId } = useParams<{ cryptoId: string }>()
  const navigate = useNavigate()

  const {
    data: crypto,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['cryptoDetails', cryptoId],
    queryFn: () => fetchCryptoDetails(cryptoId!),
    enabled: !!cryptoId,
  })

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate('/crypto')
    }
  }

  if (isLoading) {
    return <CryptoDetailSkeleton />
  }

  if (isError) {
    return (
      <div>
        <Link
          to="/crypto"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crypto Dashboard
        </Link>
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load cryptocurrency details'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!crypto) {
    return (
      <div>
        <Link
          to="/crypto"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crypto Dashboard
        </Link>
        <ErrorMessage message="Cryptocurrency not found" />
      </div>
    )
  }

  const isPositive = crypto.changePercent24h !== null && crypto.changePercent24h > 0
  const isNegative = crypto.changePercent24h !== null && crypto.changePercent24h < 0

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/crypto"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crypto Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Refresh crypto data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <a
            href={`https://www.coingecko.com/en/coins/${cryptoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`View ${crypto.name} on CoinGecko`}
          >
            CoinGecko
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {crypto.image && (
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{crypto.symbol}</h1>
                {crypto.rank && (
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                    Rank #{crypto.rank}
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600">{crypto.name}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold tabular-nums">
              {crypto.price !== null ? formatCryptoPrice(crypto.price) : 'N/A'}
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
                {crypto.changePercent24h !== null ? formatPercentage(crypto.changePercent24h) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <Stat label="24h High" value={crypto.high24h !== null ? formatCryptoPrice(crypto.high24h) : 'N/A'} highlight={isPositive ? 'green' : undefined} />
          <Stat label="24h Low" value={crypto.low24h !== null ? formatCryptoPrice(crypto.low24h) : 'N/A'} highlight={isNegative ? 'red' : undefined} />
          <Stat label="7d Change" value={crypto.changePercent7d !== null ? formatPercentage(crypto.changePercent7d) : 'N/A'} highlight={crypto.changePercent7d !== null && crypto.changePercent7d >= 0 ? 'green' : 'red'} />
          <Stat label="30d Change" value={crypto.changePercent30d !== null ? formatPercentage(crypto.changePercent30d) : 'N/A'} highlight={crypto.changePercent30d !== null && crypto.changePercent30d >= 0 ? 'green' : 'red'} />
          <Stat label="Market Cap" value={crypto.marketCap !== null ? formatMarketCap(crypto.marketCap) : 'N/A'} />
          <Stat label="24h Volume" value={crypto.volume24h !== null ? formatMarketCap(crypto.volume24h) : 'N/A'} />
          <Stat label="Circulating Supply" value={crypto.circulatingSupply !== null ? formatSupply(crypto.circulatingSupply) + ' ' + crypto.symbol : 'N/A'} />
          <Stat label="Max Supply" value={crypto.maxSupply !== null ? formatSupply(crypto.maxSupply) + ' ' + crypto.symbol : 'Unlimited'} />
          <Stat label="All-Time High" value={crypto.ath !== null ? formatCryptoPrice(crypto.ath) : 'N/A'} />
          <Stat label="ATH Change" value={crypto.athChangePercent !== null ? formatPercentage(crypto.athChangePercent) : 'N/A'} highlight="red" />
          <Stat label="All-Time Low" value={crypto.atl !== null ? formatCryptoPrice(crypto.atl) : 'N/A'} />
          <Stat label="Total Supply" value={crypto.totalSupply !== null ? formatSupply(crypto.totalSupply) + ' ' + crypto.symbol : 'N/A'} />
        </div>
      </div>

      <CryptoChart cryptoId={cryptoId!} />

      {crypto.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-gray-900 mb-3">About {crypto.name}</h2>
          <p className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: crypto.description }} />
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

export default CryptoDetailPage
