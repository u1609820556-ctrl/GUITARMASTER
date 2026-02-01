// Extract all referenced voicings from soundJourneys and practicalScenarios
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Get chordLabVoicings keys
const voicingsMatch = html.match(/chordLabVoicings:\s*\{([^}]*(\{[^}]*\}[^}]*)*)\}/s);
if (!voicingsMatch) {
    console.log('Could not find chordLabVoicings');
    process.exit(1);
}

const voicingsSection = voicingsMatch[0];
const definedVoicings = [];
const matches = voicingsSection.matchAll(/'([^']+)':\s*\{/g);
for (const match of matches) {
    definedVoicings.push(match[1]);
}

// Get all referenced voicings
const referencedVoicings = new Set();
const refs = html.matchAll(/voicing:\s*'([^']+)'/g);
for (const ref of refs) {
    referencedVoicings.add(ref[1]);
}

// Also check for MusicTheory.chordLabVoicings[key] references
const keyRefs = html.matchAll(/chordLabVoicings\[['"]([^'"]+)['"]\]/g);
for (const ref of keyRefs) {
    referencedVoicings.add(ref[1]);
}

// Find missing
const missing = [];
for (const voicing of referencedVoicings) {
    if (!definedVoicings.includes(voicing)) {
        missing.push(voicing);
    }
}

console.log('Defined voicings:', definedVoicings.length);
console.log('Referenced voicings:', referencedVoicings.size);
console.log('\nMissing voicings:');
missing.forEach(v => console.log('  -', v));
