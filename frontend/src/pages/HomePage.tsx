import { Activity } from 'lucide-react'
import TopMovers from '../components/TopMovers'
import StockList from '../components/StockList'

function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Activity className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">S&P 500 Dashboard</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Track real-time stock market data for all S&P 500 companies. View price changes,
          market trends, and detailed analytics for individual stocks.
        </p>
      </div>

      <section aria-labelledby="movers-heading">
        <h2 id="movers-heading" className="sr-only">Market Movers</h2>
        <TopMovers />
      </section>

      <section aria-labelledby="stocks-heading" className="mt-8">
        <h2 id="stocks-heading" className="text-xl font-semibold text-gray-900 mb-4">
          All Stocks
        </h2>
        <StockList />
      </section>
    </div>
  )
}

export default HomePage
