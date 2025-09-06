# EcoFinds - Sustainable Second-Hand Marketplace

A hackathon-ready MVP for a sustainable marketplace where users can buy and sell second-hand items.

## Features

### Core Functionality
- User authentication (register/login)
- Profile dashboard with editable fields
- Product CRUD operations
- Product browsing with search and category filters
- Shopping cart functionality
- Purchase history
- Responsive design (mobile + desktop)

### 🌱 Sustainability Score (USP)
- Every product gets a "Green Impact Score" (0-100)
- Shows CO₂ savings from buying second-hand vs new
- Visual progress bars and impact messages
- Category-based calculations with real environmental data

### 🤖 AI-Powered Smart Search
- Automatic product tagging using AI
- Smart categorization and brand detection
- Enhanced search with tag matching
- Popular tags and trending items
- Color, size, and condition detection

### 🛡️ Trust & Safety Layer
- Verified seller badges and trust scores
- User ratings and review system
- Account verification system
- Seller statistics and performance tracking
- Trust-based selling privileges

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT + bcrypt

## Quick Start

1. Install all dependencies:

```bash
npm run install-all
```

2. Start the development servers:

```bash
npm run dev
```

This will start:

- Frontend on http://localhost:5173
- Backend on http://localhost:3001

## Project Structure

```
ecofinds-marketplace/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json
└── README.md
```

## Default Categories

- Electronics
- Clothing
- Books
- Home & Garden
- Sports & Outdoors
- Toys & Games
- Other

### What Makes EcoFinds Stand Out:

1. **Quantified Impact**: Real CO₂ savings calculations that judges can see and understand
2. **AI Enhancement**: Smart tagging makes the platform feel modern and intelligent  
3. **Trust Building**: Verification system addresses real marketplace concerns
4. **Visual Appeal**: Green scores, badges, and progress bars create engaging UX
5. **Scalable Architecture**: Clean, modular code ready for rapid expansion

### Demo Highlights:
- Show a product with 95/100 sustainability score saving 15kg CO₂
- Search for "Nike shoes" and see AI tags automatically applied
- Browse verified sellers with trust badges and ratings
- Filter by sustainability score to find the greenest options

## Future Enhancements

- Image upload with AI-powered quality assessment
- Payment integration with carbon offset options
- Advanced ML for better product recommendations
- Blockchain-based verification system
- Real-time impact tracking dashboard
- Gamification with sustainability challenges
- Corporate partnerships for bulk second-hand sales
