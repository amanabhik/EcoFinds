import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Checkout (create order from cart)
router.post('/checkout', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id

    // Get cart items
    const cartItems = Array.from(db.cart.entries())
      .filter(([id, cartItem]) => cartItem.user_id === userId)
      .map(([cartId, cartItem]) => {
        const product = db.products.get(cartItem.product_id)
        return product ? { ...product, cart_id: cartId } : null
      })
      .filter(item => item !== null)

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)

    // Create order
    const orderId = db.generateId()
    db.orders.set(orderId, {
      user_id: userId,
      total_amount: totalAmount,
      status: 'completed',
      created_at: new Date().toISOString()
    })

    // Create order items
    cartItems.forEach(item => {
      const orderItemId = db.generateId()
      db.orderItems.set(orderItemId, {
        order_id: orderId,
        product_id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        created_at: new Date().toISOString()
      })
    })

    // Clear cart
    for (const [cartId, cartItem] of db.cart) {
      if (cartItem.user_id === userId) {
        db.cart.delete(cartId)
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      totalAmount
    })
  } catch (error) {
    console.error('Error during checkout:', error)
    res.status(500).json({ message: 'Server error during checkout' })
  }
})

// Get user's purchase history
router.get('/my-purchases', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id

    // Get orders
    const orders = Array.from(db.orders.entries())
      .filter(([id, order]) => order.user_id === userId)
      .map(([id, order]) => ({ id, ...order }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    // Get items for each order
    const ordersWithItems = orders.map(order => {
      const items = Array.from(db.orderItems.entries())
        .filter(([id, item]) => item.order_id === order.id)
        .map(([id, item]) => ({ id, ...item }))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

      return {
        ...order,
        items
      }
    })

    res.json(ordersWithItems)
  } catch (error) {
    console.error('Error fetching purchase history:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single order
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const orderId = parseInt(id)

    // Get order
    const order = db.orders.get(orderId)
    if (!order || order.user_id !== userId) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Get order items
    const items = Array.from(db.orderItems.entries())
      .filter(([id, item]) => item.order_id === orderId)
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    res.json({
      id: orderId,
      ...order,
      items
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router