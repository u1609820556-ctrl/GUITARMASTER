#!/bin/bash

# Critical IDs to verify
ids=(
    "progression-chain"
    "play-progression"
    "clear-progression"
    "save-progression"
    "transpose-progression"
    "reverse-progression"
    "mutate-progression"
    "initial-chord-selector"
    "emotion-selector"
    "chord-suggestions"
    "suggestions-grid"
    "analysis-content"
    "voice-leading-panel"
    "voice-leading-content"
    "progression-story"
    "story-content"
    "free-mode-key"
    "free-mode-palette"
    "guided-mode-content"
    "free-mode-content"
    "chord-builder-fretboard"
    "chord-builder-play"
    "chord-builder-clear"
    "chord-builder-save"
    "chord-builder-name"
    "chord-builder-notes"
    "chord-builder-intervals"
    "chord-builder-analysis"
    "chord-builder-library"
    "chord-builder-famous"
)

echo "Verificando IDs críticos..."
missing=0

for id in "${ids[@]}"; do
    if grep -q "id=\"$id\"" index.html; then
        echo "✓ $id"
    else
        echo "✗ MISSING: $id"
        ((missing++))
    fi
done

echo ""
echo "Total missing: $missing"
