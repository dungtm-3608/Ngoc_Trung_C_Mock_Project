import { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import ProductListPage from '../pages/ProductList/ProductList'
import { useAuth } from '../store/AuthContext'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()

  return user ? children : <Navigate replace to="/login" />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wines"
        element={
          <ProtectedRoute>
            <ProductListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wines/:categorySlug"
        element={
          <ProtectedRoute>
            <ProductListPage />
          </ProtectedRoute>
        }
      />
      <Route path="/red_wine" element={<Navigate replace to="/wines/red-wine" />} />
      <Route path="/white_wine" element={<Navigate replace to="/wines/white-wine" />} />
      <Route path="/champagne" element={<Navigate replace to="/wines/champagne" />} />
    </Routes>
  )
}
