import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import axios from 'axios'
import { Search, Filter, Plus, ShoppingCart, Package, Sparkles } from 'lucide-react'
import SustainabilityScore from '../components/SustainabilityScore'
import SellerBadge from '../components/SellerBadge'
import AITagsDisplay from '../components/AITagsDisplay'

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Other'
]

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    
    const result = await addToCart(product.id)
    if (result.success) {
      // Could add a toast notification here
    }
    setLoading(false)
  }

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative">
          <Package className="h-12 w-12 text-gray-400" />
          
          {/* Sustainability Score Badge */}
          <div className="absolute top-2 right-2">
            <SustainabilityScore 
              score={product.sustainability_score || 0} 
              co2Saved={product.co2_saved || 0} 
              size="compact" 
              showDetails={false}
            />
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* AI Tags */}
        {product.ai_tags && (
          <div className="mb-2">
            <AITagsDisplay 
              tags={product.ai_tags} 
              maxTags={3} 
              showAIIndicator={false}
            />
          </div>
        )}

        {/* Seller Badge */}
        <div className="mb-2">
          <SellerBadge 
            sellerStats={product.sellerStats} 
            size="compact"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary-600">
              ${product.price}
            </p>
            <p className="text-xs text-gray-500">
              {product.category}
            </p>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="btn-primary text-sm py-1 px-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}

const ProductFeed = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minSustainabilityScore, setMinSustainabilityScore] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [popularTags, setPopularTags] = useState([])
  const { fetchCart } = useCart()

  useEffect(() => {
    fetchProducts()
    fetchCart()
    fetchPopularTags()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, minSustainabilityScore])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (minSustainabilityScore > 0) params.append('minScore', minSustainabilityScore)
      
      const response = await axios.get(`/api/products?${params.toString()}`)
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularTags = async () => {
    try {
      const response = await axios.get('/api/products/popular-tags')
      setPopularTags(response.data)
    } catch (error) {
      console.error('Failed to fetch popular tags:', error)
    }
  }

  const handleSearch = () => {
    fetchProducts()
  }

  // Products are already filtered on the server side
  const filteredProducts = products

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Discover Sustainable Products
        </h1>
        
        <Link to="/add-product" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Sell Item</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar with AI Enhancement */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search with AI-powered tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500" />
          </div>

          <button
            onClick={handleSearch}
            className="btn-primary px-4 py-2"
          >
            Search
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2 sm:w-auto"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sustainability Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Minimum Green Impact Score: {minSustainabilityScore}
              </h3>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minSustainabilityScore}
                onChange={(e) => setMinSustainabilityScore(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Any</span>
                <span>Excellent (90+)</span>
              </div>
            </div>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to list a product!'
            }
          </p>
          <Link to="/add-product" className="btn-primary">
            List Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductFeed