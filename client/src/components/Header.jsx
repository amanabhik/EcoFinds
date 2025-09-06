import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { 
  Home, 
  Plus, 
  List, 
  User, 
  ShoppingCart, 
  History, 
  LogOut,
  Leaf
} from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">EcoFinds</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/add-product" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/add-product') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Sell</span>
            </Link>
            
            <Link 
              to="/my-listings" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/my-listings') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <List className="h-4 w-4" />
              <span>My Listings</span>
            </Link>
            
            <Link 
              to="/cart" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium relative ${
                isActive('/cart') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            <Link 
              to="/purchases" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/purchases') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Purchases</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:block">{user?.username}</span>
            </Link>
            
            <button 
              onClick={logout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-50 border-t">
        <div className="flex justify-around py-2">
          <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary-600' : 'text-gray-600'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/add-product" className={`flex flex-col items-center p-2 ${isActive('/add-product') ? 'text-primary-600' : 'text-gray-600'}`}>
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Sell</span>
          </Link>
          <Link to="/my-listings" className={`flex flex-col items-center p-2 ${isActive('/my-listings') ? 'text-primary-600' : 'text-gray-600'}`}>
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">Listings</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center p-2 relative ${isActive('/cart') ? 'text-primary-600' : 'text-gray-600'}`}>
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs mt-1">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link to="/dashboard" className={`flex flex-col items-center p-2 ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-600'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header