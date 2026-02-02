# Gemini Landing Page - Archive

This archive contains the original work from two autonomous Claude Code agents, planning documents, and earlier versions of the landing page.

## Archive Contents

### Agent Outputs
- **`agent-continuous/`** - Output from the "continuous" agent (no iteration limit)
  - Built comprehensive optimization framework with A/B testing, monitoring dashboards
  - 97+ features, 12+ main pages, 40+ variants
  - Key pages: `pages/productivity.html` (time savings comparison)

- **`agent-finite/`** - Output from the "finite" agent (10 iteration limit)
  - Clean, production-ready landing pages with polished design system
  - 50 features, 14 main pages, 4 demos
  - **`pages/gemini-unified.html`** - The original unified landing page (source of main index.html)
  - Key pages: `pages/apple-animations-demo.html`, `pages/think-different.html`

### Planning Documents
- **`PLAN.md`** - Original plan for the unified landing page
- **`APPLE-IMPROVEMENTS.md`** - Apple-inspired visual improvements plan

### Earlier Versions
- **`index-original.html`** - Very first version of the landing page
- **`index-agent-finite.html`** - Early agent-finite version
- **`index-compare.html`** - Agent comparison page
- **`index-trust.html`** - Trust/citations focused version
- **`index-v1.html`** - Version 1 of the page

## How to Access

All files remain accessible via the archive path:

```
# View agent comparison page
http://localhost:8000/archive/index-compare.html

# View agent-continuous output
http://localhost:8000/archive/agent-continuous/index.html
http://localhost:8000/archive/agent-continuous/pages/productivity.html

# View agent-finite output
http://localhost:8000/archive/agent-finite/index.html
http://localhost:8000/archive/agent-finite/pages/gemini-unified.html
http://localhost:8000/archive/agent-finite/pages/apple-animations-demo.html

# View old index versions
http://localhost:8000/archive/index-trust.html
http://localhost:8000/archive/index-v1.html
```

## Relationship to Main Page

The main `index.html` in the root directory is the final, polished landing page. It was derived from:

1. `agent-finite/pages/gemini-unified.html` - Main structure and styling
2. Components from `agent-continuous/pages/productivity.html` - Time savings comparison
3. Refinements documented in `APPLE-IMPROVEMENTS.md`

### Video Assets

The main page uses videos from `assets/videos/` in the root:
- `gemini-earth-2.mp4` - Hero background
- `create-demo.mp4` - Create section background

These were originally in `agent-finite/assets/videos/`.

## Key Files for Future Reference

If you need to continue development:

1. **Main source**: `archive/agent-finite/pages/gemini-unified.html`
2. **Animation library**: `archive/agent-finite/pages/apple-animations-demo.html`
3. **Micro-interactions**: `archive/agent-finite/pages/micro-interactions-demo.html`
4. **Time savings design**: `archive/agent-continuous/pages/productivity.html`
5. **Original plan**: `archive/PLAN.md`

## Archived: February 2, 2026
