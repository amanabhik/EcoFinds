import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { ArrowLeft, ShoppingCart, Package, User, Calendar } from 'lucide-react'
import SustainabilityScore from '../components/SustainabilityScore'
import SellerBadge from '../components/SellerBadge'
import AITagsDisplay from '../components/AITagsDisplay'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    setCartLoading(true)
    const result = await addToCart(product.id)
    if (result.success) {
      // Could show success message
    } else {
      alert(result.error)
    }
    setCartLoading(false)
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

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === product.seller_id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Product Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <Package className="h-24 w-24 text-gray-400" />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-primary-600 mb-2">
                ${product.price}
              </p>
              <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* AI Tags */}
            {product.ai_tags && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Tags</h3>
                <AITagsDisplay tags={product.ai_tags} maxTags={10} />
              </div>
            )}

            {/* Sustainability Score */}
            {product.sustainability_score && (
              <div className="mb-6">
                <SustainabilityScore 
                  score={product.sustainability_score} 
                  co2Saved={product.co2_saved} 
                />
              </div>
            )}

            {/* Seller Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.seller_username}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined {new Date(product.seller_joined).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <SellerBadge 
                    sellerStats={product.sellerStats} 
                    showDetails={true}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isOwner ? (
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {cartLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
                  This is your listing
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <p>Listed on {new Date(product.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail