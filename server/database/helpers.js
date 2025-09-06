import { db } from './init.js'

// Helper functions for in-memory database
export const dbGet = (table, condition) => {
  const store = db[table]
  if (!store) return null
  
  for (const [id, record] of store) {
    if (condition(record)) {
      return { id, ...record }
    }
  }
  return null
}

export const dbAll = (table, condition = () => true) => {
  const store = db[table]
  if (!store) return []
  
  const results = []
  for (const [id, record] of store) {
    if (condition(record)) {
      results.push({ id, ...record })
    }
  }
  return results
}

export const dbRun = (table, operation, data) => {
  const store = db[table]
  if (!store) throw new Error(`Table ${table} not found`)
  
  switch (operation) {
    case 'INSERT':
      const id = db.generateId()
      const record = { 
        ...data, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      store.set(id, record)
      return { lastID: id, changes: 1 }
      
    case 'UPDATE':
      const { id: updateId, ...updateData } = data
      if (store.has(updateId)) {
        const existing = store.get(updateId)
        store.set(updateId, { 
          ...existing, 
          ...updateData, 
          updated_at: new Date().toISOString() 
        })
        return { changes: 1 }
      }
      return { changes: 0 }
      
    case 'DELETE':
      const deleted = store.delete(data.id)
      return { changes: deleted ? 1 : 0 }
      
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
}

export const dbTransaction = (operations) => {
  // For in-memory database, we don't need real transactions for MVP
  return operations()
}