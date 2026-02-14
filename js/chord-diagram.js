import { MusicTheory } from './music-theory.js';

export const ChordDiagram = {
            create(voicing, chordName, position = 0) {
                const container = document.createElement('div');
                container.className = 'chord-diagram';

                // Validate voicing
                if (!voicing || !voicing.frets || !Array.isArray(voicing.frets)) {
                    console.error('Invalid voicing data:', voicing);
                    container.innerHTML = '<div style="color: #dc2626; padding: 20px;">Voicing no disponible</div>';
                    return container;
                }

                // Chord name
                const nameDiv = document.createElement('div');
                nameDiv.className = 'chord-name-display';
                nameDiv.innerHTML = `<div class="chord-symbol">${chordName}</div>`;
                container.appendChild(nameDiv);

                // Calculate actual frets
                const actualFrets = voicing.frets.map(f => f === -1 ? -1 : f + position);
                const validFrets = actualFrets.filter(f => f > 0);
                const minFret = validFrets.length > 0 ? Math.min(...validFrets) : 0;
                const maxFret = actualFrets.length > 0 ? Math.max(...actualFrets) : 0;
                const displayStartFret = position > 0 ? minFret : 0;
                const numFrets = Math.max(4, maxFret - displayStartFret + 1);
                const isOpenPosition = displayStartFret === 0;

                // Grid container (horizontal layout)
                const grid = document.createElement('div');
                grid.className = 'chord-diagram-grid';
                grid.style.position = 'relative';

                // Create string rows (6 strings, horizontal) - inverted to match fretboard
                // Render from string 5 (low E) to string 0 (high e)
                const stringNames = ['e', 'B', 'G', 'D', 'A', 'E']; // High to low (visual order top to bottom)

                for (let visualString = 0; visualString < 6; visualString++) {
                    const string = 5 - visualString; // Invert: visual 0 = string 5 (low E)
                    const row = document.createElement('div');
                    row.className = 'string-row';

                    // Add string label INSIDE the row at the same height
                    const label = document.createElement('div');
                    label.className = 'string-label-inline';
                    label.textContent = stringNames[visualString];
                    row.appendChild(label);

                    const actualFret = actualFrets[string];

                    // Open/Muted indicator
                    if (actualFret === 0) {
                        const open = document.createElement('div');
                        open.className = 'open-indicator';
                        open.textContent = 'O';
                        row.appendChild(open);
                    } else if (actualFret === -1) {
                        const muted = document.createElement('div');
                        muted.className = 'muted-indicator';
                        muted.textContent = 'X';
                        row.appendChild(muted);
                    }

                    // Create fret cells
                    for (let fret = 0; fret < numFrets; fret++) {
                        const cell = document.createElement('div');
                        cell.className = 'fret-cell';

                        // First fret is the nut if open position
                        if (fret === 0 && isOpenPosition) {
                            cell.classList.add('nut-fret');
                        }

                        const displayFret = actualFret - displayStartFret;

                        // Check for finger dot
                        if (displayFret === fret && actualFret > 0) {
                            const dot = document.createElement('div');
                            dot.className = 'finger-dot';

                            // Check if root note
                            // String tuning: [E2, A2, D3, G3, B3, e4] = [4, 9, 2, 7, 11, 4]
                            const stringOpenNote = [4, 9, 2, 7, 11, 4][string];
                            const noteAtFret = (stringOpenNote + actualFret) % 12;
                            const rootNote = MusicTheory.getNoteIndex(chordName.replace(/m.*|7.*|maj.*/g, ''));

                            if (noteAtFret === rootNote) {
                                dot.classList.add('root');
                                dot.textContent = MusicTheory.getNoteName(noteAtFret);
                            } else {
                                dot.classList.add('note');
                                dot.textContent = MusicTheory.getNoteName(noteAtFret);
                            }
                            cell.appendChild(dot);
                        }

                        // Check if open string note on nut fret
                        if (fret === 0 && isOpenPosition && actualFret === 0) {
                            const dot = document.createElement('div');
                            dot.className = 'finger-dot';
                            const stringOpenNote = [4, 9, 2, 7, 11, 4][string];
                            const rootNote = MusicTheory.getNoteIndex(chordName.replace(/m.*|7.*|maj.*/g, ''));
                            if (stringOpenNote === rootNote) {
                                dot.classList.add('root');
                                dot.textContent = MusicTheory.getNoteName(stringOpenNote);
                            } else {
                                dot.classList.add('note');
                                dot.textContent = MusicTheory.getNoteName(stringOpenNote);
                            }
                            cell.appendChild(dot);
                        }

                        row.appendChild(cell);
                    }

                    grid.appendChild(row);
                }

                // Barre indication (horizontal)
                if (voicing.barreInfo && position > 0) {
                    const barre = document.createElement('div');
                    barre.className = 'barre-line';
                    const barreCol = voicing.barreInfo.fret;
                    const fromString = voicing.barreInfo.fromString;
                    const toString = voicing.barreInfo.toString;
                    const topString = Math.min(fromString, toString);
                    const bottomString = Math.max(fromString, toString);
                    barre.style.top = `${topString * 32 + 4}px`;
                    barre.style.height = `${(bottomString - topString) * 32 + 24}px`;
                    barre.style.left = `${barreCol * 50 + 25}px`;
                    grid.appendChild(barre);
                }

                container.appendChild(grid);

                // Fret numbers
                const fretNumbers = document.createElement('div');
                fretNumbers.className = 'fret-numbers';
                for (let fret = 0; fret < numFrets; fret++) {
                    const numDiv = document.createElement('div');
                    numDiv.className = 'fret-num';
                    numDiv.textContent = fret + displayStartFret;
                    fretNumbers.appendChild(numDiv);
                }
                container.appendChild(fretNumbers);

                return container;
            },

            // Create multiple diagrams for a progression
            createProgression(chords, currentIndex = 0) {
                const container = document.createElement('div');
                container.className = 'diagrams-container';
                container.style.flexDirection = 'column';
                container.style.gap = '20px';

                chords.forEach((chord, i) => {
                    const wrapper = document.createElement('div');
                    wrapper.style.opacity = i === currentIndex ? '1' : '0.4';
                    wrapper.style.transform = i === currentIndex ? 'scale(1)' : 'scale(0.95)';
                    wrapper.style.transition = 'all 0.3s ease';

                    const diagram = this.create(chord.voicing, chord.name, chord.position);
                    wrapper.appendChild(diagram);
                    container.appendChild(wrapper);
                });

                return container;
            }
        };
