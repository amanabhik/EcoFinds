import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user's listings (must come before /:id route)
router.get('/my-listings', authenticateToken, (req, res) => {
  try {
    const products = Array.from(db.products.entries())
      .filter(([id, product]) => product.seller_id === req.user.id)
      .map(([id, product]) => ({ id, ...product }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    res.json(products)
  } catch (error) {
    console.error('Error fetching user listings:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all products
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, category } = req.query
    
    let products = Array.from(db.products.entries()).map(([id, product]) => {
      const seller = db.users.get(product.seller_id)
      return {
        id,
        ...product,
        seller_username: seller ? seller.username : 'Unknown'
      }
    })

    // Apply filters
    if (category && category !== 'All') {
      products = products.filter(product => product.category === category)
    }

    if (search) {
      const searchTerm = search.toLowerCase()
      products = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
    }

    // Sort by creation date
    products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single product
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const productId = parseInt(id)

    const product = db.products.get(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const seller = db.users.get(product.seller_id)
    const productWithSeller = {
      id: productId,
      ...product,
      seller_username: seller ? seller.username : 'Unknown'
    }

    res.json(productWithSeller)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create product
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, description, category, price } = req.body
    const sellerId = req.user.id

    // Validation
    if (!title || !description || !category || !price) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' })
    }

    // Create product
    const productId = db.generateId()
    const productData = {
      title,
      description,
      category,
      price: parseFloat(price),
      seller_id: sellerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    db.products.set(productId, productData)

    const seller = db.users.get(sellerId)
    const product = {
      id: productId,
      ...productData,
      seller_username: seller ? seller.username : 'Unknown'
    }

    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update product
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const { title, description, category, price } = req.body
    const userId = req.user.id
    const productId = parseInt(id)

    // Check if product exists and belongs to user
    const product = db.products.get(productId)
    if (!product || product.seller_id !== userId) {
      return res.status(404).json({ message: 'Product not found or unauthorized' })
    }

    // Validation
    if (!title || !description || !category || !price) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' })
    }

    // Update product
    const updatedProduct = {
      ...product,
      title,
      description,
      category,
      price: parseFloat(price),
      updated_at: new Date().toISOString()
    }

    db.products.set(productId, updatedProduct)

    const seller = db.users.get(userId)
    const productWithSeller = {
      id: productId,
      ...updatedProduct,
      seller_username: seller ? seller.username : 'Unknown'
    }

    res.json(productWithSeller)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete product
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const productId = parseInt(id)

    // Check if product exists and belongs to user
    const product = db.products.get(productId)
    if (!product || product.seller_id !== userId) {
      return res.status(404).json({ message: 'Product not found or unauthorized' })
    }

    // Delete product
    db.products.delete(productId)

    // Remove from all carts
    for (const [cartId, cartItem] of db.cart) {
      if (cartItem.product_id === productId) {
        db.cart.delete(cartId)
      }
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router