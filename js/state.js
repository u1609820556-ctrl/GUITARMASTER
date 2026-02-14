export const ChordLabState = {
            currentMode: 'progression-builder',
            currentRoot: 'C',
            currentQuality: 'maj',
            comparisonA: null,
            comparisonB: null,
            selectedVoicing: null,
            filterRegister: 'all',
            filterDifficulty: 'all',
            currentExerciseVoicings: []
        };

export const ProgressionBuilderState = {
            progression: [],
            currentKey: 'C',
            lastEmotion: null,
            subMode: 'guided' // 'guided' or 'free'
        };

export const ChordBuilderState = {
            selectedNotes: [], // [{string: 0-5, fret: 0-12, note: 'C'}]
            currentChord: null,
            savedVoicings: []
        };
