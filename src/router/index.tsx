import { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'

import ProductListPage from '../pages/ProductList/ProductList'
import ProductDetailPage from '../pages/ProductDetail/ProductDetail'
import Register from '../pages/Register/Register'
import { useAuth } from '../store/AuthContext'
import CartPage from '../pages/Cart/Cart'
import CheckoutPage from '../pages/Checkout/Checkout'

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()

  return user ? <Navigate replace to="/" /> : children
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()

  return user ? children : <Navigate replace to="/login" />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/"
        element={
            <Home />
        }
      />
      <Route
        path="/wines"
        element={
          <ProductListPage />
        }
      />
      <Route
        path="/wines/:categorySlug"
        element={
          <ProductListPage />
        }
      />
      <Route
        path="/wines/:categorySlug/:wineId"
        element={
          <ProductDetailPage />
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route path="/red_wine" element={<Navigate replace to="/wines/red-wine" />} />
      <Route path="/white_wine" element={<Navigate replace to="/wines/white-wine" />} />
      <Route path="/champagne" element={<Navigate replace to="/wines/champagne" />} />
    </Routes>
  )
}
