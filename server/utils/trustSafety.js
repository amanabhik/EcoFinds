// Trust & Safety utilities

export const calculateVerificationScore = (user) => {
  let score = 0
  
  // Base points for account age (max 20 points)
  const accountAge = Date.now() - new Date(user.created_at).getTime()
  const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24)
  score += Math.min(Math.floor(daysSinceCreation / 7), 20) // 1 point per week, max 20
  
  // Points for completed sales (max 30 points)
  score += Math.min(user.total_sales * 2, 30)
  
  // Points for good ratings (max 40 points)
  if (user.average_rating > 0) {
    score += Math.floor(user.average_rating * 8) // 5 stars = 40 points
  }
  
  // Bonus for email verification (10 points)
  if (user.is_verified) {
    score += 10
  }
  
  return Math.min(score, 100)
}

export const getVerificationBadge = (score) => {
  if (score >= 80) return { level: 'gold', text: 'Trusted Seller', color: 'text-yellow-600' }
  if (score >= 60) return { level: 'silver', text: 'Verified Seller', color: 'text-gray-600' }
  if (score >= 40) return { level: 'bronze', text: 'Active Seller', color: 'text-orange-600' }
  return { level: 'none', text: 'New Seller', color: 'text-gray-400' }
}

export const getTrustLevel = (score) => {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  if (score >= 40) return 'low'
  return 'new'
}

export const canSellHighValueItems = (user) => {
  const score = calculateVerificationScore(user)
  return score >= 60 || user.is_verified
}

export const getSellerStats = (user) => {
  const score = calculateVerificationScore(user)
  const badge = getVerificationBadge(score)
  
  return {
    verificationScore: score,
    badge,
    trustLevel: getTrustLevel(score),
    totalSales: user.total_sales || 0,
    averageRating: user.average_rating || 0,
    isVerified: user.is_verified || false,
    canSellHighValue: canSellHighValueItems(user)
  }
}

export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'No ratings yet'
  return `${rating.toFixed(1)} ⭐`
}

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 4.0) return 'text-green-500'
  if (rating >= 3.5) return 'text-yellow-500'
  if (rating >= 3.0) return 'text-orange-500'
  return 'text-red-500'
}