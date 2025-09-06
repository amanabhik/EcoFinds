import jwt from 'jsonwebtoken'
import { db } from '../database/init.js'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const userData = db.users.get(decoded.userId)
    
    if (!userData) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = {
      id: decoded.userId,
      username: userData.username,
      email: userData.email
    }
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}