# Plan: Gemini Unified Landing Page

## Overview
Create a single cohesive landing page combining the best components from both agent outputs, with Apple-inspired aesthetics and Google/Gemini colors.

## Design Principles
- **Apple aesthetic**: Clean, minimal, generous whitespace, elegant typography
- **Google colors**: Blue (#4285F4), Red (#EA4335), Yellow (#FBBC04), Green (#34A853)
- **Rainbow gradient text**: For key headlines
- **Smooth animations**: Text reveals, scroll-triggered effects, subtle micro-interactions

---

## Page Sections (Top to Bottom)

### 1. HERO SECTION - "Google's Secret Weapon"
**Source**: secret-weapon.html + workspace.html

**Content**:
- Main headline: "Google's Secret Weapon" with rainbow gradient text (animated shimmer)
- Rotating text underneath: "for Emails" → "for Meetings" → "for Photos" → "for Writing" → "for Truth" (typewriter reveal animation)
- Subheadline: "Google's Gemini is now yours"
- Background: google-earth-1.mp4 video (full-screen, muted, looped) with dark overlay

**Technical**:
- Rainbow gradient CSS: `background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4)`
- Animated gradient shift using `background-position` animation
- Typewriter effect using JS with letter-by-letter reveal, then fade out and cycle

**NO**: Blinds animation, "Confidential" text

---

### 2. CREATE SECTION - "Create beautiful photos, videos"
**Source**: apple-animations-demo.html structure

**Content**:
- Headline: "Create beautiful photos, videos"
- Background video: v_mp_.mp4 from Downloads
- Apple-style panel with clean typography

**Technical**:
- Copy v_mp_.mp4 to assets/videos/
- Full-bleed video section with text overlay
- Subtle fade-in animation on scroll

---

### 3. EMAIL SECTION - Inbox Animation
**Source**: email-savior.html + workspace-integration.html

**Content**:
- Animated inbox showing emails being processed/cleared
- Speed up animations (currently ~8s cycle, make ~5s)
- Add "Action items detected" Gemini suggestion panel
- Loop the animation

**Technical**:
- Extract email-list CSS and HTML structure
- Extract gemini-suggestion component
- Modify animation timing (reduce delays by 40%)
- Add animation reset/loop using JS

---

### 4. MEETINGS SECTION - Meeting Notes Magic
**Source**: meeting-notes-magic.html

**Content**:
- Compact version of meeting notes demo
- Show auto-generated notes appearing
- Animated note cards

**Technical**:
- Extract meeting demo component
- Make more compact (reduce padding, smaller fonts)
- Keep animations but tighten timing

---

### 5. ECOSYSTEM SECTION - Google Integration
**Source**: workspace-integration.html

**Content**:
- "Gemini integrates across Google's Ecosystem"
- App icons: Gmail, Calendar, Drive, Docs, Sheets, Slides, Meet, Photos, **Flights**
- Minimal text, visual focus on icons

**Technical**:
- Grid of floating/hovering app icons
- Subtle hover effects
- Add Google Flights icon

---

### 6. TRUTH SECTION - Citations & Verification
**Source**: trust-citations.html + truth-matters.html

**Sub-section A - Question with Citations**:
- Show a question and Gemini's answer with inline citations
- Citation tooltips on hover

**Sub-section B - "Other AI" vs "Gemini" Comparison**:
- Header: "Trust, every time"
- Side-by-side illustration showing hallucination vs verified response
- Keep visual from truth-matters.html

**Technical**:
- Extract chat-demo and citation components
- Extract split-screen comparison visual

---

### 7. COMPARISON TABLE - LLMs
**Source**: comparison.html

**Content**:
- Shortened comparison table
- Compare: Gemini, ChatGPT, Claude, Perplexity
- Key features only (5-6 rows max)
- Gemini column highlighted

**Technical**:
- Extract comparison-table styles
- Reduce to essential features:
  - Google Workspace Integration
  - Real-time Information
  - Citations/Sources
  - Multimodal (Images/Video)
  - Free Tier Available
  - Mobile App

---

### 8. PRICING/BUNDLING SECTION
**Source**: bundling.html

**Content**:
- 4 pricing tiers only (not 5)
- Include: Gmail, Drive, Docs, Calendar, **YouTube Premium** bundle mention
- Apple-style pricing cards

**Technical**:
- Extract bundle-card styles
- 4 cards: Free, Standard, Premium, Enterprise (or similar)
- Highlight "Best Value" tier

---

### 9. CLOSING SECTION - "Intelligence Simplified"
**Source**: think-different.html

**Content**:
- Floating Gemini gem/circle animation
- Text: "Gemini. Intelligence Simplified."
- CTA button: "Try Gemini Free"
- Black background, minimal

**Technical**:
- Extract gemini-gem-wrapper and animation
- Keep floating/rotating effect
- Clean Apple-style finish

---

## File Structure

```
agent-finite/pages/
├── gemini-unified.html      # New unified landing page
└── ...

agent-finite/assets/
├── videos/
│   ├── google-earth-1.mp4   # Already exists
│   └── create-demo.mp4      # Copy from v_mp_.mp4
├── css/
│   └── unified-page.css     # New unified styles (optional, can be inline)
└── js/
    └── unified-page.js      # Typewriter effect, animation loops
```

---

## Implementation Tasks

### Task 1: Setup & Video Assets
- Copy v_mp_.mp4 from Downloads to assets/videos/create-demo.mp4
- Create gemini-unified.html base structure

### Task 2: Hero Section
- Implement rainbow gradient animated text
- Implement typewriter rotating text ("for Emails", etc.)
- Add video background with overlay

### Task 3: Create Section
- Add video panel with create-demo.mp4
- Apple-style text overlay

### Task 4: Email Section
- Port inbox animation from email-savior.html
- Speed up animations (40% faster)
- Add loop functionality
- Add "Action items detected" suggestion panel

### Task 5: Meetings Section
- Port meeting notes component (compact version)
- Animated notes appearing

### Task 6: Ecosystem Section
- Create app icon grid (including Flights)
- Hover animations

### Task 7: Truth Section
- Port citations demo
- Port "Other AI vs Gemini" comparison

### Task 8: Comparison Table
- Create shortened LLM comparison (4 columns, 6 rows)

### Task 9: Pricing Section
- Port bundling cards (4 tiers)
- Add YouTube Premium mention

### Task 10: Closing Section
- Port floating gem animation
- "Intelligence Simplified" text

### Task 11: Polish & Testing
- Ensure consistent typography
- Test all animations
- Mobile responsiveness
- Cross-browser check
- Commit and push

---

## Color Palette Reference

```css
:root {
  /* Google Colors */
  --google-blue: #4285F4;
  --google-red: #EA4335;
  --google-yellow: #FBBC04;
  --google-green: #34A853;

  /* Rainbow Gradient */
  --rainbow-gradient: linear-gradient(90deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4);

  /* Backgrounds */
  --bg-dark: #000000;
  --bg-light: #FFFFFF;
  --bg-gray: #F8F9FA;

  /* Text */
  --text-primary: #202124;
  --text-secondary: #5F6368;
  --text-light: #FFFFFF;
}
```

---

## Animation Reference

1. **Rainbow text shimmer**: `background-position` animation moving gradient
2. **Typewriter reveal**: Letter-by-letter with cursor, then fade and reset
3. **Fade-in-up**: Elements fade in while moving up on scroll
4. **Floating gem**: Subtle Y-axis float with rotation
5. **Email slide-out**: Emails slide left and fade when processed
6. **Note cards appear**: Staggered fade-in-right animation

---

## Estimated Complexity
- **High**: Typewriter rotation effect with smooth transitions
- **Medium**: Email animation loop, meeting notes animation
- **Low**: Static sections (comparison table, pricing, ecosystem icons)

## Output
Single file: `agent-finite/pages/gemini-unified.html` with all CSS/JS inline for simplicity
