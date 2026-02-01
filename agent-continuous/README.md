# Gemini Ad Campaign

High-quality, single-page website advertisements for Google Gemini AI, designed to compete against Perplexity, ChatGPT, and Claude.

## 🎯 Project Overview

This project contains **12 professionally-designed landing pages** with Apple.com-inspired aesthetics, optimized for:
- Short attention spans
- Mobile-first responsive design
- High conversion rates
- Beautiful animations and interactions
- GitHub Pages deployment

## 📂 Project Structure

```
/
├── assets/
│   ├── css/
│   │   └── shared-styles.css      # Apple.com-inspired design system
│   ├── js/
│   │   └── animations.js          # Smooth animations & interactions
│   └── images/                    # Image assets
├── pages/                         # 12 landing pages
│   ├── index.html                 # Gallery page
│   ├── valentine.html             # Valentine's Day campaign
│   ├── writers.html               # For writers (VO3 features)
│   ├── creators.html              # For video creators (Nano Banana)
│   ├── operators.html             # Google Workspace integration
│   ├── automators.html            # Automation workflows
│   ├── apple-style.html           # Pure Apple.com aesthetic
│   ├── trust.html                 # Citations & fact-checking
│   ├── research.html              # Academic researchers
│   ├── productivity.html          # Time-saving features
│   ├── workspace.html             # Workspace integration
│   ├── comparison.html            # vs. competitors
│   └── future.html                # Aspirational premium
├── tests/                         # Playwright test scripts
├── screenshots/                   # Automated screenshots
├── feature_list.json              # Comprehensive feature tracking
├── project_context.md             # Strategy & approach
├── ideas.md                       # 110+ landing page concepts
├── reflections-and-best.md        # Design analysis & top 10 selection
└── init.sh                        # Development environment setup
```

## 🚀 Quick Start

### 1. Setup Development Environment

```bash
# Run the initialization script
./init.sh
```

### 2. Start Local Development Server

```bash
npm run serve
```

This starts a local server at `http://localhost:8080`

### 3. View Landing Pages

Navigate to:
- Gallery: `http://localhost:8080/pages/index.html`
- Individual pages: `http://localhost:8080/pages/[page-name].html`

## 🎨 Landing Pages

### Top 10 Recommended for Deployment

1. **Apple Style** - Premium minimalist design with bundling concept
2. **Writers** - VO3 voice features for content creators
3. **Creators** - Nano Banana showcase for video creators
4. **Valentine's Day** - Seasonal emotional campaign
5. **Trust & Citations** - Fact-checking and accuracy emphasis
6. **Operators** - Google Workspace integration with sliding panels
7. **Automators** - Technical automation workflows
8. **Comparison** - Feature comparison vs. competitors
9. **Productivity** - ROI-focused time-saving features
10. **Future** - Aspirational future-of-work theme

### Target Segments

- **Writers** - Content creators, bloggers, journalists
- **Creators** - YouTubers, TikTokers, multimedia professionals
- **Operators** - Business professionals using Google Workspace
- **Automators** - Technical users, developers, power users

## 🎭 Design Philosophy

All pages follow Apple.com-inspired principles:

- ✨ **Minimalist elegance** with generous whitespace
- 🏆 **Premium, aspirational feel** that elevates the product
- 🎬 **Smooth animations** using Intersection Observer
- 📱 **Mobile-first responsive** design
- ⚡ **Performance optimized** for fast loading
- ♿ **Accessible** with semantic HTML and ARIA labels

## 🧪 Testing

Automated screenshot testing using Playwright ensures design quality across:
- Multiple viewports (mobile, tablet, desktop)
- Different browsers (Chrome, Safari, Firefox)
- Visual regression testing

## Deployment

Deploy to GitHub Pages:
1. Push to main branch
2. Enable GitHub Pages in repository settings
3. Select main branch as source

## Target Segments

1. **Writers** - Content creators and bloggers
2. **Creators** - Video and multimedia professionals
3. **Operators** - Business workflow managers
4. **Automators** - Power users and automation enthusiasts
