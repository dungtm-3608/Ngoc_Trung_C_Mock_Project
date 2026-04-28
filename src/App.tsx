import { BrowserRouter } from 'react-router-dom'

import AppRouter from './router'
import { AuthProvider } from './store/AuthContext'
import { CartProvider } from './store/CartContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <AppRouter />
          <Footer/>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
