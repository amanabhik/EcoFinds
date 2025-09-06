// Sustainability scoring and CO2 calculation utilities

// CO2 savings multipliers by category (kg CO2 per dollar)
const CO2_MULTIPLIERS = {
  'Electronics': 2.5,      // High manufacturing footprint
  'Clothing': 1.8,         // Textile production impact
  'Books': 0.8,           // Paper and printing
  'Home & Garden': 1.2,    // Various materials
  'Sports & Outdoors': 1.5, // Equipment manufacturing
  'Toys & Games': 1.3,     // Plastic and materials
  'Other': 1.0            // Default multiplier
}

// Sustainability score calculation (0-100)
export const calculateSustainabilityScore = (category, price) => {
  const baseScore = 60 // Base score for any second-hand item
  const categoryMultiplier = CO2_MULTIPLIERS[category] || 1.0
  const priceBonus = Math.min(price * 0.5, 30) // Higher price = more impact saved
  
  return Math.min(Math.round(baseScore + (categoryMultiplier * 10) + priceBonus), 100)
}

// CO2 savings calculation
export const calculateCO2Saved = (category, price) => {
  const multiplier = CO2_MULTIPLIERS[category] || 1.0
  return Math.round(price * multiplier * 100) / 100 // Round to 2 decimal places
}

// Get sustainability impact message
export const getSustainabilityMessage = (score, co2Saved) => {
  if (score >= 90) return `Excellent! You're saving ${co2Saved}kg CO₂ - equivalent to planting a tree! 🌳`
  if (score >= 75) return `Great impact! ${co2Saved}kg CO₂ saved - like taking a car off the road for a day! 🚗`
  if (score >= 60) return `Good choice! ${co2Saved}kg CO₂ saved by choosing second-hand! 🌱`
  return `Every bit helps! ${co2Saved}kg CO₂ saved! 🌍`
}

// Get score color for UI
export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 75) return 'text-green-500'
  if (score >= 60) return 'text-yellow-500'
  return 'text-orange-500'
}

// Get score background color for progress bars
export const getScoreBgColor = (score) => {
  if (score >= 90) return 'bg-green-600'
  if (score >= 75) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-orange-500'
}