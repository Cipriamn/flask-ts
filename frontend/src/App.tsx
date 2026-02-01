import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import StockDetailPage from './pages/StockDetailPage'
import CryptoPage from './pages/CryptoPage'
import CryptoDetailPage from './pages/CryptoDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/stock/:symbol" element={<StockDetailPage />} />
        <Route path="/crypto" element={<CryptoPage />} />
        <Route path="/crypto/:cryptoId" element={<CryptoDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
