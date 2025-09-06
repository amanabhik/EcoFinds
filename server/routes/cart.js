import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
  try {
    const cartItems = Array.from(db.cart.entries())
      .filter(([id, cartItem]) => cartItem.user_id === req.user.id)
      .map(([cartId, cartItem]) => {
        const product = db.products.get(cartItem.product_id)
        const seller = db.users.get(product?.seller_id)
        
        if (!product) return null
        
        return {
          id: cartItem.product_id,
          cart_id: cartId,
          ...product,
          seller_username: seller ? seller.username : 'Unknown'
        }
      })
      .filter(item => item !== null)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    res.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add item to cart
router.post('/', authenticateToken, (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.user.id

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Check if product exists
    const product = db.products.get(parseInt(productId))
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if user is trying to add their own product
    if (product.seller_id === userId) {
      return res.status(400).json({ message: 'Cannot add your own product to cart' })
    }

    // Check if item is already in cart
    const existingItem = Array.from(db.cart.values()).find(
      cartItem => cartItem.user_id === userId && cartItem.product_id === parseInt(productId)
    )
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in cart' })
    }

    // Add to cart
    const cartId = db.generateId()
    db.cart.set(cartId, {
      user_id: userId,
      product_id: parseInt(productId),
      created_at: new Date().toISOString()
    })

    res.status(201).json({ message: 'Item added to cart successfully' })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Remove item from cart
router.delete('/:productId', authenticateToken, (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.user.id

    let removed = false
    for (const [cartId, cartItem] of db.cart) {
      if (cartItem.user_id === userId && cartItem.product_id === parseInt(productId)) {
        db.cart.delete(cartId)
        removed = true
        break
      }
    }

    if (!removed) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    res.json({ message: 'Item removed from cart successfully' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Clear cart
router.delete('/', authenticateToken, (req, res) => {
  try {
    for (const [cartId, cartItem] of db.cart) {
      if (cartItem.user_id === req.user.id) {
        db.cart.delete(cartId)
      }
    }
    res.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router