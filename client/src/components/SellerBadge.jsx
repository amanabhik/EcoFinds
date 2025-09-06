import React from 'react'
import { Shield, Star, Award, User } from 'lucide-react'

const SellerBadge = ({ sellerStats, showDetails = false, size = 'normal' }) => {
  if (!sellerStats) return null

  const { badge, averageRating, totalSales, verificationScore, isVerified } = sellerStats

  const getBadgeIcon = (level) => {
    switch (level) {
      case 'gold': return Award
      case 'silver': return Shield
      case 'bronze': return Star
      default: return User
    }
  }

  const getBadgeColor = (level) => {
    switch (level) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const IconComponent = getBadgeIcon(badge.level)

  if (size === 'compact') {
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="h-3 w-3" />
        <span className="text-xs font-medium">{badge.text}</span>
        {averageRating > 0 && (
          <span className="text-xs text-gray-500">
            {averageRating.toFixed(1)}⭐
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Main Badge */}
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getBadgeColor(badge.level)}`}>
        <IconComponent className="h-4 w-4" />
        <span>{badge.text}</span>
        {isVerified && (
          <Shield className="h-3 w-3 text-green-600" />
        )}
      </div>

      {showDetails && (
        <div className="space-y-1">
          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">
                ({totalSales} sale{totalSales !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Trust Score */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Trust Score: {verificationScore}/100</span>
          </div>

          {/* Trust Level Indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                verificationScore >= 80 ? 'bg-green-500' :
                verificationScore >= 60 ? 'bg-yellow-500' :
                verificationScore >= 40 ? 'bg-orange-500' : 'bg-gray-400'
              }`}
              style={{ width: `${verificationScore}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerBadge