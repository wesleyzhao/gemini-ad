# Gemini Ad Campaign - Deployment Guide

## 🚀 Quick Deployment to GitHub Pages

### Automated Deployment (Recommended)

This project uses **GitHub Actions** for automated deployment. Simply push to `main` and the site deploys automatically!

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Source**, select:
   - **Source**: `GitHub Actions` (NOT branch!)
4. Save settings

#### Step 2: Push to GitHub

```bash
# Push to main branch - deployment happens automatically!
git add .
git commit -m "Deploy landing pages"
git push origin main
```

#### Step 3: Monitor Deployment

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. When complete (✅ green check), your site is live!

#### Step 4: Access Your Pages

Your landing pages will be available at:
```
https://[username].github.io/[repo-name]/
```

Individual pages:
```
https://[username].github.io/[repo-name]/pages/valentine.html
https://[username].github.io/[repo-name]/pages/writers.html
https://[username].github.io/[repo-name]/pages/creators.html
... etc
```

Gallery hub:
```
https://[username].github.io/[repo-name]/pages/index.html
```

### Manual Deployment (Alternative)

If you prefer branch-based deployment instead of GitHub Actions:

1. Settings → Pages → Source: `Deploy from a branch`
2. Select branch: `main`
3. Select folder: `/ (root)`
4. Click Save

**Note:** Automated deployment is recommended as it includes validation tests before deploying.

## 📊 Top 10 Pages to Deploy

Based on analysis in `reflections-and-best.md`, deploy these 10 pages:

1. **pages/apple-style.html** - Best design execution, premium positioning
2. **pages/writers.html** - Strong segment focus, VO3 differentiator
3. **pages/creators.html** - Visual excellence, Nano Banana showcase
4. **pages/valentine.html** - Seasonal campaign (February only)
5. **pages/trust.html** - Key Gemini differentiator (citations)
6. **pages/operators.html** - Workspace integration with sliding panel
7. **pages/automators.html** - Technical audience, unique aesthetic
8. **pages/comparison.html** - Competitive positioning
9. **pages/productivity.html** - Broad appeal, ROI messaging
10. **pages/future.html** - Aspirational, premium, distinctive

## 🎯 Ad Campaign Mapping

### Google Ads Campaigns

**Campaign 1: Professional Writers**
- Landing Page: `writers.html`
- Keywords: "AI writing assistant", "voice to text", "content creation"
- Audience: Bloggers, journalists, authors

**Campaign 2: Video Creators**
- Landing Page: `creators.html`
- Keywords: "video script generator", "content creator tools"
- Audience: YouTubers, TikTokers, video producers

**Campaign 3: Business Professionals**
- Landing Page: `operators.html` or `productivity.html`
- Keywords: "workspace automation", "productivity AI"
- Audience: Business users, managers, executives

**Campaign 4: Technical Users**
- Landing Page: `automators.html`
- Keywords: "AI automation", "workflow automation"
- Audience: Developers, power users, IT professionals

**Campaign 5: Competitive Shoppers**
- Landing Page: `comparison.html`
- Keywords: "Gemini vs ChatGPT", "best AI assistant"
- Audience: People comparing AI tools

**Campaign 6: Premium/Aspirational**
- Landing Page: `apple-style.html` or `future.html`
- Keywords: "premium AI assistant", "advanced AI"
- Audience: Early adopters, premium buyers

**Campaign 7: Trust-Focused**
- Landing Page: `trust.html`
- Keywords: "accurate AI", "AI with citations", "fact-checking AI"
- Audience: Academics, journalists, researchers

**Campaign 8: Seasonal (February)**
- Landing Page: `valentine.html`
- Keywords: "AI writing assistant Valentine's", "love letter generator"
- Audience: General audience during Valentine's season

## ⚙️ GitHub Actions Workflow

### How It Works

The `.github/workflows/deploy.yml` file automates deployment:

**Triggers:**
- ✅ Automatic: Every push to `main` branch
- ✅ Manual: Click "Run workflow" in Actions tab

**Build Process:**
1. Checkout code from repository
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run validation tests (`npm run validate`)
5. Upload site as artifact
6. Deploy to GitHub Pages

**Validation Tests Run Automatically:**
- HTML validation (no syntax errors)
- Accessibility compliance (WCAG 2.1 AA)
- Mobile responsiveness (7 device sizes)
- Lazy loading implementation
- Hero text optimization
- Performance checks

**If tests fail:** Deployment is blocked! Fix errors and push again.

### Workflow Status

Check deployment status:
- ✅ Green checkmark = Deployed successfully
- ⏳ Orange dot = Deployment in progress
- ❌ Red X = Deployment failed (check logs)

### Manual Trigger

To manually deploy without pushing:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"
4. Select `main` branch
5. Click green "Run workflow" button

### View Workflow Logs

If deployment fails:

1. Click **Actions** tab
2. Click the failed workflow run
3. Click the failed job
4. Expand steps to see error details
5. Fix issues and push again

## 🔧 Technical Setup

### Custom Domain (Optional)

#### Option 1: Configure via GitHub UI (Recommended)

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter your domain: `gemini.yourdomain.com`
3. Click **Save**
4. GitHub will create the `CNAME` file automatically
5. Enable "Enforce HTTPS" (after DNS propagates)

#### Option 2: Manual CNAME File

1. Create `CNAME` file in repository root (use template):
   ```bash
   cp CNAME.example CNAME
   echo "gemini.yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```

2. Configure DNS with your domain provider:

   **For subdomain (gemini.example.com):**
   ```
   Type: CNAME
   Name: gemini
   Value: [username].github.io
   TTL: 3600
   ```

   **For apex domain (example.com):**
   ```
   Type: A
   Value: 185.199.108.153

   Type: A
   Value: 185.199.109.153

   Type: A
   Value: 185.199.110.153

   Type: A
   Value: 185.199.111.153

   TTL: 3600
   ```

3. Wait for DNS propagation (use `dig` to check):
   ```bash
   dig +noall +answer gemini.yourdomain.com
   ```

**CNAME File Format:**
- Filename: `CNAME` (all uppercase, no extension)
- Content: `gemini.yourdomain.com` (domain only, no protocol/paths)
- One domain per file only

### Analytics Integration

Add to each landing page before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Conversion Tracking

Add conversion tracking to CTA buttons:

```javascript
// On button click
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
  'value': 1.0,
  'currency': 'USD'
});
```

## 📈 A/B Testing Recommendations

### Test Variations

**Test 1: Design Approach**
- Variant A: `valentine.html` (emotional)
- Variant B: `apple-style.html` (minimalist)

**Test 2: Segment Messaging**
- Variant A: `writers.html` (feature-focused)
- Variant B: `creators.html` (benefit-focused)

**Test 3: Trust vs. Competitive**
- Variant A: `trust.html` (citations emphasis)
- Variant B: `comparison.html` (competitive comparison)

**Test 4: ROI Messaging**
- Variant A: `productivity.html` (time savings)
- Variant B: `operators.html` (integration benefits)

### Implementation

Use Google Optimize or similar A/B testing tools:

1. Create experiments for each test
2. Track conversion rates
3. Monitor engagement metrics
4. Iterate based on data

## 🎨 Customization

### Update CTAs

All CTA buttons use consistent classes:
```html
<a href="YOUR_SIGNUP_URL" class="btn btn-primary">Your CTA Text</a>
```

Update the `href` to point to your actual signup/registration page.

### Update Colors

Modify `/assets/css/shared-styles.css`:

```css
:root {
    --color-primary: #1a73e8;  /* Your brand color */
    /* ... other variables ... */
}
```

### Add Images

Place images in `/assets/images/` and reference them:

```html
<img src="/assets/images/your-image.png" alt="Description">
```

## 🔍 SEO Optimization

### Update Meta Tags

Each page should have unique meta tags:

```html
<title>Unique Page Title - Gemini AI</title>
<meta name="description" content="Compelling description for search results">
<meta property="og:title" content="Unique Page Title">
<meta property="og:description" content="Social media description">
<meta property="og:image" content="URL to social sharing image">
```

### Add Structured Data

Consider adding JSON-LD structured data for better SEO:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Gemini AI",
  "description": "Your product description",
  "brand": "Google"
}
</script>
```

## 📱 Mobile Optimization

All pages are mobile-responsive, but verify:

1. Test on actual devices (iOS, Android)
2. Check touch targets (minimum 44x44px)
3. Verify form inputs work on mobile keyboards
4. Test landscape and portrait orientations

## ⚡ Performance Optimization

### Before Deployment

1. **Minify CSS/JS** (optional):
```bash
npm install -g csso-cli uglify-js
csso assets/css/shared-styles.css -o assets/css/shared-styles.min.css
uglifyjs assets/js/animations.js -o assets/js/animations.min.js
```

2. **Optimize Images**:
- Use WebP format when possible
- Compress JPEG/PNG files
- Implement lazy loading

3. **Enable Caching**:
GitHub Pages automatically handles caching via CDN.

## 🐛 Troubleshooting

### Deployment Fails - "Validation tests failed"

**Problem:** GitHub Actions workflow fails during `npm run validate` step.

**Solution:**
```bash
# Run validation locally to see errors
npm install
npm run validate

# Fix errors shown in output
# Then push again
git add .
git commit -m "Fix validation errors"
git push origin main
```

### Deployment Fails - "Permission denied"

**Problem:** GitHub Actions lacks permission to deploy.

**Solution:**
1. Go to repository **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click **Save**

### Deployment Fails - "Pages not enabled"

**Problem:** GitHub Pages is not configured.

**Solution:**
1. Go to **Settings** → **Pages**
2. Under "Source", select **GitHub Actions**
3. Save and re-run workflow

### Site Loads but Looks Broken (No CSS/JS)

**Problem:** Jekyll is processing files and ignoring CSS/JS.

**Solution:**
- Verify `.nojekyll` file exists in repository root
- If missing, create it: `touch .nojekyll` and push

### Custom Domain Not Working

**Problem:** Custom domain shows 404 or doesn't redirect.

**Solution:**
1. Verify `CNAME` file contains only domain name (no https://, no paths)
2. Check DNS records:
   ```bash
   # For apex domain (example.com)
   dig +noall +answer example.com

   # For subdomain (gemini.example.com)
   dig +noall +answer gemini.example.com
   ```
3. Wait 24-48 hours for DNS propagation
4. Enable "Enforce HTTPS" in Settings → Pages (after DNS propagates)

### Workflow Won't Start

**Problem:** Workflow doesn't trigger on push.

**Solution:**
1. Verify `.github/workflows/deploy.yml` exists in `main` branch
2. Check **Actions** tab → Ensure Actions are enabled
3. Settings → Actions → General → "Allow all actions and reusable workflows"
4. Push again or trigger manually

## 🔐 Security

GitHub Pages automatically provides:
- HTTPS via Let's Encrypt
- DDoS protection via Fastly CDN
- Secure asset delivery

**Important Files:**
- `.nojekyll` - Prevents Jekyll from excluding CSS/JS files
- `CNAME` - Custom domain configuration (optional)

## 📊 Monitoring

### Metrics to Track

1. **Traffic Metrics**:
   - Page views
   - Unique visitors
   - Bounce rate
   - Time on page

2. **Conversion Metrics**:
   - CTA click-through rate
   - Form submissions
   - Sign-ups

3. **Technical Metrics**:
   - Page load time
   - Core Web Vitals
   - Mobile performance score

### Tools

- **Google Analytics** - Traffic and behavior
- **Google Search Console** - SEO performance
- **PageSpeed Insights** - Performance monitoring
- **Hotjar/Clarity** - User behavior recording

## 🚀 Launch Checklist

Before going live:

- [ ] All CTA links point to correct signup URL
- [ ] Analytics tracking installed
- [ ] Meta tags updated with unique content
- [ ] All images optimized and loading
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed
- [ ] Performance testing passed (< 3s load time)
- [ ] Accessibility audit completed
- [ ] Legal compliance checked (privacy policy, terms)
- [ ] Backup created of current production

## 🎯 Post-Launch

1. **Week 1**: Monitor analytics, fix critical issues
2. **Week 2**: Start A/B testing variations
3. **Week 3**: Analyze data, optimize underperformers
4. **Month 1**: Review all metrics, plan iterations

## 📞 Support

For issues or questions:
1. Review `project_context.md` for strategy
2. Check `reflections-and-best.md` for design rationale
3. See `ideas.md` for additional concepts

---

**Deployment Status**: Ready for Production

**Last Updated**: February 1, 2026

**Total Pages**: 12 created, 10 recommended for deployment
