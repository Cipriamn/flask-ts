import { Outlet, Link, useLocation } from 'react-router-dom'
import { TrendingUp, BarChart3, Github } from 'lucide-react'

function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg px-1"
            >
              <div className="p-1.5 bg-primary-100 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">S&P 500 Watcher</span>
              <span className="sm:hidden">S&P 500</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                  isHome
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <a
                href="https://github.com/Cipriamn/flask-ts"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                aria-label="View source on GitHub"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>S&P 500 Stock Market Watcher</p>
            <p className="text-xs">
              Data provided by Yahoo Finance. Not for trading decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
