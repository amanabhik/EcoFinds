import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Plus, Edit, Trash2, Package } from 'lucide-react'

const MyListings = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const fetchMyProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products/my-listings')
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setDeleteLoading(productId)
      await axios.delete(`/api/products/${productId}`)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          My Listings
        </h1>
        
        <Link to="/add-product" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-4">
            Start selling by creating your first product listing
          </p>
          <Link to="/add-product" className="btn-primary">
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="card">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-primary-600">
                    ${product.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.category}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 btn-secondary text-center text-sm py-2"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteLoading === product.id}
                  className="btn-secondary text-red-600 hover:bg-red-50 p-2 disabled:opacity-50"
                >
                  {deleteLoading === product.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyListings