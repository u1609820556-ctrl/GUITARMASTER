# Plan de Mejoras Enfocadas - GuitarMaster
## Mejoras para Nivel 7 (Progresiones) y Nivel 15 (Jam Session)

**Fecha:** 2026-01-29
**Enfoque:** Mejorar funcionalidad existente en niveles 7 y 15, sin agregar nuevos niveles

---

## Estado Actual Implementado

### ✅ Ya Completado en Esta Sesión:
- **10 progresiones avanzadas** agregadas (Tritone Sub, Coltrane Changes, Rhythm Changes completo, etc.)
- **23 canciones nuevas** (Flamenco, Jazz/Fusion, Bossa Nova, Indie, Electrónica)
- **7 escalas nuevas** (Blues Heptatónica, Ryu Kyu, Yo, Bhairav, Todi, Messiaen Modos 2 y 3)
- **Metrónomo avanzado** (subdivisiones, compases irregulares, tap tempo, modal de configuración)

### 📊 Sistema Base Actual:
- **26 progresiones** documentadas con análisis teórico completo
- **15 backing tracks** con BPM, progresión, escala sugerida
- **15 niveles educativos** completos (hasta nivel 15)

---

## ANÁLISIS DE PROBLEMAS IDENTIFICADOS

### 🎵 NIVEL 7 - PROGRESIONES DE ACORDES

#### Problemas Críticos:
1. **❌ Sin reproducción automática de progresiones completas**
   - Solo se puede clickear acorde por acorde
   - No hay botón Play/Pause/Stop para progresión completa
   - Método `playChordSequence()` existe pero NO se usa en nivel 7

2. **❌ Sin control de tempo/ritmo**
   - No hay BPM específico para cada progresión
   - No se integra con el metrónomo
   - Imposible practicar con tempo controlado

3. **❌ Indicadores de progreso débiles**
   - No muestra "Acorde 3/8"
   - No hay barra de progreso visual
   - No se destaca claramente qué acorde está activo

#### Problemas Moderados:
4. **⚠️ Panel de información ocupa mucho espacio**
   - En mobile compite por espacio con fretboard
   - No es collapsible
   - Análisis detallado siempre visible

5. **⚠️ Diagramas compactos difíciles de leer**
   - Con 8+ acordes (Canon), scroll horizontal necesario
   - Diagramas muy pequeños en modo compacto
   - Sin numeración visible sobre diagramas

6. **⚠️ Sin opciones de loop/repetición**
   - No se puede repetir progresión N veces
   - Sin modo práctica con repetición

---

### 🎸 NIVEL 15 - JAM SESSION

#### Problemas Críticos:
1. **❌ Reinicio brutal de audio al cambiar BPM**
   - `stopBackingTrack()` + `setTimeout(100ms)` causa clicks/pops
   - No hay transición suave (fade-out/crossfade)
   - Interrupción abrupta rompe inmersión

2. **❌ Drum patterns demasiado simples**
   - Solo kick en 0/2, snare en 1/3
   - Sin hi-hat (comentado en código)
   - Patrón fijo independiente del "feel" del track
   - Shuffle, Swing, Salsa suenan igual

3. **❌ Sin sincronización metrónomo-backing**
   - Metrónomo y backing track tienen BPM independientes
   - Pueden tocarse simultáneamente a tempos diferentes
   - Confuso para el estudiante

4. **❌ Sin selector de tonalidad en Jam Session**
   - Usa `currentRoot` global pero sin UI en nivel 15
   - Cambiar root en otro nivel afecta Jam
   - No hay forma clara de transponer tracks

#### Problemas Moderados:
5. **⚠️ Sin visualización de progreso en loop**
   - No muestra qué acorde está tocando
   - No indica compás actual (ej: "Compás 3/4")
   - Sin beat indicator visual

6. **⚠️ Reseteo de BPM custom sin confirmación**
   - Cambiar track descarta BPM personalizado
   - Sin aviso al usuario

7. **⚠️ 15 botones de tracks ocupan mucho espacio**
   - Difícil navegación en mobile
   - Sin categorización visual clara
   - Sin indicador de track activo (excepto color)

8. **⚠️ Sin diagrama de acorde actual**
   - Solo muestra progresión como texto
   - No visualiza voicing del acorde actual

---

## PLAN DE MEJORAS PROPUESTO

### 🎯 FASE 1: REPRODUCCIÓN AUTOMÁTICA DE PROGRESIONES (PRIORIDAD MÁXIMA)

**Objetivo:** Permitir reproducir progresiones completas con tempo controlado

#### Implementación en Nivel 7:

1. **Agregar Controles de Reproducción**
   - **Ubicación:** Debajo de botones de selección de progresión
   - **Controles:**
     - Botón ▶️ PLAY (verde)
     - Botón ⏸️ PAUSE (amarillo)
     - Botón ⏹️ STOP (rojo)
     - Slider BPM (40-200) con display numérico
     - Toggle "Loop" (repetir infinito)
     - Input numérico "Repetir N veces" (1-10)

2. **Lógica de Reproducción**
   - Usar método existente `AudioEngine.playChordSequence()`
   - Calcular duración por acorde: `(60 / BPM) * 4000` (4 beats por acorde)
   - Actualizar `currentProgressionChordIndex` en cada cambio
   - Resaltar diagrama del acorde actual con borde animado

3. **Integración con Fretboard**
   - Auto-actualizar fretboard al cambiar acorde
   - Mostrar notas del acorde actual destacadas

4. **Indicador de Progreso**
   - Display grande: **"Acorde 3 / 8"**
   - Barra de progreso visual (0-100%) con animación
   - Color de barra según función (Verde=T, Amarillo=SD, Rojo=D)

5. **Sincronización con Metrónomo**
   - Opción: "Usar BPM del metrónomo"
   - Si metrónomo activo → sincronizar BPM
   - Si se cambia BPM en progresión → actualizar metrónomo

**Archivos a modificar:**
- `index.html` líneas ~6615-6850 (Nivel 7 - showProgressions/showProgression)
- Agregar template HTML para controles de reproducción
- CSS para estilos de controles

**Métodos nuevos:**
```javascript
playProgression() {
    // Inicia reproducción de progresión completa
    // Usa AudioEngine.playChordSequence()
    // Actualiza UI cada cambio de acorde
}

pauseProgression() {
    // Pausa sin resetear posición
}

stopProgression() {
    // Detiene y resetea a acorde 0
}

updateProgressionProgress(currentIndex, total) {
    // Actualiza barra de progreso y display
}
```

---

### 🎯 FASE 2: PANEL DE INFORMACIÓN OPTIMIZADO (PRIORIDAD ALTA)

**Objetivo:** Hacer panel collapsible y más compacto

#### Implementación en Nivel 7:

1. **Toggle Collapse del Panel**
   - Botón "ℹ️ Análisis" en header
   - Click expande/colapsa panel de información
   - Estado guardado en localStorage
   - Transición suave (CSS transition)

2. **Modo Compacto del Panel**
   - Vista reducida: Solo muestra chips de acordes + función
   - Vista expandida: Análisis completo + canciones
   - Mobile por defecto: compacto

3. **Reorganización del Layout**
   - Panel de info en sidebar derecha (desktop > 1024px)
   - Panel debajo de diagramas (mobile/tablet)
   - Más espacio vertical para fretboard

**Archivos a modificar:**
- `index.html` líneas ~6759-6841 (renderProgressionAnalysis)
- CSS para panel collapsible
- JavaScript para toggle y persistencia

---

### 🎯 FASE 3: MEJORAS EN JAM SESSION - TRANSICIONES SUAVES (PRIORIDAD ALTA)

**Objetivo:** Eliminar clicks/pops al cambiar BPM durante reproducción

#### Implementación en Nivel 15:

1. **Transiciones Suaves de BPM**
   - **Opción A - Rampa gradual (RECOMENDADO):**
     - Usar `gainNode.gain.rampToValueAtTime()` para fade-out (200ms)
     - Esperar fade-out completo
     - Cambiar intervalos de acordes/drums
     - Fade-in gradual (200ms)

   - **Opción B - Ajuste dinámico:**
     - Calcular nuevo intervalo sin detener
     - Ajustar timeout del próximo beat
     - Solo funciona si cambio es pequeño (<20% BPM)

2. **Implementación del Fade-Out/In**
```javascript
async changeBackingTrackBPM(newBPM) {
    if (!this.backingTrackPlaying) {
        this.customBPM = newBPM;
        return;
    }

    // Fade out gradual
    const gainNode = AudioEngine.masterGain;
    const currentGain = gainNode.gain.value;
    gainNode.gain.setValueAtTime(currentGain, AudioEngine.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, AudioEngine.audioContext.currentTime + 0.2);

    await new Promise(resolve => setTimeout(resolve, 200));

    // Cambiar BPM y reiniciar
    this.stopBackingTrack();
    this.customBPM = newBPM;
    this.startBackingTrack();

    // Fade in gradual
    gainNode.gain.setValueAtTime(0.01, AudioEngine.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(currentGain, AudioEngine.audioContext.currentTime + 0.2);
}
```

3. **Debounce del Slider BPM**
   - No aplicar cambio en cada movimiento del slider
   - Esperar 300ms después de último cambio
   - Feedback visual inmediato en display

**Archivos a modificar:**
- `index.html` líneas ~8010-8050 (playBackingTrack/stopBackingTrack)
- AudioEngine métodos de fade

---

### 🎯 FASE 4: DRUM PATTERNS DINÁMICOS (PRIORIDAD ALTA)

**Objetivo:** Patrones de batería adaptativos según el "feel" del track

#### Implementación en Nivel 15:

1. **Mapeo de Feel a Patrones**
   - **Straight (4x4):** Kick 0/2, Snare 1/3, Hi-hat 0/0.5/1/1.5/2/2.5/3/3.5
   - **Shuffle:** Kick 0/2, Snare 1/3, Hi-hat swing (0/0.66/1/1.66/2/2.66/3/3.66)
   - **Syncopated:** Kick 0/1.5/2.5, Snare 1/3, Hi-hat offbeat
   - **Ballad:** Kick 0/2, Snare 1/3, Hi-hat 0/1/2/3 (más espaciado)
   - **Driving:** Kick 0/0.5/1/1.5/2/2.5/3/3.5 (doble bombo), Snare 1/3
   - **Aggressive:** Similar Driving con más kicks

2. **Generación de Patrones**
```javascript
getDrumPattern(feel, beatsPerBar) {
    const patterns = {
        'Straight': {
            kick: [0, 2],
            snare: [1, 3],
            hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
        },
        'Shuffle': {
            kick: [0, 2],
            snare: [1, 3],
            hihat: [0, 0.66, 1.33, 2, 2.66, 3.33] // swing 8ths
        },
        'Syncopated': {
            kick: [0, 1.5, 2.5],
            snare: [1, 3],
            hihat: [0.5, 1, 1.5, 2, 2.5, 3, 3.5]
        }
        // ... más patrones
    };

    return patterns[feel] || patterns['Straight'];
}
```

3. **Volúmenes Ajustados**
   - Hi-hat: volumen reducido (0.15 vs 0.3)
   - Kick: volumen medio (0.5)
   - Snare: volumen alto (0.7)

4. **Variación en Fills**
   - Cada 4 compases: fill de batería (rápida secuencia de snares)
   - Opcional: toggle "Drum Fills"

**Archivos a modificar:**
- `index.html` líneas ~4314-4350 (playChordSequenceWithDrums)
- AudioEngine.generateDrumSound() para hi-hat

---

### 🎯 FASE 5: SINCRONIZACIÓN METRÓNOMO-BACKING (PRIORIDAD ALTA)

**Objetivo:** Unificar BPM entre metrónomo y backing track

#### Implementación:

1. **BPM Compartido**
   - Variable única: `App.globalBPM` (default 120)
   - Metrónomo y backing track leen de `globalBPM`
   - Cambiar en cualquier lugar actualiza ambos

2. **UI Unificada**
   - Control "Tempo Global" en header (reemplaza BPM metrónomo)
   - Slider único que controla ambos sistemas
   - Display: "🎵 120 BPM"

3. **Toggle "Sync Metrónomo"**
   - Checkbox en Jam Session: "Sincronizar con metrónomo"
   - Si activo: backing track usa globalBPM
   - Si inactivo: backing track usa BPM custom

4. **Detección de Conflictos**
   - Si metrónomo activo + backing track activo con BPM diferente:
     - Toast warning: "⚠️ Metrónomo y backing en tempos diferentes"
     - Botón "Sincronizar" en toast

**Archivos a modificar:**
- `index.html` líneas ~5002-5007 (estado metrónomo)
- `index.html` líneas ~8010+ (Jam Session)
- Refactor de todos los métodos que usan `metronomeBPM` o `customBPM`

---

### 🎯 FASE 6: SELECTOR DE TONALIDAD EN JAM SESSION (PRIORIDAD MEDIA)

**Objetivo:** Transponer backing tracks interactivamente

#### Implementación en Nivel 15:

1. **Selector de Root Note**
   - Dropdown en panel superior: "Tonalidad: C, C#, D, D#, E..."
   - Al cambiar: actualiza `currentRoot`
   - Transpone progresión de acordes automáticamente
   - Actualiza fretboard con nueva escala

2. **Transposición Dinámica**
```javascript
transposeBackingTrack(newRoot) {
    const oldRoot = this.currentRoot;
    const semitones = newRoot - oldRoot;

    // Actualizar root
    this.currentRoot = newRoot;

    // Actualizar fretboard
    Fretboard.showScale(newRoot, this.currentBackingTrack.scale);

    // Si está tocando, reiniciar con fade
    if (this.backingTrackPlaying) {
        this.fadeRestartBackingTrack();
    }

    this.showToast(`Transpuesto a ${MusicTheory.getNoteName(newRoot)}`, 'info');
}
```

3. **Persistir Selección**
   - Guardar en localStorage: `jamSession_preferredRoot`
   - Restaurar al cargar nivel 15

**Archivos a modificar:**
- `index.html` líneas ~7950+ (showJamSession)
- Template HTML para selector de tonalidad

---

### 🎯 FASE 7: VISUALIZACIÓN DE PROGRESO EN JAM (PRIORIDAD MEDIA)

**Objetivo:** Mostrar acorde actual y progreso en loop

#### Implementación en Nivel 15:

1. **Display de Acorde Actual**
   - Diagrama grande del acorde actual (tamaño 1.5x)
   - Ubicación: Encima del fretboard
   - Nombre del acorde en grande: **"Em7"**
   - Función armónica: "(Tónica menor)"

2. **Indicador de Compás**
   - Display: **"Compás 3 / 4"**
   - Barra de progreso circular (como metrónomo)
   - Color según acorde (T=verde, SD=amarillo, D=rojo)

3. **Beat Indicator Visual**
   - 4 círculos representando 4 beats
   - Se iluminan en tiempo real con el beat
   - Acentuación del beat 1

4. **Contador de Loops**
   - Display: "🔁 Loop #12"
   - Opcional: límite de loops (ej: practicar 10 veces)

**Archivos a modificar:**
- `index.html` líneas ~8010+ (playBackingTrack)
- Template HTML para displays de progreso
- CSS para animaciones de beat

---

### 🎯 FASE 8: MEJORAS DE UI EN JAM SESSION (PRIORIDAD MEDIA)

**Objetivo:** Organizar mejor la selección de backing tracks

#### Implementación en Nivel 15:

1. **Categorización de Tracks**
   - Agrupar por estilo en tabs:
     - 🎸 Blues/Rock (3 tracks)
     - 🎺 Jazz/Funk (4 tracks)
     - 🎹 Pop/Ballad (3 tracks)
     - 🌎 World/Latin (3 tracks)
     - 🔥 Metal/Heavy (2 tracks)

2. **Grid Mejorado**
   - Cards con más info:
     - Nombre + estilo
     - BPM original
     - Progresión (mini-preview)
     - Icono de género

3. **Track Activo Destacado**
   - Borde grueso en card activo
   - Color accent (#10b981)
   - Icono ▶️ en corner

4. **Modo Compacto (Mobile)**
   - Dropdown en vez de cards
   - Lista con search/filter

**Archivos a modificar:**
- `index.html` líneas ~2470+ (template jam-session)
- CSS para tabs y cards

---

### 🎯 FASE 9: DIAGRAMAS EN PROGRESIONES (PRIORIDAD BAJA)

**Objetivo:** Mejorar legibilidad de diagramas con muchos acordes

#### Implementación en Nivel 7:

1. **Numeración de Acordes**
   - Número sobre cada diagrama: "1", "2", "3"...
   - Color según función (verde/amarillo/rojo)

2. **Zoom al Hover**
   - Hover sobre diagrama → se amplía 1.5x
   - Tooltip con nombre completo y notas

3. **Navegación con Teclado**
   - Flechas ← → cambian acorde activo
   - Enter reproduce acorde
   - Espacio reproduce progresión

4. **Modo "Solo Acorde Actual"**
   - Toggle para mostrar solo 1 diagrama grande
   - Flechas para navegar entre acordes
   - Útil en mobile

**Archivos a modificar:**
- `index.html` líneas ~6707-6750 (renderizado de diagramas)
- CSS para hover effects

---

## RESUMEN DE PRIORIDADES

### 🔥 PRIORIDAD MÁXIMA (Implementar primero)
1. ✅ **Reproducción automática de progresiones** (Fase 1)
   - Play/Pause/Stop + control de tempo
   - Loop e indicadores de progreso

2. ✅ **Transiciones suaves en Jam** (Fase 3)
   - Fade-out/in al cambiar BPM
   - Eliminar clicks/pops

3. ✅ **Drum patterns dinámicos** (Fase 4)
   - Patrones adaptativos según feel
   - Hi-hat agregado

4. ✅ **Sincronización metrónomo-backing** (Fase 5)
   - BPM global unificado
   - Toggle sync

### ⚡ PRIORIDAD ALTA (Siguiente)
5. **Panel de información optimizado** (Fase 2)
   - Collapsible + modo compacto

6. **Selector de tonalidad en Jam** (Fase 6)
   - Transposición interactiva

7. **Visualización de progreso en Jam** (Fase 7)
   - Acorde actual + beat indicator

### 🌙 PRIORIDAD MEDIA (Futuro)
8. **Mejoras de UI en Jam** (Fase 8)
   - Categorización de tracks

9. **Diagramas mejorados** (Fase 9)
   - Numeración + zoom

---

## ARCHIVOS CRÍTICOS A MODIFICAR

### Nivel 7 - Progresiones:
1. **`index.html`** líneas ~6615-6850
   - `showProgressions()`, `showProgression()`
   - `renderProgressionAnalysis()`
   - Agregar métodos: `playProgression()`, `pauseProgression()`, `stopProgression()`

2. **Template HTML** líneas ~2257-2274
   - `#tpl-progressions`
   - Agregar controles de reproducción

3. **CSS** (nuevo bloque)
   - Estilos para controles de reproducción
   - Barra de progreso animada
   - Panel collapsible

### Nivel 15 - Jam Session:
1. **`index.html`** líneas ~7950-8100
   - `showJamSession()`, `playBackingTrack()`, `stopBackingTrack()`
   - Agregar: `changeBackingTrackBPM()`, `transposeBackingTrack()`

2. **`AudioEngine`** líneas ~4314-4350
   - `playChordSequenceWithDrums()`
   - Modificar para drum patterns dinámicos

3. **Template HTML** líneas ~2470+
   - `#tpl-jam-session`
   - Agregar selector de tonalidad + displays de progreso

4. **CSS** (nuevo bloque)
   - Tabs de categorías
   - Cards de tracks
   - Beat indicator

### Global:
1. **Estado compartido** líneas ~5000-5010
   - Agregar `globalBPM`
   - Refactor `metronomeBPM` / `customBPM`

---

## VERIFICACIÓN

### Tests de Nivel 7:
- [ ] Reproducción automática funciona con todas las progresiones
- [ ] BPM ajustable (40-200) sin crashes
- [ ] Loop infinito funciona correctamente
- [ ] Repetir N veces detiene después de N loops
- [ ] Indicador de progreso se actualiza cada cambio de acorde
- [ ] Fretboard se sincroniza con acorde actual
- [ ] Panel collapsible funciona (persiste estado)
- [ ] Diagramas se numeran correctamente

### Tests de Nivel 15:
- [ ] Cambio de BPM durante reproducción sin clicks/pops
- [ ] Fade-out/in suaves (200ms)
- [ ] Drum patterns varían según feel del track
- [ ] Hi-hat audible pero no dominante
- [ ] Metrónomo y backing sincronizados cuando toggle activo
- [ ] Selector de tonalidad transpone correctamente
- [ ] Display de acorde actual muestra diagrama correcto
- [ ] Beat indicator parpadea en tiempo con drums
- [ ] Tabs de categorías filtran tracks correctamente

### Tests de Integración:
- [ ] Cambiar nivel no rompe estado de reproducción
- [ ] localStorage guarda preferencias correctamente
- [ ] Sin memory leaks después de 10 minutos de uso
- [ ] Mobile responsive (< 640px)
- [ ] Accesibilidad: navegación por teclado funciona
- [ ] Toasts informativos aparecen en acciones clave

---

## NOTAS FINALES

Este plan se enfoca en **mejorar lo que ya existe** sin agregar nuevos niveles. Las mejoras son:

1. **Concretas y accionables**: Cada fase tiene pasos específicos
2. **Priorizadas por impacto**: Las fases 1-5 tienen el mayor impacto educativo
3. **Modulares**: Cada fase puede implementarse independientemente
4. **Sin breaking changes**: Todo es backwards compatible

**Impacto esperado:**
- Nivel 7 pasa de "visualizador estático" a "herramienta de práctica interactiva"
- Nivel 15 pasa de "backing simple" a "estación de práctica profesional"
- Ambos niveles se vuelven 10x más útiles para estudiantes

**Tiempo estimado total:** 8-10 horas de implementación (todas las fases)
**Tiempo por fase:** 1-2 horas cada una
