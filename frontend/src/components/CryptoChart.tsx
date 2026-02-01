import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
} from 'recharts'
import { fetchCryptoHistory } from '../api/crypto'
import { ChartSkeleton } from './Skeleton'
import { formatCryptoPrice, formatVolume } from '../utils/format'

interface CryptoChartProps {
  cryptoId: string
}

const PERIODS = [
  { label: '24H', value: '1' },
  { label: '7D', value: '7' },
  { label: '14D', value: '14' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
  { label: '1Y', value: '365' },
]

function CryptoChart({ cryptoId }: CryptoChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[3]) // Default to 30D
  const [showVolume, setShowVolume] = useState(false)

  const { data: history, isLoading, isFetching } = useQuery({
    queryKey: ['cryptoHistory', cryptoId, selectedPeriod.value],
    queryFn: () => fetchCryptoHistory(cryptoId, selectedPeriod.value),
  })

  const chartData = useMemo(() => {
    return history?.map((item) => ({
      date: item.date,
      price: item.price,
      volume: item.volume,
    })) || []
  }, [history])

  const { minPrice, maxPrice, isPositive } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { minPrice: 0, maxPrice: 100, isPositive: true }
    }
    const prices = chartData.map((d) => d.price)
    const firstPrice = chartData[0]?.price || 0
    const lastPrice = chartData[chartData.length - 1]?.price || 0
    const change = lastPrice - firstPrice
    return {
      minPrice: Math.min(...prices) * 0.99,
      maxPrice: Math.max(...prices) * 1.01,
      isPositive: change >= 0,
    }
  }, [chartData])

  if (isLoading) {
    return <ChartSkeleton />
  }

  const strokeColor = isPositive ? '#16a34a' : '#dc2626'
  const fillColor = isPositive ? 'url(#cryptoGreenGradient)' : 'url(#cryptoRedGradient)'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Price History</h3>
          {isFetching && !isLoading && (
            <span className="text-xs text-primary-600 animate-pulse">Updating...</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                selectedPeriod.value === period.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
              aria-pressed={selectedPeriod.value === period.value}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle between price and volume */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowVolume(false)}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${
            !showVolume
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Price
        </button>
        <button
          onClick={() => setShowVolume(true)}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${
            showVolume
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Volume
        </button>
      </div>

      <div className={`h-72 ${isFetching && !isLoading ? 'opacity-60' : ''} transition-opacity`}>
        {!showVolume ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cryptoGreenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="cryptoRedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return selectedPeriod.value === '1'
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCryptoPrice(value)}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [formatCryptoPrice(value), 'Price']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                cursor={{ stroke: '#9ca3af', strokeDasharray: '5 5' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill={fillColor}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatVolume(value)}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [`$${formatVolume(value)}`, 'Volume']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Bar dataKey="volume" fill="#6366f1" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartData.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No chart data available for the selected period
        </div>
      )}
    </div>
  )
}

export default CryptoChart
