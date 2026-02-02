# CLAUDE.md - Gemini Landing Page Project

## Project Overview

This is a promotional landing page for Google Gemini AI, built with Apple-inspired aesthetics and Google brand colors. The page showcases Gemini's capabilities across email, meetings, photos, writing, and truth/citations.

## Current State

**Main file:** `index.html` - A single, self-contained HTML file with all CSS and JavaScript inline.

**Video assets:** `assets/videos/`
- `gemini-earth-2.mp4` - Hero section background
- `create-demo.mp4` - Create section background (dog video)

## Design Principles

- **Apple aesthetic**: Clean, minimal, generous whitespace, elegant typography
- **Google colors**: Blue (#4285F4), Red (#EA4335), Yellow (#FBBC04), Green (#34A853)
- **Glassmorphism**: Frosted glass effects with `backdrop-filter: blur()`
- **Smooth animations**: Text reveals, scroll-triggered effects, micro-interactions

## Key Sections in index.html

1. **Hero** - "Google's Secret Weapon" with rotating carousel ("for Emails", "for Meetings", etc.)
2. **Create** - Video background with "Create beautiful photos, videos"
3. **Email** - Animated inbox demo with Gemini suggestions
4. **Meetings** - Meeting notes with animated summary generation
5. **Ecosystem** - Google app icons + "10+ hours saved" time comparison
6. **Truth** - Citations demo and "Other AI vs Gemini" comparison
7. **Comparison Table** - Feature comparison with ChatGPT, Claude, Perplexity
8. **Pricing** - 4-tier pricing cards
9. **Closing** - Floating Gemini gem with "Intelligence Simplified"

## Technical Notes

- All animations use CSS `@keyframes` and JavaScript for scroll triggers
- iOS video autoplay requires `playsinline` attribute + JS fallback
- Circular carousel uses CSS transforms for smooth positioning
- Character-by-character text reveal uses IntersectionObserver

## Archive

The `archive/` folder contains:
- Original agent outputs (`agent-continuous/`, `agent-finite/`)
- Planning documents (`PLAN.md`, `APPLE-IMPROVEMENTS.md`)
- Earlier page versions

See `archive/README.md` for full documentation.

## Development

```bash
# Start local server
python -m http.server 8000

# View main page
open http://localhost:8000/index.html
```

## Deployment

Deployed via GitHub Pages. Push to `main` branch to deploy.
