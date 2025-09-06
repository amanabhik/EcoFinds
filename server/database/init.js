// Simple in-memory database for MVP
let nextId = 1
const generateId = () => nextId++

// In-memory data stores
const users = new Map()
const products = new Map()
const cart = new Map()
const orders = new Map()
const orderItems = new Map()

export const initDatabase = () => {
  console.log('✅ In-memory database initialized successfully')
}

// Database operations
export const db = {
  users,
  products,
  cart,
  orders,
  orderItems,
  generateId
}

export default db