import TopMovers from '../components/TopMovers'
import StockList from '../components/StockList'

function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">S&P 500 Dashboard</h1>
        <p className="text-gray-600">
          Real-time stock market data for S&P 500 companies
        </p>
      </div>

      <TopMovers />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Stocks</h2>
        <StockList />
      </div>
    </div>
  )
}

export default HomePage
