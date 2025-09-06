import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Check if user exists
    const existingUser = Array.from(db.users.values()).find(
      user => user.email === email || user.username === username
    )
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userId = db.generateId()
    const userData = {
      username,
      email,
      password: hashedPassword,
      is_verified: false,
      verification_score: 0,
      total_sales: 0,
      average_rating: 0.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    db.users.set(userId, userData)

    const user = {
      id: userId,
      username,
      email
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    let user = null
    let userId = null
    for (const [id, userData] of db.users) {
      if (userData.email === email) {
        user = userData
        userId = id
        break
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user)
})

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body
    const userId = req.user.id

    // Validation
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' })
    }

    // Check if username/email is taken by another user
    const existingUser = Array.from(db.users.entries()).find(
      ([id, userData]) => id !== userId && (userData.email === email || userData.username === username)
    )

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' })
    }

    // Update user
    const currentUser = db.users.get(userId)
    if (currentUser) {
      db.users.set(userId, {
        ...currentUser,
        username,
        email,
        updated_at: new Date().toISOString()
      })
    }

    // Return updated user
    const updatedUser = {
      id: userId,
      username,
      email
    }
    
    res.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error during profile update' })
  }
})

export default router