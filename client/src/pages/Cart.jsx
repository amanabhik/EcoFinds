import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Package, Trash2, ShoppingBag, CreditCard } from 'lucide-react'

const Cart = () => {
  const { cartItems, loading, fetchCart, removeFromCart, checkout } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId)
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setCheckoutLoading(true)
    const result = await checkout()
    
    if (result.success) {
      alert('Purchase successful! Check your purchase history.')
    } else {
      alert(result.error)
    }
    setCheckoutLoading(false)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">
            Browse our sustainable marketplace to find great deals
          </p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="card flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${item.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Category: {item.category}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-primary-600">
                    ${item.price}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="mt-2 text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || cartItems.length === 0}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Checkout</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure checkout powered by EcoFinds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart