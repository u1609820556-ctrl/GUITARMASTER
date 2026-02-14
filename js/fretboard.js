import { MusicTheory } from './music-theory.js';
import { AudioEngine } from './audio-engine.js';

export const Fretboard = {
            // Standard tuning (high to low E)
            tuning: [4, 11, 7, 2, 9, 4], // E B G D A E (as semitones from C)
            frets: 13, // 0-12

            // State
            highlightedNotes: new Set(),
            tonicNote: null,
            showNoteNames: true,
            showFunctions: false,
            currentScale: [],
            blueNoteIndex: null, // For blues scale special highlight
            zoneStart: null, // Fret zone start
            zoneEnd: null, // Fret zone end
            specificPositions: null, // Array of {string, fret} for specific note display
            chordHighlight: null, // Set of note indices to highlight as chord tones

            // Initialize fretboard
            init() {
                this.render();
                this.bindEvents();
            },

            // Render fretboard HTML
            render(containerId = 'fretboard') {
                const fretboard = document.getElementById(containerId);
                if (!fretboard) return;

                fretboard.innerHTML = '';

                this.tuning.forEach((openNote, stringIndex) => {
                    const stringDiv = document.createElement('div');
                    stringDiv.className = 'string';

                    for (let fret = 0; fret < this.frets; fret++) {
                        const noteIndex = (openNote + fret) % 12;
                        const noteName = MusicTheory.getNoteName(noteIndex);

                        const fretDiv = document.createElement('div');
                        fretDiv.className = 'fret';
                        fretDiv.dataset.string = stringIndex;
                        fretDiv.dataset.fret = fret;
                        fretDiv.dataset.note = noteIndex;

                        const bubble = document.createElement('div');
                        bubble.className = 'note-bubble';
                        bubble.dataset.noteIndex = noteIndex;
                        bubble.textContent = noteName;

                        fretDiv.appendChild(bubble);
                        stringDiv.appendChild(fretDiv);
                    }

                    fretboard.appendChild(stringDiv);
                });
            },

            // Update displayed notes
            updateDisplay() {
                const bubbles = document.querySelectorAll('.note-bubble');
                const frets = document.querySelectorAll('.fret');

                // Reset fret zone highlighting
                frets.forEach(fret => {
                    fret.classList.remove('in-zone', 'zone-start', 'zone-end');
                    const fretNum = parseInt(fret.dataset.fret);
                    if (this.zoneStart !== null && this.zoneEnd !== null) {
                        if (fretNum >= this.zoneStart && fretNum <= this.zoneEnd) {
                            fret.classList.add('in-zone');
                            if (fretNum === this.zoneStart) fret.classList.add('zone-start');
                            if (fretNum === this.zoneEnd) fret.classList.add('zone-end');
                        }
                    }
                });

                bubbles.forEach((bubble) => {
                    const noteIndex = parseInt(bubble.dataset.noteIndex);
                    const noteName = MusicTheory.getNoteName(noteIndex);
                    const fretEl = bubble.closest('.fret');
                    const stringIndex = parseInt(fretEl.dataset.string);
                    const fretNum = parseInt(fretEl.dataset.fret);

                    // Reset classes
                    bubble.classList.remove('visible', 'tonic', 'interval', 'other', 'pulse', 'blue-note', 'dimmed', 'chord-highlight');

                    // Check if we're using specific positions mode
                    if (this.specificPositions) {
                        const isInPosition = this.specificPositions.some(
                            p => p.string === stringIndex && p.fret === fretNum
                        );

                        if (isInPosition) {
                            bubble.classList.add('visible');
                            const scaleNoteForPosition = this.currentScale.find(n =>
                                MusicTheory.getNoteIndex(n.note) === noteIndex
                            );
                            if (noteIndex === this.tonicNote) {
                                bubble.classList.add('tonic', 'pulse');
                            } else {
                                bubble.classList.add('interval');
                            }
                            if (this.showFunctions && scaleNoteForPosition) {
                                bubble.textContent = scaleNoteForPosition.degree ? scaleNoteForPosition.degree.toString() : (scaleNoteForPosition.intervalName || noteName);
                            } else if (this.showNoteNames) {
                                bubble.textContent = noteName;
                            } else {
                                bubble.textContent = '';
                            }
                        }
                        return;
                    }

                    // Check if note should be highlighted
                    const scaleNote = this.currentScale.find(n =>
                        MusicTheory.getNoteIndex(n.note) === noteIndex
                    );

                    if (scaleNote || this.highlightedNotes.has(noteIndex)) {
                        bubble.classList.add('visible');

                        // Check if outside zone (dim it)
                        const inZone = this.zoneStart === null ||
                            (fretNum >= this.zoneStart && fretNum <= this.zoneEnd);

                        if (!inZone) {
                            bubble.classList.add('dimmed');
                        }

                        if (noteIndex === this.tonicNote) {
                            bubble.classList.add('tonic');
                            if (inZone) bubble.classList.add('pulse');
                        } else if (this.blueNoteIndex !== null && noteIndex === this.blueNoteIndex) {
                            bubble.classList.add('blue-note');
                        } else if (scaleNote) {
                            bubble.classList.add('interval');
                        } else {
                            bubble.classList.add('other');
                        }

                        // Highlight chord tones
                        if (this.chordHighlight && this.chordHighlight.has(noteIndex)) {
                            bubble.classList.add('chord-highlight');
                        }

                        // Set display text
                        if (this.showFunctions && scaleNote) {
                            // Show degree number (1-7) for scale notes
                            bubble.textContent = scaleNote.degree ? scaleNote.degree.toString() : (scaleNote.intervalName || noteName);
                        } else if (this.showNoteNames) {
                            bubble.textContent = noteName;
                        } else {
                            bubble.textContent = '';
                        }
                    }
                });

                // Add staggered animation
                const visibleBubbles = document.querySelectorAll('.note-bubble.visible:not(.dimmed)');
                visibleBubbles.forEach((bubble, i) => {
                    bubble.style.transitionDelay = `${i * 15}ms`;
                });
            },

            // Set zone for limited display
            setZone(start, end) {
                this.zoneStart = start;
                this.zoneEnd = end;
            },

            // Clear zone
            clearZone() {
                this.zoneStart = null;
                this.zoneEnd = null;
                this.specificPositions = null;
            },

            // Show specific positions only
            showPositions(positions) {
                this.specificPositions = positions;
                this.updateDisplay();
            },

            // Show scale on fretboard
            showScale(root, scaleType) {
                this.tonicNote = typeof root === 'number' ? root : MusicTheory.getNoteIndex(root);
                this.currentScale = MusicTheory.getScale(root, scaleType);
                this.highlightedNotes.clear();
                this.blueNoteIndex = null;
                this.chordHighlight = null; // Clear chord highlight
                this.clearZone(); // Reset zone
                this.updateDisplay();
            },

            // Show specific interval from root
            showInterval(root, semitones) {
                this.tonicNote = typeof root === 'number' ? root : MusicTheory.getNoteIndex(root);
                const targetNote = (this.tonicNote + semitones) % 12;
                const intervalName = MusicTheory.intervalNames[semitones] || semitones.toString();

                this.currentScale = [
                    { note: MusicTheory.getNoteName(this.tonicNote), degree: 1, intervalName: '1' },
                    { note: MusicTheory.getNoteName(targetNote), degree: 2, intervalName: intervalName }
                ];
                this.highlightedNotes.clear();
                this.updateDisplay();
            },

            // Show triad on fretboard
            showTriad(root, scaleType, degree) {
                const triad = MusicTheory.getTriad(root, scaleType, degree);
                this.tonicNote = MusicTheory.getNoteIndex(triad.root.note);

                this.currentScale = [
                    { note: triad.root.note, degree: 1 },
                    { note: triad.third.note, degree: 3 },
                    { note: triad.fifth.note, degree: 5 }
                ];
                this.highlightedNotes.clear();
                this.updateDisplay();

                return triad;
            },

            // Clear fretboard
            clear() {
                this.highlightedNotes.clear();
                this.currentScale = [];
                this.tonicNote = null;
                this.chordHighlight = null;
                this.updateDisplay();
            },

            // Bind events (toggles are handled by App.bindEvents)
            bindEvents() {
                // Click on note bubbles to play sound
                document.getElementById('fretboard').addEventListener('click', (e) => {
                    const bubble = e.target.closest('.note-bubble');
                    if (bubble && bubble.classList.contains('visible')) {
                        const fretEl = bubble.closest('.fret');
                        const stringIndex = parseInt(fretEl.dataset.string);
                        const fretNum = parseInt(fretEl.dataset.fret);

                        // Afinación estándar en notas MIDI (de aguda a grave, matching visual order):
                        // String 0 (arriba en pantalla) = E4 (aguda) = MIDI 64
                        // String 1 = B3 = MIDI 59
                        // String 2 = G3 = MIDI 55
                        // String 3 = D3 = MIDI 50
                        // String 4 = A2 = MIDI 45
                        // String 5 (abajo en pantalla) = E2 (grave) = MIDI 40
                        const openStringMidi = [64, 59, 55, 50, 45, 40];

                        // Calcular nota MIDI: nota abierta + trastes
                        const midiNote = openStringMidi[stringIndex] + fretNum;

                        // Reproducir sonido
                        AudioEngine.playMidiNote(midiNote, 0.8);

                        // Efecto visual
                        bubble.style.transform = 'scale(1.3)';
                        setTimeout(() => {
                            bubble.style.transform = '';
                        }, 200);
                    }
                });
            },

            // ========== NUEVAS FUNCIONALIDADES ==========

            // Alternative tunings
            tunings: {
                'standard': { name: 'Standard (E A D G B E)', notes: [4, 11, 7, 2, 9, 4] },
                'dropD': { name: 'Drop D (D A D G B E)', notes: [4, 11, 7, 2, 9, 2] },
                'dropC': { name: 'Drop C (C G C F A D)', notes: [2, 9, 5, 0, 7, 0] },
                'dropB': { name: 'Drop B (B F# B E G# C#)', notes: [1, 8, 4, 11, 6, 11] },
                'dropA': { name: 'Drop A (A E A D F# B)', notes: [11, 6, 2, 9, 4, 9] },
                'dadgad': { name: 'DADGAD (D A D G A D)', notes: [2, 9, 7, 2, 9, 2] },
                'openG': { name: 'Open G (D G D G B D)', notes: [2, 11, 7, 2, 7, 2] },
                'openD': { name: 'Open D (D A D F# A D)', notes: [2, 9, 6, 2, 9, 2] },
                'halfStep': { name: 'Half Step Down (Eb Ab Db Gb Bb Eb)', notes: [3, 10, 6, 1, 8, 3] },
                'wholeStep': { name: 'Whole Step Down (D G C F A D)', notes: [2, 9, 5, 0, 7, 2] }
            },

            currentTuning: 'standard',

            // Change tuning
            setTuning(tuningKey) {
                if (!this.tunings[tuningKey]) return;

                this.currentTuning = tuningKey;
                this.tuning = this.tunings[tuningKey].notes;

                // Re-render fretboard with new tuning
                this.render();
                this.updateDisplay();
            },

            // Finger numbers for positions
            fingeringData: {}, // Store fingering per string/fret

            // Set fingering for specific positions
            setFingering(positions) {
                // positions: [{ string, fret, finger }]
                this.fingeringData = {};
                positions.forEach(pos => {
                    const key = `${pos.string}-${pos.fret}`;
                    this.fingeringData[key] = pos.finger;
                });
                this.updateDisplay();
            },

            // Clear fingering
            clearFingering() {
                this.fingeringData = {};
                this.updateDisplay();
            },

            // CAGED position markers
            cagedPositions: {
                'C': { frets: [0, 3], color: '#dc2626', name: 'C Shape' },
                'A': { frets: [5, 7], color: '#ea580c', name: 'A Shape' },
                'G': { frets: [7, 10], color: '#eab308', name: 'G Shape' },
                'E': { frets: [10, 12], color: '#22c55e', name: 'E Shape' },
                'D': { frets: [12, 15], color: '#3b82f6', name: 'D Shape' }
            },

            currentCagedPosition: null,

            // Show CAGED position
            showCAGEDPosition(shape) {
                if (!this.cagedPositions[shape]) return;

                this.currentCagedPosition = shape;
                const pos = this.cagedPositions[shape];
                this.setZone(pos.frets[0], pos.frets[1]);
                this.updateDisplay();
            },

            // Clear CAGED position
            clearCAGEDPosition() {
                this.currentCagedPosition = null;
                this.clearZone();
                this.updateDisplay();
            },

            // Enhanced updateDisplay with fingering and position markers
            updateDisplayEnhanced() {
                const bubbles = document.querySelectorAll('.note-bubble');
                const frets = document.querySelectorAll('.fret');

                // Add CAGED position markers
                frets.forEach(fret => {
                    fret.classList.remove('caged-c', 'caged-a', 'caged-g', 'caged-e', 'caged-d');

                    if (this.currentCagedPosition) {
                        const fretNum = parseInt(fret.dataset.fret);
                        const pos = this.cagedPositions[this.currentCagedPosition];
                        if (fretNum >= pos.frets[0] && fretNum <= pos.frets[1]) {
                            fret.classList.add(`caged-${this.currentCagedPosition.toLowerCase()}`);
                        }
                    }
                });

                // Add finger numbers to visible bubbles
                bubbles.forEach((bubble) => {
                    const fretEl = bubble.closest('.fret');
                    const stringIndex = parseInt(fretEl.dataset.string);
                    const fretNum = parseInt(fretEl.dataset.fret);
                    const key = `${stringIndex}-${fretNum}`;

                    // Remove existing finger badge
                    const existingBadge = bubble.querySelector('.finger-badge');
                    if (existingBadge) existingBadge.remove();

                    // Add finger number if available and bubble is visible
                    if (this.fingeringData[key] && bubble.classList.contains('visible')) {
                        const badge = document.createElement('div');
                        badge.className = 'finger-badge';
                        badge.textContent = this.fingeringData[key];
                        bubble.appendChild(badge);
                    }
                });

                // Call original update logic
                this.updateDisplay();
            }
        };
