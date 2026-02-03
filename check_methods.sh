#!/bin/bash

methods=(
    "showProgressionBuilder"
    "showProgressionSubMode"
    "renderFreeModeChordPalette"
    "addChordFromFreePalette"
    "updateAnalysisPanel"
    "updateProgressionStory"
    "updateVoiceLeadingPanel"
    "saveProgression"
    "transposeProgressionTo"
    "reverseProgression"
    "mutateProgression"
    "initChordBuilder"
    "renderChordBuilderFretboard"
    "toggleChordBuilderNote"
    "identifyChordBuilderChord"
    "updateChordBuilderDisplay"
    "playChordBuilder"
    "clearChordBuilder"
    "saveChordBuilderVoicing"
    "loadCustomVoicing"
    "deleteCustomVoicing"
    "loadFamousVoicing"
)

echo "Verificando métodos del App..."
missing=0

for method in "${methods[@]}"; do
    if grep -q "${method}(" index.html; then
        echo "✓ $method"
    else
        echo "✗ MISSING: $method"
        ((missing++))
    fi
done

echo ""
echo "Total missing: $missing"
