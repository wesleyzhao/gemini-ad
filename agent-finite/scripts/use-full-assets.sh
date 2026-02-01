#!/bin/bash

##############################################
# USE-FULL-ASSETS.SH
#
# Reverts HTML files to use full (non-minified) assets for development
# Run when switching back to development mode
#
# Usage:
#   ./scripts/use-full-assets.sh
#   npm run build:dev
##############################################

echo "🔄 Reverting HTML files to use full assets..."
echo ""

# Counter for modified files
count=0

# Find all HTML files in pages/
for file in pages/*.html; do
    if [ -f "$file" ]; then
        echo "Processing: $file"

        # Replace .min.css with .css
        sed -i 's|href="../assets/css/\([^"]*\)\.min\.css"|href="../assets/css/\1.css"|g' "$file"

        # Replace .min.js with .js
        sed -i 's|src="../assets/js/\([^"]*\)\.min\.js"|src="../assets/js/\1.js"|g' "$file"

        ((count++))
    fi
done

echo ""
echo "✅ Reverted $count HTML files to use full assets"
echo ""
echo "📝 Changes made:"
echo "   - *.min.css → *.css"
echo "   - *.min.js → *.js"
echo ""
echo "💡 You're now in development mode with readable source files"
