// Test script for Chord Lab functionality
console.log('=== CHORD LAB TESTING ===');

// Test 1: Check MusicTheory methods exist
console.log('\n1. Testing MusicTheory methods...');
const methods = [
    'transposeVoicing',
    'getVoicingForChord',
    'transposeProgression',
    'getChordFunction',
    'calculateCompatibility',
    'suggestNextChords',
    'calculateVoiceLeading',
    'identifyChordFromNotes',
    'matchChordPattern'
];

methods.forEach(method => {
    if (typeof MusicTheory[method] === 'function') {
        console.log(`✓ ${method} exists`);
    } else {
        console.error(`✗ ${method} MISSING!`);
    }
});

// Test 2: Check voicings count
console.log('\n2. Testing voicings database...');
const voicingCount = Object.keys(MusicTheory.chordLabVoicings).length;
console.log(`Total voicings: ${voicingCount}`);
if (voicingCount >= 100) {
    console.log('✓ Sufficient voicings');
} else {
    console.error('✗ Not enough voicings!');
}

// Test 3: Test transposition
console.log('\n3. Testing transposition...');
const testVoicing = MusicTheory.chordLabVoicings['C_shape_major'];
if (testVoicing) {
    const transposed = MusicTheory.transposeVoicing(testVoicing, 'C', 'G');
    if (transposed && transposed.frets) {
        console.log('✓ Transposition works');
    } else {
        console.error('✗ Transposition failed!');
    }
} else {
    console.error('✗ Test voicing not found!');
}

// Test 4: Test chord suggestions
console.log('\n4. Testing chord suggestions...');
try {
    const suggestions = MusicTheory.suggestNextChords({ root: 'C', quality: 'maj' }, 'C', {});
    if (suggestions && suggestions.length > 0) {
        console.log(`✓ Generated ${suggestions.length} suggestions`);
    } else {
        console.error('✗ No suggestions generated!');
    }
} catch (e) {
    console.error('✗ Suggestion error:', e.message);
}

// Test 5: Test chord identification
console.log('\n5. Testing chord identification...');
try {
    // C major: C E G = 0 4 7
    const identified = MusicTheory.identifyChordFromNotes([0, 4, 7]);
    if (identified && identified.root && identified.quality) {
        console.log(`✓ Identified: ${identified.root}${identified.quality}`);
    } else {
        console.error('✗ Identification failed!');
    }
} catch (e) {
    console.error('✗ Identification error:', e.message);
}

console.log('\n=== TESTING COMPLETE ===');
