import React from 'react'
import { Tag, Sparkles } from 'lucide-react'

const AITagsDisplay = ({ tags, maxTags = 5, showAIIndicator = true }) => {
  if (!tags || tags.length === 0) return null

  const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())
  const displayTags = tagArray.slice(0, maxTags)
  const remainingCount = tagArray.length - maxTags

  const getTagColor = (tag) => {
    // Color code different types of tags
    if (tag.toLowerCase().includes('condition:')) return 'bg-blue-100 text-blue-800'
    if (tag.toLowerCase().includes('size:')) return 'bg-purple-100 text-purple-800'
    if (tag.toLowerCase().includes('brand') || ['Nike', 'Adidas', 'Apple', 'Samsung'].some(brand => tag.includes(brand))) {
      return 'bg-green-100 text-green-800'
    }
    if (['Black', 'White', 'Red', 'Blue', 'Green'].includes(tag)) return 'bg-gray-100 text-gray-800'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-2">
      {showAIIndicator && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Sparkles className="h-3 w-3" />
          <span>AI-powered tags</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1">
        {displayTags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </span>
        ))}
        
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            +{remainingCount} more
          </span>
        )}
      </div>
    </div>
  )
}

export default AITagsDisplay