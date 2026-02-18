export const TabNotation = {
            create(tabs, lickName = '', bpm = 80) {
                const container = document.createElement('div');
                container.className = 'tab-notation-container';

                // Título
                if (lickName) {
                    const title = document.createElement('div');
                    title.className = 'tab-title';
                    title.textContent = lickName;
                    container.appendChild(title);
                }

                // SVG container
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'tab-notation-svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '200');
                svg.setAttribute('viewBox', '0 0 800 200');

                const strings = 6;
                const stringSpacing = 25;
                const startY = 40;
                const startX = 60;
                const noteSpacing = 60;

                // Dibujar las 6 líneas (cuerdas)
                for (let i = 0; i < strings; i++) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startX);
                    line.setAttribute('y1', startY + i * stringSpacing);
                    line.setAttribute('x2', 750);
                    line.setAttribute('y2', startY + i * stringSpacing);
                    line.setAttribute('stroke', '#444');
                    line.setAttribute('stroke-width', '1');
                    svg.appendChild(line);
                }

                // Labels de cuerdas (E A D G B e)
                const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
                stringNames.forEach((name, i) => {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', 30);
                    text.setAttribute('y', startY + i * stringSpacing + 5);
                    text.setAttribute('fill', '#888');
                    text.setAttribute('font-size', '14');
                    text.setAttribute('font-weight', 'bold');
                    text.textContent = name;
                    svg.appendChild(text);
                });

                // Agrupar notas por tiempo para posicionamiento
                const sortedTabs = [...tabs].sort((a, b) => a.time - b.time);
                const timePositions = {};
                let currentX = startX + 40;

                sortedTabs.forEach((tab, i) => {
                    if (!timePositions[tab.time]) {
                        timePositions[tab.time] = currentX;
                        currentX += noteSpacing;
                    }
                });

                // Dibujar notas
                sortedTabs.forEach((tab) => {
                    const x = timePositions[tab.time];
                    const y = startY + (5 - tab.string) * stringSpacing;

                    // Círculo de fondo
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', x);
                    circle.setAttribute('cy', y);
                    circle.setAttribute('r', '12');
                    circle.setAttribute('fill', '#dc2626');
                    circle.setAttribute('stroke', '#fff');
                    circle.setAttribute('stroke-width', '2');
                    svg.appendChild(circle);

                    // Número de traste
                    const fretText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    fretText.setAttribute('x', x);
                    fretText.setAttribute('y', y + 5);
                    fretText.setAttribute('text-anchor', 'middle');
                    fretText.setAttribute('fill', '#fff');
                    fretText.setAttribute('font-size', '14');
                    fretText.setAttribute('font-weight', 'bold');
                    fretText.textContent = tab.fret;
                    svg.appendChild(fretText);

                    // Símbolo de técnica
                    if (tab.technique) {
                        const techSymbol = this.getTechniqueSymbol(tab.technique);
                        if (techSymbol) {
                            const techText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            techText.setAttribute('x', x);
                            techText.setAttribute('y', y - 20);
                            techText.setAttribute('text-anchor', 'middle');
                            techText.setAttribute('fill', '#eab308');
                            techText.setAttribute('font-size', '12');
                            techText.setAttribute('font-style', 'italic');
                            techText.textContent = techSymbol;
                            svg.appendChild(techText);
                        }
                    }

                    // Flecha de picking direction (down/up)
                    if (tab.technique === 'down' || tab.technique === 'up') {
                        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        arrow.setAttribute('x', x);
                        arrow.setAttribute('y', y + 30);
                        arrow.setAttribute('text-anchor', 'middle');
                        arrow.setAttribute('fill', '#10b981');
                        arrow.setAttribute('font-size', '16');
                        arrow.textContent = tab.technique === 'down' ? '↓' : '↑';
                        svg.appendChild(arrow);
                    }
                });

                container.appendChild(svg);

                // Controles de reproducción
                const controls = document.createElement('div');
                controls.className = 'tab-controls';
                controls.innerHTML = `
                    <button class="tab-play-btn ctrl-btn">▶ Play</button>
                    <button class="tab-loop-btn ctrl-btn">🔁 Loop</button>
                    <div class="tempo-control">
                        <label>Tempo: <span class="tempo-value">${bpm}</span> BPM</label>
                        <input type="range" class="tempo-slider" min="50" max="200" value="${bpm}" step="5">
                    </div>
                `;
                container.appendChild(controls);

                return container;
            },

            getTechniqueSymbol(technique) {
                const symbols = {
                    'bend': 'b',
                    'release': 'r',
                    'hammeron': 'h',
                    'hammer': 'h',
                    'pulloff': 'p',
                    'slide': '/',
                    'vibrato': '~',
                    'tap': 'T',
                    'palm': 'P.M.',
                    'thumb': 'Th'
                };
                return symbols[technique] || '';
            }
        };
