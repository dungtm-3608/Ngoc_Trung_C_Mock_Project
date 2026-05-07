import { BrowserRouter, useLocation } from 'react-router-dom'

import AppRouter from './router'
import { AuthProvider } from './store/AuthContext'
import { CartProvider } from './store/CartContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'


function ConditionalHeader() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) return null
  return <Header />
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ConditionalHeader />
          <AppRouter />
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
