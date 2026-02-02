#!/bin/bash

##############################################
# USE-MINIFIED-ASSETS.SH
#
# Updates all HTML files to use minified (.min.css, .min.js) assets
# Run before deploying to production
#
# Usage:
#   ./scripts/use-minified-assets.sh
#   npm run build:production
##############################################

echo "🔄 Updating HTML files to use minified assets..."
echo ""

# Counter for modified files
count=0

# Find all HTML files in pages/
for file in pages/*.html; do
    if [ -f "$file" ]; then
        echo "Processing: $file"

        # Replace .css with .min.css
        sed -i 's|href="../assets/css/\([^"]*\)\.css"|href="../assets/css/\1.min.css"|g' "$file"

        # Replace .js with .min.js
        sed -i 's|src="../assets/js/\([^"]*\)\.js"|src="../assets/js/\1.min.js"|g' "$file"

        ((count++))
    fi
done

echo ""
echo "✅ Updated $count HTML files to use minified assets"
echo ""
echo "📝 Changes made:"
echo "   - *.css → *.min.css"
echo "   - *.js → *.min.js"
echo ""
echo "⚠️  Remember to test all pages before deploying!"
echo "   Run: npm run test:visual"
