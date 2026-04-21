import { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
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
    </Routes>

  )
}
