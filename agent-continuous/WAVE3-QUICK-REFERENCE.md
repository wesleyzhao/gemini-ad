# Wave 3 Scaling Script - Quick Reference Card

## One-Line Commands

```bash
# Show help
node scripts/scale-wave3-winners.js --help

# Preview all changes (ALWAYS RUN FIRST!)
node scripts/scale-wave3-winners.js --dry-run

# Apply all patterns to all pages
node scripts/scale-wave3-winners.js

# Apply specific pattern
node scripts/scale-wave3-winners.js --pattern triple-threat

# Apply to specific page
node scripts/scale-wave3-winners.js --page writers.html

# View backups
node scripts/scale-wave3-winners.js --rollback
```

## Pattern Names

- `triple-threat` - +85.2% lift
- `video-social` - +72.4% lift
- `ai-personalization` - +58.7% lift
- `interactive-demos` - +60.3% lift

## Target Pages by Pattern

**Triple Threat (7 pages):**
writers.html, creators.html, automators.html, operators.html, comparison.html, future.html, valentine.html

**Video + Social (5 pages):**
trust.html, research.html, productivity.html, workspace.html, comparison.html

**AI Personalization (10 pages):**
All except research.html, comparison.html

**Interactive Demos (7 pages):**
writers.html, creators.html, operators.html, research.html, comparison.html, trust.html, future.html

## Revenue Impact

| Pattern | Pages | Revenue/Page | Total |
|---------|-------|--------------|-------|
| Triple Threat | 7 | $12.7M | $88.9M |
| Video + Social | 5 | $9.4M | $47.0M |
| AI Personalization | 10 | $5.6M | $56.0M |
| Interactive Demos | 7 | $5.4M | $37.8M |

**Total Scaled:** +$69.5M annually
**Combined (Wave 2 + 3):** +$112.2M annually

## Common Workflows

### Safe Deployment
```bash
# 1. Preview
node scripts/scale-wave3-winners.js --dry-run

# 2. Test on one page
node scripts/scale-wave3-winners.js --page writers.html

# 3. Verify page looks good
# Open pages/writers.html in browser

# 4. Apply to all
node scripts/scale-wave3-winners.js
```

### Incremental Rollout
```bash
# Apply highest-lift pattern first
node scripts/scale-wave3-winners.js --pattern triple-threat

# Monitor for 24 hours, then add next pattern
node scripts/scale-wave3-winners.js --pattern video-social

# Continue incrementally
node scripts/scale-wave3-winners.js --pattern ai-personalization
node scripts/scale-wave3-winners.js --pattern interactive-demos
```

### Pattern-Specific Deployment
```bash
# Apply only to creator-focused pages
node scripts/scale-wave3-winners.js --page creators.html
node scripts/scale-wave3-winners.js --page writers.html

# Apply video only to visual pages
node scripts/scale-wave3-winners.js --pattern video-social --page trust.html
```

## Verification Commands

```bash
# Check if patterns applied
grep -c "Wave 3 Winner" pages/writers.html  # Should show 4 if all applied

# View scaling report
cat reports/wave3/scaling-report.json

# View summary
cat reports/wave3/SCALING-SUMMARY.md

# List backups
ls -lah backups/wave3/

# Check specific pattern
grep "Triple Threat Combo" pages/writers.html
```

## Rollback Commands

```bash
# View available backups
node scripts/scale-wave3-winners.js --rollback
ls -la backups/wave3/

# Restore specific file
cp backups/wave3/writers.html.2026-02-01T17-18-12.backup pages/writers.html

# Verify restoration (should show 0)
grep -c "Wave 3 Winner" pages/writers.html
```

## Output Files

**Generated Automatically:**
- `reports/wave3/scaling-report.json` - Machine-readable report
- `reports/wave3/SCALING-SUMMARY.md` - Human-readable summary
- `backups/wave3/*.backup` - Timestamped backups

**Created Files:**
- `scripts/scale-wave3-winners.js` - Main script (60KB)
- `docs/WAVE3-SCALING-GUIDE.md` - User guide (24KB)
- `scripts/README-SCALE-WAVE3.md` - Technical docs (16KB)

## Troubleshooting

**Pattern already exists:**
```bash
# This is safe - script will skip
# Output: "⊘ writers.html - Already applied"
```

**File not found:**
```bash
# Check file exists
ls pages/writers.html

# Verify you're in project root
pwd  # Should show: .../gemini-ads-agent/project
```

**Permission denied:**
```bash
# Make script executable
chmod +x scripts/scale-wave3-winners.js
```

**Want to start over:**
```bash
# Restore from backup
cp backups/wave3/writers.html.*.backup pages/writers.html
```

## Performance Monitoring

**Core Web Vitals (Chrome DevTools):**
- Open page in Chrome
- F12 → Lighthouse → Performance
- Check LCP (<2.5s), FID (<100ms), CLS (<0.1)

**Conversion Tracking:**
- Compare to baseline: 9.34% (Wave 3 control average)
- Expected: +72% lift (16.07% conversion rate)
- Monitor for 14 days to reach statistical significance

**Engagement Metrics:**
- Time on page: Expect +87% increase
- Scroll depth: Expect +15-17pp increase
- Bounce rate: Expect -9 to -15pp decrease

## Documentation Links

- **User Guide:** `docs/WAVE3-SCALING-GUIDE.md`
- **Technical Docs:** `scripts/README-SCALE-WAVE3.md`
- **Test Results:** `reports/wave3/test-results-day-14.json`
- **This Reference:** `WAVE3-QUICK-REFERENCE.md`

## Support

**Get Help:**
```bash
node scripts/scale-wave3-winners.js --help
```

**Check Version:**
```bash
head -30 scripts/scale-wave3-winners.js | grep "@version"
# Output: @version 1.0.0
```

**Contact:**
Growth Engineering Team

---

**Pro Tip:** Always run `--dry-run` first to preview changes before applying!
