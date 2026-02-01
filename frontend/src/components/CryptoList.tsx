import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchCryptos } from '../api/crypto'
import CryptoCard from './CryptoCard'
import { CardSkeleton } from './Skeleton'
import ErrorMessage from './ErrorMessage'

const ITEMS_PER_PAGE = 12

function CryptoList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: cryptos, isLoading, error, refetch } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptos,
    staleTime: 60000, // 1 minute
  })

  const filteredCryptos = useMemo(() => {
    if (!cryptos) return []
    if (!searchTerm) return cryptos

    const term = searchTerm.toLowerCase()
    return cryptos.filter(
      (crypto) =>
        crypto.symbol.toLowerCase().includes(term) ||
        crypto.name.toLowerCase().includes(term)
    )
  }, [cryptos, searchTerm])

  const totalPages = Math.ceil(filteredCryptos.length / ITEMS_PER_PAGE)
  const paginatedCryptos = filteredCryptos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm])

  if (error) {
    return <ErrorMessage message="Failed to load cryptocurrencies" onRetry={refetch} />
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          aria-label="Search cryptocurrencies"
        />
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {paginatedCryptos.length} of {filteredCryptos.length} cryptocurrencies
      </p>

      {/* Crypto Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedCryptos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCryptos.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No cryptocurrencies found matching "{searchTerm}"
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CryptoList
