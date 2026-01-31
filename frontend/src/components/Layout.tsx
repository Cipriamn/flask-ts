import { Outlet, Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
              <TrendingUp className="w-6 h-6" />
              S&P 500 Watcher
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          S&P 500 Stock Market Watcher - Real-time market data
        </div>
      </footer>
    </div>
  )
}

export default Layout
