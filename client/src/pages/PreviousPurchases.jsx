import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Package, Calendar, ShoppingBag } from 'lucide-react'

const PreviousPurchases = () => {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/orders/my-purchases')
      setPurchases(response.data)
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Previous Purchases</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-600 mb-4">
            Start shopping to see your purchase history here
          </p>
          <Link to="/" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map(order => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    ${order.total_amount}
                  </p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.product_id}`}
                        className="text-base font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Category: {item.category}
                      </p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-semibold text-gray-900">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PreviousPurchases