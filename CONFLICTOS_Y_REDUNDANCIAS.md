# CONFLICTOS Y REDUNDANCIAS — Guitar Theory Master
## Análisis cruzado: propuestas del MD vs. implementación real

---

## TIPO 1 — YA EXISTE EN ESE MISMO NIVEL (propuesta innecesaria)

Estas propuestas están marcadas como pendientes en el MD pero ya están implementadas en el código.

| Nivel | Propuesta en MD | Realidad en el código |
|---|---|---|
| **N1** | "Añadir reproducción de audio" *(prioridad Alta)* | Audio completamente funcional con Web Audio API. Modos: secuencial, descendente, armónico. |
| **N1** | "Añadir intervalo de Octava (8ª J)" | Ya existe. El selector tiene 16 tipos: Unísono, 2ªm, 2ªM, 3ªm, 3ªM, 4ªJ, Tritono, 5ªJ, 6ªm, 6ªM, 7ªm, 7ªM, **Octava**, 9ªM, 9ªm, 10ªM. |
| **N2** | "Reproducción de audio" *(prioridad Alta)* | Ya implementado con `AudioEngine.playScale()`. Modos ascendente/descendente/aleatorio y velocidades lento/medio/rápido. |
| **N2** | "Licks comunes por box" | Ya existe en el Box Mode de pentatónicas. Licks de B.B. King, Clapton, SRV, Jimmy Page y Slash con tablatura ASCII por cada caja. |
| **N3** | "Toggle múltiples posiciones / voicings CAGED" | Ya existe. Implementadas las 5 formas CAGED por acorde (C, A, G, E, D shapes) con sus voicings. |
| **N9** | "Implementar Ear Training completo" *(prioridad Alta)* | Ya completamente funcional. 5 modos: intervalos, acordes, escalas, dictado melódico, dictado rítmico. 3 dificultades con síntesis de audio real. |

---

## TIPO 2 — EXISTE EN OTRO NIVEL (añadirlo duplicaría contenido)

Estas propuestas tienen sentido conceptualmente pero ya están resueltas en otro nivel diferente.

### N6 — "Editor de progresión" (drag & drop, añadir/quitar acordes, guardar)
- **Propuesto en:** N6 Progresiones
- **Ya existe en:** N11 Chord Lab — Progression Lab libre hace exactamente esto: selección libre de acordes, construcción, guardar/cargar con localStorage.
- **Recomendación:** Eliminar del N6. Si el usuario quiere construir, va a N11. El N6 es para explorar y reproducir progresiones predefinidas.

### N6 — "Sugerencias de siguiente acorde"
- **Propuesto en:** N6 Progresiones
- **Ya existe en:** El propio N6 ya tiene `suggestNextChords()` implementado. Además N11 tiene sugerencias contextuales por emoción y función armónica.
- **Recomendación:** Eliminar del MD, ya implementado en ambos sitios.

### N3 — "Ejercicio voice leading — conecta los acordes"
- **Propuesto en:** N3 Acordes Básicos
- **Ya existe en:** N11 Chord Lab, modo Practice tiene Voice Leading Drills específicamente para esto.
- **Recomendación:** Eliminar del N3. El voice leading como ejercicio práctico vive en N11.

### N3 — "Substituciones de acordes (I→I6, Imaj7, add9...)"
- **Propuesto en:** N3 Acordes Básicos
- **Ya existe en:** N4 Acordes Extendidos — esas substituciones son precisamente el contenido del N4 (maj7, 9, add9, 6, etc.).
- **Recomendación:** Eliminar del N3. Añadir en N4 un texto que explique explícitamente que estas extensiones son substituciones del acorde básico.

### N6 — "Backing track simple (bajo, batería)"
- **Propuesto en:** N6 Progresiones
- **Ya existe en:** N10 Jam Session — 12 backing tracks con blues, jazz, rock, funk, metal, cada uno con BPM, escala, feel (shuffle/swing/straight) y descripción.
- **Recomendación:** Eliminar del N6. Añadir en su lugar un botón "Practicar en Jam Session" que lleve al N10 con la progresión seleccionada.

### N10 — "Lick Library completa por género y técnica"
- **Propuesto en:** N10 como feature nueva
- **Parcialmente existe en:** N2 Pentatónicas — ya tiene licks famosos con tablatura por cada caja (Box 1-5).
- **Recomendación:** No duplicar los licks de pentatónica. La Lick Library del N10 debe ser el destino central de todos los licks. Los licks del N2 podrían ser un subconjunto filtrado desde N10, o N2 puede referenciar a N10.

---

## TIPO 3 — SOLAPAMIENTO CONCEPTUAL ENTRE NIVELES

Estos casos no son duplicados exactos pero crean confusión sobre quién es responsable de cada cosa.

### Análisis armónico en tiempo real (N6 propuesta A.1)
- **N6** ya tiene etiquetas T/SD/D, grados romanos y canciones de ejemplo por progresión.
- **N11** tiene análisis de compatibilidad, voice leading y explicación de transiciones al construir.
- **Diferencia de enfoque:** N6 = análisis durante la *reproducción* de progresiones predefinidas. N11 = análisis durante la *construcción* libre.
- **Recomendación:** Mantener en ambos, pero diferenciarlos claramente. El N6 muestra la narrativa armónica de la progresión que está sonando. El N11 muestra la mecánica de las conexiones al elegir acordes.

### CAGED + Extensiones 7ª/9ª (N7 propuesta A.3)
- **N7** enseña las 5 posiciones del mástil como marco geográfico.
- **N4** enseña acordes extendidos con sus voicings incluyendo shapes E, A, D.
- **Riesgo:** Si N7 añade extensiones, se convierte en un segundo N4 visto desde otro ángulo.
- **Recomendación:** En N7 añadir solo un enlace conceptual ("Este voicing de 7ª visto en N4 pertenece a la forma E del CAGED"), no un sistema completo de extensiones. La profundidad de las extensiones vive en N4.

### Variación rítmica / patrones (N6 propuesta A.3)
- **N6** propone patrones de negras, corcheas, fingerpicking, funk.
- **N10** (Jam Session) ya tiene feel de Shuffle, Swing, Straight en los backing tracks.
- **N9** (Ear Training) tiene dictado rítmico con patrones.
- **Recomendación:** Los patrones rítmicos de N6 solo tienen sentido si el N6 tiene su propio reproductor. Si se unifica con N10 (backing track), los patrones rítmicos van ahí.

### Sistema de favoritos (N6 propuesta A.4)
- **N6** propone favoritos de progresiones.
- **N11** ya tiene voicings guardados en localStorage.
- **N10** no tiene favoritos pero es el lugar natural para favoritos de backing tracks y canciones.
- **Riesgo:** Tener tres sistemas de guardado fragmentados crea inconsistencia de UX.
- **Recomendación:** Un sistema de favoritos unificado, accesible desde N6, N10 y N11. O como mínimo, que todos usen el mismo esquema de localStorage.

---

## TIPO 4 — PROPUESTA EN EL NIVEL EQUIVOCADO

Estas propuestas tienen sentido pero encajan mejor en otro nivel.

| Propuesta | Nivel propuesto en MD | Nivel correcto | Razón |
|---|---|---|---|
| "Sugerencias de progresiones comunes — después de X prueba Y" | N3 Acordes Básicos | **N6** Progresiones | N3 enseña acordes individuales. Las sugerencias de encadenamiento son el territorio de N6. |
| "Backing track simple" | N6 Progresiones | **N10** Biblioteca/Práctica | N10 ya es el sistema de Jam Session. El backing track debe vivir ahí, no duplicarse en N6. |
| "Exportar progresión a texto (Am-F-C-G)" | N6 Progresiones | **N11** Chord Lab | El Chord Lab ya tiene save/load. El export encaja como extensión de ese sistema, no del reproductor de N6. |
| "Constructor de dominantes secundarios interactivo" | N8 Dominantes Secundarios | **N11** Chord Lab | La construcción interactiva de progresiones con acordes no diatónicos vive en el Chord Lab. N8 es para entender el concepto, no para construir. |
| "Rutinas de práctica con timer" | N10 Biblioteca | **Sistema global** (header o sidebar) | Una rutina necesita recursos de múltiples niveles (escalas de N2, acordes de N3, licks de N10). No puede pertenecer solo al N10. |

---

## RESUMEN — DISTRIBUCIÓN LIMPIA POR NIVEL

Esta es la separación de responsabilidades que resulta del análisis:

| Nivel | Responsabilidad única | Qué NO debe tener |
|---|---|---|
| **N1** Intervalos | Distancias, sonido, consonancia | — |
| **N2** Escalas | Escalas, modos, pentatónicas, cómo suenan | Editor de progresiones, voice leading |
| **N3** Acordes Básicos | Triadas, inversiones, función diatónica | Voice leading (→N11), substituciones (→N4), progresiones (→N6) |
| **N4** Acordes Extendidos | Extensiones y substituciones del acorde básico | — |
| **N5** Círculo de Quintas | Relaciones tonales, armaduras | — |
| **N6** Progresiones | Reproducción y análisis de progresiones predefinidas | Editor libre (→N11), backing track (→N10), constructor (→N11) |
| **N7** CAGED | Mapa del mástil, sistema de posiciones | Extensiones en profundidad (→N4) |
| **N8** Dominantes Secundarios | Concepto y sonido de cromatismo armónico | Constructor de progresiones (→N11) |
| **N9** Entrenamiento | Quiz visual + Ear Training | — |
| **N10** Biblioteca/Práctica | Canciones, jam session, licks, backing tracks, rutinas | Editor de progresiones (→N11) |
| **N11** Chord Lab | Construcción avanzada, voice leading, editor libre, voicings | Backing tracks (→N10) |

---

## PROPUESTAS PENDIENTES REALES (sin conflictos)

Las que quedan limpias después de eliminar todo lo anterior:

### Alta prioridad real
- N5: Tour sonoro y hover con relaciones visuales
- N6: Reorganizar categorías de progresiones
- N6: Análisis armónico durante reproducción (T/SD/D visible mientras suena)
- N7: Entrenamiento progresivo forma a forma
- N9: Feedback educativo (al fallar, explicar por qué y enlazar al nivel correspondiente)
- N9: Sistema de progreso/logros persistente

### Media prioridad real
- N1: Color-coding de intervalos por consonancia
- N1: Panel educativo con ejemplos en canciones famosas
- N2: Mejorar visualización de boxes pentatónicas en fretboard grande
- N4: Destacar acordes esenciales vs. raros con badge visual
- N4: Filtro de dificultad de voicings
- N7: Ejercicio interactivo "encuentra la forma CAGED"
- N7: Visualización alternativa en mástil completo (en lugar del pentágono)
- N8: Tutorial comparativo con/sin dominante secundario
- N10: Modo "aprende a tocar" por canción (progresión + patrón de rasgueo)
- N11: Tutorial inicial para nuevos usuarios
- N11: Organización de guardados (carpetas o tags)

### Baja prioridad real
- N1: Modo comparación sonora entre dos intervalos
- N5: Panel con diagramas de armadura de clave
- N8: Biblioteca de ejemplos reales en canciones famosas
- N10: Sistema de progreso por canción (estados: aprendiendo/dominada)
- N11: Compartir progresiones con código único

---

*Documento generado: 2026-02-11*
*Basado en análisis cruzado de ANALISIS_MEJORAS_POR_NIVEL.md e index.html (~45.000 líneas)*
