import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-red-50 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
