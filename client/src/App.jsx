import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Login from './pages/Login'
import ProductFeed from './pages/ProductFeed'
import AddProduct from './pages/AddProduct'
import MyListings from './pages/MyListings'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import PreviousPurchases from './pages/PreviousPurchases'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header />}
      <main className={user ? "pt-16" : ""}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <ProductFeed />
            </ProtectedRoute>
          } />
          <Route path="/add-product" element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route path="/my-listings" element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute>
              <PreviousPurchases />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App