import { Bitcoin } from 'lucide-react'
import MarketOverview from '../components/MarketOverview'
import CryptoMovers from '../components/CryptoMovers'
import CryptoList from '../components/CryptoList'

function CryptoPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Bitcoin className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crypto Dashboard</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Track real-time cryptocurrency market data. View price changes, market trends,
          and detailed analytics for top cryptocurrencies.
        </p>
      </div>

      <section aria-labelledby="overview-heading" className="mb-8">
        <h2 id="overview-heading" className="sr-only">Market Overview</h2>
        <MarketOverview />
      </section>

      <section aria-labelledby="movers-heading">
        <h2 id="movers-heading" className="sr-only">Market Movers</h2>
        <CryptoMovers />
      </section>

      <section aria-labelledby="cryptos-heading" className="mt-8">
        <h2 id="cryptos-heading" className="text-xl font-semibold text-gray-900 mb-4">
          All Cryptocurrencies
        </h2>
        <CryptoList />
      </section>
    </div>
  )
}

export default CryptoPage
