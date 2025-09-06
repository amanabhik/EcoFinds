// AI-powered product tagging system

// Category-specific tag mappings
const TAG_MAPPINGS = {
  'Electronics': {
    keywords: ['phone', 'laptop', 'computer', 'tablet', 'camera', 'headphones', 'speaker', 'tv', 'monitor', 'gaming', 'console', 'iphone', 'samsung', 'apple', 'sony', 'nintendo', 'xbox', 'playstation'],
    subcategories: ['Smartphones', 'Computers', 'Gaming', 'Audio', 'Cameras', 'TVs & Monitors', 'Accessories']
  },
  'Clothing': {
    keywords: ['shirt', 'pants', 'dress', 'shoes', 'jacket', 'jeans', 'sneakers', 'boots', 'coat', 'sweater', 'hoodie', 'nike', 'adidas', 'zara', 'h&m', 'vintage'],
    subcategories: ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Outerwear', 'Activewear', 'Vintage']
  },
  'Books': {
    keywords: ['novel', 'textbook', 'fiction', 'non-fiction', 'cookbook', 'biography', 'history', 'science', 'romance', 'mystery', 'fantasy', 'children'],
    subcategories: ['Fiction', 'Non-Fiction', 'Textbooks', 'Children\'s Books', 'Cookbooks', 'Self-Help']
  },
  'Home & Garden': {
    keywords: ['furniture', 'chair', 'table', 'lamp', 'decor', 'plant', 'garden', 'kitchen', 'bedroom', 'living room', 'tools', 'appliance'],
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden Tools', 'Appliances', 'Lighting']
  },
  'Sports & Outdoors': {
    keywords: ['bike', 'bicycle', 'fitness', 'gym', 'camping', 'hiking', 'sports', 'exercise', 'outdoor', 'running', 'yoga', 'weights'],
    subcategories: ['Fitness', 'Cycling', 'Outdoor Gear', 'Sports Equipment', 'Exercise']
  },
  'Toys & Games': {
    keywords: ['toy', 'game', 'puzzle', 'board game', 'lego', 'doll', 'action figure', 'educational', 'children', 'kids', 'baby'],
    subcategories: ['Board Games', 'Educational Toys', 'Action Figures', 'Puzzles', 'Baby Toys', 'Building Sets']
  }
}

// Brand recognition patterns
const BRAND_PATTERNS = [
  // Electronics
  'apple', 'samsung', 'sony', 'lg', 'microsoft', 'nintendo', 'xbox', 'playstation',
  // Clothing
  'nike', 'adidas', 'zara', 'h&m', 'uniqlo', 'gap', 'levi', 'calvin klein',
  // General
  'ikea', 'target', 'walmart', 'amazon'
]

// Condition keywords
const CONDITION_KEYWORDS = {
  'excellent': ['new', 'mint', 'perfect', 'excellent', 'pristine'],
  'good': ['good', 'great', 'nice', 'well-maintained', 'barely used'],
  'fair': ['used', 'worn', 'some wear', 'fair', 'functional'],
  'poor': ['damaged', 'broken', 'repair', 'parts', 'as-is']
}

export const generateAITags = (title, description, category) => {
  const text = `${title} ${description}`.toLowerCase()
  const tags = new Set()
  
  // Add category
  tags.add(category)
  
  // Find subcategories
  const categoryData = TAG_MAPPINGS[category]
  if (categoryData) {
    categoryData.keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        tags.add(keyword)
      }
    })
    
    // Add relevant subcategories
    categoryData.subcategories.forEach(subcat => {
      const subcatKeywords = subcat.toLowerCase().split(' ')
      if (subcatKeywords.some(word => text.includes(word))) {
        tags.add(subcat)
      }
    })
  }
  
  // Detect brands
  BRAND_PATTERNS.forEach(brand => {
    if (text.includes(brand)) {
      tags.add(brand.charAt(0).toUpperCase() + brand.slice(1))
    }
  })
  
  // Detect condition
  Object.entries(CONDITION_KEYWORDS).forEach(([condition, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.add(`Condition: ${condition}`)
    }
  })
  
  // Size detection for clothing
  if (category === 'Clothing') {
    const sizePattern = /\b(xs|s|m|l|xl|xxl|\d+)\b/gi
    const sizeMatches = text.match(sizePattern)
    if (sizeMatches) {
      sizeMatches.forEach(size => tags.add(`Size: ${size.toUpperCase()}`))
    }
  }
  
  // Color detection
  const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey']
  colors.forEach(color => {
    if (text.includes(color)) {
      tags.add(color.charAt(0).toUpperCase() + color.slice(1))
    }
  })
  
  return Array.from(tags).slice(0, 10) // Limit to 10 tags
}

export const searchByTags = (products, searchTerm) => {
  if (!searchTerm) return products
  
  const term = searchTerm.toLowerCase()
  
  return products.filter(product => {
    // Search in title, description
    const textMatch = product.title.toLowerCase().includes(term) || 
                     product.description.toLowerCase().includes(term)
    
    // Search in AI tags
    const tags = product.ai_tags ? product.ai_tags.split(',') : []
    const tagMatch = tags.some(tag => tag.toLowerCase().includes(term))
    
    return textMatch || tagMatch
  })
}

export const getPopularTags = (products) => {
  const tagCounts = {}
  
  products.forEach(product => {
    if (product.ai_tags) {
      const tags = product.ai_tags.split(',')
      tags.forEach(tag => {
        const cleanTag = tag.trim()
        if (cleanTag) {
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1
        }
      })
    }
  })
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([tag]) => tag)
}