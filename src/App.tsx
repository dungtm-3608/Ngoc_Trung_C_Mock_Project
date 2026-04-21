import { BrowserRouter } from 'react-router-dom'

import AppRouter from './router'
import { AuthProvider } from './store/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'


export default function App() {
  console.log('App: render')
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <AppRouter />
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  )
}
