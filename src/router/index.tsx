import { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'

import ProductListPage from '../pages/ProductList/ProductList'
import ProductDetailPage from '../pages/ProductDetail/ProductDetail'
import Register from '../pages/Register/Register'
import AdminLogin from '../pages/Admin/AdminLogin'
import AdminUsers from '../pages/Admin/AdminUsers'
import AdminCategories from '../pages/Admin/AdminCategories'
import AdminProducts from '../pages/Admin/AdminProducts'
import AdminOrders from '../pages/Admin/AdminOrders'
import { useAuth } from '../store/AuthContext'
import CartPage from '../pages/Cart/Cart'
import CheckoutPage from '../pages/Checkout/Checkout'
import OrderPage from '../pages/Order/Order'
import ShippingAddressPage from '../pages/ShippingAddress/ShippingAddress'
import NotFoundPage from '../pages/NotFound/NotFound'

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()

  return user ? <Navigate replace to="/" /> : children
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()

  return user ? children : <Navigate replace to="/login" />
}

function AdminProtectedRoute({ children }: { children: ReactElement }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  return isAdmin ? children : <Navigate replace to="/admin" />
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
      <Route
        path="/shipping-address"
        element={
          <ProtectedRoute>
            <ShippingAddressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/red_wine" element={<Navigate replace to="/wines/red-wine" />} />
      <Route path="/white_wine" element={<Navigate replace to="/wines/white-wine" />} />
      <Route path="/champagne" element={<Navigate replace to="/wines/champagne" />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
      <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
      <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />

    </Routes>
  )
}
