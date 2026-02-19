import { MusicTheory } from './music-theory.js';
import { AudioEngine } from './audio-engine.js';
import { Fretboard } from './fretboard.js';
import { ChordDiagram } from './chord-diagram.js';
import { TabNotation } from './tab-notation.js';
import { ChordLabState, ProgressionBuilderState, ChordBuilderState } from './state.js';

const TENSION_GROUPS = {
    mayor:      { label: 'MAYOR',      subtitle: 'Estables, no resuelven',   chords: ['maj7','maj9','maj11','maj13'] },
    menor:      { label: 'MENOR',      subtitle: 'Oscuros pero fluidos',     chords: ['min7','min9','min11','min13'] },
    dominante:  { label: 'DOMINANTE',  subtitle: 'Quieren resolver al I',    chords: ['dom7','dom9','dom13','7#9','7b9'] },
    especial:   { label: 'ESPECIAL',   subtitle: 'El ii° del modo menor',    chords: ['halfDim7'] }
};

export const App = {
            // ====== CONSTANTES CONSOLIDADAS ======
            CATEGORY_SCALES: {
                'basic': ['major', 'minor', 'harmonicMinor', 'melodicMinor'],
                'modes': ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
                'pentatonic': ['pentatonicMinor', 'pentatonicMajor', 'blues'],
                'advanced': ['phrygianDom', 'hungarian', 'byzantine', 'japanese', 'wholeTone', 'diminished', 'diminishedHW', 'locrianNat6', 'ionianAug', 'dorianSharp4', 'lydianSharp2', 'superLocrian', 'dorianB2', 'lydianAug', 'lydianDom', 'mixolydianB6', 'locrianNat2', 'alteredScale', 'chromatic', 'ryuKyu', 'yo', 'bhairav', 'todi', 'messiaenMode2', 'messiaenMode3']
            },
            SCALE_NAMES: {
                'major': 'Mayor', 'minor': 'Menor Natural', 'harmonicMinor': 'Menor Armónica',
                'melodicMinor': 'Menor Melódica', 'dorianMinor': 'Menor Dórica',
                'dorian': 'Dórico', 'phrygian': 'Frigio', 'lydian': 'Lidio',
                'mixolydian': 'Mixolidio', 'locrian': 'Locrio',
                'locrianNat6': 'Locrio ♮6', 'ionianAug': 'Jónico #5', 'dorianSharp4': 'Dórico #4',
                'phrygianDom': 'Frigio Dominante', 'lydianSharp2': 'Lidio #2', 'superLocrian': 'Superlocrio',
                'dorianB2': 'Dórico ♭2', 'lydianAug': 'Lidio #5', 'lydianDom': 'Lidio Dominante',
                'mixolydianB6': 'Mixolidio ♭6', 'locrianNat2': 'Locrio ♮2', 'alteredScale': 'Alterada',
                'pentatonicMajor': 'Pentatónica Mayor', 'pentatonicMinor': 'Pentatónica Menor',
                'blues': 'Blues', 'bluesMajor': 'Blues Mayor', 'bluesHeptatonic': 'Blues Heptatónica',
                'wholeTone': 'Tonos Enteros', 'diminished': 'Disminuida (T-S)',
                'diminishedHW': 'Disminuida (S-T)', 'chromatic': 'Cromática',
                'hungarian': 'Húngara Menor', 'hungarianMajor': 'Húngara Mayor',
                'byzantine': 'Bizantina', 'arabic': 'Árabe', 'japanese': 'Japonesa',
                'hirajoshi': 'Hirajoshi', 'egyptian': 'Egipcia', 'prometheus': 'Prometheus',
                'persian': 'Persa', 'enigmatic': 'Enigmática', 'neapolitan': 'Napolitana',
                'bebop': 'Bebop Dominante', 'bebopMajor': 'Bebop Mayor',
                'ryuKyu': 'Ryu Kyu', 'yo': 'Yo Scale', 'bhairav': 'Bhairav', 'todi': 'Todi',
                'messiaenMode2': 'Messiaen Modo 2', 'messiaenMode3': 'Messiaen Modo 3'
            },

            // ====== ESTADO ======
            currentRoot: 0,
            currentScale: 'major',
            currentLevel: 1,
            currentInterval: 4,
            currentChord: null,
            currentMode: 1,
            currentPentaType: 'minor',
            currentPentaBox: 0,
            templates: {}, // Template storage
            currentProgression: null,
            currentProgressionChordIndex: 0,
            // Interval level improvements
            currentIntervalDirection: 'both',
            currentPlayMode: 'ascending',
            comparisonInterval: null,
            showingComparison: false,
            // Metronome state
            metronomeRunning: false,
            metronomeBPM: 120,
            metronomeIntervalId: null,
            metronomeTimeSignature: '4/4',
            metronomeSubdivision: 'quarter',
            metronomeAccent: true,
            metronomeCurrentBeat: 0,
            metronomeTapTimes: [],
            // Progression playback state
            progressionPlaying: false,
            progressionPaused: false,
            progressionBPM: 120,
            progressionLoop: false,
            progressionRepeatCount: 1,
            progressionCurrentRepeat: 0,
            progressionIntervalId: null,
            // Global BPM sync
            globalBPM: 120,
            syncMetronomeWithBacking: true,
            // Jam Session visual progress
            jamCurrentBar: 0,
            jamLoopCount: 0,
            jamCurrentBeat: 0,
            jamBeatIntervalId: null,
            jamTrackCategory: 'all',
            currentCAGED: 'C',
            cagedShowAll: false,
            currentScaleCategory: 'basic',
            currentLabScale: 'major',
            currentLabCategory: 'major',
            currentLabHarmChord: null,
            compareScale: null,
            eventController: null,
            // Scale Level 2 enhancements
            currentScalePlayMode: 'ascending',
            currentScalePlaySpeed: 'medium',
            showingScaleComparison: false,
            comparisonScale: null,
            currentPentaTab: 'global',
            showAllBoxes: false,
            // Quiz state
            quizCategory: 'intervals',
            quizDifficulty: 'easy',
            quizScore: 0,
            quizStreak: 0,
            quizBest: 0,
            quizAnswered: false,
            // Extended chords state
            currentExtensionLevel: '7th',
            currentExtensionQuality: 'maj',
            currentExtensionCategory: 'mayor',
            currentExtendedChordType: 'maj7',
            // Secondary dominants state
            currentSecondary: 'ii',
            currentSecProg: null,
            // Songs state
            songGenreFilter: 'all',
            currentSong: null,
            // Ear Training state
            earTrainingLevel: 'easy',
            earTrainingScore: 0,
            earTrainingStreak: 0,
            earTrainingBest: 0,
            earTrainingCurrentInterval: null,
            earTrainingAnswered: false,
            earExerciseType: 'intervals',
            // Training/Practice fusion state
            trainingMode: 'visual',
            practiceMode: 'songs',
            // Jam Session state
            currentBackingTrack: null,
            backingTrackPlaying: false,
            backingTrackIntervals: null,
            backingTrackBar: 0,
            customBPM: null,
            drumsEnabled: true,
            // Lick Library state
            lickFilters: { genre: 'all', technique: 'all', difficulty: 'all' },
            currentLick: null,
            lickPlaybackInterval: null,

            // ====== HELPERS ======
            resetState(except = []) {
                const defaults = {
                    currentInterval: null, currentChord: null, currentMode: null,
                    currentPentatonic: null, currentChord7: null, currentProgression: null, currentCAGED: null
                };
                Object.keys(defaults).forEach(key => {
                    if (!except.includes(key)) this[key] = defaults[key];
                });
            },

            hideUIElements() {
                document.getElementById('diagramsContainer').classList.add('hidden');
                document.getElementById('boxSelector').classList.add('hidden');
            },

            clearInfoPanel() {
                const panel = document.getElementById('infoPanel');
                if (panel) panel.innerHTML = '';
            },

            clearAllContentContainers() {
                // Limpiar TODOS los contenedores de contenido dinámico
                const containers = [
                    'infoPanel',              // Usado por la mayoría de niveles (2,6,7,8,10,11,12,13)
                    'infoPanel4',             // Usado por nivel 4 (intro/explicación)
                    'infoPanelOtherLevels',   // Usado por nivel 2 (escalas) fuera del nivel 3
                    'infoPanelAboveFretboard', // Usado por nivel 8 (funciones armónicas)
                    'jamTrackGrid',        // Jam Session - grid de tracks
                    'earTrainingAnswers',  // Nivel 14 (Ear Training) - respuestas
                    'diagramsContainer'    // Diagramas de acordes (para limpieza completa)
                ];

                containers.forEach(id => {
                    const container = document.getElementById(id);
                    if (container) {
                        container.innerHTML = '';
                        if (id === 'infoPanelAboveFretboard') container.classList.add('hidden');
                    }
                });
            },

            updateDisplay(title, subtitle) {
                document.getElementById('displayTitle').textContent = title;
                document.getElementById('displaySubtitle').textContent = subtitle;
            },

            init() {
                Fretboard.init();
                this.loadProgress();           // Load saved progress (updates currentLevel)
                this.bindEvents();             // Bind all event listeners
                this.setupKeyboardNavigation();
                this.registerTemplates();      // Register all templates including Chord Lab
                // Load the saved level (or default to 1 if no save exists)
                this.loadLevel(this.currentLevel);  // Uses the level from loadProgress()
                this.showToast('GuitarMaster cargado correctamente', 'success', 2000);
            },

            registerTemplates() {
                // Register Chord Lab template
                const chordLabTpl = document.getElementById('tpl-chord-lab');
                if (chordLabTpl) {
                    this.templates['chord-lab'] = chordLabTpl.innerHTML;
                }
            },

            setupKeyboardNavigation() {
                document.addEventListener('keydown', (e) => {
                    // Solo en nivel 7 (progresiones)
                    if (this.currentLevel !== 7) return;

                    const prog = MusicTheory.progressions[this.currentProgression];
                    if (!prog) return;

                    switch(e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            if (!this.progressionPlaying) {
                                this.currentProgressionChordIndex = Math.max(0, this.currentProgressionChordIndex - 1);
                                this.showProgression();
                            }
                            break;

                        case 'ArrowRight':
                            e.preventDefault();
                            if (!this.progressionPlaying) {
                                this.currentProgressionChordIndex = Math.min(prog.degrees.length - 1, this.currentProgressionChordIndex + 1);
                                this.showProgression();
                            }
                            break;

                        case 'Enter':
                            e.preventDefault();
                            if (!this.progressionPlaying) {
                                // Reproducir acorde actual
                                const degree = prog.degrees[this.currentProgressionChordIndex];
                                this.playProgressionChord(degree);
                            }
                            break;

                        case ' ':
                            e.preventDefault();
                            // Toggle reproducción de progresión
                            if (this.progressionPlaying && !this.progressionPaused) {
                                this.pauseProgression();
                            } else if (this.progressionPaused) {
                                this.playProgression();
                            } else {
                                this.playProgression();
                            }
                            break;

                        case 'Escape':
                            e.preventDefault();
                            if (this.progressionPlaying || this.progressionPaused) {
                                this.stopProgression();
                            }
                            break;
                    }
                });
            },

            // === PERSISTENCIA ===
            saveProgress() {
                const progress = {
                    currentLevel: this.currentLevel,
                    currentRoot: this.currentRoot,
                    quizScore: this.quizScore,
                    quizBest: this.quizBest,
                    earTrainingScore: this.earTrainingScore,
                    earTrainingBest: this.earTrainingBest,
                    timestamp: Date.now()
                };
                try {
                    localStorage.setItem('guitarmaster_progress', JSON.stringify(progress));
                } catch (e) {
                    console.error('Error guardando progreso:', e);
                }
            },

            loadProgress() {
                try {
                    const saved = localStorage.getItem('guitarmaster_progress');
                    if (saved) {
                        const progress = JSON.parse(saved);
                        this.currentLevel = progress.currentLevel || 1;
                        this.currentRoot = progress.currentRoot || 0;
                        this.quizScore = progress.quizScore || 0;
                        this.quizBest = progress.quizBest || 0;
                        this.earTrainingScore = progress.earTrainingScore || 0;
                        this.earTrainingBest = progress.earTrainingBest || 0;
                    }
                } catch (e) {
                    console.error('Error cargando progreso:', e);
                }
            },

            // === TOAST NOTIFICATIONS ===
            showToast(message, type = 'info', duration = 3000) {
                const toast = document.createElement('div');
                toast.className = `toast toast-${type}`;

                const icons = {
                    success: '✓',
                    error: '✗',
                    info: 'ℹ',
                    warning: '⚠'
                };

                toast.innerHTML = `
                    <span class="toast-icon">${icons[type] || icons.info}</span>
                    <div class="toast-content">${message}</div>
                `;

                document.body.appendChild(toast);

                requestAnimationFrame(() => {
                    toast.classList.add('show');
                });

                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            },

            // === LOADING OVERLAY ===
            showLoading(text = 'Cargando...') {
                let overlay = document.getElementById('loading-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'loading-overlay';
                    overlay.className = 'loading-overlay';
                    overlay.innerHTML = `
                        <div class="loading-content">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">${text}</div>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                }
                requestAnimationFrame(() => {
                    overlay.classList.add('show');
                });
            },

            hideLoading() {
                const overlay = document.getElementById('loading-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
            },

            // === METRONOME ===
            toggleMetronome() {
                if (this.metronomeRunning) {
                    this.stopMetronome();
                } else {
                    this.startMetronome();
                }
            },

            startMetronome() {
                if (this.metronomeRunning) return;

                this.metronomeRunning = true;
                this.metronomeCurrentBeat = 0;

                // Parsear compás
                const [beats, noteValue] = this.metronomeTimeSignature.split('/').map(Number);

                // Calcular intervalo base
                let baseInterval = (60 / this.metronomeBPM) * 1000;

                // Ajustar por subdivisión
                let subdivisionMultiplier = 1;
                if (this.metronomeSubdivision === 'eighth') subdivisionMultiplier = 2;
                else if (this.metronomeSubdivision === 'sixteenth') subdivisionMultiplier = 4;
                else if (this.metronomeSubdivision === 'triplet') subdivisionMultiplier = 3;

                const interval = baseInterval / subdivisionMultiplier;

                const playClick = () => {
                    if (!this.metronomeRunning) return;

                    // Determinar si es acento (primer tiempo)
                    const isAccent = this.metronomeAccent && (this.metronomeCurrentBeat % (beats * subdivisionMultiplier) === 0);

                    // Reproducir sonido de click
                    const freq = isAccent ? 84 : 76; // Nota más alta para acento
                    const volume = isAccent ? 0.8 : 0.5;
                    AudioEngine.playMidiNote(freq, 0.05);

                    // Actualizar indicador visual
                    this.updateMetronomeVisual(beats, subdivisionMultiplier);

                    this.metronomeCurrentBeat++;
                    this.metronomeIntervalId = setTimeout(playClick, interval);
                };

                playClick();

                // Actualizar UI
                const btn = document.getElementById('metronomeBtn');
                if (btn) {
                    btn.classList.add('active');
                    btn.style.borderColor = '#dc2626';
                    btn.style.color = '#dc2626';
                }

                this.showToast(`Metrónomo: ${this.metronomeBPM} BPM - ${this.metronomeTimeSignature}`, 'success', 2000);
            },

            updateMetronomeVisual(beats, subdivisionMultiplier) {
                const indicator = document.getElementById('metronomeBeatIndicator');
                if (!indicator) return;

                const currentBeat = Math.floor((this.metronomeCurrentBeat % (beats * subdivisionMultiplier)) / subdivisionMultiplier) + 1;
                indicator.textContent = `${currentBeat}/${beats}`;

                // Parpadeo visual
                indicator.style.color = (this.metronomeCurrentBeat % (beats * subdivisionMultiplier) === 0) ? '#dc2626' : '#10b981';
            },

            tapTempo() {
                const now = Date.now();
                this.metronomeTapTimes.push(now);

                // Mantener solo últimos 4 taps
                if (this.metronomeTapTimes.length > 4) {
                    this.metronomeTapTimes.shift();
                }

                // Calcular BPM si hay al menos 2 taps
                if (this.metronomeTapTimes.length >= 2) {
                    const intervals = [];
                    for (let i = 1; i < this.metronomeTapTimes.length; i++) {
                        intervals.push(this.metronomeTapTimes[i] - this.metronomeTapTimes[i - 1]);
                    }
                    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
                    const bpm = Math.round(60000 / avgInterval);

                    // Limitar rango
                    this.metronomeBPM = Math.max(40, Math.min(240, bpm));

                    // Actualizar display
                    const display = document.getElementById('bpmDisplay');
                    if (display) display.textContent = this.metronomeBPM;

                    this.showToast(`Tap Tempo: ${this.metronomeBPM} BPM`, 'info', 1500);

                    // Reiniciar metrónomo si está corriendo
                    if (this.metronomeRunning) {
                        this.stopMetronome();
                        setTimeout(() => this.startMetronome(), 100);
                    }
                }

                // Resetear taps después de 2 segundos de inactividad
                setTimeout(() => {
                    if (Date.now() - this.metronomeTapTimes[this.metronomeTapTimes.length - 1] > 2000) {
                        this.metronomeTapTimes = [];
                    }
                }, 2000);
            },

            stopMetronome() {
                this.metronomeRunning = false;
                if (this.metronomeIntervalId) {
                    clearTimeout(this.metronomeIntervalId);
                    this.metronomeIntervalId = null;
                }

                // Actualizar UI
                const btn = document.getElementById('metronomeBtn');
                if (btn) {
                    btn.classList.remove('active');
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }
            },

            showMetronomeSettings() {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
                modal.innerHTML = `
                    <div class="bg-void-800 border-2 border-void-600 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 class="text-xl font-display text-accent-400 mb-4">Configuración del Metrónomo</h3>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm text-void-300 mb-2">Compás</label>
                                <select id="timeSignatureSelect" class="w-full bg-void-900 border border-void-600 rounded px-3 py-2 text-white">
                                    <option value="2/4">2/4</option>
                                    <option value="3/4">3/4</option>
                                    <option value="4/4" selected>4/4</option>
                                    <option value="5/4">5/4</option>
                                    <option value="6/8">6/8</option>
                                    <option value="7/8">7/8</option>
                                    <option value="9/8">9/8</option>
                                    <option value="11/8">11/8</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm text-void-300 mb-2">Subdivisión</label>
                                <select id="subdivisionSelect" class="w-full bg-void-900 border border-void-600 rounded px-3 py-2 text-white">
                                    <option value="quarter" selected>Cuartos (♩)</option>
                                    <option value="eighth">Octavos (♪)</option>
                                    <option value="sixteenth">Dieciseisavos (♬)</option>
                                    <option value="triplet">Tresillos (♪♪♪)</option>
                                </select>
                            </div>

                            <div class="flex items-center gap-3">
                                <span class="text-sm text-void-300">Acentuar primer tiempo</span>
                                <div class="toggle-switch ${this.metronomeAccent ? 'active' : ''}" id="accentToggle"></div>
                            </div>

                            <div>
                                <label class="block text-sm text-void-300 mb-2">Tempo (BPM)</label>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs text-void-400">40</span>
                                    <input type="range"
                                        id="metronomeBPMSlider"
                                        min="40"
                                        max="240"
                                        value="120"
                                        step="1"
                                        class="flex-1 h-2 bg-void-900 border border-void-600 rounded-lg appearance-none cursor-pointer"
                                        style="accent-color: #dc2626;">
                                    <span class="text-xs text-void-400">240</span>
                                    <span id="metronomeBPMDisplay" class="text-2xl font-bold text-accent-400 w-14 text-center">120</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 mt-6">
                            <button class="btn-primary flex-1" id="applyMetronomeSettings">Aplicar</button>
                            <button class="btn-secondary flex-1" id="cancelMetronomeSettings">Cancelar</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Set current values
                document.getElementById('timeSignatureSelect').value = this.metronomeTimeSignature;
                document.getElementById('subdivisionSelect').value = this.metronomeSubdivision;

                // Event listeners
                document.getElementById('applyMetronomeSettings').addEventListener('click', () => {
                    this.metronomeTimeSignature = document.getElementById('timeSignatureSelect').value;
                    this.metronomeSubdivision = document.getElementById('subdivisionSelect').value;

                    // Restart metronome if running
                    if (this.metronomeRunning) {
                        this.stopMetronome();
                        setTimeout(() => this.startMetronome(), 100);
                    }

                    document.body.removeChild(modal);
                    this.showToast('Configuración guardada', 'success', 2000);
                });

                document.getElementById('cancelMetronomeSettings').addEventListener('click', () => {
                    document.body.removeChild(modal);
                });

                // Accent toggle
                document.getElementById('accentToggle').addEventListener('click', () => {
                    this.metronomeAccent = !this.metronomeAccent;
                    document.getElementById('accentToggle').classList.toggle('active');
                });

                // BPM slider con actualización en tiempo real
                const metronomeBpmSlider = document.getElementById('metronomeBPMSlider');
                const metronomeBpmDisplay = document.getElementById('metronomeBPMDisplay');
                if (metronomeBpmSlider && metronomeBpmDisplay) {
                    // Inicializar slider con BPM actual
                    metronomeBpmSlider.value = this.metronomeBPM;
                    metronomeBpmDisplay.textContent = this.metronomeBPM;

                    // Actualización en tiempo real al arrastrar
                    metronomeBpmSlider.addEventListener('input', (e) => {
                        const newBPM = parseInt(e.target.value);
                        this.metronomeBPM = newBPM;
                        metronomeBpmDisplay.textContent = newBPM;

                        // Actualizar display principal en el header
                        const mainBpmDisplay = document.getElementById('bpmDisplay');
                        if (mainBpmDisplay) mainBpmDisplay.textContent = newBPM;

                        // Reiniciar metrónomo si está corriendo
                        if (this.metronomeRunning) {
                            this.stopMetronome();
                            this.startMetronome();
                        }
                    });
                }

                // Close on backdrop click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
            },

            adjustMetronomeBPM(delta) {
                this.metronomeBPM = Math.max(40, Math.min(240, this.metronomeBPM + delta));
                const bpmDisplay = document.getElementById('bpmDisplay');
                if (bpmDisplay) {
                    bpmDisplay.textContent = this.metronomeBPM;
                }

                // Reiniciar si está corriendo
                if (this.metronomeRunning) {
                    this.stopMetronome();
                    this.startMetronome();
                }
            },

            // Función para anunciar mensajes a lectores de pantalla
            announce(message) {
                const announcer = document.getElementById('sr-announcements');
                if (announcer) {
                    announcer.textContent = message;
                    setTimeout(() => {
                        announcer.textContent = '';
                    }, 1000);
                }
            },

            bindEvents() {
                // Root select
                const rootSelect = document.getElementById('rootSelect');
                if (rootSelect) {
                    rootSelect.addEventListener('change', (e) => {
                        this.currentRoot = parseInt(e.target.value);
                        this.refreshCurrentLevel();
                    });
                }

                // Tuning select
                const tuningSelect = document.getElementById('tuningSelect');
                if (tuningSelect) {
                    tuningSelect.addEventListener('change', (e) => {
                        Fretboard.setTuning(e.target.value);
                        this.refreshCurrentLevel();
                    });
                }

                // Toggle switches
                const notesToggle = document.getElementById('showNotesToggle');
                const functionsToggle = document.getElementById('showFunctionsToggle');

                if (notesToggle && functionsToggle) {
                    // Toggle con soporte de teclado y ARIA
                    const handleToggle = (toggle, updateFn) => {
                        const handler = (e) => {
                            if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
                            if (e.type === 'keydown') e.preventDefault();

                            toggle.classList.toggle('active');
                            const isActive = toggle.classList.contains('active');
                            toggle.setAttribute('aria-checked', isActive.toString());
                            updateFn(isActive);
                        };
                        toggle.addEventListener('click', handler);
                        toggle.addEventListener('keydown', handler);
                    };

                    handleToggle(notesToggle, (isActive) => {
                        Fretboard.showNoteNames = isActive;
                        Fretboard.updateDisplay();
                    });

                    handleToggle(functionsToggle, (isActive) => {
                        Fretboard.showFunctions = isActive;
                        Fretboard.updateDisplay();
                    });
                }

                // Metronome button
                const metronomeBtn = document.getElementById('metronomeBtn');
                if (metronomeBtn) {
                    metronomeBtn.addEventListener('click', () => {
                        this.toggleMetronome();
                    });

                    // Ajustar BPM con scroll en el botón
                    metronomeBtn.addEventListener('wheel', (e) => {
                        e.preventDefault();
                        const delta = e.deltaY > 0 ? -5 : 5;
                        this.adjustMetronomeBPM(delta);
                    });
                }

                // Tap Tempo button
                const tapTempoBtn = document.getElementById('tapTempoBtn');
                if (tapTempoBtn) {
                    tapTempoBtn.addEventListener('click', () => {
                        this.tapTempo();
                    });
                }

                // Metronome settings modal
                const metronomeSettingsBtn = document.getElementById('metronomeSettingsBtn');
                if (metronomeSettingsBtn) {
                    metronomeSettingsBtn.addEventListener('click', () => {
                        this.showMetronomeSettings();
                    });
                }

                // Level navigation buttons
                const levelBtns = document.querySelectorAll('.level-nav-btn');
                if (levelBtns.length > 0) {
                    levelBtns.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const level = parseInt(e.currentTarget.dataset.level);
                            this.loadLevel(level);
                        });
                    });
                } else {
                    console.error('No level navigation buttons found');
                }
            },

            loadLevel(level) {
                this.currentLevel = level;

                // Set data-level attribute for CSS targeting
                document.body.setAttribute('data-level', level);

                // Cleanup backing track si está corriendo
                if (this.backingTrackPlaying) {
                    this.stopBackingTrack();
                }

                // Cleanup circle of fifths tour si está corriendo
                if (this._tourInterval !== null) {
                    clearTimeout(this._tourInterval);
                    this._tourInterval = null;
                }

                // Cleanup event listeners anteriores
                if (this.eventController) {
                    this.eventController.abort();
                }
                this.eventController = new AbortController();

                // Limpiar TODOS los contenedores de contenido dinámico
                this.clearAllContentContainers();

                // Update sidebar active state y ARIA
                document.querySelectorAll('.level-nav-btn').forEach(btn => {
                    const isActive = parseInt(btn.dataset.level) === level;
                    btn.classList.toggle('active', isActive);
                    if (isActive) {
                        btn.setAttribute('aria-current', 'page');
                    } else {
                        btn.removeAttribute('aria-current');
                    }
                });

                // Mostrar/ocultar sección específica de Nivel 3
                const level3TopSection = document.getElementById('level3TopSection');
                if (level === 3) {
                    level3TopSection?.classList.remove('hidden');
                } else {
                    level3TopSection?.classList.add('hidden');
                }

                // Mostrar/ocultar sección específica de Nivel 4
                const level4TopSection = document.getElementById('level4TopSection');
                const fretboardStickyWrapper = document.getElementById('fretboardStickyWrapper');
                if (level === 4) {
                    level4TopSection?.classList.remove('hidden');
                    if (fretboardStickyWrapper) fretboardStickyWrapper.style.display = 'none';
                } else {
                    level4TopSection?.classList.add('hidden');
                    document.getElementById('diagramsContainer4')?.replaceChildren();
                    document.getElementById('infoPanel4')?.replaceChildren();
                    if (fretboardStickyWrapper) fretboardStickyWrapper.style.display = '';
                }

                // Hide diagrams by default
                document.getElementById('diagramsContainer').classList.add('hidden');
                document.getElementById('boxSelector').classList.add('hidden');

                // Load appropriate template into control panel
                const controlPanel = document.getElementById('controlPanel');
                const templates = {
                    1: 'tpl-intervals',
                    2: 'tpl-scales',
                    3: 'tpl-chords',
                    4: 'tpl-extended',
                    5: 'tpl-circle',
                    6: 'tpl-progressions',
                    7: 'tpl-caged',
                    8: 'tpl-secondary',
                    9: 'tpl-training',
                    10: 'tpl-practice',
                    11: 'tpl-chord-lab'
                };

                const tplId = templates[level];
                const tpl = document.getElementById(tplId);

                // Manejo especial para Jam Session dentro de Practice (nivel 10)
                if (level === 10 && this.practiceMode === 'jam') {
                    const jamSessionLayout = document.getElementById('jamSessionFullLayout');
                    const header = document.querySelector('header'); // Header principal
                    const mainFretboardArea = document.getElementById('mainFretboardArea');
                    const controlPanel = document.getElementById('controlPanel');

                    if (tpl && jamSessionLayout) {
                        // Ocultar header y área principal
                        if (header) header.style.display = 'none';
                        if (mainFretboardArea) mainFretboardArea.style.display = 'none';
                        if (controlPanel) controlPanel.style.display = 'none';

                        // Mostrar Jam Session
                        jamSessionLayout.innerHTML = '';
                        jamSessionLayout.appendChild(tpl.content.cloneNode(true));
                        jamSessionLayout.classList.add('active');

                        // IMPORTANTE: Llamar a showJamSession DESPUÉS de insertar el template
                        // Para que los elementos del DOM ya existan
                        this.bindLevelEvents(level);
                        this.showJamSession();
                        this.saveProgress();
                        return; // Salir temprano para nivel 15
                    }
                } else {
                    // Niveles normales: restaurar layout
                    const jamSessionLayout = document.getElementById('jamSessionFullLayout');
                    const header = document.querySelector('header');
                    const mainFretboardArea = document.getElementById('mainFretboardArea');
                    const controlPanel = document.getElementById('controlPanel');

                    // Ocultar Jam Session
                    if (jamSessionLayout) {
                        jamSessionLayout.classList.remove('active');
                    }

                    // Mostrar layout normal
                    if (header) header.style.display = 'flex';
                    if (mainFretboardArea) mainFretboardArea.style.display = 'flex';
                    if (controlPanel) controlPanel.style.display = 'block';

                    if (tpl) {
                        controlPanel.innerHTML = '';
                        controlPanel.appendChild(tpl.content.cloneNode(true));
                    }

                    // Nivel 4 usa su propio layout, el controlPanel queda vacío y oculto
                    if (level === 4) {
                        controlPanel.style.display = 'none';
                    }
                }

                // Bind events DESPUÉS de cargar el template (solo para niveles != 15)
                this.bindLevelEvents(level);
                this.refreshCurrentLevel();
                this.saveProgress();
            },

            bindLevelEvents(level) {
                const controlPanel = document.getElementById('controlPanel');

                switch(level) {
                    case 1: // Intervals
                        // Event listeners para botones de intervalos
                        controlPanel.querySelectorAll('.interval-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const interval = parseInt(e.currentTarget.dataset.interval);

                                // Si está en modo comparación, seleccionar para comparar
                                if (this.showingComparison) {
                                    this.selectIntervalForComparison(interval);
                                } else {
                                    // Comportamiento normal
                                    controlPanel.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'));
                                    e.currentTarget.classList.add('active');
                                    this.currentInterval = interval;
                                    this.showInterval();
                                }
                            });
                        });

                        // Event listeners para modos de reproducción
                        controlPanel.querySelectorAll('[data-play-mode]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const mode = e.currentTarget.dataset.playMode;
                                this.changePlayMode(mode);
                            });
                        });

                        // Event listeners para dirección visual
                        controlPanel.querySelectorAll('[data-direction]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const direction = e.currentTarget.dataset.direction;
                                this.changeIntervalDirection(direction);
                            });
                        });

                        // Event listener para activar modo comparación
                        const toggleCompBtn = controlPanel.querySelector('#toggleComparisonMode');
                        if (toggleCompBtn) {
                            toggleCompBtn.addEventListener('click', () => {
                                this.toggleComparisonMode();
                            });
                        }

                        // Event listener para reproducir comparación
                        const playCompBtn = controlPanel.querySelector('#playComparison');
                        if (playCompBtn) {
                            playCompBtn.addEventListener('click', () => {
                                this.playComparison();
                            });
                        }

                        // Event listener para salir de comparación
                        const exitCompBtn = controlPanel.querySelector('#exitComparison');
                        if (exitCompBtn) {
                            exitCompBtn.addEventListener('click', () => {
                                this.exitComparisonMode();
                            });
                        }

                        // Set default active
                        controlPanel.querySelector(`[data-interval="${this.currentInterval}"]`)?.classList.add('active');
                        break;

                    case 2: // Scales + Pentatonics
                        this.bindScaleEvents(controlPanel);

                        // Pentatonic sub-selector events
                        controlPanel.querySelectorAll('.penta-type-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.penta-type-btn').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.currentPentaType = e.currentTarget.dataset.pentaType;

                                // Show/hide box selector
                                const boxContainer = document.getElementById('pentaBoxContainer');
                                if (this.currentPentaType === 'minor' || this.currentPentaType === 'blues') {
                                    boxContainer.classList.remove('hidden');
                                } else {
                                    boxContainer.classList.add('hidden');
                                }

                                this.showScaleOrPentatonic();
                            });
                        });

                        controlPanel.querySelectorAll('#pentaBoxButtons .box-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('#pentaBoxButtons .box-btn').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.currentPentaBox = parseInt(e.currentTarget.dataset.box);
                                this.showScaleOrPentatonic();
                            });
                        });
                        break;

                    case 3: // Chords Básicos
                        controlPanel.querySelectorAll('.chord-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.chord-btn').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.currentChord = parseInt(e.currentTarget.dataset.chord);
                                this.showChord();
                            });
                        });

                        // Play button for basic chords
                        document.getElementById('playBasicChordBtn')?.addEventListener('click', async () => {
                            try {
                                if (!this.currentChord || !AudioEngine.audioContext || !AudioEngine.enabled) {
                                    console.warn('Cannot play chord: missing currentChord, AudioContext, or AudioEngine disabled');
                                    return;
                                }

                                if (typeof this.currentRoot !== 'number' || this.currentRoot < 0 || this.currentRoot > 11) {
                                    console.error('Invalid currentRoot:', this.currentRoot);
                                    return;
                                }

                                if (AudioEngine.audioContext.state === 'suspended') {
                                    await AudioEngine.audioContext.resume();
                                }

                                const triad = MusicTheory.getTriad(this.currentRoot, 'major', this.currentChord);
                                if (!triad || !triad.root || !triad.third || !triad.fifth) {
                                    console.error('Invalid triad data:', triad);
                                    return;
                                }

                                const chordNotes = [
                                    MusicTheory.getNoteIndex(triad.root.note),
                                    MusicTheory.getNoteIndex(triad.third.note),
                                    MusicTheory.getNoteIndex(triad.fifth.note)
                                ];

                                // Validate note indices
                                if (chordNotes.some(note => note === -1 || note === undefined || note === null)) {
                                    console.error('Invalid note indices:', chordNotes);
                                    return;
                                }

                                AudioEngine.playChord(chordNotes, 1.5);
                            } catch (error) {
                                console.error('Error playing basic chord:', error);
                            }
                        });
                        break;

                    case 4: // Extended Chords
                        // Set defaults and render
                        this.currentExtensionCategory = this.currentExtensionCategory || 'mayor';
                        this.showExtendedIntro();

                        // Play button for extended chords
                        document.getElementById('playExtendedChordBtn')?.addEventListener('click', async () => {
                            try {
                                if (!AudioEngine.audioContext || !AudioEngine.enabled) {
                                    console.warn('AudioContext not initialized or AudioEngine disabled');
                                    return;
                                }

                                if (!this.currentExtendedChordType) {
                                    console.error('No chord type selected');
                                    return;
                                }

                                if (typeof this.currentRoot !== 'number' || this.currentRoot < 0 || this.currentRoot > 11) {
                                    console.error('Invalid currentRoot:', this.currentRoot);
                                    return;
                                }

                                if (AudioEngine.audioContext.state === 'suspended') {
                                    await AudioEngine.audioContext.resume();
                                }

                                const chordData = MusicTheory.extendedChords[this.currentExtendedChordType];
                                if (!chordData || !chordData.intervals) {
                                    console.error('Chord data not found for:', this.currentExtendedChordType);
                                    return;
                                }

                                // Usar el primer voicing disponible con octavas reales
                                const voicingsKey = `${this.currentExtendedChordType}_voicings`;
                                const voicings = MusicTheory.extendedVoicings[voicingsKey];
                                if (voicings && voicings.length > 0) {
                                    const v = voicings[0];
                                    const isAShape = v.shape === 'A';
                                    const isDShape = v.shape === 'D';
                                    // Offset: semitonos desde la nota base de la forma
                                    const baseNote = isAShape ? 9 : (isDShape ? 2 : 4); // A2=9, D3=2, E2=4
                                    const rootOffset = (this.currentRoot - baseNote + 12) % 12;
                                    this.playVoicingFrets(v.frets, rootOffset, 1.5);
                                } else {
                                    // Fallback sin voicings
                                    const chordNotes = chordData.intervals.map(interval => (this.currentRoot + interval) % 12);
                                    AudioEngine.playChord(chordNotes, 1.5);
                                }

                            } catch (error) {
                                console.error('Error playing extended chord:', error);
                            }
                        });
                        break;

                    case 5: { // Circle of Fifths
                        this.renderCircleOfFifths();

                        // Tour speed state
                        this._tourSpeed = 'medium';
                        this._tourInterval = null;

                        // Speed buttons
                        controlPanel.querySelectorAll('[data-tour-speed]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('[data-tour-speed]').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this._tourSpeed = e.currentTarget.dataset.tourSpeed;
                                // Restart tour if already playing
                                if (this._tourInterval !== null) {
                                    this._stopCircleTour(controlPanel);
                                    this._startCircleTour(controlPanel);
                                }
                            });
                        });

                        // Play tour button
                        const tourPlayBtn = document.getElementById('tourPlayBtn');
                        const tourStopBtn = document.getElementById('tourStopBtn');

                        tourPlayBtn?.addEventListener('click', async () => {
                            if (!AudioEngine.audioContext) AudioEngine.init();
                            if (!AudioEngine.audioContext || !AudioEngine.enabled) return;
                            if (AudioEngine.audioContext.state === 'suspended') {
                                await AudioEngine.audioContext.resume();
                            }
                            this._startCircleTour(controlPanel);
                        });

                        tourStopBtn?.addEventListener('click', () => {
                            this._stopCircleTour(controlPanel);
                        });

                        break;
                    }

                    case 6: // Progressions
                        controlPanel.querySelectorAll('.progression-btn-simple').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.progression-btn-simple').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.currentProgression = e.currentTarget.dataset.progression;
                                this.currentProgressionChordIndex = 0;
                                this.stopProgression(); // Detener reproducción si está activa
                                this.showProgression();
                            });
                        });

                        // Event listeners para controles de reproducción
                        const playBtn = document.getElementById('playProgressionBtn');

                        if (playBtn) {
                            playBtn.addEventListener('click', async () => {
                                try {
                                    // Initialize AudioEngine if not already done
                                    if (!AudioEngine.audioContext) {
                                        AudioEngine.init();
                                    }

                                    // Validate after init
                                    if (!AudioEngine.audioContext || !AudioEngine.enabled) {
                                        console.error('❌ Failed to initialize AudioEngine - audioContext:', !!AudioEngine.audioContext, 'enabled:', AudioEngine.enabled);
                                        return;
                                    }

                                    // Asegurar que el AudioContext esté activo
                                    if (AudioEngine.audioContext.state === 'suspended') {
                                        await AudioEngine.audioContext.resume();
                                    }

                                    this.playProgression();
                                } catch (error) {
                                    console.error('❌ Error starting progression playback:', error);
                                }
                            });
                        } else {
                            console.error('❌ playProgressionBtn not found in DOM!');
                        }

                        document.getElementById('pauseProgressionBtn')?.addEventListener('click', () => {
                            this.pauseProgression();
                        });
                        document.getElementById('stopProgressionBtn')?.addEventListener('click', () => {
                            this.stopProgression();
                        });

                        // BPM slider
                        const progressionBpmSlider = document.getElementById('progressionBPMSlider');
                        const progressionBpmDisplay = document.getElementById('progressionBPMDisplay');
                        if (progressionBpmSlider && progressionBpmDisplay) {
                            progressionBpmSlider.value = this.progressionBPM;
                            progressionBpmDisplay.textContent = this.progressionBPM;
                            progressionBpmSlider.addEventListener('input', (e) => {
                                this.progressionBPM = parseInt(e.target.value);
                                progressionBpmDisplay.textContent = this.progressionBPM;
                            });
                        }

                        // Loop toggle
                        document.getElementById('progressionLoopToggle')?.addEventListener('change', (e) => {
                            this.progressionLoop = e.target.checked;
                        });

                        // Repeat count
                        document.getElementById('progressionRepeatInput')?.addEventListener('change', (e) => {
                            this.progressionRepeatCount = parseInt(e.target.value) || 1;
                        });

                        // Set default progression if none selected
                        if (!this.currentProgression) {
                            this.currentProgression = 'I-IV-V-I';
                            this.currentProgressionChordIndex = 0;
                            this.showProgression();
                        }

                        break;

                    case 7: // CAGED
                        // Render SVG pentagon on load
                        this.renderCAGEDMap();

                        // Toggle para mostrar todas las formas
                        const cagedToggle = document.getElementById('cagedShowAllToggle');
                        if (cagedToggle) {
                            const toggleDot = document.getElementById('caged-toggle-dot');
                            cagedToggle.addEventListener('click', () => {
                                this.cagedShowAll = !this.cagedShowAll;
                                if (this.cagedShowAll) {
                                    cagedToggle.style.background = '#84cc16';
                                    toggleDot.style.transform = 'translateX(2.5rem)';
                                    this.renderAllCAGEDDiagrams();
                                    document.getElementById('caged-all-diagrams')?.classList.remove('hidden');
                                    this.showToast('Mostrando todas las formas CAGED', 'info');
                                } else {
                                    cagedToggle.style.background = '#333';
                                    toggleDot.style.transform = 'translateX(0.25rem)';
                                    document.getElementById('caged-all-diagrams')?.classList.add('hidden');
                                    this.showToast('Vista de forma individual', 'info');
                                }
                            });
                        }

                        // Tour CAGED button
                        document.getElementById('caged-tour-btn')?.addEventListener('click', () => {
                            this.playCAGEDTour();
                        });
                        break;

                    case 8: // Funciones Armónicas
                        // Tab switching (Aprende / Explora)
                        controlPanel.querySelectorAll('.sec-tab-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const tab = e.currentTarget.dataset.sectab;
                                controlPanel.querySelectorAll('.sec-tab-btn').forEach(b => {
                                    const active = b.dataset.sectab === tab;
                                    b.style.background = active ? '#1e1e1e' : 'transparent';
                                    b.style.color = active ? '#fafafa' : '#888';
                                });
                                controlPanel.querySelectorAll('.sec-tab-panel').forEach(p => {
                                    p.classList.toggle('hidden', p.dataset.secpanel !== tab);
                                });
                                if (tab === 'learn') {
                                    this.showHarmonicFunctionStep();
                                } else {
                                    this.currentSecondary = this.currentSecondary || 'ii';
                                    this.showSecondaryDominant();
                                }
                            });
                        });

                        // Step pills navigation
                        controlPanel.querySelectorAll('.sec-step-pill').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                this.harmonicFunctionStep = parseInt(e.currentTarget.dataset.step);
                                this.showHarmonicFunctionStep();
                            });
                        });
                        document.getElementById('secStepPrev')?.addEventListener('click', () => {
                            this.harmonicFunctionStep = Math.max(0, (this.harmonicFunctionStep || 0) - 1);
                            this.showHarmonicFunctionStep();
                        });
                        document.getElementById('secStepNext')?.addEventListener('click', () => {
                            this.harmonicFunctionStep = Math.min(3, (this.harmonicFunctionStep || 0) + 1);
                            this.showHarmonicFunctionStep();
                        });

                        // Explore tab: secondary dominant buttons
                        controlPanel.querySelectorAll('[data-secondary]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('[data-secondary]').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.currentSecondary = e.currentTarget.dataset.secondary;
                                this.currentSecProg = null;
                                controlPanel.querySelectorAll('[data-secprog]').forEach(b => b.classList.remove('active'));
                                this.showSecondaryDominant();
                            });
                        });
                        controlPanel.querySelectorAll('[data-secprog]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('[data-secprog]').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.currentSecProg = parseInt(e.currentTarget.dataset.secprog);
                                this.currentSecondary = null;
                                controlPanel.querySelectorAll('[data-secondary]').forEach(b => b.classList.remove('active'));
                                this.showSecondaryProgression();
                            });
                        });
                        break;

                    case 9: // Training (Fusión Quiz + Ear Training)
                        // Tabs de modo
                        controlPanel.querySelectorAll('.training-tab').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.training-tab').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.trainingMode = e.currentTarget.dataset.tab;
                                this.showTraining();
                            });
                        });

                        // Quiz events
                        controlPanel.querySelectorAll('.quiz-cat-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.quiz-cat-btn').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.quizCategory = e.currentTarget.dataset.category;
                                this.generateQuizQuestion();
                            });
                        });
                        controlPanel.querySelectorAll('[data-diff]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.quizDifficulty = e.currentTarget.dataset.diff;
                                this.generateQuizQuestion();
                            });
                        });
                        document.getElementById('newQuizBtn')?.addEventListener('click', () => {
                            this.generateQuizQuestion();
                        });

                        // Ear Training events
                        controlPanel.querySelectorAll('.ear-exercise-tab').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.ear-exercise-tab').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.earExerciseType = e.currentTarget.dataset.exercise;
                                this.showEarTraining();
                            });
                        });
                        controlPanel.querySelectorAll('[data-ear-level]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('[data-ear-level]').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.earTrainingLevel = e.currentTarget.dataset.earLevel;
                                this.showEarTraining();
                            });
                        });
                        document.getElementById('playIntervalBtn')?.addEventListener('click', () => {
                            this.playCurrentInterval();
                        });
                        document.getElementById('newIntervalBtn')?.addEventListener('click', () => {
                            this.showEarTraining();
                        });
                        const answersPanel = document.getElementById('earTrainingAnswers');
                        if (answersPanel) {
                            answersPanel.addEventListener('click', (e) => {
                                const btn = e.target.closest('.mode-btn-simple');
                                if (btn && !btn.disabled) {
                                    const answer = btn.dataset.answer;
                                    const typedAnswer = !isNaN(answer) ? parseInt(answer) : answer;
                                    this.checkEarTrainingAnswer(typedAnswer);
                                }
                            });
                        }
                        break;

                    case 10: // Practice Library (Fusión Songs + Jam + Licks)
                        // Tabs de modo
                        controlPanel.querySelectorAll('.practice-tab').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.practice-tab').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.practiceMode = e.currentTarget.dataset.tab;
                                this.showPractice();
                            });
                        });

                        // Songs events
                        controlPanel.querySelectorAll('[data-genre]').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('[data-genre]').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                this.songGenreFilter = e.currentTarget.dataset.genre;
                                this.renderSongList();
                            });
                        });

                        // Jam Session events
                        // Track cards (delegated event)
                        const trackGrid = document.getElementById('jamTrackGrid');
                        if (trackGrid) {
                            trackGrid.addEventListener('click', (e) => {
                                const card = e.target.closest('.jam-track-item');
                                if (!card) return;

                                const trackId = card.dataset.track;
                                this.currentBackingTrack = MusicTheory.backingTracks.find(t => t.id === trackId);

                                // Resetear BPM custom al cambiar track
                                this.customBPM = null;
                                let bpmSliderEl = document.getElementById('bpmSlider');
                                let bpmDisplayEl = document.getElementById('jamBpmDisplay');
                                if (bpmSliderEl && this.currentBackingTrack) {
                                    const bpm = this.syncMetronomeWithBacking ? this.globalBPM : this.currentBackingTrack.bpm;
                                    bpmSliderEl.value = bpm;
                                    if (bpmDisplayEl) bpmDisplayEl.textContent = bpm;
                                }

                                this.showJamSession();
                            });
                        }

                        // Selector de tonalidad
                        const keySelector = document.getElementById('jamKeySelector');
                        if (keySelector) {
                            keySelector.value = this.currentRoot;
                            keySelector.addEventListener('change', (e) => {
                                this.currentRoot = parseInt(e.target.value);
                                this.showJamSession();

                                // Si está tocando, reiniciar con nueva tonalidad
                                if (this.backingTrackPlaying) {
                                    this.changeBackingTrackBPM(this.customBPM || this.currentBackingTrack.bpm);
                                }
                            });
                        }

                        document.getElementById('playTrackBtn')?.addEventListener('click', () => {
                            this.playBackingTrack();
                        });

                        document.getElementById('stopTrackBtn')?.addEventListener('click', () => {
                            this.stopBackingTrack();
                        });

                        // Toggle de sincronización BPM
                        const syncToggle = document.getElementById('syncBPMToggle');
                        if (syncToggle) {
                            const syncSlider = syncToggle.parentElement?.querySelector('.slider-sync');
                            const syncDot = syncToggle.parentElement?.querySelector('.dot-sync');

                            syncToggle.checked = this.syncMetronomeWithBacking;
                            if (this.syncMetronomeWithBacking && syncSlider && syncDot) {
                                syncSlider.style.background = '#10b981';
                                syncDot.style.transform = 'translateX(24px)';
                            } else if (syncSlider && syncDot) {
                                syncSlider.style.background = '#333';
                                syncDot.style.transform = 'translateX(0)';
                            }

                            syncToggle.addEventListener('change', (e) => {
                                this.syncMetronomeWithBacking = e.target.checked;
                                if (this.syncMetronomeWithBacking) {
                                    if (syncSlider) syncSlider.style.background = '#10b981';
                                    if (syncDot) syncDot.style.transform = 'translateX(24px)';

                                    // Actualizar BPM al global
                                    let bpmSliderEl2 = document.getElementById('bpmSlider');
                                    let bpmDisplayEl2 = document.getElementById('jamBpmDisplay');
                                    if (bpmSliderEl2) bpmSliderEl2.value = this.globalBPM;
                                    if (bpmDisplayEl2) bpmDisplayEl2.textContent = this.globalBPM;
                                    this.customBPM = null;
                                } else {
                                    if (syncSlider) syncSlider.style.background = '#333';
                                    if (syncDot) syncDot.style.transform = 'translateX(0)';
                                }
                            });
                        }

                        // BPM Slider con debounce
                        const bpmSlider = document.getElementById('bpmSlider');
                        const bpmDisplay = document.getElementById('jamBpmDisplay');
                        let bpmChangeTimeout = null;

                        if (bpmSlider && bpmDisplay) {
                            const updateBPM = (e) => {
                                const newBPM = parseInt(e.target.value);
                                bpmDisplay.textContent = newBPM;
                                // Forzar estilos inline
                                bpmDisplay.style.cssText = 'color: #dc2626 !important; font-size: 14px !important; font-weight: 600 !important; display: inline-block !important; min-width: 40px !important; text-align: center !important; opacity: 1 !important; visibility: visible !important;';

                                // Actualizar BPM inmediatamente en UI
                                if (this.syncMetronomeWithBacking) {
                                    this.globalBPM = newBPM;
                                    this.metronomeBPM = newBPM;
                                } else {
                                    this.customBPM = newBPM;
                                }

                                // Debounce para aplicar cambio
                                if (bpmChangeTimeout) clearTimeout(bpmChangeTimeout);
                                bpmChangeTimeout = setTimeout(() => {
                                    if (this.backingTrackPlaying) {
                                        this.changeBackingTrackBPM(newBPM);
                                    }
                                }, 300);
                            };

                            bpmSlider.addEventListener('input', updateBPM);
                            bpmSlider.addEventListener('change', updateBPM);

                            // NOTA: La inicialización del BPM se hace en renderJamSessionPanel
                        }

                        // Drums Toggle
                        const drumsToggle = document.getElementById('drumsToggle');
                        if (drumsToggle) {
                            const slider = drumsToggle.nextElementSibling;
                            const dot = slider?.querySelector('.dot');

                            drumsToggle.addEventListener('change', (e) => {
                                this.drumsEnabled = e.target.checked;

                                if (slider && dot) {
                                    if (this.drumsEnabled) {
                                        slider.style.background = '#dc2626';
                                        dot.style.transform = 'translateX(24px)';
                                    } else {
                                        slider.style.background = '#404040';
                                        dot.style.transform = 'translateX(0)';
                                    }
                                }

                                // Si está reproduciendo, reiniciar con/sin batería
                                if (this.backingTrackPlaying) {
                                    this.stopBackingTrack();
                                    setTimeout(() => this.playBackingTrack(), 100);
                                }
                            });
                        }

                        // Lick Library events
                        // (Los eventos de Lick Library se añadirán después de renderizar)
                        break;

                    case 11: // Chord Lab
                        // Mode tabs
                        controlPanel.querySelectorAll('.chord-lab-mode-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.chord-lab-mode-btn').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                ChordLabState.currentMode = e.currentTarget.dataset.mode;
                                this.showChordLabMode();
                            });
                        });

                        // Root selector
                        document.getElementById('chord-lab-root')?.addEventListener('change', (e) => {
                            ChordLabState.currentRoot = e.target.value;
                            this.renderChordLabVoicings();
                        });

                        // Quality buttons
                        controlPanel.querySelectorAll('.chord-lab-quality-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                controlPanel.querySelectorAll('.chord-lab-quality-btn').forEach(b => b.classList.remove('active'));
                                e.currentTarget.classList.add('active');
                                ChordLabState.currentQuality = e.currentTarget.dataset.quality;
                                this.renderChordLabVoicings();
                            });
                        });


                        // Comparison controls
                        document.getElementById('chord-lab-play-both')?.addEventListener('click', () => {
                            this.playChordLabComparison();
                        });

                        document.getElementById('chord-lab-clear-comparison')?.addEventListener('click', () => {
                            this.clearChordLabComparison();
                        });

                        // Exercise buttons
                        controlPanel.querySelectorAll('.chord-lab-exercise-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const exercise = e.currentTarget.dataset.exercise;
                                this.startChordLabExercise(exercise);
                            });
                        });

                        // Progression Builder: Initial chord selector
                        controlPanel.querySelectorAll('.initial-chord-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const chord = e.currentTarget.dataset.chord;
                                const quality = e.currentTarget.dataset.quality;
                                this.selectInitialChord(chord, quality);
                            });
                        });

                        // Progression Builder: Emotion selector
                        controlPanel.querySelectorAll('.emotion-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const emotion = e.currentTarget.dataset.emotion;
                                this.selectEmotion(emotion);
                            });
                        });

                        // Progression Builder: Play progression
                        document.getElementById('play-progression')?.addEventListener('click', () => {
                            this.playChordLabProgression();
                        });

                        // Progression Builder: Clear progression
                        document.getElementById('clear-progression')?.addEventListener('click', () => {
                            this.clearProgression();
                        });

                        // Progression Builder: Sub-mode tabs
                        controlPanel.querySelectorAll('.progression-mode-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const submode = e.currentTarget.dataset.submode;
                                this.showProgressionSubMode(submode);
                            });
                        });

                        // Progression Builder: Save progression
                        document.getElementById('save-progression')?.addEventListener('click', () => {
                            this.saveProgression();
                        });

                        // Progression Builder: Load progression
                        document.getElementById('load-progression')?.addEventListener('click', () => {
                            this.showLoadProgressionDialog();
                        });

                        // Progression Builder: Transpose
                        document.getElementById('transpose-progression')?.addEventListener('click', () => {
                            this.transposeProgressionDialog();
                        });

                        // Progression Builder: Reverse
                        document.getElementById('reverse-progression')?.addEventListener('click', () => {
                            this.reverseProgression();
                        });

                        // Progression Builder: Mutate
                        document.getElementById('mutate-progression')?.addEventListener('click', () => {
                            this.mutateProgression();
                        });

                        // Free mode key selector
                        document.getElementById('free-mode-key')?.addEventListener('change', () => {
                            this.renderFreeModeChordPalette();
                        });

                        // Chord Builder: Play button
                        document.getElementById('chord-builder-play')?.addEventListener('click', () => {
                            this.playChordBuilder();
                        });

                        // Chord Builder: Clear button
                        document.getElementById('chord-builder-clear')?.addEventListener('click', () => {
                            this.clearChordBuilder();
                        });

                        // Chord Builder: Save button
                        document.getElementById('chord-builder-save')?.addEventListener('click', () => {
                            this.saveChordBuilderVoicing();
                        });

                        // Chord Builder: Famous voicings
                        document.querySelectorAll('#chord-builder-famous button').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const voicingKey = e.currentTarget.dataset.voicing;
                                this.loadFamousVoicing(voicingKey);
                            });
                        });

                        // CAGED Tour button
                        document.getElementById('caged-tour-btn')?.addEventListener('click', () => {
                            this.playCAGEDTour();
                        });

                        // Initialize
                        this.showChordLabMode();
                        break;
                }
            },

            bindScaleEvents(container) {
                // Category buttons
                container.querySelectorAll('.scale-cat-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        container.querySelectorAll('.scale-cat-btn').forEach(b => b.classList.remove('active'));
                        e.currentTarget.classList.add('active');
                        this.currentScaleCategory = e.currentTarget.dataset.category;

                        // Show/hide pentatonic sub-selector
                        const subOptions = document.getElementById('pentatonicSubOptions');
                        if (this.currentScaleCategory === 'pentatonic') {
                            if (subOptions) subOptions.classList.remove('hidden');
                        } else {
                            if (subOptions) subOptions.classList.add('hidden');
                        }

                        this.renderScaleButtons(container);
                    });
                });

                // Audio play mode buttons
                container.querySelectorAll('[data-scale-play-mode]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const mode = e.currentTarget.dataset.scalePlayMode;
                        this.currentScalePlayMode = mode;

                        container.querySelectorAll('[data-scale-play-mode]').forEach(b => b.classList.remove('active'));
                        e.currentTarget.classList.add('active');

                        this.playCurrentScale();
                    });
                });

                // Speed selector buttons
                container.querySelectorAll('[data-speed]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const speed = e.currentTarget.dataset.speed;
                        this.currentScalePlaySpeed = speed;

                        container.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
                        e.currentTarget.classList.add('active');

                        this.playCurrentScale();
                    });
                });

                // Comparison mode toggle
                const toggleCompBtn = container.querySelector('#toggleScaleComparison');
                if (toggleCompBtn) {
                    toggleCompBtn.addEventListener('click', () => this.toggleScaleComparison());
                }

                const playCompBtn = container.querySelector('#playScaleComparison');
                if (playCompBtn) {
                    playCompBtn.addEventListener('click', () => this.playScaleComparison());
                }

                const exitCompBtn = container.querySelector('#exitScaleComparison');
                if (exitCompBtn) {
                    exitCompBtn.addEventListener('click', () => this.exitScaleComparison());
                }

                // Pentatonic tabs
                container.querySelectorAll('.penta-tab-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const tab = e.currentTarget.dataset.pentaTab;
                        this.currentPentaTab = tab;

                        container.querySelectorAll('.penta-tab-btn').forEach(b => b.classList.remove('active'));
                        e.currentTarget.classList.add('active');

                        container.querySelectorAll('.penta-tab-content').forEach(c => c.classList.remove('active'));
                        const targetContent = container.querySelector(`#pentaTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
                        if (targetContent) targetContent.classList.add('active');

                        this.renderPentaTab(tab);
                    });
                });

                // Pentatonic type buttons
                container.querySelectorAll('.penta-type-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const type = e.currentTarget.dataset.pentaType;
                        this.currentPentaType = type;

                        container.querySelectorAll('.penta-type-btn').forEach(b => b.classList.remove('active'));
                        e.currentTarget.classList.add('active');

                        this.showPentatonicInScaleContext();
                    });
                });

                // Box buttons
                container.querySelectorAll('.box-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const box = parseInt(e.currentTarget.dataset.box);
                        this.currentPentaBox = box;

                        container.querySelectorAll('.box-btn').forEach(b => b.classList.remove('active'));
                        e.currentTarget.classList.add('active');

                        this.showPentatonicInScaleContext();

                        // Update licks if in licks tab
                        if (this.currentPentaTab === 'licks') {
                            this.renderPentaLicks();
                        }
                    });
                });

                // Toggle all boxes button
                const toggleAllBoxesBtn = container.querySelector('#toggleAllBoxes');
                if (toggleAllBoxesBtn) {
                    toggleAllBoxesBtn.addEventListener('click', () => {
                        this.showAllBoxes = !this.showAllBoxes;
                        const allBoxesContainer = document.getElementById('allBoxesContainer');
                        if (this.showAllBoxes) {
                            this.showAllPentatonicBoxes();
                            toggleAllBoxesBtn.textContent = 'Ocultar vista de 5 boxes';
                        } else {
                            if (allBoxesContainer) allBoxesContainer.classList.add('hidden');
                            toggleAllBoxesBtn.textContent = 'Ver las 5 boxes simultáneamente';
                        }
                    });
                }

                this.renderScaleButtons(container);
            },

            renderScaleButtons(container) {
                const scaleList = container.querySelector('#scaleListMain');
                if (!scaleList) return;

                const scales = this.CATEGORY_SCALES[this.currentScaleCategory] || [];
                scaleList.innerHTML = '';

                scales.forEach(scaleKey => {
                    const btn = document.createElement('button');
                    btn.className = `mode-btn-simple ${scaleKey === this.currentScale ? 'active' : ''}`;
                    btn.dataset.scale = scaleKey;
                    btn.textContent = this.SCALE_NAMES[scaleKey] || scaleKey;
                    btn.addEventListener('click', () => {
                        // Si está en modo comparación
                        if (this.showingScaleComparison) {
                            this.selectScaleForComparison(scaleKey);
                        } else {
                            // Comportamiento normal
                            scaleList.querySelectorAll('.mode-btn-simple').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            this.currentScale = scaleKey;
                            this.showScaleOrPentatonic();
                            this.playCurrentScale();
                        }
                    });
                    scaleList.appendChild(btn);
                });
            },

            refreshCurrentLevel() {
                switch(this.currentLevel) {
                    case 1: this.showIntervals(); break;
                    case 2: this.showScaleOrPentatonic(); break;
                    case 3: this.showHarmonization(); break;
                    case 4:
                        // Inicializar con primer acorde esencial si no hay selección
                        if (!this.currentExtendedChordType) {
                            this.currentExtendedChordType = 'maj7';
                        }
                        this.showExtendedChord();
                        break;
                    case 5: this.showCircleOfFifths(); break;
                    case 6: this.showProgressions(); break;
                    case 7: this.showCAGEDShape(); break;
                    case 8: this.showHarmonicFunctionStep(); break;
                    case 9: this.showTraining(); break;
                    case 10: this.showPractice(); break;
                    case 11: this.showChordLab(); break;
                    default: this.showScale();
                }
            },

            showScale() {
                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const info = MusicTheory.scaleInfo[this.currentScale];

                // Hide diagrams and box selector for regular scale view
                document.getElementById('diagramsContainer').classList.add('hidden');
                document.getElementById('boxSelector').classList.add('hidden');

                Fretboard.showScale(this.currentRoot, this.currentScale);

                const noteCount = MusicTheory.scales[this.currentScale].length;
                document.getElementById('displayTitle').textContent =
                    `Escala de ${rootName} ${this.SCALE_NAMES[this.currentScale] || this.currentScale}`;
                document.getElementById('displaySubtitle').textContent =
                    `${noteCount} notas - Fórmula: ${MusicTheory.scales[this.currentScale].map(i => MusicTheory.intervalNames[i]).join(' - ')}`;

                // Show detailed scale info panel (only if info exists)
                if (info) {
                    this.showScaleInfoPanel(info, this.currentScale);

                    // Prepend "¿Qué es una escala?" block to the panel
                    const panel = this.currentLevel === 3
                        ? document.getElementById('infoPanel')
                        : document.getElementById('infoPanelOtherLevels');
                    if (panel) {
                        const scaleIntervals = MusicTheory.scales[this.currentScale];
                        // Build step pattern: T = 2 semitones, s = 1 semitone
                        const stepPattern = scaleIntervals.map((iv, i) => {
                            const diff = i === 0 ? iv : iv - scaleIntervals[i - 1];
                            return diff === 2 ? '<span style="color:#fafafa;font-weight:700;">T</span>'
                                 : diff === 1 ? '<span style="color:#dc2626;font-weight:700;">s</span>'
                                 : `<span style="color:#d97706;font-weight:700;">${diff}st</span>`;
                        });
                        const introBlock = document.createElement('div');
                        introBlock.style.cssText = 'padding:12px; background:#111; border-radius:8px; border-left:3px solid #444; margin-bottom:14px;';
                        introBlock.innerHTML = `
                            <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">¿Qué es una escala?</div>
                            <div style="font-size:13px; color:#ccc; line-height:1.7; margin-bottom:10px;">
                                Una <strong style="color:#fafafa;">escala</strong> es una selección de notas ordenadas por altura que define el
                                "vocabulario" de una pieza. Se construye siguiendo un patrón fijo de
                                <strong style="color:#fafafa;">Tonos (T = 2 semitonos)</strong> y
                                <strong style="color:#dc2626;">semitonos (s = 1 semitono)</strong>
                                desde la nota raíz. Ese patrón es el que le da su carácter sonoro.
                            </div>
                            <div style="font-size:12px; color:#888; margin-bottom:4px;">Patrón de esta escala:</div>
                            <div style="font-size:14px; letter-spacing:3px;">${stepPattern.join(' — ')}</div>
                        `;
                        const existingBox = panel.querySelector('.scale-info-box');
                        if (existingBox) existingBox.insertBefore(introBlock, existingBox.firstChild);
                    }
                } else {
                    console.warn('⚠️ Scale info not found for:', this.currentScale, '- Skipping info panel');
                }
            },

            showScaleOrPentatonic() {
                if (this.currentScaleCategory === 'pentatonic') {
                    // Mostrar sub-selector
                    const subOptions = document.getElementById('pentatonicSubOptions');
                    if (subOptions) subOptions.classList.remove('hidden');

                    // Llamar lógica de pentatónicas
                    this.showPentatonicInScaleContext();
                } else {
                    // Ocultar sub-selector
                    const subOptions = document.getElementById('pentatonicSubOptions');
                    if (subOptions) subOptions.classList.add('hidden');

                    // Llamar lógica normal de escalas
                    this.showScale();
                }
            },

            showPentatonicInScaleContext() {
                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const scaleMap = {
                    'minor': 'pentatonicMinor',
                    'major': 'pentatonicMajor',
                    'blues': 'blues'
                };
                const nameMap = {
                    'minor': 'Pentatónica Menor',
                    'major': 'Pentatónica Mayor',
                    'blues': 'Blues'
                };

                const scaleType = scaleMap[this.currentPentaType];

                // Hide chord diagrams
                document.getElementById('diagramsContainer').classList.add('hidden');

                // Comportamiento según tab activo
                if (this.currentPentaTab === 'global' || this.currentPentaType === 'major') {
                    // Tab Global o Pentatónica Mayor: full fretboard
                    Fretboard.showScale(this.currentRoot, scaleType);
                    this.updateDisplay(
                        `${rootName} ${nameMap[this.currentPentaType]}`,
                        `5 notas - Visualización completa`
                    );
                } else if (this.currentPentaTab === 'boxes') {
                    // Tab Boxes: mostrar box específico
                    const boxes = MusicTheory.pentatonicBoxes.minor;
                    const box = boxes[this.currentPentaBox];
                    const rootFret = this.currentRoot;

                    const startFret = (box.startFret + rootFret) % 12;
                    Fretboard.tonicNote = this.currentRoot;
                    Fretboard.currentScale = MusicTheory.getScale(this.currentRoot, scaleType);
                    Fretboard.setZone(Math.max(0, startFret), Math.min(12, startFret + 4));

                    if (this.currentPentaType === 'blues') {
                        Fretboard.blueNoteIndex = (this.currentRoot + 6) % 12;
                    } else {
                        Fretboard.blueNoteIndex = null;
                    }

                    Fretboard.updateDisplay();

                    this.updateDisplay(
                        `${rootName} ${nameMap[this.currentPentaType]} - ${box.name}`,
                        `Posición ${this.currentPentaBox + 1} de 5 | Trastes ${startFret}-${startFret + 3}`
                    );
                } else if (this.currentPentaTab === 'licks') {
                    // Tab Licks: mostrar box + renderizar licks
                    const boxes = MusicTheory.pentatonicBoxes.minor;
                    const box = boxes[this.currentPentaBox];
                    const rootFret = this.currentRoot;

                    const startFret = (box.startFret + rootFret) % 12;
                    Fretboard.tonicNote = this.currentRoot;
                    Fretboard.currentScale = MusicTheory.getScale(this.currentRoot, scaleType);
                    Fretboard.setZone(Math.max(0, startFret), Math.min(12, startFret + 4));
                    Fretboard.updateDisplay();

                    this.updateDisplay(
                        `${rootName} ${nameMap[this.currentPentaType]} - Licks de ${box.name}`,
                        `Frases comunes para esta posición`
                    );

                    this.renderPentaLicks();
                }

                const info = MusicTheory.scaleInfo[scaleType];
                this.showScaleInfoPanel(info, scaleType);
            },

            showScaleInfoPanel(info, scaleKey) {
                try {
                    // Use different panel depending on level
                    const panel = this.currentLevel === 3
                        ? document.getElementById('infoPanel')
                        : document.getElementById('infoPanelOtherLevels');

                    if (!panel) {
                        console.error('❌ Panel not found. Level:', this.currentLevel);
                        return;
                    }

                    // Validate info object before proceeding
                    if (!info || typeof info !== 'object') {
                        console.warn('Invalid or missing scale info for:', scaleKey);
                        panel.innerHTML = '<div class="p-4 text-void-400">Información de escala no disponible</div>';
                        return;
                    }

                    // Generate brightness bar (0-7 scale, Locrio=0, Lidio=7)
                    const brightness = info.brightness !== undefined ? info.brightness : 4;
                const brightnessPercent = (brightness / 7) * 100;
                const brightnessLabels = ['Muy Oscuro', 'Oscuro', 'Semi-Oscuro', 'Neutral', 'Semi-Brillante', 'Brillante', 'Muy Brillante', 'Máximo Brillo'];
                const brightnessLabel = brightnessLabels[brightness] || 'Neutral';

                // Generate usage context tags
                const usageContextHTML = info.usageContext ?
                    info.usageContext.map(ctx => `<span class="context-tag">${ctx}</span>`).join('')
                    : '';

                // Generate characteristic note display
                const charNote = info.characteristicNote || '-';

                // Generate chord harmonization HTML (info teórica, SIN botones clickeables)
                let chordHarmonizationHTML = '';
                if (info.chordTypes && Array.isArray(info.chordTypes) && info.chordTypes.length > 0) {
                    const romanNumerals = MusicTheory.romanNumerals?.major || ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
                    const chordInfo = info.chordTypes.map((type, i) => {
                        const typeName = type === 'maj' ? 'Mayor' : type === 'min' ? 'menor' : type === 'dim' ? 'dim' : type === 'aug' ? 'aug' : type;
                        const numeral = romanNumerals[i] !== undefined ? romanNumerals[i] : String(i + 1);
                        return `${numeral} (${typeName})`;
                    }).join(' - ');

                    chordHarmonizationHTML = `
                        <div style="border-top: 1px solid #333; padding-top: 16px; margin-top: 16px;">
                            <div class="info-label">Armonización - Acordes de la escala</div>
                            <p style="font-family: 'Barlow Condensed', sans-serif; font-size: 12px; color: #666; margin: 8px 0;">Cada grado genera un acorde al apilar terceras:</p>
                            <p style="font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #ccc; line-height: 1.6;">${chordInfo}</p>
                        </div>
                    `;
                }

                // Generate advanced scale info (genres, artists, songs)
                let advancedInfoHTML = '';

                if (info.musicalGenres && info.musicalGenres.length > 0) {
                    advancedInfoHTML = `
                        <div style="
                            border-top: 2px solid rgba(220, 38, 38, 0.3);
                            padding-top: 24px;
                            margin-top: 24px;
                            display: block !important;
                            position: relative;
                        ">
                            <div style="
                                font-family: 'Bebas Neue', sans-serif;
                                font-size: 18px;
                                letter-spacing: 2px;
                                color: #dc2626;
                                margin-bottom: 16px;
                                text-transform: uppercase;
                                display: flex;
                                align-items: center;
                                gap: 12px;
                            ">
                                <span style="
                                    display: inline-block;
                                    width: 4px;
                                    height: 20px;
                                    background: linear-gradient(to bottom, #dc2626, #7f1d1d);
                                    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
                                "></span>
                                Referencias Culturales
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="display: grid !important;">
                                <div class="info-section" style="display: block !important;">
                                    <div class="info-label" style="display: block !important;">
                                        <span style="margin-right: 6px;">🎸</span>Géneros Musicales
                                    </div>
                                    <div class="info-value" style="display: flex !important; flex-wrap: wrap !important; gap: 6px !important;">
                                        ${info.musicalGenres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                                    </div>
                                </div>
                                ${info.famousArtists && info.famousArtists.length > 0 ? `
                                <div class="info-section" style="display: block !important;">
                                    <div class="info-label" style="display: block !important;">
                                        <span style="margin-right: 6px;">🎤</span>Artistas Icónicos
                                    </div>
                                    <div class="info-description" style="display: block !important;">${info.famousArtists.join(' • ')}</div>
                                </div>
                                ` : ''}
                                ${info.famousSongs && info.famousSongs.length > 0 ? `
                                <div class="info-section" style="display: block !important;">
                                    <div class="info-label" style="display: block !important;">
                                        <span style="margin-right: 6px;">🎵</span>Canciones Clásicas
                                    </div>
                                    <div class="info-description" style="display: block !important;">${info.famousSongs.join(' • ')}</div>
                                </div>
                                ` : ''}
                            </div>
                            ${info.backingTrack ? `
                                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(220, 38, 38, 0.2);">
                                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">
                                        <span style="margin-right: 6px;">🔊</span>Backing Track
                                    </div>
                                    <audio controls style="width: 100%; max-width: 500px; filter: sepia(0.3) hue-rotate(-10deg);">
                                        <source src="${info.backingTrack}" type="audio/mp3">
                                    </audio>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }

                // Build the panel HTML with new styling
                panel.innerHTML = `
                    <div class="scale-info-box">
                        <!-- Header with emotion -->
                        <div class="info-header">
                            <div class="info-title">${info.name || scaleKey}</div>
                            <div class="info-emotion">"${info.emotion || ''}"</div>
                        </div>

                        <!-- Main info grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Left column -->
                            <div class="space-y-3">
                                <!-- Brightness meter -->
                                <div class="info-section">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="info-label" style="margin-bottom: 0;">Brillo Modal</span>
                                        <span class="info-value" style="font-size: 13px; color: #d4a574;">${brightness}/7 - ${brightnessLabel}</span>
                                    </div>
                                    <div class="brightness-bar">
                                        <div class="brightness-fill" style="width: ${brightnessPercent}%;"></div>
                                    </div>
                                    <div class="flex justify-between mt-2" style="font-size: 10px; color: #666;">
                                        <span>Locrio</span>
                                        <span>Lidio</span>
                                    </div>
                                </div>

                                <!-- Characteristic Note -->
                                <div class="info-section accent">
                                    <div class="info-label">Nota Característica</div>
                                    <div class="info-value highlight" style="font-size: 22px;">${charNote}</div>
                                    <div class="info-description">El intervalo que define su sonido único</div>
                                </div>

                                <!-- Formula -->
                                <div class="info-section">
                                    <div class="info-label">Fórmula Interválica</div>
                                    <div class="info-value" style="font-size: 14px; letter-spacing: 2px;">${info.formula || '-'}</div>
                                </div>
                            </div>

                            <!-- Right column -->
                            <div class="space-y-3">
                                <!-- Usage -->
                                <div class="info-section">
                                    <div class="info-label">Uso Práctico</div>
                                    <p style="font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: #ccc; line-height: 1.6;">${info.usage || ''}</p>
                                </div>

                                <!-- Usage Context Tags -->
                                <div class="info-section">
                                    <div class="info-label">Estilos y Contextos</div>
                                    <div class="flex flex-wrap" style="margin-top: 8px;">${usageContextHTML || '<span style="color: #666; font-size: 13px;">-</span>'}</div>
                                </div>

                                ${info.parentScale ? `
                                <!-- Parent Scale Info -->
                                <div class="parent-scale-box">
                                    <div class="info-label" style="color: #dc2626;">Escala Madre</div>
                                    <p style="font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: #ccc;">
                                        Deriva del grado <span style="font-weight: 700; color: #dc2626;">${info.degree || '?'}</span>
                                        de la escala <span style="font-weight: 700; color: #dc2626;">${MusicTheory.scaleInfo[info.parentScale]?.name || info.parentScale}</span>
                                    </p>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Chord construction explanation -->
                        ${chordHarmonizationHTML}

                        <!-- Advanced scale info (genres, artists, songs) -->
                        ${advancedInfoHTML}
                    </div>
                `;
                } catch (error) {
                    console.error('❌ ERROR in showScaleInfoPanel:', error);
                    console.error('- scaleKey:', scaleKey);
                    console.error('- info:', info);
                    console.error('- Stack:', error.stack);
                    const panel = document.getElementById('infoPanel');
                    if (panel) {
                        panel.innerHTML = '<div class="p-4 text-blood-400">Error mostrando información de escala</div>';
                    }
                }
            },

            showHarmonizationChord(scaleKey, degree) {
                const harmonization = MusicTheory.getScaleHarmonization(this.currentRoot, scaleKey);
                if (!harmonization || !harmonization[degree - 1]) return;

                const chord = harmonization[degree - 1];
                const chordRootIndex = MusicTheory.getNoteIndex(chord.root);
                const qualityNames = { maj: 'Mayor', min: 'menor', dim: 'disminuido', aug: 'aumentado' };

                // Keep the scale visible, just highlight chord tones
                Fretboard.showScale(this.currentRoot, scaleKey);

                // Set chord highlight for the chord tones
                Fretboard.chordHighlight = new Set([
                    MusicTheory.getNoteIndex(chord.root),
                    MusicTheory.getNoteIndex(chord.third),
                    MusicTheory.getNoteIndex(chord.fifth)
                ]);
                Fretboard.updateDisplay();

                // Show chord diagram if available
                const voicingKey = chord.quality === 'min' ? chord.root + 'm' : chord.root;
                let voicing = MusicTheory.chordVoicings[voicingKey];
                let position = 0;

                if (!voicing && (chord.quality === 'maj' || chord.quality === 'min')) {
                    const shape = chord.quality === 'min' ? 'E_shape_minor' : 'E_shape_major';
                    voicing = MusicTheory.chordVoicings[shape];
                    position = (chordRootIndex - 4 + 12) % 12;
                }

                const diagramContainer = document.getElementById('diagramsContainer');
                if (diagramContainer && voicing) {
                    diagramContainer.innerHTML = '';
                    diagramContainer.classList.remove('hidden');
                    const chordSuffix = chord.quality === 'min' ? 'm' : chord.quality === 'dim' ? '°' : chord.quality === 'aug' ? '+' : '';
                    const chordName = chord.root + chordSuffix;
                    const diagram = ChordDiagram.create(voicing, chordName, position);
                    diagramContainer.appendChild(diagram);
                } else if (diagramContainer) {
                    diagramContainer.classList.add('hidden');
                }

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const info = MusicTheory.scaleInfo[scaleKey];
                const chordSuffix = chord.quality === 'min' ? 'm' : chord.quality === 'dim' ? '°' : chord.quality === 'aug' ? '+' : '';
                const romanNumerals = MusicTheory.romanNumerals.major;

                this.updateDisplay(
                    `${romanNumerals[degree - 1]} - ${chord.root}${chordSuffix} (${qualityNames[chord.quality] || chord.quality})`,
                    `Grado ${degree} de ${rootName} ${info?.name || scaleKey} | Notas: ${chord.root} - ${chord.third} - ${chord.fifth}`
                );
            },

            // ========== SCALE LEVEL 2 ENHANCEMENTS ==========

            playCurrentScale() {
                const scale = MusicTheory.getScale(this.currentRoot, this.currentScale);
                if (scale && scale.length > 0) {
                    // Usar octava 3 para empezar más grave (similar a cuerda E grave en guitarra)
                    AudioEngine.playScale(scale, this.currentScalePlayMode, this.currentScalePlaySpeed, 3);
                }
            },

            toggleScaleComparison() {
                this.showingScaleComparison = !this.showingScaleComparison;
                const panel = document.getElementById('scaleComparisonPanel');
                const btn = document.getElementById('toggleScaleComparison');

                if (this.showingScaleComparison) {
                    panel?.classList.add('active');
                    btn?.classList.add('active');
                    this.comparisonScale = { first: null, second: null };
                    const scale1Elem = document.getElementById('comparisonScale1');
                    const scale2Elem = document.getElementById('comparisonScale2');
                    if (scale1Elem) {
                        scale1Elem.textContent = 'Selecciona escala 1';
                        scale1Elem.classList.add('empty');
                    }
                    if (scale2Elem) {
                        scale2Elem.textContent = 'Selecciona escala 2';
                        scale2Elem.classList.add('empty');
                    }
                } else {
                    panel?.classList.remove('active');
                    btn?.classList.remove('active');
                    this.comparisonScale = null;
                }
            },

            selectScaleForComparison(scaleKey) {
                if (!this.showingScaleComparison) return;

                const info = MusicTheory.scaleInfo[scaleKey];
                if (!info) return;

                if (!this.comparisonScale.first) {
                    this.comparisonScale.first = scaleKey;
                    const elem = document.getElementById('comparisonScale1');
                    if (elem) {
                        elem.textContent = info.name;
                        elem.classList.remove('empty');
                    }
                } else if (!this.comparisonScale.second) {
                    this.comparisonScale.second = scaleKey;
                    const elem = document.getElementById('comparisonScale2');
                    if (elem) {
                        elem.textContent = info.name;
                        elem.classList.remove('empty');
                    }
                    this.renderComparisonSplitView();
                } else {
                    // Reemplazar segunda escala
                    this.comparisonScale.second = scaleKey;
                    const elem = document.getElementById('comparisonScale2');
                    if (elem) {
                        elem.textContent = info.name;
                    }
                    this.renderComparisonSplitView();
                }
            },

            renderComparisonSplitView() {
                const container = document.getElementById('comparisonSplitView');
                if (!container || !this.comparisonScale.first || !this.comparisonScale.second) return;

                const scale1 = MusicTheory.getScale(this.currentRoot, this.comparisonScale.first);
                const scale2 = MusicTheory.getScale(this.currentRoot, this.comparisonScale.second);

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const info1 = MusicTheory.scaleInfo[this.comparisonScale.first];
                const info2 = MusicTheory.scaleInfo[this.comparisonScale.second];

                container.innerHTML = `
                    <div class="comparison-fretboard-mini">
                        <div class="comparison-scale-label">${info1.name}</div>
                        <div class="text-sm text-void-400">Notas: ${scale1.map(n => MusicTheory.getNoteName(n.note)).join(' - ')}</div>
                        <div class="text-sm text-void-400 mt-2">Fórmula: ${info1.formula}</div>
                    </div>
                    <div class="comparison-fretboard-mini">
                        <div class="comparison-scale-label">${info2.name}</div>
                        <div class="text-sm text-void-400">Notas: ${scale2.map(n => MusicTheory.getNoteName(n.note)).join(' - ')}</div>
                        <div class="text-sm text-void-400 mt-2">Fórmula: ${info2.formula}</div>
                    </div>
                `;
            },

            playScaleComparison() {
                if (!this.comparisonScale || !this.comparisonScale.first || !this.comparisonScale.second) return;

                const scale1 = MusicTheory.getScale(this.currentRoot, this.comparisonScale.first);
                const scale2 = MusicTheory.getScale(this.currentRoot, this.comparisonScale.second);

                AudioEngine.playScaleComparison(
                    scale1,
                    scale2,
                    this.currentScalePlayMode,
                    this.currentScalePlaySpeed
                );
            },

            exitScaleComparison() {
                this.showingScaleComparison = false;
                const panel = document.getElementById('scaleComparisonPanel');
                const btn = document.getElementById('toggleScaleComparison');
                panel?.classList.remove('active');
                btn?.classList.remove('active');
                this.comparisonScale = null;
            },

            showAllPentatonicBoxes() {
                const container = document.getElementById('allBoxesContainer');
                if (!container) return;

                const boxes = MusicTheory.pentatonicBoxes.minor;
                container.innerHTML = '';

                boxes.forEach((box, index) => {
                    const boxDiv = document.createElement('div');
                    boxDiv.className = 'box-diagram-mini';
                    if (index === this.currentPentaBox) {
                        boxDiv.classList.add('active');
                    }

                    boxDiv.innerHTML = `
                        <div class="box-diagram-title">${box.name}</div>
                        <div class="box-diagram-ascii">${this.generateAsciiDiagram(box)}</div>
                    `;

                    boxDiv.addEventListener('click', () => {
                        this.currentPentaBox = index;
                        this.showPentatonicInScaleContext();
                        this.showAllPentatonicBoxes();
                    });

                    container.appendChild(boxDiv);
                });

                container.classList.remove('hidden');
            },

            generateAsciiDiagram(box) {
                const strings = ['e', 'B', 'G', 'D', 'A', 'E'];
                let diagram = '';

                box.pattern.forEach((stringPattern, i) => {
                    let line = `${strings[i]}|`;
                    for (let fret = 0; fret < 5; fret++) {
                        if (stringPattern.frets.includes(fret)) {
                            line += '--•';
                        } else {
                            line += '---';
                        }
                    }
                    diagram += line + '\n';
                });

                return diagram;
            },

            renderPentaTab(tab) {
                if (tab === 'licks') {
                    this.renderPentaLicks();
                } else if (tab === 'boxes') {
                    // Ya está manejado por el template
                } else {
                    // Tab global - visualización completa
                }
            },

            renderPentaLicks() {
                const container = document.getElementById('licksContainer');
                if (!container) return;

                const currentBox = this.currentPentaBox;
                const licks = MusicTheory.pentatonicLicks.minor[`box${currentBox + 1}`];

                if (!licks || licks.length === 0) {
                    container.innerHTML = '<div class="text-sm text-void-400">No hay licks disponibles para este box</div>';
                    return;
                }

                container.innerHTML = licks.map(lick => `
                    <div class="lick-item">
                        <div class="lick-name">${lick.name}</div>
                        <div class="lick-tabs">${lick.tabs}</div>
                        <div class="lick-description">${lick.description}</div>
                    </div>
                `).join('');
            },

            showIntervals() {
                try {
                    this.resetState(['currentInterval']);
                    this.hideUIElements();

                    // Inicializar estado de intervalos
                    if (this.currentIntervalDirection === undefined) {
                        this.currentIntervalDirection = 'both';
                    }
                    if (this.currentPlayMode === undefined) {
                        this.currentPlayMode = 'ascending';
                    }
                    this.showingComparison = false;
                    this.comparisonInterval = null;

                    if (this.currentInterval === null) {
                        this.currentInterval = 4;
                        document.querySelector('[data-interval="4"]')?.classList.add('active');
                    }

                    // Activar botón de modo de reproducción por defecto
                    document.querySelector('[data-play-mode="ascending"]')?.classList.add('active');

                    this.showInterval();
                } catch (error) {
                    console.error('[ShowIntervals] Error:', error);
                }
            },

            showInterval() {
                try {
                    const rootName = MusicTheory.getNoteName(this.currentRoot);
                    const intervalName = MusicTheory.intervalNames[this.currentInterval];
                    const targetNote = MusicTheory.getNoteName(this.currentRoot + this.currentInterval);
                    const descendingNote = MusicTheory.getNoteName((this.currentRoot - this.currentInterval + 12) % 12);
                    const descendingSemitones = 12 - this.currentInterval;

                    Fretboard.clearZone();

                    // Mostrar según dirección seleccionada
                    if (this.currentIntervalDirection === 'ascending') {
                        // Solo ascendente
                        Fretboard.showInterval(this.currentRoot, this.currentInterval);
                        this.updateDisplay(
                            `${intervalName} desde ${rootName}`,
                            `Ascendente: ${rootName} → ${targetNote} (${this.currentInterval} st)`
                        );
                    } else if (this.currentIntervalDirection === 'descending') {
                        // Solo descendente
                        const descTarget = (this.currentRoot - this.currentInterval + 12) % 12;
                        Fretboard.showInterval(this.currentRoot, -this.currentInterval);
                        this.updateDisplay(
                            `${intervalName} desde ${rootName}`,
                            `Descendente: ${rootName} → ${descendingNote} (${descendingSemitones} st)`
                        );
                    } else {
                        // Ambos (comportamiento por defecto)
                        Fretboard.showInterval(this.currentRoot, this.currentInterval);
                        this.updateDisplay(
                            `${intervalName} desde ${rootName}`,
                            `Ascendente: ${rootName} → ${targetNote} (${this.currentInterval} st) | Descendente: ${rootName} → ${descendingNote} (${descendingSemitones} st)`
                        );
                    }

                    this.showIntervalInfo(this.currentInterval);

                    // Reproducir automáticamente
                    AudioEngine.playInterval(this.currentRoot, this.currentInterval, this.currentPlayMode);
                } catch (error) {
                    console.error('[ShowInterval] Error:', error);
                }
            },

            showMajorScale() {
                this.resetState();
                this.currentScale = 'major';
                const scaleSelect = document.getElementById('scaleSelect');
                if (scaleSelect) scaleSelect.value = 'major';
                this.showScale();
            },

            showHarmonization() {
                this.resetState(['currentChord']);
                if (this.currentChord === null) {
                    this.currentChord = 1;
                    document.querySelector('[data-chord="1"]')?.classList.add('active');
                }
                this.showChord();
            },

            showChord() {
                const triad = MusicTheory.getTriad(this.currentRoot, 'major', this.currentChord);
                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const chordRoot = triad.root.note;

                const qualityNames = { maj: 'Mayor', min: 'menor', dim: 'disminuido' };
                const harmonicFunctions = {
                    1: 'Tónica (reposo, estabilidad)',
                    2: 'Subdominante (movimiento suave)',
                    3: 'Tónica / Dominante (ambiguo)',
                    4: 'Subdominante (tensión media)',
                    5: 'Dominante (máxima tensión)',
                    6: 'Tónica menor (reposo menor)',
                    7: 'Dominante (tensión extrema por tritono)'
                };
                const tensions = {
                    1: '9, #11 (lidio), 13',
                    2: '9, 11, 13',
                    3: '11 (b9 evitada)',
                    4: '9, #11 (lidio), 13',
                    5: '9, b9, #9, #11, 13, b13',
                    6: '9, 11 (b13 evitada)',
                    7: '11, b13'
                };
                const voicingKey = triad.quality === 'min' ? `${chordRoot}m` : chordRoot;

                // Show chord diagram
                const diagramContainer = document.getElementById('diagramsContainer');
                diagramContainer.innerHTML = '';
                diagramContainer.classList.remove('hidden');

                // Get voicing - use open chord if available, otherwise barre
                let voicing = MusicTheory.chordVoicings[voicingKey];
                let position = 0;

                if (!voicing) {
                    // Use barre chord shape - E shape root is on 6th string (E = index 4)
                    const shape = triad.quality === 'min' ? 'E_shape_minor' : 'E_shape_major';
                    voicing = MusicTheory.chordVoicings[shape];
                    // Calculate position: distance from E (4) to target note
                    const targetIndex = MusicTheory.getNoteIndex(chordRoot);
                    position = (targetIndex - 4 + 12) % 12;
                }

                const chordName = triad.quality === 'min' ? `${chordRoot}m` : chordRoot;
                const diagram = ChordDiagram.create(voicing, chordName, position);
                diagramContainer.appendChild(diagram);

                // Show chord notes on fretboard with zone
                Fretboard.tonicNote = MusicTheory.getNoteIndex(chordRoot);
                Fretboard.currentScale = [
                    { note: triad.root.note, degree: 1 },
                    { note: triad.third.note, degree: 3 },
                    { note: triad.fifth.note, degree: 5 }
                ];
                Fretboard.highlightedNotes.clear();
                Fretboard.setZone(position, position + 4);
                Fretboard.specificPositions = null;
                Fretboard.updateDisplay();

                this.updateDisplay(
                    `${triad.roman} de ${rootName} Mayor: ${chordName} ${qualityNames[triad.quality]}`,
                    `Notas: ${triad.root.note} (T) - ${triad.third.note} (3ª) - ${triad.fifth.note} (5ª) | ${harmonicFunctions[this.currentChord]}`
                );
                document.getElementById('boxSelector').classList.add('hidden');

                // Show T-SD-D diagram only in the side panel (no explanation text)
                const panel = document.getElementById('infoPanel');
                if (panel) {
                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div class="harmonic-function-diagram">
                                ${this.renderTSDDiagram()}
                            </div>
                        </div>
                    `;
                }

                // Show chord construction explanation above the fretboard
                const isMajor = triad.quality === 'maj';
                const isDim   = triad.quality === 'dim';
                const third3rd = isMajor ? '4 semitonos (3ª Mayor)' : isDim ? '3 semitonos (3ª menor)' : '3 semitonos (3ª menor)';
                const third3rdColor = isMajor ? '#fafafa' : '#dc2626';
                const third3rdMood  = isMajor ? 'alegre / abierto' : isDim ? 'muy tenso / inestable' : 'melancólico / íntimo';
                const fifth  = isDim ? '6 semitonos (5ª disminuida = tritono!)' : '7 semitonos (5ª Justa)';
                const abovePanel = document.getElementById('infoPanelAboveFretboard');
                if (abovePanel) {
                    abovePanel.classList.remove('hidden');
                    abovePanel.innerHTML = `
                        <div style="padding:10px 16px; background:#111; border-radius:8px; border-left:3px solid #444; display:flex; align-items:center; gap:24px; flex-wrap:wrap;">
                            <div style="flex:1; min-width:200px;">
                                <div style="font-size:11px; color:#555; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">¿Cómo se construye un acorde?</div>
                                <div style="font-size:15px; color:#ccc; line-height:1.6;">
                                    Un acorde es <strong style="color:#fafafa;">3 o más notas tocadas a la vez</strong>.
                                    La triada básica apila <strong style="color:#dc2626;">raíz</strong> + <strong style="color:${third3rdColor};">3ª</strong> + <strong style="color:#3b82f6;">5ª</strong> sobre la escala.
                                    La <strong style="color:${third3rdColor};">3ª ${isMajor ? 'Mayor' : isDim ? 'menor' : 'menor'}</strong> define el carácter del acorde —
                                    este suena <strong style="color:#fafafa;">${third3rdMood}</strong>.
                                    ${isDim ? 'La <strong style="color:#3b82f6;">5ª disminuida</strong> añade inestabilidad extrema (tritono).' : 'La <strong style="color:#3b82f6;">5ª Justa</strong> da solidez y estabilidad al conjunto.'}
                                </div>
                            </div>
                            <div style="display:flex; gap:8px; align-items:center; flex-shrink:0;">
                                <div style="padding:6px 10px; background:#1a1a1a; border:1px solid #dc2626; border-radius:6px; text-align:center;">
                                    <div style="font-family:'Bebas Neue'; font-size:16px; color:#dc2626;">${triad.root.note}</div>
                                    <div style="font-size:9px; color:#666;">Raíz (1)</div>
                                </div>
                                <div style="color:#555; font-size:18px;">+</div>
                                <div style="padding:6px 10px; background:#1a1a1a; border:1px solid ${third3rdColor}; border-radius:6px; text-align:center;">
                                    <div style="font-family:'Bebas Neue'; font-size:16px; color:${third3rdColor};">${triad.third.note}</div>
                                    <div style="font-size:9px; color:#666;">3ª ${isMajor ? 'Mayor' : 'menor'}</div>
                                </div>
                                <div style="color:#555; font-size:18px;">+</div>
                                <div style="padding:6px 10px; background:#1a1a1a; border:1px solid #3b82f6; border-radius:6px; text-align:center;">
                                    <div style="font-family:'Bebas Neue'; font-size:16px; color:#3b82f6;">${triad.fifth.note}</div>
                                    <div style="font-size:9px; color:#666;">5ª ${isDim ? 'Disminuida' : 'Justa'}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            },

            renderTSDDiagram() {
                const centerX = 120, centerY = 120, radius = 65;

                const functions = {
                    'T': { chords: [1, 6], color: '#10b981', label: 'Tónica', angle: 90 },
                    'SD': { chords: [2, 4], color: '#f59e0b', label: 'Subdominante', angle: 210 },
                    'D': { chords: [5, 7], color: '#dc2626', label: 'Dominante', angle: 330 }
                };

                let svg = '<svg width="240" height="240" viewBox="0 0 240 240">';

                // Definir arrowhead
                svg += '<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#444"/></marker></defs>';

                // Flechas de resolución
                const arrows = [
                    { fromAngle: 210, toAngle: 330 }, // SD → D
                    { fromAngle: 330, toAngle: 90 },  // D → T
                    { fromAngle: 90, toAngle: 210 }   // T → SD
                ];

                arrows.forEach(({ fromAngle, toAngle }) => {
                    const x1 = centerX + (radius - 24) * Math.cos(fromAngle * Math.PI / 180);
                    const y1 = centerY - (radius - 24) * Math.sin(fromAngle * Math.PI / 180);
                    const x2 = centerX + (radius - 24) * Math.cos(toAngle * Math.PI / 180);
                    const y2 = centerY - (radius - 24) * Math.sin(toAngle * Math.PI / 180);

                    svg += `<path d="M ${x1} ${y1} Q ${centerX} ${centerY} ${x2} ${y2}"
                                 stroke="#444" stroke-width="1.5" fill="none" opacity="0.3"
                                 marker-end="url(#arrowhead)"/>`;
                });

                // Nodos de función
                Object.entries(functions).forEach(([funcKey, funcData]) => {
                    const x = centerX + radius * Math.cos(funcData.angle * Math.PI / 180);
                    const y = centerY - radius * Math.sin(funcData.angle * Math.PI / 180);
                    const isActive = funcData.chords.includes(this.currentChord);

                    svg += `<g class="function-node ${isActive ? 'active' : ''}">
                                <circle cx="${x}" cy="${y}" r="32"
                                        fill="${funcData.color}"
                                        stroke="${isActive ? '#fff' : '#0a0a0a'}"
                                        stroke-width="${isActive ? '3' : '2'}"
                                        opacity="${isActive ? '1' : '0.6'}"/>
                                <text x="${x}" y="${y - 4}" text-anchor="middle"
                                      fill="#fff" font-size="14" font-weight="bold">
                                    ${funcKey}
                                </text>
                                <text x="${x}" y="${y + 9}" text-anchor="middle"
                                      fill="#fff" font-size="10" opacity="0.95">
                                    ${funcData.label}
                                </text>
                            </g>`;
                });

                svg += '</svg>';

                return svg;
            },

            showModes() {
                this.resetState(['currentMode']);
                this.hideUIElements();
                if (this.currentMode === null) {
                    this.currentMode = 1;
                    document.querySelector('[data-mode="1"]')?.classList.add('active');
                }
                this.showMode();
            },

            showMode() {
                const modeNames = ['Jónico', 'Dórico', 'Frigio', 'Lidio', 'Mixolidio', 'Eólico', 'Locrio'];
                const scaleTypes = ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'minor', 'locrian'];
                const romanNumerals = MusicTheory.romanNumerals.chromatic;
                const charChords = ['Imaj7', 'IVmaj7 (lydian chord)', 'bIImaj7', 'IImaj7', 'bVIImaj7', 'bIIImaj7', 'bVmaj7'];
                const modeExamples = [
                    'Happy Birthday, Twinkle Twinkle',
                    'So What (Miles Davis), Scarborough Fair',
                    'White Rabbit (Jefferson Airplane), flamenco',
                    'Flying (E.T.), The Simpsons Theme',
                    'Norwegian Wood (Beatles), Sweet Home Alabama',
                    'Stairway to Heaven, All Along the Watchtower',
                    'Raro en uso melódico. YYZ (Rush) en pasajes'
                ];

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                this.currentScale = scaleTypes[this.currentMode - 1];

                Fretboard.showScale(this.currentRoot, this.currentScale);

                const scaleSelect = document.getElementById('scaleSelect');
                if (scaleSelect) scaleSelect.value = this.currentScale;

                // Determine what note changes vs Jónico
                const majorFormula = MusicTheory.scales['major'];
                const modeFormula = MusicTheory.scales[this.currentScale];
                const differences = [];
                for (let i = 0; i < Math.min(majorFormula.length, modeFormula.length); i++) {
                    if (majorFormula[i] !== modeFormula[i]) {
                        const diff = modeFormula[i] - majorFormula[i];
                        differences.push(`grado ${i+1}: ${diff > 0 ? '+' : ''}${diff} st`);
                    }
                }
                const diffText = differences.length > 0 ? differences.join(', ') : 'Igual al Jónico (Mayor)';

                this.updateDisplay(
                    `${rootName} ${modeNames[this.currentMode - 1]}`,
                    `Modo ${this.currentMode} - Grado ${romanNumerals[this.currentMode - 1]} | Acorde característico: ${charChords[this.currentMode - 1]}`
                );
                // Mostrar info del modo
                const info = MusicTheory.scaleInfo[this.currentScale];
                this.showScaleInfoPanel(info, this.currentScale);

                // Add mode comparison below the info panel
                const panel = document.getElementById('infoPanel');
                if (panel) {
                    const compDiv = document.createElement('div');
                    compDiv.className = 'scale-info-box';
                    compDiv.style.marginTop = '16px';
                    compDiv.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="info-section accent">
                                <div class="info-label">Diferencia vs Jónico (Mayor)</div>
                                <div class="info-description" style="color: #ccc;">${diffText}</div>
                            </div>
                            <div class="info-section">
                                <div class="info-label">Acorde Característico</div>
                                <div class="info-value" style="font-size: 16px;">${charChords[this.currentMode - 1]}</div>
                            </div>
                            <div class="info-section">
                                <div class="info-label">Canciones/Artistas</div>
                                <div class="info-description" style="color: #ccc; font-size: 13px;">${modeExamples[this.currentMode - 1]}</div>
                            </div>
                        </div>
                    `;
                    panel.appendChild(compDiv);
                }
            },

            // ========== PENTATÓNICAS ==========

            showPentatonics() {
                this.resetState(['currentPentatonic']);
                if (this.currentPentatonic === null) {
                    this.currentPentatonic = 'minor';
                    document.querySelector('[data-penta="minor"]')?.classList.add('active');
                }
                this.currentBox = 0;
                this.showPentatonic();
            },

            // ========== CÍRCULO DE QUINTAS ==========

            showCircleOfFifths() {
                this.resetState();
                this.hideUIElements();
                Fretboard.showScale(this.currentRoot, 'major');

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const relativeMinor = MusicTheory.getNoteName(MusicTheory.getRelativeMinor(this.currentRoot));

                // Key signature info
                const keySignatures = {
                    0: '0 alteraciones', 7: '1 # (F#)', 2: '2 # (F#, C#)', 9: '3 # (F#, C#, G#)',
                    4: '4 # (F#, C#, G#, D#)', 11: '5 # (F#, C#, G#, D#, A#)', 6: '6 #/b',
                    1: '7 # / 5 b', 8: '4 b (Bb, Eb, Ab, Db)', 3: '3 b (Bb, Eb, Ab)',
                    10: '2 b (Bb, Eb)', 5: '1 b (Bb)'
                };

                this.updateDisplay(
                    `Tonalidad: ${rootName} Mayor`,
                    `Relativo menor: ${relativeMinor}m | ${keySignatures[this.currentRoot] || ''}`
                );
                this.renderCircleOfFifths();

                // Show diatonic chords and neighbor keys
                const triads = MusicTheory.getScaleTriads(this.currentRoot, 'major');
                const romanNumerals = MusicTheory.romanNumerals?.major || ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
                const qualitySymbols = { maj: '', min: 'm', dim: '°' };

                const neighborUp = MusicTheory.getNoteName((this.currentRoot + 7) % 12);
                const neighborDown = MusicTheory.getNoteName((this.currentRoot + 5) % 12);

                // Generate triads HTML outside template
                const triadsHTML = triads.map((t, i) => {
                    const numeral = romanNumerals[i] !== undefined ? romanNumerals[i] : String(i + 1);
                    return `
                        <div style="padding: 8px 12px; background: #1a1a1a; border: 2px solid #333; border-radius: 8px; text-align: center; min-width: 55px;">
                            <div style="font-family: 'Bebas Neue'; font-size: 18px; color: #fafafa;">${numeral}</div>
                            <div style="font-family: 'IBM Plex Mono'; font-size: 12px; color: #dc2626;">${t.root.note}${qualitySymbols[t.quality] || ''}</div>
                        </div>
                    `;
                }).join('');

                const panel = document.getElementById('circleSidePanel') || document.getElementById('infoPanelOtherLevels');
                if (panel) {
                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div style="padding:10px 14px; background:#111; border-radius:8px; border-left:3px solid #444; margin-bottom:14px;">
                                <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">¿Por qué se llama "de Quintas"?</div>
                                <div style="font-size:13px; color:#ccc; line-height:1.7;">
                                    Porque cada nota del círculo está exactamente a una
                                    <strong style="color:#fafafa;">quinta justa (7 semitonos)</strong> de la anterior en sentido horario.
                                    C → G → D → A → E → B… Tras 12 pasos se regresa a C. Esto no es casualidad: la 5ª justa
                                    es el intervalo más consonante después de la octava, por eso las tonalidades vecinas
                                    en el círculo comparten <strong style="color:#fafafa;">6 de 7 notas</strong> — modulación muy suave.
                                </div>
                                <div style="margin-top:10px; font-size:12px; color:#888; line-height:1.6;">
                                    <strong style="color:#fafafa;">Círculo exterior</strong> = tonalidades Mayores  ·
                                    <strong style="color:#fafafa;">Círculo interior</strong> = sus relativos menores (misma armadura)  ·
                                    <strong style="color:#fafafa;">Vecinas</strong> = 1 sostenido/bemol de diferencia
                                </div>
                            </div>
                            <div class="info-header">
                                <div class="info-title">Tonalidad ${rootName} Mayor</div>
                                <div class="info-emotion">Armadura: ${keySignatures[this.currentRoot] || 'N/A'}</div>
                            </div>
                            <div class="info-section" style="margin-bottom: 12px;">
                                <div class="info-label">Acordes Diatónicos</div>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    ${triadsHTML}
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="info-section">
                                    <div class="info-label">Tonalidades Vecinas (modulación fácil)</div>
                                    <div class="info-description" style="color: #ccc; margin-top: 4px;">
                                        ← <strong>${neighborDown} Mayor</strong> (IV, subdominante) |
                                        <strong>${neighborUp} Mayor</strong> (V, dominante) →
                                    </div>
                                    <div class="info-description" style="color: #888; margin-top: 4px;">
                                        Relativo menor: <strong>${relativeMinor}m</strong>
                                    </div>
                                </div>
                                <div class="info-section accent">
                                    <div class="info-label">Armadura</div>
                                    <div class="info-value" style="font-size: 15px;">${keySignatures[this.currentRoot] || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            },

            renderCircleOfFifths() {
                // Try both possible container IDs
                let container = document.getElementById('circleOfFifthsMain');
                if (!container) container = document.getElementById('circleOfFifths');
                if (!container) return;

                container.innerHTML = '';
                const centerX = 150;
                const centerY = 150;
                const outerRadius = 126;
                const innerRadius = 86;

                // Major keys (outer circle)
                MusicTheory.circleOfFifths.forEach((noteIndex, i) => {
                    const angle = (i * 30 - 90) * Math.PI / 180;
                    const x = centerX + outerRadius * Math.cos(angle) - 19;
                    const y = centerY + outerRadius * Math.sin(angle) - 19;

                    const btn = document.createElement('button');
                    btn.className = `circle-note ${noteIndex === this.currentRoot ? 'active' : ''}`;
                    btn.style.left = `${x}px`;
                    btn.style.top = `${y}px`;
                    btn.textContent = MusicTheory.circleOfFifthsLabels[i];
                    btn.dataset.note = noteIndex;
                    btn.addEventListener('click', async () => {
                        this.currentRoot = noteIndex;
                        document.getElementById('rootSelect').value = noteIndex;
                        this.showCircleOfFifths();
                        // Play major chord for this key
                        if (AudioEngine.audioContext) {
                            if (AudioEngine.audioContext.state === 'suspended') await AudioEngine.audioContext.resume();
                            const triad = MusicTheory.getTriad(noteIndex, 'major', 1);
                            const chordNotes = [
                                MusicTheory.getNoteIndex(triad.root.note),
                                MusicTheory.getNoteIndex(triad.third.note),
                                MusicTheory.getNoteIndex(triad.fifth.note)
                            ];
                            AudioEngine.playChord(chordNotes, 1.2);
                        }
                    });
                    container.appendChild(btn);
                });

                // Minor keys (inner circle)
                MusicTheory.circleOfFifths.forEach((noteIndex, i) => {
                    const minorNote = MusicTheory.getRelativeMinor(noteIndex);
                    const angle = (i * 30 - 90) * Math.PI / 180;
                    const x = centerX + innerRadius * Math.cos(angle) - 14;
                    const y = centerY + innerRadius * Math.sin(angle) - 14;

                    const minorLabels = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];
                    const btn = document.createElement('button');
                    const isRelativeOfCurrent = minorNote === MusicTheory.getRelativeMinor(this.currentRoot);
                    btn.className = `circle-note minor ${isRelativeOfCurrent ? 'active' : ''}`;
                    btn.style.left = `${x}px`;
                    btn.style.top = `${y}px`;
                    btn.textContent = minorLabels[i];
                    btn.dataset.note = minorNote;
                    btn.addEventListener('click', async () => {
                        this.currentRoot = MusicTheory.getRelativeMajor(minorNote);
                        document.getElementById('rootSelect').value = this.currentRoot;
                        this.showCircleOfFifths();
                        // Play minor chord for this key
                        if (AudioEngine.audioContext) {
                            if (AudioEngine.audioContext.state === 'suspended') await AudioEngine.audioContext.resume();
                            const triad = MusicTheory.getTriad(minorNote, 'minor', 1);
                            const chordNotes = [
                                MusicTheory.getNoteIndex(triad.root.note),
                                MusicTheory.getNoteIndex(triad.third.note),
                                MusicTheory.getNoteIndex(triad.fifth.note)
                            ];
                            AudioEngine.playChord(chordNotes, 1.2);
                        }
                    });
                    container.appendChild(btn);
                });
            },

            _startCircleTour(controlPanel) {
                const speeds = { slow: 2200, medium: 1400, fast: 750 };
                const delay = speeds[this._tourSpeed] || 1400;
                const order = [...MusicTheory.circleOfFifths];
                let step = 0;

                const tourPlayBtn = document.getElementById('tourPlayBtn');
                const tourStopBtn = document.getElementById('tourStopBtn');
                const circleInfo = document.getElementById('circleInfo');
                if (tourPlayBtn) tourPlayBtn.style.display = 'none';
                if (tourStopBtn) tourStopBtn.style.display = '';

                const playStep = async () => {
                    if (this._tourInterval === null) return;
                    const noteIndex = order[step % order.length];
                    this.currentRoot = noteIndex;
                    document.getElementById('rootSelect').value = noteIndex;
                    this.showCircleOfFifths();
                    if (circleInfo) circleInfo.textContent = MusicTheory.getNoteName(noteIndex) + ' Mayor';
                    if (AudioEngine.audioContext) {
                        if (AudioEngine.audioContext.state === 'suspended') await AudioEngine.audioContext.resume();
                        const triad = MusicTheory.getTriad(noteIndex, 'major', 1);
                        const chordNotes = [
                            MusicTheory.getNoteIndex(triad.root.note),
                            MusicTheory.getNoteIndex(triad.third.note),
                            MusicTheory.getNoteIndex(triad.fifth.note)
                        ];
                        AudioEngine.playChord(chordNotes, delay / 1000 * 0.8);
                    }
                    step++;
                    if (step >= order.length) {
                        this._stopCircleTour(controlPanel);
                        return;
                    }
                    this._tourInterval = setTimeout(playStep, delay);
                };

                this._tourInterval = setTimeout(playStep, 0);
            },

            _stopCircleTour(controlPanel) {
                if (this._tourInterval !== null) {
                    clearTimeout(this._tourInterval);
                    this._tourInterval = null;
                }
                const tourPlayBtn = document.getElementById('tourPlayBtn');
                const tourStopBtn = document.getElementById('tourStopBtn');
                const circleInfo = document.getElementById('circleInfo');
                if (tourPlayBtn) tourPlayBtn.style.display = '';
                if (tourStopBtn) tourStopBtn.style.display = 'none';
                if (circleInfo) circleInfo.textContent = '—';
            },

            // ========== ACORDES DE SÉPTIMA ==========

            // ========== PROGRESIONES ==========

            showProgressions() {
                this.resetState(['currentProgression']);
                if (!this.currentProgression) {
                    this.currentProgression = 'I-IV-V-I';
                    document.querySelector('[data-progression="I-IV-V-I"]')?.classList.add('active');
                }
                this.showProgression();
            },

            showProgression() {
                if (!this.currentProgression) return;

                const prog = MusicTheory.progressions[this.currentProgression];
                if (!prog) return;
                const rootName = MusicTheory.getNoteName(this.currentRoot);

                // Hide box selector
                document.getElementById('boxSelector').classList.add('hidden');

                // Build all chords for the progression
                const chords = prog.degrees.map(degree => {
                    let chordRoot, quality, triad;

                    // Handle flat degrees from minor key
                    const flatDegreeOffsets = {
                        '-1': { offset: 0, quality: 'min' },    // i
                        '-3': { offset: 3, quality: 'maj' },    // bIII
                        '-4': { offset: 5, quality: 'min' },    // iv
                        '-5': { offset: 7, quality: 'min' },    // v
                        '-6': { offset: 8, quality: 'maj' },    // bVI
                        '-7': { offset: 10, quality: 'maj' },   // bVII
                    };

                    if (flatDegreeOffsets[String(degree)]) {
                        const info = flatDegreeOffsets[String(degree)];
                        chordRoot = MusicTheory.getNoteName((this.currentRoot + info.offset) % 12);
                        quality = info.quality;
                        const thirdOffset = quality === 'min' ? 3 : 4;
                        triad = {
                            root: { note: chordRoot },
                            third: { note: MusicTheory.getNoteName((this.currentRoot + info.offset + thirdOffset) % 12) },
                            fifth: { note: MusicTheory.getNoteName((this.currentRoot + info.offset + 7) % 12) }
                        };
                    } else if (degree > 0) {
                        triad = MusicTheory.getTriad(this.currentRoot, 'major', degree);
                        chordRoot = triad.root.note;
                        quality = triad.quality;
                    } else {
                        // Fallback
                        chordRoot = MusicTheory.getNoteName(this.currentRoot);
                        quality = 'maj';
                        triad = { root: { note: chordRoot }, third: { note: chordRoot }, fifth: { note: chordRoot } };
                    }

                    const voicingKey = quality === 'min' ? `${chordRoot}m` : chordRoot;
                    let voicing = MusicTheory.chordVoicings[voicingKey];
                    let position = 0;

                    if (!voicing) {
                        const shape = quality === 'min' ? 'E_shape_minor' : 'E_shape_major';
                        voicing = MusicTheory.chordVoicings[shape];
                        // Calculate position: distance from E (4) to target note
                        const targetIndex = MusicTheory.getNoteIndex(chordRoot);
                        position = (targetIndex - 4 + 12) % 12;
                    }

                    return {
                        name: quality === 'min' ? `${chordRoot}m` : chordRoot,
                        voicing,
                        position,
                        triad
                    };
                });

                // Show all chord diagrams
                const diagramContainer = document.getElementById('diagramsContainer');
                diagramContainer.innerHTML = '';
                diagramContainer.classList.remove('hidden');
                diagramContainer.classList.add('scrollable-horizontal');

                chords.forEach((chord, i) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'chord-wrapper';
                    wrapper.style.cursor = 'pointer';
                    wrapper.style.position = 'relative';
                    wrapper.style.transition = 'all 0.2s';

                    if (i === this.currentProgressionChordIndex) {
                        wrapper.classList.add('active-chord');
                        wrapper.style.opacity = '1';
                        // Borde animado para acorde activo
                        if (this.progressionPlaying && !this.progressionPaused) {
                            wrapper.style.border = '3px solid #10b981';
                            wrapper.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                        }
                    } else {
                        wrapper.style.opacity = '0.6';
                    }

                    wrapper.addEventListener('click', () => {
                        if (!this.progressionPlaying) {
                            this.currentProgressionChordIndex = i;
                            this.showProgression();
                        }
                    });

                    // Hover effects
                    wrapper.addEventListener('mouseenter', () => {
                        if (!this.progressionPlaying) {
                            wrapper.style.transform = 'scale(1.15)';
                            wrapper.style.zIndex = '100';
                            wrapper.style.opacity = '1';
                        }
                    });

                    wrapper.addEventListener('mouseleave', () => {
                        if (!this.progressionPlaying) {
                            wrapper.style.transform = 'scale(1)';
                            wrapper.style.zIndex = '1';
                            if (i !== this.currentProgressionChordIndex) {
                                wrapper.style.opacity = '0.6';
                            }
                        }
                    });

                    // Numeración del acorde
                    const numberBadge = document.createElement('div');
                    numberBadge.style.cssText = `
                        position: absolute;
                        top: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: ${this.getChordFunctionColor(prog, i)};
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 12px;
                        z-index: 10;
                    `;
                    numberBadge.textContent = i + 1;
                    wrapper.appendChild(numberBadge);

                    // Tooltip con notas del acorde
                    const tooltip = document.createElement('div');
                    const chordNotes = [chord.triad.root.note, chord.triad.third.note, chord.triad.fifth.note].join(' - ');
                    tooltip.style.cssText = `
                        position: absolute;
                        bottom: -30px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 11px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.2s;
                        z-index: 200;
                    `;
                    tooltip.textContent = chordNotes;
                    wrapper.appendChild(tooltip);

                    wrapper.addEventListener('mouseenter', () => {
                        tooltip.style.opacity = '1';
                    });

                    wrapper.addEventListener('mouseleave', () => {
                        tooltip.style.opacity = '0';
                    });

                    const diagram = ChordDiagram.create(chord.voicing, chord.name, chord.position);

                    // Clase compact si hay más de 4 acordes
                    if (chords.length > 4) {
                        diagram.classList.add('compact');
                    }

                    wrapper.appendChild(diagram);
                    diagramContainer.appendChild(wrapper);
                });

                // Auto-scroll al acorde activo
                setTimeout(() => {
                    const active = diagramContainer.querySelector('.active-chord');
                    if (active) {
                        active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                }, 100);

                // Show current chord on fretboard
                const currentChord = chords[this.currentProgressionChordIndex];
                const triad = currentChord.triad;
                Fretboard.tonicNote = MusicTheory.getNoteIndex(triad.root.note);
                Fretboard.currentScale = [
                    { note: triad.root.note, degree: 1 },
                    { note: triad.third.note, degree: 3 },
                    { note: triad.fifth.note, degree: 5 }
                ];
                Fretboard.highlightedNotes.clear();
                Fretboard.chordHighlight = null;
                Fretboard.clearZone();
                Fretboard.specificPositions = null;
                Fretboard.updateDisplay();

                const styleLabel = prog.style ? ` | Estilo: ${prog.style}` : '';
                const funcLabel = prog.function ? ` | Función: ${prog.function[this.currentProgressionChordIndex]}` : '';
                this.updateDisplay(
                    `Progresión ${this.currentProgression} en ${rootName}`,
                    `${prog.name}${styleLabel} | Acorde ${this.currentProgressionChordIndex + 1}/${prog.degrees.length}: ${currentChord.name}${funcLabel}`
                );
                this.clearInfoPanel();

                // NUEVO: Análisis de progresión
                this.renderProgressionAnalysis(prog, currentChord, this.currentProgressionChordIndex);
            },

            // NUEVO: Renderizar análisis de progresión
            renderProgressionAnalysis(prog, currentChord, chordIndex) {
                const infoPanel = document.getElementById('infoPanel');
                if (!infoPanel || !prog.function || !prog.analysis) return;

                infoPanel.classList.remove('hidden');

                const functionColors = {
                    'T': '#10b981',   // Verde - Tónica
                    'Tm': '#10b981',  // Verde - Tónica menor
                    'SD': '#f59e0b',  // Amarillo - Subdominante
                    'SDm': '#f59e0b', // Amarillo - Subdominante menor
                    'D': '#dc2626',   // Rojo - Dominante
                    'Dm': '#dc2626',  // Rojo - Dominante menor
                    'bVII': '#8b5cf6', // Púrpura - Acorde prestado
                    'bVI': '#8b5cf6',
                    'bIII': '#8b5cf6'
                };

                const functionLabels = {
                    'T': 'Tónica (Reposo)',
                    'Tm': 'Tónica menor (Reposo)',
                    'SD': 'Subdominante (Tensión suave)',
                    'SDm': 'Subdominante menor',
                    'D': 'Dominante (Tensión fuerte)',
                    'Dm': 'Dominante menor',
                    'bVII': 'Acorde prestado',
                    'bVI': 'Acorde prestado',
                    'bIII': 'Acorde prestado'
                };

                // Crear chips de acordes con colores
                const chordChips = prog.degrees.map((degree, i) => {
                    const func = prog.function[i];
                    const color = functionColors[func] || '#666';
                    const isActive = i === chordIndex;
                    const opacity = isActive ? '1' : '0.5';
                    const romanNumeral = this.getRomanNumeral(degree);

                    return `
                        <div style="
                            display: inline-block;
                            padding: 8px 16px;
                            margin: 4px;
                            background: ${color};
                            color: white;
                            border-radius: 6px;
                            font-weight: bold;
                            opacity: ${opacity};
                            ${isActive ? 'transform: scale(1.1);' : ''}
                            transition: all 0.2s;
                        ">
                            ${romanNumeral}
                        </div>
                    `;
                }).join('');

                const currentFunction = prog.function[chordIndex];
                const functionDesc = functionLabels[currentFunction] || currentFunction;

                // Verificar estado de colapso desde localStorage
                const isCollapsed = localStorage.getItem('progressionPanelCollapsed') === 'true';

                infoPanel.innerHTML = `
                    <div style="padding:10px 14px; background:#111; border-radius:8px; border-left:3px solid #444; margin-bottom:14px;">
                        <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">¿Qué es una progresión armónica?</div>
                        <div style="font-size:13px; color:#ccc; line-height:1.7;">
                            Una <strong style="color:#fafafa;">progresión</strong> es una secuencia de acordes que crea una
                            historia de <strong style="color:#dc2626;">tensión y resolución</strong>. Los acordes no son
                            independientes: cada uno genera expectativa sobre el siguiente.
                            El patrón <strong style="color:#fafafa;">T → SD → D → T</strong> (reposo → movimiento → tensión → reposo)
                            es el motor de casi toda la música occidental.
                        </div>
                    </div>
                    <div style="position: relative;">
                        <button id="toggleProgressionPanel" style="
                            position: absolute;
                            top: -40px;
                            right: 0;
                            padding: 8px 16px;
                            background: rgba(220, 38, 38, 0.2);
                            border: 1px solid rgba(220, 38, 38, 0.4);
                            border-radius: 4px;
                            color: #dc2626;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 600;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='rgba(220, 38, 38, 0.3)'" onmouseout="this.style.background='rgba(220, 38, 38, 0.2)'">
                            ${isCollapsed ? '▼ Mostrar Análisis' : '▲ Ocultar Análisis'}
                        </button>

                        <div id="progressionPanelContent" style="
                            max-height: ${isCollapsed ? '0' : '1000px'};
                            overflow: hidden;
                            transition: max-height 0.3s ease-in-out, opacity 0.3s;
                            opacity: ${isCollapsed ? '0' : '1'};
                        ">
                            <div class="info-section" style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                                <div class="info-label" style="color: #dc2626; margin-bottom: 12px;">ANÁLISIS ARMÓNICO</div>
                                <div style="margin-bottom: 16px;">
                                    ${chordChips}
                                </div>
                                <div style="margin-bottom: 12px; padding: 12px; background: rgba(220,38,38,0.1); border-left: 3px solid ${functionColors[currentFunction]}; border-radius: 4px;">
                                    <strong style="color: ${functionColors[currentFunction]};">Acorde actual:</strong>
                                    ${functionDesc}
                                </div>
                                <div style="color: #ccc; font-size: 14px; line-height: 1.6;">
                                    ${prog.analysis}
                                </div>
                            </div>

                            ${prog.songs ? `
                                <div class="info-section" style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px;">
                                    <div class="info-label" style="color: #dc2626; margin-bottom: 8px;">CANCIONES FAMOSAS</div>
                                    <div style="color: #aaa; font-size: 13px; line-height: 1.8;">
                                        ${prog.songs.map(song => `• ${song}`).join('<br>')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;

                // Agregar event listener para el botón de toggle
                setTimeout(() => {
                    const toggleBtn = document.getElementById('toggleProgressionPanel');
                    const content = document.getElementById('progressionPanelContent');
                    if (toggleBtn && content) {
                        toggleBtn.addEventListener('click', () => {
                            const isCurrentlyCollapsed = content.style.maxHeight === '0px';
                            content.style.maxHeight = isCurrentlyCollapsed ? '1000px' : '0';
                            content.style.opacity = isCurrentlyCollapsed ? '1' : '0';
                            toggleBtn.textContent = isCurrentlyCollapsed ? '▲ Ocultar Análisis' : '▼ Mostrar Análisis';
                            localStorage.setItem('progressionPanelCollapsed', !isCurrentlyCollapsed);
                        });
                    }
                }, 0);
            },

            // NUEVO: Convertir grado numérico a romano
            getRomanNumeral(degree) {
                const romanMap = {
                    '-1': 'i', '-3': 'bIII', '-4': 'iv', '-5': 'v', '-6': 'bVI', '-7': 'bVII',
                    '1': 'I', '2': 'ii', '3': 'iii', '4': 'IV', '5': 'V', '6': 'vi', '7': 'vii°'
                };
                return romanMap[String(degree)] || degree;
            },

            // ========== REPRODUCCIÓN AUTOMÁTICA DE PROGRESIONES ==========

            playProgression() {
                if (this.progressionPlaying && !this.progressionPaused) {
                    return;
                }

                if (!this.currentProgression) {
                    console.error('❌ No progression selected');
                    return;
                }

                const prog = MusicTheory.progressions[this.currentProgression];

                if (!prog) {
                    console.error('❌ Progression not found:', this.currentProgression);
                    return;
                }

                // Si está pausado, reanudar
                if (this.progressionPaused) {
                    this.progressionPaused = false;
                    this.progressionPlaying = true;
                    this.updateProgressionControls();
                    this.startProgressionPlayback(prog);
                    return;
                }

                // Iniciar desde el principio
                this.progressionPlaying = true;
                this.progressionPaused = false;
                this.currentProgressionChordIndex = 0;
                this.progressionCurrentRepeat = 0;
                this.updateProgressionControls();
                this.startProgressionPlayback(prog);
            },

            startProgressionPlayback(prog) {
                const beatDuration = (60 / this.progressionBPM) * 4000; // 4 beats por acorde
                const chords = prog.degrees;

                const playNextChord = () => {
                    if (!this.progressionPlaying || this.progressionPaused) {
                        return;
                    }

                    // Tocar acorde actual
                    const degree = chords[this.currentProgressionChordIndex];
                    this.playProgressionChord(degree);

                    // Actualizar UI
                    this.showProgression();
                    this.updateProgressionProgress();

                    // Avanzar al siguiente acorde
                    this.currentProgressionChordIndex++;

                    if (this.currentProgressionChordIndex >= chords.length) {
                        // Fin de la progresión
                        this.currentProgressionChordIndex = 0;
                        this.progressionCurrentRepeat++;

                        // Verificar si debe continuar
                        const shouldContinue = this.progressionLoop ||
                            (this.progressionCurrentRepeat < this.progressionRepeatCount);

                        if (!shouldContinue) {
                            this.stopProgression(true);
                            return;
                        }
                    }

                    // Programar siguiente acorde
                    this.progressionIntervalId = setTimeout(playNextChord, beatDuration);
                };

                // Iniciar reproducción
                playNextChord();
            },

            playProgressionChord(degree) {
                try {
                    // Validate AudioEngine
                    if (!AudioEngine || !AudioEngine.audioContext || !AudioEngine.enabled) {
                        console.error('❌ AudioEngine not available');
                        return;
                    }

                    // Validate currentRoot
                    if (typeof this.currentRoot !== 'number' || this.currentRoot < 0 || this.currentRoot > 11) {
                        console.error('❌ Invalid currentRoot in playProgressionChord:', this.currentRoot);
                        return;
                    }

                    // Calcular la raíz del acorde basado en el grado
                    const flatDegreeOffsets = {
                        '-1': { offset: 0, quality: 'min' },
                        '-3': { offset: 3, quality: 'maj' },
                        '-4': { offset: 5, quality: 'min' },
                        '-5': { offset: 7, quality: 'min' },
                        '-6': { offset: 8, quality: 'maj' },
                        '-7': { offset: 10, quality: 'maj' },
                    };

                    let rootOffset, quality;

                    if (flatDegreeOffsets[String(degree)]) {
                        const info = flatDegreeOffsets[String(degree)];
                        rootOffset = info.offset;
                        quality = info.quality;
                    } else if (degree > 0) {
                        const triad = MusicTheory.getTriad(this.currentRoot, 'major', degree);

                        // Validate triad
                        if (!triad || !triad.root || !triad.root.note) {
                            console.error('Invalid triad data for degree:', degree);
                            return;
                        }

                        const rootNote = triad.root.note;
                        const rootIndex = MusicTheory.getNoteIndex(rootNote);

                        if (rootIndex === -1) {
                            console.error('Invalid root note:', rootNote);
                            return;
                        }

                        rootOffset = rootIndex - this.currentRoot;
                        if (rootOffset < 0) rootOffset += 12;
                        quality = triad.quality;
                    } else {
                        rootOffset = 0;
                        quality = 'maj';
                    }

                    // Calcular nota raíz
                    const chordRoot = (this.currentRoot + rootOffset) % 12;

                    // Construir tríada basado en la calidad
                    const third = quality === 'min' ? 3 : 4;
                    const notes = [
                        chordRoot,
                        (chordRoot + third) % 12,
                        (chordRoot + 7) % 12
                    ];

                    // Validate notes
                    if (notes.some(note => typeof note !== 'number' || note < 0 || note > 11)) {
                        console.error('❌ Invalid notes generated:', notes);
                        return;
                    }

                    // Tocar el acorde directamente
                    AudioEngine.playChord(notes, 1.5);
                } catch (error) {
                    console.error('❌ Error playing progression chord:', error, 'degree:', degree);
                }
            },

            pauseProgression() {
                if (!this.progressionPlaying || this.progressionPaused) return;

                this.progressionPaused = true;
                this.progressionPlaying = false;

                if (this.progressionIntervalId) {
                    clearTimeout(this.progressionIntervalId);
                    this.progressionIntervalId = null;
                }

                this.updateProgressionControls();
            },

            stopProgression(naturalEnd = false) {
                this.progressionPlaying = false;
                this.progressionPaused = false;
                this.currentProgressionChordIndex = 0;
                this.progressionCurrentRepeat = 0;

                if (this.progressionIntervalId) {
                    clearTimeout(this.progressionIntervalId);
                    this.progressionIntervalId = null;
                }

                this.updateProgressionControls();
                if (!naturalEnd) {
                    this.updateProgressionProgress();
                }
                this.showProgression();
            },

            updateProgressionProgress(beatDuration) {
                const prog = MusicTheory.progressions[this.currentProgression];
                if (!prog) return;

                const total = prog.degrees.length;
                const index = this.currentProgressionChordIndex;
                const current = index + 1;
                const percentage = this.progressionPlaying ? (current / total) * 100 : 0;

                const progressText = document.getElementById('progressionProgressText');
                const progressBar = document.getElementById('progressionProgressBar');
                const repeatText = document.getElementById('progressionRepeatText');

                if (progressText) {
                    progressText.textContent = `Acorde ${current} / ${total}`;
                }

                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;

                    // Color según función
                    const func = prog.function ? prog.function[index] : null;
                    const colors = {
                        'T': '#10b981', 'Tm': '#10b981',
                        'SD': '#f59e0b', 'SDm': '#f59e0b',
                        'D': '#dc2626', 'Dm': '#dc2626'
                    };
                    progressBar.style.background = colors[func] || '#666';
                }

                if (repeatText) {
                    const currentRep = this.progressionCurrentRepeat + 1;
                    const totalReps = this.progressionLoop ? '∞' : this.progressionRepeatCount;
                    repeatText.textContent = `Repetición ${currentRep} / ${totalReps}`;
                }
            },

            updateProgressionControls() {
                const playBtn = document.getElementById('playProgressionBtn');
                const pauseBtn = document.getElementById('pauseProgressionBtn');
                const stopBtn = document.getElementById('stopProgressionBtn');

                if (playBtn) playBtn.disabled = this.progressionPlaying && !this.progressionPaused;
                if (pauseBtn) pauseBtn.disabled = !this.progressionPlaying || this.progressionPaused;
                if (stopBtn) stopBtn.disabled = !this.progressionPlaying && !this.progressionPaused;
            },

            getChordFunctionColor(prog, index) {
                if (!prog.function) return '#666';
                const func = prog.function[index];
                const colors = {
                    'T': '#10b981', 'Tm': '#10b981',
                    'SD': '#f59e0b', 'SDm': '#f59e0b',
                    'D': '#dc2626', 'Dm': '#dc2626',
                    'bVII': '#8b5cf6', 'bVI': '#8b5cf6', 'bIII': '#8b5cf6'
                };
                return colors[func] || '#666';
            },

            // ========== SISTEMA CAGED ==========

            showCAGED() {
                this.resetState(['currentCAGED']);
                if (this.currentCAGED === null) {
                    this.currentCAGED = 'C';
                }
                this.renderCAGEDMap();
                this.showCAGEDShape();
            },

            showCAGEDShape() {
                // Initialize CAGED shape if null
                if (this.currentCAGED === null) {
                    this.currentCAGED = 'C';
                }

                const rootName = MusicTheory.getNoteName(this.currentRoot);

                // Hide box selector
                document.getElementById('boxSelector').classList.add('hidden');

                // Show chord diagram
                const diagramContainer = document.getElementById('diagramsContainer');
                diagramContainer.innerHTML = '';
                diagramContainer.classList.remove('hidden');

                if (this.cagedShowAll) {
                    // Mostrar todas las 5 formas simultáneamente
                    diagramContainer.classList.add('scrollable-horizontal');
                    const cagedOrder = ['C', 'A', 'G', 'E', 'D'];

                    cagedOrder.forEach(shape => {
                        const baseVoicing = MusicTheory.chordVoicings[shape];
                        const position = MusicTheory.calculateCAGEDPosition(shape, rootName);

                        const wrapper = document.createElement('div');
                        wrapper.className = 'chord-wrapper';
                        if (shape === this.currentCAGED) {
                            wrapper.classList.add('active-chord');
                        } else {
                            wrapper.style.opacity = '0.7';
                        }

                        const diagram = ChordDiagram.create(baseVoicing, `${rootName} (${shape})`, position);
                        wrapper.appendChild(diagram);

                        // Label de posición
                        const posLabel = document.createElement('div');
                        posLabel.textContent = `Posición ${position}`;
                        posLabel.style.cssText = 'text-align: center; font-size: 11px; color: #888; margin-top: 4px; font-weight: 600;';
                        wrapper.appendChild(posLabel);

                        diagramContainer.appendChild(wrapper);
                    });

                    // Mostrar la forma activa en el fretboard
                    const adjustedPosition = MusicTheory.calculateCAGEDPosition(this.currentCAGED, rootName);
                    Fretboard.tonicNote = this.currentRoot;
                    Fretboard.currentScale = MusicTheory.getScale(this.currentRoot, 'major');
                    Fretboard.highlightedNotes.clear();
                    const zoneStart = Math.max(0, adjustedPosition);
                    const zoneEnd = Math.min(12, adjustedPosition + 4);
                    Fretboard.setZone(zoneStart, zoneEnd);
                    Fretboard.specificPositions = null;
                    Fretboard.updateDisplay();

                    this.updateDisplay(
                        `${rootName} Mayor - Sistema CAGED Completo`,
                        `Forma activa: ${this.currentCAGED} | Ver todas las formas en el mástil`
                    );
                } else {
                    // Mostrar solo la forma actual
                    diagramContainer.classList.remove('scrollable-horizontal');

                    const baseVoicing = MusicTheory.chordVoicings[this.currentCAGED];

                    if (!baseVoicing) {
                        console.error('CAGED voicing not found:', this.currentCAGED);
                        diagramContainer.innerHTML = '<div style="color: #dc2626; padding: 20px;">Forma CAGED no disponible</div>';
                        return;
                    }

                    const adjustedPosition = MusicTheory.calculateCAGEDPosition(this.currentCAGED, rootName);

                    const diagram = ChordDiagram.create(baseVoicing, rootName, adjustedPosition);
                    diagramContainer.appendChild(diagram);

                    // Show major scale with zone highlighting
                    Fretboard.tonicNote = this.currentRoot;
                    Fretboard.currentScale = MusicTheory.getScale(this.currentRoot, 'major');
                    Fretboard.highlightedNotes.clear();

                    // Set zone based on CAGED position
                    const zoneStart = Math.max(0, adjustedPosition);
                    const zoneEnd = Math.min(12, adjustedPosition + 4);
                    Fretboard.setZone(zoneStart, zoneEnd);
                    Fretboard.specificPositions = null;
                    Fretboard.updateDisplay();

                    this.updateDisplay(
                        `${rootName} Mayor - Forma ${this.currentCAGED}`,
                        `Posición: Traste ${adjustedPosition} | Orden: C → A → G → E → D → C...`
                    );
                }
                this.clearInfoPanel();
            },

            // Render interactive SVG pentagon for CAGED
            renderCAGEDMap() {
                const container = document.getElementById('caged-svg-container');
                if (!container) return;

                const shapes = ['C', 'A', 'G', 'E', 'D'];
                const radius = 200;
                const centerX = 300;
                const centerY = 300;

                let svg = '<svg width="600" height="600" viewBox="0 0 600 600">';

                // Draw connections
                shapes.forEach((shape, idx) => {
                    const angle = (idx * 72 - 90) * Math.PI / 180;
                    const x1 = centerX + radius * Math.cos(angle);
                    const y1 = centerY + radius * Math.sin(angle);

                    const nextIdx = (idx + 1) % 5;
                    const nextShape = shapes[nextIdx];
                    const nextAngle = (nextIdx * 72 - 90) * Math.PI / 180;
                    const x2 = centerX + radius * Math.cos(nextAngle);
                    const y2 = centerY + radius * Math.sin(nextAngle);

                    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                                  class="caged-connection"
                                  data-from="${shape}"
                                  data-to="${nextShape}"
                                  stroke="#475569" stroke-width="2"
                                  style="cursor: pointer;"/>`;
                });

                // Draw nodes
                shapes.forEach((shape, idx) => {
                    const angle = (idx * 72 - 90) * Math.PI / 180;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    const shapeData = MusicTheory.cagedRelationshipMap[shape];
                    const color = shapeData.color;

                    svg += `
                        <g class="caged-node" data-shape="${shape}" style="cursor: pointer;">
                            <circle cx="${x}" cy="${y}" r="40" fill="${color}" stroke="#0a0a0a" stroke-width="2"/>
                            <text x="${x}" y="${y + 8}" text-anchor="middle" fill="#0a0a0a"
                                  font-size="28" font-weight="bold">${shape}</text>
                        </g>
                    `;
                });

                // Add center text
                svg += `
                    <text x="${centerX}" y="${centerY - 10}" text-anchor="middle" fill="#cbd5e1"
                          font-size="16" font-weight="bold">CAGED</text>
                    <text x="${centerX}" y="${centerY + 10}" text-anchor="middle" fill="#94a3b8"
                          font-size="12">System</text>
                `;

                svg += '</svg>';
                container.innerHTML = svg;

                // Add event listeners to nodes
                container.querySelectorAll('.caged-node').forEach(node => {
                    node.addEventListener('click', (e) => {
                        const shape = e.currentTarget.dataset.shape;
                        this.showCAGEDShapeInfo(shape);
                    });
                });

                // Add event listeners to connections
                container.querySelectorAll('.caged-connection').forEach(conn => {
                    conn.addEventListener('click', (e) => {
                        const from = e.currentTarget.dataset.from;
                        const to = e.currentTarget.dataset.to;
                        this.showCAGEDTransitionInfo(from, to);
                    });
                });
            },

            // Show individual CAGED shape info with audio
            showCAGEDShapeInfo(shape) {
                // Update current shape
                this.currentCAGED = shape;

                // Play audio
                const baseVoicing = MusicTheory.chordVoicings[shape];
                if (baseVoicing && AudioEngine.audioContext) {
                    AudioEngine.playChordVoicing(baseVoicing);
                }

                // Highlight active node
                document.querySelectorAll('.caged-node').forEach(n => {
                    const nodeShape = n.dataset.shape;
                    const circle = n.querySelector('circle');
                    if (nodeShape === shape) {
                        circle.setAttribute('stroke', '#84cc16');
                        circle.setAttribute('stroke-width', '4');
                    } else {
                        circle.setAttribute('stroke', '#0a0a0a');
                        circle.setAttribute('stroke-width', '2');
                    }
                });

                // Show info panel
                const shapeData = MusicTheory.cagedRelationshipMap[shape];
                const infoPanel = document.getElementById('caged-info-panel');
                if (infoPanel && shapeData) {
                    infoPanel.classList.remove('hidden');
                    infoPanel.innerHTML = `
                        <div style="padding:10px 12px; background:#111; border-radius:8px; border-left:3px solid #444; margin-bottom:12px; font-size:12px; color:#888; line-height:1.6;">
                            <strong style="color:#fafafa; display:block; margin-bottom:4px;">¿Qué es el sistema CAGED?</strong>
                            Cada letra (C, A, G, E, D) es la forma del acorde abierto en que se basa esa posición.
                            Las <strong style="color:#fafafa;">5 formas cubren todo el mástil</strong> sin huecos y se repiten en ciclo.
                            Cambiar de forma = subir unos trastes sin cambiar de nota raíz.
                        </div>
                        <h4 class="text-lg font-medium text-sage-400 mb-3">
                            Forma ${shape}: ${shapeData.soundCharacter}
                        </h4>
                        <div class="space-y-3 text-sm">
                            <div class="p-3 bg-void-900 rounded">
                                <strong class="text-chalk-100">Cuándo usarla:</strong>
                                <p class="text-void-300 mt-1">${shapeData.whenToUse}</p>
                            </div>

                            <div class="p-3 bg-sage-900/20 border border-sage-700 rounded">
                                <strong class="text-sage-400">Posición en el mástil:</strong>
                                <p class="text-chalk-200 mt-1">
                                    Para tocar ${MusicTheory.getNoteName(this.currentRoot)} mayor con forma ${shape},
                                    empieza en el traste ${MusicTheory.calculateCAGEDPosition(shape, MusicTheory.getNoteName(this.currentRoot))}
                                </p>
                            </div>

                            <div class="pt-3 border-t border-void-600">
                                <strong class="text-sage-400">Siguiente forma: ${shapeData.next}</strong>
                                <p class="text-xs text-void-400 mt-1">
                                    ${shapeData.transitionToNext.fretMove}
                                </p>
                                <button onclick="App.showCAGEDTransitionInfo('${shape}', '${shapeData.next}')"
                                        class="mt-2 w-full px-3 py-1.5 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded text-sm">
                                    Escuchar transición a ${shapeData.next}
                                </button>
                            </div>
                        </div>
                    `;
                }

                // Update fretboard display
                this.showCAGEDShape();

                this.showToast(`Forma ${shape}: ${shapeData?.soundCharacter || ''}`, 'info');
            },

            // Show transition between two CAGED shapes
            showCAGEDTransitionInfo(from, to) {
                const fromData = MusicTheory.cagedRelationshipMap[from];
                const toData = MusicTheory.cagedRelationshipMap[to];
                const transition = fromData.transitionToNext;

                if (!transition || transition.to !== to) {
                    this.showToast('Transición no válida', 'error');
                    return;
                }

                // Highlight connection
                document.querySelectorAll('.caged-connection').forEach(c => {
                    if (c.dataset.from === from && c.dataset.to === to) {
                        c.setAttribute('stroke', '#84cc16');
                        c.setAttribute('stroke-width', '4');
                    } else {
                        c.setAttribute('stroke', '#475569');
                        c.setAttribute('stroke-width', '2');
                    }
                });

                // Highlight both nodes
                document.querySelectorAll('.caged-node').forEach(n => {
                    const nodeShape = n.dataset.shape;
                    const circle = n.querySelector('circle');
                    if (nodeShape === from || nodeShape === to) {
                        circle.setAttribute('stroke', '#84cc16');
                        circle.setAttribute('stroke-width', '4');
                    } else {
                        circle.setAttribute('stroke', '#0a0a0a');
                        circle.setAttribute('stroke-width', '2');
                    }
                });

                // Show transition info
                const infoPanel = document.getElementById('caged-info-panel');
                if (infoPanel) {
                    infoPanel.classList.remove('hidden');
                    infoPanel.innerHTML = `
                        <h4 class="text-lg font-medium text-sage-400 mb-3">
                            Transición: ${from} → ${to}
                        </h4>
                        <div class="space-y-3 text-sm">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-3 bg-void-900 rounded">
                                    <div class="font-medium" style="color: ${fromData.color}">Desde: ${from}</div>
                                    <div class="text-xs text-void-400 mt-1">${fromData.soundCharacter}</div>
                                </div>
                                <div class="p-3 bg-void-900 rounded">
                                    <div class="font-medium" style="color: ${toData.color}">Hacia: ${to}</div>
                                    <div class="text-xs text-void-400 mt-1">${toData.soundCharacter}</div>
                                </div>
                            </div>

                            <div class="p-3 bg-sage-900/20 border border-sage-700 rounded">
                                <strong class="text-chalk-100">🎸 Cómo mover:</strong>
                                <p class="text-void-300 mt-1">${transition.fretMove}</p>
                            </div>

                            <div class="p-3 bg-sage-900/20 border border-sage-700 rounded">
                                <strong class="text-chalk-100">👂 Cambio de sonido:</strong>
                                <p class="text-void-300 mt-1">${transition.soundChange}</p>
                            </div>

                            <div class="flex items-center justify-between p-3 bg-void-900 rounded">
                                <strong class="text-chalk-100">Dificultad:</strong>
                                <span class="px-2 py-1 rounded text-xs ${
                                    transition.difficulty.includes('Fácil') ? 'bg-green-700' :
                                    transition.difficulty.includes('Media') ? 'bg-yellow-700' :
                                    'bg-red-700'
                                }">${transition.difficulty}</span>
                            </div>

                            <div class="p-3 bg-blue-900/20 border border-blue-700 rounded">
                                <strong class="text-blue-400">💡 Tip profesional:</strong>
                                <p class="text-chalk-200 mt-1 italic">${transition.tip}</p>
                            </div>

                            <div class="mt-4 flex gap-2">
                                <button onclick="App.playCAGEDTransitionAudio('${from}', '${to}')"
                                        class="flex-1 px-4 py-2 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded">
                                    ▶ Escuchar transición
                                </button>
                            </div>
                        </div>
                    `;
                }
            },

            // Play transition between two shapes with delay
            playCAGEDTransitionAudio(from, to) {
                const fromVoicing = MusicTheory.chordVoicings[from];
                const toVoicing = MusicTheory.chordVoicings[to];

                if (!fromVoicing || !toVoicing || !AudioEngine.audioContext) {
                    this.showToast('Audio no disponible', 'error');
                    return;
                }

                // Play from
                AudioEngine.playChordVoicing(fromVoicing);
                this.showToast(`${from} (traste ${MusicTheory.calculateCAGEDPosition(from, MusicTheory.getNoteName(this.currentRoot))})`, 'info');

                // After 1.2s, play to
                setTimeout(() => {
                    AudioEngine.playChordVoicing(toVoicing);
                    const fromPos = MusicTheory.calculateCAGEDPosition(from, MusicTheory.getNoteName(this.currentRoot));
                    const toPos = MusicTheory.calculateCAGEDPosition(to, MusicTheory.getNoteName(this.currentRoot));
                    this.showToast(`${to} (traste ${toPos}) - ${toPos - fromPos > 0 ? '+' : ''}${toPos - fromPos} trastes`, 'info');
                }, 1200);
            },

            // Play complete CAGED tour: C → A → G → E → D
            playCAGEDTour() {
                const shapes = ['C', 'A', 'G', 'E', 'D'];
                let currentIdx = 0;

                const playNext = () => {
                    if (currentIdx >= shapes.length) {
                        this.showToast('Tour CAGED completo!', 'success');
                        return;
                    }

                    const shape = shapes[currentIdx];
                    const voicing = MusicTheory.chordVoicings[shape];

                    if (voicing && AudioEngine.audioContext) {
                        AudioEngine.playChordVoicing(voicing);
                        this.showCAGEDShapeInfo(shape);
                        this.showToast(`Forma ${shape} (${currentIdx + 1}/5)`, 'info');

                        currentIdx++;
                        setTimeout(playNext, 1800);
                    }
                };

                this.showToast('Iniciando tour CAGED...', 'info');
                playNext();
            },

            // Render all CAGED diagrams in grid
            renderAllCAGEDDiagrams() {
                const container = document.getElementById('caged-diagrams-container');
                if (!container) return;

                const shapes = ['C', 'A', 'G', 'E', 'D'];
                const rootName = MusicTheory.getNoteName(this.currentRoot);

                container.innerHTML = shapes.map(shape => {
                    const shapeData = MusicTheory.cagedRelationshipMap[shape];
                    const position = MusicTheory.calculateCAGEDPosition(shape, rootName);
                    const voicing = MusicTheory.chordVoicings[shape];

                    return `
                        <div class="p-3 bg-void-800 border border-void-600 rounded-lg hover:border-sage-500 transition-colors cursor-pointer"
                             onclick="App.showCAGEDShapeInfo('${shape}')">
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-xl font-bold" style="color: ${shapeData.color}">${shape}</div>
                                <div class="text-xs text-void-400">Traste ${position}</div>
                            </div>

                            <div class="text-center text-void-400 text-xs my-3">
                                [Diagrama ${shape}]
                            </div>

                            <div class="text-xs text-void-400 text-center mt-2">
                                ${shapeData.soundCharacter}
                            </div>

                            <button onclick="event.stopPropagation(); App.playCAGEDShapeAudio('${shape}')"
                                    class="w-full mt-2 px-2 py-1 bg-sage-700 hover:bg-sage-600 text-chalk-100 rounded text-xs">
                                ▶ Escuchar
                            </button>
                        </div>
                    `;
                }).join('');
            },

            // Play individual CAGED shape audio
            playCAGEDShapeAudio(shape) {
                const voicing = MusicTheory.chordVoicings[shape];
                if (voicing && AudioEngine.audioContext) {
                    AudioEngine.playChordVoicing(voicing);
                    this.showToast(`Forma ${shape}`, 'info');
                }
            },

            // ========== NIVEL 1 - INTERVALOS MEJORADO ==========

            showIntervalInfo(interval) {
                const info = MusicTheory.intervalInfo[interval];
                if (!info) return;
                const panel = document.getElementById('infoPanel');
                if (!panel) return;

                // Generar grid con 4 columnas si hay alternativeName, 3 si no
                const hasAlternative = info.alternativeName && info.alternativeName !== null;
                const gridCols = hasAlternative ? 'md:grid-cols-4' : 'md:grid-cols-3';

                // Tabla de los 12 intervalos para contexto
                const allIntervals = [
                    { st: 1,  short: '2ªm',  name: 'Segunda menor' },
                    { st: 2,  short: '2ªM',  name: 'Segunda mayor' },
                    { st: 3,  short: '3ªm',  name: 'Tercera menor' },
                    { st: 4,  short: '3ªM',  name: 'Tercera mayor' },
                    { st: 5,  short: '4ªJ',  name: 'Cuarta justa' },
                    { st: 6,  short: 'Tri',  name: 'Tritono' },
                    { st: 7,  short: '5ªJ',  name: 'Quinta justa' },
                    { st: 8,  short: '6ªm',  name: 'Sexta menor' },
                    { st: 9,  short: '6ªM',  name: 'Sexta mayor' },
                    { st: 10, short: '7ªm',  name: 'Séptima menor' },
                    { st: 11, short: '7ªM',  name: 'Séptima mayor' },
                    { st: 12, short: '8ª',   name: 'Octava' },
                ];

                panel.innerHTML = `
                    <div class="scale-info-box">
                        <div style="padding:12px; background:#111; border-radius:8px; border-left:3px solid #444; margin-bottom:16px;">
                            <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">¿Qué es un intervalo?</div>
                            <div style="font-size:13px; color:#ccc; line-height:1.7;">
                                Un <strong style="color:#fafafa;">intervalo</strong> es la <em>distancia</em> entre dos notas, medida en
                                <strong style="color:#fafafa;">semitonos</strong> — el paso más pequeño posible en música occidental
                                (un traste en la guitarra). Todos los demás intervalos son múltiplos de este paso.
                            </div>
                        </div>
                        <div class="info-header">
                            <div class="info-title">${info.name}</div>
                            <div class="info-emotion">${info.semitones} semitono${info.semitones > 1 ? 's' : ''}</div>
                        </div>
                        <div class="grid grid-cols-1 ${gridCols} gap-4">
                            <div class="info-section">
                                <div class="info-label">Calidad</div>
                                <div class="info-value" style="font-size: 15px;">${info.quality}</div>
                            </div>
                            <div class="info-section accent">
                                <div class="info-label">Carácter Sonoro</div>
                                <div class="info-value" style="font-size: 15px;">${info.character}</div>
                            </div>
                            <div class="info-section">
                                <div class="info-label">Consonancia</div>
                                <div class="info-value" style="font-size: 15px;">${info.consonance}</div>
                            </div>
                            ${hasAlternative ? `
                                <div class="info-section">
                                    <div class="info-label">También conocido como</div>
                                    <div class="info-value" style="font-size: 15px;">${info.alternativeName}</div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="mt-4">
                            <div class="info-section">
                                <div class="info-label">Reconocimiento Auditivo</div>
                                <div class="info-description" style="color: #ccc; font-size: 14px;">${info.examples}</div>
                            </div>
                        </div>
                        <div style="margin-top:16px;">
                            <div class="info-label" style="margin-bottom:8px;">Los 12 intervalos — todos los semitonos</div>
                            <div style="display:flex; flex-wrap:wrap; gap:4px;">
                                ${allIntervals.map(iv => `
                                    <div style="padding:6px 8px; background:${iv.st === info.semitones ? '#dc2626' : '#1a1a1a'}; border:1px solid ${iv.st === info.semitones ? '#dc2626' : '#333'}; border-radius:6px; text-align:center; min-width:44px;">
                                        <div style="font-family:'IBM Plex Mono'; font-size:11px; color:#fafafa; font-weight:700;">${iv.short}</div>
                                        <div style="font-size:9px; color:#666; margin-top:1px;">${iv.st} st</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            },

            // ========== FUNCIONES DE CONTROL DE INTERVALOS MEJORADAS ==========

            playCurrentInterval() {
                if (this.currentInterval === null) return;
                AudioEngine.playInterval(this.currentRoot, this.currentInterval, this.currentPlayMode);
            },

            changeIntervalDirection(direction) {
                this.currentIntervalDirection = direction;

                // Actualizar botones activos
                document.querySelectorAll('[data-direction]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-direction="${direction}"]`)?.classList.add('active');

                // Re-dibujar intervalo con nueva dirección
                this.showInterval();
            },

            changePlayMode(mode) {
                this.currentPlayMode = mode;

                // Actualizar botones activos
                document.querySelectorAll('[data-play-mode]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-play-mode="${mode}"]`)?.classList.add('active');

                // Reproducir automáticamente con el nuevo modo
                this.playCurrentInterval();
            },

            toggleComparisonMode() {
                this.showingComparison = !this.showingComparison;
                const panel = document.getElementById('comparisonPanel');
                const btn = document.getElementById('toggleComparisonMode');

                if (this.showingComparison) {
                    panel?.classList.add('active');
                    btn?.classList.add('active');
                    // Resetear comparación
                    this.comparisonInterval = { first: null, second: null };
                    document.getElementById('comparisonInterval1').textContent = 'Selecciona intervalo 1';
                    document.getElementById('comparisonInterval1').classList.add('empty');
                    document.getElementById('comparisonInterval2').textContent = 'Selecciona intervalo 2';
                    document.getElementById('comparisonInterval2').classList.add('empty');
                } else {
                    panel?.classList.remove('active');
                    btn?.classList.remove('active');
                    this.comparisonInterval = null;
                }
            },

            selectIntervalForComparison(interval) {
                if (!this.showingComparison) return;

                const info = MusicTheory.intervalInfo[interval];
                if (!info) return;

                // Seleccionar primer o segundo intervalo
                if (!this.comparisonInterval.first) {
                    this.comparisonInterval.first = interval;
                    const elem = document.getElementById('comparisonInterval1');
                    elem.textContent = info.name;
                    elem.classList.remove('empty');
                } else if (!this.comparisonInterval.second) {
                    this.comparisonInterval.second = interval;
                    const elem = document.getElementById('comparisonInterval2');
                    elem.textContent = info.name;
                    elem.classList.remove('empty');
                } else {
                    // Reemplazar segundo intervalo si ambos están seleccionados
                    this.comparisonInterval.second = interval;
                    const elem = document.getElementById('comparisonInterval2');
                    elem.textContent = info.name;
                    elem.classList.remove('empty');
                }
            },

            playComparison() {
                if (!this.comparisonInterval || !this.comparisonInterval.first || !this.comparisonInterval.second) {
                    return;
                }

                AudioEngine.playIntervalComparison(
                    this.currentRoot,
                    this.comparisonInterval.first,
                    this.comparisonInterval.second,
                    this.currentPlayMode
                );
            },

            exitComparisonMode() {
                this.showingComparison = false;
                const panel = document.getElementById('comparisonPanel');
                const btn = document.getElementById('toggleComparisonMode');
                panel?.classList.remove('active');
                btn?.classList.remove('active');
                this.comparisonInterval = null;
            },

            // ========== NIVEL 10 - QUIZ ==========

            showTraining() {
                this.resetState();
                this.hideUIElements();
                Fretboard.clear();

                if (!this.trainingMode) this.trainingMode = 'visual';

                // Toggle content visibility based on mode
                const quizContent = document.getElementById('trainingQuizContent');
                const earContent = document.getElementById('trainingEarContent');

                if (this.trainingMode === 'visual') {
                    if (quizContent) quizContent.style.display = 'block';
                    if (earContent) earContent.style.display = 'none';
                    this.showQuiz();
                } else {
                    if (quizContent) quizContent.style.display = 'none';
                    if (earContent) earContent.style.display = 'block';
                    this.showEarTraining();
                }
            },

            showQuiz() {
                this.resetState();
                this.hideUIElements();
                Fretboard.clear();
                this.updateDisplay('QUIZ INTERACTIVO', 'Pon a prueba tus conocimientos de teoría musical');
                this.generateQuizQuestion();
            },

            generateQuizQuestion() {
                this.quizAnswered = false;
                const questions = MusicTheory.quizQuestions[this.quizCategory];
                if (!questions) return;

                const diffQuestions = questions[this.quizDifficulty] || questions.easy;
                if (!diffQuestions || diffQuestions.length === 0) return;

                const q = diffQuestions[Math.floor(Math.random() * diffQuestions.length)];
                this.currentQuizQuestion = q;

                const panel = document.getElementById('infoPanel');
                if (!panel) return;

                // Shuffle options
                const shuffled = [...q.options].sort(() => Math.random() - 0.5);

                panel.innerHTML = `
                    <div class="quiz-question-box">
                        <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                            ${this.quizCategory} — ${this.quizDifficulty === 'easy' ? 'Fácil' : this.quizDifficulty === 'medium' ? 'Medio' : 'Difícil'}
                        </div>
                        <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 22px; color: #fafafa; font-weight: 600; margin-bottom: 20px;">
                            ${q.q}
                        </div>
                        <div id="quizOptions">
                            ${shuffled.map((opt, i) => `
                                <button class="quiz-option" data-answer="${opt}" data-correct="${opt === q.a}">
                                    <span style="font-weight: 700; color: #666; margin-right: 12px;">${String.fromCharCode(65 + i)}.</span>
                                    ${opt}
                                </button>
                            `).join('')}
                        </div>
                        <div id="quizFeedback" style="margin-top: 16px; display: none;"></div>
                    </div>
                `;

                // Bind option clicks
                panel.querySelectorAll('.quiz-option').forEach(btn => {
                    btn.addEventListener('click', () => this.answerQuiz(btn));
                });

                this.updateDisplay('QUIZ INTERACTIVO', `Categoría: ${this.quizCategory} | Dificultad: ${this.quizDifficulty}`);
            },

            answerQuiz(btn) {
                if (this.quizAnswered) return;
                this.quizAnswered = true;

                const isCorrect = btn.dataset.correct === 'true';
                const options = document.querySelectorAll('.quiz-option');

                options.forEach(opt => {
                    opt.classList.add('disabled');
                    if (opt.dataset.correct === 'true') {
                        opt.classList.add('correct');
                    }
                });

                if (isCorrect) {
                    btn.classList.add('correct');
                    const points = this.quizDifficulty === 'easy' ? 10 : this.quizDifficulty === 'medium' ? 20 : 30;
                    this.quizScore += points;
                    this.quizStreak++;
                    if (this.quizStreak > this.quizBest) this.quizBest = this.quizStreak;

                    // Streak bonus
                    if (this.quizStreak >= 3) {
                        this.quizScore += this.quizStreak * 5;
                        this.announce(`¡Correcto! Ganaste ${points} puntos. Racha de ${this.quizStreak}. Bonus: ${this.quizStreak * 5} puntos.`);
                    } else {
                        this.announce(`¡Correcto! Ganaste ${points} puntos.`);
                    }
                } else {
                    btn.classList.add('incorrect');
                    this.quizStreak = 0;
                    this.announce(`Incorrecto. La respuesta correcta era: ${this.currentQuizQuestion.a}`);
                }

                // Update score display
                const scoreEl = document.getElementById('quizScore');
                const streakEl = document.getElementById('quizStreak');
                const bestEl = document.getElementById('quizBest');
                if (scoreEl) scoreEl.textContent = this.quizScore;
                if (streakEl) streakEl.textContent = this.quizStreak;
                if (bestEl) bestEl.textContent = this.quizBest;

                // Guardar progreso
                this.saveProgress();

                // Show feedback
                const feedback = document.getElementById('quizFeedback');
                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.innerHTML = `
                        <div style="padding: 12px; border-radius: 10px; background: ${isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 38, 38, 0.1)'}; border: 1px solid ${isCorrect ? '#22c55e' : '#dc2626'};">
                            <span style="font-weight: 700; color: ${isCorrect ? '#22c55e' : '#dc2626'};">
                                ${isCorrect ? '¡Correcto!' : 'Incorrecto'}
                            </span>
                            <span style="color: #ccc; margin-left: 8px;">
                                La respuesta es: <strong>${this.currentQuizQuestion.a}</strong>
                                ${this.quizStreak >= 3 ? ` | ¡Racha de ${this.quizStreak}! (+${this.quizStreak * 5} bonus)` : ''}
                            </span>
                        </div>
                    `;
                }
            },

            // ========== NIVEL 11 - ACORDES EXTENDIDOS ==========

            _buildChordPickerHTML(activeKey) {
                const groupEntries = Object.entries(TENSION_GROUPS);
                return groupEntries.map(([groupKey, group], gi) => {
                    const nodesHTML = group.chords.map((key, i) => {
                        const cd = MusicTheory.extendedChords[key];
                        if (!cd) return '';
                        const connector = i > 0 ? '<div class="ext4-picker-connector"></div>' : '';
                        return `${connector}<button class="ext4-picker-btn${key === activeKey ? ' active' : ''}" data-picker-key="${key}">
                            <div class="ext4-picker-btn-circle">${cd.symbol}</div>
                            <div class="ext4-picker-btn-label">${cd.name}</div>
                        </button>`;
                    }).join('');
                    const groupConnector = gi > 0 ? '<div class="ext4-picker-group-connector"></div>' : '';
                    return `${groupConnector}<div class="ext4-picker-group">
                        <span class="ext4-picker-group-label">${group.label}</span>
                        <div class="ext4-picker-group-btns">${nodesHTML}</div>
                    </div>`;
                }).join('');
            },

            _getCategoryChords() {
                const group = TENSION_GROUPS[this.currentExtensionCategory];
                return group ? group.chords : [];
            },

            _getGroupForChord(key) {
                for (const [groupKey, group] of Object.entries(TENSION_GROUPS)) {
                    if (group.chords.includes(key)) return groupKey;
                }
                return null;
            },

            _buildNodeMapHTML(activeKey) {
                const groupKeys = Object.keys(TENSION_GROUPS);
                const groups = groupKeys.map((groupKey, gi) => {
                    const group = TENSION_GROUPS[groupKey];
                    const isActiveGroup = groupKey === this.currentExtensionCategory;
                    const nodesHTML = group.chords.map((key, i) => {
                        const cd = MusicTheory.extendedChords[key];
                        if (!cd) return '';
                        const isActive = key === activeKey;
                        const connector = i > 0 ? '<div class="ext4-node-connector"></div>' : '';
                        return `${connector}<div class="ext4-node${isActive ? ' active' : ''}" data-node-key="${key}">
                            <div class="ext4-node-circle">${cd.symbol}</div>
                            <div class="ext4-node-label">${cd.name}</div>
                        </div>`;
                    }).join('');
                    const groupConnector = gi > 0 ? '<div class="ext4-axis-connector"></div>' : '';
                    return `${groupConnector}<div class="ext4-axis-group${isActiveGroup ? ' active' : ''}" data-group-key="${groupKey}">
                        <div class="ext4-axis-group-label">${group.label}</div>
                        <div class="ext4-axis-nodes">${nodesHTML}</div>
                    </div>`;
                }).join('');
                return `<div class="ext4-axis">${groups}</div>`;
            },

            _attachNodeMapListeners(container) {
                container.querySelectorAll('.ext4-node[data-node-key]').forEach(node => {
                    node.addEventListener('click', () => {
                        const key = node.dataset.nodeKey;
                        if (!key) return;
                        this.selectExtendedChord(key);
                    });
                });
            },

            showExtendedIntro() {
                const topSection = document.getElementById('level4TopSection');
                if (!topSection) return;

                const nodeMapHTML = this._buildNodeMapHTML(null);

                const groupsHTML = Object.entries(TENSION_GROUPS).map(([groupKey, group]) => {
                    const cardsHTML = group.chords.map(key => {
                        const cd = MusicTheory.extendedChords[key];
                        if (!cd) return '';
                        return `<button class="ext4-intro-chord-card" data-chord-key="${key}">
                            <span class="ext4-intro-chord-symbol">${cd.symbol}</span>
                            <span class="ext4-intro-chord-formula">${cd.formula}</span>
                        </button>`;
                    }).join('');
                    return `<div class="ext4-axis-intro-group">
                        <div class="ext4-axis-intro-group-header">
                            <span class="ext4-axis-intro-group-label">${group.label}</span>
                            <span class="ext4-axis-intro-group-sub">${group.subtitle}</span>
                        </div>
                        <div class="ext4-intro-chord-grid">${cardsHTML}</div>
                    </div>`;
                }).join('');

                topSection.innerHTML = `
                    <div class="ext4-page">
                        <div class="ext4-node-map" id="ext4-node-map">${nodeMapHTML}</div>
                        <div class="ext4-axis-intro">${groupsHTML}</div>
                        <p class="ext4-intro-hint">Selecciona un acorde para ver su anatomía, contexto y mutaciones.</p>
                    </div>
                `;

                this._attachNodeMapListeners(topSection);

                topSection.querySelectorAll('.ext4-intro-chord-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const key = card.dataset.chordKey;
                        if (key) this.selectExtendedChord(key);
                    });
                });
            },

            showExtendedChord() {
                this.resetState();
                this.hideUIElements();

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const chordData = MusicTheory.extendedChords[this.currentExtendedChordType];

                if (!chordData) {
                    console.error('Chord not found:', this.currentExtendedChordType);
                    return;
                }

                // Show notes on fretboard (fretboard is hidden in level 4 but keep state consistent)
                Fretboard.tonicNote = this.currentRoot;
                Fretboard.currentScale = chordData.intervals.map((interval, i) => ({
                    note: MusicTheory.getNoteName(this.currentRoot + interval),
                    degree: i + 1
                }));
                Fretboard.highlightedNotes.clear();
                Fretboard.clearZone();
                Fretboard.specificPositions = null;
                Fretboard.updateDisplay();

                this.updateDisplay(
                    `${rootName} ${chordData.name}`,
                    `${chordData.formula} — ${chordData.intervals.map(i => MusicTheory.getNoteName(this.currentRoot + i)).join(' · ')}`
                );

                const belowPanel = document.getElementById('infoPanelOtherLevels');
                if (belowPanel) belowPanel.innerHTML = '';

                // Build voicings data
                const voicingsKey = `${this.currentExtendedChordType}_voicings`;
                const voicings = MusicTheory.extendedVoicings[voicingsKey] || [];

                // Build anatomy HTML
                const degreeColors = { '1': '#dc2626', '3': '#888', '5': '#888', 'b3': '#888', 'b5': '#888', '7': '#d97706', 'b7': '#d97706', '9': '#d4a574', 'b9': '#d4a574', '#9': '#d4a574', '11': '#d4a574', '13': '#34d399' };
                const extensionDegrees = ['7', '9', '11', '13'];
                const signatureDegrees = chordData.signature || [];
                let anatomyHTML = '';
                if (chordData.anatomy && chordData.anatomy.length) {
                    anatomyHTML = chordData.anatomy.map((entry, i) => {
                        const noteName = MusicTheory.getNoteName(this.currentRoot + chordData.intervals[i]);
                        const degree = entry.degree;
                        const isSignature = signatureDegrees.includes(degree);
                        const color = isSignature ? '#e5e5e5' : (degreeColors[degree] || '#888');
                        const cardMod = i === 0 ? 'ext4-note-card--root' : isSignature ? 'ext4-note-card--signature' : extensionDegrees.includes(degree) ? 'ext4-note-card--ext' : '';
                        return `<div class="ext4-note-card ${cardMod}">
                            <div class="ext4-note-card-degree">${degree}</div>
                            <div class="ext4-note-card-name" style="color:${color};">${noteName}</div>
                            <div class="ext4-note-card-role">${entry.role}${isSignature ? ' <span class="ext4-note-card-signature-badge">★</span>' : ''}</div>
                            <p class="ext4-note-card-contribution">${entry.contribution}</p>
                        </div>`;
                    }).join('');
                } else {
                    const degreeNames = ['1', '3', '5', '7', '9', '11', '13'];
                    anatomyHTML = chordData.intervals.map((interval, i) => {
                        const noteName = MusicTheory.getNoteName(this.currentRoot + interval);
                        const degree = degreeNames[i] || '';
                        const color = i === 0 ? '#dc2626' : extensionDegrees.includes(degree) ? '#d4a574' : '#888';
                        const cardMod = i === 0 ? 'ext4-note-card--root' : '';
                        return `<div class="ext4-note-card ${cardMod}">
                            <div class="ext4-note-card-degree">${degree}</div>
                            <div class="ext4-note-card-name" style="color:${color};">${noteName}</div>
                        </div>`;
                    }).join('');
                }

                // Context section
                let contextHTML = '';
                if (chordData.context) {
                    const genreTags = (chordData.context.genre || []).map(g => `<span class="ext4-genre-tag">${g}</span>`).join('');
                    const replacesBlock = chordData.context.replaces
                        ? `<div class="ext4-replaces-block">
                               <span class="ext4-replaces-kicker">EN LUGAR DE</span>
                               <span class="ext4-replaces-body">${chordData.context.replaces}</span>
                           </div>`
                        : '';
                    contextHTML = `
                        <div class="ext4-edu-section">
                            <div class="ext4-edu-heading ext4-edu-heading--primary">
                                CUÁNDO Y DÓNDE USARLO
                            </div>
                            <div class="ext4-genre-strip">${genreTags}</div>
                            <div class="ext4-context-block">
                                <p class="ext4-context-body">${chordData.context.moment || ''}</p>
                            </div>
                            ${replacesBlock}
                        </div>`;
                }

                // Mutations section
                let mutationsHTML = '';
                if (chordData.mutations && chordData.mutations.length) {
                    const cards = chordData.mutations.map(m => {
                        const degBadge = m.highlightDegree
                            ? `<span class="ext4-mutation-degree-badge">${m.highlightDegree}</span>`
                            : '';
                        return `
                        <div class="ext4-mutation-card">
                            <div class="ext4-mutation-card-action">${degBadge}${m.change}</div>
                            <div class="ext4-mutation-card-arrow">→</div>
                            <div class="ext4-mutation-card-result">${m.result}</div>
                            <p class="ext4-mutation-card-effect">${m.character}</p>
                        </div>`;
                    }).join('');
                    mutationsHTML = `
                        <div class="ext4-edu-section">
                            <div class="ext4-edu-heading">
                                <span class="ext4-edu-heading-number">02</span>
                                QUÉ PASA SI CAMBIAS UNA NOTA
                            </div>
                            <div class="ext4-mutations-list">${cards}</div>
                        </div>`;
                }

                // Related chords section
                let relatedHTML = '';
                if (chordData.related && chordData.related.length) {
                    const chips = chordData.related.map(r => {
                        const relData = MusicTheory.extendedChords[r.key];
                        const symbol = relData ? relData.symbol : r.key;
                        return `<button class="ext4-related-chip" data-related-key="${r.key}">
                            <span class="ext4-related-chip-symbol">${symbol}</span>
                            <span class="ext4-related-chip-relation">${r.relation}</span>
                        </button>`;
                    }).join('');
                    relatedHTML = `
                        <div class="ext4-edu-section">
                            <div class="ext4-edu-heading">
                                <span class="ext4-edu-heading-number">03</span>
                                ACORDES RELACIONADOS
                            </div>
                            <div class="ext4-related-strip">${chips}</div>
                        </div>`;
                }

                // Build voicings dropdown rows HTML
                const voicingsRowsHTML = voicings.map((v, i) => `
                    <div class="ext4-voicing-row${i === 0 ? ' active' : ''}" data-voicing-idx="${i}">
                        <span class="ext4-voicing-row-name">${v.name}</span>
                        <span class="ext4-voicing-row-play">▶</span>
                    </div>`).join('');

                const voicingsDetailsHTML = voicings.length > 1 ? `
                    <details class="ext4-voicings-details" id="ext4-voicings-details">
                        <summary class="ext4-voicings-summary">
                            <span>Otras formas de tocar este acorde</span>
                            <span class="ext4-voicings-summary-arrow">▼</span>
                        </summary>
                        <div class="ext4-voicings-list" id="ext4-voicings-list">${voicingsRowsHTML}</div>
                    </details>` : '';

                // Write the full single-column page into #level4TopSection
                const topSection = document.getElementById('level4TopSection');
                if (!topSection) return;

                // Prev / Next navigation
                const categoryChords = this._getCategoryChords();
                const currentIdx = categoryChords.indexOf(this.currentExtendedChordType);
                const prevKey = currentIdx > 0 ? categoryChords[currentIdx - 1] : null;
                const nextKey = currentIdx < categoryChords.length - 1 ? categoryChords[currentIdx + 1] : null;
                const prevData = prevKey ? MusicTheory.extendedChords[prevKey] : null;
                const nextData = nextKey ? MusicTheory.extendedChords[nextKey] : null;

                const navBarHTML = `
                    <div class="ext4-nav-bar">
                        <button class="ext4-nav-btn prev" id="ext4-prev-btn" ${!prevKey ? 'disabled' : ''} data-nav-key="${prevKey || ''}">
                            <span class="ext4-nav-btn-arrow">←</span>
                            <div class="ext4-nav-btn-text">
                                <span class="ext4-nav-btn-sub">anterior</span>
                                <span class="ext4-nav-btn-chord">${prevData ? prevData.symbol : ''}</span>
                            </div>
                        </button>
                        <span class="ext4-nav-center">${currentIdx + 1} / ${categoryChords.length}</span>
                        <button class="ext4-nav-btn next" id="ext4-next-btn" ${!nextKey ? 'disabled' : ''} data-nav-key="${nextKey || ''}">
                            <div class="ext4-nav-btn-text next">
                                <span class="ext4-nav-btn-sub">siguiente</span>
                                <span class="ext4-nav-btn-chord">${nextData ? nextData.symbol : ''}</span>
                            </div>
                            <span class="ext4-nav-btn-arrow">→</span>
                        </button>
                    </div>`;

                const chordPickerHTML = this._buildChordPickerHTML(this.currentExtendedChordType);

                topSection.innerHTML = `
                    <div class="ext4-page">
                        <div class="ext4-chord-picker" id="ext4-chord-picker">${chordPickerHTML}</div>
                        <div class="ext4-header">
                            <div>
                                <span class="ext4-chord-root">${rootName}</span><span class="ext4-chord-symbol">${chordData.symbol}</span>
                            </div>
                            <div class="ext4-chord-formula">${chordData.formula}</div>
                            ${chordData.soundCharacter ? `<p class="ext4-sound-char-hero">${chordData.soundCharacter}</p>` : ''}
                        </div>

                        <div class="ext4-diagram-block">
                            <div class="ext4-diagram-main">
                                <div class="ext4-diagram-wrap" id="ext4-diag-slot"></div>
                                <button class="ext4-play-btn" id="ext4-play-btn">▶ TOCAR</button>
                            </div>
                            ${voicingsDetailsHTML}
                        </div>

                        <div class="ext4-body">
                            ${contextHTML}
                            <div class="ext4-edu-section">
                                <div class="ext4-edu-heading">
                                    <span class="ext4-edu-heading-number">01</span>
                                    ANATOMÍA NOTA A NOTA
                                </div>
                                <div class="ext4-anatomy-grid-hero">${anatomyHTML}</div>
                            </div>
                            ${mutationsHTML}
                            ${relatedHTML}
                        </div>

                        ${navBarHTML}
                    </div>
                `;

                // Helpers
                const diagSlot = document.getElementById('ext4-diag-slot');
                let activeVoicingIndex = 0;

                const getBaseNote = (v) => v.shape === 'A' ? 9 : v.shape === 'D' ? 2 : 4;

                const renderDiagram = (voicing) => {
                    if (!diagSlot || !voicing) return;
                    const position = (this.currentRoot - getBaseNote(voicing) + 12) % 12;
                    diagSlot.innerHTML = '';
                    diagSlot.appendChild(ChordDiagram.create(
                        { frets: voicing.frets, fingers: null, barreInfo: null },
                        `${rootName}${chordData.symbol}`,
                        position
                    ));
                };

                const playVoicing = (voicing) => {
                    if (!AudioEngine.enabled || !AudioEngine.audioContext) return;
                    if (AudioEngine.audioContext.state === 'suspended') AudioEngine.audioContext.resume();
                    this.playVoicingFrets(voicing.frets, (this.currentRoot - getBaseNote(voicing) + 12) % 12, 1.5);
                };

                if (voicings.length > 0) renderDiagram(voicings[0]);

                // Voicings list
                const voicingsList = document.getElementById('ext4-voicings-list');
                if (voicingsList) {
                    voicingsList.querySelectorAll('.ext4-voicing-row').forEach(row => {
                        row.addEventListener('click', () => {
                            const idx = parseInt(row.dataset.voicingIdx, 10);
                            const voicing = voicings[idx];
                            if (!voicing) return;
                            activeVoicingIndex = idx;
                            renderDiagram(voicing);
                            voicingsList.querySelectorAll('.ext4-voicing-row').forEach((r, i) => {
                                r.classList.toggle('active', i === idx);
                            });
                            playVoicing(voicing);
                        });
                    });
                }

                // Play button
                document.getElementById('ext4-play-btn')?.addEventListener('click', () => {
                    const voicing = voicings[activeVoicingIndex];
                    if (voicing) playVoicing(voicing);
                });

                // Node map clicks
                this._attachNodeMapListeners(topSection);

                // Prev / Next buttons
                topSection.querySelector('#ext4-prev-btn')?.addEventListener('click', (e) => {
                    const key = e.currentTarget.dataset.navKey;
                    if (key) this.selectExtendedChord(key);
                });
                topSection.querySelector('#ext4-next-btn')?.addEventListener('click', (e) => {
                    const key = e.currentTarget.dataset.navKey;
                    if (key) this.selectExtendedChord(key);
                });

                // Chord picker clicks
                topSection.querySelectorAll('.ext4-picker-btn[data-picker-key]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const key = btn.dataset.pickerKey;
                        if (key) this.selectExtendedChord(key);
                    });
                });

                // Related chord clicks
                topSection.querySelectorAll('.ext4-related-chip[data-related-key]').forEach(chip => {
                    chip.addEventListener('click', () => {
                        const key = chip.dataset.relatedKey;
                        if (key) this.selectExtendedChord(key);
                    });
                });
            },

            selectExtendedChord(key) {
                const chordData = MusicTheory.extendedChords[key];
                if (!chordData) return;
                this.currentExtendedChordType = key;
                const group = this._getGroupForChord(key);
                if (group) {
                    this.currentExtensionCategory = group;
                    document.querySelectorAll('.extension-tab').forEach(b => {
                        b.classList.toggle('active', b.dataset.extCategory === this.currentExtensionCategory);
                    });
                }
                this.showExtendedChord();
            },

            // Convierte un voicing de frets reales a notas MIDI con octavas correctas
            // Afinación estándar: E2(40) A2(45) D3(50) G3(55) B3(59) E4(64)
            voicingFretsToMidi(frets, rootOffset = 0) {
                const openStringMidi = [40, 45, 50, 55, 59, 64]; // cuerda 6 a 1
                const midiNotes = [];
                for (let s = 0; s < 6; s++) {
                    if (frets[s] >= 0) {
                        // Trasposición: sumar rootOffset semitonos a cada nota
                        midiNotes.push(openStringMidi[s] + frets[s] + rootOffset);
                    }
                }
                return midiNotes;
            },

            // Reproduce voicings usando octavas reales del instrumento
            playVoicingFrets(frets, rootOffset = 0, duration = 1.5) {
                if (!AudioEngine.enabled || !AudioEngine.audioContext) return;
                const midiNotes = this.voicingFretsToMidi(frets, rootOffset);
                midiNotes.forEach((midi, i) => {
                    setTimeout(() => {
                        AudioEngine.playMidiNote(midi, duration * 0.85);
                    }, i * 35);
                });
            },

            // ========== NIVEL 12 - DOMINANTES SECUNDARIOS ==========

            showHarmonicFunctionStep() {
                const step = this.harmonicFunctionStep || 0;
                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const scale = MusicTheory.getScale(this.currentRoot, 'major');

                // Show above-fretboard panel, hide below-fretboard panel
                const abovePanel = document.getElementById('infoPanelAboveFretboard');
                const belowPanel = document.getElementById('infoPanelOtherLevels');
                if (abovePanel) abovePanel.classList.remove('hidden');
                if (belowPanel) belowPanel.innerHTML = '';

                // Update pills UI
                const controlPanel = document.getElementById('controlPanel');
                if (controlPanel) {
                    controlPanel.querySelectorAll('.sec-step-pill').forEach(p => {
                        const active = parseInt(p.dataset.step) === step;
                        p.style.background = active ? '#dc2626' : 'transparent';
                        p.style.borderColor = active ? '#dc2626' : '#555';
                        p.style.color = active ? '#fff' : '#aaa';
                    });
                    const indicator = document.getElementById('secStepIndicator');
                    if (indicator) indicator.textContent = `Paso ${step + 1} / 4`;
                    const prevBtn = document.getElementById('secStepPrev');
                    const nextBtn = document.getElementById('secStepNext');
                    if (prevBtn) prevBtn.style.opacity = step === 0 ? '0.3' : '1';
                    if (nextBtn) nextBtn.textContent = step === 3 ? '✓ Explora' : 'Siguiente →';
                }

                this.hideUIElements();

                // Steps content
                if (step === 0) {
                    // ── PASO 1: ¿Qué es una tonalidad? ──
                    this.updateDisplay('Funciones Armónicas', 'Paso 1 — ¿Qué es una tonalidad?');
                    Fretboard.showScale(this.currentRoot, 'major');

                    const panel = document.getElementById('infoPanelAboveFretboard');
                    if (!panel) return;
                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div class="info-header">
                                <div class="info-title">¿Qué es una tonalidad?</div>
                                <div class="info-emotion">El "hogar" de la música — todo gira alrededor de una nota central</div>
                            </div>
                            <div class="info-description" style="color:#ccc; line-height:1.7; margin-top:12px;">
                                Cuando tocas en <strong style="color:#fafafa;">tonalidad de ${rootName} Mayor</strong>, hay
                                7 notas que "pertenecen" a esa tonalidad. Son las mismas notas que forman la
                                <strong style="color:#fafafa;">escala mayor de ${rootName}</strong> — la que ves en el
                                mástil ahora mismo.
                            </div>
                            <div class="grid grid-cols-7 gap-1 mt-4">
                                ${scale.map((n, i) => `
                                    <div style="text-align:center; padding:10px 4px; background:${i === 0 ? '#dc2626' : '#1a1a1a'}; border:1px solid ${i === 0 ? '#dc2626' : '#333'}; border-radius:6px;">
                                        <div style="font-family:'Bebas Neue'; font-size:18px; color:#fafafa;">${n.note}</div>
                                        <div style="font-size:9px; color:#666; margin-top:2px;">grado ${i+1}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="info-description" style="color:#888; margin-top:14px; font-size:13px;">
                                La nota <strong style="color:#dc2626;">${rootName}</strong> es el <em>centro tonal</em>:
                                la nota de reposo, donde todo "llega" y se resuelve. En solfeo, a esto se le llama
                                la <strong style="color:#fafafa;">tónica</strong>.
                            </div>
                            <div style="margin-top:16px; padding:12px; background:#111; border-radius:8px; border-left:3px solid #dc2626;">
                                <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">A qué parte del solfeo pertenece</div>
                                <div style="font-size:13px; color:#ccc; line-height:1.6;">
                                    Esto es <strong style="color:#fafafa;">Armonía</strong> — la rama del solfeo que estudia
                                    cómo se combinan los sonidos. Antes de entender por qué los acordes suenan de cierta
                                    manera, hay que entender en qué "mundo tonal" estamos.
                                </div>
                            </div>
                        </div>
                    `;

                } else if (step === 1) {
                    // ── PASO 2: Los grados ──
                    this.updateDisplay('Funciones Armónicas', 'Paso 2 — Los grados: los acordes de la tonalidad');
                    Fretboard.showScale(this.currentRoot, 'major');

                    const panel = document.getElementById('infoPanelAboveFretboard');
                    if (!panel) return;

                    const degrees = [
                        { roman: 'I',    quality: '',  color: '#dc2626', label: 'Tónica',         voicing: 'E_shape_major',        isMinor: false, isDim: false },
                        { roman: 'ii',   quality: 'm', color: '#888',    label: 'Supertónica',    voicing: 'E_shape_minor',        isMinor: true,  isDim: false },
                        { roman: 'iii',  quality: 'm', color: '#888',    label: 'Mediante',       voicing: 'E_shape_minor',        isMinor: true,  isDim: false },
                        { roman: 'IV',   quality: '',  color: '#d97706', label: 'Subdominante',   voicing: 'E_shape_major',        isMinor: false, isDim: false },
                        { roman: 'V',    quality: '',  color: '#3b82f6', label: 'Dominante',      voicing: 'E_shape_major',        isMinor: false, isDim: false },
                        { roman: 'vi',   quality: 'm', color: '#888',    label: 'Relativo menor', voicing: 'E_shape_minor',        isMinor: true,  isDim: false },
                        { roman: 'vii°', quality: '°', color: '#888',    label: 'Sensible',       voicing: 'E_shape_minor',        isMinor: true,  isDim: true  },
                    ];

                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div class="info-header">
                                <div class="info-title">Los 7 grados de ${rootName} Mayor</div>
                                <div class="info-emotion">Cada nota de la escala genera un acorde — eso es un "grado"</div>
                            </div>
                            <div class="info-description" style="color:#ccc; line-height:1.7; margin-top:10px;">
                                Apila tres notas de la escala y obtienes un <strong style="color:#fafafa;">acorde diatónico</strong>.
                                En ${rootName} Mayor hay 7 acordes naturales, uno por cada nota:
                            </div>
                            <div id="step2DiagramsRow" style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:16px;"></div>
                            <div class="info-description" style="color:#888; margin-top:14px; font-size:13px; line-height:1.6;">
                                Los <strong style="color:#dc2626;">números romanos</strong> son universales: si alguien dice
                                "toca el I-IV-V en ${rootName}", sabes exactamente qué acordes tocar, en cualquier
                                tonalidad. Son la <em>gramática</em> de la armonía.
                            </div>
                        </div>
                    `;

                    const row = document.getElementById('step2DiagramsRow');
                    degrees.forEach((d, i) => {
                        const rootNote = scale[i].note;
                        const rootIdx = MusicTheory.getNoteIndex(rootNote);
                        const voicingKey = d.voicing;
                        const voicing = MusicTheory.chordVoicings[voicingKey];
                        if (!voicing || !row) return;
                        const position = (rootIdx - 4 + 12) % 12;
                        const chordName = `${rootNote}${d.isDim ? '°' : d.quality}`;
                        const diagram = ChordDiagram.create(voicing, chordName, position);
                        const wrapper = document.createElement('div');
                        wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:4px;';
                        const badge = document.createElement('div');
                        badge.style.cssText = `font-family:'Bebas Neue'; font-size:16px; color:${d.color}; text-align:center;`;
                        badge.textContent = d.roman;
                        const lbl = document.createElement('div');
                        lbl.style.cssText = 'font-size:9px; color:#555; text-align:center;';
                        lbl.textContent = d.label;
                        wrapper.appendChild(badge);
                        wrapper.appendChild(diagram);
                        wrapper.appendChild(lbl);
                        row.appendChild(wrapper);
                    });

                } else if (step === 2) {
                    // ── PASO 3: Las 3 funciones armónicas ──
                    this.updateDisplay('Funciones Armónicas', 'Paso 3 — Tónica, Subdominante y Dominante');
                    Fretboard.showScale(this.currentRoot, 'major');

                    const panel = document.getElementById('infoPanelAboveFretboard');
                    if (!panel) return;

                    const scale = MusicTheory.getScale(this.currentRoot, 'major');
                    const functions = [
                        {
                            name: 'Tónica', abbr: 'T', color: '#dc2626',
                            degrees: ['I', 'vi'],
                            chords: [`${scale[0].note}`, `${scale[5].note}m`],
                            description: 'Reposo y estabilidad. Es el "hogar". La música puede quedarse aquí indefinidamente sin crear tensión.',
                            analogy: 'Estar sentado en casa, cómodo.'
                        },
                        {
                            name: 'Subdominante', abbr: 'SD', color: '#d97706',
                            degrees: ['IV', 'ii'],
                            chords: [`${scale[3].note}`, `${scale[1].note}m`],
                            description: 'Movimiento suave, tensión media. Aleja de la tónica pero sin urgencia de volver. Crea expectativa.',
                            analogy: 'Levantarte del sofá para ir a la cocina.'
                        },
                        {
                            name: 'Dominante', abbr: 'D', color: '#3b82f6',
                            degrees: ['V', 'vii°'],
                            chords: [`${scale[4].note}`, `${scale[6].note}°`],
                            description: 'Máxima tensión. Contiene el tritono — el intervalo más inestable. Quiere resolver urgentemente de vuelta a la tónica.',
                            analogy: 'Estar a punto de estornudar: el cuerpo exige resolución.'
                        },
                    ];

                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div class="info-header">
                                <div class="info-title">Las 3 Funciones Armónicas</div>
                                <div class="info-emotion">Cada acorde tiene un "rol" en la historia musical</div>
                            </div>
                            <div class="info-description" style="color:#ccc; line-height:1.7; margin-top:10px;">
                                Los 7 grados se agrupan en <strong style="color:#fafafa;">3 funciones</strong> según
                                la tensión que generan. Entender esto es la clave de toda la armonía occidental:
                            </div>
                            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:16px;">
                                ${functions.map((f, fi) => `
                                    <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                                        <div style="font-family:'Bebas Neue'; font-size:22px; color:${f.color}; line-height:1;">${f.abbr}</div>
                                        <div id="step3Diagrams_${fi}" style="display:flex; gap:6px;"></div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="space-y-3 mt-4">
                                ${functions.map((f) => `
                                    <div style="padding:12px 14px; background:#111; border-radius:8px; border-left:3px solid ${f.color};">
                                        <div style="display:flex; align-items:center; gap-2; margin-bottom:4px;">
                                            <strong style="color:${f.color}; font-size:13px;">${f.name}</strong>
                                            <span style="font-size:11px; color:#666; margin-left:8px;">
                                                ${f.degrees.map((d, i) => `<span style="color:${f.color};">${d}</span> (${f.chords[i]})`).join('  ·  ')}
                                            </span>
                                        </div>
                                        <div style="font-size:12px; color:#bbb; line-height:1.6;">${f.description}</div>
                                        <div style="font-size:11px; color:#666; margin-top:4px; font-style:italic;">→ ${f.analogy}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="margin-top:14px; padding:10px 14px; background:#1a1a1a; border-radius:8px;">
                                <div style="font-size:12px; color:#ccc; line-height:1.7;">
                                    La progresión más universal de la música:
                                    <strong style="color:#dc2626;">I</strong>
                                    <span style="color:#555;">→</span>
                                    <strong style="color:#d97706;">IV</strong>
                                    <span style="color:#555;">→</span>
                                    <strong style="color:#3b82f6;">V</strong>
                                    <span style="color:#555;">→</span>
                                    <strong style="color:#dc2626;">I</strong>
                                    — del reposo, a la expectativa, a la tensión máxima, y de vuelta al reposo.
                                    Millones de canciones viven en este ciclo.
                                </div>
                            </div>
                        </div>
                    `;

                    // Render chord diagrams per function: main chord (first degree) only
                    const funcDiagramData = [
                        { scaleIdx: 0, voicing: 'E_shape_major', isMinor: false },  // T: I (major)
                        { scaleIdx: 3, voicing: 'E_shape_major', isMinor: false },  // SD: IV (major)
                        { scaleIdx: 4, voicing: 'E_shape_major', isMinor: false },  // D: V (major)
                    ];
                    functions.forEach((f, fi) => {
                        const slot = document.getElementById(`step3Diagrams_${fi}`);
                        if (!slot) return;
                        const data = funcDiagramData[fi];
                        const rootNote = scale[data.scaleIdx].note;
                        const rootIdx = MusicTheory.getNoteIndex(rootNote);
                        const voicing = MusicTheory.chordVoicings[data.voicing];
                        if (!voicing) return;
                        const position = (rootIdx - 4 + 12) % 12;
                        const chordName = `${rootNote}`;
                        const wrapper = document.createElement('div');
                        wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px;';
                        const diag = ChordDiagram.create(voicing, chordName, position);
                        const lbl = document.createElement('div');
                        lbl.style.cssText = `font-family:'Bebas Neue'; font-size:13px; color:${f.color}; text-align:center;`;
                        lbl.textContent = f.degrees[0];
                        wrapper.appendChild(lbl);
                        wrapper.appendChild(diag);
                        slot.appendChild(wrapper);
                    });

                } else if (step === 3) {
                    // ── PASO 4: El dominante secundario ──
                    this.currentSecondary = this.currentSecondary || 'V';
                    this.showSecondaryDominant();

                    // Override the title to give context
                    const panel = document.getElementById('infoPanelAboveFretboard');
                    if (!panel) return;
                    const existingBox = panel.querySelector('.scale-info-box');
                    if (!existingBox) return;

                    const contextBanner = document.createElement('div');
                    contextBanner.style.cssText = 'padding:10px 14px; background:#111; border-radius:8px; border-left:3px solid #3b82f6; margin-bottom:14px;';
                    contextBanner.innerHTML = `
                        <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Extensión de las funciones</div>
                        <div style="font-size:12px; color:#ccc; line-height:1.6;">
                            Ya sabes que el <strong style="color:#3b82f6;">V</strong> (dominante) crea tensión que resuelve al
                            <strong style="color:#dc2626;">I</strong>. Un <strong style="color:#d97706;">dominante secundario</strong>
                            aplica esa misma lógica a <em>cualquier grado</em>: construyes un acorde V7 que resuelve
                            al grado que quieras, creando una mini-tensión temporal hacia él.
                        </div>
                    `;
                    existingBox.insertBefore(contextBanner, existingBox.firstChild);
                }
            },

            showSecondaryDominant() {
                this.hideUIElements();

                if (!this.currentSecondary) {
                    this.currentSecondary = 'ii';
                }

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const secDom = MusicTheory.secondaryDominants[this.currentSecondary];
                if (!secDom) return;

                // Calculate the secondary dominant root
                const secDomRoot = (this.currentRoot + secDom.rootOffset) % 12;
                const secDomRootName = MusicTheory.getNoteName(secDomRoot);

                // Calculate target chord root
                const scale = MusicTheory.getScale(this.currentRoot, 'major');
                const targetRoot = scale[secDom.target - 1].note;
                const targetRootIndex = MusicTheory.getNoteIndex(targetRoot);

                // Show dominant 7 chord on fretboard
                const dom7intervals = [0, 4, 7, 10]; // dom7
                Fretboard.tonicNote = secDomRoot;
                Fretboard.currentScale = dom7intervals.map((interval, i) => ({
                    note: MusicTheory.getNoteName(secDomRoot + interval),
                    degree: i + 1
                }));
                Fretboard.highlightedNotes.clear();
                Fretboard.clearZone();
                Fretboard.specificPositions = null;
                Fretboard.updateDisplay();

                // Show chord diagrams (dominante + resolución lado a lado)
                const diagramContainer = document.getElementById('diagramsContainer');
                diagramContainer.innerHTML = '';
                diagramContainer.classList.remove('hidden');

                const pairContainer = document.createElement('div');
                pairContainer.className = 'flex items-center gap-4';
                pairContainer.style.justifyContent = 'center';
                pairContainer.style.flexWrap = 'wrap';

                // Dominante
                const domWrapper = document.createElement('div');
                domWrapper.className = 'chord-wrapper dominant-wrapper';
                const domVoicing = MusicTheory.seventhVoicings['dom7_E'];
                const domPosition = (secDomRoot - 4 + 12) % 12;
                const domDiagram = ChordDiagram.create(domVoicing, `${secDomRootName}7`, domPosition);
                domWrapper.appendChild(domDiagram);

                const domLabel = document.createElement('div');
                domLabel.textContent = 'Dominante Secundario';
                domLabel.style.cssText = 'text-align: center; font-size: 12px; color: #d97706; margin-top: 8px; font-weight: 600;';
                domWrapper.appendChild(domLabel);

                // Flecha
                const arrow = document.createElement('div');
                arrow.innerHTML = '→';
                arrow.style.cssText = 'font-size: 48px; color: #dc2626; font-weight: bold;';

                // Resolución (acorde objetivo)
                const targetQuality = secDom.target === 2 || secDom.target === 3 || secDom.target === 6 ? 'm' : '';
                const targetWrapper = document.createElement('div');
                targetWrapper.className = 'chord-wrapper target-wrapper';

                // Obtener voicing para el acorde objetivo
                let targetVoicing;
                if (targetQuality === 'm') {
                    targetVoicing = MusicTheory.chordVoicings['E_shape_minor'];
                } else {
                    targetVoicing = MusicTheory.chordVoicings['E_shape_major'];
                }
                const targetPosition = (targetRootIndex - 4 + 12) % 12;
                const targetDiagram = ChordDiagram.create(targetVoicing, `${targetRoot}${targetQuality}`, targetPosition);
                targetWrapper.appendChild(targetDiagram);

                const targetLabel = document.createElement('div');
                targetLabel.textContent = 'Resolución';
                targetLabel.style.cssText = 'text-align: center; font-size: 12px; color: #22c55e; margin-top: 8px; font-weight: 600;';
                targetWrapper.appendChild(targetLabel);

                pairContainer.appendChild(domWrapper);
                pairContainer.appendChild(arrow);
                pairContainer.appendChild(targetWrapper);

                diagramContainer.appendChild(pairContainer);

                // Example in current key
                const exampleInKey = `${secDomRootName}7 → ${targetRoot}${secDom.target === 6 || secDom.target === 2 || secDom.target === 3 ? 'm' : ''}`;

                this.updateDisplay(
                    `Dom. Secundario — ${secDom.roman} en ${rootName} Mayor`,
                    `${exampleInKey} | El ${secDomRootName}7 actúa como dominante temporal del grado ${this.currentSecondary}`
                );

                // Info panel
                const panel = document.getElementById('infoPanelAboveFretboard');
                if (panel) {
                    const targetQuality = secDom.target === 2 || secDom.target === 3 || secDom.target === 6 ? 'm' : '';
                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div class="info-header">
                                <div class="info-title">${secDom.roman} — ${secDom.name}</div>
                                <div class="info-emotion">Dominante Secundario en ${rootName} Mayor</div>
                            </div>
                            <div class="flex items-center justify-center gap-4 my-6">
                                <div class="sec-dom-chord dominant">
                                    <div style="font-family: 'Bebas Neue'; font-size: 24px; color: #d97706;">${secDomRootName}7</div>
                                    <div style="font-size: 10px; color: #888;">${secDom.roman}</div>
                                </div>
                                <div class="sec-dom-arrow">→</div>
                                <div class="sec-dom-chord target">
                                    <div style="font-family: 'Bebas Neue'; font-size: 24px; color: #22c55e;">${targetRoot}${targetQuality}</div>
                                    <div style="font-size: 10px; color: #888;">${this.currentSecondary}</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="info-section accent">
                                    <div class="info-label">¿Qué es?</div>
                                    <div class="info-description" style="color: #ccc;">
                                        Un dominante secundario es un acorde V7 que resuelve a un grado
                                        que no es el I. Crea tensión momentánea "prestada" de otra tonalidad.
                                    </div>
                                </div>
                                <div class="info-section">
                                    <div class="info-label">Efecto armónico</div>
                                    <div class="info-description" style="color: #ccc;">
                                        ${secDomRootName}7 contiene un tritono que resuelve naturalmente
                                        a ${targetRoot}${targetQuality}. Es como hacer una mini-modulación
                                        temporal al grado ${this.currentSecondary}.
                                    </div>
                                </div>
                            </div>
                            <div class="info-section" style="margin-top: 12px;">
                                <div class="info-label">Notas del ${secDomRootName}7</div>
                                <div class="flex flex-wrap gap-3 mt-2">
                                    ${dom7intervals.map((interval, i) => {
                                        const noteName = MusicTheory.getNoteName(secDomRoot + interval);
                                        const names = ['1 (Raíz)', '3ª Mayor', '5ª Justa', '7ª menor'];
                                        return `<div style="padding: 8px 14px; background: ${i === 0 ? '#dc2626' : '#1a1a1a'}; border: 2px solid ${i === 0 ? '#dc2626' : '#333'}; border-radius: 8px; text-align: center;">
                                            <div style="font-family: 'IBM Plex Mono'; font-size: 14px; font-weight: 700; color: #fafafa;">${noteName}</div>
                                            <div style="font-size: 10px; color: #888; margin-top: 2px;">${names[i]}</div>
                                        </div>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }
            },

            showSecondaryProgression() {
                if (!this.currentSecProg) return;
                const prog = MusicTheory.secondaryProgressions[this.currentSecProg - 1];
                if (!prog) return;

                this.hideUIElements();
                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const scale = MusicTheory.getScale(this.currentRoot, 'major');

                // Build chords
                const degreeMap = {
                    'I': { root: 0, quality: '' },
                    'ii': { root: 1, quality: 'm' },
                    'iii': { root: 2, quality: 'm' },
                    'IV': { root: 3, quality: '' },
                    'V': { root: 4, quality: '' },
                    'vi': { root: 5, quality: 'm' },
                    'V/ii': { root: -1, quality: '7', secTarget: 'ii' },
                    'V/iii': { root: -1, quality: '7', secTarget: 'iii' },
                    'V/IV': { root: -1, quality: '7', secTarget: 'IV' },
                    'V/V': { root: -1, quality: '7', secTarget: 'V' },
                    'V/vi': { root: -1, quality: '7', secTarget: 'vi' },
                };

                const chordNames = prog.degrees.map(deg => {
                    const info = degreeMap[deg];
                    if (!info) return deg;
                    if (info.secTarget) {
                        const secDom = MusicTheory.secondaryDominants[info.secTarget];
                        const secRoot = MusicTheory.getNoteName((this.currentRoot + secDom.rootOffset) % 12);
                        return `${secRoot}${info.quality}`;
                    }
                    return `${scale[info.root].note}${info.quality}`;
                });

                this.updateDisplay(
                    `${prog.name} en ${rootName}`,
                    `${prog.description} | ${chordNames.join(' → ')}`
                );

                // Show in info panel
                const panel = document.getElementById('infoPanelOtherLevels');
                if (panel) {
                    panel.innerHTML = `
                        <div class="scale-info-box">
                            <div class="info-header">
                                <div class="info-title">${prog.name}</div>
                                <div class="info-emotion">${prog.description}</div>
                            </div>
                            <div class="flex flex-wrap items-center justify-center gap-3 my-6">
                                ${prog.degrees.map((deg, i) => {
                                    const isSecondary = deg.startsWith('V/');
                                    const chord = chordNames[i];
                                    return `
                                        ${i > 0 ? '<div class="sec-dom-arrow">→</div>' : ''}
                                        <div class="sec-dom-chord ${isSecondary ? 'dominant' : deg === 'I' ? 'target' : ''}">
                                            <div style="font-family: 'Bebas Neue'; font-size: 22px; color: ${isSecondary ? '#d97706' : '#fafafa'};">${chord}</div>
                                            <div style="font-size: 10px; color: #888;">${deg}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }

                Fretboard.showScale(this.currentRoot, 'major');
            },

            // ========== NIVEL 13 - CANCIONES ==========

            showPractice() {
                this.resetState();
                this.hideUIElements();

                if (!this.practiceMode) this.practiceMode = 'songs';

                // Toggle content visibility based on mode
                const songsContent = document.getElementById('practiceSongsContent');
                const jamContent = document.getElementById('practiceJamContent');
                const licksContent = document.getElementById('practiceLicksContent');

                if (this.practiceMode === 'songs') {
                    if (songsContent) songsContent.style.display = 'block';
                    if (jamContent) jamContent.style.display = 'none';
                    if (licksContent) licksContent.style.display = 'none';
                    this.showSongs();
                } else if (this.practiceMode === 'jam') {
                    if (songsContent) songsContent.style.display = 'none';
                    if (jamContent) jamContent.style.display = 'block';
                    if (licksContent) licksContent.style.display = 'none';
                    this.showJamSession();
                } else {
                    if (songsContent) songsContent.style.display = 'none';
                    if (jamContent) jamContent.style.display = 'none';
                    if (licksContent) licksContent.style.display = 'block';
                    this.showLickLibrary();
                }
            },

            showSongs() {
                this.resetState();
                this.hideUIElements();
                this.updateDisplay('BIBLIOTECA DE CANCIONES', 'Analiza la teoría detrás de canciones reales');
                this.renderSongList();
            },

            renderSongList() {
                const panel = document.getElementById('infoPanel');
                if (!panel) return;

                let songs = [...MusicTheory.songs];

                // Filter by genre
                if (this.songGenreFilter !== 'all') {
                    const genreMap = {
                        'metal': ['Thrash Metal', 'Heavy Metal', 'Groove Metal', 'Nu Metal'],
                        'prog': ['Rock Progresivo', 'Metal Progresivo'],
                        'rock': ['Hard Rock', 'Rock', 'Grunge', 'Alternative'],
                        'blues': ['Blues', 'Blues Rock'],
                        'jazz': ['Jazz', 'Bossa Nova', 'Cool Jazz'],
                        'funk': ['Funk', 'Soul', 'Funk/Soul'],
                        'pop': ['Pop', 'Pop Rock', 'Soft Rock'],
                        'latin': ['Flamenco', 'Latin', 'Latin Rock'],
                        'country': ['Country', 'Country Rock'],
                        'reggae': ['Reggae'],
                    };
                    const genres = genreMap[this.songGenreFilter] || [];
                    songs = songs.filter(s => genres.includes(s.genre));
                }

                const genreColor = (genre) => {
                    if (genre.includes('Metal') || genre.includes('Nu')) return 'metal';
                    if (genre.includes('Progresivo')) return 'prog';
                    if (genre.includes('Blues')) return 'blues';
                    if (genre.includes('Jazz') || genre.includes('Bossa') || genre.includes('Cool')) return 'jazz';
                    if (genre.includes('Funk') || genre.includes('Soul')) return 'funk';
                    if (genre.includes('Pop') || genre.includes('Soft')) return 'pop';
                    if (genre.includes('Flamenco') || genre.includes('Latin')) return 'latin';
                    if (genre.includes('Country')) return 'country';
                    if (genre.includes('Reggae')) return 'reggae';
                    if (genre.includes('Grunge') || genre.includes('Alternative')) return 'grunge';
                    return 'rock';
                };

                panel.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${songs.map((song, i) => {
                            // Get the actual index in the full MusicTheory.songs array
                            const actualIndex = MusicTheory.songs.indexOf(song);
                            return `
                            <div class="song-card ${this.currentSong === actualIndex ? 'active' : ''}" data-song="${actualIndex}">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div style="font-family: 'Barlow Condensed'; font-size: 17px; font-weight: 700; color: #fafafa; text-transform: uppercase;">${song.name}</div>
                                        <div style="font-size: 13px; color: #888;">${song.artist}</div>
                                    </div>
                                    <span class="genre-badge ${genreColor(song.genre)}">${song.genre}</span>
                                </div>
                                <div class="flex items-center justify-between mt-3">
                                    <div style="font-family: 'IBM Plex Mono'; font-size: 12px; color: #666;">
                                        ${MusicTheory.getNoteName(song.key)} ${song.mode === 'major' ? 'Mayor' : 'menor'}
                                    </div>
                                </div>
                                <div style="font-family: 'IBM Plex Mono'; font-size: 11px; color: #555; margin-top: 6px;">
                                    ${song.progressionChords.join(' → ')}
                                </div>
                            </div>
                        `}).join('')}
                        ${songs.length === 0 ? '<div style="color: #666; grid-column: 1/-1; text-align: center; padding: 40px;">No hay canciones con estos filtros</div>' : ''}
                    </div>
                `;

                // Bind card clicks
                panel.querySelectorAll('.song-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const songIndex = parseInt(card.dataset.song);
                        this.currentSong = songIndex;
                        panel.querySelectorAll('.song-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');
                        this.showSongDetail(MusicTheory.songs[songIndex]);
                    });
                });
            },

            showSongDetail(song) {
                const rootName = MusicTheory.getNoteName(song.key);
                const scaleType = song.scale || 'minor';

                // Show scale on fretboard
                Fretboard.showScale(song.key, scaleType);

                this.updateDisplay(
                    `${song.name} — ${song.artist}`,
                    `${rootName} ${song.mode === 'major' ? 'Mayor' : 'menor'} | ${song.genre} | ${song.progressionChords.join(' → ')}`
                );

                // Show chord diagrams
                const diagramContainer = document.getElementById('diagramsContainer');
                if (diagramContainer && song.progressionChords[0] !== 'Instrumental') {
                    diagramContainer.innerHTML = '';
                    diagramContainer.classList.remove('hidden');

                    song.progressionChords.forEach(chordStr => {
                        const cleanName = chordStr.replace(/5$/, '').replace(/\/.*/, '');
                        const isMinor = cleanName.endsWith('m') || chordStr.includes('m');
                        const rootNote = cleanName.replace(/m$/, '').replace(/b$/, 'b');
                        const rootIdx = MusicTheory.getNoteIndex(rootNote);

                        let voicingKey = isMinor ? `${rootNote}m` : rootNote;
                        let voicing = MusicTheory.chordVoicings[voicingKey];
                        let position = 0;

                        if (!voicing) {
                            const shape = isMinor ? 'E_shape_minor' : 'E_shape_major';
                            voicing = MusicTheory.chordVoicings[shape];
                            position = (rootIdx - 4 + 12) % 12;
                        }

                        if (voicing) {
                            const diagram = ChordDiagram.create(voicing, chordStr, position);
                            diagram.style.display = 'inline-block';
                            diagram.style.margin = '0 8px';
                            diagramContainer.appendChild(diagram);
                        }
                    });
                }

                // Scroll detail into view with tips in info panel supplement
                const panel = document.getElementById('infoPanel');
                if (panel) {
                    // Keep the song cards, add detail below
                    const existing = panel.querySelector('.song-detail-box');
                    if (existing) existing.remove();

                    const detailBox = document.createElement('div');
                    detailBox.className = 'song-detail-box scale-info-box';
                    detailBox.style.marginTop = '20px';
                    detailBox.innerHTML = `
                        <div class="info-header">
                            <div class="info-title">${song.name}</div>
                            <div class="info-emotion">${song.artist} — ${song.genre}</div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="info-section accent">
                                <div class="info-label">Progresión</div>
                                <div class="info-value" style="font-size: 16px;">${song.progression.join(' → ')}</div>
                                <div class="info-description" style="margin-top: 8px;">Acordes: ${song.progressionChords.join(' → ')}</div>
                            </div>
                            <div class="info-section">
                                <div class="info-label">Escala Base</div>
                                <div class="info-value" style="font-size: 16px;">${rootName} ${App.SCALE_NAMES[scaleType] || scaleType}</div>
                            </div>
                        </div>
                        <div class="info-section" style="margin-top: 12px;">
                            <div class="info-label">Tips para tocar</div>
                            <div class="info-description" style="color: #ccc; font-size: 15px; line-height: 1.6;">${song.tips}</div>
                        </div>
                    `;
                    panel.appendChild(detailBox);
                }
            },

            // ========== LABORATORIO DE ESCALAS ==========

            initScaleLab() {
                this.renderScaleCategories();
                this.renderScaleList('major');
                this.populateCompareSelect();
            },

            renderScaleCategories() {
                const container = document.getElementById('scaleCategoryBtns');
                if (!container) return;
                // Usa CATEGORY_SCALES consolidado
            },

            renderScaleList(category) {
                const container = document.getElementById('scaleListContainer');
                if (!container) return;

                container.innerHTML = '';
                const scales = this.CATEGORY_SCALES[category] || [];

                scales.forEach(scaleKey => {
                    const info = MusicTheory.scaleInfo[scaleKey];
                    const item = document.createElement('div');
                    item.className = `scale-list-item ${scaleKey === this.currentLabScale ? 'active' : ''}`;
                    item.dataset.scale = scaleKey;

                    const name = info ? info.name : scaleKey;
                    const emotion = info ? info.emotion : '';

                    item.innerHTML = `
                        <div class="scale-name">${name}</div>
                        <div class="scale-emotion">${emotion}</div>
                    `;

                    item.addEventListener('click', () => {
                        document.querySelectorAll('.scale-list-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        this.currentLabScale = scaleKey;
                        this.showScaleInfo(scaleKey);
                        this.showScaleHarmonization(scaleKey);
                        this.updateComparison();
                    });

                    container.appendChild(item);
                });

                // Auto-select first scale if none selected
                if (scales.length > 0 && !scales.includes(this.currentLabScale)) {
                    this.currentLabScale = scales[0];
                    container.querySelector('.scale-list-item')?.classList.add('active');
                }

                this.showScaleInfo(this.currentLabScale);
                this.showScaleHarmonization(this.currentLabScale);
            },

            showScaleInfo(scaleKey) {
                const infoBox = document.getElementById('scaleInfoBox');
                if (!infoBox) return;

                const info = MusicTheory.scaleInfo[scaleKey];
                const formula = MusicTheory.scales[scaleKey];

                if (!info && !formula) {
                    infoBox.classList.add('hidden');
                    return;
                }

                infoBox.classList.remove('hidden');

                document.getElementById('scaleInfoName').textContent = info?.name || scaleKey;
                document.getElementById('scaleInfoCategory').textContent =
                    MusicTheory.scaleCategories[info?.category]?.name || info?.category || '';
                document.getElementById('scaleInfoFormula').textContent = info?.formula ||
                    formula.map(i => MusicTheory.intervalNames[i]).join(' - ');
                document.getElementById('scaleInfoEmotion').textContent = info?.emotion || '';
                document.getElementById('scaleInfoUsage').textContent = info?.usage || '';

                // Show parent info if exists
                const parentInfo = MusicTheory.getParentInfo(scaleKey);
                const parentSection = document.getElementById('scaleInfoParent');
                if (parentInfo) {
                    parentSection.classList.remove('hidden');
                    document.getElementById('scaleInfoParentText').textContent =
                        `${parentInfo.parentName} (grado ${parentInfo.degree})`;
                } else {
                    parentSection.classList.add('hidden');
                }
            },

            showScaleHarmonization(scaleKey) {
                const section = document.getElementById('scaleHarmonizationSection');
                const container = document.getElementById('scaleHarmonizationChords');
                if (!section || !container) return;

                const formula = MusicTheory.scales[scaleKey];

                // Only show for 7-note scales
                if (formula.length !== 7) {
                    section.classList.add('hidden');
                    return;
                }

                section.classList.remove('hidden');
                container.innerHTML = '';

                const harmonization = MusicTheory.getScaleHarmonization(this.currentRoot, scaleKey);
                const romanNumerals = MusicTheory.romanNumerals.chromatic;
                const qualitySymbols = {
                    'maj': '', 'min': 'm', 'dim': '°', 'aug': '+', 'sus2': 'sus2', 'sus4': 'sus4', '?': '?'
                };

                harmonization.forEach((chord, i) => {
                    const btn = document.createElement('button');
                    btn.className = `harm-chord-btn ${this.currentLabHarmChord === i ? 'active' : ''}`;
                    btn.innerHTML = `
                        <span>${chord.root}${qualitySymbols[chord.quality]}</span>
                        <span class="chord-quality">${romanNumerals[i]}${qualitySymbols[chord.quality]}</span>
                    `;
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.harm-chord-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.currentLabHarmChord = i;
                        this.showLabChord(chord);
                    });
                    container.appendChild(btn);
                });
            },

            showLabChord(chord) {
                const chordRootIndex = MusicTheory.getNoteIndex(chord.root);
                const qualityNames = { maj: 'Mayor', min: 'menor', dim: 'disminuido', aug: 'aumentado' };

                // Show on fretboard
                Fretboard.tonicNote = chordRootIndex;
                Fretboard.currentScale = [
                    { note: chord.root, degree: 1 },
                    { note: chord.third, degree: 3 },
                    { note: chord.fifth, degree: 5 }
                ];
                Fretboard.highlightedNotes.clear();
                Fretboard.clearZone();
                Fretboard.specificPositions = null;
                Fretboard.blueNoteIndex = null;
                Fretboard.updateDisplay();

                // Show chord diagram if possible
                const voicingKey = chord.quality === 'min' ? `${chord.root}m` : chord.root;
                let voicing = MusicTheory.chordVoicings[voicingKey];
                let position = 0;

                if (!voicing) {
                    const shape = chord.quality === 'min' ? 'E_shape_minor' : 'E_shape_major';
                    voicing = MusicTheory.chordVoicings[shape];
                    // Calculate position: distance from E (4) to target note
                    position = (chordRootIndex - 4 + 12) % 12;
                }

                const diagramContainer = document.getElementById('diagramsContainer');
                if (diagramContainer && voicing) {
                    diagramContainer.innerHTML = '';
                    diagramContainer.classList.remove('hidden');
                    const chordName = chord.quality === 'min' ? `${chord.root}m` : chord.root;
                    const diagram = ChordDiagram.create(voicing, chordName, position);
                    diagramContainer.appendChild(diagram);
                }

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const info = MusicTheory.scaleInfo[this.currentLabScale];
                document.getElementById('displayTitle').textContent =
                    `Acorde ${chord.degree} de ${rootName} ${info?.name || this.currentLabScale}`;
                document.getElementById('displaySubtitle').textContent =
                    `${chord.root} ${qualityNames[chord.quality] || chord.quality} | Notas: ${chord.root} - ${chord.third} - ${chord.fifth}`;
            },

            populateCompareSelect() {
                const select = document.getElementById('compareScaleSelect');
                if (!select) return;

                select.innerHTML = '<option value="">Selecciona para comparar...</option>';

                const categories = {
                    'Mayores': ['major'],
                    'Menores': ['minor', 'harmonicMinor', 'melodicMinor'],
                    'Modos': ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
                    'Pentatónicas': ['pentatonicMajor', 'pentatonicMinor', 'blues'],
                    'Simétricas': ['wholeTone', 'diminished'],
                    'Exóticas': ['hungarian', 'byzantine', 'phrygianDom', 'japanese']
                };

                Object.entries(categories).forEach(([catName, scales]) => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = catName;
                    scales.forEach(scaleKey => {
                        const info = MusicTheory.scaleInfo[scaleKey];
                        const option = document.createElement('option');
                        option.value = scaleKey;
                        option.textContent = info?.name || scaleKey;
                        optgroup.appendChild(option);
                    });
                    select.appendChild(optgroup);
                });

                select.addEventListener('change', (e) => {
                    this.compareScale = e.target.value || null;
                    this.updateComparison();
                });
            },

            updateComparison() {
                const resultDiv = document.getElementById('scaleComparisonResult');
                if (!resultDiv) return;

                if (!this.compareScale) {
                    resultDiv.classList.add('hidden');
                    return;
                }

                const comparison = MusicTheory.compareScales(this.currentLabScale, this.compareScale);
                resultDiv.classList.remove('hidden');

                document.getElementById('scaleSimilarity').textContent = `${comparison.similarity}%`;
                document.getElementById('scaleCommonNotes').textContent =
                    comparison.common.map(i => MusicTheory.intervalNames[i]).join(', ') || 'Ninguna';
                document.getElementById('scaleOnlyFirst').textContent =
                    comparison.onlyInFirst.map(i => MusicTheory.intervalNames[i]).join(', ') || 'Ninguna';
                document.getElementById('scaleOnlySecond').textContent =
                    comparison.onlyInSecond.map(i => MusicTheory.intervalNames[i]).join(', ') || 'Ninguna';
            },

            showScaleLab() {
                this.resetState();
                this.currentLabHarmChord = null;
                this.hideUIElements();

                const scaleSelect = document.getElementById('scaleSelect');
                if (scaleSelect) scaleSelect.value = this.currentLabScale;
                this.currentScale = this.currentLabScale;

                Fretboard.showScale(this.currentRoot, this.currentLabScale);

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const info = MusicTheory.scaleInfo[this.currentLabScale];
                const formula = MusicTheory.scales[this.currentLabScale];

                this.updateDisplay(
                    `${rootName} ${info?.name || this.currentLabScale}`,
                    `${formula.length} notas | ${info?.emotion || ''} | Fórmula: ${formula.map(i => MusicTheory.intervalNames[i]).join('-')}`
                );
            },

            // ========== NIVEL 17 - LICK LIBRARY ==========

            showLickLibrary() {
                this.resetState();
                this.hideUIElements();
                this.updateDisplay('LICK LIBRARY', 'Biblioteca de licks con tabs interactivos');

                // Initialize state
                this.lickFilters = {
                    genre: 'all',
                    technique: 'all',
                    difficulty: 'all'
                };
                this.currentLick = null;
                this.lickPlaybackInterval = null;

                this.renderLickGrid();
            },

            renderLickGrid() {
                const grid = document.getElementById('lickGrid');
                if (!grid) return;

                // Filter licks
                let licks = MusicTheory.licks.filter(lick => {
                    if (this.lickFilters.genre !== 'all' && lick.genre !== this.lickFilters.genre) return false;
                    if (this.lickFilters.technique !== 'all' && lick.technique !== this.lickFilters.technique) return false;
                    if (this.lickFilters.difficulty !== 'all' && lick.difficulty !== this.lickFilters.difficulty) return false;
                    return true;
                });

                // Difficulty colors
                const difficultyColor = {
                    'easy': '#10b981',
                    'medium': '#eab308',
                    'hard': '#f97316',
                    'expert': '#dc2626'
                };

                // Technique icons
                const techniqueIcon = {
                    'sweep': '🎸',
                    'tapping': '👆',
                    'alternate': '⚡',
                    'legato': '🎵',
                    'rhythm': '🥁'
                };

                grid.innerHTML = licks.map(lick => `
                    <div class="lick-card" data-lick-id="${lick.id}">
                        <div class="lick-card-header">
                            <div class="lick-icon">${techniqueIcon[lick.technique] || '🎸'}</div>
                            <div class="lick-difficulty" style="color: ${difficultyColor[lick.difficulty]}">
                                ${lick.difficulty.toUpperCase()}
                            </div>
                        </div>
                        <div class="lick-card-title">${lick.name}</div>
                        <div class="lick-card-meta">
                            <span class="lick-genre">${lick.genre}</span>
                            <span class="lick-bpm">${lick.bpm} BPM</span>
                        </div>
                        <div class="lick-card-description">${lick.description}</div>
                        <button class="lick-view-btn ctrl-btn">Ver Tab</button>
                    </div>
                `).join('');
            },

            showLickDetail(lickId) {
                const lick = MusicTheory.licks.find(l => l.id === lickId);
                if (!lick) return;

                this.currentLick = lick;

                const modal = document.getElementById('lickDetailModal');
                const content = document.getElementById('lickDetailContent');

                if (!modal || !content) return;

                // Create tab notation
                const tabContainer = TabNotation.create(lick.tabs, lick.name, lick.bpm);

                content.innerHTML = `
                    <h2 class="text-2xl font-display text-chalk-100 mb-2">${lick.name}</h2>
                    <div class="lick-detail-meta flex gap-4 mb-4 text-sm text-void-300">
                        <span>Género: <strong>${lick.genre}</strong></span>
                        <span>Técnica: <strong>${lick.technique}</strong></span>
                        <span>Dificultad: <strong>${lick.difficulty}</strong></span>
                        <span>Key: <strong>${lick.key}</strong></span>
                    </div>
                    <p class="text-void-200 mb-6">${lick.description}</p>
                    <div id="lickTabContainer"></div>
                    <div class="lick-detail-fretboard mt-6">
                        <h3 class="text-lg font-display mb-2">Visualización en el Diapasón</h3>
                        <div id="lickFretboard"></div>
                    </div>
                `;

                // Append tab notation
                const tabContainerDiv = content.querySelector('#lickTabContainer');
                if (tabContainerDiv) {
                    tabContainerDiv.appendChild(tabContainer);
                }

                // Show fretboard with lick notes
                const fretboardDiv = content.querySelector('#lickFretboard');
                if (fretboardDiv) {
                    const fretboardSvg = this.renderLickFretboard(lick);
                    fretboardDiv.appendChild(fretboardSvg);
                }

                // Show modal
                modal.classList.remove('hidden');
            },

            renderLickFretboard(lick) {
                // Create a simple fretboard showing the lick positions
                const container = document.createElement('div');
                container.className = 'mini-fretboard';

                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '200');
                svg.setAttribute('viewBox', '0 0 600 200');

                // Draw simple fretboard with lick positions highlighted
                const strings = 6;
                const frets = 12;
                const fretWidth = 40;
                const stringHeight = 25;
                const startX = 50;
                const startY = 30;

                // Draw strings
                for (let i = 0; i < strings; i++) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startX);
                    line.setAttribute('y1', startY + i * stringHeight);
                    line.setAttribute('x2', startX + frets * fretWidth);
                    line.setAttribute('y2', startY + i * stringHeight);
                    line.setAttribute('stroke', '#444');
                    line.setAttribute('stroke-width', '1');
                    svg.appendChild(line);
                }

                // Draw frets
                for (let i = 0; i <= frets; i++) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startX + i * fretWidth);
                    line.setAttribute('y1', startY);
                    line.setAttribute('x2', startX + i * fretWidth);
                    line.setAttribute('y2', startY + (strings - 1) * stringHeight);
                    line.setAttribute('stroke', '#444');
                    line.setAttribute('stroke-width', i === 0 ? '3' : '1');
                    svg.appendChild(line);
                }

                // Highlight lick notes
                lick.tabs.forEach((tab, i) => {
                    const x = startX + (tab.fret - 0.5) * fretWidth;
                    const y = startY + (5 - tab.string) * stringHeight;

                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', x);
                    circle.setAttribute('cy', y);
                    circle.setAttribute('r', '8');
                    circle.setAttribute('fill', '#dc2626');
                    circle.setAttribute('opacity', '0.8');
                    svg.appendChild(circle);

                    // Fingering number
                    if (lick.fingering && lick.fingering[i]) {
                        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        text.setAttribute('x', x);
                        text.setAttribute('y', y + 4);
                        text.setAttribute('text-anchor', 'middle');
                        text.setAttribute('fill', '#fff');
                        text.setAttribute('font-size', '10');
                        text.setAttribute('font-weight', 'bold');
                        text.textContent = lick.fingering[i] || '';
                        svg.appendChild(text);
                    }
                });

                container.appendChild(svg);
                return container;
            },

            // ========== NIVEL 14 - EAR TRAINING ==========

            showEarTraining() {
                this.resetState();
                this.hideUIElements();
                this.earTrainingAnswered = false;

                // Initialize exercise type if not set
                if (!this.earExerciseType) {
                    this.earExerciseType = 'intervals';
                }

                // Generate question based on exercise type
                switch (this.earExerciseType) {
                    case 'intervals':
                        this.generateIntervalQuestion();
                        break;
                    case 'chords':
                        this.generateChordQuestion();
                        break;
                    case 'progressions':
                        this.generateProgressionQuestion();
                        break;
                    case 'melodic':
                        this.generateMelodicQuestion();
                        break;
                    case 'rhythmic':
                        this.generateRhythmicQuestion();
                        break;
                }

                this.updateDisplay(
                    `EAR TRAINING - ${this.earExerciseType.toUpperCase()} - ${this.earTrainingLevel.toUpperCase()}`,
                    `Puntuación: ${this.earTrainingScore} | Racha: ${this.earTrainingStreak} | Mejor: ${this.earTrainingBest}`
                );

                this.renderEarTrainingPanel();
            },

            generateIntervalQuestion() {
                const intervals = MusicTheory.earTraining.intervals[this.earTrainingLevel];
                this.earTrainingCurrent = intervals[Math.floor(Math.random() * intervals.length)];
            },

            generateChordQuestion() {
                const chords = MusicTheory.earTraining.chordQualities[this.earTrainingLevel];
                this.earTrainingCurrent = chords[Math.floor(Math.random() * chords.length)];
            },

            generateProgressionQuestion() {
                const progressions = MusicTheory.earTraining.progressions[this.earTrainingLevel];
                this.earTrainingCurrent = progressions[Math.floor(Math.random() * progressions.length)];
            },

            generateMelodicQuestion() {
                const patterns = MusicTheory.earTraining.melodicPatterns[this.earTrainingLevel];
                this.earTrainingCurrent = patterns[Math.floor(Math.random() * patterns.length)];
            },

            generateRhythmicQuestion() {
                const patterns = MusicTheory.earTraining.rhythmicPatterns[this.earTrainingLevel];
                this.earTrainingCurrent = patterns[Math.floor(Math.random() * patterns.length)];
            },

            renderEarTrainingPanel() {
                const panel = document.getElementById('earTrainingAnswers');
                const questionLabel = document.getElementById('earQuestionLabel');
                const tipText = document.getElementById('earTipText');
                if (!panel) return;

                let questions = [];
                let questionText = '';
                let tipMessage = '';

                switch (this.earExerciseType) {
                    case 'intervals':
                        questions = MusicTheory.earTraining.intervals[this.earTrainingLevel];
                        questionText = '¿Qué intervalo escuchaste?';
                        tipMessage = 'Escucha el salto entre las dos notas. Los intervalos pequeños suenan cercanos.';
                        panel.innerHTML = questions.map(item => `
                            <button class="mode-btn-simple"
                                    data-answer="${item.semitones}"
                                    style="padding: 12px 8px; text-align: center; font-size: 13px;"
                                    ${this.earTrainingAnswered ? 'disabled' : ''}
                                    title="${item.tip || ''}">
                                <div style="font-weight: 600;">${item.name}</div>
                                <div style="font-size: 10px; color: #999;">${item.semitones} st</div>
                            </button>
                        `).join('');
                        break;

                    case 'chords':
                        questions = MusicTheory.earTraining.chordQualities[this.earTrainingLevel];
                        questionText = '¿Qué tipo de acorde es?';
                        tipMessage = 'Mayor = alegre, Menor = triste, Disminuido = tenso, Aumentado = misterioso.';
                        panel.innerHTML = questions.map(item => `
                            <button class="mode-btn-simple"
                                    data-answer="${item.name}"
                                    style="padding: 12px 8px; text-align: center; font-size: 13px;"
                                    ${this.earTrainingAnswered ? 'disabled' : ''}
                                    title="${item.tip || ''}">
                                <div style="font-weight: 600;">${item.name}</div>
                                <div style="font-size: 10px; color: #999;">${item.abbr}</div>
                            </button>
                        `).join('');
                        break;

                    case 'progressions':
                        questions = MusicTheory.earTraining.progressions[this.earTrainingLevel];
                        questionText = '¿Qué progresión escuchaste?';
                        tipMessage = 'Escucha la secuencia de acordes. I-IV-V es rock básico, ii-V-I es jazz.';
                        panel.innerHTML = questions.map(item => `
                            <button class="mode-btn-simple"
                                    data-answer="${item.name}"
                                    style="padding: 12px 8px; text-align: center; font-size: 13px;"
                                    ${this.earTrainingAnswered ? 'disabled' : ''}
                                    title="${item.tip || ''}">
                                <div style="font-weight: 600;">${item.name}</div>
                            </button>
                        `).join('');
                        break;

                    case 'melodic':
                        questions = MusicTheory.earTraining.melodicPatterns[this.earTrainingLevel];
                        questionText = '¿Qué melodía escuchaste?';
                        tipMessage = 'Escucha la dirección (sube/baja) y el tamaño de los saltos.';
                        panel.innerHTML = questions.map(item => `
                            <button class="mode-btn-simple"
                                    data-answer="${item.name}"
                                    style="padding: 12px 8px; text-align: center; font-size: 13px;"
                                    ${this.earTrainingAnswered ? 'disabled' : ''}
                                    title="${item.tip || ''}">
                                <div style="font-weight: 600;">${item.name}</div>
                            </button>
                        `).join('');
                        break;

                    case 'rhythmic':
                        questions = MusicTheory.earTraining.rhythmicPatterns[this.earTrainingLevel];
                        questionText = '¿Qué ritmo escuchaste?';
                        tipMessage = 'Escucha el patrón de golpes y silencios.';
                        panel.innerHTML = questions.map(item => `
                            <button class="mode-btn-simple"
                                    data-answer="${item.name}"
                                    style="padding: 12px 8px; text-align: center; font-size: 13px;"
                                    ${this.earTrainingAnswered ? 'disabled' : ''}
                                    title="${item.tip || ''}">
                                <div style="font-weight: 600;">${item.name}</div>
                            </button>
                        `).join('');
                        break;
                }

                if (questionLabel) questionLabel.textContent = questionText;
                if (tipText) tipText.textContent = tipMessage;
            },

            playCurrentInterval() {
                if (!this.earTrainingCurrent) return;

                const randomRoot = Math.floor(Math.random() * 12);

                switch (this.earExerciseType) {
                    case 'intervals':
                        AudioEngine.playInterval(randomRoot, this.earTrainingCurrent.semitones, 'ascending', 0.6, 4);
                        break;

                    case 'chords':
                        AudioEngine.playChordQuality(randomRoot, this.earTrainingCurrent.intervals);
                        break;

                    case 'progressions':
                        AudioEngine.playProgressionEarTraining(this.earTrainingCurrent.pattern, randomRoot);
                        break;

                    case 'melodic':
                        this.earTrainingCurrent.notes.forEach((note, i) => {
                            setTimeout(() => {
                                AudioEngine.playNote((randomRoot + note) % 12, 0.4, 4);
                            }, i * 400);
                        });
                        break;

                    case 'rhythmic':
                        AudioEngine.playRhythmPattern(this.earTrainingCurrent.hits);
                        break;
                }
            },

            checkEarTrainingAnswer(answer) {
                if (this.earTrainingAnswered) return;

                this.earTrainingAnswered = true;
                let correct = false;
                let correctAnswer = '';

                switch (this.earExerciseType) {
                    case 'intervals':
                        correct = answer === this.earTrainingCurrent.semitones;
                        correctAnswer = this.earTrainingCurrent.name;
                        break;
                    case 'chords':
                    case 'progressions':
                    case 'melodic':
                    case 'rhythmic':
                        correct = answer === this.earTrainingCurrent.name;
                        correctAnswer = this.earTrainingCurrent.name;
                        break;
                }

                if (correct) {
                    this.earTrainingScore += 10;
                    this.earTrainingStreak++;
                    if (this.earTrainingStreak > this.earTrainingBest) {
                        this.earTrainingBest = this.earTrainingStreak;
                    }

                    this.updateDisplay(
                        `¡CORRECTO! ${correctAnswer}`,
                        `Puntuación: ${this.earTrainingScore} | Racha: ${this.earTrainingStreak} | Mejor: ${this.earTrainingBest}`
                    );
                } else {
                    this.earTrainingStreak = 0;
                    this.updateDisplay(
                        `Incorrecto. Era: ${correctAnswer}`,
                        `Puntuación: ${this.earTrainingScore} | Racha: ${this.earTrainingStreak} | Mejor: ${this.earTrainingBest}`
                    );
                }

                // Auto-advance después de 1.5s
                setTimeout(() => {
                    this.showEarTraining();
                }, 1500);
            },

            // ========== NIVEL 16 - CHORD LAB ==========

            showChordLab() {
                this.resetState();
                this.updateDisplay('Chord Laboratory', 'Explore chord voicings and relationships');

                ChordLabState.currentMode = 'explorer';
                ChordLabState.currentRoot = this.currentRoot || 'C';
                ChordLabState.currentQuality = 'maj';
                ChordLabState.filterRegister = 'all';
                ChordLabState.filterDifficulty = 'all';
                ChordLabState.comparisonA = null;
                ChordLabState.comparisonB = null;

                this.showChordLabMode();
            },

            // ========== NIVEL 15 - JAM SESSION ==========

            showJamSession() {
                this.resetState();

                if (!this.currentBackingTrack) {
                    this.currentBackingTrack = MusicTheory.backingTracks[0];
                }

                const track = this.currentBackingTrack;
                const bpm = this.customBPM || track.bpm;

                this.renderJamTrackGrid();
                const rootName = MusicTheory.getNoteName(this.currentRoot);
                this.renderJamSessionPanel(track, rootName, bpm);
                this.renderJamFretboard();
            },

            renderJamFretboard() {
                const jamFretboard = document.getElementById('jamFretboard');
                if (!jamFretboard) {
                    console.error('[Jam Session] jamFretboard container not found');
                    return;
                }

                jamFretboard.innerHTML = '';
                Fretboard.render('jamFretboard');

                requestAnimationFrame(() => {
                    const track = this.currentBackingTrack;
                    if (track) {
                        Fretboard.showScale(this.currentRoot, track.scale);
                    }
                });
            },

            renderJamTrackGrid() {
                const grid = document.getElementById('jamTrackGrid');
                if (!grid) {
                    console.error('[Jam Session] jamTrackGrid container not found');
                    return;
                }

                grid.innerHTML = MusicTheory.backingTracks.map(track => {
                    const isActive = this.currentBackingTrack && this.currentBackingTrack.id === track.id;
                    return `
                        <button class="jam-track-item ${isActive ? 'active' : ''}" data-track="${track.id}">
                            <span class="track-name">${track.name}</span>
                            <span class="track-bpm">${track.bpm}</span>
                        </button>
                    `;
                }).join('');
            },

            renderJamSessionPanel(track, rootName, bpm) {
                const keyDisplay = document.getElementById('jamKeyDisplay');
                const progDisplay = document.getElementById('jamProgressionDisplay');
                const bpmDisplay = document.getElementById('jamBpmDisplay');
                const bpmSlider = document.getElementById('bpmSlider');

                if (!keyDisplay || !progDisplay) {
                    console.error('[Jam Session] Key display or progression display not found');
                    return;
                }

                // Actualizar KEY DISPLAY
                const scaleName = this.SCALE_NAMES[track.scale] || 'Mayor';
                keyDisplay.textContent = `${rootName} ${scaleName}`.toUpperCase();

                if (bpmDisplay) {
                    bpmDisplay.textContent = bpm;
                    bpmDisplay.style.cssText = 'color: #dc2626 !important; font-size: 14px !important; font-weight: 600 !important; display: inline-block !important; min-width: 40px !important; text-align: center !important; opacity: 1 !important; visibility: visible !important;';
                }
                if (bpmSlider) {
                    bpmSlider.value = bpm;
                }

                // Actualizar PROGRESSION DISPLAY con animación
                if (progDisplay) {
                    const chords = track.progression.map((symbol, idx) => {
                        const chordName = `${rootName}${symbol}`;
                        return `
                            <span class="prog-chord" data-chord-idx="${idx}">${chordName}</span>
                            ${idx < track.progression.length - 1 ? '<span class="prog-separator">→</span>' : ''}
                        `;
                    }).join('');
                    progDisplay.innerHTML = chords;
                }
            },

            playBackingTrack() {
                // Primero detener cualquier track que esté corriendo
                if (this.backingTrackPlaying) {
                    this.stopBackingTrack();
                }

                const track = this.currentBackingTrack;
                const bpm = this.syncMetronomeWithBacking ? this.globalBPM : (this.customBPM || track.bpm);
                this.backingTrackPlaying = true;

                // Resetear contadores
                this.jamCurrentBar = 0;
                this.jamLoopCount = 0;
                this.jamCurrentBeat = 0;

                // Mostrar panel de progreso
                const progressDisplay = document.getElementById('jamProgressDisplay');
                if (progressDisplay) {
                    progressDisplay.classList.add('active');
                }

                // Callback para actualizar progreso visual
                const progressCallback = (data) => {
                    if (data.bar !== undefined) {
                        this.jamCurrentBar = data.bar;
                        this.jamLoopCount = data.loopCount || 0;
                        this.updateJamProgress();
                    }
                    if (data.beat !== undefined) {
                        this.jamCurrentBeat = data.beat;
                        this.updateBeatIndicator(data.beat);
                    }
                };

                // Iniciar secuenciador con o sin batería
                if (this.drumsEnabled) {
                    this.backingTrackIntervals = AudioEngine.playChordSequenceWithDrums(
                        track.progression,
                        bpm,
                        this.currentRoot,
                        track.feel.toLowerCase(),
                        progressCallback
                    );
                } else {
                    this.backingTrackIntervals = {
                        chords: AudioEngine.playChordSequence(
                            track.progression,
                            bpm,
                            this.currentRoot
                        ),
                        drums: null,
                        currentBar: 0
                    };
                }

                const playBtn = document.getElementById('playTrackBtn');
                if (playBtn) playBtn.disabled = true;
                const stopBtn = document.getElementById('stopTrackBtn');
                if (stopBtn) stopBtn.disabled = false;
            },

            updateJamProgress() {
                const track = this.currentBackingTrack;
                if (!track) return;

                const rootName = MusicTheory.getNoteName(this.currentRoot);
                const currentChordSymbol = track.progression[this.jamCurrentBar];
                const chordName = `${rootName}${currentChordSymbol}`;

                // Actualizar nombre del acorde
                const chordNameEl = document.getElementById('currentChordName');
                if (chordNameEl) chordNameEl.textContent = chordName;

                // Función armónica (simple)
                const chordFunction = currentChordSymbol.includes('I') ? 'Tónica' :
                                     currentChordSymbol.includes('IV') ? 'Subdominante' :
                                     currentChordSymbol.includes('V') ? 'Dominante' : 'Acorde';
                const functionEl = document.getElementById('currentChordFunction');
                if (functionEl) functionEl.textContent = `${chordFunction}`;

                // Resaltar acorde activo en PROGRESSION BAR
                document.querySelectorAll('.prog-chord').forEach((chord, idx) => {
                    chord.classList.toggle('active', idx === this.jamCurrentBar);
                });

                // Actualizar compás
                const barDisplay = document.getElementById('currentBarDisplay');
                if (barDisplay) {
                    barDisplay.textContent = `${this.jamCurrentBar + 1}/${track.progression.length}`;
                }

                // Actualizar contador de loops
                const loopDisplay = document.getElementById('loopCountDisplay');
                if (loopDisplay) {
                    loopDisplay.textContent = this.jamLoopCount + 1;
                }

                // Barra de progreso
                const progressBar = document.getElementById('jamProgressBar');
                if (progressBar) {
                    const percentage = ((this.jamCurrentBar + 1) / track.progression.length) * 100;
                    progressBar.style.width = `${percentage}%`;
                }
            },

            updateBeatIndicator(beat) {
                document.querySelectorAll('.beat-pip').forEach((pip, idx) => {
                    pip.classList.toggle('active', idx === beat);
                });
            },

            async stopBackingTrack() {
                if (!this.backingTrackPlaying) return;

                // Fade out suave antes de detener
                if (AudioEngine.masterGain) {
                    const currentGain = AudioEngine.masterGain.gain.value;
                    const currentTime = AudioEngine.audioContext.currentTime;

                    AudioEngine.masterGain.gain.setValueAtTime(currentGain, currentTime);
                    AudioEngine.masterGain.gain.linearRampToValueAtTime(0.01, currentTime + 0.2);

                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                if (this.backingTrackIntervals) {
                    if (this.backingTrackIntervals.chords) {
                        clearInterval(this.backingTrackIntervals.chords);
                    }
                    if (this.backingTrackIntervals.drums) {
                        clearInterval(this.backingTrackIntervals.drums);
                    }
                }

                this.backingTrackPlaying = false;
                this.backingTrackIntervals = null;

                // Ocultar panel de progreso
                const progressDisplay = document.getElementById('jamProgressDisplay');
                if (progressDisplay) {
                    progressDisplay.classList.remove('active');
                }

                // Restaurar volumen
                if (AudioEngine.masterGain) {
                    const currentTime = AudioEngine.audioContext.currentTime;
                    AudioEngine.masterGain.gain.setValueAtTime(0.01, currentTime);
                    AudioEngine.masterGain.gain.linearRampToValueAtTime(0.5, currentTime + 0.2);
                }

                const playBtn = document.getElementById('playTrackBtn');
                if (playBtn) playBtn.disabled = false;
                const stopBtn = document.getElementById('stopTrackBtn');
                if (stopBtn) stopBtn.disabled = true;
            },

            async changeBackingTrackBPM(newBPM) {
                if (!this.backingTrackPlaying) {
                    this.customBPM = newBPM;
                    return;
                }

                // Fade out gradual
                if (AudioEngine.masterGain) {
                    const currentGain = AudioEngine.masterGain.gain.value;
                    const currentTime = AudioEngine.audioContext.currentTime;

                    AudioEngine.masterGain.gain.setValueAtTime(currentGain, currentTime);
                    AudioEngine.masterGain.gain.linearRampToValueAtTime(0.01, currentTime + 0.2);

                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                // Cambiar BPM y reiniciar
                await this.stopBackingTrack();
                this.customBPM = newBPM;
                this.playBackingTrack();

                // Fade in gradual
                if (AudioEngine.masterGain) {
                    const currentTime = AudioEngine.audioContext.currentTime;
                    AudioEngine.masterGain.gain.setValueAtTime(0.01, currentTime);
                    AudioEngine.masterGain.gain.linearRampToValueAtTime(0.5, currentTime + 0.2);
                }
            },

            // ========================================
            // CHORD LAB METHODS
            // ========================================

            showChordLabMode() {
                // Hide all modes
                document.querySelectorAll('.chord-lab-mode').forEach(mode => {
                    mode.classList.add('hidden');
                });

                // Show selected mode
                const modeId = `chord-lab-${ChordLabState.currentMode}`;
                const modeEl = document.getElementById(modeId);
                if (modeEl) {
                    modeEl.classList.remove('hidden');
                }

                // Execute mode-specific logic
                switch(ChordLabState.currentMode) {
                    case 'explorer':
                        this.renderChordLabVoicings();
                        break;
                    case 'progression-builder':
                        this.showProgressionBuilder();
                        break;
                    case 'chord-builder':
                        this.initChordBuilder();
                        break;
                    case 'practice':
                        // Practice area starts hidden
                        break;
                }
            },

            renderChordLabVoicings() {
                const grid = document.getElementById('chord-lab-voicings-grid');
                if (!grid) return;

                grid.innerHTML = '';

                // Get all voicings for current root and quality
                const voicings = this.getFilteredVoicings();

                if (voicings.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center text-void-400 py-8">No voicings found for this combination</div>';
                    return;
                }

                voicings.forEach(voicing => {
                    const card = this.createVoicingCard(voicing);
                    grid.appendChild(card);
                });

                // Update fretboard with first voicing
                if (voicings.length > 0) {
                    this.displayChordLabVoicing(voicings[0]);
                }
            },

            getFilteredVoicings() {
                const voicings = [];
                const qualityMap = {
                    'maj': ['C_shape_major', 'A_shape_major', 'A_shape_major_high', 'G_shape_major', 'E_shape_major_barre', 'D_shape_major'],
                    'min': ['Am_shape', 'Em_shape', 'E_shape_minor_barre', 'Dm_shape'],
                    '7': ['E_shape_dom7'],
                    'maj7': ['E_shape_maj7', 'A_shape_maj7', 'D_shape_maj7'],
                    'm7': ['A_shape_m7', 'G_shape_m7'],
                    '9': ['C9', 'Cmaj9'],
                    '11': ['C11'],
                    '13': ['Cmaj13']
                };

                const keys = qualityMap[ChordLabState.currentQuality] || [];

                keys.forEach(key => {
                    const voicing = MusicTheory.chordLabVoicings[key];
                    if (!voicing) return;

                    voicings.push({ key, ...voicing });
                });

                return voicings;
            },

            createVoicingCard(voicing) {
                const card = document.createElement('div');
                card.className = 'chord-lab-voicing-card';
                card.dataset.voicingKey = voicing.key;

                // Check if selected for comparison
                if (ChordLabState.comparisonA === voicing.key) {
                    card.classList.add('compare-a');
                } else if (ChordLabState.comparisonB === voicing.key) {
                    card.classList.add('compare-b');
                }

                const chordSymbol = this.getChordSymbol(ChordLabState.currentRoot, ChordLabState.currentQuality);

                card.innerHTML = `
                    <div class="chord-lab-voicing-header">
                        <div>
                            <div class="chord-lab-voicing-title">${voicing.name}</div>
                            <div class="chord-lab-voicing-subtitle">${chordSymbol}</div>
                        </div>
                        <button class="chord-lab-play-btn" data-voicing-key="${voicing.key}">▶</button>
                    </div>
                    <div class="mt-3 chord-diagram-container"></div>
                    <div class="chord-lab-metadata">
                        <div class="chord-lab-metadata-row">
                            <span class="chord-lab-metadata-label">Register:</span>
                            <span class="chord-lab-metadata-value">${voicing.register}</span>
                        </div>
                        <div class="chord-lab-metadata-row">
                            <span class="chord-lab-metadata-label">Difficulty:</span>
                            <span class="chord-lab-metadata-value">${voicing.difficulty}/10</span>
                        </div>
                        <div class="chord-lab-difficulty-bar">
                            <div class="chord-lab-difficulty-fill" style="width: ${voicing.difficulty * 10}%"></div>
                        </div>
                        <div class="chord-lab-metadata-row">
                            <span class="chord-lab-metadata-label">Best for:</span>
                            <span class="chord-lab-metadata-value">${voicing.bestFor.join(', ')}</span>
                        </div>
                        <div class="chord-lab-metadata-row">
                            <span class="chord-lab-metadata-label">Use:</span>
                            <span class="chord-lab-metadata-value text-sm">${voicing.commonUse}</span>
                        </div>
                    </div>
                `;

                // Insert chord diagram after creating the structure
                const diagramContainer = card.querySelector('.chord-diagram-container');
                if (diagramContainer) {
                    const diagram = this.renderMiniChordDiagram(voicing);
                    diagramContainer.appendChild(diagram);
                }

                // Click on card to show on fretboard
                card.addEventListener('click', (e) => {
                    if (e.target.classList.contains('chord-lab-play-btn')) return;

                    // Shift+click for A/B comparison
                    if (e.shiftKey) {
                        this.toggleComparisonVoicing(voicing.key);
                    } else {
                        this.displayChordLabVoicing(voicing);
                        this.showChordStory(voicing);
                        document.querySelectorAll('.chord-lab-voicing-card').forEach(c => c.classList.remove('selected'));
                        card.classList.add('selected');
                    }
                });

                // Play button
                card.querySelector('.chord-lab-play-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playChordLabVoicing(voicing);
                });

                return card;
            },

            renderMiniChordDiagram(voicing) {
                // Use the same ChordDiagram component as the rest of the app
                const rootName = ChordLabState.currentRoot || 'C';
                const chordName = this.getChordSymbol(rootName, ChordLabState.currentQuality);

                // Calculate position (transpose from base voicing to current root)
                const baseNote = MusicTheory.notes.indexOf('C'); // Voicings are in C by default
                const rootNote = MusicTheory.notes.indexOf(rootName);
                const position = (rootNote - baseNote + 12) % 12;

                // Create the diagram using ChordDiagram.create
                const diagram = ChordDiagram.create(voicing, chordName, position);

                // Remove any scaling - diagram is now properly contained
                diagram.style.transform = 'none';

                // Return the DOM element
                return diagram;
            },

            getChordSymbol(root, quality) {
                const qualitySymbols = {
                    'maj': '',
                    'min': 'm',
                    '7': '7',
                    'maj7': 'maj7',
                    'm7': 'm7',
                    '9': '9',
                    '11': '11',
                    '13': '13'
                };
                return root + (qualitySymbols[quality] || '');
            },

            displayChordLabVoicing(voicing) {
                // Use Chord Lab integrated fretboard if available
                const chordLabFretboard = document.getElementById('fretboard-chord-lab');
                const targetContainer = chordLabFretboard || document.getElementById('fretboard');

                // Initialize Chord Lab fretboard if needed
                if (chordLabFretboard && chordLabFretboard.children.length === 0) {
                    // Clone the main fretboard structure
                    const mainFretboard = document.getElementById('fretboard');
                    if (mainFretboard) {
                        chordLabFretboard.innerHTML = mainFretboard.innerHTML;
                    }
                }

                // Calculate positions from frets
                const root = ChordLabState.currentRoot;
                const rootIndex = MusicTheory.notes.indexOf(root);
                const positions = [];
                voicing.frets.forEach((fret, logicalString) => {
                    if (fret === -1) return;
                    // Voicing convention: frets[0] = E grave (low), frets[5] = e aguda (high)
                    // Standard tuning from low to high: E2(40), A2(45), D3(50), G3(55), B3(59), e4(64)
                    const openStringMidi = [40, 45, 50, 55, 59, 64]; // Low to high (matches voicing array)
                    const midiNote = openStringMidi[logicalString] + fret;
                    const noteIndex = midiNote % 12;

                    // Map to visual string index for fretboard rendering
                    // Fretboard HTML: children[0] = e aguda, children[5] = E grave
                    // So: visualString = 5 - logicalString
                    const visualString = 5 - logicalString;

                    positions.push({
                        string: visualString,  // Visual position in HTML
                        fret: fret,
                        isRoot: noteIndex === rootIndex
                    });
                });

                // Render on target fretboard
                this.renderVoicingOnFretboard(targetContainer, positions, rootIndex);
            },

            renderVoicingOnFretboard(container, positions, rootIndex) {
                if (!container) return;

                // Clear previous markers
                container.querySelectorAll('.note-marker').forEach(m => m.remove());

                const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

                // Add new markers
                positions.forEach(pos => {
                    // pos.string is already converted to visual index in displayChordLabVoicing
                    // Fretboard HTML: children[0] = e aguda (top), children[5] = E grave (bottom)
                    const stringEl = container.children[pos.string];
                    if (!stringEl) return;

                    const fretEl = stringEl.children[pos.fret];
                    if (!fretEl) return;

                    // Calculate note name from fretboard tuning
                    const openStringNotes = [4, 11, 7, 2, 9, 4]; // E B G D A E (high to low, visual order)
                    const noteIndex = (openStringNotes[pos.string] + pos.fret) % 12;
                    const noteName = noteNames[noteIndex];

                    const marker = document.createElement('div');
                    marker.className = `note-marker ${pos.isRoot ? 'root-note' : 'scale-note'}`;
                    marker.textContent = noteName;

                    // Style like original fretboard
                    marker.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 11px;
                        font-weight: bold;
                        z-index: 10;
                        ${pos.isRoot
                            ? 'background: #dc2626; color: #fafafa; border: 2px solid #b91c1c;'
                            : 'background: rgba(226, 232, 240, 0.9); color: #1e293b; border: 2px solid rgba(203, 213, 225, 0.8);'}
                    `;

                    fretEl.appendChild(marker);
                });
            },

            playChordLabVoicing(voicing) {
                if (!voicing || !voicing.frets) {
                    console.error('Invalid voicing:', voicing);
                    App.showToast('Error: voicing inválido', 'error');
                    return;
                }

                // STOP any currently playing audio first
                AudioEngine.stopAllNotes();

                try {
                    AudioEngine.playChordVoicing(voicing);
                } catch (e) {
                    console.error('Audio error:', e);
                    App.showToast('Error de audio', 'error');
                }
            },

            showChordStory(voicing) {
                const panel = document.getElementById('chord-story-panel');
                const content = document.getElementById('chord-story-content');

                if (!panel || !content || !voicing) {
                    if (panel) panel.classList.add('hidden');
                    return;
                }

                // Generar contenido didáctico
                const brightness = voicing.brightness > 6 ? 'Brillante y abierto' :
                                  voicing.brightness > 3 ? 'Balanceado' : 'Oscuro y denso';

                const register = voicing.register === 'low' ? 'Grave (profundo, potente)' :
                                voicing.register === 'mid' ? 'Medio (versátil)' :
                                'Agudo (brillante, cortante)';

                content.innerHTML = `
                    <div class="flex justify-between">
                        <span class="text-void-400">Carácter sonoro:</span>
                        <span class="text-chalk-200">${brightness}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Registro:</span>
                        <span class="text-chalk-200">${register}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Tensión:</span>
                        <span class="text-chalk-200">${voicing.tension}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Mejor para:</span>
                        <span class="text-chalk-200">${voicing.bestFor.join(', ')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Géneros típicos:</span>
                        <span class="text-chalk-200">${voicing.genres.join(', ')}</span>
                    </div>
                    <div class="pt-2 border-t border-sage-700 mt-2">
                        <strong>💡 Uso común:</strong><br>
                        <span class="text-void-300 italic">"${voicing.commonUse}"</span>
                    </div>
                    ${this.generateDidacticTip(voicing)}
                `;

                panel.classList.remove('hidden');
            },

            generateDidacticTip(voicing) {
                let tip = '';

                if (voicing.movable) {
                    tip = 'Esta forma es movible - puedes trasladarla a cualquier traste para cambiar de tono.';
                } else if (voicing.register === 'low' && voicing.brightness > 7) {
                    tip = 'Sonido completo y resonante, ideal para acompañamiento base.';
                } else if (voicing.register === 'high') {
                    tip = 'Posición aguda que se "corta" en la mezcla - perfecta para solos o melodías.';
                } else if (voicing.tension === 'high') {
                    tip = 'Acorde tenso que busca resolver - úsalo para crear anticipación.';
                }

                return tip ? `
                    <div class="pt-2 border-t border-sage-700 mt-2">
                        <strong>🎯 Tip didáctico:</strong><br>
                        <span class="text-void-300">${tip}</span>
                    </div>
                ` : '';
            },

            toggleComparisonVoicing(key) {
                if (ChordLabState.comparisonA === key) {
                    ChordLabState.comparisonA = null;
                } else if (ChordLabState.comparisonB === key) {
                    ChordLabState.comparisonB = null;
                } else if (!ChordLabState.comparisonA) {
                    ChordLabState.comparisonA = key;
                } else if (!ChordLabState.comparisonB) {
                    ChordLabState.comparisonB = key;
                } else {
                    // Replace A
                    ChordLabState.comparisonA = key;
                }

                this.updateComparisonPanel();
                this.renderChordLabVoicings();
            },

            updateComparisonPanel() {
                const panel = document.getElementById('chord-lab-comparison');
                if (!panel) return;

                if (ChordLabState.comparisonA || ChordLabState.comparisonB) {
                    panel.classList.remove('hidden');

                    const divA = document.getElementById('chord-lab-compare-a');
                    const divB = document.getElementById('chord-lab-compare-b');

                    if (ChordLabState.comparisonA) {
                        const voicing = MusicTheory.chordLabVoicings[ChordLabState.comparisonA];
                        divA.innerHTML = this.renderComparisonVoicing(voicing, ChordLabState.comparisonA, 'A');
                        const diagramContainerA = divA.querySelector('.chord-diagram-container');
                        if (diagramContainerA) {
                            const diagramA = this.renderMiniChordDiagram(voicing);
                            diagramContainerA.appendChild(diagramA);
                        }
                    } else {
                        divA.innerHTML = '<div class="text-void-400 text-center py-8">Click card with Shift to select A</div>';
                    }

                    if (ChordLabState.comparisonB) {
                        const voicing = MusicTheory.chordLabVoicings[ChordLabState.comparisonB];
                        divB.innerHTML = this.renderComparisonVoicing(voicing, ChordLabState.comparisonB, 'B');
                        const diagramContainerB = divB.querySelector('.chord-diagram-container');
                        if (diagramContainerB) {
                            const diagramB = this.renderMiniChordDiagram(voicing);
                            diagramContainerB.appendChild(diagramB);
                        }
                    } else {
                        divB.innerHTML = '<div class="text-void-400 text-center py-8">Click card with Shift to select B</div>';
                    }

                    // Show didactic comparison if both are selected
                    if (ChordLabState.comparisonA && ChordLabState.comparisonB) {
                        this.showDidacticComparison();
                    }
                } else {
                    panel.classList.add('hidden');
                }
            },

            renderComparisonVoicing(voicing, key, label) {
                const color = label === 'A' ? '#3b82f6' : '#f59e0b';
                const chordSymbol = this.getChordSymbol(ChordLabState.currentRoot, ChordLabState.currentQuality);

                return `
                    <div class="text-center">
                        <div class="text-lg font-medium mb-2" style="color: ${color}">${label}: ${voicing.name}</div>
                        <div class="text-sm text-void-400 mb-3">${chordSymbol}</div>
                        <div class="chord-diagram-container"></div>
                        <div class="mt-3 space-y-2 text-sm text-left px-4">
                            <div class="flex justify-between">
                                <span class="text-void-400">Dificultad:</span>
                                <span class="text-chalk-100">${voicing.difficulty}/10</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-void-400">Registro:</span>
                                <span class="text-chalk-100">${voicing.register}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-void-400">Brillo:</span>
                                <span class="text-chalk-100">${voicing.brightness}/10</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-void-400">Tensión:</span>
                                <span class="text-chalk-100">${voicing.tension}</span>
                            </div>
                            <div class="mt-3 pt-2 border-t border-void-600">
                                <div class="text-void-400 text-xs mb-1">Mejor para:</div>
                                <div class="text-chalk-100 text-xs">${voicing.bestFor.join(', ')}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-void-400 text-xs mb-1">Cuándo usar:</div>
                                <div class="text-chalk-100 text-xs italic">"${voicing.commonUse}"</div>
                            </div>
                        </div>
                    </div>
                `;
            },

            showDidacticComparison() {
                const panel = document.getElementById('chord-lab-comparison');
                if (!panel) return;

                const voicingA = MusicTheory.chordLabVoicings[ChordLabState.comparisonA];
                const voicingB = MusicTheory.chordLabVoicings[ChordLabState.comparisonB];

                // Check if there's a predefined comparison
                const compKey1 = `${ChordLabState.comparisonA}_vs_${ChordLabState.comparisonB}`;
                const compKey2 = `${ChordLabState.comparisonB}_vs_${ChordLabState.comparisonA}`;
                const comparison = MusicTheory.voicingComparisons[compKey1] || MusicTheory.voicingComparisons[compKey2];

                let analysisHTML = '';
                if (comparison) {
                    // Use predefined comparison
                    analysisHTML = `
                        <div class="mt-6 p-4 bg-sage-900/20 border border-sage-600 rounded-lg">
                            <h4 class="text-lg font-medium text-sage-400 mb-3">📚 Análisis Didáctico</h4>
                            <div class="space-y-3 text-sm">
                                <div>
                                    <strong class="text-chalk-100">Diferencia de sonido:</strong>
                                    <p class="text-void-300 mt-1">${comparison.soundDifference}</p>
                                </div>
                                <div>
                                    <strong class="text-chalk-100">Diferencia de registro:</strong>
                                    <p class="text-void-300 mt-1">${comparison.registerDifference}</p>
                                </div>
                                <div>
                                    <strong class="text-chalk-100">Voice Leading:</strong>
                                    <p class="text-void-300 mt-1">${comparison.voiceLeading}</p>
                                </div>
                                <div class="pt-3 border-t border-sage-700">
                                    <strong class="text-sage-400">💡 Ejercicio de práctica:</strong>
                                    <p class="text-chalk-200 mt-1 italic">${comparison.practiceExercise}</p>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Generate intelligent automatic comparison
                    const diffBrightness = Math.abs(voicingA.brightness - voicingB.brightness);
                    const diffDifficulty = Math.abs(voicingA.difficulty - voicingB.difficulty);

                    // Detect comparison context
                    const bothOpen = !voicingA.movable && !voicingB.movable;
                    const openVsBarre = (!voicingA.movable && voicingB.movable) || (voicingA.movable && !voicingB.movable);
                    const sameGenres = voicingA.genres.some(g => voicingB.genres.includes(g));
                    const tensionDiff = voicingA.tension !== voicingB.tension;

                    let brightnessText = '';
                    if (diffBrightness > 2) {
                        const brighter = voicingA.brightness > voicingB.brightness ? voicingA.name : voicingB.name;
                        const darker = voicingA.brightness < voicingB.brightness ? voicingA.name : voicingB.name;
                        brightnessText = `${brighter} suena más brillante y cortante - mejor para destacar en la mezcla. ${darker} es más oscura y cálida - mejor para crear profundidad.`;
                    } else {
                        brightnessText = 'Ambas tienen un brillo similar. La diferencia estará en otros aspectos como registro o tensión.';
                    }

                    let registerText = '';
                    if (voicingA.register !== voicingB.register) {
                        registerText = `${voicingA.name} (${voicingA.register}) vs ${voicingB.name} (${voicingB.register}).
                                       Diferentes registros = diferentes roles en una canción. Bajo para fundamento, alto para highlights.`;
                    } else {
                        registerText = `Ambas en registro ${voicingA.register} - buenas candidatas para alternar en una progresión sin saltos dramáticos.`;
                    }

                    let difficultyText = '';
                    if (diffDifficulty > 3) {
                        const easier = voicingA.difficulty < voicingB.difficulty ? voicingA.name : voicingB.name;
                        const harder = voicingA.difficulty > voicingB.difficulty ? voicingA.name : voicingB.name;
                        difficultyText = `${easier} es significativamente más fácil (dificultad ${Math.min(voicingA.difficulty, voicingB.difficulty)}/10).
                                         Si eres principiante, empieza con ${easier}. ${harder} requiere más práctica (dificultad ${Math.max(voicingA.difficulty, voicingB.difficulty)}/10).`;
                    } else {
                        difficultyText = `Dificultad similar (${voicingA.difficulty} vs ${voicingB.difficulty}) - puedes intercambiarlas libremente.`;
                    }

                    // Context-aware recommendations
                    let contextText = '';
                    if (openVsBarre) {
                        const open = voicingA.movable ? voicingB.name : voicingA.name;
                        const barre = voicingA.movable ? voicingA.name : voicingB.name;
                        contextText = `${open} (open) tiene más resonancia natural. ${barre} (barre) te permite cambiar de tonalidad moviéndola por el diapasón.`;
                    } else if (tensionDiff) {
                        const tense = voicingA.tension === 'high' ? voicingA.name : (voicingB.tension === 'high' ? voicingB.name : null);
                        const relaxed = voicingA.tension === 'low' ? voicingA.name : (voicingB.tension === 'low' ? voicingB.name : null);
                        if (tense && relaxed) {
                            contextText = `${tense} crea tensión (quiere resolver). ${relaxed} es estable (puede reposar).`;
                        }
                    } else if (sameGenres) {
                        const genre = voicingA.genres.find(g => voicingB.genres.includes(g));
                        contextText = `Ambas funcionan bien en ${genre}. La elección depende del mood que busques.`;
                    } else {
                        const genresA = voicingA.genres.slice(0, 2).join(', ');
                        const genresB = voicingB.genres.slice(0, 2).join(', ');
                        contextText = `${voicingA.name} es típica de ${genresA}. ${voicingB.name} de ${genresB}. Diferentes géneros, diferentes vibes.`;
                    }

                    analysisHTML = `
                        <div class="mt-6 p-4 bg-sage-900/20 border border-sage-600 rounded-lg">
                            <h4 class="text-lg font-medium text-sage-400 mb-3">📊 Comparación Automática</h4>
                            <div class="space-y-3 text-sm">
                                <div>
                                    <strong class="text-chalk-100">Brillo/Color:</strong>
                                    <p class="text-void-300 mt-1">${brightnessText}</p>
                                </div>
                                <div>
                                    <strong class="text-chalk-100">Registro:</strong>
                                    <p class="text-void-300 mt-1">${registerText}</p>
                                </div>
                                <div>
                                    <strong class="text-chalk-100">Dificultad:</strong>
                                    <p class="text-void-300 mt-1">${difficultyText}</p>
                                </div>
                                <div>
                                    <strong class="text-chalk-100">Contexto Musical:</strong>
                                    <p class="text-void-300 mt-1">${contextText}</p>
                                </div>
                                <div class="pt-3 border-t border-sage-700">
                                    <strong class="text-sage-400">💡 Recomendación:</strong>
                                    <p class="text-chalk-200 mt-1">Toca una progresión simple (I-IV-V) con cada voicing.
                                    Escucha cómo cambia el carácter de la canción. Ese es el verdadero aprendizaje.</p>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // Insert analysis before the buttons
                const existingAnalysis = panel.querySelector('.didactic-comparison-analysis');
                if (existingAnalysis) {
                    existingAnalysis.remove();
                }

                const buttons = panel.querySelector('.mt-4.flex.gap-3');
                if (buttons) {
                    const analysisDiv = document.createElement('div');
                    analysisDiv.className = 'didactic-comparison-analysis';
                    analysisDiv.innerHTML = analysisHTML;
                    buttons.parentNode.insertBefore(analysisDiv, buttons);
                }
            },

            playChordLabComparison() {
                if (!ChordLabState.comparisonA || !ChordLabState.comparisonB) return;

                const voicingA = MusicTheory.chordLabVoicings[ChordLabState.comparisonA];
                const voicingB = MusicTheory.chordLabVoicings[ChordLabState.comparisonB];

                this.playChordLabVoicing(voicingA);
                setTimeout(() => {
                    this.playChordLabVoicing(voicingB);
                }, 1000);
            },

            clearChordLabComparison() {
                ChordLabState.comparisonA = null;
                ChordLabState.comparisonB = null;
                this.updateComparisonPanel();
                this.renderChordLabVoicings();
            },

            startChordLabExercise(exercise) {
                const area = document.getElementById('chord-lab-practice-area');
                if (!area) return;

                area.classList.remove('hidden');

                switch(exercise) {
                    case 'shape-shifting':
                        this.loadShapeShiftingExercise(area);
                        break;
                    case 'position-trainer':
                        this.loadPositionTrainerExercise(area);
                        break;
                    case 'progression-voicings':
                        this.loadProgressionVoicingsExercise(area);
                        break;
                }
            },

            loadShapeShiftingExercise(area) {
                // Select 3 random voicings of current chord quality
                const voicings = this.getFilteredVoicings();
                const selected = [];

                // Try to get different registers if possible
                const byRegister = {low: [], mid: [], high: []};
                voicings.forEach(v => {
                    if (byRegister[v.register]) {
                        byRegister[v.register].push(v);
                    }
                });

                // Pick one from each register if possible
                if (byRegister.low.length > 0) selected.push(byRegister.low[0]);
                if (byRegister.mid.length > 0) selected.push(byRegister.mid[0]);
                if (byRegister.high.length > 0) selected.push(byRegister.high[0]);

                // If we don't have 3, fill with random
                while (selected.length < 3 && voicings.length > selected.length) {
                    const v = voicings[Math.floor(Math.random() * voicings.length)];
                    if (!selected.includes(v)) selected.push(v);
                }

                const chord = this.getChordSymbol(ChordLabState.currentRoot, ChordLabState.currentQuality);

                area.innerHTML = `
                    <h3 class="text-lg font-medium text-sage-400 mb-3">🎯 Shape Shifting: Mismo Acorde, Diferentes Posiciones</h3>
                    <div class="p-3 bg-blue-900/20 border border-blue-700 rounded mb-4">
                        <p class="text-sm text-chalk-200">
                            <strong>Objetivo:</strong> Aprende a tocar el mismo acorde en diferentes partes del diapasón.
                            Cada posición tiene un sonido y "feeling" único. Practica transicionar entre ellas de forma fluida.
                        </p>
                    </div>
                    <div class="text-center mb-4">
                        <div class="text-3xl font-bold text-sage-400 mb-2">${chord}</div>
                        <div class="text-void-400">Toca este acorde en 3 posiciones diferentes</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        ${selected.map((v, idx) => `
                            <div class="p-4 bg-void-800 border border-void-600 rounded-lg hover:border-sage-500 transition-all" data-voicing-idx="${idx}">
                                <div class="text-center mb-3">
                                    <div class="text-lg font-medium text-chalk-100">${v.name}</div>
                                    <div class="text-xs text-void-400 mb-2">Registro ${v.register}</div>
                                </div>
                                <div class="mb-3 chord-diagram-container"></div>
                                <div class="space-y-2 text-xs">
                                    <div class="flex justify-between">
                                        <span class="text-void-400">Sonido:</span>
                                        <span class="text-chalk-200">${v.register === 'low' ? 'Profundo' : v.register === 'mid' ? 'Balanceado' : 'Brillante'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-void-400">Dificultad:</span>
                                        <span class="text-chalk-200">${v.difficulty}/10</span>
                                    </div>
                                    <div class="mt-2">
                                        <button onclick="App.playAndShowVoicing('${v.key}')"
                                                class="w-full px-3 py-1.5 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded text-sm">
                                            ▶ Escuchar y ver
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-t border-void-600 text-xs text-void-300 italic">
                                    "${v.commonUse}"
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-6 p-4 bg-sage-900/20 border border-sage-700 rounded">
                        <h4 class="text-sm font-medium text-sage-400 mb-2">📝 Ejercicio Guiado:</h4>
                        <ol class="space-y-2 text-sm text-void-300">
                            <li>1. Escucha cada posición individualmente - nota cómo cambia el carácter</li>
                            <li>2. Toca la progresión ${chord} en posición 1 → 2 → 3 → 2 → 1</li>
                            <li>3. ¿Cuál te suena más "abierta"? ¿Cuál más "densa"?</li>
                            <li>4. Practica cambiar entre cualquier par de posiciones hasta que sea fluido</li>
                        </ol>
                    </div>
                    <div class="mt-4 flex gap-3">
                        <button onclick="App.playShapeShiftingSequence()"
                                class="flex-1 px-4 py-2 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded">
                            ▶ Tocar secuencia completa
                        </button>
                        <button onclick="App.loadShapeShiftingExercise(document.getElementById('chord-lab-practice-area'))"
                                class="px-4 py-2 bg-void-700 hover:bg-void-600 text-chalk-100 rounded">
                            🔄 Nuevo ejercicio
                        </button>
                    </div>
                `;

                // Insert chord diagrams after creating the structure
                selected.forEach((v, idx) => {
                    const card = area.querySelector(`[data-voicing-idx="${idx}"]`);
                    if (card) {
                        const container = card.querySelector('.chord-diagram-container');
                        if (container) {
                            const diagram = this.renderMiniChordDiagram(v);
                            container.appendChild(diagram);
                        }
                    }
                });

                // Store selected for playback
                ChordLabState.currentExerciseVoicings = selected;
            },

            loadPositionTrainerExercise(area) {
                area.innerHTML = `
                    <h3 class="text-lg font-medium text-sage-400 mb-3">🎓 Position Trainer: Sound Journeys</h3>
                    <div class="p-3 bg-blue-900/20 border border-blue-700 rounded mb-4">
                        <p class="text-sm text-chalk-200">
                            <strong>Concepto:</strong> Aprende cómo el mismo acorde "viaja" sonoramente cuando lo mueves
                            por el diapasón. Desde graves profundos hasta agudos brillantes.
                        </p>
                    </div>

                    ${Object.keys(MusicTheory.soundJourneys).map(journeyKey => {
                        const journey = MusicTheory.soundJourneys[journeyKey];
                        return `
                            <div class="mb-6 p-4 bg-void-800 border border-void-600 rounded-lg">
                                <h4 class="text-lg font-medium text-chalk-100 mb-2">${journey.title}</h4>
                                <p class="text-sm text-void-300 mb-4">${journey.explanation}</p>

                                <div class="space-y-3">
                                    ${journey.steps.map((step, idx) => `
                                        <div class="p-3 bg-void-900 rounded border-l-4"
                                             style="border-color: ${['#ef4444', '#eab308', '#84cc16'][idx]}">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="font-medium text-chalk-100">Paso ${idx + 1}</span>
                                                <button onclick="App.playJourneyStep('${journeyKey}', ${idx})"
                                                        class="px-3 py-1 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded text-sm">
                                                    ▶ Escuchar
                                                </button>
                                            </div>
                                            <div class="text-sm text-void-300">${step.description}</div>
                                            <div class="mt-2 text-xs italic text-void-400">
                                                Sensación: ${step.feeling || step.emotion}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="mt-4 p-3 bg-sage-900/20 border border-sage-700 rounded">
                                    <strong class="text-sage-400 text-sm">💡 Ejercicio:</strong>
                                    <p class="text-chalk-200 text-sm mt-1">${journey.exercise}</p>
                                    <p class="text-void-400 text-xs mt-2 italic">Ejemplo real: ${journey.realExample}</p>
                                </div>

                                <div class="mt-3 text-center">
                                    <button onclick="App.playSoundJourney('${journeyKey}')"
                                            class="px-6 py-2 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded-lg font-medium">
                                        🎵 Reproducir Journey Completo
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                `;
            },

            loadProgressionVoicingsExercise(area) {
                area.innerHTML = `
                    <h3 class="text-lg font-medium text-sage-400 mb-3">🎵 Progression Voicings: Casos Prácticos</h3>
                    <div class="p-3 bg-blue-900/20 border border-blue-700 rounded mb-4">
                        <p class="text-sm text-chalk-200">
                            <strong>¿Qué forma usar cuándo?</strong> Aprende qué voicing elegir según el contexto musical.
                            Cada escenario tiene voicings "correctas" que los profesionales usan.
                        </p>
                    </div>

                    ${Object.keys(MusicTheory.practicalScenarios).map(scenarioKey => {
                        const scenario = MusicTheory.practicalScenarios[scenarioKey];
                        return `
                            <div class="mb-6 p-4 bg-void-800 border border-void-600 rounded-lg">
                                <h4 class="text-lg font-medium text-chalk-100 mb-2">
                                    ${scenario.title}
                                </h4>
                                <div class="text-sm text-void-300 mb-4 italic">
                                    Situación: "${scenario.situation}"
                                </div>

                                <div class="space-y-3 mb-4">
                                    <div class="text-sm font-medium text-sage-400">Opciones:</div>
                                    ${scenario.options.map((option, idx) => `
                                        <div class="p-3 bg-void-900 rounded">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="font-medium text-chalk-100">Opción ${idx + 1}</span>
                                                ${option.voicing ? `
                                                    <button onclick="App.playScenarioVoicing('${option.voicing || option.progression}')"
                                                            class="px-3 py-1 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded text-sm">
                                                        ▶ Escuchar
                                                    </button>
                                                ` : ''}
                                            </div>
                                            ${option.voicing ? `
                                                <div class="text-sm text-chalk-200 mb-1">Usar: <strong>${option.voicing}</strong></div>
                                            ` : `
                                                <div class="text-sm text-chalk-200 mb-1">${option.progression}</div>
                                            `}
                                            <div class="text-sm text-void-300 mb-2">Por qué: ${option.why}</div>
                                            <div class="text-xs text-void-400 italic">Ejemplo: ${option.example}</div>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="p-3 bg-sage-900/20 border border-sage-700 rounded">
                                    <strong class="text-sage-400 text-sm">💡 Recomendación:</strong>
                                    <p class="text-chalk-200 text-sm mt-1">${scenario.recommendation}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                `;
            },

            // Helper methods for practice exercises
            playAndShowVoicing(key) {
                const voicing = MusicTheory.chordLabVoicings[key];
                if (!voicing) return;

                this.displayChordLabVoicing(voicing);
                this.playChordLabVoicing(voicing);
                this.showToast(`Mostrando: ${voicing.name}`, 'info');
            },

            playShapeShiftingSequence() {
                const voicings = ChordLabState.currentExerciseVoicings || [];
                if (voicings.length === 0) return;

                let delay = 0;
                // Play 1 → 2 → 3 → 2 → 1
                const sequence = [0, 1, 2, 1, 0];

                sequence.forEach((idx, seqIdx) => {
                    if (voicings[idx]) {
                        setTimeout(() => {
                            this.displayChordLabVoicing(voicings[idx]);
                            this.playChordLabVoicing(voicings[idx]);
                            this.showToast(`Posición ${idx + 1}: ${voicings[idx].name}`, 'info');
                        }, delay);
                        delay += 1500;
                    }
                });
            },

            playJourneyStep(journeyKey, stepIdx) {
                const journey = MusicTheory.soundJourneys[journeyKey];
                if (!journey) return;

                const step = journey.steps[stepIdx];
                if (!step) return;

                const voicing = MusicTheory.chordLabVoicings[step.voicing];
                if (!voicing) return;

                this.displayChordLabVoicing(voicing);
                this.playChordLabVoicing(voicing);
                this.showToast(`${journey.title} - Paso ${stepIdx + 1}`, 'info');
            },

            playSoundJourney(journeyKey) {
                const journey = MusicTheory.soundJourneys[journeyKey];

                if (!journey) {
                    this.showToast('Journey no encontrado', 'error');
                    return;
                }

                let stepIdx = 0;

                const playStep = () => {
                    if (stepIdx >= journey.steps.length) {
                        this.showToast(`✅ ${journey.title} completado`, 'success');
                        return;
                    }

                    const step = journey.steps[stepIdx];
                    const voicing = MusicTheory.chordLabVoicings[step.voicing];

                    if (!voicing) {
                        console.warn(`Voicing ${step.voicing} no encontrado`);
                        stepIdx++;
                        setTimeout(playStep, 100);
                        return;
                    }

                    // Reproducir
                    this.playChordLabVoicing(voicing);
                    this.displayChordLabVoicing(voicing);

                    // Mostrar descripción como toast largo
                    this.showToast(
                        `Paso ${stepIdx + 1}/${journey.steps.length}: ${step.description}`,
                        'info',
                        3000
                    );

                    stepIdx++;
                    setTimeout(playStep, 3500);
                };

                this.showToast(`🎵 ${journey.title}`, 'info', 2000);
                setTimeout(playStep, 2000);
            },

            playScenarioVoicing(voicingKey) {
                const voicing = MusicTheory.chordLabVoicings[voicingKey];
                if (!voicing) return;

                this.displayChordLabVoicing(voicing);
                this.playChordLabVoicing(voicing);
            },

            // === PROGRESSION BUILDER METHODS ===

            showProgressionBuilder() {
                // Initial render - show/hide appropriate sections
                this.updateProgressionUI();

                // Initialize sub-mode if not set
                if (!ProgressionBuilderState.subMode) {
                    ProgressionBuilderState.subMode = 'guided';
                }

                // Show appropriate sub-mode
                this.showProgressionSubMode(ProgressionBuilderState.subMode);
            },

            showProgressionSubMode(subMode) {
                // Update sub-mode state
                ProgressionBuilderState.subMode = subMode;

                // Update tab buttons
                document.querySelectorAll('.progression-mode-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.submode === subMode);
                });

                // Show/hide content
                document.getElementById('guided-mode-content')?.classList.toggle('hidden', subMode !== 'guided');
                document.getElementById('free-mode-content')?.classList.toggle('hidden', subMode !== 'free');

                // Initialize free mode if switching to it
                if (subMode === 'free') {
                    this.renderFreeModeChordPalette();
                }
            },

            renderFreeModeChordPalette() {
                const palette = document.getElementById('free-mode-palette');
                if (!palette) return;

                const key = document.getElementById('free-mode-key')?.value || 'C';
                const keyIndex = MusicTheory.getNoteIndex(key);

                // FASE 4: Generate diatonic chords plus extensions (organizados y expandidos)
                const chords = [
                    // Basic Triads
                    { interval: 0, quality: 'maj', numeral: 'I' },
                    { interval: 2, quality: 'min', numeral: 'ii' },
                    { interval: 4, quality: 'min', numeral: 'iii' },
                    { interval: 5, quality: 'maj', numeral: 'IV' },
                    { interval: 7, quality: 'maj', numeral: 'V' },
                    { interval: 9, quality: 'min', numeral: 'vi' },
                    { interval: 11, quality: 'dim', numeral: 'vii°' },

                    // Seventh Chords
                    { interval: 0, quality: 'maj7', numeral: 'Imaj7' },
                    { interval: 2, quality: 'm7', numeral: 'iim7' },
                    { interval: 4, quality: 'm7', numeral: 'iiim7' },
                    { interval: 5, quality: 'maj7', numeral: 'IVmaj7' },
                    { interval: 7, quality: '7', numeral: 'V7' },
                    { interval: 9, quality: 'm7', numeral: 'vim7' },
                    { interval: 11, quality: 'm7b5', numeral: 'viim7b5' },

                    // EXPANDIDO: Ninths (más opciones)
                    { interval: 0, quality: 'maj9', numeral: 'Imaj9' },
                    { interval: 2, quality: 'm9', numeral: 'iim9' },
                    { interval: 4, quality: 'm9', numeral: 'iiim9' },
                    { interval: 5, quality: 'maj9', numeral: 'IVmaj9' },
                    { interval: 7, quality: '9', numeral: 'V9' },
                    { interval: 9, quality: 'm9', numeral: 'vim9' },

                    // NUEVO: Elevenths
                    { interval: 2, quality: 'm11', numeral: 'iim11' },
                    { interval: 9, quality: 'm11', numeral: 'vim11' },

                    // EXPANDIDO: Thirteenths
                    { interval: 0, quality: 'maj13', numeral: 'Imaj13' },
                    { interval: 5, quality: 'maj13', numeral: 'IVmaj13' },
                    { interval: 7, quality: '13', numeral: 'V13' },

                    // Suspended
                    { interval: 0, quality: 'sus2', numeral: 'Isus2' },
                    { interval: 0, quality: 'sus4', numeral: 'Isus4' },
                    { interval: 5, quality: 'sus2', numeral: 'IVsus2' },
                    { interval: 5, quality: 'sus4', numeral: 'IVsus4' },
                    { interval: 7, quality: 'sus4', numeral: 'Vsus4' },

                    // Added Tones
                    { interval: 0, quality: 'add9', numeral: 'Iadd9' },
                    { interval: 0, quality: '6', numeral: 'I6' },
                    { interval: 2, quality: 'add9', numeral: 'iiadd9' },
                    { interval: 9, quality: 'add9', numeral: 'viadd9' },

                    // Augmented & Diminished
                    { interval: 0, quality: 'aug', numeral: 'Iaug' },
                    { interval: 5, quality: 'aug', numeral: 'IVaug' }
                ];

                const lastChord = ProgressionBuilderState.progression.length > 0 ?
                    ProgressionBuilderState.progression[ProgressionBuilderState.progression.length - 1] : null;

                palette.innerHTML = chords.map(chordData => {
                    const root = (keyIndex + chordData.interval) % 12;
                    const rootName = MusicTheory.getNoteName(root);
                    const chordSymbol = this.getChordSymbol(rootName, chordData.quality);

                    // Get voicing to extract emotional tags
                    const voicingResult = MusicTheory.getVoicingForChord(rootName, chordData.quality);
                    const emotionalTags = MusicTheory.generateEmotionalTags(
                        chordData.numeral.replace(/[^IViv°]+/g, ''), // Extract function (I, ii, etc)
                        chordData.quality,
                        voicingResult.voicing
                    );

                    // Calculate compatibility if there's a last chord
                    let compatClass = '';
                    let compatScore = null;

                    if (lastChord) {
                        const compat = MusicTheory.calculateCompatibility(
                            lastChord.chord,
                            chordData.numeral,
                            key
                        );
                        compatClass = `compat-${compat.category}`;
                        compatScore = compat.score;
                    }

                    return `
                        <button class="free-mode-chord-btn ${compatClass}"
                                onclick="App.addChordFromFreePalette('${rootName}', '${chordData.quality}')"
                                title="${emotionalTags.slice(0, 3).join(' • ')}">
                            <div class="font-medium">${chordSymbol}</div>
                            <div class="text-xs text-void-400">${chordData.numeral}</div>
                            ${voicingResult.voicing?.extensions?.length > 0 ? `
                                <span class="extension-badge">${voicingResult.voicing.extensions.join(',')}</span>
                            ` : ''}
                            ${compatScore !== null ? `
                                <span class="compat-badge" style="background: ${MusicTheory.calculateCompatibility(lastChord.chord, chordData.numeral, key).color}">
                                    ${compatScore}
                                </span>
                            ` : ''}
                        </button>
                    `;
                }).join('');
            },

            addChordFromFreePalette(chord, quality) {
                this.addChordToProgression(chord, quality);
                // Re-render palette to update compatibility colors
                this.renderFreeModeChordPalette();
            },

            selectInitialChord(chord, quality) {
                // Clear previous progression
                ProgressionBuilderState.progression = [];

                // Get a voicing for this chord
                const voicingKey = this.getVoicingKeyForQuality(chord, quality);
                const voicing = MusicTheory.chordLabVoicings[voicingKey];

                if (!voicing) {
                    this.showToast('No hay voicing disponible para este acorde', 'error');
                    return;
                }

                // Add to progression
                ProgressionBuilderState.progression.push({
                    chord,
                    quality,
                    voicing,
                    voicingKey
                });

                // Update UI
                this.updateProgressionUI();

                // Show emotion selector
                document.getElementById('initial-chord-selector')?.classList.add('hidden');
                document.getElementById('emotion-selector')?.classList.remove('hidden');

                // Play the chord
                this.displayChordLabVoicing(voicing);
                this.playChordLabVoicing(voicing);

                this.showToast(`Acorde inicial: ${chord}${quality === 'maj' ? '' : quality}`, 'info');
            },

            selectEmotion(emotion) {
                ProgressionBuilderState.lastEmotion = emotion;

                // Get last chord in progression
                const lastItem = ProgressionBuilderState.progression[ProgressionBuilderState.progression.length - 1];
                if (!lastItem) return;

                // Get suggestions using new engine
                const key = ProgressionBuilderState.currentKey || 'C';
                const currentChord = {
                    root: lastItem.chord,
                    quality: lastItem.quality,
                    voicing: lastItem.voicing
                };

                const suggestions = MusicTheory.suggestNextChords(currentChord, key, {
                    emotion: emotion
                });

                // Take top 5 suggestions
                const topSuggestions = suggestions.slice(0, 5);

                // Render suggestions
                this.renderChordSuggestions(topSuggestions, emotion);

                // Hide emotion selector temporarily
                document.getElementById('emotion-selector')?.classList.add('hidden');
                document.getElementById('chord-suggestions')?.classList.remove('hidden');
            },

            renderChordSuggestions(suggestions, emotion) {
                const grid = document.getElementById('suggestions-grid');
                if (!grid) return;

                // FASE 4: Enhanced suggestions display with extensions and emotional tags
                grid.innerHTML = suggestions.map(sug => {
                    const chordSymbol = this.getChordSymbol(sug.chord, sug.quality);
                    const compatClass = sug.compatibility.category;
                    const compatColor = sug.compatibility.color;
                    const extensions = sug.voicing?.extensions || [];
                    const emotionalTags = sug.emotionalTags || [];

                    return `
                        <div class="suggestion-card ${compatClass}" style="border-color: ${compatColor}">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <div class="text-2xl font-display text-chalk-100">
                                        ${chordSymbol}
                                        ${extensions.length > 0 ? `
                                            <span class="extension-badge ml-2">${extensions.join(',')}</span>
                                        ` : ''}
                                    </div>
                                    <div class="text-xs text-sage-400">${sug.function}</div>
                                    ${emotionalTags.length > 0 ? `
                                        <div class="emotional-tags mt-1">${emotionalTags.slice(0, 3).join(' • ')}</div>
                                    ` : ''}
                                </div>
                                <div class="text-xs px-2 py-1 rounded" style="background: ${compatColor}22; color: ${compatColor}">
                                    ${sug.compatibility.score}%
                                </div>
                            </div>
                            <p class="text-xs text-void-300 mb-3">${sug.explanation}</p>
                            ${sug.voiceLeading ? `
                                <div class="p-2 bg-void-900/50 rounded text-xs mb-3">
                                    <div class="flex justify-between">
                                        <span>Voice Leading:</span>
                                        <span class="text-sage-400">${sug.voiceLeading.recommendation}</span>
                                    </div>
                                    <div class="text-void-400 text-[10px] mt-1">
                                        ${sug.voiceLeading.description}
                                    </div>
                                </div>
                            ` : ''}
                            <div class="flex gap-2">
                                <button class="ctrl-btn-small flex-1" onclick="App.playChordSuggestion('${sug.chord}', '${sug.quality}')">
                                    ▶
                                </button>
                                <button class="ctrl-btn-small flex-1" onclick="App.addChordToProgression('${sug.chord}', '${sug.quality}')">
                                    + Añadir
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            },

            playChordSuggestion(chord, quality) {
                // FIX: Use MusicTheory.getVoicingForChord() for proper extension support
                const result = MusicTheory.getVoicingForChord(chord, quality);
                if (result && result.voicing) {
                    this.displayChordLabVoicing(result.voicing);
                    this.playChordLabVoicing(result.voicing);
                }
            },

            addChordToProgression(chord, quality) {
                // FIX: Use MusicTheory.getVoicingForChord() directly for proper extension support
                const result = MusicTheory.getVoicingForChord(chord, quality);

                if (!result || !result.voicing) {
                    this.showToast('No hay voicing disponible', 'error');
                    return;
                }

                ProgressionBuilderState.progression.push({
                    chord,
                    quality,
                    voicing: result.voicing,
                    voicingKey: result.key
                });

                // Update UI
                this.updateProgressionUI();

                // Hide suggestions, show emotion selector again
                document.getElementById('chord-suggestions')?.classList.add('hidden');
                document.getElementById('emotion-selector')?.classList.remove('hidden');

                // Play the chord
                this.displayChordLabVoicing(result.voicing);
                this.playChordLabVoicing(result.voicing);

                this.showToast(`Añadido: ${chord}${quality === 'maj' ? '' : quality}`, 'success');
            },

            updateProgressionUI() {
                const chain = document.getElementById('progression-chain');
                if (!chain) return;

                const key = ProgressionBuilderState.currentKey || 'C';

                if (ProgressionBuilderState.progression.length === 0) {
                    chain.innerHTML = '<span class="text-sm text-void-400">Añade acordes para comenzar...</span>';
                    document.getElementById('play-progression')?.setAttribute('disabled', '');
                    document.getElementById('clear-progression')?.setAttribute('disabled', '');
                    document.getElementById('save-progression')?.setAttribute('disabled', '');
                    document.getElementById('transpose-progression')?.setAttribute('disabled', '');
                    document.getElementById('reverse-progression')?.setAttribute('disabled', '');
                    document.getElementById('mutate-progression')?.setAttribute('disabled', '');

                    // Clear analysis panel
                    this.updateAnalysisPanel([]);
                } else {
                    // Render chord chips with function labels
                    chain.innerHTML = ProgressionBuilderState.progression.map((item, idx) => {
                        const func = MusicTheory.getChordFunction(item.chord, key, item.quality);
                        return `
                            <div class="progression-chord-item">
                                <span class="function-label">${func}</span>
                                <span class="chord-name">${item.chord}${item.quality === 'maj' ? '' : item.quality}</span>
                                <span class="remove-btn" onclick="App.removeChordFromProgression(${idx})" title="Eliminar">×</span>
                            </div>
                        `;
                    }).join('→');

                    // Enable controls
                    document.getElementById('play-progression')?.removeAttribute('disabled');
                    document.getElementById('clear-progression')?.removeAttribute('disabled');
                    document.getElementById('save-progression')?.removeAttribute('disabled');
                    document.getElementById('transpose-progression')?.removeAttribute('disabled');
                    document.getElementById('reverse-progression')?.removeAttribute('disabled');
                    document.getElementById('mutate-progression')?.removeAttribute('disabled');

                    // Update analysis
                    this.updateAnalysisPanel(ProgressionBuilderState.progression);

                    // Update voice leading visualization if multiple chords
                    if (ProgressionBuilderState.progression.length >= 2) {
                        this.updateVoiceLeadingViz(ProgressionBuilderState.progression);
                    }
                }
            },

            updateAnalysisPanel(progression) {
                const panel = document.getElementById('analysis-content');
                if (!panel) return;

                if (progression.length === 0) {
                    panel.innerHTML = '<div class="text-void-400">Añade acordes para ver análisis...</div>';
                    document.getElementById('progression-story')?.classList.add('hidden');
                    return;
                }

                const key = ProgressionBuilderState.currentKey || 'C';

                // Calculate functions
                const functions = progression.map(item =>
                    MusicTheory.getChordFunction(item.chord, key, item.quality)
                );

                // Calculate total voice leading movement
                let totalMovement = 0;
                let smoothnessScores = [];
                for (let i = 1; i < progression.length; i++) {
                    const vl = MusicTheory.calculateVoiceLeading(
                        progression[i-1].voicing,
                        progression[i].voicing
                    );
                    if (vl) {
                        totalMovement += vl.movement;
                        smoothnessScores.push(vl.smoothness);
                    }
                }
                const avgSmoothness = smoothnessScores.length > 0 ?
                    smoothnessScores.reduce((a, b) => a + b, 0) / smoothnessScores.length : 0;

                // FASE 4: Build enhanced analysis HTML with extensions and emotional tags
                const chordsAnalysis = progression.map((item, idx) => {
                    const func = functions[idx];
                    const extensions = item.voicing?.extensions || [];
                    const emotionalTags = MusicTheory.generateEmotionalTags(func, item.quality, item.voicing);
                    const chordSymbol = this.getChordSymbol(item.chord, item.quality);

                    return `
                        <div class="chord-analysis-item">
                            <div class="chord-function">${func}</div>
                            <div class="text-chalk-200 font-medium">${chordSymbol}</div>
                            ${extensions.length > 0 ? `
                                <div class="extensions-badge">${extensions.join(', ')}</div>
                            ` : ''}
                            <div class="emotional-tags">${emotionalTags.slice(0, 3).join(' • ')}</div>
                        </div>
                    `;
                }).join('');

                panel.innerHTML = `
                    <div class="space-y-3">
                        <div>
                            <div class="text-void-400 mb-1">Funciones Armónicas</div>
                            <div class="text-chalk-200 font-medium">
                                ${functions.join(' → ')}
                            </div>
                        </div>
                        <div>
                            <div class="text-void-400 mb-1">Análisis Detallado</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem;">
                                ${chordsAnalysis}
                            </div>
                        </div>
                        <div>
                            <div class="text-void-400 mb-1">Tonalidad</div>
                            <div class="text-chalk-200">${key} Mayor</div>
                        </div>
                        ${smoothnessScores.length > 0 ? `
                            <div>
                                <div class="text-void-400 mb-1">Voice Leading</div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 h-2 bg-void-900 rounded overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-sage-600 to-sage-400"
                                             style="width: ${avgSmoothness}%"></div>
                                    </div>
                                    <div class="text-xs text-chalk-200">${avgSmoothness.toFixed(0)}%</div>
                                </div>
                                <div class="text-[10px] text-void-400 mt-1">
                                    Movimiento total: ${totalMovement} semitonos
                                </div>
                            </div>
                        ` : ''}
                        <div>
                            <div class="text-void-400 mb-1">Acordes</div>
                            <div class="text-chalk-200">${progression.length} acordes</div>
                        </div>
                    </div>
                `;

                // Generate and show story
                this.updateProgressionStory(progression, functions);

                // Show voice leading panel if applicable
                if (smoothnessScores.length > 0) {
                    this.updateVoiceLeadingPanel(progression);
                }
            },

            updateProgressionStory(progression, functions) {
                const storyPanel = document.getElementById('progression-story');
                const storyContent = document.getElementById('story-content');
                if (!storyPanel || !storyContent) return;

                if (progression.length < 2) {
                    storyPanel.classList.add('hidden');
                    return;
                }

                // Generate narrative
                let narrative = 'Esta progresión ';

                // Analyze pattern
                if (functions.includes('I') && functions.includes('V')) {
                    narrative += 'establece una fuerte relación tónica-dominante, ';
                }

                if (functions.includes('ii') && functions.includes('V') && functions.includes('I')) {
                    narrative += 'utiliza la cadencia ii-V-I clásica del jazz, ';
                }

                if (functions.filter(f => f.includes('i')).length > functions.length / 2) {
                    narrative += 'tiene un carácter predominantemente menor, ';
                } else {
                    narrative += 'mantiene un carácter mayor, ';
                }

                narrative += 'creando un viaje armónico coherente.';

                storyContent.textContent = narrative;
                storyPanel.classList.remove('hidden');
            },

            updateVoiceLeadingPanel(progression) {
                const panel = document.getElementById('voice-leading-panel');
                const content = document.getElementById('voice-leading-content');
                if (!panel || !content) return;

                const movements = [];
                for (let i = 1; i < progression.length; i++) {
                    const vl = MusicTheory.calculateVoiceLeading(
                        progression[i-1].voicing,
                        progression[i].voicing
                    );
                    if (vl) {
                        const from = this.getChordSymbol(progression[i-1].chord, progression[i-1].quality);
                        const to = this.getChordSymbol(progression[i].chord, progression[i].quality);
                        movements.push({ from, to, vl });
                    }
                }

                if (movements.length === 0) {
                    panel.classList.add('hidden');
                    return;
                }

                content.innerHTML = movements.map(m => `
                    <div class="flex justify-between items-start">
                        <div class="text-chalk-200">${m.from} → ${m.to}</div>
                        <div class="text-${m.vl.recommendation === 'excellent' ? 'green' : m.vl.recommendation === 'good' ? 'amber' : 'red'}-400">
                            ${m.vl.recommendation}
                        </div>
                    </div>
                    <div class="text-void-400 text-[10px]">${m.vl.description}</div>
                `).join('<div class="border-t border-void-700 my-2"></div>');

                panel.classList.remove('hidden');
            },

            updateVoiceLeadingViz(progression) {
                // TODO: Implement SVG visualization of voice movement
                // This would draw lines showing how each note moves between chords
            },

            removeChordFromProgression(index) {
                ProgressionBuilderState.progression.splice(index, 1);
                this.updateProgressionUI();

                // If empty, reset UI
                if (ProgressionBuilderState.progression.length === 0) {
                    document.getElementById('initial-chord-selector')?.classList.remove('hidden');
                    document.getElementById('emotion-selector')?.classList.add('hidden');
                    document.getElementById('chord-suggestions')?.classList.add('hidden');
                }
            },

            clearProgression() {
                ProgressionBuilderState.progression = [];
                this.updateProgressionUI();

                // Reset UI
                document.getElementById('initial-chord-selector')?.classList.remove('hidden');
                document.getElementById('emotion-selector')?.classList.add('hidden');
                document.getElementById('chord-suggestions')?.classList.add('hidden');

                Fretboard.clear();
                this.showToast('Progresión limpiada', 'info');
            },

            playChordLabProgression() {
                if (ProgressionBuilderState.progression.length === 0) return;

                let delay = 0;
                ProgressionBuilderState.progression.forEach((item, idx) => {
                    setTimeout(() => {
                        this.displayChordLabVoicing(item.voicing);
                        this.playChordLabVoicing(item.voicing);
                        this.showToast(`${idx + 1}/${ProgressionBuilderState.progression.length}: ${item.chord}${item.quality === 'maj' ? '' : item.quality}`, 'info');
                    }, delay);
                    delay += 2000;
                });
            },

            saveProgression() {
                const progression = ProgressionBuilderState.progression;
                if (progression.length === 0) return;

                // Create progression data
                const progressionData = {
                    chords: progression.map(item => ({
                        chord: item.chord,
                        quality: item.quality
                    })),
                    key: ProgressionBuilderState.currentKey,
                    timestamp: Date.now()
                };

                // Save to localStorage
                const saved = JSON.parse(localStorage.getItem('savedProgressions') || '[]');
                saved.push(progressionData);
                localStorage.setItem('savedProgressions', JSON.stringify(saved));

                this.showToast('✅ Progresión guardada', 'success');
            },

            showLoadProgressionDialog() {
                const saved = JSON.parse(localStorage.getItem('savedProgressions') || '[]');

                if (saved.length === 0) {
                    this.showToast('No hay progresiones guardadas', 'info');
                    return;
                }

                // Create modal
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
                modal.innerHTML = `
                    <div class="bg-void-900 border border-sage-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <h2 class="text-xl font-bold text-sage-400 mb-4">📂 Progresiones Guardadas</h2>
                        <div class="space-y-2 mb-4">
                            ${saved.map((prog, idx) => {
                                const date = new Date(prog.timestamp).toLocaleString('es-ES', {
                                    dateStyle: 'short',
                                    timeStyle: 'short'
                                });
                                const chordString = prog.chords.map(c =>
                                    `${c.chord}${c.quality === 'maj' ? '' : c.quality}`
                                ).join(' → ');
                                return `
                                    <div class="bg-void-800 border border-void-700 rounded p-3 hover:border-sage-600 transition-colors">
                                        <div class="flex justify-between items-start gap-3">
                                            <div class="flex-1">
                                                <div class="text-sage-400 font-medium mb-1">
                                                    ${prog.key ? `Tonalidad: ${prog.key}` : 'Sin tonalidad'}
                                                </div>
                                                <div class="text-chalk-200 text-sm mb-2">
                                                    ${chordString}
                                                </div>
                                                <div class="text-void-400 text-xs">
                                                    ${date}
                                                </div>
                                            </div>
                                            <div class="flex gap-2">
                                                <button
                                                    class="px-3 py-1 bg-sage-600 hover:bg-sage-500 text-chalk-100 rounded text-sm"
                                                    onclick="App.loadSavedProgression(${idx}); this.closest('.fixed').remove();"
                                                >
                                                    Cargar
                                                </button>
                                                <button
                                                    class="px-3 py-1 bg-red-600 hover:bg-red-500 text-chalk-100 rounded text-sm"
                                                    onclick="App.deleteSavedProgression(${idx}); this.closest('.fixed').remove(); App.showLoadProgressionDialog();"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <button
                            class="w-full px-4 py-2 bg-void-700 hover:bg-void-600 text-chalk-100 rounded"
                            onclick="this.closest('.fixed').remove()"
                        >
                            Cerrar
                        </button>
                    </div>
                `;

                document.body.appendChild(modal);
            },

            loadSavedProgression(index) {
                const saved = JSON.parse(localStorage.getItem('savedProgressions') || '[]');
                const progressionData = saved[index];

                if (!progressionData) {
                    this.showToast('Error al cargar la progresión', 'error');
                    return;
                }

                // Clear current progression
                ProgressionBuilderState.progression = [];

                // Set key
                ProgressionBuilderState.currentKey = progressionData.key || 'C';

                // Load chords
                progressionData.chords.forEach(chordData => {
                    const voicingResult = MusicTheory.getVoicingForChord(chordData.chord, chordData.quality);
                    ProgressionBuilderState.progression.push({
                        chord: chordData.chord,
                        quality: chordData.quality,
                        voicing: voicingResult.voicing,
                        voicingKey: voicingResult.key
                    });
                });

                // Update UI
                this.updateProgressionUI();
                this.showToast('✅ Progresión cargada', 'success');
            },

            deleteSavedProgression(index) {
                const saved = JSON.parse(localStorage.getItem('savedProgressions') || '[]');
                saved.splice(index, 1);
                localStorage.setItem('savedProgressions', JSON.stringify(saved));
                this.showToast('🗑️ Progresión eliminada', 'info');
            },

            transposeProgressionDialog() {
                // Simple prompt for now (could be a modal in future)
                const currentKey = ProgressionBuilderState.currentKey || 'C';
                const newKey = prompt(`Transponer de ${currentKey} a qué tonalidad? (C, D, E, F, G, A, B)`, currentKey);

                if (newKey && newKey !== currentKey) {
                    this.transposeProgressionTo(newKey);
                }
            },

            transposeProgressionTo(newKey) {
                const currentKey = ProgressionBuilderState.currentKey || 'C';
                const progression = ProgressionBuilderState.progression;

                if (progression.length === 0) return;

                // Transpose each chord
                const transposed = MusicTheory.transposeProgression(progression, currentKey, newKey);

                // Update progression with new voicings
                ProgressionBuilderState.progression = transposed.map(item => {
                    const voicingResult = MusicTheory.getVoicingForChord(item.root, item.quality);
                    return {
                        chord: item.root,
                        quality: item.quality,
                        voicing: voicingResult.voicing,
                        voicingKey: voicingResult.key
                    };
                });

                // Update key
                ProgressionBuilderState.currentKey = newKey;

                // Update UI
                this.updateProgressionUI();
                this.showToast(`🔄 Transpuesto a ${newKey}`, 'success');
            },

            reverseProgression() {
                if (ProgressionBuilderState.progression.length === 0) return;

                ProgressionBuilderState.progression.reverse();
                this.updateProgressionUI();
                this.showToast('↩️ Progresión invertida', 'info');
            },

            mutateProgression() {
                const progression = ProgressionBuilderState.progression;
                if (progression.length < 2) {
                    this.showToast('Necesitas al menos 2 acordes para mutar', 'info');
                    return;
                }

                // Random mutation strategies
                const strategies = [
                    'replace_one',   // Replace one random chord
                    'swap_two',      // Swap two random chords
                    'insert_passing' // Insert passing chord
                ];

                const strategy = strategies[Math.floor(Math.random() * strategies.length)];
                const key = ProgressionBuilderState.currentKey || 'C';

                switch (strategy) {
                    case 'replace_one': {
                        const idx = Math.floor(Math.random() * progression.length);
                        const currentChord = progression[idx];

                        // Get suggestions for neighbor
                        const prevChord = idx > 0 ? progression[idx - 1] : null;
                        if (prevChord) {
                            const suggestions = MusicTheory.suggestNextChords(prevChord.chord, key, {});
                            if (suggestions.length > 0) {
                                const newSugg = suggestions[Math.floor(Math.random() * suggestions.length)];
                                const voicingResult = MusicTheory.getVoicingForChord(newSugg.chord, newSugg.quality);
                                progression[idx] = {
                                    chord: newSugg.chord,
                                    quality: newSugg.quality,
                                    voicing: voicingResult.voicing,
                                    voicingKey: voicingResult.key
                                };
                                this.showToast(`🎲 Reemplazado acorde ${idx + 1}`, 'info');
                            }
                        }
                        break;
                    }

                    case 'swap_two': {
                        if (progression.length >= 2) {
                            const idx1 = Math.floor(Math.random() * progression.length);
                            let idx2 = Math.floor(Math.random() * progression.length);
                            while (idx2 === idx1) {
                                idx2 = Math.floor(Math.random() * progression.length);
                            }
                            [progression[idx1], progression[idx2]] = [progression[idx2], progression[idx1]];
                            this.showToast(`🎲 Intercambiados acordes ${idx1 + 1} y ${idx2 + 1}`, 'info');
                        }
                        break;
                    }

                    case 'insert_passing': {
                        if (progression.length >= 2) {
                            const idx = Math.floor(Math.random() * (progression.length - 1));
                            // Simple passing chord logic: chromatic approach
                            const fromChord = progression[idx].chord;
                            const toChord = progression[idx + 1].chord;

                            // TODO: More sophisticated passing chord logic
                            this.showToast('🎲 Mutación experimental', 'info');
                        }
                        break;
                    }
                }

                this.updateProgressionUI();
            },

            // ========================================
            // CHORD BUILDER METHODS
            // ========================================

            initChordBuilder() {
                // Clear state
                ChordBuilderState.selectedNotes = [];
                ChordBuilderState.currentChord = null;

                // Render interactive fretboard
                this.renderChordBuilderFretboard();

                // Load saved voicings from localStorage
                this.loadSavedVoicings();

                // Update display
                this.updateChordBuilderDisplay();
            },

            renderChordBuilderFretboard() {
                const container = document.getElementById('chord-builder-fretboard');
                if (!container) return;

                const openStringNotes = [4, 9, 2, 7, 11, 4]; // E A D G B E
                const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];

                let html = '<div class="space-y-1">';

                // Render each string
                for (let string = 0; string < 6; string++) {
                    html += `<div class="flex items-center gap-1">`;
                    html += `<div class="w-6 text-xs text-void-400">${stringNames[string]}</div>`;

                    // Frets 0-12
                    for (let fret = 0; fret <= 12; fret++) {
                        const noteIndex = (openStringNotes[string] + fret) % 12;
                        const noteName = MusicTheory.getNoteName(noteIndex);
                        const isSelected = ChordBuilderState.selectedNotes.some(n => n.string === string && n.fret === fret);

                        html += `
                            <button class="chord-builder-fret ${isSelected ? 'selected' : ''}"
                                    data-string="${string}" data-fret="${fret}" data-note="${noteName}"
                                    style="width: 32px; height: 32px;">
                                ${fret === 0 ? 'O' : fret}
                            </button>
                        `;
                    }

                    html += `</div>`;
                }

                html += '</div>';
                container.innerHTML = html;

                // Add event listeners
                container.querySelectorAll('.chord-builder-fret').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const string = parseInt(e.currentTarget.dataset.string);
                        const fret = parseInt(e.currentTarget.dataset.fret);
                        const note = e.currentTarget.dataset.note;
                        this.toggleChordBuilderNote(string, fret, note);
                    });
                });
            },

            toggleChordBuilderNote(string, fret, note) {
                const existingIdx = ChordBuilderState.selectedNotes.findIndex(n => n.string === string);

                if (existingIdx >= 0) {
                    // If same fret, remove; otherwise replace
                    if (ChordBuilderState.selectedNotes[existingIdx].fret === fret) {
                        ChordBuilderState.selectedNotes.splice(existingIdx, 1);
                    } else {
                        ChordBuilderState.selectedNotes[existingIdx] = { string, fret, note };
                    }
                } else {
                    // Add new note
                    ChordBuilderState.selectedNotes.push({ string, fret, note });
                }

                // Re-render fretboard
                this.renderChordBuilderFretboard();

                // Identify chord
                this.identifyChordBuilderChord();

                // Update display
                this.updateChordBuilderDisplay();
            },

            identifyChordBuilderChord() {
                const notes = ChordBuilderState.selectedNotes;

                if (notes.length < 2) {
                    ChordBuilderState.currentChord = null;
                    return;
                }

                // Get unique note indices
                const openStringNotes = [4, 9, 2, 7, 11, 4];
                const noteIndices = notes.map(n => (openStringNotes[n.string] + n.fret) % 12);
                const uniqueIndices = [...new Set(noteIndices)].sort((a, b) => a - b);

                // Try to identify chord
                const identified = MusicTheory.identifyChordFromNotes(uniqueIndices);

                ChordBuilderState.currentChord = identified;

                // Generate suggestions
                this.generateChordBuilderSuggestions(notes, identified);
            },

            updateChordBuilderDisplay() {
                const notes = ChordBuilderState.selectedNotes;
                const chord = ChordBuilderState.currentChord;

                // Update name
                const nameEl = document.getElementById('chord-builder-name');
                if (nameEl) {
                    if (chord && chord.root) {
                        nameEl.textContent = `${chord.root}${chord.quality}`;
                    } else if (notes.length >= 2) {
                        nameEl.textContent = '???';
                    } else {
                        nameEl.textContent = '---';
                    }
                }

                // Update notes
                const notesEl = document.getElementById('chord-builder-notes');
                if (notesEl) {
                    if (notes.length > 0) {
                        const noteNames = notes.map(n => n.note).join(', ');
                        notesEl.textContent = noteNames;
                    } else {
                        notesEl.textContent = 'Selecciona notas...';
                    }
                }

                // Update intervals
                const intervalsEl = document.getElementById('chord-builder-intervals');
                if (intervalsEl) {
                    if (chord && chord.intervals) {
                        intervalsEl.textContent = chord.intervals.join(', ');
                    } else {
                        intervalsEl.textContent = '---';
                    }
                }

                // Show/hide analysis
                const analysisPanel = document.getElementById('chord-builder-analysis');
                if (analysisPanel && chord) {
                    this.updateChordBuilderAnalysis(notes, chord);
                    analysisPanel.classList.remove('hidden');
                } else if (analysisPanel) {
                    analysisPanel.classList.add('hidden');
                }
            },

            updateChordBuilderAnalysis(notes, chord) {
                const content = document.getElementById('chord-builder-analysis-content');
                if (!content) return;

                // Calculate voicing properties
                const frets = notes.map(n => n.fret);
                const minFret = Math.min(...frets.filter(f => f > 0));
                const maxFret = Math.max(...frets);
                const span = maxFret - minFret;

                // Estimate difficulty
                let difficulty = 1;
                if (span > 4) difficulty += 3;
                else if (span > 3) difficulty += 2;
                else if (span > 2) difficulty += 1;

                if (notes.length >= 5) difficulty += 1;
                if (notes.length === 6) difficulty += 1;

                // Estimate register
                const avgFret = frets.reduce((a, b) => a + b, 0) / frets.length;
                let register = 'low';
                if (avgFret > 7) register = 'high';
                else if (avgFret > 4) register = 'mid';

                content.innerHTML = `
                    <div class="flex justify-between">
                        <span class="text-void-400">Dificultad:</span>
                        <span class="text-chalk-200">${difficulty}/10</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Registro:</span>
                        <span class="text-chalk-200">${register}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Span:</span>
                        <span class="text-chalk-200">${span} trastes</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-void-400">Cuerdas:</span>
                        <span class="text-chalk-200">${notes.length}</span>
                    </div>
                `;
            },

            generateChordBuilderSuggestions(notes, chord) {
                const panel = document.getElementById('chord-builder-suggestions');
                const content = document.getElementById('chord-builder-suggestions-content');

                if (!panel || !content) return;

                if (!chord || notes.length < 2) {
                    panel.classList.add('hidden');
                    return;
                }

                const suggestions = [];

                // Suggest adding extensions
                if (chord.quality === 'maj' && !chord.intervals.includes('7')) {
                    suggestions.push({
                        action: 'add',
                        note: '7ma',
                        result: 'maj7',
                        message: 'Añade la 7ma mayor para crear maj7'
                    });
                }

                if (chord.quality === 'maj' && !chord.intervals.includes('9')) {
                    suggestions.push({
                        action: 'add',
                        note: '9na',
                        result: 'add9',
                        message: 'Añade la 9na para más color'
                    });
                }

                // Suggest simplifications if too many notes
                if (notes.length > 4) {
                    suggestions.push({
                        action: 'simplify',
                        message: 'Considera usar menos cuerdas para facilitar'
                    });
                }

                if (suggestions.length > 0) {
                    content.innerHTML = suggestions.map(s => `
                        <div class="p-2 bg-void-900 rounded">
                            <div class="text-chalk-200">${s.message}</div>
                            ${s.result ? `<div class="text-sage-400 text-[10px] mt-1">→ ${s.result}</div>` : ''}
                        </div>
                    `).join('');
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            },

            playChordBuilder() {
                const notes = ChordBuilderState.selectedNotes;
                if (notes.length === 0) return;

                // Convert to voicing format
                const frets = new Array(6).fill(-1);
                notes.forEach(n => {
                    frets[n.string] = n.fret;
                });

                const voicing = {
                    frets: frets,
                    name: 'Custom',
                    register: 'mid',
                    difficulty: 5
                };

                this.playChordLabVoicing(voicing);
            },

            clearChordBuilder() {
                ChordBuilderState.selectedNotes = [];
                ChordBuilderState.currentChord = null;
                this.renderChordBuilderFretboard();
                this.updateChordBuilderDisplay();
                document.getElementById('chord-builder-suggestions')?.classList.add('hidden');
            },

            saveChordBuilderVoicing() {
                const notes = ChordBuilderState.selectedNotes;
                const chord = ChordBuilderState.currentChord;

                if (notes.length < 2) {
                    this.showToast('Necesitas al menos 2 notas', 'info');
                    return;
                }

                const name = prompt('Nombre para este voicing:', chord ? `${chord.root}${chord.quality} custom` : 'Custom');
                if (!name) return;

                // Convert to voicing format
                const frets = new Array(6).fill(-1);
                notes.forEach(n => {
                    frets[n.string] = n.fret;
                });

                const voicing = {
                    name: name,
                    frets: frets,
                    chord: chord ? `${chord.root}${chord.quality}` : 'Unknown',
                    timestamp: Date.now()
                };

                ChordBuilderState.savedVoicings.push(voicing);

                // Save to localStorage
                localStorage.setItem('customVoicings', JSON.stringify(ChordBuilderState.savedVoicings));

                // Update library display
                this.updateChordBuilderLibrary();

                this.showToast('✅ Voicing guardado', 'success');
            },

            loadSavedVoicings() {
                const saved = localStorage.getItem('customVoicings');
                if (saved) {
                    try {
                        ChordBuilderState.savedVoicings = JSON.parse(saved);
                        this.updateChordBuilderLibrary();
                    } catch (e) {
                        console.error('Error loading saved voicings:', e);
                    }
                }
            },

            updateChordBuilderLibrary() {
                const library = document.getElementById('chord-builder-library');
                if (!library) return;

                const voicings = ChordBuilderState.savedVoicings;

                if (voicings.length === 0) {
                    library.innerHTML = `
                        <div class="text-xs text-void-400 text-center py-4">
                            Guarda voicings para crear tu biblioteca
                        </div>
                    `;
                    return;
                }

                library.innerHTML = voicings.map((v, idx) => `
                    <div class="flex items-center justify-between p-2 bg-void-900 rounded text-xs">
                        <div>
                            <div class="text-chalk-200 font-medium">${v.name}</div>
                            <div class="text-void-400 text-[10px]">${v.chord}</div>
                        </div>
                        <div class="flex gap-1">
                            <button onclick="App.loadCustomVoicing(${idx})" class="px-2 py-1 bg-sage-600 hover:bg-sage-500 rounded">
                                Load
                            </button>
                            <button onclick="App.deleteCustomVoicing(${idx})" class="px-2 py-1 bg-red-600 hover:bg-red-500 rounded">
                                ×
                            </button>
                        </div>
                    </div>
                `).join('');
            },

            loadCustomVoicing(index) {
                const voicing = ChordBuilderState.savedVoicings[index];
                if (!voicing) return;

                // Clear current
                ChordBuilderState.selectedNotes = [];

                // Load frets
                const openStringNotes = [4, 9, 2, 7, 11, 4];
                voicing.frets.forEach((fret, string) => {
                    if (fret >= 0) {
                        const noteIndex = (openStringNotes[string] + fret) % 12;
                        const noteName = MusicTheory.getNoteName(noteIndex);
                        ChordBuilderState.selectedNotes.push({ string, fret, note: noteName });
                    }
                });

                // Update display
                this.renderChordBuilderFretboard();
                this.identifyChordBuilderChord();
                this.updateChordBuilderDisplay();

                this.showToast(`Cargado: ${voicing.name}`, 'info');
            },

            deleteCustomVoicing(index) {
                if (!confirm('¿Eliminar este voicing?')) return;

                ChordBuilderState.savedVoicings.splice(index, 1);
                localStorage.setItem('customVoicings', JSON.stringify(ChordBuilderState.savedVoicings));
                this.updateChordBuilderLibrary();

                this.showToast('Voicing eliminado', 'info');
            },

            loadFamousVoicing(voicingKey) {
                const voicing = MusicTheory.chordLabVoicings[voicingKey];
                if (!voicing) return;

                // Clear current
                ChordBuilderState.selectedNotes = [];

                // Load frets
                const openStringNotes = [4, 9, 2, 7, 11, 4];
                voicing.frets.forEach((fret, string) => {
                    if (fret >= 0) {
                        const noteIndex = (openStringNotes[string] + fret) % 12;
                        const noteName = MusicTheory.getNoteName(noteIndex);
                        ChordBuilderState.selectedNotes.push({ string, fret, note: noteName });
                    }
                });

                // Update display
                this.renderChordBuilderFretboard();
                this.identifyChordBuilderChord();
                this.updateChordBuilderDisplay();

                this.showToast(`Cargado: ${voicing.name}`, 'info');
            },

            getVoicingKeyForQuality(chord, quality) {
                // FIX: Use MusicTheory.getVoicingForChord() which has proper extension support
                // This ensures D and Dm use different voicings, and 9/13 extensions work
                const result = MusicTheory.getVoicingForChord(chord, quality);

                if (result && result.key) {
                    return result.key;
                }

                // Fallback to old behavior only if MusicTheory fails
                console.warn(`Could not find voicing for ${chord}${quality}, using fallback`);

                const qualityMap = {
                    'maj': ['C_shape_major', 'A_shape_major', 'G_shape_major'],
                    'min': ['Am_shape', 'Em_shape', 'Dm_shape'],
                    'm': ['Am_shape', 'Em_shape', 'Dm_shape'],
                    '7': ['G_shape_dom7', 'C_shape_dom7', 'A_shape_dom7'],
                    'maj7': ['C_shape_maj7', 'A_shape_maj7'],
                    'm7': ['A_shape_m7', 'C_shape_m7'],
                    '9': ['G_shape_dom9', 'E_shape_dom9', 'A_shape_dom9'],
                    'maj9': ['C_shape_maj9', 'E_shape_maj9', 'A_shape_maj9'],
                    'm9': ['E_shape_m9', 'A_shape_m9'],
                    '13': ['G_shape_dom13', 'E_shape_dom13'],
                    'maj13': ['C_shape_maj13', 'E_shape_maj13'],
                    'm11': ['E_shape_m11', 'A_shape_m11']
                };

                const fallbacks = qualityMap[quality] || qualityMap['maj'];
                return fallbacks[0];
            }
        };

