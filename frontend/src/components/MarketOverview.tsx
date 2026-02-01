import { useQuery } from '@tanstack/react-query'
import { Globe, TrendingUp, TrendingDown, DollarSign, Activity, PieChart } from 'lucide-react'
import { fetchMarketOverview } from '../api/crypto'
import { formatMarketCap, formatPercentage } from '../utils/format'

function MarketOverview() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['marketOverview'],
    queryFn: fetchMarketOverview,
    staleTime: 120000, // 2 minutes
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (!overview) return null

  const isMarketUp = (overview.marketCapChangePercent24h ?? 0) >= 0

  const stats = [
    {
      label: 'Total Market Cap',
      value: overview.totalMarketCap ? formatMarketCap(overview.totalMarketCap) : 'N/A',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '24h Volume',
      value: overview.totalVolume24h ? formatMarketCap(overview.totalVolume24h) : 'N/A',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: '24h Change',
      value: overview.marketCapChangePercent24h !== null
        ? formatPercentage(overview.marketCapChangePercent24h)
        : 'N/A',
      icon: isMarketUp ? TrendingUp : TrendingDown,
      color: isMarketUp ? 'text-green-600' : 'text-red-600',
      bgColor: isMarketUp ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'BTC Dominance',
      value: overview.btcDominance ? `${overview.btcDominance.toFixed(1)}%` : 'N/A',
      icon: PieChart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'ETH Dominance',
      value: overview.ethDominance ? `${overview.ethDominance.toFixed(1)}%` : 'N/A',
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Active Cryptos',
      value: overview.activeCryptocurrencies?.toLocaleString() || 'N/A',
      icon: DollarSign,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
          </div>
          <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export default MarketOverview
