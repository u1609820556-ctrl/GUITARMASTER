import { MusicTheory } from './music-theory.js';

export const AudioEngine = {
            audioContext: null,
            masterGain: null,
            enabled: true,
            sampleBuffers: {}, // Cache de buffers de samples

            init() {
                if (!this.audioContext) {
                    try {
                        const AudioContext = window.AudioContext || window.webkitAudioContext;
                        if (!AudioContext) {
                            throw new Error('Web Audio API no soportada en este navegador');
                        }
                        this.audioContext = new AudioContext();
                        this.masterGain = this.audioContext.createGain();
                        this.masterGain.gain.value = 0.5; // Volumen equilibrado
                        this.masterGain.connect(this.audioContext.destination);
                    } catch (e) {
                        console.error('Error inicializando audio:', e);
                        this.showAudioError(e.message);
                        this.enabled = false;
                    }
                }
            },

            showAudioError(message) {
                const existingBanner = document.querySelector('.audio-error-banner');
                if (existingBanner) return;

                const banner = document.createElement('div');
                banner.className = 'audio-error-banner';
                banner.style.cssText = 'position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #ff5252; color: white; padding: 12px 24px; border-radius: 4px; z-index: 10000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);';
                banner.textContent = '⚠️ Audio no disponible en este navegador';
                document.body.prepend(banner);

                setTimeout(() => {
                    banner.style.opacity = '0';
                    banner.style.transition = 'opacity 0.5s';
                    setTimeout(() => banner.remove(), 500);
                }, 5000);
            },

            // Karplus-Strong OPTIMIZADO - Balance entre calidad y performance
            createGuitarBuffer(frequency, duration) {
                const sampleRate = this.audioContext.sampleRate;
                const maxDuration = Math.min(duration, 2.0);
                const bufferLength = Math.ceil(sampleRate * maxDuration);
                const buffer = this.audioContext.createBuffer(1, bufferLength, sampleRate);
                const data = buffer.getChannelData(0);

                // Calcular periodo
                const period = sampleRate / frequency;
                const delayLength = Math.floor(period);

                if (delayLength < 10 || delayLength > sampleRate / 20) {
                    return this.createFallbackBuffer(frequency, duration);
                }

                // freqRatio: 0 = cuerda grave (E2 ~82Hz), 1 = traste muy agudo (~1200Hz)
                // Rango realista de guitarra: 82Hz (E2 cuerda 6 al aire) a ~1175Hz (E5 traste 24)
                const freqRatio = Math.max(0, Math.min(1, (frequency - 82) / (1175 - 82)));

                // === 1. EXCITACIÓN: más ruido en agudos (ataque brillante), más suave en graves ===
                const noiseAmount = 0.05 + freqRatio * 0.25; // 5% graves → 30% agudos
                const pluckAmplitude = 1.0 - freqRatio * 0.2; // agudos ligeramente menos amplitud
                for (let i = 0; i < delayLength && i < bufferLength; i++) {
                    const t = i / delayLength;
                    const pluckShape = t < 0.5 ? t * 2 : 2 - (t * 2);
                    const noise = (Math.random() * 2 - 1) * noiseAmount;
                    data[i] = (pluckShape + noise) * pluckAmplitude;
                }

                // === 2. PROPAGACIÓN KARPLUS-STRONG con damping realista por frecuencia ===
                // Graves (freqRatio≈0): damping muy bajo → decay largo (~2s)
                // Agudos (freqRatio≈1): damping alto → decay corto (~0.3s)
                // dampingFactor controla cuánta energía se pierde por ciclo:
                //   0.9990 ≈ muy poco damping (graves)
                //   0.9940 ≈ mucho damping (agudos muy altos)
                const dampingFactor = 0.9990 - freqRatio * 0.0050;

                for (let i = delayLength; i < bufferLength; i++) {
                    const idx1 = i - delayLength;
                    const idx2 = i - delayLength - 1;
                    if (idx2 >= 0) {
                        data[i] = ((data[idx1] + data[idx2]) * 0.5) * dampingFactor;
                    } else {
                        data[i] = data[idx1] * dampingFactor;
                    }
                }

                // === 3. ENVELOPE + FADE-OUT ===
                const attackSamples = Math.ceil(sampleRate * 0.001);
                // Agudos decaen más rápido perceptualmente además del damping
                const decayRate = 0.5 + freqRatio * 2.5; // 0.5 graves → 3.0 agudos
                const fadeOutSamples = Math.ceil(sampleRate * 0.05);
                const fadeOutStart = bufferLength - fadeOutSamples;

                for (let i = 0; i < bufferLength; i++) {
                    const t = i / sampleRate;
                    let envelope = i < attackSamples
                        ? i / attackSamples
                        : Math.exp(-t * decayRate);
                    let fadeOut = 1;
                    if (i > fadeOutStart) {
                        const f = (bufferLength - i) / fadeOutSamples;
                        fadeOut = f * f;
                    }
                    data[i] *= envelope * fadeOut * 0.8;
                }

                return buffer;
            },

            // Buffer simple de fallback para frecuencias problemáticas
            createFallbackBuffer(frequency, duration) {
                const sampleRate = this.audioContext.sampleRate;
                const bufferLength = Math.ceil(sampleRate * duration);
                const buffer = this.audioContext.createBuffer(1, bufferLength, sampleRate);
                const data = buffer.getChannelData(0);

                for (let i = 0; i < bufferLength; i++) {
                    const t = i / sampleRate;
                    // Onda triangle simple con decay
                    const phase = (t * frequency) % 1;
                    const triangle = phase < 0.5 ? phase * 4 - 1 : 3 - phase * 4;
                    const envelope = Math.exp(-t * 1.5);
                    data[i] = triangle * envelope * 0.3;
                }

                return buffer;
            },

            // Convierte nota MIDI a frecuencia
            midiToFreq(midiNote) {
                return 440 * Math.pow(2, (midiNote - 69) / 12);
            },

            // Reproduce una nota usando síntesis física Karplus-Strong (optimizado para performance)
            playMidiNote(midiNote, duration = 0.7) {
                if (!this.enabled || !this.audioContext) return;

                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }

                const frequency = this.midiToFreq(midiNote);
                const now = this.audioContext.currentTime;

                try {
                    // Crear buffer de guitarra usando Karplus-Strong avanzado
                    const buffer = this.createGuitarBuffer(frequency, duration);

                    const source = this.audioContext.createBufferSource();
                    source.buffer = buffer;

                    // freqRatio igual al de createGuitarBuffer para coherencia de timbre
                    const freqRatio = Math.max(0, Math.min(1, (frequency - 82) / (1175 - 82)));

                    // 1. Pastilla: resonancia más alta en agudos (brillante), más baja en graves (cálido)
                    const pickupFilter = this.audioContext.createBiquadFilter();
                    pickupFilter.type = 'peaking';
                    pickupFilter.frequency.value = 1800 + freqRatio * 1200; // 1800Hz graves → 3000Hz agudos
                    pickupFilter.Q.value = 1.2;
                    pickupFilter.gain.value = 2 + freqRatio * 2; // +2dB graves → +4dB agudos

                    // 2. Tono: graves más oscuros, agudos más abiertos
                    const toneFilter = this.audioContext.createBiquadFilter();
                    toneFilter.type = 'lowpass';
                    toneFilter.frequency.value = 3500 + freqRatio * 3000; // 3500Hz graves → 6500Hz agudos
                    toneFilter.Q.value = 0.7;

                    // Ganancia por nota: reducida para que acordes de 6 cuerdas no saturen
                    // masterGain=0.3, 6 notas × 0.35 = 2.1 × 0.3 = 0.63 → rango seguro
                    const outputGain = this.audioContext.createGain();
                    const finalGain = 0.32 + freqRatio * 0.06; // 0.32 graves → 0.38 agudos (equilibrio tonal)

                    outputGain.gain.setValueAtTime(0, now);
                    outputGain.gain.linearRampToValueAtTime(finalGain, now + 0.002);

                    source.connect(pickupFilter);
                    pickupFilter.connect(toneFilter);
                    toneFilter.connect(outputGain);
                    outputGain.connect(this.masterGain);

                    source.start(now);

                } catch (error) {
                    console.error('Error al reproducir nota:', error);
                    this.playSimpleNote(frequency, duration, now);
                }
            },

            // Fallback simple por si hay problemas
            playSimpleNote(frequency, duration, startTime) {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'triangle';
                osc.frequency.value = frequency;

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(startTime);
                osc.stop(startTime + duration);
            },

            // Reproduce una nota individual (wrapper con octava)
            playNote(noteIndex, duration = 0.5, octave = 4) {
                const midiNote = 12 * (octave + 1) + noteIndex; // C4 = 60
                this.playMidiNote(midiNote, duration);
            },

            // Reproduce un intervalo (dos notas) - MEJORADO con múltiples modos
            playInterval(rootNote, semitones, mode = 'ascending', duration = 0.6, octave = 4) {
                if (!this.enabled || !this.audioContext) return;

                const rootMidi = 12 * (octave + 1) + rootNote;

                if (mode === 'ascending') {
                    // Ascendente: root -> target
                    const targetMidi = rootMidi + semitones;
                    this.playMidiNote(rootMidi, duration);
                    setTimeout(() => {
                        this.playMidiNote(targetMidi, duration);
                    }, duration * 1000 + 100);
                } else if (mode === 'descending') {
                    // Descendente: root -> target inferior
                    const targetMidi = rootMidi - semitones;
                    this.playMidiNote(rootMidi, duration);
                    setTimeout(() => {
                        this.playMidiNote(targetMidi, duration);
                    }, duration * 1000 + 100);
                } else if (mode === 'harmonic') {
                    // Armónico: ambas notas casi simultáneas
                    const targetMidi = rootMidi + semitones;
                    this.playMidiNote(rootMidi, duration * 1.5);
                    setTimeout(() => {
                        this.playMidiNote(targetMidi, duration * 1.5);
                    }, 20);
                }
            },

            // Reproduce dos intervalos para comparación
            playIntervalComparison(rootNote, interval1, interval2, mode = 'ascending', duration = 0.6, octave = 4) {
                if (!this.enabled || !this.audioContext) return;

                // Reproduce primer intervalo
                this.playInterval(rootNote, interval1, mode, duration, octave);

                // Pausa de 500ms entre intervalos
                const totalDuration = mode === 'harmonic' ? duration * 1500 + 500 : duration * 2000 + 600;

                // Reproduce segundo intervalo
                setTimeout(() => {
                    this.playInterval(rootNote, interval2, mode, duration, octave);
                }, totalDuration);
            },

            // Reproduce un acorde (notas simultáneas con efecto strum)
            playChord(notes, duration = 1.1) {
                if (!this.enabled || !this.audioContext) return;

                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }

                // Limitar a 6 notas (máximo de cuerdas de guitarra)
                const maxNotes = Math.min(notes.length, 6);
                const notesToPlay = notes.slice(0, maxNotes);

                // Strum natural (35ms entre cuerdas) - duración mayor para fade-out completo
                notesToPlay.forEach((noteIndex, i) => {
                    setTimeout(() => {
                        this.playNote(noteIndex % 12, duration * 0.85, 3 + Math.floor(i / 2));
                    }, i * 35);
                });
            },

            // Reproduce una escala ascendente
            playScale(notes, mode = 'ascending', speed = 'medium', octave = 3) {
                if (!this.enabled) return;

                // Mapear speed a tempo
                const tempos = { slow: 600, medium: 400, fast: 250 };
                const tempo = tempos[speed] || 400;

                // Ordenar notas según modo
                let notesToPlay = mode === 'ascending' ? notes : [...notes].reverse();

                // Convertir notas a MIDI manteniendo orden cromático ascendente
                let previousMidi = null;
                const midiNotes = notesToPlay.map((noteObj, i) => {
                    const noteIndex = typeof noteObj === 'object'
                        ? MusicTheory.getNoteIndex(noteObj.note)
                        : noteObj;

                    // Calcular MIDI inicial
                    let currentOctave = octave;
                    let midiNote = 12 * (currentOctave + 1) + noteIndex;

                    // Si hay nota anterior, asegurar que vamos cromáticamente hacia arriba
                    if (previousMidi !== null && mode === 'ascending') {
                        // Si la nota actual es menor que la anterior, subir octava
                        while (midiNote <= previousMidi) {
                            currentOctave++;
                            midiNote = 12 * (currentOctave + 1) + noteIndex;
                        }
                    } else if (previousMidi !== null && mode === 'descending') {
                        // Si estamos descendiendo, asegurar que vamos hacia abajo
                        while (midiNote >= previousMidi) {
                            currentOctave--;
                            midiNote = 12 * (currentOctave + 1) + noteIndex;
                        }
                    }

                    previousMidi = midiNote;
                    return midiNote;
                });

                // Reproducir secuencialmente con MIDI correcto
                midiNotes.forEach((midiNote, i) => {
                    setTimeout(() => {
                        this.playMidiNote(midiNote, 0.3);
                    }, i * tempo);
                });
            },

            playScaleComparison(scale1Notes, scale2Notes, mode, speed) {
                if (!this.enabled) return;

                // Mapear speed a tempo
                const tempos = { slow: 600, medium: 400, fast: 250 };
                const totalDuration = scale1Notes.length * tempos[speed] + 500;

                // Reproduce escala 1
                this.playScale(scale1Notes, mode, speed);

                // Reproduce escala 2 después de pausa
                setTimeout(() => {
                    this.playScale(scale2Notes, mode, speed);
                }, totalDuration);
            },

            // NUEVO: Secuenciador de acordes para Jam Session
            playChordSequence(chordProgression, bpm, rootKey) {
                if (!this.enabled || !this.audioContext) return null;

                const beatDuration = (60 / bpm) * 1000 * 4; // 4 beats por acorde
                let currentBar = 0;

                const intervalId = setInterval(() => {
                    const symbol = chordProgression[currentBar % chordProgression.length];
                    const chordNotes = this.parseChordSymbol(symbol, rootKey);

                    if (chordNotes && chordNotes.length > 0) {
                        this.playChord(chordNotes, 1.5);
                    }

                    currentBar++;
                }, beatDuration);

                return intervalId;
            },

            // NUEVO: Convierte símbolos de acordes (I, V, vi, etc.) a notas MIDI
            parseChordSymbol(symbol, rootKey) {
                const degreeMap = {
                    'I': 0, 'i': 0,
                    'II': 2, 'ii': 2,
                    'III': 4, 'iii': 4,
                    'IV': 5, 'iv': 5,
                    'V': 7, 'v': 7,
                    'VI': 9, 'vi': 9,
                    'VII': 11, 'vii': 11,
                    'bII': 1, 'biii': 3, 'bVI': 8, 'bVII': 10, 'bIII': 3
                };

                // Detectar si es mayor o menor
                const isMinor = symbol.match(/^[ivx]+/) !== null && symbol !== symbol.toUpperCase().replace('b', '');
                const isSeventhChord = symbol.includes('7');

                // Extraer grado romano
                let romanPart = symbol.replace('7', '');
                const degree = degreeMap[romanPart];

                if (degree === undefined) return [];

                const root = (rootKey + degree) % 12;

                // Construir tríada
                const third = isMinor ? 3 : 4;
                const notes = [
                    root,
                    (root + third) % 12,
                    (root + 7) % 12
                ];

                // Añadir 7ª si es acorde de séptima
                if (isSeventhChord) {
                    const seventh = isMinor ? 10 : 10; // 7ª menor para ambos
                    notes.push((root + seventh) % 12);
                }

                return notes;
            },

            // NUEVO: Detener secuenciador
            stopSequence(intervalId) {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            },

            // NUEVO: Sonido de batería simple usando ruido y filtros
            playDrumSound(type) {
                if (!this.enabled || !this.audioContext) return;

                const now = this.audioContext.currentTime;

                if (type === 'kick') {
                    // Bombo: oscilador de baja frecuencia
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();

                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);

                    gain.gain.setValueAtTime(1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

                    osc.connect(gain);
                    gain.connect(this.masterGain);

                    osc.start(now);
                    osc.stop(now + 0.3);
                }
                else if (type === 'snare') {
                    // Tarola: ruido blanco con filtro
                    const bufferSize = this.audioContext.sampleRate * 0.1;
                    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                    const data = buffer.getChannelData(0);

                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }

                    const noise = this.audioContext.createBufferSource();
                    noise.buffer = buffer;

                    const filter = this.audioContext.createBiquadFilter();
                    filter.type = 'highpass';
                    filter.frequency.value = 1000;

                    const gain = this.audioContext.createGain();
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.masterGain);

                    noise.start(now);
                    noise.stop(now + 0.1);
                }
                else if (type === 'hihat') {
                    // Hi-hat: ruido blanco corto con filtro agudo
                    const bufferSize = this.audioContext.sampleRate * 0.03;
                    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                    const data = buffer.getChannelData(0);

                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }

                    const noise = this.audioContext.createBufferSource();
                    noise.buffer = buffer;

                    const filter = this.audioContext.createBiquadFilter();
                    filter.type = 'highpass';
                    filter.frequency.value = 7000;

                    const gain = this.audioContext.createGain();
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.masterGain);

                    noise.start(now);
                    noise.stop(now + 0.03);
                }
            },

            // NUEVO: Obtener patrón de batería según feel
            getDrumPattern(feel, beat) {
                const patterns = {
                    'straight': {
                        kick: [0, 2],
                        snare: [1, 3],
                        hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
                    },
                    'shuffle': {
                        kick: [0, 2],
                        snare: [1, 3],
                        hihat: [0, 0.66, 1.33, 2, 2.66, 3.33]
                    },
                    'syncopated': {
                        kick: [0, 1.5, 2.5],
                        snare: [1, 3],
                        hihat: [0.5, 1, 1.5, 2, 2.5, 3, 3.5]
                    },
                    'ballad': {
                        kick: [0, 2],
                        snare: [1, 3],
                        hihat: [0, 1, 2, 3]
                    },
                    'driving': {
                        kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
                        snare: [1, 3],
                        hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
                    },
                    'aggressive': {
                        kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
                        snare: [1, 3],
                        hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
                    }
                };

                const pattern = patterns[feel.toLowerCase()] || patterns['straight'];
                return {
                    playKick: pattern.kick.includes(beat),
                    playSnare: pattern.snare.includes(beat),
                    playHihat: pattern.hihat.includes(beat)
                };
            },

            // NUEVO: Secuenciador con batería dinámica
            playChordSequenceWithDrums(chordProgression, bpm, rootKey, feel = 'straight', progressCallback = null) {
                if (!this.enabled || !this.audioContext) return null;

                const beatDuration = (60 / bpm) * 1000;
                const barDuration = beatDuration * 4;
                let currentBar = 0;
                let beatCount = 0;

                const intervals = {
                    chords: null,
                    drums: null,
                    currentBar: 0
                };

                // Acordes (cada 4 beats)
                intervals.chords = setInterval(() => {
                    const symbol = chordProgression[currentBar % chordProgression.length];
                    const chordNotes = this.parseChordSymbol(symbol, rootKey);

                    if (chordNotes && chordNotes.length > 0) {
                        this.playChord(chordNotes, 1.2);
                    }

                    intervals.currentBar = currentBar % chordProgression.length;

                    // Callback para actualizar UI
                    if (progressCallback) {
                        progressCallback({
                            bar: currentBar % chordProgression.length,
                            totalBars: chordProgression.length,
                            loopCount: Math.floor(currentBar / chordProgression.length)
                        });
                    }

                    currentBar++;
                }, barDuration);

                // Batería con subdivisiones (8th notes para hi-hat)
                const subdivisionDuration = beatDuration / 2; // 8th notes
                intervals.drums = setInterval(() => {
                    const beat = (beatCount % 8) / 2; // 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5
                    const wholeBeat = Math.floor(beat);

                    const pattern = this.getDrumPattern(feel, beat);

                    if (pattern.playKick) {
                        this.playDrumSound('kick');
                    }
                    if (pattern.playSnare) {
                        this.playDrumSound('snare');
                    }
                    if (pattern.playHihat) {
                        this.playDrumSound('hihat');
                    }

                    // Beat indicator callback (solo en beats enteros)
                    if (beat === wholeBeat && progressCallback) {
                        progressCallback({
                            beat: wholeBeat
                        });
                    }

                    beatCount++;
                }, subdivisionDuration);

                return intervals;
            },

            // Toggle audio on/off
            toggle() {
                this.enabled = !this.enabled;
                return this.enabled;
            },

            // Ajustar volumen master
            setVolume(value) {
                if (this.masterGain) {
                    this.masterGain.gain.value = Math.max(0, Math.min(1, value));
                }
            },

            // NUEVOS MÉTODOS PARA LICK LIBRARY Y EAR TRAINING

            // Reproduce una línea de tablatura con técnicas
            playTabLine(tabs, bpm, loopCount = 1) {
                if (!this.enabled || !this.audioContext) return null;

                const standardTuning = [40, 45, 50, 55, 59, 64]; // E A D G B E en MIDI (low to high)
                const beatDuration = (60 / bpm) * 1000;
                let currentLoop = 0;

                const playLoop = () => {
                    tabs.forEach(tab => {
                        setTimeout(() => {
                            const midiNote = standardTuning[tab.string] + tab.fret;
                            const noteIndex = midiNote % 12;
                            const octave = Math.floor(midiNote / 12);

                            // Duración según técnica
                            let duration = 0.3;
                            if (tab.technique === 'bend' || tab.technique === 'vibrato') {
                                duration = 0.8;
                            } else if (tab.technique === 'palm') {
                                duration = 0.15;
                            }

                            this.playNote(noteIndex, duration, octave);
                        }, tab.time * beatDuration * 4); // 4 beats de referencia
                    });
                };

                // Loop inicial
                playLoop();

                // Loops adicionales si se requieren
                if (loopCount > 1) {
                    const totalDuration = Math.max(...tabs.map(t => t.time)) * beatDuration * 4;
                    const intervalId = setInterval(() => {
                        currentLoop++;
                        if (currentLoop >= loopCount) {
                            clearInterval(intervalId);
                            return;
                        }
                        playLoop();
                    }, totalDuration + 100); // Small pause between loops
                    return intervalId;
                }

                return null;
            },

            // Reproduce un chord quality para ear training
            playChordQuality(rootNote, intervals) {
                if (!this.enabled) return;
                const chordNotes = intervals.map(i => (rootNote + i) % 12);
                this.playChord(chordNotes, 1.5);
            },

            // Reproduce un acorde desde un voicing (posiciones de trastes)
            playChordVoicing(voicing, duration = 1.5) {
                if (!this.enabled || !this.audioContext) return;

                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }

                // Standard tuning: E A D G B E (from low/thick string 6 to high/thin string 1)
                // Array index 0 = low E (string 6), index 5 = high E (string 1)
                const standardTuning = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4 en MIDI
                const midiNotes = [];
                const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                const stringNames = ['E (low)', 'A', 'D', 'G', 'B', 'E (high)'];

                // Convertir frets a notas MIDI completas (manteniendo octava)
                voicing.frets.forEach((fret, stringIndex) => {
                    if (fret >= 0) { // -1 significa cuerda silenciada
                        const midiNote = standardTuning[stringIndex] + fret;
                        midiNotes.push(midiNote);
                    }
                });

                if (midiNotes.length > 0) {
                    this.playChordFromMidi(midiNotes, duration);
                }
            },

            // Reproduce un acorde desde notas MIDI directas (con octava correcta)
            playChordFromMidi(midiNotes, duration = 1.5) {
                if (!this.enabled || !this.audioContext) return;

                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }

                // FIX: Ordenar de grave a agudo para downstroke natural (menor a mayor)
                // a - b = orden ascendente (grave a agudo) = downstroke natural
                const sortedNotes = [...midiNotes].sort((a, b) => a - b);

                // Strum con delay entre cuerdas (35ms)
                sortedNotes.forEach((midiNote, i) => {
                    setTimeout(() => {
                        this.playMidiNote(midiNote, duration);
                    }, i * 35);
                });
            },

            // Stop all currently playing notes
            stopAllNotes() {
                if (!this.audioContext) return;
                // Create a new audio context to kill all nodes
                try {
                    const currentTime = this.audioContext.currentTime;
                    // Simply advance time to stop all scheduled notes
                    this.activeOscillators = this.activeOscillators || [];
                    this.activeOscillators.forEach(osc => {
                        try {
                            osc.stop();
                        } catch(e) {
                            // Already stopped
                        }
                    });
                    this.activeOscillators = [];
                } catch(e) {
                    console.warn('Error stopping notes:', e);
                }
            },

            // Reproduce una progresión para ear training
            playProgressionEarTraining(pattern, rootKey, bpm = 80) {
                if (!this.enabled || !this.audioContext) return null;

                const beatDuration = (60 / bpm) * 1000 * 4;
                let currentIndex = 0;

                const intervalId = setInterval(() => {
                    if (currentIndex >= pattern.length) {
                        clearInterval(intervalId);
                        return;
                    }

                    const symbol = pattern[currentIndex];
                    const chordNotes = this.parseChordSymbol(symbol, rootKey);

                    if (chordNotes && chordNotes.length > 0) {
                        this.playChord(chordNotes, 1.2);
                    }

                    currentIndex++;
                }, beatDuration);

                return intervalId;
            },

            // Reproduce un patrón rítmico
            playRhythmPattern(hits, bpm = 80) {
                if (!this.enabled || !this.audioContext) return;

                const beatDuration = (60 / bpm) * 1000;

                hits.forEach((shouldHit, i) => {
                    if (shouldHit) {
                        setTimeout(() => {
                            // Usa un click/clave simple
                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();

                            osc.connect(gain);
                            gain.connect(this.masterGain);

                            osc.frequency.value = 1200; // High click
                            gain.gain.value = 0.3;

                            osc.start();
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                            osc.stop(this.audioContext.currentTime + 0.05);
                        }, i * (beatDuration / 4)); // 16th notes
                    }
                });
            }
        };
