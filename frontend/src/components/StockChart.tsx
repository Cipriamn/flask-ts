import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchStockHistory } from '../api/stocks'
import LoadingSpinner from './LoadingSpinner'

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

  const { data: history, isLoading } = useQuery({
    queryKey: ['stockHistory', symbol, selectedPeriod.value, selectedPeriod.interval],
    queryFn: () => fetchStockHistory(symbol, selectedPeriod.value, selectedPeriod.interval),
  })

  if (isLoading) {
    return <LoadingSpinner message="Loading chart..." />
  }

  const chartData = history?.map((item) => ({
    date: item.date,
    price: item.close,
  }))

  const minPrice = chartData ? Math.min(...chartData.map((d) => d.price)) * 0.99 : 0
  const maxPrice = chartData ? Math.max(...chartData.map((d) => d.price)) * 1.01 : 100

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Price History</h3>
        <div className="flex gap-1">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded ${
                selectedPeriod.value === period.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return selectedPeriod.value === '1d' || selectedPeriod.value === '5d'
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
              }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StockChart
