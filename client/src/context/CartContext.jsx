import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/cart')
      setCartItems(response.data)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId })
      await fetchCart()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add to cart' 
      }
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/${productId}`)
      await fetchCart()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove from cart' 
      }
    }
  }

  const checkout = async () => {
    try {
      await axios.post('/api/orders/checkout')
      setCartItems([])
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Checkout failed' 
      }
    }
  }

  const value = {
    cartItems,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}