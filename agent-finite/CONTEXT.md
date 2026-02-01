# Architectural Context

## Project: Gemini Ads - Single-Page Website Campaign

### High-Level Architectural Decisions

**Tech Stack:**
- Pure HTML, CSS, JavaScript (no frameworks)
- GitHub Pages compatible (static files only)
- Playwright for automated testing
- No backend/server-side code

**Design System Approach:**
- Shared CSS design system (`assets/css/design-system.css`)
- Reusable component library (`assets/css/components.css`)
- Animation utilities (`assets/css/animations.css`, `assets/js/animations.js`)
- Each landing page is self-contained but uses shared assets

**File Organization:**
- `pages/` - All new landing pages (10+ HTML files)
- `assets/css/` - Shared stylesheets
- `assets/js/` - Shared JavaScript utilities
- `assets/images/` - Graphics and images
- `tests/` - Playwright test suite

**Key Constraints:**
- Must work on GitHub Pages (static only)
- Apple.com-inspired design quality
- Mobile-first responsive design
- Performance: <2s load time
- Accessibility: WCAG AA compliance

**Design Patterns:**
- CSS Variables for theming and consistency
- Intersection Observer API for scroll animations
- Progressive enhancement (works without JS)
- Mobile-first media queries
- Semantic HTML5 structure

**Testing Strategy:**
- Visual regression testing with Playwright
- Screenshot testing at multiple viewports (mobile, tablet, desktop)
- Cross-browser testing (Chrome, Firefox, Safari)
- Accessibility audits

**Major Decisions:**
1. **No Framework**: Pure HTML/CSS/JS for maximum compatibility and performance
2. **Shared Design System**: Single source of truth for styling
3. **Self-Contained Pages**: Each page can work independently
4. **Animation-Driven**: Scroll-triggered animations for Apple-like feel
5. **Reflection-Based Selection**: Generate 100+ ideas, reflect, select best 10

**Target Segments:**
- Writers (content creation)
- Creators (ideation, multimodal)
- Operators (workflow automation)
- Automators (advanced integrations)

**Campaign Requirements:**
- Valentine's Day themed page
- VO3/Nano Banana showcase for creators
- Trust/citations focused page
- Google Workspace integration emphasis
- At least 1 Apple.com-inspired minimalist design

Update this when making significant architectural changes.
