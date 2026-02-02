# Gemini Ad Campaign - Project Context

## Project Overview
This project generates 10+ high-quality, single-page website advertisements for Google Gemini AI, designed to compete against Perplexity, ChatGPT, and Claude. All pages must be hostable on GitHub Pages (static HTML/CSS/JS only).

## Target Audience
**Primary Insight**: Users already trust Google and are familiar with Gemini, but it's not their daily-use tool.

### Four Key Segments (from pre-survey):
1. **Writers** - Content creators, bloggers, authors
2. **Creators** - Video creators, designers, multimedia professionals
3. **Operators** - Business professionals managing workflows
4. **Automators** - Power users seeking automation and efficiency

## Key User Motivations
- **Trust & Reliability**: Users value Google's credibility; emphasize citations and fact-checking
- **Integration**: Existing Google Workspace users want seamless tool integration
- **Short Attention Span**: Design must capture interest immediately with compelling visuals and CTAs

## Design Philosophy

### Apple.com-Inspired Approach
We're heavily inspired by Apple's current design language (February 2026):
- **Minimalist aesthetic** with generous whitespace
- **Premium, aspirational feel** that elevates the product
- **Dynamic, graphical elements** over static layouts
- **Smooth animations** and transitions
- **Product-centric imagery** with clear hierarchy
- **Modular card-based architecture**
- **High-contrast typography** with bold headlines

### Key Design Principles
1. **Elegance First**: Every page must feel polished and premium
2. **Motion Matters**: Use animations to guide attention and create delight
3. **Clarity Over Complexity**: Short attention spans demand immediate clarity
4. **Mobile-First**: Responsive design is non-negotiable
5. **Performance**: Fast loading with lazy-loaded assets

## Technical Constraints

### GitHub Pages Requirements
✅ **Supported**:
- HTML, CSS, JavaScript files
- External fonts (Google Fonts)
- Images and media assets
- Client-side animations
- CSS frameworks and JS libraries (via CDN)

❌ **Not Supported**:
- Backend server code
- Databases
- Server-side processing
- Build tools (must deploy pre-built files)

### Implementation Strategy
- **Single-page architecture**: Each ad is a standalone HTML file
- **Inline or external CSS/JS**: Both approaches work on GitHub Pages
- **CDN resources**: Google Fonts, animation libraries
- **Optimized assets**: Compressed images, minified code

## Content Strategy

### Valentine's Day Hook
- Entry point featuring infographics and love letter concept
- Emotional connection with playful, romantic theme
- Timely relevance for February campaign

### Tool Showcases
Highlight specific Gemini applications:
- **VO3**: Voice/audio capabilities for writers
- **Nano Banana**: Creative tool for content creators
- **Workspace Integration**: Automated workflow features

### Feature Highlights
- **Sliding Panel Interface**: Dynamic use case demonstrations
- **Interactive Demos**: Show, don't just tell
- **Trust Indicators**: Citations, fact-checking, accuracy
- **Comparison Tables**: Gemini vs. competitors

## Competitive Positioning

### vs. ChatGPT
- **Advantage**: Google integration, citations, workspace tools
- **Messaging**: "The AI that works with your workflow"

### vs. Claude
- **Advantage**: Scale of Google ecosystem, voice features
- **Messaging**: "AI powered by Google's knowledge"

### vs. Perplexity
- **Advantage**: Broader capabilities beyond search
- **Messaging**: "More than answers—AI that does"

## Quality Assurance Process

### Testing Requirements
1. **Visual Testing**: Playwright screenshots of every page
2. **Responsive Testing**: Mobile, tablet, desktop breakpoints
3. **Cross-Browser**: Chrome, Safari, Firefox, Edge
4. **Performance**: Load time, animation smoothness
5. **Accessibility**: ARIA labels, keyboard navigation

### Reflection Process
- Generate 100+ ideas in ideas.md
- Create reflections-and-best.md for iterative analysis
- Evaluate each page on:
  - Visual appeal and elegance
  - Message clarity for short attention spans
  - CTA effectiveness
  - Distinctiveness from other pages
  - Technical implementation quality

### Selection Criteria
From 100+ ideas, select top 10 based on:
1. Design excellence and Apple.com-level polish
2. Clear differentiation between pages
3. Strong CTAs matched to audience segment
4. Technical execution quality
5. Effectiveness for short attention spans

## Project Structure
```
/
├── feature_list.json          # Comprehensive feature tracking
├── project_context.md         # This file - strategic overview
├── ideas.md                   # 100+ landing page ideas
├── reflections-and-best.md    # Design analysis and selection
├── init.sh                    # Development environment setup
├── assets/
│   ├── css/
│   │   └── shared-styles.css  # Common design system
│   ├── js/
│   │   └── animations.js      # Shared animation utilities
│   └── images/               # Optimized images
├── pages/                     # Individual landing pages
│   ├── valentine.html
│   ├── writers.html
│   ├── creators.html
│   └── ...
├── screenshots/              # Playwright test outputs
└── tests/                    # Automated testing scripts
```

## Success Metrics
- All 10 pages must be distinct and compelling
- Each page must render beautifully on all devices
- Design quality must match or exceed Apple.com standards
- CTAs must be optimized for immediate conversion
- Technical implementation must be flawless

## Ongoing Refinement
This project maintains continuous improvement as a core principle. Even after initial completion, we iterate on:
- A/B testing variations
- Performance optimizations
- Design refinements based on testing
- New creative approaches

---

**Last Updated**: February 1, 2026
**Status**: Active Development
