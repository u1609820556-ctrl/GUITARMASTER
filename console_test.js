// SCRIPT DE PRUEBA PARA CONSOLA DEL NAVEGADOR
// Copiar y pegar en la consola (F12) después de cargar index.html

console.clear();
console.log('=== TEST DE VOICINGS DE EXTENSIONES ===\n');

// Test 1: Verificar que los voicings existen
console.log('1. Verificar voicings en memoria:');
console.log('G_shape_dom7:', MusicTheory.chordLabVoicings['G_shape_dom7'] ? '✅' : '❌');
console.log('G_shape_dom9:', MusicTheory.chordLabVoicings['G_shape_dom9'] ? '✅' : '❌');
console.log('G_shape_dom13:', MusicTheory.chordLabVoicings['G_shape_dom13'] ? '✅' : '❌');
console.log('');

// Test 2: Verificar frets son diferentes
console.log('2. Verificar frets son DIFERENTES:');
const g7_voicing = MusicTheory.chordLabVoicings['G_shape_dom7'];
const g9_voicing = MusicTheory.chordLabVoicings['G_shape_dom9'];
const g13_voicing = MusicTheory.chordLabVoicings['G_shape_dom13'];

console.log('G7 frets: ', JSON.stringify(g7_voicing.frets));
console.log('G9 frets: ', JSON.stringify(g9_voicing.frets));
console.log('G13 frets:', JSON.stringify(g13_voicing.frets));
console.log('');

// Test 3: Verificar getVoicingForChord retorna correctos
console.log('3. Verificar getVoicingForChord("G", quality):');
const g7_result = MusicTheory.getVoicingForChord('G', '7');
const g9_result = MusicTheory.getVoicingForChord('G', '9');
const g13_result = MusicTheory.getVoicingForChord('G', '13');

console.log('G7:');
console.log('  Key:', g7_result.key);
console.log('  Frets:', JSON.stringify(g7_result.voicing.frets));
console.log('  Source:', g7_result.source || 'direct');
console.log('');

console.log('G9:');
console.log('  Key:', g9_result.key);
console.log('  Frets:', JSON.stringify(g9_result.voicing.frets));
console.log('  Extensions:', JSON.stringify(g9_result.voicing.extensions));
console.log('  Source:', g9_result.source || 'direct');
console.log('');

console.log('G13:');
console.log('  Key:', g13_result.key);
console.log('  Frets:', JSON.stringify(g13_result.voicing.frets));
console.log('  Extensions:', JSON.stringify(g13_result.voicing.extensions));
console.log('  Source:', g13_result.source || 'direct');
console.log('');

// Test 4: Comparar frets
console.log('4. Comparación directa:');
const frets7 = JSON.stringify(g7_result.voicing.frets);
const frets9 = JSON.stringify(g9_result.voicing.frets);
const frets13 = JSON.stringify(g13_result.voicing.frets);

console.log('G7 ≠ G9:', frets7 !== frets9 ? '✅ DIFERENTES' : '❌ IGUALES');
console.log('G9 ≠ G13:', frets9 !== frets13 ? '✅ DIFERENTES' : '❌ IGUALES');
console.log('G7 ≠ G13:', frets7 !== frets13 ? '✅ DIFERENTES' : '❌ IGUALES');
console.log('');

// Test 5: Verificar emotional tags
console.log('5. Verificar tags emocionales:');
const tags7 = MusicTheory.generateEmotionalTags('V', '7', g7_result.voicing);
const tags9 = MusicTheory.generateEmotionalTags('V', '9', g9_result.voicing);
const tags13 = MusicTheory.generateEmotionalTags('V', '13', g13_result.voicing);

console.log('G7 tags:', tags7);
console.log('G9 tags:', tags9);
console.log('G13 tags:', tags13);
console.log('');

// Test 6: Verificar descripciones contextuales
console.log('6. Verificar descripciones contextuales:');
const desc7 = MusicTheory.explainTransition('V', '7', 'I', 'maj', 'excellent');
const desc9 = MusicTheory.explainTransition('V', '9', 'I', 'maj', 'excellent');
const desc13 = MusicTheory.explainTransition('V', '13', 'I', 'maj', 'excellent');

console.log('V7→I:', desc7);
console.log('V9→I:', desc9);
console.log('V13→I:', desc13);
console.log('');

// Test 7: Verificar otros acordes con extensiones
console.log('7. Verificar otros acordes:');
const cmaj9 = MusicTheory.getVoicingForChord('C', 'maj9');
const am9 = MusicTheory.getVoicingForChord('A', 'm9');
const dm11 = MusicTheory.getVoicingForChord('D', 'm11');

console.log('Cmaj9:', cmaj9.key, '→', JSON.stringify(cmaj9.voicing.frets));
console.log('Am9:', am9.key, '→', JSON.stringify(am9.voicing.frets));
console.log('Dm11:', dm11.key, '→', JSON.stringify(dm11.voicing.frets));
console.log('');

// Resumen
console.log('=== RESUMEN ===');
const allDifferent = (frets7 !== frets9) && (frets9 !== frets13) && (frets7 !== frets13);
console.log('✅ Todos los voicings G7/G9/G13 son DIFERENTES:', allDifferent ? 'SÍ' : 'NO');
console.log('✅ Extensions arrays presentes:',
    (g9_result.voicing.extensions?.length > 0) && (g13_result.voicing.extensions?.length > 0) ? 'SÍ' : 'NO');
console.log('✅ Tags emocionales diferentes:',
    (tags7.join() !== tags9.join()) && (tags9.join() !== tags13.join()) ? 'SÍ' : 'NO');

console.log('\n=== FIN DEL TEST ===');
console.log('Si todos los checkmarks son ✅, el sistema funciona correctamente.');
console.log('Ahora prueba reproducir los acordes en Progression Lab para escuchar la diferencia.');
