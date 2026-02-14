export const MusicTheory = {
            // Cache para memoización
            _cache: new Map(),

            // Función auxiliar de memoización
            _memoize(fn, key) {
                if (this._cache.has(key)) {
                    return this._cache.get(key);
                }
                const result = fn.call(this);
                this._cache.set(key, result);
                return result;
            },

            // 12 chromatic notes
            notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],

            // Open string note indices: strings 6→1 (low E, A, D, G, B, high E)
            openStringNotes: [4, 9, 2, 7, 11, 4],

            // Enharmonic equivalents for display
            enharmonics: {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
            },

            // Roman numerals for diatonic degrees
            romanNumerals: {
                major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
                chromatic: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
            },

            // Scale formulas (intervals from root)
            scales: {
                // === ESCALAS MAYORES ===
                major:      [0, 2, 4, 5, 7, 9, 11],  // W-W-H-W-W-W-H (Jónico)

                // === ESCALAS MENORES ===
                minor:      [0, 2, 3, 5, 7, 8, 10],  // W-H-W-W-H-W-W (Menor Natural / Eólico)
                harmonicMinor: [0, 2, 3, 5, 7, 8, 11], // Menor Armónica (7 natural)
                melodicMinor:  [0, 2, 3, 5, 7, 9, 11], // Menor Melódica ascendente
                dorianMinor:   [0, 2, 3, 5, 7, 9, 10], // Menor Dórica (6 natural)

                // === MODOS DE LA ESCALA MAYOR ===
                dorian:     [0, 2, 3, 5, 7, 9, 10],  // II grado - menor con 6 natural
                phrygian:   [0, 1, 3, 5, 7, 8, 10],  // III grado - menor con b2
                lydian:     [0, 2, 4, 6, 7, 9, 11],  // IV grado - mayor con #4
                mixolydian: [0, 2, 4, 5, 7, 9, 10],  // V grado - mayor con b7
                locrian:    [0, 1, 3, 5, 6, 8, 10],  // VII grado - menor con b2 y b5

                // === MODOS DE LA MENOR ARMÓNICA ===
                locrianNat6:    [0, 1, 3, 5, 6, 9, 10],  // II de armónica
                ionianAug:      [0, 2, 4, 5, 8, 9, 11],  // III de armónica (Jónico #5)
                dorianSharp4:   [0, 2, 3, 6, 7, 9, 10],  // IV de armónica (Dórico #4)
                phrygianDom:    [0, 1, 4, 5, 7, 8, 10],  // V de armónica (Frigio Dominante/Español)
                lydianSharp2:   [0, 3, 4, 6, 7, 9, 11],  // VI de armónica
                superLocrian:   [0, 1, 3, 4, 6, 8, 10],  // VII de armónica (Superlocrio bb7)

                // === MODOS DE LA MENOR MELÓDICA ===
                dorianB2:       [0, 1, 3, 5, 7, 9, 10],  // II de melódica (Dórico b2)
                lydianAug:      [0, 2, 4, 6, 8, 9, 11],  // III de melódica (Lidio #5)
                lydianDom:      [0, 2, 4, 6, 7, 9, 10],  // IV de melódica (Lidio b7)
                mixolydianB6:   [0, 2, 4, 5, 7, 8, 10],  // V de melódica (Mixolidio b6)
                locrianNat2:    [0, 2, 3, 5, 6, 8, 10],  // VI de melódica (Locrio nat2)
                alteredScale:   [0, 1, 3, 4, 6, 8, 10],  // VII de melódica (Superlocrio/Alterada)

                // === PENTATÓNICAS ===
                pentatonicMajor: [0, 2, 4, 7, 9],    // Mayor pentatónica
                pentatonicMinor: [0, 3, 5, 7, 10],   // Menor pentatónica
                blues:           [0, 3, 5, 6, 7, 10], // Blues (pent menor + blue note)
                bluesMajor:      [0, 2, 3, 4, 7, 9],  // Blues mayor

                // === ESCALAS SIMÉTRICAS ===
                wholeTone:       [0, 2, 4, 6, 8, 10],    // Tonos enteros (6 notas)
                diminished:      [0, 2, 3, 5, 6, 8, 9, 11], // Disminuida T-S (8 notas)
                diminishedHW:    [0, 1, 3, 4, 6, 7, 9, 10], // Disminuida S-T
                chromatic:       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Cromática

                // === ESCALAS EXÓTICAS ===
                hungarian:       [0, 2, 3, 6, 7, 8, 11],  // Húngara menor (gitana)
                hungarianMajor:  [0, 3, 4, 6, 7, 9, 10],  // Húngara mayor
                byzantine:       [0, 1, 4, 5, 7, 8, 11],  // Bizantina (Doble armónica)
                arabic:          [0, 1, 4, 5, 7, 8, 10],  // Árabe (similar a frigio dom)
                japanese:        [0, 1, 5, 7, 8],         // Japonesa (In Sen)
                hirajoshi:       [0, 2, 3, 7, 8],         // Hirajoshi
                egyptian:        [0, 2, 5, 7, 10],        // Egipcia (pentatónica suspendida)
                prometheus:      [0, 2, 4, 6, 9, 10],     // Prometheus
                neapolitan:      [0, 1, 3, 5, 7, 8, 10],  // Napolitana menor
                neapolitanMajor: [0, 1, 3, 5, 7, 9, 11],  // Napolitana mayor
                enigmatic:       [0, 1, 4, 6, 8, 10, 11], // Enigmática
                persian:         [0, 1, 4, 5, 6, 8, 11],  // Persa
                bebop:           [0, 2, 4, 5, 7, 9, 10, 11], // Bebop dominante (8 notas)
                bebopMajor:      [0, 2, 4, 5, 7, 8, 9, 11],  // Bebop mayor

                // === ESCALAS REGIONALES Y AVANZADAS ===
                bluesHeptatonic: [0, 2, 3, 4, 5, 7, 10],     // Blues heptatónica (pentatónica + 2ª y 6ª)
                ryuKyu:          [0, 4, 5, 7, 11],           // Ryu Kyu (Okinawan) - escala tradicional japonesa
                yo:              [0, 2, 5, 7, 9],            // Yo Scale - pentatónica mayor japonesa
                bhairav:         [0, 1, 4, 5, 7, 8, 11],     // Bhairav Raga - escala india (similar bizantina)
                todi:            [0, 1, 3, 6, 7, 8, 11],     // Todi Raga - escala india melódica
                messiaenMode2:   [0, 1, 3, 4, 6, 7, 9, 10],  // Messiaen Modo 2 (Octatónica)
                messiaenMode3:   [0, 2, 3, 4, 6, 7, 8, 10, 11], // Messiaen Modo 3 (9 notas)
            },

            // Información extendida de cada escala
            scaleInfo: {
                // MAYORES
                major: {
                    name: 'Mayor (Jónico)',
                    category: 'major',
                    emotion: 'La luz del amanecer, el héroe que triunfa. Evoca victorias, finales felices y momentos de pura alegría. Es el hogar sonoro de la música occidental.',
                    formula: 'T-T-S-T-T-T-S',
                    usage: 'Pop, rock, música clásica. Base de la armonía occidental.',
                    chordTypes: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
                    parentScale: null,
                    degree: 1,
                    brightness: 6,
                    characteristicNote: '7M',
                    usageContext: ['Pop comercial', 'Himnos', 'Música infantil', 'Bandas sonoras épicas', 'Country']
                },

                // MENORES
                minor: {
                    name: 'Menor Natural (Eólico)',
                    category: 'minor',
                    emotion: 'La lluvia en la ventana, recuerdos que duelen dulcemente. Ideal para despedidas, reflexiones nocturnas y ese tipo de tristeza que no quieres soltar.',
                    formula: 'T-S-T-T-S-T-T',
                    usage: 'Baladas, rock alternativo, música clásica. Relativa menor de la mayor.',
                    chordTypes: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
                    parentScale: 'major',
                    degree: 6,
                    brightness: 2,
                    characteristicNote: 'b6',
                    usageContext: ['Baladas', 'Rock alternativo', 'Folk melancólico', 'Música clásica', 'Indie']
                },
                harmonicMinor: {
                    name: 'Menor Armónica',
                    category: 'minor',
                    emotion: 'El villano de capa que entra en escena, el castillo en la tormenta. Tensión dramática que exige resolución, como un suspiro antes del beso.',
                    formula: 'T-S-T-T-S-T½-S',
                    usage: 'Música clásica, metal neoclásico, flamenco. El V7 resuelve mejor al Im.',
                    chordTypes: ['min', 'dim', 'aug', 'min', 'maj', 'maj', 'dim'],
                    parentScale: null,
                    degree: 1,
                    brightness: 3,
                    characteristicNote: '7M',
                    usageContext: ['Metal neoclásico', 'Flamenco', 'Música clásica', 'Bandas sonoras de suspenso', 'Tango'],
                    musicalGenres: ['Metal Neoclásico', 'Prog Metal', 'Música Clásica'],
                    famousArtists: ['Yngwie Malmsteen', 'Dream Theater', 'J.S. Bach'],
                    famousSongs: ['Far Beyond the Sun', 'Pull Me Under', 'Toccata y Fuga'],
                    backingTrack: null
                },
                melodicMinor: {
                    name: 'Menor Melódica',
                    category: 'minor',
                    emotion: 'Sofisticación en penumbra, el jazz club a medianoche. Tristeza elegante que camina con tacones altos, melancolía que conoce buenos vinos.',
                    formula: 'T-S-T-T-T-T-S',
                    usage: 'Jazz, fusión. Combina el color menor con la 6ª y 7ª mayores.',
                    chordTypes: ['min', 'min', 'aug', 'maj', 'maj', 'dim', 'dim'],
                    parentScale: null,
                    degree: 1,
                    brightness: 4,
                    characteristicNote: '6M',
                    usageContext: ['Jazz moderno', 'Fusión', 'Neo-soul', 'Música de cine sofisticada', 'Bossa nova']
                },

                // MODOS DE LA MAYOR
                dorian: {
                    name: 'Dórico',
                    category: 'modes',
                    emotion: 'Tristeza que baila, melancolía con groove. Como llorar en la pista de baile o encontrar esperanza en un callejón oscuro.',
                    formula: 'T-S-T-T-T-S-T',
                    usage: 'Jazz, funk, rock. Menor con 6ª natural (más brillante que eólico).',
                    chordTypes: ['min', 'min', 'maj', 'maj', 'min', 'dim', 'maj'],
                    parentScale: 'major',
                    degree: 2,
                    brightness: 3,
                    characteristicNote: '6M',
                    usageContext: ['Funk', 'Jazz modal', 'Soul', 'Rock progresivo', 'Hip-hop melódico']
                },
                phrygian: {
                    name: 'Frigio',
                    category: 'modes',
                    emotion: 'El sol de Andalucía sobre piedras antiguas, el bailaor que clava la mirada. Tensión española, misterio que huele a azahar.',
                    formula: 'S-T-T-T-S-T-T',
                    usage: 'Flamenco, metal, música española. La b2 da el sonido característico.',
                    chordTypes: ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'],
                    parentScale: 'major',
                    degree: 3,
                    brightness: 1,
                    characteristicNote: 'b2',
                    usageContext: ['Flamenco', 'Metal', 'Música mediterránea', 'Ambient oscuro', 'Videojuegos épicos']
                },
                lydian: {
                    name: 'Lidio',
                    category: 'modes',
                    emotion: 'Flotar entre nubes doradas, el asombro de un niño mirando las estrellas. Magia pura, E.T. volando sobre la luna.',
                    formula: 'T-T-T-S-T-T-S',
                    usage: 'Cine (Spielberg), jazz, prog rock. La #4 evita la gravedad del IV.',
                    chordTypes: ['maj', 'maj', 'min', 'dim', 'maj', 'min', 'min'],
                    parentScale: 'major',
                    degree: 4,
                    brightness: 7,
                    characteristicNote: '#4',
                    usageContext: ['Bandas sonoras mágicas', 'Jazz fusión', 'Rock progresivo', 'Dream pop', 'Ambient espacial']
                },
                mixolydian: {
                    name: 'Mixolidio',
                    category: 'modes',
                    emotion: 'La carretera infinita con el sol en la cara, rock and roll en vena. El riff que hace mover la cabeza sin pensar.',
                    formula: 'T-T-S-T-T-S-T',
                    usage: 'Blues, rock, funk. Mayor con b7 (acorde dominante como tónica).',
                    chordTypes: ['maj', 'min', 'dim', 'maj', 'min', 'min', 'maj'],
                    parentScale: 'major',
                    degree: 5,
                    brightness: 5,
                    characteristicNote: 'b7',
                    usageContext: ['Blues rock', 'Country rock', 'Funk', 'Rock clásico', 'Jam bands']
                },
                locrian: {
                    name: 'Locrio',
                    category: 'modes',
                    emotion: 'El suelo que se desmorona, vértigo existencial. Inquietud sin reposo, pesadillas lúcidas y pasillos infinitos.',
                    formula: 'S-T-T-S-T-T-T',
                    usage: 'Metal, jazz (sobre m7b5). La b5 hace imposible una tónica estable.',
                    chordTypes: ['dim', 'maj', 'min', 'min', 'maj', 'maj', 'min'],
                    parentScale: 'major',
                    degree: 7,
                    brightness: 0,
                    characteristicNote: 'b5',
                    usageContext: ['Metal extremo', 'Jazz sobre m7b5', 'Música experimental', 'Horror cinematográfico', 'Djent']
                },

                // MODOS DE LA MENOR ARMÓNICA
                phrygianDom: {
                    name: 'Frigio Dominante',
                    category: 'harmonicMinorModes',
                    emotion: 'El flamenco más puro, pies golpeando tierra sagrada. El desierto al atardecer, noches de Las Mil y Una Noches.',
                    formula: 'S-T½-S-T-S-T-T',
                    usage: 'Flamenco, metal, música árabe. Es el V grado de la menor armónica.',
                    chordTypes: ['maj', 'dim', 'min', 'min', 'maj', 'maj', 'dim'],
                    parentScale: 'harmonicMinor',
                    degree: 5,
                    brightness: 2,
                    characteristicNote: 'b2 + 3M',
                    usageContext: ['Flamenco', 'Metal oriental', 'Música árabe', 'Música judía', 'Fusión mediterránea'],
                    musicalGenres: ['Flamenco', 'Metal Exótico', 'Música Árabe'],
                    famousArtists: ['Paco de Lucía', 'Metallica', 'Gipsy Kings'],
                    famousSongs: ['Entre Dos Aguas', 'Wherever I May Roam', 'Bamboléo'],
                    backingTrack: null
                },

                // MODOS DE LA MENOR MELÓDICA
                lydianDom: {
                    name: 'Lidio Dominante',
                    category: 'melodicMinorModes',
                    emotion: 'Tensión que brilla como neón, el clímax antes de la resolución. Sofisticación que sabe a dry martini.',
                    formula: 'T-T-T-S-T-S-T',
                    usage: 'Jazz (sobre 7#11), fusión. Combina lydian y mixolydian.',
                    chordTypes: ['maj', 'min', 'dim', 'min', 'min', 'maj', 'min'],
                    parentScale: 'melodicMinor',
                    degree: 4,
                    brightness: 6,
                    characteristicNote: '#4 + b7',
                    usageContext: ['Jazz sobre 7#11', 'Fusión', 'Neo-soul avanzado', 'Steely Dan', 'Tritono sustituto']
                },
                alteredScale: {
                    name: 'Alterada (Superlocrio)',
                    category: 'melodicMinorModes',
                    emotion: 'Máxima tensión controlada, el equilibrista sobre el abismo. El grito antes del silencio, la tormenta antes de la calma.',
                    formula: 'S-T-S-T-T-T-T',
                    usage: 'Jazz sobre dominantes alterados (7alt). Todas las tensiones alteradas.',
                    chordTypes: ['dim', 'min', 'min', 'maj', 'maj', 'maj', 'min'],
                    parentScale: 'melodicMinor',
                    degree: 7,
                    brightness: 1,
                    characteristicNote: 'b9 + #9 + b5 + #5',
                    usageContext: ['Jazz bebop', 'Jazz contemporáneo', 'Fusión avanzada', 'Dominantes V7alt', 'Resoluciones dramáticas']
                },

                // PENTATÓNICAS
                pentatonicMajor: {
                    name: 'Pentatónica Mayor',
                    category: 'pentatonic',
                    emotion: 'Praderas infinitas, porches al atardecer y guitarras acústicas. Simplicidad honesta que sabe a limonada casera.',
                    formula: 'T-T-T½-T-T½',
                    usage: 'Country, pop, rock. Sin semitonos = sin tensiones.',
                    parentScale: 'major',
                    degree: 1,
                    brightness: 5,
                    characteristicNote: 'Sin 4 ni 7',
                    usageContext: ['Country', 'Pop', 'Folk americano', 'Rock melódico', 'Música china tradicional']
                },
                pentatonicMinor: {
                    name: 'Pentatónica Menor',
                    category: 'pentatonic',
                    emotion: 'El lenguaje universal del rock, sangre de miles de solos legendarios. Cruda, directa, honesta.',
                    formula: 'T½-T-T-T½-T',
                    usage: 'Rock, blues, pop. La escala más usada en solos.',
                    parentScale: 'minor',
                    degree: 1,
                    brightness: 2,
                    characteristicNote: 'b3 + b7',
                    usageContext: ['Rock', 'Blues', 'Metal', 'Pop rock', 'Prácticamente todo']
                },
                blues: {
                    name: 'Blues',
                    category: 'pentatonic',
                    emotion: 'El lamento del delta, whisky y cigarrillos a las 3AM. Dolor que se convierte en arte.',
                    formula: 'T½-T-S-S-T½-T',
                    usage: 'Blues, rock. Pentatónica menor + blue note (b5).',
                    parentScale: 'pentatonicMinor',
                    degree: 1,
                    specialNotes: { 6: 'blue note (b5)' },
                    brightness: 2,
                    characteristicNote: 'b5 (blue note)',
                    usageContext: ['Blues tradicional', 'Rock blues', 'Jazz blues', 'Soul', 'R&B']
                },

                // SIMÉTRICAS
                wholeTone: {
                    name: 'Tonos Enteros',
                    category: 'symmetric',
                    emotion: 'Caer en un sueño sin fondo, Alicia en el País de las Maravillas. Sin arriba ni abajo, desorientación onírica.',
                    formula: 'T-T-T-T-T-T',
                    usage: 'Impresionismo (Debussy), jazz sobre 7#5. Solo 2 escalas posibles.',
                    chordTypes: null,
                    brightness: 4,
                    characteristicNote: 'Todos T (sin ancla)',
                    usageContext: ['Impresionismo', 'Transiciones oníricas', 'Jazz sobre 7#5', 'Cine surreal', 'Efectos especiales'],
                    musicalGenres: ['Jazz Experimental', 'Impresionismo', 'Avant-garde'],
                    famousArtists: ['Claude Debussy', 'Thelonious Monk', 'Herbie Hancock'],
                    famousSongs: ['Voiles', 'You Are Too Beautiful', 'Maiden Voyage'],
                    backingTrack: null
                },
                diminished: {
                    name: 'Disminuida (T-S)',
                    category: 'symmetric',
                    emotion: 'Escaleras de Escher, persecuciones por callejones de espejos. Tensión que se repite cada tres semitonos.',
                    formula: 'T-S-T-S-T-S-T-S',
                    usage: 'Jazz sobre dim7, líneas cromáticas. Solo 3 escalas posibles.',
                    chordTypes: null,
                    brightness: 3,
                    characteristicNote: 'Simetría cada 3 semitonos',
                    usageContext: ['Jazz sobre dim7', 'Líneas cromáticas', 'Metal técnico', 'Música de suspenso', 'Transiciones'],
                    musicalGenres: ['Jazz Bebop', 'Fusion', 'Metal Técnico'],
                    famousArtists: ['Charlie Parker', 'John Coltrane', 'Allan Holdsworth'],
                    famousSongs: ['Donna Lee', 'Giant Steps', 'Metal Fatigue'],
                    backingTrack: null
                },

                // EXÓTICAS
                hungarian: {
                    name: 'Húngara Menor',
                    category: 'exotic',
                    emotion: 'Violines gitanos junto al fuego, pasión desbordada bajo las estrellas. Liszt cabalgando hacia el horizonte.',
                    formula: 'T-S-T½-S-S-T½-S',
                    usage: 'Música gitana, Liszt, metal neoclásico. Tiene dos aumentadas.',
                    chordTypes: null,
                    brightness: 3,
                    characteristicNote: '#4 + 7M',
                    usageContext: ['Música gitana', 'Clásica romántica', 'Metal neoclásico', 'Folk del este de Europa', 'Bandas sonoras épicas'],
                    musicalGenres: ['Folk Húngaro', 'Metal Sinfónico', 'Música Clásica'],
                    famousArtists: ['Béla Bartók', 'Stratovarius', 'Franz Liszt'],
                    famousSongs: ['Hungarian Rhapsody No. 2', 'Black Diamond', 'Danza Húngara'],
                    backingTrack: null
                },
                byzantine: {
                    name: 'Bizantina (Doble Armónica)',
                    category: 'exotic',
                    emotion: 'Mezquitas al amanecer, el llamado a la oración sobre tejados antiguos. Oriente medio, serpientes y bazares.',
                    formula: 'S-T½-S-T-S-T½-S',
                    usage: 'Música del medio oriente, metal. Muy cromática.',
                    chordTypes: null,
                    brightness: 2,
                    characteristicNote: 'b2 + 3M + 7M',
                    usageContext: ['Música árabe', 'Música turca', 'Metal oriental', 'Bandas sonoras exóticas', 'Klezmer'],
                    musicalGenres: ['Música Árabe', 'Metal Oriental', 'Klezmer'],
                    famousArtists: ['Orphaned Land', 'Melechesh', 'Oum Kalthoum'],
                    famousSongs: ['The Beloved\'s Cry', 'Rebirth of the Nemesis', 'Enta Omri'],
                    backingTrack: null
                },
                japanese: {
                    name: 'Japonesa (In Sen)',
                    category: 'exotic',
                    emotion: 'Jardines zen bajo la lluvia, cerezos en flor que caen al estanque. Melancolía que encuentra paz.',
                    formula: 'S-2T-T-S-2T',
                    usage: 'Música tradicional japonesa, ambient.',
                    chordTypes: null,
                    brightness: 1,
                    characteristicNote: 'b2 + espacios amplios',
                    usageContext: ['Música japonesa tradicional', 'Ambient', 'Lo-fi', 'Meditación', 'Bandas sonoras contemplativas'],
                    musicalGenres: ['Música Japonesa', 'Ambient', 'Lo-fi'],
                    famousArtists: ['Ryuichi Sakamoto', 'Nujabes', 'Kitaro'],
                    famousSongs: ['Merry Christmas Mr. Lawrence', 'Aruarian Dance', 'Silk Road'],
                    backingTrack: null
                },
                bebop: {
                    name: 'Bebop Dominante',
                    category: 'exotic',
                    emotion: 'Nueva York años 50, dedos volando sobre las teclas, conversaciones entre genios. Elegancia a 200 BPM.',
                    formula: 'T-T-S-T-T-S-S-S',
                    usage: 'Jazz bebop. 8 notas para que las notas del acorde caigan en tiempo fuerte.',
                    chordTypes: null,
                    brightness: 5,
                    characteristicNote: '7M cromática',
                    usageContext: ['Jazz bebop', 'Hard bop', 'Jazz standards', 'Walking bass', 'Solos de viento']
                },

                // === ESCALAS REGIONALES Y AVANZADAS ===
                bluesHeptatonic: {
                    name: 'Blues Heptatónica',
                    category: 'exotic',
                    emotion: 'Blues con riqueza armónica expandida. El blues que estudió teoría en Berklee pero sigue llorando igual.',
                    formula: 'T-S-S-S-T-1.5T-T',
                    usage: 'Blues moderno, blues-rock. Pentatónica blues + 2ª mayor y 6ª mayor para más opciones melódicas.',
                    chordTypes: null,
                    brightness: 3,
                    characteristicNote: '2M + 6M sobre base blues',
                    usageContext: ['Blues rock moderno', 'SRV style', 'Allman Brothers', 'Jazz-blues', 'Blues sofisticado']
                },
                ryuKyu: {
                    name: 'Ryu Kyu (Okinawan)',
                    category: 'exotic',
                    emotion: 'Islas de Okinawa bañadas por el mar. Música folclórica ancestral con escalas pentatónicas únicas.',
                    formula: '2T-S-T-2T',
                    usage: 'Música tradicional de Okinawa (Japón). Pentatónica con intervalos amplios.',
                    chordTypes: null,
                    brightness: 4,
                    characteristicNote: 'Saltos de tercera mayor',
                    usageContext: ['Música japonesa tradicional', 'Folk okinawense', 'Ambient japonés', 'World music', 'Documentales']
                },
                yo: {
                    name: 'Yo Scale (Japonesa)',
                    category: 'exotic',
                    emotion: 'Primavera en Kioto, templos sintoístas, ceremonia del té. Serenidad y elegancia japonesa.',
                    formula: 'T-1.5T-T-T-1.5T',
                    usage: 'Música tradicional japonesa. Pentatónica mayor japonesa sin semitonos.',
                    chordTypes: null,
                    brightness: 5,
                    characteristicNote: 'Sin semitonos - espaciosa',
                    usageContext: ['Música tradicional japonesa', 'Koto', 'Shamisen', 'Anime tranquilo', 'Jardines zen']
                },
                bhairav: {
                    name: 'Bhairav Raga',
                    category: 'exotic',
                    emotion: 'Amanecer en el Ganges, ascetas meditando, incienso sagrado. Espiritualidad intensa y devocional.',
                    formula: 'S-1.5T-S-T-S-1.5T-S',
                    usage: 'Música clásica india. Raga de la mañana temprana. Evoca devoción y reverencia.',
                    chordTypes: null,
                    brightness: 2,
                    characteristicNote: 'b2 + 3M + 7M (similar bizantina)',
                    usageContext: ['Música india clásica', 'Sitar', 'Meditación', 'Yoga', 'Música devocional']
                },
                todi: {
                    name: 'Todi Raga',
                    category: 'exotic',
                    emotion: 'Melancolía profunda del mediodía indio. Amor perdido, nostalgia espiritual, belleza dolorosa.',
                    formula: 'S-T-1.5T-S-S-1.5T-S',
                    usage: 'Música clásica india. Raga del mediodía. Uno de los ragas más emotivos.',
                    chordTypes: null,
                    brightness: 1,
                    characteristicNote: 'b2 + b3 + #4 + b6',
                    usageContext: ['Música india clásica', 'Raga mediodía', 'Baladas emotivas', 'Meditación profunda', 'Cine indio']
                },
                messiaenMode2: {
                    name: 'Messiaen Modo 2 (Octatónica)',
                    category: 'symmetric',
                    emotion: 'Vitrales de luz filtrada, arquitectura imposible, Escher sonoro. Simetría que desafía la gravedad tonal.',
                    formula: 'S-T-S-T-S-T-S-T',
                    usage: 'Música contemporánea, Messiaen, Debussy. Escala simétrica de transposición limitada.',
                    chordTypes: null,
                    brightness: 3,
                    characteristicNote: 'Simetría semitono-tono',
                    usageContext: ['Música clásica moderna', 'Messiaen', 'Jazz moderno', 'Metal progresivo', 'Bandas sonoras de ciencia ficción']
                },
                messiaenMode3: {
                    name: 'Messiaen Modo 3',
                    category: 'symmetric',
                    emotion: 'Geometría sagrada, matemáticas místicas, catedrales de sonido. Complejidad que sugiere lo divino.',
                    formula: 'T-S-S-T-S-S-T-S-S',
                    usage: 'Música sacra contemporánea. Escala de 9 notas con 3 transposiciones posibles.',
                    chordTypes: null,
                    brightness: 4,
                    characteristicNote: 'Simetría tono-semitono-semitono',
                    usageContext: ['Música sacra moderna', 'Messiaen', 'Vanguardia', 'Órgano litúrgico', 'Composición experimental']
                }
            },

            // Categorías de escalas para la UI
            scaleCategories: {
                major: { name: 'Escalas Mayores', color: '#f97316' },
                minor: { name: 'Escalas Menores', color: '#22d3ee' },
                modes: { name: 'Modos de la Mayor', color: '#fbbf24' },
                harmonicMinorModes: { name: 'Modos de la Menor Armónica', color: '#a855f7' },
                melodicMinorModes: { name: 'Modos de la Menor Melódica', color: '#ec4899' },
                pentatonic: { name: 'Pentatónicas y Blues', color: '#10b981' },
                symmetric: { name: 'Escalas Simétricas', color: '#6366f1' },
                exotic: { name: 'Escalas Exóticas', color: '#ef4444' }
            },

            // Chord Lab - Voicing metadata
            chordLabVoicings: {
                // Major triads
                'C_shape_major': {
                    name: 'C Shape',
                    frets: [0, 3, 2, 0, 1, 0],
                    fingers: [0, 3, 2, 0, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 8,
                    bestFor: ['rhythm', 'open-sound'],
                    genres: ['folk', 'country', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Open position songs'
                },
                'A_shape_major': {
                    name: 'A Shape',
                    frets: [0, 0, 2, 2, 2, 0],
                    fingers: [0, 0, 1, 2, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 7,
                    bestFor: ['rhythm', 'strumming'],
                    genres: ['rock', 'folk', 'blues'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Strumming patterns'
                },
                'G_shape_major': {
                    name: 'G Shape',
                    frets: [3, 2, 0, 0, 0, 3],
                    fingers: [2, 1, 0, 0, 0, 3],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 9,
                    bestFor: ['full-sound', 'bright'],
                    genres: ['folk', 'country', 'rock'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Full, ringing chords'
                },
                'E_shape_major_barre': {
                    name: 'E Shape (Barre)',
                    frets: [1, 1, 1, 1, 1, 1],
                    fingers: [1, 1, 2, 3, 4, 1],
                    baseFret: 1,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 6,
                    bestFor: ['movable', 'any-key'],
                    genres: ['rock', 'pop', 'metal'],
                    tension: 'medium',
                    movable: true,
                    commonUse: 'Movable up the neck'
                },
                'D_shape_major': {
                    name: 'D Shape',
                    frets: [-1, -1, 0, 2, 3, 2],
                    fingers: [0, 0, 0, 1, 3, 2],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['bright', 'cutting'],
                    genres: ['folk', 'country', 'bluegrass'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bright, high voicing'
                },
                'E_shape_major': {
                    name: 'E Shape',
                    frets: [0, 2, 2, 1, 0, 0],
                    fingers: [0, 2, 3, 1, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 7,
                    bestFor: ['full-sound', 'open'],
                    genres: ['rock', 'folk', 'blues'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Open E chord, full resonance'
                },
                // Minor shapes
                'Am_shape': {
                    name: 'Am Shape',
                    frets: [0, 0, 2, 2, 1, 0],
                    fingers: [0, 0, 2, 3, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 5,
                    bestFor: ['sad', 'melancholic'],
                    genres: ['folk', 'rock', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Standard minor sound'
                },
                'Em_shape': {
                    name: 'Em Shape',
                    frets: [0, 2, 2, 0, 0, 0],
                    fingers: [0, 2, 3, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 6,
                    bestFor: ['dark', 'full'],
                    genres: ['rock', 'metal', 'folk'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Open, dark sound'
                },
                'Dm_shape': {
                    name: 'Dm Shape',
                    frets: [-1, -1, 0, 2, 3, 1],
                    fingers: [0, 0, 0, 2, 3, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 4,
                    bestFor: ['melancholic', 'somber'],
                    genres: ['folk', 'classical', 'jazz'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Sad, reflective'
                },
                // 7th chords
                'E_shape_maj7': {
                    name: 'E Shape maj7',
                    frets: [0, 2, 1, 1, 0, 0],
                    fingers: [0, 2, 1, 3, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 8,
                    bestFor: ['jazz', 'sophisticated'],
                    genres: ['jazz', 'bossa', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Smooth, jazzy'
                },
                'E_shape_dom7': {
                    name: 'E Shape 7',
                    frets: [0, 2, 0, 1, 0, 0],
                    fingers: [0, 2, 0, 1, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 7,
                    bestFor: ['blues', 'dominant'],
                    genres: ['blues', 'rock', 'country'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Blues, V chord'
                },
                'A_shape_maj7': {
                    name: 'A Shape maj7',
                    frets: [0, 0, 2, 1, 2, 0],
                    fingers: [0, 0, 2, 1, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 7,
                    bestFor: ['smooth', 'dreamy'],
                    genres: ['jazz', 'pop', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Lush, full maj7'
                },
                'A_shape_m7': {
                    name: 'A Shape m7',
                    frets: [0, 0, 2, 0, 1, 0],
                    fingers: [0, 0, 2, 0, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 5,
                    bestFor: ['mellow', 'cool-jazz'],
                    genres: ['jazz', 'soul', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'ii chord in jazz'
                },
                // Extensions
                'Cmaj9': {
                    name: 'maj9',
                    frets: [0, 3, 2, 0, 0, 0],
                    fingers: [0, 3, 2, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 9,
                    bestFor: ['modern', 'lush'],
                    genres: ['jazz', 'neo-soul', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Rich, modern I chord'
                },
                'C9': {
                    name: '9',
                    frets: [0, 3, 2, 3, 3, 0],
                    fingers: [0, 2, 1, 3, 4, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 7,
                    bestFor: ['funk', 'r&b'],
                    genres: ['funk', 'r&b', 'jazz'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Funky V chord'
                },
                'C11': {
                    name: '11',
                    frets: [0, 3, 3, 3, 1, 0],
                    fingers: [0, 2, 3, 4, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 6,
                    brightness: 6,
                    bestFor: ['tension', 'modal'],
                    genres: ['jazz', 'fusion', 'modern'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Suspended, tense'
                },
                'Cmaj13': {
                    name: 'maj13',
                    frets: [0, 3, 2, 2, 0, 0],
                    fingers: [0, 3, 2, 4, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 7,
                    brightness: 9,
                    bestFor: ['complex', 'colorful'],
                    genres: ['jazz', 'bossa', 'sophisticated'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Lush ending chord'
                },
                // Additional voicings for variety
                'A_shape_major_high': {
                    name: 'A Shape (High)',
                    frets: [-1, 0, 2, 2, 2, 0],
                    fingers: [0, 0, 1, 2, 3, 0],
                    baseFret: 0,
                    register: 'high',
                    difficulty: 2,
                    brightness: 9,
                    bestFor: ['bright', 'jangly'],
                    genres: ['indie', 'alt-rock', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'High position alternative to standard A'
                },
                'E_shape_minor_barre': {
                    name: 'Em Shape (Barre)',
                    frets: [1, 1, 1, 1, 1, 1],
                    fingers: [1, 1, 3, 4, 2, 1],
                    baseFret: 1,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 5,
                    bestFor: ['dark', 'powerful'],
                    genres: ['metal', 'rock', 'hard-rock'],
                    tension: 'medium',
                    movable: true,
                    commonUse: 'Movable minor, heavy sound'
                },
                'D_shape_maj7': {
                    name: 'D Shape maj7',
                    frets: [-1, -1, 0, 2, 2, 2],
                    fingers: [0, 0, 0, 1, 2, 3],
                    baseFret: 0,
                    register: 'high',
                    difficulty: 4,
                    brightness: 9,
                    bestFor: ['dreamy', 'ethereal'],
                    genres: ['indie', 'dream-pop', 'shoegaze'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'High, shimmering maj7'
                },
                'G_shape_m7': {
                    name: 'Gm7 Shape',
                    frets: [3, 1, 3, 3, 3, 1],
                    fingers: [3, 1, 2, 4, 5, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 8,
                    brightness: 6,
                    bestFor: ['jazz', 'sophisticated'],
                    genres: ['jazz', 'fusion', 'r&b'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Full m7, all six strings'
                },
                // CAGED m7 completo
                'C_shape_m7': {
                    name: 'Cm7 Shape',
                    frets: [0, 3, 1, 3, 4, 3],
                    fingers: [0, 2, 1, 3, 4, 3],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 7,
                    brightness: 5,
                    bestFor: ['jazz', 'full-sound'],
                    genres: ['jazz', 'soul', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Rich m7 with open low E'
                },
                'E_shape_m7': {
                    name: 'Em7 Shape',
                    frets: [0, 2, 0, 0, 0, 0],
                    fingers: [0, 2, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 6,
                    bestFor: ['open', 'relaxed'],
                    genres: ['folk', 'rock', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Most open m7 sound'
                },
                'D_shape_m7': {
                    name: 'Dm7 Shape',
                    frets: [-1, -1, 0, 2, 1, 1],
                    fingers: [0, 0, 0, 3, 1, 2],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 5,
                    bestFor: ['intimate', 'mellow'],
                    genres: ['jazz', 'bossa', 'soul'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Classic ii chord'
                },
                // CAGED dom7 completo
                'C_shape_dom7': {
                    name: 'C7 Shape',
                    frets: [0, 3, 2, 3, 1, 0],
                    fingers: [0, 3, 2, 4, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 7,
                    bestFor: ['blues', 'dominant'],
                    genres: ['blues', 'rock', 'country'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Open C7, blues classic'
                },
                'A_shape_dom7': {
                    name: 'A7 Shape',
                    frets: [0, 0, 2, 0, 2, 0],
                    fingers: [0, 0, 2, 0, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 7,
                    bestFor: ['blues', 'country'],
                    genres: ['blues', 'country', 'rock'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Cowboy chord dom7'
                },
                'G_shape_dom7': {
                    name: 'G7 Shape',
                    frets: [3, 2, 0, 0, 0, 1],
                    fingers: [3, 2, 0, 0, 0, 1],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['bright', 'bluesy'],
                    genres: ['blues', 'rock', 'folk'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Classic G7 with open strings'
                },
                'D_shape_dom7': {
                    name: 'D7 Shape',
                    frets: [-1, -1, 0, 2, 1, 2],
                    fingers: [0, 0, 0, 2, 1, 3],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['bright', 'cutting'],
                    genres: ['folk', 'bluegrass', 'country'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'High register dom7'
                },
                // CAGED maj7 completo
                'C_shape_maj7': {
                    name: 'Cmaj7 Shape',
                    frets: [0, 3, 2, 0, 0, 0],
                    fingers: [0, 3, 2, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['dreamy', 'sophisticated'],
                    genres: ['jazz', 'pop', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Open Cmaj7, very lush'
                },
                'G_shape_maj7': {
                    name: 'Gmaj7 Shape',
                    frets: [3, 2, 0, 0, 0, 2],
                    fingers: [2, 1, 0, 0, 0, 3],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 9,
                    bestFor: ['bright', 'full'],
                    genres: ['jazz', 'pop', 'indie'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bright, open maj7'
                },
                // Drop 2 voicings
                'Drop2_Cmaj7_root': {
                    name: 'Drop 2 maj7 (root pos)',
                    frets: [-1, 3, 5, 4, 5, -1],
                    fingers: [0, 1, 3, 2, 4, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 7,
                    bestFor: ['jazz', 'voice-leading'],
                    genres: ['jazz', 'fusion', 'sophisticated'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Jazz standard voicing'
                },
                'Drop2_Cmaj7_3rd': {
                    name: 'Drop 2 maj7 (3rd inv)',
                    frets: [-1, 3, 4, 5, 5, -1],
                    fingers: [0, 1, 2, 3, 4, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 8,
                    bestFor: ['jazz', 'smooth'],
                    genres: ['jazz', 'bossa', 'latin'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Voice leading inversion'
                },
                'Drop2_C7_root': {
                    name: 'Drop 2 dom7 (root pos)',
                    frets: [-1, 3, 5, 3, 5, -1],
                    fingers: [0, 1, 3, 2, 4, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 7,
                    bestFor: ['jazz', 'bebop'],
                    genres: ['jazz', 'bebop', 'swing'],
                    tension: 'medium',
                    movable: true,
                    commonUse: 'Classic jazz dom7'
                },
                'Drop2_Cm7_root': {
                    name: 'Drop 2 m7 (root pos)',
                    frets: [-1, 3, 5, 3, 4, -1],
                    fingers: [0, 1, 4, 2, 3, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 6,
                    bestFor: ['jazz', 'cool'],
                    genres: ['jazz', 'soul', 'r&b'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'ii chord in jazz'
                },
                'Drop2_Cm7b5_root': {
                    name: 'Drop 2 m7b5 (root pos)',
                    frets: [-1, 3, 4, 3, 4, -1],
                    fingers: [0, 2, 3, 1, 4, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 7,
                    brightness: 5,
                    bestFor: ['jazz', 'tension'],
                    genres: ['jazz', 'bebop', 'modern'],
                    tension: 'high',
                    movable: true,
                    commonUse: 'Half-diminished, ii in minor'
                },
                // Suspended chords
                'Csus2': {
                    name: 'sus2',
                    frets: [0, 3, 0, 0, 3, 3],
                    fingers: [0, 2, 0, 0, 3, 4],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['modern', 'open'],
                    genres: ['indie', 'alt-rock', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Modern, ambiguous sound'
                },
                'Csus4': {
                    name: 'sus4',
                    frets: [0, 3, 3, 0, 1, 1],
                    fingers: [0, 3, 4, 0, 1, 2],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 7,
                    bestFor: ['tension', 'anticipation'],
                    genres: ['rock', 'pop', 'folk'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Suspended, wants to resolve'
                },
                'C7sus4': {
                    name: '7sus4',
                    frets: [0, 3, 3, 3, 1, 1],
                    fingers: [0, 2, 3, 4, 1, 1],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 7,
                    bestFor: ['funk', 'modal'],
                    genres: ['funk', 'rock', 'jazz'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Dominant sus, funky'
                },
                'Asus2': {
                    name: 'Asus2',
                    frets: [0, 0, 2, 2, 0, 0],
                    fingers: [0, 0, 1, 2, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 9,
                    bestFor: ['bright', 'open'],
                    genres: ['indie', 'rock', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Very open, jangly'
                },
                'Asus4': {
                    name: 'Asus4',
                    frets: [0, 0, 2, 2, 3, 0],
                    fingers: [0, 0, 1, 2, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 7,
                    bestFor: ['anticipation', 'folk'],
                    genres: ['folk', 'country', 'rock'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Classic sus4 resolution'
                },
                // Add chords
                'Cadd9': {
                    name: 'add9',
                    frets: [0, 3, 2, 0, 3, 0],
                    fingers: [0, 2, 1, 0, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 9,
                    bestFor: ['modern', 'colorful'],
                    genres: ['pop', 'indie', 'alt-rock'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Add color without 7th'
                },
                'Amadd9': {
                    name: 'madd9',
                    frets: [0, 0, 2, 4, 1, 0],
                    fingers: [0, 0, 2, 4, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 7,
                    bestFor: ['dreamy', 'sad'],
                    genres: ['indie', 'alternative', 'emo'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Minor with sweetness'
                },
                'Dadd9': {
                    name: 'Dadd9',
                    frets: [-1, -1, 0, 2, 3, 0],
                    fingers: [0, 0, 0, 1, 2, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 9,
                    bestFor: ['bright', 'simple'],
                    genres: ['pop', 'folk', 'indie'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Easy, beautiful voicing'
                },
                'C6': {
                    name: '6',
                    frets: [0, 3, 2, 2, 1, 0],
                    fingers: [0, 3, 2, 4, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 8,
                    bestFor: ['jazzy', 'retro'],
                    genres: ['jazz', 'swing', 'vintage'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Jazz ending chord'
                },
                'Am6': {
                    name: 'm6',
                    frets: [0, 0, 2, 2, 1, 2],
                    fingers: [0, 0, 2, 3, 1, 4],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 6,
                    bestFor: ['sophisticated', 'jazzy'],
                    genres: ['jazz', 'bossa', 'latin'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Minor tonic substitute'
                },
                // Altered chords (Jazz)
                'C7sharp9': {
                    name: '7#9 (Hendrix)',
                    frets: [0, 3, 2, 3, 3, 4],
                    fingers: [0, 2, 1, 3, 3, 4],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 7,
                    brightness: 6,
                    bestFor: ['bluesy', 'hendrix'],
                    genres: ['blues', 'rock', 'funk'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Purple Haze chord'
                },
                'E7sharp9': {
                    name: 'E7#9',
                    frets: [0, 2, 0, 1, 3, 0],
                    fingers: [0, 2, 0, 1, 4, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 7,
                    bestFor: ['bluesy', 'tense'],
                    genres: ['blues', 'rock', 'jazz'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Blues-rock staple'
                },
                'C7flat9': {
                    name: '7b9',
                    frets: [0, 3, 2, 3, 2, 0],
                    fingers: [0, 3, 2, 4, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 6,
                    brightness: 5,
                    bestFor: ['tense', 'dark'],
                    genres: ['jazz', 'bebop', 'modern'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Altered dominant'
                },
                'C7sharp5': {
                    name: '7#5 (augmented)',
                    frets: [0, 3, 2, 3, 3, 0],
                    fingers: [0, 2, 1, 3, 4, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 7,
                    bestFor: ['tension', 'unstable'],
                    genres: ['jazz', 'modern', 'experimental'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Chromatic approach'
                },
                'C7flat5': {
                    name: '7b5',
                    frets: [0, 3, 2, 3, 1, -1],
                    fingers: [0, 3, 2, 4, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 6,
                    bestFor: ['tense', 'tritone'],
                    genres: ['jazz', 'bebop', 'blues'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Tritone substitution'
                },
                // Extended voicings
                'Cmaj9_rich': {
                    name: 'maj9 (rich)',
                    frets: [0, 3, 0, 0, 0, 0],
                    fingers: [0, 1, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 10,
                    bestFor: ['open', 'spacious'],
                    genres: ['indie', 'shoegaze', 'ambient'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Maximum openness'
                },
                'Dm9': {
                    name: 'm9',
                    frets: [-1, -1, 0, 2, 1, 0],
                    fingers: [0, 0, 0, 2, 1, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 6,
                    bestFor: ['jazzy', 'smooth'],
                    genres: ['jazz', 'neo-soul', 'r&b'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Lush minor color'
                },
                'Am9': {
                    name: 'Am9',
                    frets: [0, 0, 2, 4, 1, 3],
                    fingers: [0, 0, 2, 4, 1, 3],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 7,
                    bestFor: ['modern', 'lush'],
                    genres: ['neo-soul', 'r&b', 'jazz'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Rich minor extension'
                },
                'C9sus4': {
                    name: '9sus4',
                    frets: [0, 3, 3, 0, 3, 3],
                    fingers: [0, 1, 2, 0, 3, 4],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 8,
                    bestFor: ['modal', 'ambiguous'],
                    genres: ['fusion', 'modern-jazz', 'progressive'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Modal, no 3rd'
                },
                'C13sus4': {
                    name: '13sus4',
                    frets: [0, 3, 3, 2, 3, 3],
                    fingers: [0, 2, 3, 1, 4, 5],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 8,
                    brightness: 8,
                    bestFor: ['complex', 'fusion'],
                    genres: ['fusion', 'jazz', 'modern'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Very colorful, complex'
                },
                // Power chords and Rock voicings
                'C5_power': {
                    name: 'Power Chord (5)',
                    frets: [0, 3, 5, 5, -1, -1],
                    fingers: [0, 1, 3, 4, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 5,
                    bestFor: ['rock', 'heavy'],
                    genres: ['rock', 'metal', 'punk'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Rock/metal staple'
                },
                'A5_power': {
                    name: 'A5 Power',
                    frets: [0, 0, 2, 2, -1, -1],
                    fingers: [0, 0, 1, 1, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 5,
                    bestFor: ['heavy', 'simple'],
                    genres: ['metal', 'hard-rock', 'punk'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Easy power chord'
                },
                'E5_power': {
                    name: 'E5 Power',
                    frets: [0, 2, 2, -1, -1, -1],
                    fingers: [0, 1, 2, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 5,
                    bestFor: ['heavy', 'minimal'],
                    genres: ['metal', 'punk', 'hard-rock'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Simplest power chord'
                },
                'D5_power': {
                    name: 'D5 Power',
                    frets: [-1, -1, 0, 2, 3, -1],
                    fingers: [0, 0, 0, 1, 2, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 1,
                    brightness: 6,
                    bestFor: ['heavy', 'bright'],
                    genres: ['rock', 'metal', 'punk'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'High register power chord'
                },
                'G5_power': {
                    name: 'G5 Power',
                    frets: [3, 5, 5, -1, -1, -1],
                    fingers: [1, 3, 4, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 5,
                    bestFor: ['heavy', 'full'],
                    genres: ['metal', 'rock', 'grunge'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Thick power chord'
                },
                // More inversions for voice leading
                'Cmaj_1st_inv': {
                    name: 'C major (1st inv)',
                    frets: [-1, 3, 2, 0, 1, 0],
                    fingers: [0, 3, 2, 0, 1, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['voice-leading', 'smooth'],
                    genres: ['jazz', 'classical', 'sophisticated'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bass on 3rd (E), smooth transitions'
                },
                'Cmaj_2nd_inv': {
                    name: 'C major (2nd inv)',
                    frets: [-1, -1, -1, 5, 5, 5],
                    fingers: [0, 0, 0, 1, 2, 3],
                    baseFret: 0,
                    register: 'high',
                    difficulty: 3,
                    brightness: 9,
                    bestFor: ['voice-leading', 'bright'],
                    genres: ['pop', 'jazz', 'modern'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Bass on 5th (G), highest voicing'
                },
                'Am_1st_inv': {
                    name: 'A minor (1st inv)',
                    frets: [-1, 0, 2, 2, 1, 0],
                    fingers: [0, 0, 2, 3, 1, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 6,
                    bestFor: ['voice-leading', 'transitions'],
                    genres: ['folk', 'classical', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bass on 3rd (C), smooth minor'
                },
                'Am_2nd_inv': {
                    name: 'A minor (2nd inv)',
                    frets: [-1, -1, -1, 2, 1, 0],
                    fingers: [0, 0, 0, 3, 2, 1],
                    baseFret: 0,
                    register: 'high',
                    difficulty: 2,
                    brightness: 7,
                    bestFor: ['voice-leading', 'delicate'],
                    genres: ['classical', 'fingerstyle', 'indie'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bass on 5th (E), minimal voicing'
                },
                'Em_1st_inv': {
                    name: 'E minor (1st inv)',
                    frets: [0, 2, 2, 0, 0, 0],
                    fingers: [0, 1, 2, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 6,
                    bestFor: ['open', 'transitions'],
                    genres: ['folk', 'rock', 'classical'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bass on 3rd (G), very common'
                },
                'Dm_1st_inv': {
                    name: 'D minor (1st inv)',
                    frets: [-1, -1, 0, 2, 3, 1],
                    fingers: [0, 0, 0, 2, 3, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 5,
                    bestFor: ['voice-leading', 'classical'],
                    genres: ['classical', 'jazz', 'folk'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bass on 3rd (F), smooth minor movement'
                },
                // More 7th inversions for jazz
                'Cmaj7_1st_inv': {
                    name: 'Cmaj7 (1st inv)',
                    frets: [-1, 3, 5, 4, 0, 0],
                    fingers: [0, 1, 4, 3, 0, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 5,
                    brightness: 8,
                    bestFor: ['jazz', 'voice-leading'],
                    genres: ['jazz', 'bossa', 'sophisticated'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Bass on 3rd (E), smooth jazz'
                },
                'Cmaj7_2nd_inv': {
                    name: 'Cmaj7 (2nd inv)',
                    frets: [-1, -1, 5, 5, 5, 7],
                    fingers: [0, 0, 1, 1, 1, 3],
                    baseFret: 0,
                    register: 'high',
                    difficulty: 6,
                    brightness: 9,
                    bestFor: ['jazz', 'bright'],
                    genres: ['jazz', 'fusion', 'modern'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Bass on 5th (G), high and bright'
                },
                'Cmaj7_3rd_inv': {
                    name: 'Cmaj7 (3rd inv)',
                    frets: [-1, -1, -1, 0, 0, 0],
                    fingers: [0, 0, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'high',
                    difficulty: 1,
                    brightness: 10,
                    bestFor: ['minimal', 'ethereal'],
                    genres: ['ambient', 'indie', 'experimental'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Bass on 7th (B), extremely minimal'
                },
                'C7_1st_inv': {
                    name: 'C7 (1st inv)',
                    frets: [-1, 3, 5, 3, 5, 3],
                    fingers: [0, 1, 3, 1, 4, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 7,
                    brightness: 7,
                    bestFor: ['jazz', 'blues'],
                    genres: ['jazz', 'blues', 'swing'],
                    tension: 'medium',
                    movable: true,
                    commonUse: 'Bass on 3rd (E), full jazz voicing'
                },
                'Cm7_1st_inv': {
                    name: 'Cm7 (1st inv)',
                    frets: [-1, 3, 5, 3, 4, 3],
                    fingers: [0, 1, 4, 2, 3, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 7,
                    brightness: 6,
                    bestFor: ['jazz', 'smooth'],
                    genres: ['jazz', 'soul', 'neo-soul'],
                    tension: 'low',
                    movable: true,
                    commonUse: 'Bass on 3rd (Eb), ii chord inversion'
                },
                // Extended chords for modern/jazz sounds
                'Dm11': {
                    name: 'm11',
                    frets: [-1, -1, 0, 0, 1, 1],
                    fingers: [0, 0, 0, 0, 1, 2],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 7,
                    bestFor: ['modal', 'spacious'],
                    genres: ['jazz', 'fusion', 'neo-soul'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Open, modal sound'
                },
                'Em11': {
                    name: 'Em11',
                    frets: [0, 0, 0, 0, 0, 0],
                    fingers: [0, 0, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 9,
                    bestFor: ['open', 'ambient'],
                    genres: ['ambient', 'post-rock', 'experimental'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Maximum openness, all strings'
                },
                'Am11': {
                    name: 'Am11',
                    frets: [0, 0, 0, 0, 1, 0],
                    fingers: [0, 0, 0, 0, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 8,
                    bestFor: ['open', 'modern'],
                    genres: ['indie', 'ambient', 'neo-soul'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Super open minor sound'
                },
                'Gmaj13': {
                    name: 'Gmaj13',
                    frets: [3, 2, 0, 0, 0, 0],
                    fingers: [2, 1, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 10,
                    bestFor: ['lush', 'full'],
                    genres: ['jazz', 'sophisticated', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Maximum color, all extensions'
                },
                'E13': {
                    name: 'E13',
                    frets: [0, 2, 0, 1, 2, 0],
                    fingers: [0, 2, 0, 1, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['dominant', 'complex'],
                    genres: ['jazz', 'blues', 'funk'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Full dominant with extensions'
                },
                'A13': {
                    name: 'A13',
                    frets: [0, 0, 2, 1, 2, 2],
                    fingers: [0, 0, 2, 1, 3, 4],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 8,
                    bestFor: ['jazzy', 'colorful'],
                    genres: ['jazz', 'swing', 'bebop'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Rich dominant color'
                },
                // Cluster chords (experimental)
                'C_cluster_1': {
                    name: 'C Cluster (dense)',
                    frets: [0, 3, 4, 5, 6, -1],
                    fingers: [0, 1, 2, 3, 4, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 4,
                    bestFor: ['dissonant', 'modern'],
                    genres: ['experimental', 'avant-garde', 'noise'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Maximum dissonance, chromatic'
                },
                'C_cluster_2': {
                    name: 'C Cluster (open)',
                    frets: [0, 3, 2, 0, 1, 0],
                    fingers: [0, 3, 2, 0, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 8,
                    bestFor: ['colorful', 'modern'],
                    genres: ['indie', 'experimental', 'shoegaze'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Controlled dissonance'
                },
                // Polychords
                'C_over_G': {
                    name: 'C/G (polychord)',
                    frets: [3, 3, 2, 0, 1, 0],
                    fingers: [3, 4, 2, 0, 1, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 8,
                    bestFor: ['complex', 'modern'],
                    genres: ['progressive', 'jazz-fusion', 'modern'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Two chords at once'
                },
                'Dm_over_C': {
                    name: 'Dm/C',
                    frets: [-1, 3, 0, 2, 3, 1],
                    fingers: [0, 3, 0, 2, 4, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 5,
                    brightness: 6,
                    bestFor: ['tension', 'sus'],
                    genres: ['jazz', 'modern', 'progressive'],
                    tension: 'medium',
                    movable: false,
                    commonUse: 'Suspended feeling, complex'
                },
                'F_over_G': {
                    name: 'F/G (sus)',
                    frets: [3, 3, 3, 2, 1, 1],
                    fingers: [3, 4, 5, 2, 1, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 7,
                    brightness: 7,
                    bestFor: ['modal', 'tension'],
                    genres: ['jazz', 'fusion', 'modal'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Unresolved tension'
                },
                // Diminished chords
                'Cdim7': {
                    name: 'dim7',
                    frets: [-1, 3, 4, 2, 4, 2],
                    fingers: [0, 2, 4, 1, 3, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 4,
                    bestFor: ['passing', 'tension'],
                    genres: ['jazz', 'classical', 'bebop'],
                    tension: 'high',
                    movable: true,
                    commonUse: 'Passing chord, symmetrical'
                },
                'Bdim7': {
                    name: 'Bdim7',
                    frets: [-1, 2, 3, 1, 3, 1],
                    fingers: [0, 2, 4, 1, 3, 1],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 6,
                    brightness: 4,
                    bestFor: ['chromatic', 'passing'],
                    genres: ['jazz', 'swing', 'classical'],
                    tension: 'high',
                    movable: true,
                    commonUse: 'Common passing diminished'
                },
                // Augmented chords
                'Caug': {
                    name: 'aug',
                    frets: [-1, 3, 2, 1, 1, 0],
                    fingers: [0, 4, 3, 1, 2, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 5,
                    brightness: 6,
                    bestFor: ['tension', 'unstable'],
                    genres: ['jazz', 'modern', 'experimental'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Whole tone feeling, unstable'
                },
                'Eaug': {
                    name: 'Eaug',
                    frets: [0, 3, 2, 1, 1, 0],
                    fingers: [0, 4, 3, 1, 2, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 5,
                    brightness: 6,
                    bestFor: ['tension', 'chromatic'],
                    genres: ['jazz', 'bebop', 'modern'],
                    tension: 'high',
                    movable: false,
                    commonUse: 'Augmented resolution'
                },
                // Special voicings
                'Dsus2_bright': {
                    name: 'Dsus2 (Wonderwall)',
                    frets: [-1, -1, 0, 2, 3, 0],
                    fingers: [0, 0, 0, 1, 2, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 10,
                    bestFor: ['jangly', 'bright'],
                    genres: ['indie', 'brit-pop', 'alternative'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Oasis, Wonderwall sound'
                },
                'Em7_beatles': {
                    name: 'Em7 (Something)',
                    frets: [0, 2, 2, 0, 3, 0],
                    fingers: [0, 2, 3, 0, 4, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 7,
                    bestFor: ['melodic', 'classic'],
                    genres: ['rock', 'classic-rock', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Beatles signature voicing'
                },
                'Gmaj7_bright': {
                    name: 'Gmaj7 (bright)',
                    frets: [3, -1, 0, 0, 0, 2],
                    fingers: [2, 0, 0, 0, 0, 1],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 10,
                    bestFor: ['open', 'jangly'],
                    genres: ['indie', 'folk', 'pop'],
                    tension: 'low',
                    movable: false,
                    commonUse: 'Maximum brightness with open strings'
                },

                // ========================================
                // FASE 1: VOICINGS PREMIUM CON EXTENSIONES
                // ========================================

                // DOMINANTES CON 9NA
                'E_shape_dom9': {
                    name: 'E9 Shape (movable)',
                    frets: [0, 2, 0, 1, 0, 2],
                    fingers: [0, 2, 0, 1, 0, 3],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 7,
                    tension: 'medium',
                    movable: true,
                    extensions: ['9'],
                    emotionalTags: ['funky', 'rich', 'dominant'],
                    commonUse: 'Funky dom9 voicing with characteristic 9th'
                },

                'A_shape_dom9': {
                    name: 'A9 Shape (movable)',
                    frets: [-1, 0, 2, 1, 0, 0],
                    fingers: [0, 0, 3, 2, 0, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 8,
                    tension: 'medium',
                    movable: true,
                    extensions: ['9'],
                    emotionalTags: ['funky', 'sophisticated'],
                    commonUse: 'Classic dom9 shape - warm and rich'
                },

                'G_shape_dom9': {
                    name: 'G9 (open)',
                    frets: [3, 0, 0, 0, 0, 1],
                    fingers: [2, 0, 0, 0, 0, 1],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 2,
                    brightness: 7,
                    tension: 'medium',
                    movable: false,
                    extensions: ['9'],
                    emotionalTags: ['funky', 'bright'],
                    commonUse: 'Open G9 - very bright and chimey'
                },

                // DOMINANTES CON 13VA
                'E_shape_dom13': {
                    name: 'E13 Shape (movable)',
                    frets: [0, 2, 2, 1, 2, 2],
                    fingers: [0, 2, 3, 1, 4, 4],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 5,
                    brightness: 8,
                    tension: 'high',
                    movable: true,
                    extensions: ['9', '13'],
                    emotionalTags: ['jazzy', 'complex', 'colorful'],
                    commonUse: 'Complex dom13 voicing with rich color'
                },

                'A_shape_dom13': {
                    name: 'A13 Shape (movable)',
                    frets: [-1, 0, 2, 0, 2, 2],
                    fingers: [0, 0, 2, 0, 3, 4],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 4,
                    brightness: 8,
                    tension: 'high',
                    movable: true,
                    extensions: ['9', '13'],
                    emotionalTags: ['jazzy', 'sophisticated'],
                    commonUse: 'Classic dom13 shape - full and lush'
                },

                'G_shape_dom13': {
                    name: 'G13 (open)',
                    frets: [3, 0, 0, 0, 0, 0],
                    fingers: [2, 0, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 9,
                    tension: 'medium',
                    movable: false,
                    extensions: ['9', '13'],
                    emotionalTags: ['bright', 'open', 'jazzy'],
                    commonUse: 'Simple open G13 - maximum brightness'
                },

                // MAYORES CON 9NA
                'E_shape_maj9': {
                    name: 'Emaj9 Shape (movable)',
                    frets: [0, 2, 1, 1, 0, 2],
                    fingers: [0, 3, 1, 2, 0, 4],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 4,
                    brightness: 8,
                    tension: 'low',
                    movable: true,
                    extensions: ['9'],
                    emotionalTags: ['modern', 'spacious', 'colorful'],
                    commonUse: 'Modern maj9 voicing - very spacious'
                },

                'A_shape_maj9': {
                    name: 'Amaj9 Shape (movable)',
                    frets: [-1, 0, 2, 1, 0, 0],
                    fingers: [0, 0, 2, 1, 0, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 8,
                    tension: 'low',
                    movable: true,
                    extensions: ['9'],
                    emotionalTags: ['modern', 'lush'],
                    commonUse: 'Easy maj9 shape - warm and sophisticated'
                },

                'C_shape_maj9': {
                    name: 'Cmaj9 (open)',
                    frets: [-1, 3, 2, 0, 3, 0],
                    fingers: [0, 2, 1, 0, 3, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 3,
                    brightness: 9,
                    tension: 'low',
                    movable: false,
                    extensions: ['9'],
                    emotionalTags: ['modern', 'bright', 'dreamy'],
                    commonUse: 'Open Cmaj9 - shimming and beautiful'
                },

                // MAYORES CON 13VA
                'E_shape_maj13': {
                    name: 'Emaj13 Shape (movable)',
                    frets: [0, 2, 1, 1, 2, 2],
                    fingers: [0, 2, 1, 1, 3, 4],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 5,
                    brightness: 9,
                    tension: 'low',
                    movable: true,
                    extensions: ['9', '13'],
                    emotionalTags: ['complex', 'luxurious', 'jazzy'],
                    commonUse: 'Luxurious maj13 voicing - full spectrum'
                },

                'A_shape_maj13': {
                    name: 'Amaj13 Shape (movable)',
                    frets: [-1, 0, 2, 1, 2, 2],
                    fingers: [0, 0, 2, 1, 3, 4],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 4,
                    brightness: 8,
                    tension: 'low',
                    movable: true,
                    extensions: ['9', '13'],
                    emotionalTags: ['sophisticated', 'colorful'],
                    commonUse: 'Rich maj13 - sophisticated and warm'
                },

                'C_shape_maj13': {
                    name: 'Cmaj13 (open)',
                    frets: [-1, 3, 2, 0, 0, 0],
                    fingers: [0, 3, 2, 0, 0, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 9,
                    tension: 'low',
                    movable: false,
                    extensions: ['9', '13'],
                    emotionalTags: ['bright', 'luxurious'],
                    commonUse: 'Simple open Cmaj13 - lush and bright'
                },

                // MENORES CON 9NA
                'E_shape_m9': {
                    name: 'Em9 Shape (movable)',
                    frets: [0, 2, 0, 0, 0, 2],
                    fingers: [0, 2, 0, 0, 0, 3],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 6,
                    tension: 'low',
                    movable: true,
                    extensions: ['9'],
                    emotionalTags: ['lush', 'sophisticated', 'ambient'],
                    commonUse: 'Lush m9 voicing - ambient and spacious'
                },

                'A_shape_m9': {
                    name: 'Am9 Shape (movable)',
                    frets: [-1, 0, 2, 0, 0, 0],
                    fingers: [0, 0, 2, 0, 0, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 2,
                    brightness: 7,
                    tension: 'low',
                    movable: true,
                    extensions: ['9'],
                    emotionalTags: ['smooth', 'modern'],
                    commonUse: 'Easy m9 shape - smooth and sophisticated'
                },

                'Em_shape_m9': {
                    name: 'Em9 (open)',
                    frets: [0, 2, 0, 0, 0, 0],
                    fingers: [0, 2, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 7,
                    tension: 'low',
                    movable: false,
                    extensions: ['9'],
                    emotionalTags: ['ambient', 'spacious'],
                    commonUse: 'Simple Em9 - ethereal and open'
                },

                // MENORES CON 11VA
                'E_shape_m11': {
                    name: 'Em11 Shape (movable)',
                    frets: [0, 2, 0, 0, 3, 0],
                    fingers: [0, 2, 0, 0, 3, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 3,
                    brightness: 6,
                    tension: 'low',
                    movable: true,
                    extensions: ['9', '11'],
                    emotionalTags: ['spacious', 'modal', 'floating'],
                    commonUse: 'Spacious m11 voicing - modal and floating'
                },

                'A_shape_m11': {
                    name: 'Am11 Shape (movable)',
                    frets: [-1, 0, 0, 0, 0, 0],
                    fingers: [0, 0, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'mid',
                    difficulty: 1,
                    brightness: 6,
                    tension: 'low',
                    movable: true,
                    extensions: ['9', '11'],
                    emotionalTags: ['floating', 'suspended'],
                    commonUse: 'Ultra-simple m11 - pure and floating'
                },

                'Em_shape_m11': {
                    name: 'Em11 (open)',
                    frets: [0, 0, 0, 0, 0, 0],
                    fingers: [0, 0, 0, 0, 0, 0],
                    baseFret: 0,
                    register: 'low',
                    difficulty: 1,
                    brightness: 7,
                    tension: 'low',
                    movable: false,
                    extensions: ['9', '11'],
                    emotionalTags: ['ethereal', 'suspended'],
                    commonUse: 'All open strings - maximum resonance'
                }
            },

            // CAGED relationship map with didactic explanations
            cagedRelationshipMap: {
                'C': {
                    next: 'A',
                    prev: 'D',
                    sameNotes: ['G'],
                    color: '#ef4444',
                    soundCharacter: 'Abierta y brillante',
                    whenToUse: 'Canciones en tonalidades abiertas (C, G, D). Ideal para folk y country.',
                    transitionToNext: {
                        to: 'A',
                        fretMove: 'Mueve la forma 3 trastes arriba',
                        soundChange: 'Sonido más denso, menos cuerdas al aire',
                        difficulty: 'Fácil - solo cambias dedos',
                        tip: 'La nota raíz pasa de cuerda 5 (A) a cuerda 5 (A) pero en diferente traste'
                    }
                },
                'A': {
                    next: 'G',
                    prev: 'C',
                    sameNotes: ['E'],
                    color: '#f59e0b',
                    soundCharacter: 'Full y potente',
                    whenToUse: 'Raíz en cuerda 5. Perfecta para strumming y power chords.',
                    transitionToNext: {
                        to: 'G',
                        fretMove: 'Comprime hacia agudos',
                        soundChange: 'Suena más brillante y abierta',
                        difficulty: 'Media - cambio grande de forma',
                        tip: 'La forma G usa muchas cuerdas al aire, suena más "ringing"'
                    }
                },
                'G': {
                    next: 'E',
                    prev: 'A',
                    sameNotes: ['D', 'C'],
                    color: '#eab308',
                    soundCharacter: 'Rica y resonante',
                    whenToUse: 'Máximo aprovechamiento de cuerdas al aire. Sonido completo.',
                    transitionToNext: {
                        to: 'E',
                        fretMove: 'Forma barre en trastes altos',
                        soundChange: 'Pierde resonancia de aire, gana movilidad',
                        difficulty: 'Alta - requiere barre completo',
                        tip: 'E shape es la forma más versátil - puedes moverla a cualquier tono'
                    }
                },
                'E': {
                    next: 'D',
                    prev: 'G',
                    sameNotes: ['A'],
                    color: '#84cc16',
                    soundCharacter: 'Versátil y móvil',
                    whenToUse: 'Cuando necesitas cambiar de tono fácilmente. Raíz en cuerda 6.',
                    transitionToNext: {
                        to: 'D',
                        fretMove: 'Sube hacia agudos, elimina cuerdas graves',
                        soundChange: 'Sonido más agudo y cortante',
                        difficulty: 'Media - menos cuerdas pero posición incómoda',
                        tip: 'D shape tiene la raíz en cuerda 4, suena "thin" pero brillante'
                    }
                },
                'D': {
                    next: 'C',
                    prev: 'E',
                    sameNotes: ['G'],
                    color: '#06b6d4',
                    soundCharacter: 'Aguda y penetrante',
                    whenToUse: 'Solos y melodías. Se "corta" en la mezcla.',
                    transitionToNext: {
                        to: 'C',
                        fretMove: 'Vuelve a posición abierta',
                        soundChange: 'Recuperas graves y resonancia',
                        difficulty: 'Fácil - vuelves a lo familiar',
                        tip: 'El ciclo CAGED completo recorre todo el diapasón'
                    }
                }
            },

            // Calculate CAGED position on fretboard based on shape and root note
            calculateCAGEDPosition(shape, root = 'C') {
                const rootIndex = this.notes.indexOf(root);
                const shapeOffsets = { 'C': 0, 'A': 3, 'G': 5, 'E': 8, 'D': 10 };
                const offset = shapeOffsets[shape] || 0;
                return (rootIndex + offset) % 12;
            },

            // Didactic comparisons between voicings
            voicingComparisons: {
                'E_shape_maj7_vs_A_shape_maj7': {
                    title: 'E shape vs A shape maj7',
                    soundDifference: 'E shape suena más brillante y espaciosa. A shape más compacta y cálida.',
                    registerDifference: 'E shape en registro bajo, A shape más condensada',
                    useCases: {
                        'E_shape_maj7': 'Usa en intros lentas, ballads. Ejemplo: "Something" - Beatles',
                        'A_shape_maj7': 'Mejor para comping jazz, más sutil. Ejemplo: acordes de bossa nova'
                    },
                    voiceLeading: 'Desde E a A shape, la 7ª mayor se mueve mínimamente - smooth transition',
                    practiceExercise: 'Toca I-vi-ii-V alternando shapes. Escucha cómo cambia el carácter.'
                },
                'C_shape_major_vs_E_shape_major_barre': {
                    title: 'Open C vs Barre E shape',
                    soundDifference: 'C abierta: resonante, armónicos naturales. E barre: controlada, sin aire.',
                    registerDifference: 'C abierta solo funciona en C. E shape puedes moverla a cualquier tono.',
                    useCases: {
                        'C_shape_major': 'Canciones acústicas, folk. Máxima resonancia.',
                        'E_shape_major_barre': 'Rock, pop. Cuando necesitas cambiar de tonalidad.'
                    },
                    voiceLeading: 'E shape tiene raíz en bajo (cuerda 6). C shape en cuerda 5.',
                    practiceExercise: 'Toca C-F-G primero todo abierto, luego todo con barres. Nota la diferencia.'
                },
                'low_register_vs_high_register': {
                    title: 'Registro bajo vs alto (mismo acorde)',
                    soundDifference: 'Registro bajo: potente, lleno, "big". Alto: brillante, cortante, "thin".',
                    registerDifference: 'El mismo Cmaj7 suena totalmente diferente en traste 0 vs traste 10',
                    useCases: {
                        'E_shape_maj7': 'Bajo: intros, versos, fundamento',
                        'D_shape_maj7': 'Alto: solos, highlights, cortes en la mezcla'
                    },
                    voiceLeading: 'Para crear movimiento en una progresión, alterna registros',
                    practiceExercise: 'Toca I-IV-V subiendo de registro. Traste 0→5→10. Escucha el viaje.'
                },
                'Drop2_vs_Open': {
                    title: 'Drop 2 vs Open Voicing',
                    soundDifference: 'Drop 2: compacto, controlado, jazz. Open: espacioso, resonante, folk.',
                    registerDifference: 'Drop 2 en mid-register. Open usa cuerdas al aire.',
                    useCases: {
                        'Drop2_Cmaj7_root': 'Jazz comping, voice leading preciso',
                        'C_shape_maj7': 'Folk, pop, máxima resonancia'
                    },
                    voiceLeading: 'Drop 2 permite smooth voice leading. Open chords saltan más.',
                    practiceExercise: 'ii-V-I en drop 2 (minimal movement) vs open (big jumps)'
                },
                'sus2_vs_sus4': {
                    title: 'sus2 vs sus4: ¿cuál suena más moderna?',
                    soundDifference: 'sus2: abierta, ambigua, moderna. sus4: clásica, quiere resolver.',
                    registerDifference: 'sus2 suena "indie/alt". sus4 suena "classic rock".',
                    useCases: {
                        'Csus2': 'Indie, alt-rock, sonido flotante. Ejemplo: The Police',
                        'Csus4': 'Classic rock, folk, resolución dramática. Ejemplo: "Pinball Wizard"'
                    },
                    voiceLeading: 'sus4 → major es clásico. sus2 se queda suspendida.',
                    practiceExercise: 'Csus2 - C - Csus2 (indie vibe) vs Csus4 - C (rock vibe)'
                },
                'maj7_vs_dom7': {
                    title: 'maj7 vs dom7: smooth vs tension',
                    soundDifference: 'maj7: lush, smooth, stable. dom7: tensa, quiere resolver.',
                    registerDifference: 'maj7 = I chord. dom7 = V chord.',
                    useCases: {
                        'E_shape_maj7': 'Tónica, ending, smooth. "no necesita ir a ningún lado"',
                        'E_shape_dom7': 'Dominante, V chord, "necesita resolver"'
                    },
                    voiceLeading: 'dom7 → I es la resolución más fuerte en armonía',
                    practiceExercise: 'Cmaj7 (reposa) vs C7 (tensa). C7 → Fmaj7 (resuelve)'
                },
                '9_vs_add9': {
                    title: '9 vs add9: extensión vs adición',
                    soundDifference: '9: incluye la 7ª, más complejo. add9: solo añade color, más simple.',
                    registerDifference: 'C9 tiene C-E-G-Bb-D. Cadd9 tiene C-E-G-D.',
                    useCases: {
                        'C9': 'Funk, R&B, necesitas la tensión de la 7ª',
                        'Cadd9': 'Pop, indie, quieres color sin tensión'
                    },
                    voiceLeading: 'C9 funciona como dominante. Cadd9 como tónica colorida.',
                    practiceExercise: 'C9 → F (funkea). Cadd9 → Amadd9 (pop moderno)'
                },
                'jazz_vs_rock_voicing': {
                    title: 'Jazz voicing vs Rock voicing (mismo acorde)',
                    soundDifference: 'Jazz: drop 2, compact, mid-register. Rock: open/barre, full, extremos.',
                    registerDifference: 'Jazz evita extremos. Rock los abraza.',
                    useCases: {
                        'Drop2_Cmaj7_root': 'Jazz: clarity, no mud, voice leading',
                        'C_shape_major': 'Rock: full, powerful, no te importa el voice leading'
                    },
                    voiceLeading: 'Jazz: cada nota importa. Rock: el "chunk" completo importa.',
                    practiceExercise: 'Mismo progresión, dos estilos diferentes'
                },
                'bright_vs_dark': {
                    title: 'Voicing brillante vs oscura',
                    soundDifference: 'Brillante: muchas cuerdas al aire, agudos. Oscura: graves, spacing cerrado.',
                    registerDifference: 'Brightness no es solo pitch, es spacing de intervalos',
                    useCases: {
                        'G_shape_major': 'Brillante: feliz, energética. Ejemplo: "Here Comes The Sun"',
                        'Dm_shape': 'Oscura: melancólica, densa. Ejemplo: "Hurt" - Johnny Cash'
                    },
                    voiceLeading: 'Para journey emocional, ve de dark → bright',
                    practiceExercise: 'Am (oscuro) → Asus2 (brillante). Mismo root, mood opuesto.'
                },
                'simple_vs_complex': {
                    title: 'Tríada simple vs Acorde de 13ª',
                    soundDifference: 'Tríada: clara, definida, directa. 13th: rica, colorida, ambigua.',
                    registerDifference: 'Simple: 3 notas. Complejo: 6-7 notas.',
                    useCases: {
                        'C_shape_major': 'Cuando quieres claridad. Punk, power pop.',
                        'Cmaj13': 'Cuando quieres color. Jazz, neo-soul, ending lush.'
                    },
                    voiceLeading: 'Más notas = más color, pero menos clarity',
                    practiceExercise: 'Simplifica progresión compleja. Luego hazla compleja. Escucha el trade-off.'
                },
                'power_chord_vs_full_barre': {
                    title: 'Power Chord (5) vs Full Barre',
                    soundDifference: 'Power: neutral, heavy, sin 3ª. Barre: full, mayor/menor definido.',
                    registerDifference: 'Power chord no es mayor ni menor - ambiguo',
                    useCases: {
                        'C5_power': 'Metal, punk, heavy. Distorsión friendly.',
                        'E_shape_major_barre': 'Rock, pop. Cuando quieres armonía clara.'
                    },
                    voiceLeading: 'Power chords con distorsión = clarity. Full chords = mud.',
                    practiceExercise: 'Riff en power chords. Luego full barre. Con distorsión, escucha qué pasa.'
                },
                'hendrix_chord': {
                    title: '7#9 (Hendrix) - El acorde imposible',
                    soundDifference: 'Combina 3ª mayor y menor simultáneamente. "Blue note" en acorde.',
                    registerDifference: 'Funciona en blues, funk, rock. Muy característico.',
                    useCases: {
                        'E7sharp9': 'Purple Haze. Blues-rock. Hendrix signature.',
                        'E_shape_dom7': 'Blues normal, más tradicional.'
                    },
                    voiceLeading: 'Úsalo como dominante con extra edge',
                    practiceExercise: 'E7#9 → A7. Classic Hendrix move. Escucha la tensión.'
                }
            },

            // Sound journey explanations
            soundJourneys: {
                'register_journey': {
                    title: 'Viaje por registros: mismo acorde, diferentes alturas',
                    explanation: 'El mismo Cmaj7 suena completamente diferente en registro bajo vs alto',
                    steps: [
                        {
                            voicing: 'E_shape_maj7',
                            fret: 0,
                            description: 'Registro bajo - sonido lleno, "big", perfecto para intro',
                            feeling: 'Cálido, envolvente, como un abrazo sonoro'
                        },
                        {
                            voicing: 'A_shape_maj7',
                            fret: 3,
                            description: 'Registro medio - balance perfecto, uso general',
                            feeling: 'Natural, conversacional, como hablar'
                        },
                        {
                            voicing: 'D_shape_major',
                            fret: 10,
                            description: 'Registro alto - brillante, cortante, para solos',
                            feeling: 'Agudo, penetrante, como un grito'
                        }
                    ],
                    exercise: 'Toca una progresión I-IV-V subiendo por registros. Escucha cómo el mood cambia.',
                    realExample: 'Hotel California alterna registros para crear movimiento'
                },
                'brightness_journey': {
                    title: 'De oscuro a brillante: cambiando el color',
                    explanation: 'Mismo acorde, diferente "color" o "brillo"',
                    steps: [
                        {
                            voicing: 'Dm_shape',
                            brightness: 4,
                            description: 'Oscuro - notas graves, spacing cerrado',
                            emotion: 'Melancólico, introspectivo, triste'
                        },
                        {
                            voicing: 'Am_shape',
                            brightness: 5,
                            description: 'Neutro - balance entre graves y agudos',
                            emotion: 'Pensativo, reflexivo'
                        },
                        {
                            voicing: 'Em_shape',
                            brightness: 6,
                            description: 'Brillante - más cuerdas al aire, armónicos',
                            emotion: 'Esperanzador, menos pesado'
                        }
                    ],
                    exercise: 'Toca Dm → Am → Em escuchando cómo "se ilumina" el sonido',
                    realExample: 'Pink Floyd usa voicings oscuros para momentos pesados, brillantes para climax'
                },
                'complexity_journey': {
                    title: 'De simple a complejo: añadiendo color',
                    explanation: 'Mismo root, pero añadimos extensiones gradualmente',
                    steps: [
                        {
                            voicing: 'C_shape_major',
                            description: 'Tríada simple - C, E, G. Clara, directa.',
                            feeling: 'Sencillo, honesto, power pop'
                        },
                        {
                            voicing: 'C_shape_maj7',
                            description: 'Añade 7ª mayor (B). Suena más sofisticado.',
                            feeling: 'Smooth, jazzy, pero aún accesible'
                        },
                        {
                            voicing: 'Cmaj9',
                            description: 'Añade 9ª (D). Color moderno.',
                            feeling: 'Lush, neo-soul, contemporáneo'
                        },
                        {
                            voicing: 'C11',
                            description: 'Añade 11ª (F). Mucha tensión.',
                            feeling: 'Modal, ambiguo, fusion'
                        },
                        {
                            voicing: 'Cmaj13',
                            description: 'Máxima extensión. Todas las notas disponibles.',
                            feeling: 'Extremadamente colorido, casi demasiado'
                        }
                    ],
                    exercise: 'Toca C → Cmaj7 → Cmaj9 → C11 → Cmaj13. Escucha cómo se va llenando de color.',
                    realExample: 'Steely Dan usa extensiones extremas. The Ramones solo power chords. Ambos válidos.'
                },
                'tension_journey': {
                    title: 'De estable a tenso: journey emocional',
                    explanation: 'Cómo crear tensión armónica progresivamente',
                    steps: [
                        {
                            voicing: 'C_shape_maj7',
                            description: 'Inicio: Cmaj7. Totalmente estable, home.',
                            feeling: 'Relajado, en paz, resolved'
                        },
                        {
                            voicing: 'C_shape_dom7',
                            description: 'C7: añade tensión (7ª menor), quiere moverse.',
                            feeling: 'Ligeramente inquieto, quiere resolver'
                        },
                        {
                            voicing: 'C7sus4',
                            description: 'C7sus4: quita la 3ª, añade 4ª. Ambiguo.',
                            feeling: 'Suspendido, en el aire'
                        },
                        {
                            voicing: 'C7flat9',
                            description: 'C7b9: alteración cromática. Dark.',
                            feeling: 'Tense, inquietante, necesita resolver YA'
                        },
                        {
                            voicing: 'C7sharp9',
                            description: 'C7#9: blue note, clash disonante.',
                            feeling: 'Máxima tensión, bluesy, casi doloroso'
                        }
                    ],
                    exercise: 'Cmaj7 → C7 → C7#9 → Fmaj7. Tensión crece, luego resuelve. Dramático.',
                    realExample: 'Hendrix usa 7#9 para máxima tensión antes de resolver'
                },
                'genre_journey': {
                    title: 'Journey por géneros: Folk → Rock → Jazz → Metal',
                    explanation: 'Cómo el mismo acorde cambia de personalidad',
                    steps: [
                        {
                            voicing: 'C_shape_major',
                            genre: 'Folk',
                            description: 'Open C. Cuerdas al aire, acústica.',
                            feeling: 'Cálido, familiar, campfire songs'
                        },
                        {
                            voicing: 'E_shape_major_barre',
                            genre: 'Rock',
                            description: 'Barre completo. Eléctrica, drive.',
                            feeling: 'Powerful, controlado, arena rock'
                        },
                        {
                            voicing: 'Drop2_Cmaj7_root',
                            genre: 'Jazz',
                            description: 'Drop 2. Comping, mid-register, no extremos.',
                            feeling: 'Sophisticated, urbano, smoky club'
                        },
                        {
                            voicing: 'C5_power',
                            genre: 'Metal',
                            description: 'Power chord. Sin 3ª, con distorsión.',
                            feeling: 'Brutal, heavy, mosh pit'
                        }
                    ],
                    exercise: 'Mismo progresión I-IV-V en 4 estilos. Escucha cómo voicings definen género.',
                    realExample: 'I-V-vi-IV: "Let It Be" (folk) vs "Smells Like Teen Spirit" (rock) - mismos acordes, voicings diferentes'
                }
            },

            // Practical scenarios
            practicalScenarios: {
                'writing_ballad': {
                    title: 'Escribiendo una balada',
                    situation: 'Quieres un intro emotiva en C',
                    options: [
                        {
                            voicing: 'E_shape_maj7',
                            why: 'Apertura amplia, sonido lleno, muy emotivo',
                            example: 'Como "Let It Be" - Beatles'
                        },
                        {
                            voicing: 'G_shape_major',
                            why: 'Más brillante, optimista, menos dramático',
                            example: 'Como "Good Riddance" - Green Day'
                        }
                    ],
                    recommendation: 'Prueba E shape maj7 para intro, luego G shape para verso'
                },
                'funk_rhythm': {
                    title: 'Groove funk',
                    situation: 'Necesitas acordes percusivos y funky',
                    options: [
                        {
                            voicing: 'C9',
                            why: 'Tensión de 9ª, spacing perfecto para muting',
                            example: 'Como Nile Rodgers - Chic'
                        },
                        {
                            voicing: 'A_shape_m7',
                            why: 'Forma compacta, fácil de mutear',
                            example: 'Como John Frusciante - RHCP'
                        }
                    ],
                    recommendation: 'Usa 9ths y 7ths en shapes medios (fret 5-12) para mejor groove'
                },
                'jazz_comping': {
                    title: 'Comping jazz',
                    situation: 'ii-V-I en Cmaj, quieres smooth voice leading',
                    options: [
                        {
                            progression: 'Dm7 (fret 5, A shape) → G7 (fret 3, E shape) → Cmaj7 (fret 3, A shape)',
                            why: 'Movimiento mínimo, notas comunes se mantienen',
                            example: 'Como Joe Pass'
                        },
                        {
                            progression: 'Dm7 (fret 10, drop 2) → G7 (fret 10, drop 2) → Cmaj7 (fret 8, drop 2)',
                            why: 'Todas en mismo registro, muy smooth',
                            example: 'Como Wes Montgomery'
                        }
                    ],
                    recommendation: 'Para empezar, usa shapes en frets 3-7, son más cómodas'
                },
                'rock_power_intro': {
                    title: 'Intro épica de rock',
                    situation: 'Quieres una apertura poderosa, tipo arena rock',
                    options: [
                        {
                            voicing: 'E_shape_major_barre',
                            why: 'Barre completo en registro bajo. Máximo power.',
                            example: 'Como "Smells Like Teen Spirit" - Nirvana'
                        },
                        {
                            voicing: 'C5_power',
                            why: 'Power chord con distorsión. Brutal, directo.',
                            example: 'Como "Enter Sandman" - Metallica'
                        }
                    ],
                    recommendation: 'Power chord para metal/punk. Full barre para classic rock.'
                },
                'bossa_nova_comping': {
                    title: 'Comping bossa nova',
                    situation: 'Quieres ese sonido suave, brasileño',
                    options: [
                        {
                            voicing: 'A_shape_maj7',
                            why: 'Voicing compacto, fácil de mutear para síncopa',
                            example: 'Como João Gilberto - "Girl from Ipanema"'
                        },
                        {
                            voicing: 'Drop2_Cmaj7_3rd',
                            why: 'Inversión smooth, sonido sofisticado',
                            example: 'Como Stan Getz - "Desafinado"'
                        }
                    ],
                    recommendation: 'Usa maj7, m7, dom7 en mid-register. Evita open strings para control.'
                },
                'blues_progression': {
                    title: 'Blues en G (I-IV-V)',
                    situation: 'Progresión 12-bar blues, qué voicings usar',
                    options: [
                        {
                            progression: 'G7 (open) → C7 (open) → D7 (open)',
                            why: 'Blues tradicional. Máxima resonancia.',
                            example: 'Como Robert Johnson - acoustic blues'
                        },
                        {
                            progression: 'G7 (barre fret 3) → C7 (barre fret 8) → D7 (barre fret 10)',
                            why: 'Blues eléctrico. Todas barres, más controlado.',
                            example: 'Como B.B. King - electric blues'
                        },
                        {
                            progression: 'G7#9 → C7#9 → D7#9',
                            why: 'Hendrix-style. Máxima tensión bluesy.',
                            example: 'Como "Red House" - Jimi Hendrix'
                        }
                    ],
                    recommendation: 'Acoustic blues: open. Electric blues: barres. Hendrix style: 7#9.'
                },
                'neo_soul_chords': {
                    title: 'Acordes neo-soul modernos',
                    situation: 'Quieres ese sonido D\'Angelo / Erykah Badu',
                    options: [
                        {
                            voicing: 'Amadd9',
                            why: 'Color moderno sin demasiada tensión',
                            example: 'Como D\'Angelo - "Brown Sugar"'
                        },
                        {
                            voicing: 'Dm9',
                            why: 'Extensión lush, muy neo-soul',
                            example: 'Como Erykah Badu - "On & On"'
                        },
                        {
                            voicing: 'Drop2_Cm7_root',
                            why: 'Jazz voicing aplicado a R&B',
                            example: 'Como Robert Glasper'
                        }
                    ],
                    recommendation: 'Usa add9, maj9, m9. Evita tríadas simples. Mid-to-high register.'
                },
                'ambient_shoegaze': {
                    title: 'Texturas ambient/shoegaze',
                    situation: 'Quieres acordes espaciosos, etéreos',
                    options: [
                        {
                            voicing: 'Cmaj9_rich',
                            why: 'Máxima apertura, muchas cuerdas al aire',
                            example: 'Como My Bloody Valentine - "Only Shallow"'
                        },
                        {
                            voicing: 'Asus2',
                            why: 'Suspendida, flotante, ambigua',
                            example: 'Como Slowdive - "Alison"'
                        },
                        {
                            voicing: 'D_shape_maj7',
                            why: 'High register, shimmery',
                            example: 'Como Sigur Rós'
                        }
                    ],
                    recommendation: 'Open strings, sus2, maj9, delay/reverb. Deja que suenen.'
                },
                'metal_riff': {
                    title: 'Riff de metal pesado',
                    situation: 'Necesitas clarity con distorsión extrema',
                    options: [
                        {
                            voicing: 'C5_power',
                            why: 'Sin 3ª = no mud. Perfect para distorsión.',
                            example: 'Como Black Sabbath - "Iron Man"'
                        },
                        {
                            voicing: 'E_shape_major_barre',
                            why: 'Full chord = mud con distorsión. Evitar.',
                            example: 'NO hagas esto en metal extremo'
                        }
                    ],
                    recommendation: 'Con distorsión alta: power chords ONLY. Evita 3ªs y extensiones.'
                },
                'singer_songwriter': {
                    title: 'Cantautor acústico',
                    situation: 'Guitarra + voz, quieres acompañamiento simple pero bonito',
                    options: [
                        {
                            voicing: 'C_shape_major',
                            why: 'Open C. Simple, resonante, no compites con la voz.',
                            example: 'Como Ed Sheeran - "Thinking Out Loud"'
                        },
                        {
                            voicing: 'Cadd9',
                            why: 'Un poco más de color, pero aún simple',
                            example: 'Como John Mayer - "Your Body Is A Wonderland"'
                        },
                        {
                            voicing: 'Drop2_Cmaj7_root',
                            why: 'Demasiado complejo para cantautor simple. Evitar.',
                            example: 'Guarda esto para jazz instrumental'
                        }
                    ],
                    recommendation: 'Open chords + ocasional add9. Mantén simple, deja espacio a la voz.'
                },
                'indie_alternative': {
                    title: 'Indie/Alternative vibes',
                    situation: 'Quieres sonido The Smiths, Radiohead, Arctic Monkeys',
                    options: [
                        {
                            voicing: 'Asus2',
                            why: 'Jangly, open, signature indie sound',
                            example: 'Como The Smiths - "How Soon Is Now"'
                        },
                        {
                            voicing: 'Dadd9',
                            why: 'Bright, high register, cutting',
                            example: 'Como Radiohead - "Creep"'
                        },
                        {
                            voicing: 'A_shape_major_high',
                            why: 'High voicing sin bajos',
                            example: 'Como Arctic Monkeys - riffs agudos'
                        }
                    ],
                    recommendation: 'sus2, add9, high voicings. Evita bass-heavy chords.'
                },
                'reggae_ska': {
                    title: 'Reggae/Ska upstrokes',
                    situation: 'Ese "chunk-chunk" característico',
                    options: [
                        {
                            voicing: 'E_shape_major_barre',
                            why: 'Barre completo, fácil de mutear para staccato',
                            example: 'Como Bob Marley - "Three Little Birds"'
                        },
                        {
                            voicing: 'A_shape_major',
                            why: 'Mid-register, percusivo',
                            example: 'Como The Skatalites'
                        }
                    ],
                    recommendation: 'Barres en mid-register. Upstrokes en offbeat. Heavy muting.'
                }
            },

            // Genre-specific tips
            genreTips: {
                'jazz': {
                    preferredVoicings: ['Drop2_Cmaj7_root', 'Drop2_C7_root', 'Drop2_Cm7_root', 'A_shape_m7', 'Drop2_Cm7b5_root'],
                    avoidVoicings: ['C_shape_major', 'G_shape_major', 'C5_power'],
                    registerPreference: 'mid',
                    explanation: 'Jazz usa voicings compactos en registros medios para clarity. Drop 2 voicings son el estándar.',
                    tips: [
                        'Evita cuerdas al aire - pierdes control de voice leading',
                        'Usa inversiones para smooth voice leading',
                        'Mid-register (frets 3-12) para no pelear con bajo',
                        'Extensions (9, 11, 13) son esenciales'
                    ],
                    famousSongs: [
                        'Autumn Leaves - usa drop 2 voicings',
                        'Girl from Ipanema - maj7 y m7 en mid-register'
                    ]
                },
                'blues': {
                    preferredVoicings: ['E_shape_dom7', 'A_shape_dom7', 'C_shape_dom7', 'E7sharp9', 'C7flat9'],
                    avoidVoicings: ['Cmaj9', 'Drop2_Cmaj7_root', 'Cmaj13'],
                    registerPreference: 'low',
                    explanation: 'Blues usa dominantes 7ths y variantes alteradas. Open chords en acoustic, barres en electric.',
                    tips: [
                        'Dom7 es el acorde fundamental del blues',
                        '7#9 (Hendrix chord) para extra bluesy feel',
                        'Acoustic blues: open chords. Electric: barres.',
                        'Bends y slides entre voicings son clave'
                    ],
                    famousSongs: [
                        'Red House - Hendrix usa 7#9 extensively',
                        'Sweet Home Chicago - progresión clásica I7-IV7-V7'
                    ]
                },
                'funk': {
                    preferredVoicings: ['C9', 'C7sus4', 'A_shape_m7', 'Drop2_C7_root'],
                    avoidVoicings: ['C_shape_major', 'G_shape_major', 'Cmaj9_rich'],
                    registerPreference: 'mid',
                    explanation: 'Funk necesita voicings compactos que se pueden mutear fácilmente para groove percusivo.',
                    tips: [
                        '9ths y 7sus4 son los acordes funk signature',
                        'Mid-register (frets 5-12) para mejor muting',
                        'Compact voicings - evita cuerdas al aire',
                        'El muting es TAN importante como las notas'
                    ],
                    famousSongs: [
                        'Le Freak - Nile Rodgers usa 9ths compactos',
                        'Give It Away - Frusciante, m7 shapes en mid-register'
                    ]
                },
                'metal': {
                    preferredVoicings: ['C5_power', 'A5_power', 'E_shape_minor_barre'],
                    avoidVoicings: ['Cmaj13', 'C9', 'Amadd9', 'Drop2_Cmaj7_root'],
                    registerPreference: 'low',
                    explanation: 'Metal con distorsión alta necesita power chords (sin 3ª) para evitar mud.',
                    tips: [
                        'Power chords ONLY con distorsión extrema',
                        'Full chords = mud. 3ªs y extensions se vuelven disonantes.',
                        'Low register para heaviness',
                        'Palm muting para tight rhythm'
                    ],
                    famousSongs: [
                        'Master of Puppets - todos power chords',
                        'Iron Man - riff clásico en power chords'
                    ]
                },
                'folk': {
                    preferredVoicings: ['C_shape_major', 'G_shape_major', 'D_shape_major', 'Am_shape', 'Em_shape'],
                    avoidVoicings: ['Drop2_Cmaj7_root', 'C7sharp9', 'C5_power'],
                    registerPreference: 'low',
                    explanation: 'Folk abraza open chords con cuerdas al aire para máxima resonancia acústica.',
                    tips: [
                        'Open chords = folk sound',
                        'Cuerdas al aire dan ese ring característico',
                        'Simple es mejor - tríadas, no extensions',
                        'Capo para cambiar tonalidad sin perder open strings'
                    ],
                    famousSongs: [
                        'Blowin in the Wind - todas open chords',
                        'Fast Car - Cadd9, G, Em, D - simple pero efectivo'
                    ]
                },
                'indie': {
                    preferredVoicings: ['Asus2', 'Cadd9', 'Dadd9', 'A_shape_major_high', 'D_shape_maj7'],
                    avoidVoicings: ['C5_power', 'Drop2_C7_root', 'C_shape_dom7'],
                    registerPreference: 'mid-high',
                    explanation: 'Indie usa sus2, add9 y high voicings para ese sonido jangly y moderno.',
                    tips: [
                        'sus2 es THE indie chord',
                        'add9 en vez de maj7 para color sin jazz',
                        'High voicings para jangly sound',
                        'Evita bass-heavy chords'
                    ],
                    famousSongs: [
                        'How Soon Is Now - Asus2 signature riff',
                        'Creep - voicings en high register'
                    ]
                },
                'neo-soul': {
                    preferredVoicings: ['Amadd9', 'Dm9', 'Am9', 'Drop2_Cm7_root', 'Cmaj9'],
                    avoidVoicings: ['C_shape_major', 'C5_power', 'E_shape_major_barre'],
                    registerPreference: 'mid',
                    explanation: 'Neo-soul combina jazz harmony con R&B groove - extensions son esenciales.',
                    tips: [
                        'add9, maj9, m9 son signature neo-soul',
                        'Drop 2 voicings de jazz aplicados a R&B',
                        'Evita tríadas simples',
                        'Voice leading smooth entre acordes'
                    ],
                    famousSongs: [
                        'Brown Sugar - D\'Angelo usa add9 extensively',
                        'On & On - Erykah Badu, m9 y maj9'
                    ]
                },
                'pop': {
                    preferredVoicings: ['C_shape_major', 'Cadd9', 'E_shape_major_barre', 'A_shape_major'],
                    avoidVoicings: ['Drop2_Cmaj7_root', 'C7sharp9', 'Cmaj13'],
                    registerPreference: 'low-mid',
                    explanation: 'Pop usa voicings simples y familiares - clarity sobre complejidad.',
                    tips: [
                        'Simple chords - todo el mundo las conoce',
                        'Ocasional add9 para color moderno',
                        'Barres para cambios de tonalidad',
                        'Melody está en la voz, no sobre-compliques'
                    ],
                    famousSongs: [
                        'Let It Be - open chords clásicas',
                        'Thinking Out Loud - mix de open y add9'
                    ]
                },
                'ambient': {
                    preferredVoicings: ['Cmaj9_rich', 'Asus2', 'D_shape_maj7', 'Csus2', 'Am9'],
                    avoidVoicings: ['C5_power', 'C_shape_dom7', 'E7sharp9'],
                    registerPreference: 'spread',
                    explanation: 'Ambient busca espaciosidad y textura - open voicings con muchas cuerdas al aire.',
                    tips: [
                        'Máximas cuerdas al aire posibles',
                        'sus2, maj9 - sonidos flotantes',
                        'Deja que los acordes respiren - mucho sustain',
                        'Delay/reverb son parte del voicing'
                    ],
                    famousSongs: [
                        'Only Shallow - My Bloody Valentine',
                        'Alison - Slowdive, sus2 textures'
                    ]
                },
                'country': {
                    preferredVoicings: ['C_shape_major', 'G_shape_major', 'D_shape_major', 'A_shape_dom7', 'E_shape_dom7'],
                    avoidVoicings: ['Drop2_Cmaj7_root', 'C7sharp9', 'Amadd9'],
                    registerPreference: 'low',
                    explanation: 'Country usa open chords y dom7s - sonido bright y twangy.',
                    tips: [
                        'Open chords con cuerdas al aire',
                        'Dom7 shapes para V chords',
                        'High register D shapes para chicken pickin',
                        'Bright tone - usa tríadas simples'
                    ],
                    famousSongs: [
                        'Jolene - todas open chords',
                        'Friends in Low Places - progresión simple'
                    ]
                }
            },

            // Emotional qualities mapping for Progression Builder
            emotionalQualities: {
                'misterioso': {
                    name: 'Misterioso',
                    description: 'Sonidos ambiguos, modales, con tensión suspendida',
                    brightness: [1, 4],
                    tension: ['medium', 'high'],
                    preferredQualities: ['m7', 'm7b5', 'sus2', 'dim', 'min'],
                    avoidQualities: ['maj', 'maj7'],
                    modes: ['phrygian', 'locrian', 'dorian'],
                    examples: 'Como "Riders on the Storm" - The Doors'
                },
                'abierto': {
                    name: 'Abierto/Espacioso',
                    description: 'Sonidos con aire, cuerdas al aire, reverberación',
                    brightness: [7, 10],
                    tension: ['low'],
                    preferredQualities: ['maj', 'sus2', 'add9'],
                    avoidQualities: ['dim', 'm7b5', '7'],
                    voicingPreference: 'open chords con cuerdas al aire',
                    examples: 'Como "Wonderwall" - Oasis'
                },
                'alegre': {
                    name: 'Alegre/Brillante',
                    description: 'Mayor, optimista, energético',
                    brightness: [6, 9],
                    tension: ['low'],
                    preferredQualities: ['maj', 'maj7'],
                    avoidQualities: ['min', 'dim'],
                    modes: ['ionian', 'lydian', 'mixolydian'],
                    examples: 'Como "Don\'t Stop Believin\'" - Journey'
                },
                'melancólico': {
                    name: 'Melancólico/Triste',
                    description: 'Menor, introspectivo, emotivo',
                    brightness: [2, 5],
                    tension: ['low', 'medium'],
                    preferredQualities: ['min', 'm7'],
                    avoidQualities: ['maj', 'maj7'],
                    modes: ['aeolian', 'phrygian', 'dorian'],
                    examples: 'Como "Hurt" - Johnny Cash'
                },
                'tenso': {
                    name: 'Tenso/Dramático',
                    description: 'Disonancia, acordes alterados, inestabilidad',
                    brightness: [3, 7],
                    tension: ['high'],
                    preferredQualities: ['dim', '7', 'm7b5'],
                    avoidQualities: ['maj', 'maj7'],
                    examples: 'Como "Black Hole Sun" - Soundgarden'
                }
            },

            // Harmonic transitions explained
            harmonicTransitions: {
                'I-IV': {
                    function: 'T→SD',
                    feeling: 'Movimiento hacia afuera, expansión',
                    brightness_change: 1,
                    tension_change: 0,
                    examples: ['Let It Be - Beatles (C→F)', 'Wonderwall - Oasis (Em→G)'],
                    voiceLeadingTip: 'Nota común en cuerda G, movimiento suave'
                },
                'I-V': {
                    function: 'T→D',
                    feeling: 'Tensión, pregunta, anticipación',
                    brightness_change: 0,
                    tension_change: 1,
                    examples: ['Sweet Home Alabama (D→A)', 'Wild Thing (A→E)'],
                    voiceLeadingTip: 'Raíz salta quinta, muy estable'
                },
                'V-I': {
                    function: 'D→T',
                    feeling: 'Resolución, llegada a casa, cierre',
                    brightness_change: 0,
                    tension_change: -2,
                    examples: ['Cualquier cadencia perfecta', 'Final de canciones clásicas'],
                    voiceLeadingTip: 'La más fuerte resolución en música occidental'
                },
                'I-vi': {
                    function: 'T→Tm',
                    feeling: 'Giro melancólico, de mayor a menor',
                    brightness_change: -2,
                    tension_change: 0,
                    examples: ['50s Progression (C→Am)', 'Stand By Me'],
                    voiceLeadingTip: 'Notas comunes, cambio sutil'
                },
                'IV-I': {
                    function: 'SD→T',
                    feeling: 'Resolución plagal, "Amén", conclusión suave',
                    brightness_change: -1,
                    tension_change: 0,
                    examples: ['Hey Jude - Beatles (ending)', 'Let It Be'],
                    voiceLeadingTip: 'Menos dramático que V→I, más modal'
                },
                'vi-IV': {
                    function: 'Tm→SD',
                    feeling: 'Esperanza emergiendo de tristeza',
                    brightness_change: 2,
                    tension_change: 0,
                    examples: ['Axis of Awesome 4 chords (vi-IV-I-V)'],
                    voiceLeadingTip: 'Salto descendente suave de tercera'
                },
                'ii-V': {
                    function: 'SD→D',
                    feeling: 'Setup de jazz, preparación para resolución',
                    brightness_change: 0,
                    tension_change: 1,
                    examples: ['Autumn Leaves', 'All the Things You Are'],
                    voiceLeadingTip: 'Movimiento de 4ta, smooth voice leading'
                },
                'I-ii': {
                    function: 'T→SD',
                    feeling: 'Suave, íntimo, movimiento pequeño',
                    brightness_change: -1,
                    tension_change: 0,
                    examples: ['The Scientist - Coldplay'],
                    voiceLeadingTip: 'Cambio mínimo, muy smooth'
                },
                'V-vi': {
                    function: 'D→Tm',
                    feeling: 'Cadencia rota, sorpresa, evita resolución',
                    brightness_change: -1,
                    tension_change: -1,
                    examples: ['Creep - Radiohead'],
                    voiceLeadingTip: 'Evita la tónica esperada, giro inesperado'
                }
            },

            // Obtener armonización de cualquier escala
            getScaleHarmonization(root, scaleType) {
                const cacheKey = `harmonization_${root}_${scaleType}`;
                return this._memoize(() => {
                    const scale = this.getScale(root, scaleType);
                    const formula = this.scales[scaleType];
                    const triads = [];

                    for (let degree = 0; degree < scale.length; degree++) {
                        const rootNote = scale[degree].note;
                        const rootInterval = formula[degree];

                        // Buscar la 3ª (2 grados arriba en la escala)
                        const thirdDegree = (degree + 2) % scale.length;
                        const thirdNote = scale[thirdDegree].note;
                        const thirdInterval = (formula[thirdDegree] - rootInterval + 12) % 12;

                        // Buscar la 5ª (4 grados arriba en la escala)
                        const fifthDegree = (degree + 4) % scale.length;
                        const fifthNote = scale[fifthDegree].note;
                        const fifthInterval = (formula[fifthDegree] - rootInterval + 12) % 12;

                        // Determinar calidad del acorde
                        let quality;
                        if (thirdInterval === 4 && fifthInterval === 7) quality = 'maj';
                        else if (thirdInterval === 3 && fifthInterval === 7) quality = 'min';
                        else if (thirdInterval === 3 && fifthInterval === 6) quality = 'dim';
                        else if (thirdInterval === 4 && fifthInterval === 8) quality = 'aug';
                        else if (thirdInterval === 2 && fifthInterval === 7) quality = 'sus2';
                        else if (thirdInterval === 5 && fifthInterval === 7) quality = 'sus4';
                        else quality = '?';

                        triads.push({
                            degree: degree + 1,
                            root: rootNote,
                            third: thirdNote,
                            fifth: fifthNote,
                            quality: quality,
                            intervals: { third: thirdInterval, fifth: fifthInterval }
                        });
                    }

                    return triads;
                }, cacheKey);
            },

            // Comparar dos escalas
            compareScales(scale1Type, scale2Type) {
                const cacheKey = `compare_${scale1Type}_${scale2Type}`;
                return this._memoize(() => {
                    const formula1 = this.scales[scale1Type];
                    const formula2 = this.scales[scale2Type];

                    const common = formula1.filter(n => formula2.includes(n));
                    const onlyIn1 = formula1.filter(n => !formula2.includes(n));
                    const onlyIn2 = formula2.filter(n => !formula1.includes(n));

                    return {
                        common: common,
                        onlyInFirst: onlyIn1,
                        onlyInSecond: onlyIn2,
                        similarity: (common.length / Math.max(formula1.length, formula2.length) * 100).toFixed(0)
                    };
                }, cacheKey);
            },

            // Obtener escala padre y grado
            getParentInfo(scaleType) {
                const info = this.scaleInfo[scaleType];
                if (!info || !info.parentScale) return null;

                return {
                    parentScale: info.parentScale,
                    degree: info.degree,
                    parentName: this.scaleInfo[info.parentScale]?.name || info.parentScale
                };
            },

            // Interval names
            intervalNames: {
                0: '1 (T)',
                1: '2m',
                2: '2M',
                3: '3m',
                4: '3M',
                5: '4J',
                6: 'TT',
                7: '5J',
                8: '6m',
                9: '6M',
                10: '7m',
                11: '7M',
                12: '8J'
            },

            // Scale degree names
            degreeNames: ['1', '2', '3', '4', '5', '6', '7'],

            // Chord qualities for major scale harmonization
            chordQualities: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
            romanNumerals: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],

            // Get note name from index
            getNoteName(index) {
                return this.notes[(index % 12 + 12) % 12];
            },

            // Enharmonic equivalents map (flat → sharp notation used internally)
            _enharmonicMap: {
                'Cb': 'B',  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E',
                'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
                'B#': 'C',  'E#': 'F'
            },

            // Get note index from name (handles flat enharmonics)
            getNoteIndex(name) {
                if (!name) return -1;
                const normalized = this._enharmonicMap[name] ?? name;
                return this.notes.indexOf(normalized);
            },

            // Calculate interval between two notes
            getInterval(note1, note2) {
                const idx1 = typeof note1 === 'number' ? note1 : this.getNoteIndex(note1);
                const idx2 = typeof note2 === 'number' ? note2 : this.getNoteIndex(note2);
                return ((idx2 - idx1) % 12 + 12) % 12;
            },

            // Get scale notes from root and scale type
            getScale(root, scaleType) {
                const cacheKey = `scale_${root}_${scaleType}`;
                return this._memoize(() => {
                    const rootIndex = typeof root === 'number' ? root : this.getNoteIndex(root);
                    const formula = this.scales[scaleType];
                    return formula.map(interval => ({
                        note: this.getNoteName(rootIndex + interval),
                        interval: interval,
                        degree: formula.indexOf(interval) + 1
                    }));
                }, cacheKey);
            },

            // Get triad from scale degree
            getTriad(root, scaleType, degree) {
                const scale = this.getScale(root, scaleType);
                const rootIndex = degree - 1;
                const thirdIndex = (rootIndex + 2) % 7;
                const fifthIndex = (rootIndex + 4) % 7;

                return {
                    root: scale[rootIndex],
                    third: scale[thirdIndex],
                    fifth: scale[fifthIndex],
                    quality: this.chordQualities[rootIndex],
                    roman: this.romanNumerals[rootIndex]
                };
            },

            // Get all triads for a scale
            getScaleTriads(root, scaleType) {
                return [1, 2, 3, 4, 5, 6, 7].map(degree => this.getTriad(root, scaleType, degree));
            },

            // Get mode from parent scale
            getMode(parentRoot, modeNumber) {
                const parentScale = this.getScale(parentRoot, 'major');
                const modeRoot = parentScale[modeNumber - 1].note;
                const modeNames = ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'minor', 'locrian'];
                return {
                    root: modeRoot,
                    scale: this.getScale(modeRoot, modeNames[modeNumber - 1]),
                    name: modeNames[modeNumber - 1]
                };
            },

            // Circle of fifths order
            circleOfFifths: [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], // C, G, D, A, E, B, F#, C#, G#, D#, A#, F
            circleOfFifthsLabels: ['C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'],

            // Get relative minor
            getRelativeMinor(majorRoot) {
                return (majorRoot + 9) % 12; // 3 semitones down = 9 semitones up
            },

            // Get relative major
            getRelativeMajor(minorRoot) {
                return (minorRoot + 3) % 12;
            },

            // Seventh chord formulas from scale degree
            seventhChordFormulas: {
                1: [0, 4, 7, 11],  // maj7
                2: [0, 3, 7, 10],  // m7
                3: [0, 3, 7, 10],  // m7
                4: [0, 4, 7, 11],  // maj7
                5: [0, 4, 7, 10],  // dom7
                6: [0, 3, 7, 10],  // m7
                7: [0, 3, 6, 10],  // m7b5 (half-diminished)
            },

            seventhChordNames: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'ø7'],

            // Get seventh chord from scale degree
            getSeventhChord(root, degree) {
                const scale = this.getScale(root, 'major');
                const chordRoot = scale[degree - 1].note;
                const chordRootIndex = this.getNoteIndex(chordRoot);
                const formula = this.seventhChordFormulas[degree];

                return {
                    root: chordRoot,
                    notes: formula.map(interval => ({
                        note: this.getNoteName(chordRootIndex + interval),
                        interval: interval
                    })),
                    quality: this.seventhChordNames[degree - 1],
                    degree: degree
                };
            },

            // CAGED system shapes (positions relative to root on specific strings)
            cagedShapes: {
                'C': {
                    name: 'Forma C',
                    // Positions: [string][fret relative to root position]
                    positions: [
                        { string: 0, fret: 0, degree: 1 },   // E string - root
                        { string: 1, fret: 1, degree: 5 },   // B string
                        { string: 2, fret: 0, degree: 3 },   // G string
                        { string: 3, fret: 2, degree: 1 },   // D string - root
                        { string: 4, fret: 3, degree: 5 },   // A string
                        { string: 5, fret: -1, degree: null }, // E string - muted
                    ],
                    rootString: 4, // Root on A string
                    description: 'Tónica en cuerda 5 (A)'
                },
                'A': {
                    name: 'Forma A',
                    positions: [
                        { string: 0, fret: 0, degree: 5 },
                        { string: 1, fret: 2, degree: 1 },   // root
                        { string: 2, fret: 2, degree: 5 },
                        { string: 3, fret: 2, degree: 1 },   // root
                        { string: 4, fret: 0, degree: 1 },   // root
                        { string: 5, fret: -1, degree: null },
                    ],
                    rootString: 4,
                    description: 'Tónica en cuerda 5 (A)'
                },
                'G': {
                    name: 'Forma G',
                    positions: [
                        { string: 0, fret: 3, degree: 1 },   // root
                        { string: 1, fret: 0, degree: 3 },
                        { string: 2, fret: 0, degree: 1 },   // root
                        { string: 3, fret: 0, degree: 5 },
                        { string: 4, fret: 2, degree: 3 },
                        { string: 5, fret: 3, degree: 1 },   // root
                    ],
                    rootString: 5,
                    description: 'Tónica en cuerda 6 (E)'
                },
                'E': {
                    name: 'Forma E',
                    positions: [
                        { string: 0, fret: 0, degree: 1 },   // root
                        { string: 1, fret: 0, degree: 5 },
                        { string: 2, fret: 1, degree: 3 },
                        { string: 3, fret: 2, degree: 1 },   // root
                        { string: 4, fret: 2, degree: 5 },
                        { string: 5, fret: 0, degree: 1 },   // root
                    ],
                    rootString: 5,
                    description: 'Tónica en cuerda 6 (E)'
                },
                'D': {
                    name: 'Forma D',
                    positions: [
                        { string: 0, fret: 2, degree: 3 },
                        { string: 1, fret: 3, degree: 1 },   // root
                        { string: 2, fret: 2, degree: 5 },
                        { string: 3, fret: 0, degree: 1 },   // root
                        { string: 4, fret: -1, degree: null },
                        { string: 5, fret: -1, degree: null },
                    ],
                    rootString: 3,
                    description: 'Tónica en cuerda 4 (D)'
                }
            },

            // Interval info for level 1 improvements
            intervalInfo: {
                1: { name: '2ª menor', semitones: 1, character: 'Disonante, tensión extrema', consonance: 'Disonante', quality: 'menor', alternativeName: 'Semitono', consonanceLevel: 'strong-dissonant', examples: 'Jaws theme, Pink Panther' },
                2: { name: '2ª Mayor', semitones: 2, character: 'Paso melódico, neutro', consonance: 'Disonante suave', quality: 'Mayor', alternativeName: 'Tono entero', consonanceLevel: 'mild-dissonant', examples: 'Happy Birthday (primeras notas)' },
                3: { name: '3ª menor', semitones: 3, character: 'Triste, melancólico', consonance: 'Consonante imperfecta', quality: 'menor', alternativeName: null, consonanceLevel: 'imperfect-consonant', examples: 'Greensleeves, Hey Jude' },
                4: { name: '3ª Mayor', semitones: 4, character: 'Alegre, brillante', consonance: 'Consonante imperfecta', quality: 'Mayor', alternativeName: null, consonanceLevel: 'imperfect-consonant', examples: 'When the Saints, Kumbaya' },
                5: { name: '4ª Justa', semitones: 5, character: 'Suspensión, apertura', consonance: 'Consonante perfecta', quality: 'Justa', alternativeName: null, consonanceLevel: 'perfect-consonant', examples: 'Here Comes the Bride, Amazing Grace' },
                6: { name: 'Tritono', semitones: 6, character: 'Diabólico, inestable', consonance: 'Disonante', quality: 'aumentada/disminuida', alternativeName: '4ª Aumentada / 5ª Disminuida', consonanceLevel: 'strong-dissonant', examples: 'The Simpsons, Maria (West Side Story)' },
                7: { name: '5ª Justa', semitones: 7, character: 'Poder, estabilidad', consonance: 'Consonante perfecta', quality: 'Justa', alternativeName: null, consonanceLevel: 'perfect-consonant', examples: 'Star Wars, Twinkle Twinkle' },
                8: { name: '6ª menor', semitones: 8, character: 'Dramático, intenso', consonance: 'Consonante imperfecta', quality: 'menor', alternativeName: null, consonanceLevel: 'imperfect-consonant', examples: 'The Entertainer, Love Story' },
                9: { name: '6ª Mayor', semitones: 9, character: 'Romántico, dulce', consonance: 'Consonante imperfecta', quality: 'Mayor', alternativeName: null, consonanceLevel: 'imperfect-consonant', examples: 'NBC theme, My Bonnie' },
                10: { name: '7ª menor', semitones: 10, character: 'Bluesy, con tensión', consonance: 'Disonante suave', quality: 'menor', alternativeName: null, consonanceLevel: 'mild-dissonant', examples: 'Star Trek theme, Watermelon Man' },
                11: { name: '7ª Mayor', semitones: 11, character: 'Soñador, jazz', consonance: 'Disonante', quality: 'Mayor', alternativeName: null, consonanceLevel: 'strong-dissonant', examples: 'Take on Me, Superman theme' },
                12: { name: '8ª Justa (Octava)', semitones: 12, character: 'Identidad perfecta, resonancia total', consonance: 'Consonante perfecta', quality: 'Justa', alternativeName: 'Octava', consonanceLevel: 'perfect-consonant', examples: 'Somewhere Over the Rainbow' }
            },

            // Extended chords for level 11
            extendedChords: {
                // 7th chords
                'maj7':      { intervals: [0, 4, 7, 11], name: 'Major 7', symbol: 'maj7', formula: '1-3-5-7', essential: true, category: 'essential', difficulty: 'easy', usage: 'Jazz, bossa nova, soul' },
                'dom7':      { intervals: [0, 4, 7, 10], name: 'Dominant 7', symbol: '7', formula: '1-3-5-b7', essential: true, category: 'essential', difficulty: 'easy', usage: 'Blues, rock, funk' },
                'min7':      { intervals: [0, 3, 7, 10], name: 'Minor 7', symbol: 'm7', formula: '1-b3-5-b7', essential: true, category: 'essential', difficulty: 'easy', usage: 'Jazz, R&B, latin' },
                'halfDim7':  { intervals: [0, 3, 6, 10], name: 'Half Diminished 7', symbol: 'ø7', formula: '1-b3-b5-b7', essential: true, category: 'essential', difficulty: 'medium', usage: 'Jazz, tensión armónica' },
                // 9th chords
                'maj9':   { intervals: [0, 4, 7, 11, 14], name: 'Major 9', symbol: 'maj9', formula: '1-3-5-7-9', essential: true, category: 'color9', difficulty: 'medium', usage: 'Jazz, neo-soul, pop sofisticado' },
                'min9':   { intervals: [0, 3, 7, 10, 14], name: 'Minor 9', symbol: 'm9', formula: '1-b3-5-b7-9', essential: true, category: 'color9', difficulty: 'medium', usage: 'Jazz, R&B, ambient' },
                'dom9':   { intervals: [0, 4, 7, 10, 14], name: 'Dominant 9', symbol: '9', formula: '1-3-5-b7-9', essential: true, category: 'color9', difficulty: 'medium', usage: 'Blues, funk, jazz' },
                '7#9':    { intervals: [0, 4, 7, 10, 15], name: 'Hendrix Chord', symbol: '7#9', formula: '1-3-5-b7-#9', essential: false, category: 'altered', difficulty: 'advanced', usage: 'Blues-rock, tensión disonante' },
                '7b9':    { intervals: [0, 4, 7, 10, 13], name: 'Dom 7 flat 9', symbol: '7b9', formula: '1-3-5-b7-b9', essential: false, category: 'altered', difficulty: 'advanced', usage: 'Jazz, resolución cromática' },
                // 11th chords
                'min11':  { intervals: [0, 3, 7, 10, 14, 17], name: 'Minor 11', symbol: 'm11', formula: '1-b3-5-b7-9-11', essential: false, category: 'suspension11', difficulty: 'medium', usage: 'Jazz modal, ambient' },
                'dom11':  { intervals: [0, 4, 7, 10, 14, 17], name: 'Dominant 11', symbol: '11', formula: '1-3-5-b7-9-11', essential: false, category: 'suspension11', difficulty: 'advanced', usage: 'Jazz, tensión suspendida' },
                'maj11':  { intervals: [0, 4, 7, 11, 14, 17], name: 'Major 11', symbol: 'maj11', formula: '1-3-5-7-9-11', essential: false, category: 'suspension11', difficulty: 'advanced', usage: 'Neo-soul, jazz contemporáneo' },
                // 13th chords
                'maj13':  { intervals: [0, 4, 7, 11, 14, 21], name: 'Major 13', symbol: 'maj13', formula: '1-3-5-7-9-13', essential: false, category: 'density13', difficulty: 'advanced', usage: 'Jazz, bossa nova avanzada' },
                'dom13':  { intervals: [0, 4, 7, 10, 14, 21], name: 'Dominant 13', symbol: '13', formula: '1-3-5-b7-9-13', essential: false, category: 'density13', difficulty: 'advanced', usage: 'Blues-jazz, funk avanzado' },
                'min13':  { intervals: [0, 3, 7, 10, 14, 21], name: 'Minor 13', symbol: 'm13', formula: '1-b3-5-b7-9-13', essential: false, category: 'density13', difficulty: 'advanced', usage: 'Jazz modal avanzado' },
            },

            extendedVoicings: {
                // 7th chords - múltiples voicings
                'maj7_voicings': [
                    { frets: [0, 2, 1, 1, 0, 0], shape: 'E', difficulty: 'easy', name: 'Forma E abierta' },
                    { frets: [-1, 3, 2, 0, 0, 0], shape: 'A', difficulty: 'easy', name: 'Forma A abierta' },
                    { frets: [-1, -1, 2, 4, 4, 4], shape: 'D', difficulty: 'medium', name: 'Drop 2 en D' }
                ],
                'dom7_voicings': [
                    { frets: [0, 2, 0, 1, 0, 0], shape: 'E', difficulty: 'easy', name: 'Forma E abierta' },
                    { frets: [-1, 0, 2, 0, 2, 0], shape: 'A', difficulty: 'easy', name: 'Forma A abierta' },
                    { frets: [-1, -1, 1, 2, 1, 2], shape: 'D', difficulty: 'medium', name: 'Forma D cerrada' }
                ],
                'min7_voicings': [
                    { frets: [0, 2, 0, 0, 0, 0], shape: 'E', difficulty: 'easy', name: 'Forma E abierta' },
                    { frets: [-1, 0, 2, 2, 1, 3], shape: 'A', difficulty: 'medium', name: 'Forma A' },
                    { frets: [-1, -1, 0, 2, 1, 1], shape: 'D', difficulty: 'easy', name: 'Forma D abierta' }
                ],
                'halfDim7_voicings': [
                    { frets: [0, 1, 0, 0, 0, 0], shape: 'E', difficulty: 'easy', name: 'Forma E abierta' },
                    { frets: [-1, 0, 1, 2, 1, 3], shape: 'A', difficulty: 'medium', name: 'Forma A' }
                ],
                // 9th chords
                'maj9_voicings': [
                    { frets: [-1, 0, 2, 1, 2, 0], shape: 'A', difficulty: 'medium', name: 'Forma A abierta' },
                    { frets: [0, 2, 1, 1, 0, 2], shape: 'E', difficulty: 'medium', name: 'Forma E con 9ª' },
                    { frets: [-1, -1, 2, 4, 3, 4], shape: 'D', difficulty: 'advanced', name: 'Drop 2' }
                ],
                'min9_voicings': [
                    { frets: [-1, 0, 2, 0, 2, 0], shape: 'A', difficulty: 'medium', name: 'Forma A abierta' },
                    { frets: [0, 2, 0, 0, 0, 2], shape: 'E', difficulty: 'medium', name: 'Forma E con 9ª' }
                ],
                'dom9_voicings': [
                    { frets: [0, 2, 0, 1, 0, 2], shape: 'E', difficulty: 'medium', name: 'Forma E con 9ª' },
                    { frets: [-1, 0, 2, 0, 3, 3], shape: 'A', difficulty: 'medium', name: 'Forma A' },
                    { frets: [-1, -1, 2, 1, 3, 3], shape: 'D', difficulty: 'advanced', name: 'Drop 2' }
                ],
                '7#9_voicings': [
                    { frets: [0, 2, 1, 2, 0, -1], shape: 'E', difficulty: 'advanced', name: 'Hendrix voicing' },
                    { frets: [-1, 0, 2, 1, 3, -1], shape: 'A', difficulty: 'advanced', name: 'Forma A' }
                ],
                '7b9_voicings': [
                    { frets: [0, 2, 1, 2, 1, -1], shape: 'E', difficulty: 'advanced', name: 'Forma E' },
                    { frets: [-1, 0, 2, 0, 2, 1], shape: 'A', difficulty: 'advanced', name: 'Forma A' }
                ],
                // 11th chords
                'min11_voicings': [
                    { frets: [-1, 0, 0, 0, 0, 0], shape: 'A', difficulty: 'easy', name: 'Am11 abierto' },
                    { frets: [0, 0, 0, 0, 1, 0], shape: 'E', difficulty: 'easy', name: 'Em11 abierto' }
                ],
                'dom11_voicings': [
                    { frets: [-1, 0, 0, 1, 0, 0], shape: 'A', difficulty: 'medium', name: 'Forma A' },
                    { frets: [0, 0, 0, 0, 1, 1], shape: 'E', difficulty: 'medium', name: 'Forma E' }
                ],
                'maj11_voicings': [
                    { frets: [-1, 0, 0, 1, 2, 0], shape: 'A', difficulty: 'advanced', name: 'Forma A' }
                ],
                // 13th chords
                'maj13_voicings': [
                    { frets: [-1, 0, 2, 1, 2, 2], shape: 'A', difficulty: 'advanced', name: 'Forma A' },
                    { frets: [0, 2, 1, 1, 2, 2], shape: 'E', difficulty: 'advanced', name: 'Forma E' }
                ],
                'dom13_voicings': [
                    { frets: [0, 2, 0, 1, 2, 0], shape: 'E', difficulty: 'advanced', name: 'Forma E' },
                    { frets: [-1, 0, 2, 0, 3, 2], shape: 'A', difficulty: 'advanced', name: 'Forma A' }
                ],
                'min13_voicings': [
                    { frets: [-1, 0, 2, 0, 2, 2], shape: 'A', difficulty: 'advanced', name: 'Forma A' }
                ],
            },

            // Secondary dominants for level 12
            secondaryDominants: {
                'ii':  { target: 2, rootOffset: 9, name: 'V de ii', roman: 'V/ii', example: 'A7 → Dm (en C)', targetChord: 'ii' },
                'iii': { target: 3, rootOffset: 11, name: 'V de iii', roman: 'V/iii', example: 'B7 → Em (en C)', targetChord: 'iii' },
                'IV':  { target: 4, rootOffset: 0, name: 'V de IV', roman: 'V/IV', example: 'C7 → F (en C)', targetChord: 'IV' },
                'V':   { target: 5, rootOffset: 2, name: 'V de V', roman: 'V/V', example: 'D7 → G (en C)', targetChord: 'V' },
                'vi':  { target: 6, rootOffset: 4, name: 'V de vi', roman: 'V/vi', example: 'E7 → Am (en C)', targetChord: 'vi' },
            },

            secondaryProgressions: [
                { name: 'V/V → V → I', degrees: ['V/V', 'V', 'I'], description: 'Cadencia extendida - muy común en clásica y pop' },
                { name: 'I → V/vi → vi', degrees: ['I', 'V/vi', 'vi'], description: 'Dramatiza la llegada al vi (relativo menor)' },
                { name: 'I → V/ii → ii → V → I', degrees: ['I', 'V/ii', 'ii', 'V', 'I'], description: 'ii-V secundario - típico del jazz' },
            ],

            // Quiz questions for level 10
            quizQuestions: {
                intervals: {
                    easy: [
                        { q: '¿Qué intervalo hay entre C y E?', a: '3ª Mayor', options: ['3ª menor', '3ª Mayor', '4ª Justa', '2ª Mayor'] },
                        { q: '¿Qué intervalo hay entre C y G?', a: '5ª Justa', options: ['4ª Justa', '5ª Justa', '6ª Mayor', '3ª Mayor'] },
                        { q: '¿Cuántos semitonos tiene una 4ª Justa?', a: '5', options: ['4', '5', '6', '7'] },
                        { q: '¿Qué intervalo es el más consonante?', a: '5ª Justa', options: ['2ª menor', '5ª Justa', 'Tritono', '7ª Mayor'] },
                    ],
                    medium: [
                        { q: 'El tritono equivale a:', a: '6 semitonos', options: ['5 semitonos', '6 semitonos', '7 semitonos', '4 semitonos'] },
                        { q: '¿Qué intervalo hay entre D y Bb?', a: '6ª menor', options: ['5ª Justa', '6ª menor', '6ª Mayor', '7ª menor'] },
                        { q: '¿Qué intervalo es característico de los acordes mayores?', a: '3ª Mayor', options: ['3ª menor', '3ª Mayor', '2ª Mayor', '4ª Justa'] },
                    ],
                    hard: [
                        { q: '¿Qué intervalo invertido da una 6ª Mayor?', a: '3ª menor', options: ['3ª Mayor', '3ª menor', '2ª Mayor', '7ª menor'] },
                        { q: '¿Cuántos semitonos hay entre F# y Eb?', a: '9', options: ['8', '9', '10', '11'] },
                    ]
                },
                scales: {
                    easy: [
                        { q: '¿Cuántas notas tiene la escala mayor?', a: '7', options: ['5', '6', '7', '8'] },
                        { q: '¿Qué escala usa solo teclas blancas empezando en C?', a: 'C Mayor', options: ['A menor', 'C Mayor', 'G Mayor', 'F Mayor'] },
                        { q: '¿Cuántas notas tiene la pentatónica?', a: '5', options: ['4', '5', '6', '7'] },
                    ],
                    medium: [
                        { q: '¿Qué escala tiene #4 como nota característica?', a: 'Lidio', options: ['Mixolidio', 'Lidio', 'Dórico', 'Frigio'] },
                        { q: '¿Qué escala tiene b2 como nota característica?', a: 'Frigio', options: ['Dórico', 'Lidio', 'Frigio', 'Locrio'] },
                        { q: '¿Qué nota diferencia la menor armónica de la natural?', a: '7ª Mayor', options: ['6ª Mayor', '7ª Mayor', '2ª menor', '4ª aumentada'] },
                    ],
                    hard: [
                        { q: '¿Qué escala es el VII grado de la menor melódica?', a: 'Alterada', options: ['Locrio', 'Alterada', 'Lidio Dom', 'Frigio Dom'] },
                        { q: '¿Cuántas escalas disminuidas (T-S) existen?', a: '3', options: ['2', '3', '4', '6'] },
                    ]
                },
                chords: {
                    easy: [
                        { q: '¿Qué notas tiene un acorde de C Mayor?', a: 'C-E-G', options: ['C-D-E', 'C-E-G', 'C-F-G', 'C-Eb-G'] },
                        { q: '¿Qué tipo de acorde es el ii en una escala mayor?', a: 'menor', options: ['Mayor', 'menor', 'disminuido', 'aumentado'] },
                        { q: '¿Cuál es el V de C Mayor?', a: 'G', options: ['F', 'G', 'D', 'A'] },
                    ],
                    medium: [
                        { q: '¿Qué grado de la escala mayor es disminuido?', a: 'vii°', options: ['ii', 'iii', 'vi', 'vii°'] },
                        { q: '¿Qué intervalos forman un acorde menor?', a: '1-b3-5', options: ['1-3-5', '1-b3-5', '1-3-#5', '1-b3-b5'] },
                    ],
                    hard: [
                        { q: '¿Qué acorde es 1-b3-b5?', a: 'disminuido', options: ['menor', 'disminuido', 'semidisminuido', 'menor 7'] },
                        { q: '¿Qué nota añade un maj7 a la tríada?', a: '7ª Mayor', options: ['7ª menor', '7ª Mayor', '9ª', '6ª'] },
                    ]
                },
                modes: {
                    easy: [
                        { q: '¿Cuál es el primer modo de la escala mayor?', a: 'Jónico', options: ['Dórico', 'Jónico', 'Lidio', 'Eólico'] },
                        { q: '¿Qué modo es igual a la escala menor natural?', a: 'Eólico', options: ['Dórico', 'Frigio', 'Eólico', 'Locrio'] },
                        { q: '¿Cuántos modos tiene la escala mayor?', a: '7', options: ['5', '6', '7', '8'] },
                    ],
                    medium: [
                        { q: '¿Qué modo tiene sonido "español/flamenco"?', a: 'Frigio', options: ['Dórico', 'Frigio', 'Lidio', 'Mixolidio'] },
                        { q: '¿Qué modo suena más "brillante"?', a: 'Lidio', options: ['Frigio', 'Locrio', 'Lidio', 'Dórico'] },
                        { q: '¿D Dórico tiene las mismas notas que...?', a: 'C Mayor', options: ['D Mayor', 'C Mayor', 'G Mayor', 'A menor'] },
                    ],
                    hard: [
                        { q: '¿Qué modo se usa sobre acordes m7b5?', a: 'Locrio', options: ['Dórico', 'Frigio', 'Eólico', 'Locrio'] },
                        { q: '¿Qué modo es el IV de la menor melódica?', a: 'Lidio Dominante', options: ['Lidio', 'Mixolidio', 'Lidio Dominante', 'Alterada'] },
                    ]
                },
                theory: {
                    easy: [
                        { q: '¿Cuántos semitonos hay en una octava?', a: '12', options: ['7', '10', '12', '14'] },
                        { q: '¿Qué progresión es I-V-vi-IV?', a: 'Pop Universal', options: ['Blues', 'Pop Universal', 'Jazz', 'Flamenco'] },
                        { q: '¿Qué significa "relativo menor"?', a: 'Menor que comparte notas', options: ['Menor paralelo', 'Menor que comparte notas', 'Menor un tono abajo', 'Menor armónica'] },
                    ],
                    medium: [
                        { q: '¿Qué es un dominante secundario?', a: 'V de un grado que no es I', options: ['V del I', 'V de un grado que no es I', 'VII del I', 'bVII'] },
                        { q: '¿Qué acorde resuelve por tritono al I?', a: 'SubV', options: ['V', 'IV', 'SubV', 'ii'] },
                    ],
                    hard: [
                        { q: '¿Qué es una cadencia plagal?', a: 'IV → I', options: ['V → I', 'IV → I', 'ii → V', 'vi → I'] },
                        { q: '¿Cuál es el tritono sustituto de G7?', a: 'Db7', options: ['C7', 'Db7', 'Ab7', 'F7'] },
                    ]
                }
            },

            // Ear Training data for level 14
            earTraining: {
                intervals: {
                    easy: [
                        { semitones: 4, name: '3ª Mayor', abbr: '3M', tip: 'Sonido alegre, como "Oh When the Saints"' },
                        { semitones: 5, name: '4ª Justa', abbr: '4J', tip: 'Como el inicio de "Here Comes the Bride"' },
                        { semitones: 7, name: '5ª Justa', abbr: '5J', tip: 'Vacío y poderoso, como el power chord' },
                        { semitones: 12, name: '8ª (Octava)', abbr: '8J', tip: 'Misma nota, una octava arriba' }
                    ],
                    medium: [
                        { semitones: 2, name: '2ª Mayor', abbr: '2M', tip: 'Paso de escala, muy cercano' },
                        { semitones: 3, name: '3ª menor', abbr: '3m', tip: 'Sonido triste o melancólico' },
                        { semitones: 9, name: '6ª Mayor', abbr: '6M', tip: 'Romántico, como "My Way"' },
                        { semitones: 10, name: '7ª menor', abbr: '7m', tip: 'Tensión que pide resolución' },
                        { semitones: 11, name: '7ª Mayor', abbr: '7M', tip: 'Muy tenso, jazz/sofisticado' }
                    ],
                    hard: [
                        { semitones: 1, name: '2ª menor', abbr: '2m', tip: 'Tiburón - muy tenso y cercano' },
                        { semitones: 6, name: 'Tritono (4ªAum/5ªDim)', abbr: 'TT', tip: 'El intervalo del diablo, máxima tensión' },
                        { semitones: 8, name: '6ª menor', abbr: '6m', tip: 'Nostálgico, como "The Entertainer"' },
                        { semitones: 13, name: '9ª Mayor', abbr: '9M', tip: 'Octava + 2ª Mayor' },
                        { semitones: 14, name: '9ª menor', abbr: '9m', tip: 'Octava + 2ª menor (blues)' },
                        { semitones: 15, name: '10ª menor', abbr: '10m', tip: 'Octava + 3ª menor' },
                        { semitones: 16, name: '10ª Mayor', abbr: '10M', tip: 'Octava + 3ª Mayor' }
                    ]
                },

                // Chord Quality Recognition
                chordQualities: {
                    easy: [
                        { intervals: [0, 4, 7], name: 'Mayor', abbr: 'M', tip: 'Alegre y estable' },
                        { intervals: [0, 3, 7], name: 'Menor', abbr: 'm', tip: 'Triste y melancólico' }
                    ],
                    medium: [
                        { intervals: [0, 3, 6], name: 'Disminuido', abbr: 'dim', tip: 'Tenso e inestable' },
                        { intervals: [0, 4, 8], name: 'Aumentado', abbr: 'aug', tip: 'Suspensión misteriosa' },
                        { intervals: [0, 2, 7], name: 'Sus2', abbr: 'sus2', tip: 'Abierto y flotante' },
                        { intervals: [0, 5, 7], name: 'Sus4', abbr: 'sus4', tip: 'Suspensión que pide resolución' }
                    ],
                    hard: [
                        { intervals: [0, 4, 7, 11], name: 'Mayor 7', abbr: 'maj7', tip: 'Sofisticado y jazzy' },
                        { intervals: [0, 3, 7, 10], name: 'Menor 7', abbr: 'm7', tip: 'Melancólico pero suave' },
                        { intervals: [0, 4, 7, 10], name: 'Dominante 7', abbr: '7', tip: 'Tensión que resuelve' },
                        { intervals: [0, 3, 6, 10], name: 'Semidisminuido', abbr: 'm7b5', tip: 'Modo locrio, muy tenso' },
                        { intervals: [0, 3, 6, 9], name: 'Disminuido 7', abbr: 'dim7', tip: 'Simétrico y muy tenso' },
                        { intervals: [0, 4, 7, 9], name: 'Mayor 6', abbr: '6', tip: 'Alegre vintage' },
                        { intervals: [0, 3, 7, 11], name: 'Menor(maj7)', abbr: 'm(maj7)', tip: 'Armónico menor, misterioso' },
                        { intervals: [0, 4, 7, 10, 13], name: 'Dominante 7b9', abbr: '7b9', tip: 'Muy tenso, blues/metal' },
                        { intervals: [0, 2, 7, 11], name: 'Sus2(maj7)', abbr: 'sus2(maj7)', tip: 'Lydian, etéreo' }
                    ]
                },

                // Progression Identification
                progressions: {
                    easy: [
                        { pattern: ['I', 'IV', 'V'], name: 'I-IV-V', tip: 'La progresión más básica del rock/blues' },
                        { pattern: ['I', 'V', 'vi', 'IV'], name: 'I-V-vi-IV', tip: 'Pop universal - miles de hits' },
                        { pattern: ['I', 'vi', 'IV', 'V'], name: 'I-vi-IV-V', tip: '50s progression, doo-wop' },
                        { pattern: ['vi', 'IV', 'I', 'V'], name: 'vi-IV-I-V', tip: 'Empieza en menor, muy dramático' }
                    ],
                    medium: [
                        { pattern: ['ii', 'V', 'I'], name: 'ii-V-I', tip: 'Cadencia de jazz, la más importante' },
                        { pattern: ['I', 'vi', 'ii', 'V'], name: 'I-vi-ii-V', tip: 'Circle progression, jazz clásico' },
                        { pattern: ['I', 'bVII', 'IV'], name: 'I-bVII-IV', tip: 'Mixolidio, rock modal' },
                        { pattern: ['i', 'bVI', 'bVII'], name: 'i-bVI-bVII', tip: 'Metal natural minor' },
                        { pattern: ['vi', 'IV', 'I', 'V'], name: 'vi-IV-I-V', tip: 'Empieza en relativo menor' }
                    ],
                    hard: [
                        { pattern: ['i', 'bVI', 'bIII', 'bVII'], name: 'i-bVI-bIII-bVII', tip: 'Progresión épica moderna' },
                        { pattern: ['I', 'bII', 'bVII', 'I'], name: 'I-bII-bVII-I', tip: 'Phrygian dominant, metal/oriental' },
                        { pattern: ['ii', 'V', 'I', 'vi'], name: 'ii-V-I-vi', tip: 'Jazz con deceptive cadence' },
                        { pattern: ['I', 'IV', 'bVII', 'IV'], name: 'I-IV-bVII-IV', tip: 'Dorian vamp, modal' },
                        { pattern: ['i', 'iv', 'i', 'V'], name: 'i-iv-i-V', tip: 'Menor natural, funk/soul' }
                    ]
                },

                // Melodic Dictation Patterns
                melodicPatterns: {
                    easy: [
                        { notes: [0, 2, 4, 2], name: 'Ascenso-Descenso', tip: 'Do-Re-Mi-Re' },
                        { notes: [0, 0, 4, 4], name: 'Terceras Repetidas', tip: 'Do-Do-Mi-Mi' },
                        { notes: [7, 5, 4, 0], name: 'Descenso Escala', tip: 'Sol-Fa-Mi-Do' },
                        { notes: [0, 4, 7, 4], name: 'Arpegio Mayor', tip: 'Do-Mi-Sol-Mi' }
                    ],
                    medium: [
                        { notes: [0, 3, 5, 7], name: 'Pentatónica Menor', tip: 'Patrón blues básico' },
                        { notes: [0, 7, 5, 3], name: 'Descenso Pentatónico', tip: 'Do-Sol-Fa-Mib' },
                        { notes: [0, 2, 5, 7], name: 'Saltos Amplios', tip: 'Intervalos grandes' },
                        { notes: [7, 9, 11, 12], name: 'Ascenso Alto', tip: 'Sol-La-Si-Do' }
                    ],
                    hard: [
                        { notes: [0, 1, 4, 6], name: 'Cromático + Salto', tip: 'Approach notes jazzísticos' },
                        { notes: [0, 7, 3, 10], name: 'Intervalos Amplios', tip: '5ª, 3m, 7m' },
                        { notes: [0, 11, 9, 7], name: 'Descenso Cromático', tip: 'Do-Si-La-Sol' },
                        { notes: [0, 4, 9, 14], name: 'Arpegio Extendido', tip: 'Do-Mi-La-Re' }
                    ]
                },

                // Rhythmic Dictation Patterns
                rhythmicPatterns: {
                    easy: [
                        { hits: [1, 0, 1, 0, 1, 0, 1, 0], name: 'Quarter Notes', tip: 'Negras simples' },
                        { hits: [1, 1, 1, 1, 1, 1, 1, 1], name: 'Eighth Notes', tip: 'Corcheas constantes' },
                        { hits: [1, 0, 0, 1, 0, 0, 1, 0], name: 'Dotted Quarter', tip: 'Negra con puntillo' },
                        { hits: [1, 1, 0, 1, 1, 0, 1, 0], name: 'Simple Syncopation', tip: 'Síncopa básica' }
                    ],
                    medium: [
                        { hits: [1, 0, 1, 1, 0, 1, 0, 1], name: 'Shuffle/Swing', tip: 'Feeling ternario' },
                        { hits: [1, 1, 1, 0, 1, 1, 0, 1], name: 'Funk Syncopation', tip: 'Síncopa funk' },
                        { hits: [1, 0, 0, 1, 1, 0, 0, 1], name: 'Triplet Feel', tip: 'Tresillos implícitos' },
                        { hits: [1, 1, 0, 0, 1, 1, 1, 0], name: 'Latin Clave', tip: 'Patrón de clave' }
                    ],
                    hard: [
                        { hits: [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1], name: 'Sixteenth Funk', tip: 'Semicorcheas con síncopa' },
                        { hits: [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0], name: 'Complex Latin', tip: 'Ritmo latino complejo' },
                        { hits: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0], name: 'Polyrhythmic', tip: 'Acentos polirítmicos' },
                        { hits: [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1], name: 'Advanced Syncopation', tip: 'Síncopa avanzada' }
                    ]
                }
            },

            // Backing Tracks for level 15
            backingTracks: [
                {
                    id: 'blues-12bar',
                    name: '12-Bar Blues Shuffle',
                    bpm: 90,
                    key: 0,
                    progression: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
                    scale: 'blues',
                    style: 'Blues',
                    feel: 'Shuffle',
                    description: 'Blues clásico en 12 compases. Perfecto para practicar licks, bends y vibrato.'
                },
                {
                    id: 'blues-slow',
                    name: 'Slow Blues',
                    bpm: 60,
                    key: 0,
                    progression: ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
                    scale: 'pentatonicMinor',
                    style: 'Blues',
                    feel: 'Ballad',
                    description: 'Blues lento estilo B.B. King. Enfócate en la expresión y el vibrato.'
                },
                {
                    id: 'rock-pop',
                    name: 'Pop Universal I-V-vi-IV',
                    bpm: 120,
                    key: 0,
                    progression: ['I', 'V', 'vi', 'IV'],
                    scale: 'pentatonicMajor',
                    style: 'Pop/Rock',
                    feel: 'Straight',
                    description: 'La progresión más famosa de todos los tiempos. Usada en miles de hits.'
                },
                {
                    id: 'rock-driving',
                    name: 'Rock Power Chords',
                    bpm: 140,
                    key: 0,
                    progression: ['I', 'bVII', 'IV', 'I'],
                    scale: 'pentatonicMinor',
                    style: 'Rock',
                    feel: 'Driving',
                    description: 'Rock energético con power chords. Perfecto para riffs agresivos.'
                },
                {
                    id: 'metal-riff',
                    name: 'Metal Riffing',
                    bpm: 160,
                    key: 0,
                    progression: ['i', 'bVI', 'bVII', 'i'],
                    scale: 'phrygian',
                    style: 'Metal',
                    feel: 'Aggressive',
                    description: 'Progresión metal con modo Frigio. Usa palm muting y downpicking.'
                },
                {
                    id: 'jazz-251',
                    name: 'Jazz Standard ii-V-I',
                    bpm: 140,
                    key: 0,
                    progression: ['ii', 'V', 'I', 'I'],
                    scale: 'major',
                    style: 'Jazz',
                    feel: 'Swing',
                    description: 'La cadencia fundamental del jazz. Practica arpegios y cromatismos.'
                },
                {
                    id: 'jazz-minor',
                    name: 'Jazz Minor ii-V-i',
                    bpm: 120,
                    key: 0,
                    progression: ['ii', 'V', 'i', 'i'],
                    scale: 'melodicMinor',
                    style: 'Jazz',
                    feel: 'Swing',
                    description: 'Progresión de jazz menor. Usa escala menor melódica sobre el i.'
                },
                {
                    id: 'funk-groove',
                    name: 'Funk 16th Notes',
                    bpm: 100,
                    key: 0,
                    progression: ['i', 'i', 'i', 'i'],
                    scale: 'pentatonicMinor',
                    style: 'Funk',
                    feel: '16th Groove',
                    description: 'Un solo acorde. Enfócate en el ritmo, ghost notes y sincopa.'
                },
                {
                    id: 'funk-7ths',
                    name: 'Funk 7th Chords',
                    bpm: 110,
                    key: 0,
                    progression: ['i', 'iv', 'i', 'V'],
                    scale: 'dorian',
                    style: 'Funk',
                    feel: 'Syncopated',
                    description: 'Funk con acordes de 7ª. Usa modo Dórico para improvisar.'
                },
                {
                    id: 'minor-epic',
                    name: 'Cinematic Epic',
                    bpm: 75,
                    key: 0,
                    progression: ['i', 'bVI', 'bIII', 'bVII'],
                    scale: 'minor',
                    style: 'Cinematográfico',
                    feel: 'Epic',
                    description: 'Progresión épica moderna. Perfecta para solos emotivos.'
                },
                {
                    id: 'latin-bossa',
                    name: 'Bossa Nova',
                    bpm: 130,
                    key: 0,
                    progression: ['I', 'ii', 'V', 'I'],
                    scale: 'major',
                    style: 'Latin',
                    feel: 'Bossa',
                    description: 'Ritmo brasileño suave. Practica acordes con 7ª y 9ª.'
                },
                {
                    id: 'latin-salsa',
                    name: 'Salsa Montuno',
                    bpm: 180,
                    key: 0,
                    progression: ['I', 'IV', 'V', 'I'],
                    scale: 'major',
                    style: 'Latin',
                    feel: 'Salsa',
                    description: 'Salsa rápida. Enfócate en notas staccato y sincopa latina.'
                },
                {
                    id: 'reggae-one-drop',
                    name: 'Reggae One Drop',
                    bpm: 80,
                    key: 0,
                    progression: ['I', 'V', 'vi', 'IV'],
                    scale: 'major',
                    style: 'Reggae',
                    feel: 'One Drop',
                    description: 'Reggae clásico. Rasguea en los tiempos 2 y 4 (offbeat).'
                },
                {
                    id: 'country-shuffle',
                    name: 'Country Shuffle',
                    bpm: 110,
                    key: 0,
                    progression: ['I', 'I', 'IV', 'I', 'V', 'IV', 'I', 'V'],
                    scale: 'pentatonicMajor',
                    style: 'Country',
                    feel: 'Shuffle',
                    description: 'Country clásico con bajo alternante. Practica chicken picking.'
                },
                {
                    id: 'grunge-alternative',
                    name: 'Grunge/Alternative',
                    bpm: 95,
                    key: 0,
                    progression: ['i', 'iv', 'bIII', 'bVI'],
                    scale: 'pentatonicMinor',
                    style: 'Grunge',
                    feel: 'Heavy',
                    description: 'Sonido grunge de los 90s. Power chords con distorsión suave.'
                }
            ],

            // Songs for level 13
            songs: [
                // METAL
                { name: 'Master of Puppets', artist: 'Metallica', key: 4, mode: 'minor', progression: ['i', 'bVI', 'bVII', 'i'], progressionChords: ['Em', 'C', 'D', 'Em'], scale: 'minor', genre: 'Thrash Metal', tips: 'Afinación estándar. Riff principal en E menor con cromatismos. Downpicking a alta velocidad.' },
                { name: 'Raining Blood', artist: 'Slayer', key: 4, mode: 'phrygian', progression: ['i', 'bII', 'i'], progressionChords: ['Em', 'F', 'Em'], scale: 'phrygian', genre: 'Thrash Metal', tips: 'Usa el modo Frigio. El bII (F) crea la tensión característica del metal extremo.' },
                { name: 'Painkiller', artist: 'Judas Priest', key: 4, mode: 'minor', progression: ['i', 'bVII', 'bVI', 'V'], progressionChords: ['Em', 'D', 'C', 'B'], scale: 'harmonicMinor', genre: 'Heavy Metal', tips: 'Menor armónica para el V mayor (B). Técnica extrema de doble bombo y velocidad.' },
                { name: 'Walk', artist: 'Pantera', key: 4, mode: 'minor', progression: ['i', 'bVII', 'bVI', 'bVII'], progressionChords: ['E5', 'D5', 'C5', 'D5'], scale: 'pentatonicMinor', genre: 'Groove Metal', tips: 'Power chords con palm mute. Groove pesado en 4/4. El groove es más importante que la velocidad.' },
                { name: 'Chop Suey!', artist: 'System of a Down', key: 7, mode: 'minor', progression: ['i', 'bVI', 'bIII', 'bVII'], progressionChords: ['Gm', 'Eb', 'Bb', 'F'], scale: 'minor', genre: 'Nu Metal', tips: 'Drop C. Cambios dinámicos extremos entre secciones suaves y pesadas.' },
                { name: 'The Trooper', artist: 'Iron Maiden', key: 4, mode: 'minor', progression: ['i', 'bVII', 'bVI', 'bVII'], progressionChords: ['Em', 'D', 'C', 'D'], scale: 'minor', genre: 'Heavy Metal', tips: 'Gallop picking característico. Harmonías de guitarras en terceras.' },
                // PROGRESIVO
                { name: 'Roundabout', artist: 'Yes', key: 4, mode: 'major', progression: ['I', 'IV', 'I', 'IV', 'V'], progressionChords: ['E', 'A', 'E', 'A', 'B'], scale: 'major', genre: 'Rock Progresivo', tips: 'Arpegio fingerpicking en E. Cambios de compás frecuentes.' },
                { name: 'Schism', artist: 'Tool', key: 2, mode: 'minor', progression: ['i', 'bVII', 'bVI'], progressionChords: ['Dm', 'C', 'Bb'], scale: 'minor', genre: 'Metal Progresivo', tips: 'Compases irregulares (5/8, 7/8). Drop D. Polirritmos complejos.' },
                { name: 'Pull Me Under', artist: 'Dream Theater', key: 4, mode: 'minor', progression: ['i', 'bVI', 'bVII', 'i'], progressionChords: ['Em', 'C', 'D', 'Em'], scale: 'minor', genre: 'Metal Progresivo', tips: 'Cambios de tempo y compás. Sección instrumental extensa con técnica avanzada.' },
                { name: 'Lateralus', artist: 'Tool', key: 2, mode: 'minor', progression: ['i', 'bVII', 'bVI', 'IV'], progressionChords: ['Dm', 'C', 'Bb', 'G'], scale: 'minor', genre: 'Metal Progresivo', tips: 'Basado en secuencia Fibonacci. Polirritmos. La estructura sigue matemáticas complejas.' },
                // ROCK
                { name: 'Comfortably Numb', artist: 'Pink Floyd', key: 11, mode: 'minor', progression: ['i', 'IV', 'bVII', 'bVI'], progressionChords: ['Bm', 'E', 'A', 'G'], scale: 'minor', genre: 'Rock Progresivo', tips: 'Solo icónico en Bm pentatónica. Bends expresivos y vibrato amplio.' },
                { name: 'Eruption', artist: 'Van Halen', key: 9, mode: 'minor', progression: ['Instrumental'], progressionChords: ['Am'], scale: 'pentatonicMinor', genre: 'Hard Rock', tips: 'Tapping, tremolo picking, whammy bar. Am pentatónica. Técnica revolucionaria.' },
                { name: 'Sweet Child O Mine', artist: "Guns N' Roses", key: 2, mode: 'major', progression: ['I', 'V', 'vi', 'IV'], progressionChords: ['D', 'A', 'Bm', 'G'], scale: 'major', genre: 'Hard Rock', tips: 'Riff en D mayor. Secuencia de arpegio icónica con string skipping.' },
                { name: 'Stairway to Heaven', artist: 'Led Zeppelin', key: 9, mode: 'minor', progression: ['i', 'bVII6', 'bVI', 'bVII'], progressionChords: ['Am', 'G/B', 'C', 'D'], scale: 'minor', genre: 'Rock', tips: 'Arpegio fingerpicking. Progresión descendente de bajo. Construcción dinámica perfecta.' },
                // BLUES
                { name: 'The Thrill Is Gone', artist: 'B.B. King', key: 11, mode: 'minor', progression: ['i', 'iv', 'i', 'V'], progressionChords: ['Bm', 'Em', 'Bm', 'F#7'], scale: 'pentatonicMinor', genre: 'Blues', tips: 'Blues menor en Bm. Vibrato y bends expresivos al estilo B.B. King. Menos notas, más sentimiento.' },
                { name: 'Cross Road Blues', artist: 'Robert Johnson', key: 9, mode: 'minor', progression: ['I', 'IV', 'I', 'V'], progressionChords: ['A', 'D', 'A', 'E'], scale: 'pentatonicMinor', genre: 'Blues', tips: 'Blues de 12 compases clásico. Fingerpicking estilo Delta Blues. Afinación abierta opcional.' },
                { name: 'Red House', artist: 'Jimi Hendrix', key: 11, mode: 'major', progression: ['I', 'IV', 'I', 'V'], progressionChords: ['B', 'E', 'B', 'F#'], scale: 'pentatonicMinor', genre: 'Blues Rock', tips: 'Blues lento en B. Bends de un tono y medio. Mezcla de pentatónica mayor y menor.' },
                // JAZZ
                { name: 'Autumn Leaves', artist: 'Joseph Kosma', key: 7, mode: 'minor', progression: ['ii', 'V', 'I', 'IV', 'vii°', 'III', 'vi'], progressionChords: ['Am7', 'D7', 'Gmaj7', 'Cmaj7', 'F#m7b5', 'B7', 'Em'], scale: 'minor', genre: 'Jazz', tips: 'Standard de jazz esencial. Progresión ii-V-I en mayor y menor. Base para improvisar con arpegios.' },
                { name: 'So What', artist: 'Miles Davis', key: 2, mode: 'dorian', progression: ['i', 'i'], progressionChords: ['Dm7', 'Ebm7'], scale: 'dorian', genre: 'Cool Jazz', tips: 'Jazz modal. 16 compases en Dm7, 8 en Ebm7, 8 en Dm7. Usa el modo Dórico.' },
                { name: 'Girl from Ipanema', artist: 'Tom Jobim', key: 5, mode: 'major', progression: ['I', 'ii', 'I', 'ii'], progressionChords: ['Fmaj7', 'G7', 'Fmaj7', 'Gb7'], scale: 'major', genre: 'Bossa Nova', tips: 'Bossa nova icónica. Ritmo sincopado brasileño. Acordes con 7ª y 9ª. Modulación cromática al puente.' },
                { name: 'Take Five', artist: 'Dave Brubeck', key: 4, mode: 'minor', progression: ['i', 'bVII', 'i', 'bVII'], progressionChords: ['Ebm', 'Bbm7', 'Ebm', 'Bbm7'], scale: 'pentatonicMinor', genre: 'Jazz', tips: 'Compás de 5/4. Ostinato de piano en Ebm. Uno de los temas de jazz más reconocibles.' },
                // FUNK/SOUL
                { name: 'Superstition', artist: 'Stevie Wonder', key: 4, mode: 'minor', progression: ['i', 'bVII', 'IV'], progressionChords: ['Ebm', 'Db', 'Ab'], scale: 'pentatonicMinor', genre: 'Funk', tips: 'Riff de clavinet icónico. Groove funk sincopado. Pentatónica menor con cromatismos.' },
                { name: 'Le Freak', artist: 'Chic', key: 9, mode: 'minor', progression: ['i', 'bVII', 'i', 'bVII'], progressionChords: ['Am7', 'G', 'Am7', 'G'], scale: 'pentatonicMinor', genre: 'Funk', tips: 'Guitarra rítmica funk con acordes parciales. Ritmo disco sincopado. Nile Rodgers style.' },
                { name: "Ain't No Sunshine", artist: 'Bill Withers', key: 9, mode: 'minor', progression: ['i', 'iv', 'V', 'i'], progressionChords: ['Am', 'Dm', 'E7', 'Am'], scale: 'minor', genre: 'Soul', tips: 'Progresión menor simple pero emotiva. Menor armónica en el V (E7). Fingerpicking suave.' },
                // POP
                { name: 'Let It Be', artist: 'The Beatles', key: 0, mode: 'major', progression: ['I', 'V', 'vi', 'IV'], progressionChords: ['C', 'G', 'Am', 'F'], scale: 'major', genre: 'Pop Rock', tips: 'Progresión I-V-vi-IV en C. Acordes abiertos básicos. Solo pentatónico sobre la progresión.' },
                { name: 'Wonderwall', artist: 'Oasis', key: 4, mode: 'minor', progression: ['i', 'bIII', 'bVII', 'IV'], progressionChords: ['Em7', 'G', 'D', 'A7sus4'], scale: 'minor', genre: 'Pop Rock', tips: 'Rasgueo constante con patrón Down-Down-Up-Up-Down-Up. Capo en traste 2. Acordes suspendidos.' },
                { name: 'Hotel California', artist: 'Eagles', key: 11, mode: 'minor', progression: ['i', 'V', 'bVII', 'IV', 'bVI', 'bIII', 'iv', 'V'], progressionChords: ['Bm', 'F#7', 'A', 'E', 'G', 'D', 'Em', 'F#7'], scale: 'harmonicMinor', genre: 'Rock', tips: 'Arpegio fingerpicking. Progresión de 8 acordes descendente. Solo final con armonías de guitarra en terceras.' },
                // FLAMENCO/LATIN
                { name: 'Entre dos Aguas', artist: 'Paco de Lucía', key: 9, mode: 'phrygian', progression: ['i', 'bII', 'bVII', 'i'], progressionChords: ['Am', 'Bb', 'G', 'Am'], scale: 'phrygian', genre: 'Flamenco', tips: 'Rumba flamenca. Técnica de pulgar y rasgueados. Modo Frigio con cadencia andaluza.' },
                { name: 'Oye Como Va', artist: 'Santana', key: 9, mode: 'dorian', progression: ['i', 'IV', 'i', 'IV'], progressionChords: ['Am7', 'D7', 'Am7', 'D7'], scale: 'dorian', genre: 'Latin Rock', tips: 'Dos acordes: Am7 y D7. Modo Dórico. Groove latino con guitarra eléctrica. Improvisación modal.' },
                { name: 'Europa', artist: 'Santana', key: 0, mode: 'minor', progression: ['i', 'bVII', 'bVI', 'V'], progressionChords: ['Cm', 'Bb', 'Ab', 'G'], scale: 'harmonicMinor', genre: 'Latin Rock', tips: 'Balada instrumental. Menor armónica para el V mayor. Vibrato y bends expresivos estilo Santana.' },
                // REGGAE
                { name: 'No Woman No Cry', artist: 'Bob Marley', key: 0, mode: 'major', progression: ['I', 'V', 'vi', 'IV'], progressionChords: ['C', 'G', 'Am', 'F'], scale: 'major', genre: 'Reggae', tips: 'Rasgueo reggae en los tiempos 2 y 4 (offbeat). Acordes abiertos. Ritmo relajado.' },
                { name: 'Three Little Birds', artist: 'Bob Marley', key: 9, mode: 'major', progression: ['I', 'IV', 'I', 'V'], progressionChords: ['A', 'D', 'A', 'E'], scale: 'major', genre: 'Reggae', tips: 'Tres acordes básicos. Strum en offbeat. Groove reggae simple y efectivo.' },
                // COUNTRY
                { name: 'Folsom Prison Blues', artist: 'Johnny Cash', key: 4, mode: 'major', progression: ['I', 'IV', 'I', 'V'], progressionChords: ['E', 'A', 'E', 'B7'], scale: 'pentatonicMinor', genre: 'Country', tips: 'Boom-chicka pattern con bajo alternante. Country blues con tren rhythm. Pentatónica con sabor country.' },
                { name: 'Jolene', artist: 'Dolly Parton', key: 0, mode: 'minor', progression: ['i', 'bIII', 'iv', 'i'], progressionChords: ['Am', 'C', 'Dm', 'Am'], scale: 'minor', genre: 'Country', tips: 'Fingerpicking rápido en Am. Ritmo urgente. Acordes menores con melodía vocal icónica.' },
                // GRUNGE/ALT
                { name: 'Smells Like Teen Spirit', artist: 'Nirvana', key: 5, mode: 'minor', progression: ['i', 'iv', 'bIII', 'bVI'], progressionChords: ['Fm', 'Bbm', 'Ab', 'Db'], scale: 'pentatonicMinor', genre: 'Grunge', tips: 'Power chords con distorsión. Dinámica suave/fuerte. Patrón rítmico simple pero efectivo.' },
                { name: 'Black Hole Sun', artist: 'Soundgarden', key: 7, mode: 'minor', progression: ['i', 'V', 'bVI', 'bII'], progressionChords: ['Gm', 'D', 'Eb', 'Ab'], scale: 'minor', genre: 'Grunge', tips: 'Acordes inusuales y oscuros. Mezcla de mayor y menor. Drop D tuning. Atmósfera surrealista.' },
                { name: 'The Scientist', artist: 'Coldplay', key: 2, mode: 'major', progression: ['vi', 'IV', 'I', 'V'], progressionChords: ['Bm', 'G', 'D', 'A'], scale: 'major', genre: 'Alternative', tips: 'Arpegio fingerpicking. Progresión emotiva empezando en vi menor. Pedal de delay para ambiente.' },
                { name: 'Seven Nation Army', artist: 'The White Stripes', key: 4, mode: 'minor', progression: ['Riff modal'], progressionChords: ['E5-G5-D5-C5-B5'], scale: 'pentatonicMinor', genre: 'Alternative Rock', tips: 'Riff icónico con octavador. E pentatónica menor. Minimalismo poderoso con dos notas.' },
                // FLAMENCO TRADICIONAL
                { name: 'Tangos de Triana', artist: 'Tradicional', key: 9, mode: 'phrygian', progression: ['i', 'bVII', 'bVI', 'V'], progressionChords: ['Am', 'G', 'F', 'E'], scale: 'phrygian', genre: 'Flamenco', tips: 'Compás de 4/4. Rasgueado flamenco con acentos en 1 y 3. Cadencia andaluza característica.' },
                { name: 'Bulerías', artist: 'Paco de Lucía', key: 9, mode: 'phrygian', progression: ['i', 'bII', 'i'], progressionChords: ['A', 'Bb', 'A'], scale: 'phrygianDominant', genre: 'Flamenco', tips: 'Compás de 12 tiempos (acentos 3-6-8-10-12). Modo Frigio dominante. Técnica de pulgar y alzapúa.' },
                { name: 'Alegrías', artist: 'Tradicional', key: 4, mode: 'major', progression: ['I', 'IV', 'V', 'I'], progressionChords: ['E', 'A', 'B7', 'E'], scale: 'major', genre: 'Flamenco', tips: 'Compás de 12 similar a soleá. E mayor con intercambios modales frigios. Palmas y jaleos.' },
                { name: 'Soleá', artist: 'Tradicional', key: 4, mode: 'phrygian', progression: ['i', 'bVII', 'bVI', 'V'], progressionChords: ['E', 'D', 'C', 'B'], scale: 'phrygian', genre: 'Flamenco', tips: 'Compás de 12 con acentos 3-6-8-10-12. E Frigio. La "madre" del flamenco. Tempo lento y majestuoso.' },
                { name: 'Rumba Gitana', artist: 'Gipsy Kings', key: 2, mode: 'phrygian', progression: ['i', 'bVII', 'bVI', 'V'], progressionChords: ['Dm', 'C', 'Bb', 'A'], scale: 'phrygian', genre: 'Rumba Flamenca', tips: 'Rumba catalana. Rasgueo: abajo-abajo-arriba-abajo-arriba. Percusión en la guitarra.' },
                // JAZZ/FUSION AVANZADO
                { name: 'All Blues', artist: 'Miles Davis', key: 7, mode: 'mixolydian', progression: ['I7', 'IV7', 'I7', 'V7'], progressionChords: ['G7', 'C7', 'G7', 'D7'], scale: 'mixolydian', genre: 'Jazz Modal', tips: 'Blues modal en 6/8. G Mixolidio. Forma de 12 compases con acordes dominantes. Modal no funcional.' },
                { name: 'Blue Bossa', artist: 'Kenny Dorham', key: 0, mode: 'minor', progression: ['ii', 'V', 'i', 'IV', 'vii°', 'III', 'VI', 'ii', 'V'], progressionChords: ['Cm7', 'Fm7', 'Dm7b5', 'G7', 'Ebmaj7', 'Abmaj7', 'Dm7b5', 'G7'], scale: 'dorian', genre: 'Jazz Bossa', tips: 'Bossa nova con ii-V-i en menor. Modulación a Eb mayor. Ritmo sincopado brasileño.' },
                { name: 'Spain', artist: 'Chick Corea', key: 7, mode: 'lydian', progression: ['I', 'bVII', 'I'], progressionChords: ['Gmaj7', 'F#7', 'Gmaj7'], scale: 'lydian', genre: 'Jazz Fusion', tips: 'Intro con arpegios flamencos en G. Sección modal Gmaj7 (Lidio). Modulación a Gmaj7 después del puente.' },
                { name: 'Chameleon', artist: 'Herbie Hancock', key: 10, mode: 'dorian', progression: ['i', 'IV'], progressionChords: ['Bbm7', 'Eb7'], scale: 'dorian', genre: 'Jazz Funk', tips: 'Riff de bajo funk. Bb Dórico. Groove sintetizador. Improvisación modal sobre ostinato.' },
                { name: 'Cantaloupe Island', artist: 'Herbie Hancock', key: 5, mode: 'dorian', progression: ['i', 'IV'], progressionChords: ['Fm7', 'Db7'], scale: 'dorian', genre: 'Jazz Funk', tips: 'F Dórico con IV mayor. Groove funk de 16 compases. Uno de los jazz standards más accesibles.' },
                { name: 'Strasbourg/St. Denis', artist: 'Roy Hargrove', key: 2, mode: 'dorian', progression: ['i', 'i'], progressionChords: ['Dm7', 'Dm7'], scale: 'dorian', genre: 'Jazz Hip-Hop', tips: 'Vamp modal en Dm7 con feel hip-hop. D Dórico. Groove groove groove. Improvisación libre.' },
                // BOSSA NOVA
                { name: 'Wave', artist: 'Tom Jobim', key: 2, mode: 'major', progression: ['I', 'vi', 'ii', 'V'], progressionChords: ['Dmaj7', 'Bm7', 'Em7', 'A7'], scale: 'major', genre: 'Bossa Nova', tips: 'Bossa clásica. Progresión I-vi-ii-V. Ritmo sincopado brasileño. Acordes con 7ª y extensiones.' },
                { name: 'Desafinado', artist: 'Tom Jobim', key: 5, mode: 'major', progression: ['ii', 'V', 'I'], progressionChords: ['Gm7', 'C7', 'Fmaj7'], scale: 'major', genre: 'Bossa Nova', tips: 'Bossa con múltiples ii-V-I. Modulaciones sutiles. Acordes de jazz con 9ª y 11ª.' },
                { name: 'Água de Beber', artist: 'Tom Jobim', key: 9, mode: 'dorian', progression: ['i', 'iv', 'V'], progressionChords: ['Am7', 'Dm7', 'E7'], scale: 'dorian', genre: 'Bossa Nova', tips: 'A Dórico con cadencia i-iv-V. Menor con V mayor (prestado de armónica). Ritmo bossa clásico.' },
                // ELECTRÓNICA/MODERNA
                { name: 'Strobe', artist: 'deadmau5', key: 2, mode: 'dorian', progression: ['i', 'V', 'bVII', 'IV'], progressionChords: ['Dm', 'A', 'C', 'G'], scale: 'dorian', genre: 'Progressive House', tips: 'Progresión electrónica progresiva. D Dórico. Construcción lenta de tensión. Minimalismo épico.' },
                { name: 'Midnight City', artist: 'M83', key: 2, mode: 'major', progression: ['I', 'V', 'vi', 'IV'], progressionChords: ['D', 'A', 'Bm', 'G'], scale: 'major', genre: 'Synthwave', tips: 'Progresión pop universal con sintetizadores. Ambiente nostálgico 80s. Delay y reverb.' },
                { name: 'Concerning Hobbits', artist: 'Howard Shore', key: 2, mode: 'mixolydian', progression: ['I', 'bVII', 'I', 'bVII'], progressionChords: ['D', 'C', 'D', 'C'], scale: 'mixolydian', genre: 'Soundtrack', tips: 'D Mixolidio con bVII. Ambiente pastoral. Ritmo de giga irlandesa. Melodía folk.' },
            ],

            // Progressions with chord degrees
            progressions: {
                'I-IV-V-I': {
                    degrees: [1, 4, 5, 1],
                    name: 'Blues Básico',
                    style: 'Blues/Rock clásico',
                    function: ['T', 'SD', 'D', 'T'],
                    analysis: 'Progresión fundamental. El IV crea tensión suave, el V tensión fuerte que resuelve al I. Base del blues y rock.',
                    songs: ['Johnny B. Goode (Chuck Berry)', 'La Bamba (Ritchie Valens)']
                },
                'I-V-vi-IV': {
                    degrees: [1, 5, 6, 4],
                    name: 'Pop Universal',
                    style: 'Pop moderno',
                    function: ['T', 'D', 'Tm', 'SD'],
                    analysis: 'La progresión más popular de todos los tiempos. El vi (menor relativo) añade emoción, el IV crea anticipación antes de volver al I.',
                    songs: ['Let It Be (Beatles)', 'No Woman No Cry (Bob Marley)', 'With or Without You (U2)']
                },
                'ii-V-I': {
                    degrees: [2, 5, 1],
                    name: 'Jazz ii-V-I',
                    style: 'Jazz/Standards',
                    function: ['SD', 'D', 'T'],
                    analysis: 'Cadencia perfecta del jazz. El ii prepara al V (dominante) que resuelve con fuerza al I. Se encadenan múltiples ii-V-I modulando.',
                    songs: ['Autumn Leaves', 'Fly Me to the Moon', 'Take the A Train']
                },
                'I-vi-IV-V': {
                    degrees: [1, 6, 4, 5],
                    name: '50s Doo-wop',
                    style: 'Oldies/Doo-wop',
                    function: ['T', 'Tm', 'SD', 'D'],
                    analysis: 'Progresión circular clásica de los 50s. El vi mantiene la tonalidad, IV y V crean tensión que resuelve al volver al I.',
                    songs: ['Stand by Me (Ben E. King)', 'Earth Angel', 'Blue Moon']
                },
                'vi-IV-I-V': {
                    degrees: [6, 4, 1, 5],
                    name: 'Axis Progression',
                    style: 'Pop épico',
                    function: ['Tm', 'SD', 'T', 'D'],
                    analysis: 'Versión dramática de I-V-vi-IV. Empezar en vi crea melancolía que se eleva al llegar al I. Muy emotiva.',
                    songs: ['Africa (Toto)', 'Poker Face (Lady Gaga)', 'Cheap Thrills (Sia)']
                },
                'I-bVII-IV-I': {
                    degrees: [1, -7, 4, 1],
                    name: 'Rock Mixolidio',
                    style: 'Rock clásico',
                    function: ['T', 'bVII', 'SD', 'T'],
                    analysis: 'El bVII (acorde prestado) viene del modo Mixolidio. Crea sonido rock/bluesy característico.',
                    songs: ['Sweet Home Alabama', 'Hey Jude (puente)']
                },
                'i-bVII-bVI-V': {
                    degrees: [-1, -7, -6, 5],
                    name: 'Andaluza',
                    style: 'Flamenco/Metal',
                    function: ['Tm', 'bVII', 'bVI', 'D'],
                    analysis: 'Cadencia andaluza. Progresión descendente desde i con acordes del modo Frigio. El V mayor (dominante) crea resolución fuerte.',
                    songs: ['Hit the Lights (Metallica)', 'Flamenco tradicional']
                },
                'i-bVI-bIII-bVII': {
                    degrees: [-1, -6, -3, -7],
                    name: 'Epic/Cinematic',
                    style: 'Épico/Cine',
                    function: ['Tm', 'bVI', 'bIII', 'bVII'],
                    analysis: 'Progresión épica moderna. Los acordes mayores (bVI, bIII, bVII) en tonalidad menor crean grandiosidad cinematográfica.',
                    songs: ['Wake Me Up (Avicii)', 'Numb (Linkin Park)', 'Bandas sonoras épicas']
                },
                'i-iv-v-i': {
                    degrees: [-1, -4, -5, -1],
                    name: 'Menor Clásica',
                    style: 'Clásico/Barroco',
                    function: ['Tm', 'SDm', 'Dm', 'Tm'],
                    analysis: 'Progresión menor natural. Todos los acordes diatónicos a la escala menor. Sonido oscuro y clásico.',
                    songs: ['Música clásica barroca', 'Stairway to Heaven (intro)']
                },
                'I-vi-ii-V': {
                    degrees: [1, 6, 2, 5],
                    name: 'Rhythm Changes',
                    style: 'Jazz/Bebop',
                    function: ['T', 'Tm', 'SD', 'D'],
                    analysis: 'Progresión de jazz bebop. Movimiento suave descendente por terceras que prepara el ii-V-I.',
                    songs: ['I Got Rhythm (Gershwin)', 'Anthropology (Charlie Parker)']
                },
                'I-V-vi-iii-IV-I-IV-V': {
                    degrees: [1, 5, 6, 3, 4, 1, 4, 5],
                    name: 'Canon de Pachelbel',
                    style: 'Barroco/Pop',
                    function: ['T', 'D', 'Tm', 'Dm', 'SD', 'T', 'SD', 'D'],
                    analysis: 'Progresión barroca de 8 acordes. Recorre toda la tonalidad con movimiento de bajo descendente. Usada en miles de canciones modernas.',
                    songs: ['Canon en D (Pachelbel)', 'Basket Case (Green Day)', 'Don\'t Look Back in Anger (Oasis)']
                },
                'bII7-I': {
                    degrees: [-2, 1],
                    name: 'Sustitución Tritonal',
                    style: 'Jazz avanzado',
                    function: ['SubV', 'T'],
                    analysis: 'Sustitución del dominante (V7) por su tritono (bII7). El bII7 comparte el tritono con V7 pero crea movimiento cromático descendente al I. Técnica fundamental del bebop.',
                    songs: ['Blue Bossa (Kenny Dorham)', 'Satin Doll (Duke Ellington)', 'Misty (Erroll Garner)']
                },
                'I-III7-VImaj7-bII7-I': {
                    degrees: [1, 3, 6, -2, 1],
                    name: 'Cambios Coltrane',
                    style: 'Jazz modal/Coltrane',
                    function: ['T', 'D/vi', 'T', 'SubV', 'T'],
                    analysis: 'Secuencia de tonalidades distantes por terceras mayores (Coltrane Cycles). El III7 modula al VI, el bII7 resuelve al I. Revolucionó el jazz moderno.',
                    songs: ['Giant Steps (John Coltrane)', 'Countdown (John Coltrane)', '26-2 (John Coltrane)']
                },
                'I-vi-ii-V-I-vi-ii-V-IV-iv-I-ii-V-I': {
                    degrees: [1, 6, 2, 5, 1, 6, 2, 5, 4, -4, 1, 2, 5, 1],
                    name: 'Rhythm Changes (completo)',
                    style: 'Jazz/Bebop',
                    function: ['T', 'Tm', 'SD', 'D', 'T', 'Tm', 'SD', 'D', 'SD', 'SDm', 'T', 'SD', 'D', 'T'],
                    analysis: 'Forma armónica completa de "I Got Rhythm". Sección A: I-vi-ii-V circular. Bridge (B): IV-iv-I (cadencia plagal con préstamo modal) seguido de ii-V-I. Estructura AABA estándar del jazz.',
                    songs: ['I Got Rhythm (Gershwin)', 'Anthropology (Parker)', 'Oleo (Rollins)', 'Rhythm-a-ning (Monk)']
                },
                'iii7-VI7-ii7-V7-I': {
                    degrees: [3, 6, 2, 5, 1],
                    name: 'Turnaround Extendido',
                    style: 'Jazz/Standards',
                    function: ['D/vi', 'D/ii', 'SD', 'D', 'T'],
                    analysis: 'Cadena de dominantes secundarias que prepara el ii-V-I. El iii7 funciona como V7/vi, VI7 como V7/ii. Crea momentum armónico hacia la resolución.',
                    songs: ['Autumn Leaves', 'All the Things You Are', 'Stella by Starlight']
                },
                'i-IV': {
                    degrees: [-1, 4],
                    name: 'Vamp Dórico',
                    style: 'Jazz modal/Funk',
                    function: ['Tm', 'SD'],
                    analysis: 'Ostinato modal característico del modo Dórico. El IV mayor sobre tónica menor define el sonido dórico (6ª mayor). Sin función de dominante, crea groove hipnótico.',
                    songs: ['So What (Miles Davis)', 'Impressions (Coltrane)', 'Oye Como Va (Santana)', 'Get Lucky (Daft Punk)']
                },
                'I-bII': {
                    degrees: [1, -2],
                    name: 'Vamp Frigio',
                    style: 'Flamenco/Metal/Español',
                    function: ['T', 'bII'],
                    analysis: 'Movimiento semitonal característico del modo Frigio (2ª menor). El bII crea tensión exótica sin resolución. Esencia del flamenco y metal melódico.',
                    songs: ['Master of Puppets (Metallica)', 'Flamenco tradicional', 'Dark Necessities (RHCP)', 'música española']
                },
                'bVII-IV-I': {
                    degrees: [-7, 4, 1],
                    name: 'Plagal Mixolidio',
                    style: 'Rock/Blues-rock',
                    function: ['bVII', 'SD', 'T'],
                    analysis: 'Cadencia plagal (IV-I) precedida del bVII mixolidio. Sonido rock clásico: el bVII viene del acorde prestado del modo mixolidio, el IV crea subdominante fuerte.',
                    songs: ['Sweet Child O\' Mine (GNR)', 'Free Fallin\' (Tom Petty)', 'Hey Jude (Beatles - puente)']
                },
                'vi-V-IV-V': {
                    degrees: [6, 5, 4, 5],
                    name: 'Indie/Alternative',
                    style: 'Indie rock/Alternative',
                    function: ['Tm', 'D', 'SD', 'D'],
                    analysis: 'Progresión indie moderna. Empieza en vi (melancolía), V crea tensión, IV alivia, V vuelve a tensar. Movimiento oscilante entre tensión y alivio sin resolución clara al I.',
                    songs: ['Mr. Brightside (The Killers)', 'When You Were Young (The Killers)', 'Indie rock moderno']
                },
                'i-bVII-bVI-bVII': {
                    degrees: [-1, -7, -6, -7],
                    name: 'Modal Menor Rock',
                    style: 'Rock/Metal progresivo',
                    function: ['Tm', 'bVII', 'bVI', 'bVII'],
                    analysis: 'Progresión eólica (menor natural) con énfasis en acordes prestados bVII y bVI. El bVII actúa como pivote entre i y bVI. Sonido épico y oscuro del rock progresivo.',
                    songs: ['Comfortably Numb (Pink Floyd)', 'Stairway to Heaven (Led Zeppelin - secciones)', 'Nothing Else Matters (Metallica)']
                },
                'I-III-vi-IV': {
                    degrees: [1, 3, 6, 4],
                    name: 'Ascenso por Terceras',
                    style: 'Pop/Rock melódico',
                    function: ['T', 'Dm', 'Tm', 'SD'],
                    analysis: 'Movimiento ascendente por terceras desde I. El III (mediant) es poco común y crea color sorprendente. Mantiene emoción elevada antes de resolver con IV.',
                    songs: ['Variaciones pop modernas', 'Power ballads']
                },
            },

            // Real chord voicings (fret positions for each string, -1 = muted, 0 = open)
            // Format: [E6, A5, D4, G3, B2, E1] (low to high)
            chordVoicings: {
                // Major chords (CAGED shapes)
                'C': { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], barreInfo: null, position: 0 },
                'A': { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], barreInfo: null, position: 0 },
                'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], barreInfo: null, position: 0 },
                'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], barreInfo: null, position: 0 },
                'D': { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], barreInfo: null, position: 0 },
                // Minor chords
                'Am': { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], barreInfo: null, position: 0 },
                'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], barreInfo: null, position: 0 },
                'Dm': { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], barreInfo: null, position: 0 },
                // Barre chord templates (E shape and A shape)
                'E_shape_major': { frets: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1], barreInfo: { fret: 0, fromString: 0, toString: 5 }, position: 0 },
                'E_shape_minor': { frets: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1], barreInfo: { fret: 0, fromString: 0, toString: 5 }, position: 0 },
                'A_shape_major': { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 1, 3, 3, 3, 1], barreInfo: { fret: 0, fromString: 1, toString: 5 }, position: 0 },
                'A_shape_minor': { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 1, 3, 4, 2, 1], barreInfo: { fret: 0, fromString: 1, toString: 5 }, position: 0 },
            },

            // 7th chord voicings
            seventhVoicings: {
                'maj7_E': { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], barreInfo: null, position: 0, type: 'maj7' },
                'maj7_A': { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], barreInfo: null, position: 0, type: 'maj7' },
                'maj7_C': { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], barreInfo: null, position: 0, type: 'maj7' },
                'm7_E': { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], barreInfo: null, position: 0, type: 'm7' },
                'm7_A': { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], barreInfo: null, position: 0, type: 'm7' },
                'dom7_E': { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], barreInfo: null, position: 0, type: '7' },
                'dom7_A': { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], barreInfo: null, position: 0, type: '7' },
                'm7b5_E': { frets: [-1, -1, 2, 3, 3, 3], fingers: [0, 0, 1, 2, 3, 4], barreInfo: null, position: 0, type: 'ø7' },
            },

            // Pentatonic box positions (fret range relative to root)
            pentatonicBoxes: {
                minor: [
                    { name: 'Box 1 (E shape)', startFret: 0, pattern: [
                        { string: 0, frets: [0, 3] },
                        { string: 1, frets: [0, 3] },
                        { string: 2, frets: [0, 2] },
                        { string: 3, frets: [0, 2] },
                        { string: 4, frets: [0, 2] },
                        { string: 5, frets: [0, 3] },
                    ]},
                    { name: 'Box 2 (D shape)', startFret: 3, pattern: [
                        { string: 0, frets: [0, 2] },
                        { string: 1, frets: [0, 2] },
                        { string: 2, frets: [-1, 2] },
                        { string: 3, frets: [-1, 2] },
                        { string: 4, frets: [-1, 2] },
                        { string: 5, frets: [0, 2] },
                    ]},
                    { name: 'Box 3 (C shape)', startFret: 5, pattern: [
                        { string: 0, frets: [0, 2] },
                        { string: 1, frets: [0, 3] },
                        { string: 2, frets: [0, 2] },
                        { string: 3, frets: [0, 2] },
                        { string: 4, frets: [0, 3] },
                        { string: 5, frets: [0, 2] },
                    ]},
                    { name: 'Box 4 (A shape)', startFret: 7, pattern: [
                        { string: 0, frets: [0, 3] },
                        { string: 1, frets: [0, 2] },
                        { string: 2, frets: [0, 2] },
                        { string: 3, frets: [0, 3] },
                        { string: 4, frets: [0, 2] },
                        { string: 5, frets: [0, 3] },
                    ]},
                    { name: 'Box 5 (G shape)', startFret: 10, pattern: [
                        { string: 0, frets: [0, 2] },
                        { string: 1, frets: [0, 2] },
                        { string: 2, frets: [-1, 2] },
                        { string: 3, frets: [0, 2] },
                        { string: 4, frets: [0, 2] },
                        { string: 5, frets: [0, 2] },
                    ]},
                ],
            },

            pentatonicLicks: {
                minor: {
                    box1: [
                        {
                            name: 'Classic Blues Lick',
                            tabs: 'e|--------8-5----------\nB|------8-----8-5------\nG|----7-----------7-5--\nD|--5------------------\nA|---------------------\nE|---------------------',
                            description: 'Lick clásico de blues menor en Box 1'
                        },
                        {
                            name: 'B.B. King Style',
                            tabs: 'e|---------8-5-8-5-----\nB|------8----------8---\nG|----7----------------\nD|--5------------------\nA|---------------------\nE|---------------------',
                            description: 'Vibrato característico de B.B. King'
                        }
                    ],
                    box2: [
                        {
                            name: 'Eric Clapton Signature',
                            tabs: 'e|---------------------\nB|---------------------\nG|--7-5----------------\nD|------7-5------------\nA|----------7-5--------\nE|--------------8-5----',
                            description: 'Fraseo descendente estilo Clapton'
                        },
                        {
                            name: 'Rock Bend Lick',
                            tabs: 'e|---------------------\nB|---------------------\nG|--7b9-7-5------------\nD|----------7-5--------\nA|--------------7------\nE|---------------------',
                            description: 'Bend de tono completo en 3ª cuerda'
                        }
                    ],
                    box3: [
                        {
                            name: 'SRV Texas Blues',
                            tabs: 'e|---------------------\nB|---------------------\nG|--9-7----------------\nD|------10-7-----------\nA|-----------10-7------\nE|----------------10---',
                            description: 'Lick estilo Stevie Ray Vaughan'
                        }
                    ],
                    box4: [
                        {
                            name: 'Jimmy Page Signature',
                            tabs: 'e|--12-10--------------\nB|--------13-10--------\nG|--------------12-10--\nD|---------------------\nA|---------------------\nE|---------------------',
                            description: 'Fraseo melódico estilo Led Zeppelin'
                        }
                    ],
                    box5: [
                        {
                            name: 'Slash Rock Lick',
                            tabs: 'e|--15-12--------------\nB|--------15-12--------\nG|--------------14-12--\nD|---------------------\nA|---------------------\nE|---------------------',
                            description: 'Lick ascendente con hammer-ons'
                        }
                    ]
                }
            },

            // CAGED positions with actual fret positions for C major
            cagedPositions: {
                'C': {
                    startFret: 0,
                    endFret: 3,
                    chord: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
                    rootStrings: [1, 4], // A and B strings
                    description: 'Posición abierta'
                },
                'A': {
                    startFret: 2,
                    endFret: 5,
                    chord: { frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 1, 3, 3, 3, 1], barreInfo: { fret: 3, fromString: 1, toString: 5 } },
                    rootStrings: [1, 3],
                    description: 'Traste 3 (cejilla)'
                },
                'G': {
                    startFret: 4,
                    endFret: 8,
                    chord: { frets: [8, 7, 5, 5, 5, 8], fingers: [3, 2, 1, 1, 1, 4] },
                    rootStrings: [0, 2, 5],
                    description: 'Traste 5-8'
                },
                'E': {
                    startFret: 7,
                    endFret: 10,
                    chord: { frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], barreInfo: { fret: 8, fromString: 0, toString: 5 } },
                    rootStrings: [0, 3, 5],
                    description: 'Traste 8 (cejilla)'
                },
                'D': {
                    startFret: 9,
                    endFret: 12,
                    chord: { frets: [-1, -1, 10, 12, 13, 12], fingers: [0, 0, 1, 3, 4, 2] },
                    rootStrings: [2, 4],
                    description: 'Traste 10-13'
                },
            },

            // Get chord voicing for any root note using shape transposition
            getChordVoicing(root, quality, preferredShape = 'E') {
                const rootIndex = typeof root === 'number' ? root : this.getNoteIndex(root);
                const shapeName = quality === 'minor' ? `${preferredShape}_shape_minor` : `${preferredShape}_shape_major`;

                // Base shapes start at different frets
                const basePositions = { 'E': 0, 'A': 0, 'G': 3, 'C': 0, 'D': 0 };
                const basePosition = basePositions[preferredShape] || 0;

                // Calculate transposition
                const transposition = rootIndex + basePosition;

                return {
                    ...this.chordVoicings[shapeName] || this.chordVoicings['E_shape_major'],
                    position: transposition
                };
            },

            // Lick Library - Level 17
            licks: [
                // SWEEP PICKING
                {
                    id: 'sweep-major-3string',
                    name: '3-String Major Sweep (Yngwie Style)',
                    genre: 'metal',
                    technique: 'sweep',
                    difficulty: 'easy',
                    bpm: 80,
                    description: 'Arpegio mayor básico de 3 cuerdas. Fundamental para sweep picking.',
                    key: 'A',
                    tabs: [
                        { time: 0, string: 2, fret: 14, technique: 'down' },
                        { time: 0.25, string: 1, fret: 13, technique: 'down' },
                        { time: 0.5, string: 0, fret: 12, technique: 'down' },
                        { time: 0.75, string: 1, fret: 13, technique: 'up' },
                        { time: 1, string: 2, fret: 14, technique: 'up' }
                    ],
                    fingering: [4, 3, 1, 3, 4],
                    position: 12
                },
                {
                    id: 'sweep-minor-5string',
                    name: '5-String Minor Sweep (Petrucci)',
                    genre: 'metal',
                    technique: 'sweep',
                    difficulty: 'medium',
                    bpm: 70,
                    description: 'Arpegio menor de 5 cuerdas estilo Dream Theater.',
                    key: 'Am',
                    tabs: [
                        { time: 0, string: 4, fret: 12, technique: 'down' },
                        { time: 0.2, string: 3, fret: 14, technique: 'down' },
                        { time: 0.4, string: 2, fret: 14, technique: 'down' },
                        { time: 0.6, string: 1, fret: 13, technique: 'down' },
                        { time: 0.8, string: 0, fret: 12, technique: 'down' },
                        { time: 1, string: 1, fret: 13, technique: 'up' },
                        { time: 1.2, string: 2, fret: 14, technique: 'up' },
                        { time: 1.4, string: 3, fret: 14, technique: 'up' },
                        { time: 1.6, string: 4, fret: 12, technique: 'up' }
                    ],
                    fingering: [1, 3, 2, 1, 1, 1, 2, 3, 1],
                    position: 12
                },
                {
                    id: 'sweep-dim7',
                    name: 'Diminished 7th Sweep (Jason Becker)',
                    genre: 'metal',
                    technique: 'sweep',
                    difficulty: 'hard',
                    bpm: 90,
                    description: 'Arpegio disminuido con patterns simétricos.',
                    key: 'Edim7',
                    tabs: [
                        { time: 0, string: 4, fret: 12, technique: 'down' },
                        { time: 0.166, string: 3, fret: 14, technique: 'down' },
                        { time: 0.333, string: 2, fret: 13, technique: 'down' },
                        { time: 0.5, string: 1, fret: 12, technique: 'down' },
                        { time: 0.666, string: 0, fret: 11, technique: 'down' },
                        { time: 0.833, string: 0, fret: 14, technique: 'pulloff' },
                        { time: 1, string: 1, fret: 15, technique: 'up' },
                        { time: 1.166, string: 2, fret: 16, technique: 'up' },
                        { time: 1.333, string: 3, fret: 17, technique: 'up' },
                        { time: 1.5, string: 4, fret: 15, technique: 'up' }
                    ],
                    fingering: [1, 3, 2, 1, 1, 4, 1, 2, 3, 1],
                    position: 11
                },
                {
                    id: 'sweep-cascade-6string',
                    name: '6-String Arpeggio Cascade (Gambale)',
                    genre: 'jazz',
                    technique: 'sweep',
                    difficulty: 'expert',
                    bpm: 100,
                    description: 'Cascada completa de 6 cuerdas con economy picking.',
                    key: 'Cmaj7',
                    tabs: [
                        { time: 0, string: 5, fret: 8, technique: 'down' },
                        { time: 0.125, string: 4, fret: 10, technique: 'down' },
                        { time: 0.25, string: 3, fret: 9, technique: 'down' },
                        { time: 0.375, string: 2, fret: 9, technique: 'down' },
                        { time: 0.5, string: 1, fret: 8, technique: 'down' },
                        { time: 0.625, string: 0, fret: 7, technique: 'down' },
                        { time: 0.75, string: 0, fret: 10, technique: 'hammeron' },
                        { time: 0.875, string: 1, fret: 12, technique: 'up' },
                        { time: 1, string: 2, fret: 12, technique: 'up' },
                        { time: 1.125, string: 3, fret: 12, technique: 'up' },
                        { time: 1.25, string: 4, fret: 14, technique: 'up' },
                        { time: 1.375, string: 5, fret: 12, technique: 'up' }
                    ],
                    fingering: [1, 3, 2, 2, 1, 1, 4, 4, 3, 3, 4, 2],
                    position: 7
                },

                // TAPPING
                {
                    id: 'tap-vanhalen-basic',
                    name: 'Van Halen Basic Tapping',
                    genre: 'rock',
                    technique: 'tapping',
                    difficulty: 'easy',
                    bpm: 100,
                    description: 'Tapping básico estilo Eruption. Tap con índice derecho.',
                    key: 'Em',
                    tabs: [
                        { time: 0, string: 0, fret: 12, technique: 'tap' },
                        { time: 0.25, string: 0, fret: 8, technique: 'pulloff' },
                        { time: 0.5, string: 0, fret: 5, technique: 'pulloff' },
                        { time: 0.75, string: 0, fret: 12, technique: 'tap' },
                        { time: 1, string: 0, fret: 8, technique: 'pulloff' },
                        { time: 1.25, string: 0, fret: 5, technique: 'pulloff' },
                        { time: 1.5, string: 1, fret: 12, technique: 'tap' },
                        { time: 1.75, string: 1, fret: 8, technique: 'pulloff' },
                        { time: 2, string: 1, fret: 5, technique: 'pulloff' }
                    ],
                    fingering: [0, 2, 1, 0, 2, 1, 0, 2, 1],
                    position: 5
                },
                {
                    id: 'tap-petrucci-8finger',
                    name: 'Petrucci 8-Finger Tapping',
                    genre: 'metal',
                    technique: 'tapping',
                    difficulty: 'hard',
                    bpm: 80,
                    description: '8-finger tapping estilo Dream Theater usando ambas manos.',
                    key: 'Em',
                    tabs: [
                        { time: 0, string: 0, fret: 5, technique: 'hammer' },
                        { time: 0.125, string: 0, fret: 8, technique: 'hammer' },
                        { time: 0.25, string: 0, fret: 12, technique: 'tap' },
                        { time: 0.375, string: 0, fret: 15, technique: 'tap' },
                        { time: 0.5, string: 1, fret: 5, technique: 'hammer' },
                        { time: 0.625, string: 1, fret: 8, technique: 'hammer' },
                        { time: 0.75, string: 1, fret: 12, technique: 'tap' },
                        { time: 0.875, string: 1, fret: 15, technique: 'tap' },
                        { time: 1, string: 2, fret: 5, technique: 'hammer' },
                        { time: 1.125, string: 2, fret: 9, technique: 'hammer' },
                        { time: 1.25, string: 2, fret: 12, technique: 'tap' },
                        { time: 1.375, string: 2, fret: 16, technique: 'tap' }
                    ],
                    fingering: [1, 2, 0, 0, 1, 2, 0, 0, 1, 3, 0, 0],
                    position: 5
                },
                {
                    id: 'tap-tosin-thumb',
                    name: 'Tosin Abasi Thumb Tapping',
                    genre: 'progressive',
                    technique: 'tapping',
                    difficulty: 'expert',
                    bpm: 90,
                    description: 'Tapping con pulgar estilo Animals as Leaders.',
                    key: 'Cmaj7',
                    tabs: [
                        { time: 0, string: 2, fret: 9, technique: 'thumb' },
                        { time: 0.25, string: 1, fret: 8, technique: 'pluck' },
                        { time: 0.5, string: 0, fret: 7, technique: 'pluck' },
                        { time: 0.75, string: 2, fret: 12, technique: 'thumb' },
                        { time: 1, string: 1, fret: 12, technique: 'pluck' },
                        { time: 1.25, string: 0, fret: 12, technique: 'pluck' },
                        { time: 1.5, string: 2, fret: 14, technique: 'thumb' },
                        { time: 1.75, string: 1, fret: 13, technique: 'pluck' }
                    ],
                    fingering: [2, 1, 1, 3, 2, 2, 4, 3],
                    position: 7
                },

                // ALTERNATE PICKING
                {
                    id: 'alt-gilbert-spider',
                    name: 'Chromatic Spider (Paul Gilbert)',
                    genre: 'rock',
                    technique: 'alternate',
                    difficulty: 'medium',
                    bpm: 80,
                    description: 'Ejercicio cromático para sincronización mano izquierda/derecha.',
                    key: 'Chromatic',
                    tabs: [
                        { time: 0, string: 5, fret: 5, technique: 'down' },
                        { time: 0.125, string: 5, fret: 6, technique: 'up' },
                        { time: 0.25, string: 5, fret: 7, technique: 'down' },
                        { time: 0.375, string: 5, fret: 8, technique: 'up' },
                        { time: 0.5, string: 4, fret: 5, technique: 'down' },
                        { time: 0.625, string: 4, fret: 6, technique: 'up' },
                        { time: 0.75, string: 4, fret: 7, technique: 'down' },
                        { time: 0.875, string: 4, fret: 8, technique: 'up' },
                        { time: 1, string: 3, fret: 5, technique: 'down' },
                        { time: 1.125, string: 3, fret: 6, technique: 'up' },
                        { time: 1.25, string: 3, fret: 7, technique: 'down' },
                        { time: 1.375, string: 3, fret: 8, technique: 'up' }
                    ],
                    fingering: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
                    position: 5
                },
                {
                    id: 'alt-outside-picking',
                    name: 'Outside Picking Pattern (Troy Grady)',
                    genre: 'rock',
                    technique: 'alternate',
                    difficulty: 'hard',
                    bpm: 100,
                    description: 'Outside picking para string skipping eficiente.',
                    key: 'Em',
                    tabs: [
                        { time: 0, string: 0, fret: 12, technique: 'down' },
                        { time: 0.125, string: 2, fret: 12, technique: 'up' },
                        { time: 0.25, string: 0, fret: 15, technique: 'down' },
                        { time: 0.375, string: 2, fret: 14, technique: 'up' },
                        { time: 0.5, string: 0, fret: 12, technique: 'down' },
                        { time: 0.625, string: 2, fret: 12, technique: 'up' },
                        { time: 0.75, string: 1, fret: 13, technique: 'down' },
                        { time: 0.875, string: 3, fret: 14, technique: 'up' }
                    ],
                    fingering: [1, 1, 4, 3, 1, 1, 2, 3],
                    position: 12
                },
                {
                    id: 'alt-string-skipping',
                    name: 'String Skipping Run (Eric Johnson)',
                    genre: 'rock',
                    technique: 'alternate',
                    difficulty: 'hard',
                    bpm: 90,
                    description: 'Saltos de cuerda con alternate picking preciso.',
                    key: 'A',
                    tabs: [
                        { time: 0, string: 5, fret: 5, technique: 'down' },
                        { time: 0.166, string: 3, fret: 6, technique: 'up' },
                        { time: 0.333, string: 5, fret: 7, technique: 'down' },
                        { time: 0.5, string: 3, fret: 7, technique: 'up' },
                        { time: 0.666, string: 5, fret: 9, technique: 'down' },
                        { time: 0.833, string: 3, fret: 9, technique: 'up' },
                        { time: 1, string: 4, fret: 7, technique: 'down' },
                        { time: 1.166, string: 2, fret: 6, technique: 'up' }
                    ],
                    fingering: [1, 2, 3, 3, 4, 4, 3, 1],
                    position: 5
                },

                // LEGATO
                {
                    id: 'legato-govan-run',
                    name: 'Guthrie Govan Legato Run',
                    genre: 'fusion',
                    technique: 'legato',
                    difficulty: 'hard',
                    bpm: 70,
                    description: 'Legato fluido de 3 notas por cuerda estilo Govan.',
                    key: 'G',
                    tabs: [
                        { time: 0, string: 2, fret: 12, technique: 'hammer' },
                        { time: 0.166, string: 2, fret: 14, technique: 'hammer' },
                        { time: 0.333, string: 2, fret: 15, technique: 'hammer' },
                        { time: 0.5, string: 1, fret: 12, technique: 'hammer' },
                        { time: 0.666, string: 1, fret: 13, technique: 'hammer' },
                        { time: 0.833, string: 1, fret: 15, technique: 'hammer' },
                        { time: 1, string: 0, fret: 12, technique: 'hammer' },
                        { time: 1.166, string: 0, fret: 14, technique: 'hammer' },
                        { time: 1.333, string: 0, fret: 15, technique: 'hammer' }
                    ],
                    fingering: [1, 3, 4, 1, 2, 4, 1, 3, 4],
                    position: 12
                },
                {
                    id: 'legato-holdsworth-intervals',
                    name: 'Allan Holdsworth Intervallic Legato',
                    genre: 'fusion',
                    technique: 'legato',
                    difficulty: 'expert',
                    bpm: 60,
                    description: 'Legato con intervalos amplios estilo Holdsworth.',
                    key: 'C',
                    tabs: [
                        { time: 0, string: 2, fret: 5, technique: 'hammer' },
                        { time: 0.25, string: 2, fret: 9, technique: 'hammer' },
                        { time: 0.5, string: 1, fret: 6, technique: 'pulloff' },
                        { time: 0.75, string: 2, fret: 10, technique: 'hammer' },
                        { time: 1, string: 1, fret: 8, technique: 'pulloff' },
                        { time: 1.25, string: 0, fret: 7, technique: 'hammer' },
                        { time: 1.5, string: 0, fret: 12, technique: 'hammer' }
                    ],
                    fingering: [1, 4, 1, 4, 2, 1, 4],
                    position: 5
                },
                {
                    id: 'legato-plini-melodic',
                    name: 'Plini Melodic Legato',
                    genre: 'progressive',
                    technique: 'legato',
                    difficulty: 'medium',
                    bpm: 80,
                    description: 'Legato melódico moderno con sound lydian.',
                    key: 'F Lydian',
                    tabs: [
                        { time: 0, string: 1, fret: 13, technique: 'hammer' },
                        { time: 0.25, string: 1, fret: 15, technique: 'hammer' },
                        { time: 0.5, string: 0, fret: 12, technique: 'pulloff' },
                        { time: 0.75, string: 0, fret: 13, technique: 'hammer' },
                        { time: 1, string: 0, fret: 15, technique: 'hammer' },
                        { time: 1.25, string: 1, fret: 17, technique: 'bend' },
                        { time: 1.75, string: 1, fret: 17, technique: 'release' }
                    ],
                    fingering: [1, 3, 1, 2, 4, 4, 4],
                    position: 12
                },

                // METAL RIFFS
                {
                    id: 'metal-meshuggah-poly',
                    name: 'Meshuggah Polyrhythmic Riff',
                    genre: 'metal',
                    technique: 'rhythm',
                    difficulty: 'hard',
                    bpm: 120,
                    description: 'Riff polirítmico con palm muting. Enfócate en la sincronización.',
                    key: 'Eb',
                    tabs: [
                        { time: 0, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.166, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.333, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.5, string: 5, fret: 3, technique: 'palm' },
                        { time: 0.75, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.916, string: 5, fret: 0, technique: 'palm' },
                        { time: 1.083, string: 5, fret: 0, technique: 'palm' },
                        { time: 1.25, string: 5, fret: 1, technique: 'palm' }
                    ],
                    fingering: [0, 0, 0, 3, 0, 0, 0, 1],
                    position: 0
                },
                {
                    id: 'metal-periphery-djent',
                    name: 'Periphery Djent Pattern',
                    genre: 'metal',
                    technique: 'rhythm',
                    difficulty: 'hard',
                    bpm: 140,
                    description: 'Pattern djent moderno en Drop C con muting preciso.',
                    key: 'Drop C',
                    tabs: [
                        { time: 0, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.125, string: 4, fret: 2, technique: 'chord' },
                        { time: 0.25, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.375, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.5, string: 4, fret: 4, technique: 'chord' },
                        { time: 0.75, string: 5, fret: 0, technique: 'palm' },
                        { time: 0.875, string: 4, fret: 2, technique: 'chord' }
                    ],
                    fingering: [0, 1, 0, 0, 3, 0, 1],
                    position: 0
                }
            ],

            // NEW: Suggest next chords based on emotion and harmonic context
            // ===== TRANSPOSITION SYSTEM =====

            // Transpose a voicing from one root to another
            transposeVoicing(voicing, fromRoot, toRoot) {
                if (!voicing || !voicing.frets) {
                    console.error('Invalid voicing for transposition:', voicing);
                    return null;
                }

                // Calculate chromatic offset
                const fromIndex = typeof fromRoot === 'number' ? fromRoot : this.getNoteIndex(fromRoot);
                const toIndex = typeof toRoot === 'number' ? toRoot : this.getNoteIndex(toRoot);
                const offset = (toIndex - fromIndex + 12) % 12;

                if (offset === 0) {
                    return voicing; // No transposition needed
                }

                // Transpose each fret
                const transposedFrets = voicing.frets.map(fret => {
                    if (fret === -1) return -1; // Muted string stays muted
                    if (fret === 0 && !voicing.movable) {
                        // Open string in non-movable voicing: cannot transpose
                        return fret + offset;
                    }
                    return fret + offset;
                });

                // Create transposed voicing with preserved metadata (FASE 2)
                const transposed = {
                    ...voicing,
                    frets: transposedFrets,
                    baseFret: voicing.baseFret + offset,
                    transposed: true,
                    originalRoot: fromRoot,
                    newRoot: toRoot,
                    source: 'transposed',
                    // NUEVO: Preservar metadata crítica
                    extensions: voicing.extensions || [],
                    emotionalTags: voicing.emotionalTags || [],
                    brightness: voicing.brightness,
                    tension: voicing.tension,
                    register: voicing.register
                };

                return transposed;
            },

            // Get a voicing for a specific chord and quality, with transposition support
            getVoicingForChord(targetRoot, quality) {
                // Try to find a voicing in the target key first
                const targetRootName = typeof targetRoot === 'number' ? this.getNoteName(targetRoot) : targetRoot;

                // Direct lookup attempts (expanded for extensions)
                const directKeys = [
                    `${targetRootName}_shape_${quality}`,
                    `${targetRootName}_shape_dom${quality}`,  // For dom9, dom13
                    `${targetRootName}_shape_maj${quality}`,  // For maj9, maj13
                    `${targetRootName}_shape_m${quality}`,    // For m9, m11
                    `${targetRootName}${quality}`,
                ];

                // Add quality-specific patterns FIRST
                if (quality === 'min' || quality === 'minor' || quality === 'm') {
                    directKeys.push(`${targetRootName}m_shape`);        // Dm_shape, Em_shape
                    directKeys.push(`${targetRootName}_shape_minor`);   // D_shape_minor
                    directKeys.push(`${targetRootName}m7`);             // Dm7
                } else if (quality === 'maj' || quality === 'major') {
                    directKeys.push(`${targetRootName}_shape_major`);   // D_shape_major
                    directKeys.push(`${targetRootName}_shape_maj7`);    // D_shape_maj7
                    directKeys.push(`${targetRootName}maj7`);           // Dmaj7
                }

                // Common patterns (fallback)
                directKeys.push(
                    `${targetRootName}7`,
                    `${targetRootName}add9`,
                    `${targetRootName}sus2`,
                    `${targetRootName}sus4`
                );

                for (const key of directKeys) {
                    if (this.chordLabVoicings[key]) {
                        return { key, voicing: this.chordLabVoicings[key], transposed: false };
                    }
                }

                // If not found, find a movable voicing and transpose it
                // FASE 2: Mapeo expandido con nuevos voicings de extensiones
                const qualityVoicings = {
                    'maj': ['C_shape_major', 'A_shape_major', 'E_shape_major_barre', 'G_shape_major'],
                    'min': ['Am_shape', 'Em_shape', 'E_shape_minor_barre'],
                    '7': ['G_shape_dom7', 'C_shape_dom7', 'A_shape_dom7', 'E_shape_dom7'],
                    'maj7': ['C_shape_maj7', 'A_shape_maj7', 'E_shape_maj7'],
                    'm7': ['A_shape_m7', 'C_shape_m7', 'E_shape_m7'],
                    // NUEVOS: Extensiones 9
                    '9': ['E_shape_dom9', 'A_shape_dom9', 'G_shape_dom9', 'C9'],
                    'maj9': ['E_shape_maj9', 'A_shape_maj9', 'C_shape_maj9', 'Cmaj9'],
                    'm9': ['E_shape_m9', 'A_shape_m9', 'Em_shape_m9'],
                    // NUEVOS: Extensiones 13
                    '13': ['E_shape_dom13', 'A_shape_dom13', 'G_shape_dom13'],
                    'maj13': ['E_shape_maj13', 'A_shape_maj13', 'C_shape_maj13'],
                    // NUEVOS: Extensiones 11
                    'm11': ['E_shape_m11', 'A_shape_m11', 'Em_shape_m11'],
                    // Existentes
                    'sus2': ['Csus2', 'Asus2'],
                    'sus4': ['Csus4', 'Asus4'],
                    'add9': ['Cadd9', 'Amadd9'],
                    '6': ['C6', 'Am6'],
                    'dim7': ['Cdim7', 'Bdim7'],
                    'aug': ['Caug', 'Eaug']
                };

                const voicingKeys = qualityVoicings[quality] || qualityVoicings['maj'];

                for (const key of voicingKeys) {
                    const baseVoicing = this.chordLabVoicings[key];
                    if (baseVoicing && baseVoicing.movable) {
                        // Extract base root from key (e.g., "C" from "C_shape_major")
                        let baseRoot = key.charAt(0);
                        if (key.charAt(1) === '#' || key.charAt(1) === 'b') {
                            baseRoot += key.charAt(1);
                        }

                        const transposed = this.transposeVoicing(baseVoicing, baseRoot, targetRootName);
                        if (transposed) {
                            return { key: `${key}_transposed_to_${targetRootName}`, voicing: transposed, transposed: true };
                        }
                    }
                }

                // Fallback: return first voicing for quality
                const fallbackKey = voicingKeys[0];
                return {
                    key: fallbackKey,
                    voicing: this.chordLabVoicings[fallbackKey] || this.chordLabVoicings['C_shape_major'],
                    transposed: false
                };
            },

            // Transpose an entire progression
            transposeProgression(progression, fromKey, toKey) {
                if (!progression || progression.length === 0) return [];

                const fromIndex = typeof fromKey === 'number' ? fromKey : this.getNoteIndex(fromKey);
                const toIndex = typeof toKey === 'number' ? toKey : this.getNoteIndex(toKey);

                return progression.map(chordData => {
                    // Support both 'chord' and 'root' field names
                    const chordRoot = chordData.chord || chordData.root;
                    const originalRoot = typeof chordRoot === 'number' ? chordRoot : this.getNoteIndex(chordRoot);
                    const newRoot = (originalRoot + (toIndex - fromIndex) + 12) % 12;
                    const newRootName = this.getNoteName(newRoot);

                    const transposedVoicing = chordData.voicing ?
                        this.transposeVoicing(chordData.voicing, originalRoot, newRoot) :
                        null;

                    return {
                        ...chordData,
                        chord: newRootName,
                        root: newRootName,
                        voicing: transposedVoicing
                    };
                });
            },

            // ===== HARMONIC SUGGESTION ENGINE =====

            // Get chord function in a key (I, ii, V, etc.)
            getChordFunction(chordRoot, key, quality = 'maj') {
                const keyIndex = typeof key === 'number' ? key : this.getNoteIndex(key);
                const chordIndex = typeof chordRoot === 'number' ? chordRoot : this.getNoteIndex(chordRoot);

                const interval = (chordIndex - keyIndex + 12) % 12;

                // Map intervals to functions
                const functionMap = {
                    0: 'I',    // Tonic
                    2: 'ii',   // Supertonic
                    4: 'iii',  // Mediant
                    5: 'IV',   // Subdominant
                    7: 'V',    // Dominant
                    9: 'vi',   // Submediant
                    11: 'vii°' // Leading tone
                };

                // Special cases for borrowed chords
                const borrowedMap = {
                    3: 'bIII',  // Borrowed from parallel minor
                    6: 'bV',    // Neapolitan
                    8: 'bVI',   // Borrowed
                    10: 'bVII'  // Subtonic
                };

                return functionMap[interval] || borrowedMap[interval] || 'altered';
            },

            // Calculate compatibility between two chords
            calculateCompatibility(currentChord, nextFunction, key) {
                const currentFunction = this.getChordFunction(currentChord.root || currentChord, key, currentChord.quality);

                // Transition probability matrix (based on functional harmony)
                const transitions = {
                    'I': { 'I': 70, 'ii': 85, 'iii': 70, 'IV': 90, 'V': 85, 'vi': 90, 'vii°': 60 },
                    'ii': { 'I': 60, 'ii': 40, 'iii': 50, 'IV': 70, 'V': 95, 'vi': 60, 'vii°': 70 },
                    'iii': { 'I': 50, 'ii': 70, 'iii': 40, 'IV': 75, 'V': 60, 'vi': 85, 'vii°': 50 },
                    'IV': { 'I': 80, 'ii': 75, 'iii': 50, 'IV': 60, 'V': 90, 'vi': 70, 'vii°': 75 },
                    'V': { 'I': 100, 'ii': 40, 'iii': 50, 'IV': 65, 'V': 50, 'vi': 80, 'vii°': 40 },
                    'vi': { 'I': 70, 'ii': 85, 'iii': 75, 'IV': 85, 'V': 75, 'vi': 50, 'vii°': 60 },
                    'vii°': { 'I': 95, 'ii': 50, 'iii': 65, 'IV': 50, 'V': 60, 'vi': 70, 'vii°': 30 }
                };

                const score = (transitions[currentFunction] && transitions[currentFunction][nextFunction]) || 50;

                // Categorize
                if (score >= 85) return { score, category: 'excellent', color: '#10b981' };
                if (score >= 70) return { score, category: 'good', color: '#f59e0b' };
                if (score >= 50) return { score, category: 'interesting', color: '#3b82f6' };
                return { score, category: 'unexpected', color: '#ef4444' };
            },

            // Suggest next chords based on current chord and context
            suggestNextChords(currentChord, key, context = {}) {
                const keyIndex = typeof key === 'number' ? key : this.getNoteIndex(key);
                const currentRoot = typeof currentChord === 'object' ? currentChord.root : currentChord;
                const currentQuality = typeof currentChord === 'object' ? currentChord.quality : 'maj';
                const currentFunction = this.getChordFunction(currentRoot, key, currentQuality);

                // Define probable transitions based on function
                const transitionRules = {
                    'I': ['ii', 'iii', 'IV', 'V', 'vi'],
                    'ii': ['V', 'vii°', 'IV'],
                    'iii': ['vi', 'IV', 'ii'],
                    'IV': ['I', 'V', 'ii', 'vii°'],
                    'V': ['I', 'vi', 'IV'],
                    'vi': ['ii', 'IV', 'V', 'I'],
                    'vii°': ['I', 'iii']
                };

                let suggestedFunctions = transitionRules[currentFunction] || ['I', 'IV', 'V'];

                // Apply emotional filter if provided
                if (context.emotion) {
                    suggestedFunctions = this.filterByEmotion(suggestedFunctions, context.emotion);
                }

                // Convert functions to actual chords
                const functionToInterval = {
                    'I': 0, 'ii': 2, 'iii': 4, 'IV': 5,
                    'V': 7, 'vi': 9, 'vii°': 11,
                    'bIII': 3, 'bVI': 8, 'bVII': 10
                };

                const functionToQuality = {
                    'I': 'maj', 'ii': 'min', 'iii': 'min', 'IV': 'maj',
                    'V': '7', 'vi': 'min', 'vii°': 'dim',
                    'bIII': 'maj', 'bVI': 'maj', 'bVII': 'maj'
                };

                // FASE 3: Sistema Emocional Expandido
                // Layer 2: Emociones por calidad de acorde
                const qualityEmotions = {
                    'maj':   ['pure', 'clear', 'stable'],
                    'maj7':  ['dreamy', 'sophisticated', 'lush'],
                    'maj9':  ['modern', 'spacious', 'colorful'],
                    'maj13': ['complex', 'luxurious', 'jazzy'],
                    '6':     ['nostalgic', 'sweet', 'vintage'],
                    'add9':  ['bright', 'contemporary'],
                    '7':     ['bluesy', 'dominant', 'driving'],
                    '9':     ['funky', 'sophisticated', 'rich'],
                    '13':    ['jazzy', 'complex', 'colorful'],
                    'min':   ['dark', 'sad', 'simple'],
                    'm7':    ['smooth', 'mellow', 'jazzy'],
                    'm9':    ['lush', 'sophisticated', 'ambient'],
                    'm11':   ['spacious', 'modal', 'floating'],
                    'dim':   ['unstable', 'dissonant', 'transitional'],
                    'aug':   ['surreal', 'ambiguous', 'dreamlike'],
                    'sus2':  ['open', 'bright', 'ethereal'],
                    'sus4':  ['suspended', 'anticipation', 'floating']
                };

                // Layer 3: Descripciones contextuales específicas
                const contextualDescriptions = {
                    'V_7_to_I':    'Resolución clásica V7→I - la cadencia más fuerte',
                    'V_9_to_I':    'Resolución rica V9→I - color añadido por la 9na',
                    'V_13_to_I':   'Resolución completa V13→I - máximo color (9na + 13va)',
                    'ii_m7_to_V':  'Preparación ii-V clásica - progresión jazz fundamental',
                    'ii_m9_to_V':  'Preparación ii9-V sofisticada - color moderno añadido',
                    'I_maj7_to_vi': 'Tónica sofisticada a relativo menor - elegante',
                    'I_maj9_to_vi': 'Tónica moderna a relativo menor - espaciosa',
                    'vi_m9_to_ii': 'Círculo de quintas rico - movimiento fluido con extensiones',
                    'IV_maj9_to_I': 'Resolución plagal moderna - "Amén" sofisticado',
                    'V_sus4_to_I': 'Suspensión resuelta - tensión y liberación',
                    'I_6_to_vi':   'Movimiento vintage - sonido nostálgico años 50',
                    'ii_to_V_7':   'Setup clásico ii-V7 - preparación fundamental',
                    'ii_to_V_9':   'Setup sofisticado ii-V9 - color añadido',
                    'ii_to_V_13':  'Setup complejo ii-V13 - máxima sofisticación jazz'
                };

                // Quality variations for more sophisticated suggestions
                const qualityVariations = {
                    'I': ['maj', 'maj7', 'maj9', '6', 'add9'],
                    'ii': ['min', 'm7', 'm9'],
                    'iii': ['min', 'm7'],
                    'IV': ['maj', 'maj7', 'maj9', '6', 'add9'],
                    'V': ['7', '9', '13', 'sus4'],
                    'vi': ['min', 'm7', 'm9'],
                    'vii°': ['dim', 'm7b5'],
                    'bIII': ['maj', 'maj7'],
                    'bVI': ['maj', 'maj7'],
                    'bVII': ['maj', '7']
                };

                const suggestions = [];

                suggestedFunctions.forEach(func => {
                    const interval = functionToInterval[func];
                    const chordRoot = (keyIndex + interval) % 12;
                    const chordRootName = this.getNoteName(chordRoot);

                    // Get base quality
                    const baseQuality = functionToQuality[func];

                    // Get compatibility score
                    const compatibility = this.calculateCompatibility(currentRoot, func, key);

                    // Add base quality suggestion
                    const voicingResult = this.getVoicingForChord(chordRootName, baseQuality);

                    let voiceLeading = null;
                    if (currentChord.voicing && voicingResult.voicing) {
                        voiceLeading = this.calculateVoiceLeading(currentChord.voicing, voicingResult.voicing);
                    }

                    // Generar tags emocionales combinados
                    const emotionalTags = this.generateEmotionalTags(func, baseQuality, voicingResult.voicing);

                    suggestions.push({
                        chord: chordRootName,
                        quality: baseQuality,
                        function: func,
                        compatibility: compatibility,
                        voicing: voicingResult.voicing,
                        voicingKey: voicingResult.key,
                        voiceLeading: voiceLeading,
                        explanation: this.explainTransition(currentFunction, currentQuality, func, baseQuality, compatibility.category),
                        emotionalTags: emotionalTags
                    });

                    // Add quality variations (limit to top 3 functions to avoid too many suggestions)
                    if (suggestions.length < 10) {
                        const variations = qualityVariations[func] || [baseQuality];
                        variations.slice(1, 3).forEach(quality => {
                            const varVoicingResult = this.getVoicingForChord(chordRootName, quality);
                            const varEmotionalTags = this.generateEmotionalTags(func, quality, varVoicingResult.voicing);

                            suggestions.push({
                                chord: chordRootName,
                                quality: quality,
                                function: func,
                                compatibility: { ...compatibility, score: compatibility.score - 5 }, // Slightly lower score for variations
                                voicing: varVoicingResult.voicing,
                                voicingKey: varVoicingResult.key,
                                voiceLeading: null,
                                explanation: this.explainTransition(currentFunction, currentQuality, func, quality, compatibility.category),
                                emotionalTags: varEmotionalTags
                            });
                        });
                    }
                });

                // Sort by compatibility score (descending) and limit to top 12
                return suggestions.sort((a, b) => b.compatibility.score - a.compatibility.score).slice(0, 12);
            },

            // Filter suggestions by emotion
            filterByEmotion(functions, emotion) {
                const emotionMap = {
                    'happy': ['I', 'IV', 'V', 'vi'],
                    'sad': ['vi', 'ii', 'iii', 'bVI'],
                    'dark': ['vi', 'iii', 'vii°', 'bVI'],
                    'bright': ['I', 'IV', 'V'],
                    'tense': ['V', 'vii°', 'ii'],
                    'resolved': ['I', 'IV'],
                    'mysterious': ['iii', 'vi', 'bIII', 'bVI'],
                    'energetic': ['V', 'I', 'IV']
                };

                const preferred = emotionMap[emotion] || functions;
                return functions.filter(f => preferred.includes(f)).concat(
                    functions.filter(f => !preferred.includes(f))
                );
            },

            // Explain why a transition works
            // FASE 3: Sistema contextual expandido con cualidades
            explainTransition(fromFunction, fromQuality, toFunction, toQuality, category) {
                // Primero buscar descripción contextual específica con cualidades
                const contextKey = `${fromFunction}_${fromQuality}_to_${toFunction}`;

                // contextualDescriptions está definido en suggestNextChords, pero necesitamos acceso aquí
                const contextualDescriptions = {
                    'V_7_to_I':    'Resolución clásica V7→I - la cadencia más fuerte',
                    'V_9_to_I':    'Resolución rica V9→I - color añadido por la 9na',
                    'V_13_to_I':   'Resolución completa V13→I - máximo color (9na + 13va)',
                    'ii_m7_to_V':  'Preparación ii-V clásica - progresión jazz fundamental',
                    'ii_m9_to_V':  'Preparación ii9-V sofisticada - color moderno añadido',
                    'I_maj7_to_vi': 'Tónica sofisticada a relativo menor - elegante',
                    'I_maj9_to_vi': 'Tónica moderna a relativo menor - espaciosa',
                    'vi_m9_to_ii': 'Círculo de quintas rico - movimiento fluido con extensiones',
                    'IV_maj9_to_I': 'Resolución plagal moderna - "Amén" sofisticado',
                    'V_sus4_to_I': 'Suspensión resuelta - tensión y liberación',
                    'I_6_to_vi':   'Movimiento vintage - sonido nostálgico años 50',
                    'ii_to_V_7':   'Setup clásico ii-V7 - preparación fundamental',
                    'ii_to_V_9':   'Setup sofisticado ii-V9 - color añadido',
                    'ii_to_V_13':  'Setup complejo ii-V13 - máxima sofisticación jazz'
                };

                if (contextualDescriptions[contextKey]) {
                    return contextualDescriptions[contextKey];
                }

                // Fallback a explicaciones funcionales básicas
                const explanations = {
                    'I_IV': 'Progresión plagal clásica - movimiento suave y resolutivo',
                    'I_V': 'Tensión hacia dominante - genera expectativa de regreso',
                    'I_vi': 'Giro menor - añade melancolía sin perder estabilidad',
                    'I_ii': 'Preparación suave para dominante - muy común en jazz',
                    'ii_V': 'Cadencia ii-V - la progresión más fuerte en jazz',
                    'V_I': 'Resolución dominante-tónica - la más fuerte en música occidental',
                    'V_vi': 'Cadencia rota - sorpresa emotiva, evita resolución',
                    'IV_I': 'Cadencia plagal ("Amén") - resolución tranquila',
                    'IV_V': 'Preparación para resolución - genera momentum',
                    'vi_ii': 'Círculo de quintas descendente - movimiento fluido',
                    'vi_IV': 'Progresión pop moderna - vi-IV-I-V muy popular',
                    'iii_vi': 'Movimiento descendente menor - mantiene oscuridad'
                };

                const key = `${fromFunction}_${toFunction}`;
                const baseExplanation = explanations[key] || this.getGenericExplanation(category);

                // Añadir nota sobre la cualidad si es diferente del básico
                if (toQuality && toQuality !== 'maj' && toQuality !== 'min' && toQuality !== '7') {
                    return `${baseExplanation} (variación ${toQuality})`;
                }

                return baseExplanation;
            },

            // Generic explanation based on compatibility
            getGenericExplanation(category) {
                const generic = {
                    'excellent': 'Transición muy natural y fluida según teoría armónica clásica',
                    'good': 'Movimiento coherente que funciona bien en la mayoría de contextos',
                    'interesting': 'Progresión menos común pero interesante - añade color',
                    'unexpected': 'Cambio sorpresivo - úsalo para impacto dramático'
                };
                return generic[category] || 'Transición experimental';
            },

            // FASE 3: Generar tags emocionales combinados (función, cualidad, voicing)
            generateEmotionalTags(chordFunction, quality, voicing) {
                const tags = [];

                // Layer 1: Función armónica
                const functionalTags = {
                    'I': ['resolved', 'bright', 'stable'],
                    'ii': ['smooth', 'preparatory'],
                    'iii': ['ambiguous', 'mysterious'],
                    'IV': ['lifting', 'expansive'],
                    'V': ['tense', 'expectant'],
                    'vi': ['sad', 'introspective'],
                    'vii°': ['unstable', 'leading']
                };
                if (functionalTags[chordFunction]) {
                    tags.push(...functionalTags[chordFunction]);
                }

                // Layer 2: Cualidad del acorde (reutilizando qualityEmotions definido arriba)
                if (qualityEmotions[quality]) {
                    tags.push(...qualityEmotions[quality]);
                }

                // Layer 3: Metadata del voicing (si está disponible)
                if (voicing) {
                    if (voicing.register === 'high') {
                        tags.push('bright', 'cutting');
                    } else if (voicing.register === 'low') {
                        tags.push('warm', 'foundational');
                    }

                    // Layer 4: Extensiones
                    if (voicing.extensions) {
                        if (voicing.extensions.includes('9')) tags.push('colorful', 'modern');
                        if (voicing.extensions.includes('11')) tags.push('modal', 'suspended');
                        if (voicing.extensions.includes('13')) tags.push('jazzy', 'complex');
                    }

                    // Tags del voicing si existen
                    if (voicing.emotionalTags) {
                        tags.push(...voicing.emotionalTags);
                    }
                }

                // Remove duplicates and return top 5
                return [...new Set(tags)].slice(0, 5);
            },

            // Calculate voice leading between two voicings
            calculateVoiceLeading(voicingA, voicingB) {
                if (!voicingA || !voicingB || !voicingA.frets || !voicingB.frets) {
                    return null;
                }

                const openStringNotes = MusicTheory.openStringNotes;
                let totalMovement = 0;
                let commonTones = 0;
                let movingVoices = 0;

                // Compare each string
                for (let i = 0; i < 6; i++) {
                    const fretA = voicingA.frets[i];
                    const fretB = voicingB.frets[i];

                    // Skip muted strings
                    if (fretA === -1 || fretB === -1) continue;

                    const noteA = (openStringNotes[i] + fretA) % 12;
                    const noteB = (openStringNotes[i] + fretB) % 12;

                    if (noteA === noteB) {
                        commonTones++;
                    } else {
                        const semitones = Math.abs(noteA - noteB);
                        const movement = Math.min(semitones, 12 - semitones);
                        totalMovement += movement;
                        movingVoices++;
                    }
                }

                const smoothness = Math.max(0, 100 - (totalMovement * 8));
                let recommendation = 'excellent';
                if (totalMovement > 4) recommendation = 'good';
                if (totalMovement > 8) recommendation = 'moderate';
                if (totalMovement > 12) recommendation = 'challenging';

                return {
                    movement: totalMovement,
                    commonTones: commonTones,
                    movingVoices: movingVoices,
                    smoothness: smoothness,
                    recommendation: recommendation,
                    description: this.describeVoiceLeading(totalMovement, commonTones)
                };
            },

            // Describe voice leading quality
            describeVoiceLeading(movement, commonTones) {
                if (commonTones >= 2 && movement <= 3) {
                    return `Excelente: ${commonTones} notas comunes, movimiento mínimo`;
                }
                if (movement <= 5) {
                    return `Bueno: movimiento suave de ${movement} semitonos`;
                }
                if (movement <= 10) {
                    return `Moderado: movimiento de ${movement} semitonos, practicable`;
                }
                return `Desafiante: salto grande de ${movement} semitonos`;
            },

            // ===== CHORD IDENTIFICATION ENGINE =====

            identifyChordFromNotes(noteIndices) {
                if (noteIndices.length < 2) return null;

                // Get unique notes sorted
                const uniqueNotes = [...new Set(noteIndices)].sort((a, b) => a - b);

                // Try each note as potential root
                const interpretations = [];

                for (let rootIdx = 0; rootIdx < uniqueNotes.length; rootIdx++) {
                    const root = uniqueNotes[rootIdx];
                    const intervals = uniqueNotes.map(n => (n - root + 12) % 12).sort((a, b) => a - b);

                    // Match against known chord patterns
                    const quality = this.matchChordPattern(intervals);

                    if (quality) {
                        interpretations.push({
                            root: this.getNoteName(root),
                            rootIndex: root,
                            quality: quality,
                            intervals: intervals,
                            confidence: this.calculateChordConfidence(intervals, quality)
                        });
                    }
                }

                // Return best match
                if (interpretations.length === 0) return null;

                interpretations.sort((a, b) => b.confidence - a.confidence);
                return interpretations[0];
            },

            matchChordPattern(intervals) {
                // Chord patterns: intervals from root
                const patterns = {
                    // Triads
                    'maj': [0, 4, 7],
                    'min': [0, 3, 7],
                    'dim': [0, 3, 6],
                    'aug': [0, 4, 8],
                    'sus2': [0, 2, 7],
                    'sus4': [0, 5, 7],

                    // 7th chords
                    'maj7': [0, 4, 7, 11],
                    '7': [0, 4, 7, 10],
                    'm7': [0, 3, 7, 10],
                    'dim7': [0, 3, 6, 9],
                    'm7b5': [0, 3, 6, 10],

                    // Extensions
                    'add9': [0, 2, 4, 7],
                    '9': [0, 2, 4, 7, 10],
                    'maj9': [0, 2, 4, 7, 11],
                    'm9': [0, 2, 3, 7, 10],
                    '6': [0, 4, 7, 9],
                    'm6': [0, 3, 7, 9],

                    // Power chord
                    '5': [0, 7]
                };

                // Find best match
                let bestMatch = null;
                let bestScore = 0;

                for (const [quality, pattern] of Object.entries(patterns)) {
                    const score = this.matchPatternScore(intervals, pattern);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = quality;
                    }
                }

                // Require at least 60% match
                return bestScore >= 0.6 ? bestMatch : null;
            },

            matchPatternScore(intervals, pattern) {
                // Calculate how well intervals match pattern
                let matches = 0;
                let total = Math.max(intervals.length, pattern.length);

                for (const interval of pattern) {
                    if (intervals.includes(interval)) {
                        matches++;
                    }
                }

                // Bonus for exact match
                if (matches === pattern.length && intervals.length === pattern.length) {
                    return 1.0;
                }

                return matches / total;
            },

            calculateChordConfidence(intervals, quality) {
                // Higher confidence if:
                // 1. Root is present (0)
                // 2. Pattern matches well
                // 3. No unexpected intervals

                let confidence = 0.5;

                if (intervals[0] === 0) confidence += 0.3; // Root present

                const patterns = {
                    'maj': [0, 4, 7],
                    'min': [0, 3, 7],
                    '7': [0, 4, 7, 10],
                    'maj7': [0, 4, 7, 11]
                    // ... etc
                };

                const pattern = patterns[quality];
                if (pattern) {
                    const score = this.matchPatternScore(intervals, pattern);
                    confidence += score * 0.2;
                }

                return Math.min(confidence, 1.0);
            },

            // Datos de funciones armónicas para el diagrama T-SD-D
            harmonicFunctionData: {
                1: { function: 'T', description: 'Tónica - Reposo y estabilidad' },
                2: { function: 'SD', description: 'Subdominante - Movimiento suave hacia tensión' },
                3: { function: 'T/D', description: 'Tónica/Dominante - Función ambigua' },
                4: { function: 'SD', description: 'Subdominante - Tensión media' },
                5: { function: 'D', description: 'Dominante - Máxima tensión, necesita resolver' },
                6: { function: 'T', description: 'Tónica menor - Reposo en modo menor' },
                7: { function: 'D', description: 'Dominante - Tensión extrema por el tritono' }
            }
        };
