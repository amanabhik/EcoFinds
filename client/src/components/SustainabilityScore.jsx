import React from 'react'
import { Leaf, TreePine, Car, Globe } from 'lucide-react'

const SustainabilityScore = ({ score, co2Saved, size = 'normal', showDetails = true }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-600'
    if (score >= 75) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const getImpactMessage = (score, co2Saved) => {
    if (score >= 90) return { text: `Excellent! ${co2Saved}kg CO₂ saved - like planting a tree!`, icon: TreePine }
    if (score >= 75) return { text: `Great impact! ${co2Saved}kg CO₂ saved - like taking a car off the road!`, icon: Car }
    if (score >= 60) return { text: `Good choice! ${co2Saved}kg CO₂ saved by choosing second-hand!`, icon: Leaf }
    return { text: `Every bit helps! ${co2Saved}kg CO₂ saved!`, icon: Globe }
  }

  const impact = getImpactMessage(score, co2Saved)
  const IconComponent = impact.icon

  if (size === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <Leaf className={`h-4 w-4 ${getScoreColor(score)}`} />
        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
          {score}/100
        </span>
        <span className="text-xs text-gray-500">
          {co2Saved}kg CO₂ saved
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Leaf className={`h-5 w-5 ${getScoreColor(score)}`} />
          <span className="font-semibold text-gray-900">Green Impact Score</span>
        </div>
        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
          {score}/100
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getScoreBgColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {showDetails && (
        <div className="flex items-start space-x-2">
          <IconComponent className={`h-4 w-4 mt-0.5 ${getScoreColor(score)} flex-shrink-0`} />
          <p className="text-sm text-gray-700 leading-relaxed">
            {impact.text}
          </p>
        </div>
      )}
    </div>
  )
}

export default SustainabilityScore