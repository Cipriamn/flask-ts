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
} from 'recharts'
import { fetchStockHistory } from '../api/stocks'
import { ChartSkeleton } from './Skeleton'

interface StockChartProps {
  symbol: string
}

const PERIODS = [
  { label: '1D', value: '1d', interval: '5m' },
  { label: '5D', value: '5d', interval: '15m' },
  { label: '1M', value: '1mo', interval: '1d' },
  { label: '3M', value: '3mo', interval: '1d' },
  { label: '6M', value: '6mo', interval: '1d' },
  { label: '1Y', value: '1y', interval: '1wk' },
  { label: '5Y', value: '5y', interval: '1mo' },
]

function StockChart({ symbol }: StockChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[2]) // Default to 1M

  const { data: history, isLoading, isFetching } = useQuery({
    queryKey: ['stockHistory', symbol, selectedPeriod.value, selectedPeriod.interval],
    queryFn: () => fetchStockHistory(symbol, selectedPeriod.value, selectedPeriod.interval),
  })

  const chartData = useMemo(() => {
    return history?.map((item) => ({
      date: item.date,
      price: item.close,
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
  const fillColor = isPositive ? 'url(#greenGradient)' : 'url(#redGradient)'

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

      <div className={`h-72 ${isFetching && !isLoading ? 'opacity-60' : ''} transition-opacity`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
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
                return selectedPeriod.value === '1d' || selectedPeriod.value === '5d'
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
              }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
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
      </div>

      {chartData.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No chart data available for the selected period
        </div>
      )}
    </div>
  )
}

export default StockChart
