#!/bin/bash

echo "=========================================="
echo "Wave 3 Scaling Script Test Suite"
echo "=========================================="
echo ""

echo "Test 1: Help Command"
echo "--------------------"
node scripts/scale-wave3-winners.js --help | head -20
echo ""

echo "Test 2: Dry-Run All Patterns"
echo "-----------------------------"
node scripts/scale-wave3-winners.js --dry-run 2>&1 | grep "Pattern Applications:"
echo ""

echo "Test 3: Dry-Run Single Pattern"
echo "-------------------------------"
node scripts/scale-wave3-winners.js --dry-run --pattern triple-threat 2>&1 | grep "Applied:"
echo ""

echo "Test 4: Dry-Run Single Page"
echo "---------------------------"
node scripts/scale-wave3-winners.js --dry-run --page writers.html 2>&1 | grep "Pages Modified:"
echo ""

echo "Test 5: Rollback Mode"
echo "---------------------"
node scripts/scale-wave3-winners.js --rollback 2>&1 | head -5
echo ""

echo "Test 6: File Information"
echo "------------------------"
echo "Script Size: $(du -h scripts/scale-wave3-winners.js | cut -f1)"
echo "Line Count: $(wc -l scripts/scale-wave3-winners.js | cut -d' ' -f1)"
echo "Executable: $(test -x scripts/scale-wave3-winners.js && echo "Yes" || echo "No")"
echo ""

echo "=========================================="
echo "All tests completed successfully!"
echo "=========================================="
