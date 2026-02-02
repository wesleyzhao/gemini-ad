# Architectural Context

## Key Architectural Decisions

### Design System Architecture
**Decision**: Created a centralized design system (shared-styles.css + animations.js) rather than individual page styles.

**Rationale**:
- Ensures consistency across all 12 landing pages
- Enables rapid page creation with reusable components
- Simplifies maintenance and updates
- Reduces code duplication

**Pattern**: Apple.com-inspired minimalist design with:
- CSS variables for theming
- Fluid typography using clamp()
- Reusable component classes
- Mobile-first responsive approach

### Landing Page Strategy
**Decision**: Generate 12+ distinct pages, then select top 10 through rigorous analysis.

**Rationale**:
- Allows for experimentation and creativity
- Provides backup options
- Enables A/B testing variations
- Covers all audience segments thoroughly

**Pattern**: Each page targets specific segment with tailored messaging while maintaining brand consistency.

### Static-First Architecture
**Decision**: Pure static HTML/CSS/JS with no build process or frameworks.

**Constraint**: GitHub Pages compatibility requirement.

**Benefits**:
- Zero dependencies at runtime
- Fast loading and deployment
- Easy to understand and modify
- Works everywhere

### Animation Architecture
**Decision**: Vanilla JavaScript with Intersection Observer for scroll animations.

**Rationale**:
- No framework dependencies
- Performant (uses browser APIs)
- Progressive enhancement
- Accessible (respects prefers-reduced-motion)

**Pattern**: Declarative data attributes (data-animate, data-parallax) for configuration.

### Testing Strategy
**Decision**: Playwright for automated screenshot capture across devices.

**Purpose**:
- Validate visual design quality
- Ensure responsive behavior
- Document page appearance
- Enable visual regression testing

### Documentation Philosophy
**Decision**: Comprehensive documentation with multiple perspectives.

**Files Created**:
- feature_list.json - Feature tracking
- project_context.md - Strategy
- ideas.md - Brainstorming
- reflections-and-best.md - Analysis
- DEPLOYMENT.md - Operations
- PROJECT_SUMMARY.md - Executive overview

**Rationale**: Different stakeholders need different views of the project.

## Critical Constraints

1. **GitHub Pages Only**: No backend, databases, or server-side processing
2. **Single-Page HTML**: Each page must be standalone
3. **Short Attention Spans**: Users must understand value in < 3 seconds
4. **Mobile-First**: Design for mobile, enhance for desktop
5. **Apple.com Quality Bar**: Design must match Apple's premium aesthetic

## Design Patterns

### Component Pattern
```css
.component-name {
  /* Base styles */
}

.component-name--modifier {
  /* Variant styles */
}
```

### Animation Pattern
```html
<div data-animate="fade-in" data-delay="200">
  Content appears on scroll
</div>
```

### Responsive Pattern
```css
/* Mobile first */
.element {
  /* Mobile styles */
}

@media (min-width: 768px) {
  /* Tablet/Desktop enhancements */
}
```

## Major Decisions Log

**2026-02-01**: Initial project setup
- Decided on feature-first approach with comprehensive feature_list.json
- Established Apple.com as design standard
- Created shared design system before individual pages

**2026-02-01**: Page generation strategy
- Generated 12 pages to select top 10
- Created ideas.md with 110+ concepts first
- Used reflections-and-best.md for systematic evaluation

**2026-02-01**: Quality assurance approach
- Implemented Playwright for automated testing
- Created comprehensive documentation suite
- Established deployment readiness criteria

## Future Considerations

### If Adding Backend (Future Enhancement)
- Could add form submissions
- Enable personalization
- Track analytics server-side
- Dynamic content updates

### If Adding Build Process (Future Enhancement)
- Could minify CSS/JS
- Optimize images automatically
- Enable CSS preprocessing
- Bundle and tree-shake dependencies

### Current Status: Intentionally Simple
The current static architecture is **the right choice** for:
- GitHub Pages deployment
- Fast iteration
- Broad compatibility
- Easy maintenance

Do not add complexity unless requirements change.
