# ANÁLISIS DE MEJORAS - Guitar Theory Master
## Propuestas por Nivel

---

## NIVEL 1 - INTERVALOS

### Estado Actual
- 11 botones de intervalos (2ªm hasta 7ªM)
- Visualización ascendente/descendente en fretboard
- Información básica de semitonos
- Sin reproducción de audio
- Sin ejercicios interactivos

### Problemas Detectados
1. **Falta de audio**: No se puede escuchar el intervalo
2. **Visualización limitada**: Solo muestra 2 notas, no todas las posiciones
3. **Sin práctica**: No hay modo de entrenamiento específico
4. **Información escasa**: Panel de info podría ser más educativo
5. **Sin octava**: Falta el intervalo de 8ª (octava justa)

### Propuestas de Mejora

#### A. AÑADIR (Features Nuevas)
1. **Botón "Play" para reproducir intervalo**
   - Ascendente (secuencial)
   - Descendente
   - Armónico (ambas notas simultáneas)

2. **Selector de dirección visual**
   - Toggle: Ascendente / Descendente / Ambos
   - Mostrar todas las posiciones del intervalo en el mástil

3. **Añadir intervalo de Octava (8ª J)**
   - Intervalo fundamental que falta

4. **Panel educativo mejorado**
   - Ejemplos de canciones famosas con ese intervalo
   - Calidad del intervalo (justo, mayor, menor, aumentado, disminuido)
   - Consonancia vs disonancia
   - Nombre alternativo (ej: 4ª aumentada = tritono)

5. **Modo comparación**
   - Botón "Comparar con..."
   - Seleccionar 2 intervalos para escuchar diferencia

#### B. REORGANIZAR (UI/UX)
1. **Agrupar intervalos por tipo**
   - Segundas (2ªm, 2ªM)
   - Terceras (3ªm, 3ªM)
   - Cuartas (4ªJ, Tritono)
   - Quintas (5ªJ, 5ªdim podría añadirse)
   - Sextas (6ªm, 6ªM)
   - Séptimas (7ªm, 7ªM)
   - Octava (8ªJ)

2. **Color-coding por consonancia**
   - Verde: Consonantes perfectos (8ª, 5ª, 4ª)
   - Azul: Consonantes imperfectos (3ªM, 6ªM, 3ªm, 6ªm)
   - Amarillo: Disonantes leves (2ªM, 7ªm)
   - Rojo: Disonantes fuertes (2ªm, 7ªM, tritono)

#### C. QUITAR (Simplificar)
- Nada a quitar - nivel muy limpio

#### D. PRIORIDAD
- **Alta**: Añadir reproducción de audio (crítico)
- **Alta**: Añadir octava
- **Media**: Mejorar panel educativo
- **Baja**: Modo comparación

---

## NIVEL 2 - ESCALAS, MODOS Y PENTATÓNICAS

### Estado Actual
- 5 categorías (Mayores, Menores, Modos, Pentatónicas, Exóticas)
- Sub-selector de pentatónicas (tipo + 5 posiciones)
- Visualización en fretboard completo
- Panel informativo con fórmula, emoción, brightness
- Acordes de armonización clickeables

### Problemas Detectados
1. **Pentatónicas: visualización confusa**
   - Las 5 boxes se ven mal en el fretboard grande
   - La zona resaltada es muy pequeña

2. **Falta audio**: No se pueden escuchar las escalas
3. **Modos: difícil entender diferencias**
   - No hay comparación lado a lado
   - Falta explicación de por qué suenan diferentes

4. **Escalas exóticas: sin contexto**
   - No hay ejemplos de uso
   - Difícil recordar cuándo usar cada una

5. **Armonización: redundante**
   - Ya existe en nivel 3 (Acordes Básicos)
   - Puede confundir

### Propuestas de Mejora

#### A. AÑADIR
1. **Reproducción de audio**
   - Botón "Play Escala" (ascendente/descendente)
   - Speed control (lento/medio/rápido)

2. **Modo "Comparar Modos"**
   - Split screen visual
   - Dos fretboards lado a lado
   - Reproducción sincronizada
   - Resaltar notas diferentes entre modos

3. **Panel mejorado para exóticas**
   - Género musical asociado (ej: Harmonic Minor → Metal, Neoclásico)
   - Artistas/canciones famosas
   - Backing track sample

4. **Visualización mejorada pentatónicas**
   - Opción "Ver las 5 boxes simultáneamente" (similar a CAGED)
   - Diagrama horizontal scrolleable
   - Conexiones visuales entre boxes

5. **Ejercicio "Encuentra el Patrón"**
   - Mostrar solo algunas notas de la escala
   - Usuario completa las restantes
   - Feedback inmediato

#### B. REORGANIZAR
1. **Mover armonización a acordes básicos**
   - Eliminar botones de acordes de este nivel
   - Dejar solo información teórica

2. **Pentatónicas: mejorar estructura**
   - Tab 1: Visualización global (todas las notas)
   - Tab 2: Sistema de boxes (5 posiciones)
   - Tab 3: Licks comunes por box

3. **Categorías más intuitivas**
   - Cambiar "Mayores/Menores" por:
     - **Básicas**: Mayor, Menor Natural, Armónica, Melódica
     - **Modos Griegos**: Jónico, Dórico, Frigio, Lidio, Mixolidio, Eólico, Locrio
     - **Pentatónicas**: Menor, Mayor, Blues (con boxes)
     - **Avanzadas**: Alterada, Whole Tone, Diminished, etc.

#### C. QUITAR
1. **Armonización de acordes** (moverla a nivel 3)
2. **Información redundante** en panel (si ya está en otro sitio)

#### D. PRIORIDAD
- **Alta**: Reproducción de audio
- **Alta**: Mejorar visualización de pentatónicas
- **Media**: Modo comparar modos
- **Media**: Reorganizar categorías
- **Baja**: Ejercicio "Encuentra el Patrón"

---

## NIVEL 3 - ACORDES BÁSICOS

### Estado Actual
- 7 acordes diatónicos (I-vii°)
- Un solo diagrama por acorde
- Función armónica en panel
- Botón Play
- Visualización en fretboard

### Problemas Detectados
1. **Un solo voicing**: Solo muestra una posición del acorde
2. **Sin inversiones**: No enseña inversiones (bajo en 3ª, 5ª)
3. **Información limitada**: Panel podría ser más educativo
4. **Sin progresiones comunes**: No sugiere cómo usar los acordes juntos
5. **Falta contexto práctico**: Cuándo usar cada grado

### Propuestas de Mejora

#### A. AÑADIR
1. **Toggle "Mostrar todas las posiciones"**
   - Similar a CAGED
   - 3-4 voicings por acorde
   - Posiciones abiertas vs cerradas

2. **Selector de inversiones**
   - Fundamental (5ª en bajo)
   - Primera inversión (3ª en bajo)
   - Segunda inversión (5ª en bajo)
   - Diagrama actualizado automáticamente

3. **Sugerencias de progresiones**
   - "Este acorde suena bien después de: ___"
   - "Este acorde suena bien antes de: ___"
   - Probabilidad/fortaleza de conexión (visual)

4. **Ejercicio "Conecta los acordes"**
   - Mostrar 2 acordes
   - Usuario encuentra mejor voice leading
   - Sistema evalúa movimiento de voces

5. **Integrar armonización desde escalas**
   - Traer los acordes desde nivel 2
   - Mostrar relación escala → acorde
   - "Este acorde nace del grado X de la escala Y"

6. **Tab "Substituciones"**
   - Por cada acorde, mostrar acordes que pueden sustituirlo
   - Ej: I → I6, Imaj7, I add9
   - ii → ii7, iiø7 (si queremos sonido más oscuro)

#### B. REORGANIZAR
1. **Añadir subtabs**
   - **Triadas Básicas** (actual)
   - **Inversiones** (nuevo)
   - **Substituciones** (nuevo)
   - **Progresiones Comunes** (sugerencias visuales)

2. **Panel informativo más visual**
   - Diagrama de función armónica (T-SD-D en círculo)
   - Highlight del acorde actual en el círculo
   - Flechas indicando resoluciones típicas

#### C. QUITAR
- Nada crítico

#### D. PRIORIDAD
- **Alta**: Mostrar múltiples posiciones
- **Alta**: Inversiones
- **Media**: Sugerencias de progresiones
- **Media**: Substituciones
- **Baja**: Ejercicio voice leading

---

## NIVEL 4 - ACORDES EXTENDIDOS

### Estado Actual
- Tabs: 7ª, 9ª, 11ª, 13ª
- Matriz 4×4 (Maj, Dom, Min, Alt)
- Un voicing por acorde
- Panel con fórmula y tensiones
- Botón Play

### Problemas Detectados
1. **Matriz abrumadora**: 16 acordes por tab = 64 acordes totales
2. **Sin explicación progresiva**: Salto directo a acordes complejos
3. **Voicings pueden ser muy difíciles**: Algunas posiciones imposibles para principiantes
4. **Falta contexto de uso**: Cuándo usar cada extensión
5. **Sin diferenciación de dificultad**: Todos los acordes parecen igual de importantes

### Propuestas de Mejora

#### A. AÑADIR
1. **Filtro de dificultad**
   - Fácil: Solo voicings en primeras 5 trastes
   - Medio: Hasta traste 12
   - Avanzado: Cualquier posición

2. **"Acordes más usados" destacados**
   - Badge "⭐ ESENCIAL" en:
     - maj7, 7 (dom), m7, ø7 (los básicos de 7ª)
     - maj9, 9, m9 (los 9ª más comunes)
   - Resto en color más tenue

3. **Toggle "Voicings alternativos"**
   - Click en acorde → muestra 2-3 voicings
   - Scrollable horizontal

4. **Contexto de uso por tab**
   - **7ª**: "Esenciales en jazz, funk, soul"
   - **9ª**: "Color y sofisticación, evita sonido básico"
   - **11ª**: "Muy jazzy, suspended feel"
   - **13ª**: "Máxima densidad armónica, cuidado con saturación"

5. **Ejercicio "Simplifica el acorde"**
   - Mostrar un 13th
   - Usuario quita tensiones para hacerlo más simple
   - Enseña qué notas son prescindibles

6. **Comparador "Con/Sin tensión"**
   - Reproducir Cmaj7 vs Cmaj9 vs Cmaj13
   - Escuchar progresivamente cómo se enriquece

#### B. REORGANIZAR
1. **Simplificar matriz inicial**
   - Por defecto: Solo mostrar acordes "⭐ ESENCIALES"
   - Botón "Ver todos" expande matriz completa

2. **Reorganizar tabs**
   - Tab 1: **Esenciales** (maj7, 7, m7, ø7, dim7)
   - Tab 2: **Color 9ª** (maj9, 9, m9, 7#9, 7b9)
   - Tab 3: **Suspensión 11ª** (maj11, 11, m11)
   - Tab 4: **Densidad 13ª** (maj13, 13, m13)
   - Tab 5: **Alterados** (alt, 7#5, 7b5, etc.)

3. **Panel con ejemplos sonoros**
   - "Escucha este acorde en: [Nombre de canción]"
   - Mini reproductor integrado

#### C. QUITAR
1. **Acordes ultra-raros** de matriz Alter
   - Mantener solo: alt, 7#9, 7b9, 7#5, 7b5
   - Remover: combinaciones que nadie usa

#### D. PRIORIDAD
- **Alta**: Destacar acordes esenciales
- **Alta**: Reorganizar tabs
- **Media**: Voicings alternativos
- **Media**: Filtro de dificultad
- **Baja**: Ejercicio simplificación

---

## NIVEL 5 - CÍRCULO DE QUINTAS

### Estado Actual
- Visualización SVG circular
- Notas mayores (exterior) y menores (interior)
- Click cambia tonalidad
- Panel con información de armadura
- Triadas diatónicas
- Modulaciones vecinas

### Problemas Detectados
1. **Estático**: Solo visual, sin interactividad avanzada
2. **Sin audio**: No se escucha el movimiento por quintas
3. **Información plana**: Panel de texto, poco visual
4. **No enseña aplicación práctica**: ¿Para qué sirve en la vida real?
5. **Falta animación**: Movimiento por círculo no es obvio

### Propuestas de Mejora

#### A. AÑADIR
1. **Modo "Tour Sonoro"**
   - Botón "Reproducir Círculo Completo"
   - Va tocando cada tonalidad en sentido horario
   - Tempo ajustable
   - Resalta nota actual con animación

2. **Visualización de relaciones**
   - Hover sobre una nota:
     - Highlight de V (quinta siguiente)
     - Highlight de IV (quinta anterior)
     - Highlight de relativa menor
   - Líneas de conexión temporales

3. **Mini-juego "Encuentra la modulación"**
   - Sistema dice: "Estamos en C, queremos ir a G"
   - Usuario hace click en el camino más corto
   - Feedback: "Correcto, solo 1 paso por quintas"

4. **Panel mejorado con visuales**
   - Diagrama de armadura de clave (♯ y ♭ en pentagrama)
   - Animación de cómo se construye
   - Regla mnemotécnica

5. **Tab "Modulaciones Comunes"**
   - Desde tonalidad actual, mostrar:
     - Modulación a V (dominante) - ⭐ MUY COMÚN
     - Modulación a IV (subdominante) - ⭐ COMÚN
     - Modulación a relativa menor - ⭐ COMÚN
     - Modulación a vi (submediante) - MENOS COMÚN
   - Progresión ejemplo para cada una

6. **Círculo de Cuartas** (toggle)
   - Botón "Ver Círculo de Cuartas"
   - Invierte el orden
   - Útil para bajistas y algunos contextos

#### B. REORGANIZAR
1. **Mejorar SVG**
   - Añadir números de alteraciones dentro de cada sección
   - Color-coding por número de ♯/♭
   - Leyenda visual

2. **Dos modos de vista**
   - **Simple**: Solo círculo (actual)
   - **Completo**: Círculo + panel lateral + triadas

#### C. QUITAR
- Información redundante si está en otro nivel

#### D. PRIORIDAD
- **Alta**: Tour sonoro
- **Alta**: Visualización de relaciones (hover)
- **Media**: Panel con diagramas de armadura
- **Media**: Tab de modulaciones comunes
- **Baja**: Mini-juego
- **Baja**: Círculo de cuartas

---

## NIVEL 6 - PROGRESIONES

### Estado Actual
- 4 categorías de progresiones
- Mini-diagramas scrolleables
- Botones: Play, Pause, Stop
- Tempo slider (40-200 BPM)
- Loop checkbox
- Diagramas clickeables (cambian acorde activo)

### Problemas Detectados
1. **Sin análisis en tiempo real**: No explica QUÉ está pasando mientras suena
2. **No se puede editar**: Progresiones son fijas
3. **Sin guardar favoritas**: No hay sistema de favoritos
4. **Falta variación rítmica**: Todo suena a negras
5. **Sin backing track**: Solo acordes secos
6. **Categorías poco claras**: "Avanzadas" vs "Jazz Avanzado" confunde

### Propuestas de Mejora

#### A. AÑADIR
1. **Análisis visual en tiempo real**
   - Mientras suena, mostrar:
     - Función armónica del acorde actual (T, SD, D)
     - Grado romano
     - Tensión acumulada (barra de 0-100%)
   - Gráfico de tensión/resolución en tiempo real

2. **Editor de progresión**
   - Botón "Personalizar"
   - Drag & drop de acordes
   - Añadir/quitar acordes
   - Cambiar orden
   - Guardar como "Mi Progresión"

3. **Variación rítmica**
   - Selector de patrón:
     - Negras (actual)
     - Corcheas (strumming)
     - Patrón fingerpicking
     - Patrón funk (síncopas)

4. **Sistema de favoritos**
   - Estrella en cada progresión
   - Tab "★ Favoritas"
   - Guardar hasta 20 favoritas

5. **Backing track simple**
   - Toggle "Añadir bajo"
   - Toggle "Añadir batería simple"
   - Botón "Añadir melodía sugerida"

6. **Sugerencias de siguiente acorde**
   - Mientras editas, sistema sugiere:
     - "Después de este acorde, prueba: [lista]"
     - Probabilidades basadas en teoría

7. **Exportar progresión**
   - Botón "Exportar"
   - Formato texto: "Am - F - C - G"
   - Copiar al portapapeles

#### B. REORGANIZAR
1. **Simplificar categorías**
   - **Pop/Rock** (I-V-vi-IV, I-IV-V, etc.)
   - **Jazz** (ii-V-I, I-vi-ii-V, Coltrane, etc.)
   - **Blues** (12-bar, 16-bar, jazz blues)
   - **Modal** (Dorian, Phrygian, etc.)
   - **Creativas** (Andaluza, Canon, Epic)
   - **★ Mis Favoritas** (nuevo)

2. **Vista mejorada de progresión**
   - Añadir:
     - Nombre de progresión prominente
     - Ejemplo de canción que la usa
     - Nivel de dificultad (🟢🟡🔴)
     - Tiempo estimado para dominarla

3. **Panel lateral con info**
   - Mientras se reproduce:
     - Análisis armónico completo
     - Historia/narrativa de la progresión
     - Tips de ejecución

#### C. QUITAR
1. **Progresiones ultra-complejas** que nadie usa
   - Revisar si hay progresiones demasiado avanzadas
   - Moverlas a una categoría "Experimental"

#### D. PRIORIDAD
- **Alta**: Análisis visual en tiempo real
- **Alta**: Sistema de favoritos
- **Alta**: Reorganizar categorías
- **Media**: Editor de progresión
- **Media**: Variación rítmica
- **Media**: Exportar progresión
- **Baja**: Backing track simple

---

## NIVEL 7 - SISTEMA CAGED

### Estado Actual
- Sección educativa con explicación
- Visualización pentagonal SVG
- Toggle "Ver Todas las Formas"
- Tour completo (automático)
- Ejercicio práctico
- Información por forma

### Problemas Detectados
1. **Complejidad inicial abrumadora**: Demasiada info de golpe
2. **Tour automático puede ser confuso**: No hay control
3. **Ejercicio práctico: solo texto**: No hay validación interactiva
4. **Falta conexión con acordes**: No queda claro cómo usar CAGED con 7ª, 9ª, etc.
5. **Visualización pentagonal**: Poco intuitiva para principiantes

### Propuestas de Mejora

#### A. AÑADIR
1. **Modo "Entrenamiento Progresivo"**
   - Nivel 1: Solo forma C (practicar en todas las tonalidades)
   - Nivel 2: Formas C y A
   - Nivel 3: C, A, G
   - Nivel 4: C, A, G, E
   - Nivel 5: Todas
   - Usuario avanza cuando domina nivel actual

2. **Ejercicio interactivo "Encuentra la forma"**
   - Sistema dice: "Toca G Mayor en forma E"
   - Usuario hace click en la zona correcta del fretboard
   - Feedback visual inmediato

3. **CAGED + Extensiones**
   - Toggle "Mostrar 7ª"
   - Toggle "Mostrar 9ª"
   - Ver cómo cada forma CAGED se convierte en acorde extendido

4. **Ejercicio "Conecta las formas"**
   - Mostrar 2 formas consecutivas
   - Usuario traza el movimiento más eficiente
   - Sistema evalúa voice leading

5. **Modo "Quiz CAGED"**
   - Pregunta aleatoria: "¿Qué forma es esta?"
   - Mostrar diagrama sin label
   - Usuario selecciona C/A/G/E/D
   - Puntuación y racha

6. **Visualización en mástil completo**
   - Opción alternativa al pentágono
   - Mapa del mástil con las 5 zonas coloreadas
   - Más intuitivo que pentágono

#### B. REORGANIZAR
1. **Simplificar inicio**
   - Por defecto: Solo mostrar una forma
   - Botón "Ver sistema completo" → muestra pentágono + todas las formas

2. **Reorganizar tabs**
   - **Aprende**: Explicación + visualización simple
   - **Practica**: Ejercicios interactivos
   - **Expande**: CAGED + extensiones (7ª, 9ª)
   - **Maestría**: Quiz y ejercicios avanzados

3. **Mejorar Tour**
   - Añadir botones: Anterior, Siguiente, Pausar
   - Slider de velocidad
   - Repetir paso actual

#### C. QUITAR
1. **Explicación inicial muy densa**
   - Simplificar texto
   - Añadir más visuales, menos texto

#### D. PRIORIDAD
- **Alta**: Entrenamiento progresivo
- **Alta**: Visualización en mástil (alternativa a pentágono)
- **Media**: CAGED + extensiones
- **Media**: Ejercicio interactivo "Encuentra la forma"
- **Baja**: Quiz CAGED

---

## NIVEL 8 - DOMINANTES SECUNDARIOS

### Estado Actual
- 5 dominantes secundarios (V/ii, V/iii, V/IV, V/V, V/vi)
- 3 progresiones predefinidas
- Dos diagramas lado a lado (dominante → resolución)
- Flecha visual de dirección
- Panel con análisis

### Problemas Detectados
1. **Concepto difícil, poca pedagogía**: Necesita más explicación paso a paso
2. **Solo 5 dominantes**: Faltan V/I (que técnicamente es V) y V/bVII
3. **Sin audio comparativo**: No se escucha diferencia con/sin dominante secundario
4. **Progresiones limitadas**: Solo 3 ejemplos
5. **Falta contexto de canciones**: No hay ejemplos reales

### Propuestas de Mejora

#### A. AÑADIR
1. **Tutorial interactivo inicial**
   - Paso 1: "Esto es una progresión sin dominante secundario" [Reproducir]
   - Paso 2: "Ahora añadimos V/vi antes de vi" [Reproducir]
   - Paso 3: "Escucha la diferencia" [Reproducir ambas]
   - Usuario controla el avance

2. **Modo "Comparar"**
   - Progresión sin dominante secundario
   - Misma progresión CON dominante secundario
   - Botones: "Sin DS", "Con DS", "Ambas"
   - Highlight visual de qué acorde se añadió

3. **Constructor de dominantes secundarios**
   - Progresión base (ej: I - vi - IV - V)
   - Usuario hace click en cualquier acorde
   - Sistema sugiere: "Añade V/vi antes de vi"
   - Preview sonoro antes de confirmar

4. **Biblioteca de ejemplos reales**
   - Lista de canciones famosas con dominantes secundarios
   - Ejemplo: "Sweet Home Alabama" - V/IV → IV
   - Click en canción → muestra análisis completo

5. **Dominantes secundarios adicionales**
   - Añadir V/bVII (muy usado en rock)
   - Añadir SubV (sustituto tritonal del dominante secundario)

6. **Ejercicio "Identifica el dominante secundario"**
   - Reproducir progresión
   - Usuario identifica qué acorde es el dominante secundario
   - Opciones múltiples
   - Feedback con explicación

#### B. REORGANIZAR
1. **Estructura en 3 tabs**
   - **Aprende**: Tutorial interactivo + explicación
   - **Explora**: Selector de dominantes + diagramas (actual)
   - **Practica**: Ejercicios + constructor

2. **Panel informativo más visual**
   - Diagrama de flujo:
     ```
     V/vi → vi
       ↓      ↓
      D7  →  Dm
     ```
   - Color-coding de tensión/resolución

#### C. QUITAR
- Nada crítico

#### D. PRIORIDAD
- **Alta**: Tutorial interactivo
- **Alta**: Modo comparar
- **Media**: Constructor de dominantes secundarios
- **Media**: Biblioteca de ejemplos reales
- **Baja**: Ejercicio identificación

---

## NIVEL 9 - ENTRENAMIENTO

### Estado Actual
- Quiz Visual (5 categorías × 3 dificultades)
- Puntuación, racha, récord
- Ear Training (placeholder, no funcional)
- 4 opciones de respuesta por pregunta

### Problemas Detectados
1. **Ear Training no funciona**: Es solo placeholder
2. **Quiz visual limitado**: Solo preguntas teóricas
3. **Sin variedad de ejercicios**: Solo formato de opción múltiple
4. **Falta feedback educativo**: Solo dice "correcto/incorrecto"
5. **Sin progresión de dificultad**: Saltos bruscos entre niveles
6. **No guarda progreso**: No hay sistema de logros o progreso

### Propuestas de Mejora

#### A. AÑADIR
1. **Implementar Ear Training completo**
   - **Intervalos**: Reproducir 2 notas, identificar intervalo
   - **Acordes**: Reproducir acorde, identificar calidad (maj, min, 7, etc.)
   - **Escalas**: Reproducir escala, identificar tipo
   - **Progresiones**: Reproducir progresión, identificar tipo (I-IV-V, ii-V-I, etc.)

2. **Nuevos tipos de ejercicios**
   - **Ejercicio de fretboard**: "Encuentra C en cuerda 5"
   - **Construcción de acordes**: "Construye un Cmaj7"
   - **Identificación de grados**: Mostrar escala, marcar 3ª y 7ª
   - **Voice leading**: "Mueve Cmaj7 a Fmaj7 con mínimo movimiento"

3. **Sistema de progreso y logros**
   - Niveles de dominio: Novato → Aprendiz → Competente → Experto → Maestro
   - Logros desbloqueables:
     - "🏆 100 preguntas correctas"
     - "🔥 Racha de 20"
     - "🎓 Maestro de Intervalos" (100% en todas las dificultades)
   - Barra de progreso por categoría

4. **Feedback educativo**
   - Cuando error:
     - Mostrar respuesta correcta
     - Explicar POR QUÉ es esa
     - Sugerir: "Repasa Nivel 2: Escalas"
     - Botón "Más info" → abre panel educativo

5. **Modo "Examen"**
   - 20 preguntas mezcladas (todas las categorías)
   - Tiempo límite opcional
   - Certificado al completar con >80%

6. **Práctica personalizada**
   - Basada en estadísticas:
     - "Fallas mucho en Modos → practica más"
     - Generar quiz solo de categorías débiles

#### B. REORGANIZAR
1. **Reorganizar en tabs**
   - **Quiz Visual** (actual)
   - **Ear Training** (implementar)
   - **Ejercicios de Fretboard** (nuevo)
   - **Examen** (nuevo)
   - **Mi Progreso** (estadísticas)

2. **Mejorar UI del quiz**
   - Mostrar progreso: "Pregunta 5/10"
   - Timer opcional
   - Opción "Saltar pregunta" (-5 puntos)
   - Botón "Explicación" después de responder

#### C. QUITAR
- Placeholder de Ear Training (reemplazar con implementación real)

#### D. PRIORIDAD
- **Alta**: Implementar Ear Training
- **Alta**: Sistema de progreso y logros
- **Alta**: Feedback educativo
- **Media**: Nuevos tipos de ejercicios
- **Media**: Modo examen
- **Baja**: Práctica personalizada

---

## NIVEL 10 - BIBLIOTECA/PRÁCTICA

### Estado Actual
- 3 tabs: Canciones, Jam Session, Lick Library
- Canciones: Grid con filtro de género
- Jam Session: Backing tracks con fretboard
- Lick Library: (placeholder o poco desarrollado)

### Problemas Detectados
1. **Canciones: sin audio real**: Solo análisis teórico
2. **Jam Session: backing tracks estáticos**: No se pueden personalizar
3. **Lick Library: subdesarrollada**: Falta contenido
4. **Sin sistema de práctica**: No hay rutinas o planes
5. **Falta integración**: Canciones no se conectan con otros niveles

### Propuestas de Mejora

#### A. AÑADIR
1. **Canciones: Modo "Aprende a Tocar"**
   - Click en canción → nuevo modo
   - Mostrar:
     - Progresión completa con diagramas
     - Tempo real de la canción
     - Patrón de rasgueo sugerido
     - Tabs completas (si disponible)
   - Botón "Practicar con backing track"

2. **Jam Session mejorada**
   - **Personalizador de backing track**:
     - Cambiar progresión
     - Cambiar tempo
     - Añadir/quitar instrumentos (bajo, batería, teclado)
     - Cambiar género (jazz, rock, blues)
   - **Grabadora simple**:
     - Botón "Grabar mi jam"
     - Guardar últimos 5 jams
     - Reproducir con backing track

3. **Lick Library completa**
   - Categorías:
     - **Por Género**: Blues, Rock, Metal, Jazz, Funk
     - **Por Técnica**: Bends, Slides, Hammer-ons, Tapping
     - **Por Dificultad**: Fácil, Medio, Difícil
   - Cada lick:
     - Diagrama de fretboard
     - Tabs
     - Audio de ejemplo
     - Tempo variable
     - Backing track para practicar
   - Sistema de favoritos

4. **Rutinas de Práctica**
   - Tab nuevo: **Rutinas**
   - Rutinas predefinidas:
     - "🌅 Calentamiento (10 min)"
     - "🎸 Desarrollo Técnico (30 min)"
     - "🎵 Repertorio (20 min)"
     - "🔥 Improvisación (15 min)"
   - Cada rutina:
     - Lista de ejercicios
     - Timer integrado
     - Checklist de completado
   - Botón "Crear mi rutina"

5. **Setlist Builder**
   - Tab nuevo: **Setlists**
   - Crear listas de canciones
   - Drag & drop para ordenar
   - Estimación de tiempo total
   - Notas por canción
   - Útil para bandas o práctica personal

6. **Sistema de progreso por canción**
   - Estados: No empezada / Aprendiendo / Consolidando / Dominada
   - Última fecha de práctica
   - Notas personales

#### B. REORGANIZAR
1. **Reorganizar tabs**
   - **Canciones** (mejorado)
   - **Jam Session** (mejorado)
   - **Licks** (expandido)
   - **Rutinas** (nuevo)
   - **Setlists** (nuevo)

2. **Canciones: Mejorar grid**
   - Añadir columnas:
     - Dificultad (🟢🟡🔴)
     - Tu progreso (0-100%)
     - Última práctica
   - Filtros adicionales:
     - Por dificultad
     - Por progreso (Aprendidas / En proceso / No empezadas)
   - Ordenar por: Alfabético, Género, Dificultad, Progreso

#### C. QUITAR
- Contenido placeholder sin funcionalidad

#### D. PRIORIDAD
- **Alta**: Lick Library completa
- **Alta**: Rutinas de práctica
- **Media**: Canciones: modo "Aprende a Tocar"
- **Media**: Jam Session personalizable
- **Media**: Sistema de progreso por canción
- **Baja**: Setlist Builder
- **Baja**: Grabadora

---

## NIVEL 11 - CHORD LAB

### Estado Actual
- 4 modos: Explorer, Progression Lab, Chord Builder, Practice
- Fretboard integrado
- Voicings filtrables
- Progression Lab con análisis avanzado
- Voice leading visualization
- Botones: Play, Save, Load, Transpose, etc.

### Problemas Detectados
1. **Complejidad abrumadora**: Demasiadas features juntas
2. **Curva de aprendizaje empinada**: No hay tutorial
3. **Progression Lab: demasiado avanzado**: Difícil para principiantes
4. **Chord Builder: limitado**: Podría ser más interactivo
5. **Practice: subdesarrollado**: Falta contenido
6. **Guardado/Load: sin organización**: No hay carpetas o tags

### Propuestas de Mejora

#### A. AÑADIR
1. **Tutorial interactivo inicial**
   - Primera vez que entras: Tour guiado
   - Explica cada modo en 30 segundos
   - Opción "Saltar tutorial" para expertos

2. **Explorer: Filtros avanzados**
   - Filtrar por:
     - Posición en mástil (trastes 0-5, 5-8, 8-12)
     - Dificultad de digitación
     - Stretch máximo (1-4 trastes)
     - Con/sin cuerdas mudas
   - Favoritos guardados

3. **Progression Lab: Modo "Asistido"**
   - Wizard de 3 pasos:
     1. "¿Qué emoción quieres? (Alegre, Triste, Épico, Tenso)"
     2. Sistema sugiere 3 progresiones
     3. Usuario elige y puede modificar
   - Más simple que modo actual

4. **Chord Builder mejorado**
   - **Modo "Construcción por grados"**:
     - "Añadir 3ª Mayor"
     - "Añadir 7ª Menor"
     - Ver cambio en tiempo real
   - **Modo "Construcción por notas"**:
     - Click en fretboard para añadir notas
     - Sistema identifica acorde automáticamente
   - **Validador de voicing**:
     - "Este acorde es muy difícil de tocar"
     - "Sugiere: mover 5ª a cuerda 4"

5. **Practice: Ejercicios reales**
   - **Shape Shifting**: Practica cambios entre voicings
   - **Position Trainer**: Memoriza voicings en diferentes zonas
   - **Voice Leading Drills**: Mejora conexiones entre acordes
   - Sistema de puntuación por ejercicio

6. **Organización de guardados**
   - Carpetas: "Mis Progresiones Jazz", "Experimentos", etc.
   - Tags: #jazz #modal #experimental
   - Buscador
   - Exportar/Importar progresiones (JSON)

7. **Compartir progresiones**
   - Botón "Compartir"
   - Genera código único (ej: GTM-A7F2X)
   - Otro usuario introduce código → carga progresión

#### B. REORGANIZAR
1. **Simplificar UI inicial**
   - Por defecto: Solo modo Explorer
   - Botón "Modos Avanzados" → muestra Progression Lab, Chord Builder, Practice

2. **Progression Lab: Reorganizar**
   - Tab 1: **Asistido** (nuevo, simple)
   - Tab 2: **Libre** (actual, avanzado)
   - Tab 3: **Análisis** (analiza progresión existente)

3. **Añadir Help Buttons**
   - Icono "?" junto a cada feature compleja
   - Tooltip explicativo al hover
   - Click → modal con video/GIF demostrativo

#### C. QUITAR
1. **Features ultra-avanzadas poco usadas**
   - Evaluar si "Mutate" se usa realmente
   - Evaluar si todas las emociones son necesarias
   - Simplificar lo que no se use

#### D. PRIORIDAD
- **Alta**: Tutorial interactivo
- **Alta**: Progression Lab modo "Asistido"
- **Media**: Chord Builder mejorado
- **Media**: Practice con ejercicios reales
- **Media**: Organización de guardados
- **Baja**: Compartir progresiones
- **Baja**: Filtros avanzados Explorer

---

## BUGS VISUALES CRÍTICOS (Afectan a múltiples niveles)

### BUG 1: Mini-diagramas de acordes con orientación invertida

**Problema detectado**: Los mini-diagramas de acordes (ChordDiagram) tienen una orientación invertida respecto al diapasón principal.

**Diferencias visuales**:
- **Diapasón principal**: Cuerdas finas arriba (E aguda), cuerdas gruesas abajo (E grave) ✅
- **Mini-diagramas de acordes**: Cuerdas gruesas arriba, cuerdas finas abajo ❌

**Además**: Los diagramas están "espejados" (mirrored) - como si tuvieras simetría horizontal por la mitad (entre la 3ª y 4ª cuerda). La distribución de notas está invertida verticalmente.

**Niveles afectados**:
- **Nivel 3**: Acordes Básicos - Muestra diagramas de triadas
- **Nivel 4**: Acordes Extendidos - Muestra diagramas de 7ª, 9ª, 11ª, 13ª
- **Nivel 6**: Progresiones - Mini-diagramas en el grid de progresiones
- **Nivel 7**: Sistema CAGED - Diagramas de las 5 formas
- **Nivel 8**: Dominantes Secundarios - Diagramas de acordes dominantes
- **Nivel 11**: Chord Lab - Explorer muestra voicings con diagramas

**Solución requerida**:
1. Invertir el orden de las cuerdas en el renderizado de ChordDiagram
2. Invertir el grosor de las cuerdas (finas arriba, gruesas abajo)
3. Asegurar que la cuerda 1 (E aguda) esté arriba y la cuerda 6 (E grave) abajo
4. Verificar que coincida visualmente con el diapasón principal

**Componente a modificar**: `ChordDiagram.create()` (función de renderizado de diagramas)

**Impacto**: ALTO - Afecta a 6 de 11 niveles y es visualmente confuso para el usuario

---

## MEJORAS GLOBALES (Afectan a todos los niveles)

### 1. SISTEMA DE PROGRESO GLOBAL
- Barra de progreso por nivel (0-100%)
- "Completado" cuando se domina el contenido
- Dashboard inicial mostrando progreso de todos los niveles

### 2. MODO OSCURO/CLARO
- Toggle en header
- Temas: Oscuro (actual), Claro, Alto Contraste

### 3. ACCESIBILIDAD
- Keyboard navigation completa
- Screen reader friendly
- Tamaño de fuente ajustable

### 4. ATAJOS DE TECLADO
- Espacio: Play/Pause
- ←/→: Cambiar acorde/escala/intervalo
- ↑/↓: Cambiar raíz
- R: Reset nivel
- F: Fretboard toggle
- M: Metrónomo toggle

### 5. MODO "FOCUS"
- Ocultar sidebar
- Fullscreen fretboard
- Ideal para practicar en vivo

### 6. EXPORTAR/IMPRIMIR
- Botón "Imprimir Diagrama"
- Botón "Exportar a PDF"
- Útil para estudiar offline

### 7. INTEGRACIÓN ENTRE NIVELES
- Desde Nivel 2 (Escalas) → "Ver acordes de esta escala" → salta a Nivel 3
- Desde Nivel 3 (Acordes) → "Ver escala origen" → salta a Nivel 2
- Desde Nivel 6 (Progresiones) → "Analizar este acorde" → salta a Nivel 4

### 8. BÚSQUEDA GLOBAL
- Input en header
- Buscar: Acordes, escalas, progresiones, canciones
- Resultados agrupados por nivel

### 9. NOTAS PERSONALES
- Botón "✏ Añadir nota" en cada nivel
- Guardar comentarios/observaciones
- Útil para llevar diario de aprendizaje

### 10. SINCRONIZACIÓN EN LA NUBE (Futuro)
- Guardar progreso, favoritos, rutinas
- Acceder desde cualquier dispositivo

---

## RESUMEN DE PRIORIDADES GENERALES

### ALTA PRIORIDAD (Implementar primero)
1. Añadir reproducción de audio en TODOS los niveles que no la tienen
2. Implementar Ear Training (Nivel 9)
3. Sistema de progreso y logros (Nivel 9)
4. Reorganizar categorías de progresiones (Nivel 6)
5. Destacar acordes esenciales vs raros (Nivel 4)
6. Mejorar visualización de pentatónicas (Nivel 2)
7. Tutorial interactivo Chord Lab (Nivel 11)
8. Lick Library completa (Nivel 10)

### MEDIA PRIORIDAD
1. Modo comparación en varios niveles
2. Editores/constructores interactivos
3. Sistemas de favoritos
4. Múltiples voicings por acorde (Nivel 3)
5. Ejercicios interactivos avanzados
6. Rutinas de práctica (Nivel 10)
7. Mejorar paneles informativos con más visuales

### BAJA PRIORIDAD
1. Mini-juegos educativos
2. Features de compartir/exportar
3. Integraciones externas
4. Features ultra-avanzadas

---

## MÉTRICAS DE ÉXITO

Para medir si las mejoras funcionan:

1. **Engagement**: Tiempo promedio por nivel
2. **Progresión**: % de usuarios que completan cada nivel
3. **Retención**: Usuarios que vuelven día siguiente
4. **Dominio**: Puntuación en quizzes por nivel
5. **Feedback**: Sistema de rating por feature

---

**Documento creado**: 2026-02-05
**Versión**: 1.0
**Total de propuestas**: ~180 mejoras específicas
