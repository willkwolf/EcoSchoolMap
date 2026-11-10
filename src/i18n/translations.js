export const translations = {
    es: {
        meta: {
            title: 'Mapa de Escuelas Económicas | Visualización Interactiva',
            description: 'Mapa interactivo de escuelas políticas económicas con D3.js y narrativa interactiva'
        },
        scroll: {
            navAriaLabel: 'Navegación de secciones',
            goToSection: 'Ir a {section}'
        },
        sections: {
            hero: 'Introducción',
            guide: 'Guía de Lectura',
            visualization: 'Mapa Interactivo',
            cocktails: 'Cócteles de ideas',
            timeline: 'Línea de Tiempo',
            'learning-path': 'Guía de 4 pasos',
            'map-reading-guide': 'Marco Epistemológico',
            applications: 'Aplicación Práctica',
            'pedagogical-legend': 'Conclusión (Gafas de Análisis)'
        },
        ui: {
            localeLabel: 'Idioma',
            loadingVariant: 'Cargando variante...',
            loadingError: 'Error al cargar variante. Intenta de nuevo.',
            collisionEnabled: 'Permitir Colisiones',
            collisionDisabled: 'No Permitir Colisiones',
            downloadFilenamePrefix: 'mapa-escuelas',
            toggleControlsShow: 'Personalizar Vista (Filtros)',
            toggleControlsHide: 'Ocultar Filtros ✖',
            advancedControlsShow: 'Capas y Ajustes',
            advancedControlsHide: 'Ocultar Ajustes ✖',
            touchScrollHint: '💡 Usa 2 dedos para mover el mapa',
            viewMap: '🗺️ Vista Mapa',
            viewTable: '📊 Vista Tabla',
            startTour: '✨ Tour Guiado (60s)',
            tourRunning: '▶️ En Tour Guiado...',
            exploredProgress: 'Descubiertas: {count} / 12 escuelas',
            tableHeaders: {
                school: 'Escuela Económica',
                quadrant: 'Cuadrante',
                stateMarket: 'Estado vs. Mercado (Eje X)',
                equityGrowth: 'Equidad vs. Crecimiento (Eje Y)',
                type: 'Enfoque Metodológico'
            },
            notAvailable: 'N/D'
        },
        glossary: {
            okun: 'La balanza de Okun: Dilema clásico entre la eficiencia productiva (crecimiento) y la distribución equitativa de la riqueza.',
            marginalism: 'Marginalismo: Enfoque neoclásico que explica el valor y los precios según la utilidad adicional que genera la última unidad consumida.',
            boundedRationality: 'Racionalidad Limitada: Concepto de Herbert Simon (Conductismo) que reconoce que los humanos deciden con sesgos y capacidad de información limitada.',
            creativeDestruction: 'Destrucción Creativa: Concepto de Schumpeter donde la innovación continua destruye modelos de negocio antiguos para crear nuevo valor.'
        },
        visualization: {
            axes: {
                xDesktop: 'Organización de la Economía: ← Libre Mercado (Estado Limitado) | Economía Dirigida (Estado Fuerte) →',
                yDesktop: 'Prioridad de la Sociedad: Crecimiento y Productividad ↓ | Equidad y Sostenibilidad ↑ (La balanza de Okun)',
                xMobile: '← Mercado | Estado →',
                yMobile: 'Crecimiento ↓ | Equidad ↑'
            }
        },
        tooltip: {
            year: 'Año',
            authors: 'Autores',
            confidence: 'Confianza',
            reference: 'Referencia',
            descriptors: {
                concepcion_economia: 'Concepción Economía',
                concepcion_humano: 'Concepción Humano',
                naturaleza_mundo: 'Naturaleza Mundo',
                ambito_economico: 'Ámbito Económico',
                motor_cambio: 'Motor Cambio',
                politicas_preferidas: 'Políticas Preferidas'
            },
            confidenceValues: {
                muy_alta: 'Muy Alta',
                alta: 'Alta',
                media: 'Media',
                baja: 'Baja'
            }
        },
        nodes: {
            marxista: 'Marxista',
            feminista: 'Feminista',
            ecologica: 'Ecológica',
            tradicion_desarrollista: 'Tradición Desarrollista',
            keynesiana: 'Keynesiana',
            institucionalista: 'Institucionalista',
            estado_emprendedor: 'Estado Emprendedor',
            conductista: 'Conductista',
            clasica: 'Clásica',
            neoclasica: 'Neoclásica',
            austriaca: 'Austríaca',
            schumpeteriana: 'Schumpeteriana'
        }
    },
    en: {
        meta: {
            title: 'Economic Schools Map | Interactive Visualization',
            description: 'Interactive map of political economy schools built with D3.js and scrollytelling'
        },
        scroll: {
            navAriaLabel: 'Section navigation',
            goToSection: 'Go to {section}'
        },
        sections: {
            hero: 'Introduction',
            guide: 'Reading Guide',
            visualization: 'Interactive Map',
            cocktails: 'Idea Cocktails',
            timeline: 'Timeline',
            'learning-path': '4-Step Guide',
            'map-reading-guide': 'Epistemological Framework',
            applications: 'Practical Application',
            'pedagogical-legend': 'Conclusion (Different Lenses)'
        },
        ui: {
            localeLabel: 'Language',
            loadingVariant: 'Loading variant...',
            loadingError: 'Unable to load the variant. Please try again.',
            collisionEnabled: 'Allow Collisions',
            collisionDisabled: 'Prevent Collisions',
            downloadFilenamePrefix: 'economic-schools-map',
            toggleControlsShow: 'Customize View (Filters)',
            toggleControlsHide: 'Hide Filters ✖',
            advancedControlsShow: 'Layers & Settings',
            advancedControlsHide: 'Hide Settings ✖',
            touchScrollHint: '💡 Use 2 fingers to pan/zoom map',
            viewMap: '🗺️ Map View',
            viewTable: '📊 Table View',
            startTour: '✨ Guided Tour (60s)',
            tourRunning: '▶️ Guided Tour Active...',
            exploredProgress: 'Discovered: {count} / 12 schools',
            tableHeaders: {
                school: 'Economic School',
                quadrant: 'Quadrant',
                stateMarket: 'State vs. Market (X-Axis)',
                equityGrowth: 'Equity vs. Growth (Y-Axis)',
                type: 'Methodological Approach'
            },
            notAvailable: 'N/A'
        },
        glossary: {
            okun: 'Okun\'s Balance: The classic trade-off between productive efficiency (growth) and equitable wealth distribution.',
            marginalism: 'Marginalism: Neoclassical framework explaining value and prices based on the additional utility from the last unit consumed.',
            boundedRationality: 'Bounded Rationality: Herbert Simon\'s behavioral concept acknowledging humans decide with cognitive biases and limited information.',
            creativeDestruction: 'Creative Destruction: Schumpeter\'s concept where continuous innovation destroys outdated business models to unlock new value.'
        },
        visualization: {
            axes: {
                xDesktop: 'Economic Organization: ← Free Market (Limited State) | Directed Economy (Strong State) →',
                yDesktop: 'Societal Priority: Productivity and Growth ↓ | Equity and Sustainability ↑ (Okun\'s Balance)',
                xMobile: '← Market | State →',
                yMobile: 'Growth ↓ | Equity ↑'
            }
        },
        tooltip: {
            year: 'Year',
            authors: 'Authors',
            confidence: 'Confidence',
            reference: 'Reference',
            descriptors: {
                concepcion_economia: 'View of the Economy',
                concepcion_humano: 'View of Human Behavior',
                naturaleza_mundo: 'Nature of the World',
                ambito_economico: 'Main Economic Domain',
                motor_cambio: 'Driver of Change',
                politicas_preferidas: 'Preferred Policies'
            },
            confidenceValues: {
                muy_alta: 'Very High',
                alta: 'High',
                media: 'Medium',
                baja: 'Low'
            }
        },
        nodes: {
            marxista: 'Marxist',
            feminista: 'Feminist',
            ecologica: 'Ecological',
            tradicion_desarrollista: 'Developmentalist Tradition',
            keynesiana: 'Keynesian',
            institucionalista: 'Institutionalist',
            estado_emprendedor: 'Entrepreneurial State',
            conductista: 'Behavioral',
            clasica: 'Classical',
            neoclasica: 'Neoclassical',
            austriaca: 'Austrian',
            schumpeteriana: 'Schumpeterian'
        },
        html: {
            hero: `
                <div class="hero-topbar">
                    <div class="language-switcher">
                        <label for="language-selector">Language</label>
                        <select id="language-selector" aria-label="Select language">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
                <h1>Economic Schools Map</h1>
                <p class="hero-subtitle">An interactive visualization of economic thought</p>
                <p class="hero-description">
                    Explore the 12 major schools of economics in a two-dimensional map that shows how the economy is organized (the role of the state vs. the free market) and what goals society prioritizes (growth vs. equity and the planet).
                </p>
                <div class="hero-actions">
                    <a href="#visualization" class="btn btn-primary">
                        <svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 12 8"/></svg>
                        Explore the Map
                    </a>
                    <a href="https://github.com/willkwolf/EcoSchoolMap" class="btn btn-secondary" target="_blank" rel="noopener">
                        <svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        View on GitHub
                    </a>
                </div>

                <!-- Modern Metric Bento Strip -->
                <div class="hero-stats-strip">
                    <div class="stat-item">
                        <span class="stat-number">12</span>
                        <span class="stat-label">Schools Analyzed</span>
                    </div>
                    <div class="stat-divider" aria-hidden="true"></div>
                    <div class="stat-item">
                        <span class="stat-number">2D</span>
                        <span class="stat-label">Epistemic Plane</span>
                    </div>
                    <div class="stat-divider" aria-hidden="true"></div>
                    <div class="stat-item">
                        <span class="stat-number">13</span>
                        <span class="stat-label">Idea Cocktails</span>
                    </div>
                    <div class="stat-divider" aria-hidden="true"></div>
                    <div class="stat-item">
                        <span class="stat-number">32</span>
                        <span class="stat-label">Weight Variants</span>
                    </div>
                </div>

                <a href="#guide" id="hero-scroll-btn" class="hero-scroll-indicator" aria-label="Scroll to explore the reading guide">
                    <span>Scroll to explore</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                        <polyline points="5,7 10,12 15,7" stroke="currentColor" fill="none" stroke-width="2"/>
                    </svg>
                </a>
            `,
            guide: `
                <div class="section-heading-centered">
                    <span class="section-eyebrow">Theoretical Foundations</span>
                    <h2>Reading Guide: How to Interpret the Map</h2>
                    <p class="section-subheadline">Learn to decode the two epistemological axes, the four quadrants, and historical dynamics structuring economic paradigms.</p>
                </div>
                <div class="guide-grid bento-guide-grid">
                    <!-- Card 1: Axes -->
                    <div class="guide-card bento-card">
                        <div class="card-top-meta">
                            <span class="card-eyebrow">Coordinate Axes</span>
                            <span class="card-icon-badge" aria-hidden="true">🧭</span>
                        </div>
                        <h3>Map Axes</h3>
                        <div class="axis-guide-block">
                            <div class="axis-block-label">How is it organized? (Horizontal Axis X)</div>
                            <div class="direction-chips">
                                <span class="dir-chip dir-left">← Free Market (Limited State)</span>
                                <span class="dir-chip dir-right">Strong State (Planning) →</span>
                            </div>
                        </div>
                        <div class="axis-guide-block">
                            <div class="axis-block-label">What is prioritized? (Vertical Axis Y)</div>
                            <div class="direction-chips">
                                <span class="dir-chip dir-up">↑ Equity & Sustainability (Sharing & Nature)</span>
                                <span class="dir-chip dir-down">↓ Growth & Productivity (Capital)</span>
                            </div>
                        </div>
                        <p class="axis-subtext">Okun's Balance: The classic trade-off between producing more (efficiency) and sharing better (equity).</p>
                    </div>

                    <!-- Card 2: Quadrants -->
                    <div class="guide-card bento-card">
                        <div class="card-top-meta">
                            <span class="card-eyebrow">2D Cartography</span>
                            <span class="card-icon-badge" aria-hidden="true">🗺️</span>
                        </div>
                        <h3>Map Zones (Quadrants)</h3>
                        <div class="mini-quadrant-matrix">
                            <div class="mini-q mini-q2">
                                <span class="mini-q-badge">Q2</span>
                                <div class="mini-q-title">State + Equity</div>
                                <div class="mini-q-desc">Social planning and ecology</div>
                            </div>
                            <div class="mini-q mini-q1">
                                <span class="mini-q-badge">Q1</span>
                                <div class="mini-q-title">Market + Equity</div>
                                <div class="mini-q-desc">Liberty with distributive justice</div>
                            </div>
                            <div class="mini-q mini-q4">
                                <span class="mini-q-badge">Q4</span>
                                <div class="mini-q-title">State + Growth</div>
                                <div class="mini-q-desc">Industrialization & national development</div>
                            </div>
                            <div class="mini-q mini-q3">
                                <span class="mini-q-badge">Q3</span>
                                <div class="mini-q-title">Market + Growth</div>
                                <div class="mini-q-desc">Accumulation & market efficiency</div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3: Transitions -->
                    <div class="guide-card bento-card">
                        <div class="card-top-meta">
                            <span class="card-eyebrow">Temporal Dynamics</span>
                            <span class="card-icon-badge" aria-hidden="true">⏳</span>
                        </div>
                        <h3>Historical Transitions</h3>
                        <p>The arrows map paradigm shifts and intellectual disputes across modern history:</p>
                        <div class="transition-legend-list">
                            <div class="legend-row">
                                <span class="line-sample line-solid"></span>
                                <div class="legend-label"><strong>Solid Line:</strong> High documentary historical certainty</div>
                            </div>
                            <div class="legend-row">
                                <span class="line-sample line-dotted"></span>
                                <div class="legend-label"><strong>Dotted Line:</strong> Medium certainty with historiographic debate</div>
                            </div>
                            <div class="legend-row">
                                <span class="line-sample line-dashed"></span>
                                <div class="legend-label"><strong>Dashed Line:</strong> Exploratory / heterodox connection</div>
                            </div>
                        </div>
                        <p class="card-footnote">Clicking any transition arrow reveals its historical catalyst event and year.</p>
                    </div>

                    <!-- Card 4: Presets -->
                    <div class="guide-card bento-card">
                        <div class="card-top-meta">
                            <span class="card-eyebrow">Theoretical Perspectives</span>
                            <span class="card-icon-badge" aria-hidden="true">🔍</span>
                        </div>
                        <h3>Lenses of Analysis (Presets)</h3>
                        <p>No single school holds the monopoly on truth. Select presets to shift analytical weights:</p>
                        <div class="preset-chips-preview">
                            <span class="preset-chip">⚖️ Balanced (Base)</span>
                            <span class="preset-chip">🏛️ State Emphasis</span>
                            <span class="preset-chip">🤝 Equity Emphasis</span>
                            <span class="preset-chip">📈 Market Emphasis</span>
                            <span class="preset-chip">🏭 Growth Emphasis</span>
                            <span class="preset-chip">📜 Historical Emphasis</span>
                            <span class="preset-chip">🛠️ Pragmatic Emphasis</span>
                        </div>
                    </div>

                    <!-- Card 5: Methodology -->
                    <div class="guide-card bento-card">
                        <div class="card-top-meta">
                            <span class="card-eyebrow">Research Framework</span>
                            <span class="card-icon-badge" aria-hidden="true">📖</span>
                        </div>
                        <h3>Research Foundation</h3>
                        <p>Inspired by the multidimensional taxonomy by <strong>Ha-Joon Chang</strong> (<em>Economics: The User's Guide</em>, Ch. 4):</p>
                        <ul class="clean-checklist">
                            <li><strong>6 Qualitative Descriptors:</strong> Human view, economic view, scope, world nature, engine, and preferred policies.</li>
                            <li><strong>Transparent Scoring:</strong> Quantitative normalized scores designed for pedagogical exploration and contrast.</li>
                            <li><strong>Theoretical Pluralism:</strong> Integrates and connects diverse economic traditions (classical, neoclassical, Marxist, Keynesian, behavioral, feminist, ecological, among others).</li>
                        </ul>
                    </div>

                    <!-- Card 6: Critical Complementarity -->
                    <div class="guide-card bento-card complementary-bento-card">
                        <div class="card-top-meta">
                            <span class="card-eyebrow">Critical Complementarity</span>
                            <span class="card-icon-badge" aria-hidden="true">💡</span>
                        </div>
                        <h3>The value of contrasting multiple lenses</h3>
                        <p class="caution-lead">Every economic school starts from legitimate core questions and distinct analytical tools:</p>
                        <div class="risk-pills-grid">
                            <div class="risk-pill"><strong>Beyond trenches:</strong> Fosters rigorous debate without reducing economic inquiry to a binary conflict.</div>
                            <div class="risk-pill"><strong>Expanding horizons:</strong> Highlights critical variables that a single lens often assumes away or overlooks.</div>
                            <div class="risk-pill"><strong>Intellectual humility:</strong> Acknowledges that no single theoretical framework holds definitive answers for all social complexity.</div>
                            <div class="risk-pill"><strong>Situated solutions:</strong> Encourages diagnostic assessments that respect institutional realities and material boundaries.</div>
                        </div>
                    </div>
                </div>
            `,
            visualization: `
                <div class="vis-header-toolbar">
                    <h2>Interactive Map</h2>
                    <div class="vis-toolbar-actions">
                        <div id="exploration-counter" class="exploration-badge" title="Exploration progress">
                            <span class="badge-icon">🎓</span>
                            <span id="exploration-counter-text" class="badge-text">Discovered: 0 / 12 schools</span>
                        </div>
                        <button type="button" id="start-guided-tour-btn" class="tour-btn" title="Start animated tour through major schools">
                            <span>✨ Guided Tour (60s)</span>
                        </button>
                        <div class="view-toggle-container" role="tablist" aria-label="Toggle visualization view">
                            <button type="button" id="btn-view-map" class="view-toggle-btn active" role="tab" aria-selected="true">🗺️ Map View</button>
                            <button type="button" id="btn-view-table" class="view-toggle-btn" role="tab" aria-selected="false">📊 Table View</button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Controls Toggle Button -->
                <button type="button" id="toggle-controls-btn" class="controls-toggle-btn" aria-expanded="false" aria-controls="map-controls">
                    <svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" fill="currentColor"/>
                    </svg>
                    <span class="toggle-text">Customize View (Filters)</span>
                </button>

                <!-- Controls -->
                <div id="map-controls" class="controls">
                    <div class="controls-primary-bar">
                        <div class="control-group preset-group">
                            <label for="preset-dropdown" title="Lenses of analysis alter school positions to show different economic perspectives">
                                <span class="label-icon">🔍</span> Lenses of Analysis (Presets):
                            </label>
                            <select id="preset-dropdown">
                                <option value="base" selected>Balanced (Academic)</option>
                                <option value="state-emphasis">State Emphasis</option>
                                <option value="equity-emphasis">Equity Emphasis</option>
                                <option value="market-emphasis">Market Emphasis</option>
                                <option value="growth-emphasis">Growth Emphasis</option>
                                <option value="historical-emphasis">Historical Emphasis</option>
                                <option value="pragmatic-emphasis">Pragmatic Emphasis</option>
                            </select>
                        </div>
                        <div class="primary-controls-actions">
                            <button type="button" id="toggle-advanced-controls-btn" class="advanced-toggle-btn" aria-expanded="false" aria-controls="advanced-controls-panel">
                                <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" fill="currentColor"/>
                                </svg>
                                <span class="btn-text">Layers & Settings</span>
                                <svg class="btn-chevron" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                                    <polyline points="5,7 10,12 15,7" stroke="currentColor" fill="none" stroke-width="2"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Secondary Controls Panel (Ajustes Avanzados) -->
                    <div id="advanced-controls-panel" class="advanced-controls-panel">
                        <div class="control-group">
                            <label for="normalization-dropdown" title="Normalization methods change how values are represented on the map">Scale of Visualization:</label>
                            <select id="normalization-dropdown">
                                <option value="percentile" selected>Percentile (Well-distributed schools)</option>
                                <option value="zscore">Z-Score (Centered on average)</option>
                                <option value="minmax">Min-Max (Full Range)</option>
                                <option value="none">Unnormalized (Raw position)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label title="Controls the visibility of historical transitions between schools">Historical Transitions:</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="transition-muy_alta" checked>
                                    <span class="checkmark"></span>
                                    Very High Certainty
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="transition-alta" checked>
                                    <span class="checkmark"></span>
                                    High Certainty
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="transition-media" checked>
                                    <span class="checkmark"></span>
                                    Medium Certainty
                                </label>
                                <div class="checkbox-actions">
                                    <button type="button" id="select-all-transitions" class="checkbox-btn">Select All</button>
                                    <button type="button" id="deselect-all-transitions" class="checkbox-btn">Clear All</button>
                                </div>
                            </div>
                        </div>
                        <div class="control-group">
                            <label title="Controls whether node collisions are allowed. When enabled, light simulation forces reduce visual overlap.">Simulation Forces:</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="collision-toggle">
                                    <span class="checkmark"></span>
                                    <span class="checkbox-label-text">Prevent Collisions</span>
                                </label>
                            </div>
                        </div>
                        <div class="control-group button-group">
                            <button id="reset-zoom-btn" class="control-btn" title="Return to the initial map view">
                                <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/>
                                </svg>
                                <span>Reset View</span>
                            </button>
                            <button id="download-png-btn" class="control-btn" title="Download the map as a PNG image">
                                <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                                </svg>
                                <span>Export Image</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="map-container" class="map-container">
                    <div id="loading-indicator" class="loading-indicator" style="display: none;">
                        <div class="spinner"></div>
                        <p>Loading variant...</p>
                    </div>
                </div>
                <div id="map-table-container" class="map-table-container" style="display: none;"></div>
            `,
            cocktails: `
                <h2>Idea Cocktails: Combining Schools to Solve Real Problems (Synergies)</h2>
                <div class="intro-text">
                    <p>
                        Although it is good to know the differences between the 12 economic schools, exploring so many approaches can feel overwhelming at first. It is like walking into an ice cream shop with 12 flavors when you thought vanilla was the only one. It is normal to feel that 12 is too many.
                    </p>
                    <p>
                        That is why we propose "idea cocktails": combinations of 2 to 4 schools applied to real-world topics. By tasting these mixes, you will see how useful it is to use different theoretical tools for different problems. Even trying one or two cocktails is enough to show that there are many valid ways to think about, practice, and approach economics.
                    </p>
                </div>
                <h3>Recommended Analysis Configurations</h3>
                <div class="tabs-container">
                    <button class="tab-btn active" data-tab="all" tabindex="0">Show All</button>
                    <button class="tab-btn" data-tab="gobernanza" tabindex="0">Governance and State</button>
                    <button class="tab-btn" data-tab="capitalismo" tabindex="0">Capitalism Dynamics</button>
                    <button class="tab-btn" data-tab="sociedad" tabindex="0">Individual and Society</button>
                    <button class="tab-btn" data-tab="sostenibilidad" tabindex="0">Sustainability and Limits</button>
                </div>
                <div class="cocktails-grid">
                    <div class="cocktail-card" data-category="capitalismo">
                        <div class="cocktail-number">1</div>
                        <h4>Vitality and visibility of capitalism</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #E69F00;"><span class="pill-dot" style="background-color: #E69F00;"></span>Classical</span>
                            <span class="school-pill" style="--pill-color: #D55E00;"><span class="pill-dot" style="background-color: #D55E00;"></span>Marxist</span>
                            <span class="school-pill" style="--pill-color: #882255;"><span class="pill-dot" style="background-color: #882255;"></span>Schumpeterian</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="gobernanza">
                        <div class="cocktail-number">2</div>
                        <h4>Defense of the free market</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #E69F00;"><span class="pill-dot" style="background-color: #E69F00;"></span>Classical</span>
                            <span class="school-pill" style="--pill-color: #009E73;"><span class="pill-dot" style="background-color: #009E73;"></span>Austrian</span>
                            <span class="school-pill" style="--pill-color: #56B4E9;"><span class="pill-dot" style="background-color: #56B4E9;"></span>Neoclassical</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="sociedad">
                        <div class="cocktail-number">3</div>
                        <h4>Conceptualizing the individual</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #56B4E9;"><span class="pill-dot" style="background-color: #56B4E9;"></span>Neoclassical</span>
                            <span class="school-pill" style="--pill-color: #009E73;"><span class="pill-dot" style="background-color: #009E73;"></span>Austrian</span>
                            <span class="school-pill" style="--pill-color: #44AA99;"><span class="pill-dot" style="background-color: #44AA99;"></span>Behavioral</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="gobernanza">
                        <div class="cocktail-number">4</div>
                        <h4>The need for state intervention</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #56B4E9;"><span class="pill-dot" style="background-color: #56B4E9;"></span>Neoclassical</span>
                            <span class="school-pill" style="--pill-color: #CC79A7;"><span class="pill-dot" style="background-color: #CC79A7;"></span>Developmentalist</span>
                            <span class="school-pill" style="--pill-color: #D4AC0D;"><span class="pill-dot" style="background-color: #D4AC0D;"></span>Keynesian</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="sociedad">
                        <div class="cocktail-number">5</div>
                        <h4>Theories of groups and classes</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #E69F00;"><span class="pill-dot" style="background-color: #E69F00;"></span>Classical</span>
                            <span class="school-pill" style="--pill-color: #D55E00;"><span class="pill-dot" style="background-color: #D55E00;"></span>Marxist</span>
                            <span class="school-pill" style="--pill-color: #D4AC0D;"><span class="pill-dot" style="background-color: #D4AC0D;"></span>Keynesian</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="sostenibilidad">
                        <div class="cocktail-number">6</div>
                        <h4>Economy beyond markets</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #D55E00;"><span class="pill-dot" style="background-color: #D55E00;"></span>Marxist</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                            <span class="school-pill" style="--pill-color: #44AA99;"><span class="pill-dot" style="background-color: #44AA99;"></span>Behavioral</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="capitalismo">
                        <div class="cocktail-number">7</div>
                        <h4>Complete economic systems</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #D55E00;"><span class="pill-dot" style="background-color: #D55E00;"></span>Marxist</span>
                            <span class="school-pill" style="--pill-color: #CC79A7;"><span class="pill-dot" style="background-color: #CC79A7;"></span>Developmentalist</span>
                            <span class="school-pill" style="--pill-color: #D4AC0D;"><span class="pill-dot" style="background-color: #D4AC0D;"></span>Keynesian</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="capitalismo">
                        <div class="cocktail-number">8</div>
                        <h4>Technological development and productivity</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #E69F00;"><span class="pill-dot" style="background-color: #E69F00;"></span>Classical</span>
                            <span class="school-pill" style="--pill-color: #D55E00;"><span class="pill-dot" style="background-color: #D55E00;"></span>Marxist</span>
                            <span class="school-pill" style="--pill-color: #CC79A7;"><span class="pill-dot" style="background-color: #CC79A7;"></span>Developmentalist</span>
                            <span class="school-pill" style="--pill-color: #882255;"><span class="pill-dot" style="background-color: #882255;"></span>Schumpeterian</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="sociedad">
                        <div class="cocktail-number">9</div>
                        <h4>Interaction between individuals and society</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #009E73;"><span class="pill-dot" style="background-color: #009E73;"></span>Austrian</span>
                            <span class="school-pill" style="--pill-color: #56B4E9;"><span class="pill-dot" style="background-color: #56B4E9;"></span>Neoclassical</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                            <span class="school-pill" style="--pill-color: #44AA99;"><span class="pill-dot" style="background-color: #44AA99;"></span>Behavioral</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="capitalismo">
                        <div class="cocktail-number">10</div>
                        <h4>Corporations and how they work</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #882255;"><span class="pill-dot" style="background-color: #882255;"></span>Schumpeterian</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                            <span class="school-pill" style="--pill-color: #44AA99;"><span class="pill-dot" style="background-color: #44AA99;"></span>Behavioral</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="gobernanza">
                        <div class="cocktail-number">11</div>
                        <h4>Unemployment and recession</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #E69F00;"><span class="pill-dot" style="background-color: #E69F00;"></span>Classical</span>
                            <span class="school-pill" style="--pill-color: #D4AC0D;"><span class="pill-dot" style="background-color: #D4AC0D;"></span>Keynesian</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="sociedad">
                        <div class="cocktail-number">12</div>
                        <h4>Care economy and gender inequality</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #AA4499;"><span class="pill-dot" style="background-color: #AA4499;"></span>Feminist</span>
                            <span class="school-pill" style="--pill-color: #D55E00;"><span class="pill-dot" style="background-color: #D55E00;"></span>Marxist</span>
                            <span class="school-pill" style="--pill-color: #D4AC0D;"><span class="pill-dot" style="background-color: #D4AC0D;"></span>Keynesian</span>
                            <span class="school-pill" style="--pill-color: #44AA99;"><span class="pill-dot" style="background-color: #44AA99;"></span>Behavioral</span>
                        </div>
                    </div>
                    <div class="cocktail-card" data-category="sostenibilidad">
                        <div class="cocktail-number">13</div>
                        <h4>Sustainability and planetary boundaries</h4>
                        <div class="cocktail-pills" aria-label="Combined schools">
                            <span class="school-pill" style="--pill-color: #117733;"><span class="pill-dot" style="background-color: #117733;"></span>Ecological</span>
                            <span class="school-pill" style="--pill-color: #CC79A7;"><span class="pill-dot" style="background-color: #CC79A7;"></span>Developmentalist</span>
                            <span class="school-pill" style="--pill-color: #D4AC0D;"><span class="pill-dot" style="background-color: #D4AC0D;"></span>Keynesian</span>
                            <span class="school-pill" style="--pill-color: #0072B2;"><span class="pill-dot" style="background-color: #0072B2;"></span>Institutionalist</span>
                        </div>
                    </div>
                </div>
            `,
            barCalloutBanner: `
                <div class="callout-icon" aria-hidden="true"></div>
                <div class="callout-content">
                    <h3>Ready to play bartender?</h3>
                    <p>Put this theory into practice in our <strong>Economic Schools Bar</strong>. An interactive simulator where you can mix ideological spirits in your own virtual shaker, analyze the intensity of your "systemic intoxication", and take your conceptual <strong>Sobriety Test</strong>.</p>
                    <a href="https://willkwolf.github.io/economic-bar/" class="btn btn-callout" target="_blank" rel="noopener">Go to the Cocktails Bar ➔</a>
                </div>
            `,
            timeline: `
                <h2>Historical Timeline</h2>
                <p class="intro-text">
                    Explore the most important milestones in the development of economic thought from 1776 to 2013.
                    Each event marked a turning point in how we understand and analyze the economy.
                </p>
                <div class="tabs-container">
                    <button class="tab-btn active" data-tab="all" tabindex="0">All History</button>
                    <button class="tab-btn" data-tab="era-fundaciones" tabindex="0">Foundations (1776-1870s)</button>
                    <button class="tab-btn" data-tab="era-consolidacion" tabindex="0">Consolidation (1898-1940s)</button>
                    <button class="tab-btn" data-tab="era-contemporanea" tabindex="0">Contemporary Era (1950s-2013)</button>
                </div>
                <div class="timeline-grid">
                    <div class="timeline-item" data-category="era-fundaciones"><div class="timeline-year">1776</div><h4>Adam Smith and Classical Economics</h4><p>Publication of "The Wealth of Nations" and the foundation of modern economic thought</p></div>
                    <div class="timeline-item" data-category="era-fundaciones"><div class="timeline-year">1867</div><h4>Marx and Capital</h4><p>Publication of "Capital" and a radical critique of the capitalist system</p></div>
                    <div class="timeline-item" data-category="era-fundaciones"><div class="timeline-year">1870s</div><h4>The Neoclassical Revolution</h4><p>Development of marginalism and general equilibrium theory</p></div>
                    <div class="timeline-item" data-category="era-consolidacion"><div class="timeline-year">1898</div><h4>Thorstein Veblen and Institutionalism</h4><p>Publication of "Why Economics Needs Social Theory" and the birth of institutionalism</p></div>
                    <div class="timeline-item" data-category="era-consolidacion"><div class="timeline-year">1912</div><h4>Joseph Schumpeter and Economic Development</h4><p>Publication of "The Theory of Economic Development" on innovation and creative destruction</p></div>
                    <div class="timeline-item" data-category="era-consolidacion"><div class="timeline-year">1936</div><h4>Keynes and the Keynesian Revolution</h4><p>Publication of "The General Theory" and the case for state intervention in crises</p></div>
                    <div class="timeline-item" data-category="era-consolidacion"><div class="timeline-year">1940s</div><h4>The Austrian School in America</h4><p>Exile of Austrian economists and the spread of their ideas</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1950s</div><h4>Development Theory</h4><p>Rise of development economics and structuralism</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1970s</div><h4>Critiques of Keynesianism</h4><p>Stagflation and the revival of free-market ideas</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1971</div><h4>Nicholas Georgescu-Roegen and Biophysical Foundations</h4><p>Publication of "The Entropy Law and the Economic Process", the conceptual "Big Bang" introducing thermodynamics to economics.</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1979</div><h4>Kahneman and Tversky: Behavioral Economics</h4><p>Prospect Theory, cognitive biases, and bounded rationality</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1980s</div><h4>The Neoliberal Revolution</h4><p>Consolidation of market-centered thought under Reagan and Thatcher</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1980s</div><h4>Feminist Economics</h4><p>Integration of gender into economic analysis</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1989</div><h4>Herman Daly and Robert Costanza: Institutionalization</h4><p>Co-founding of the ISEE and development of concepts like the Steady-State economy and valuation of ecosystem services.</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1990s</div><h4>Renewed Focus on Institutions</h4><p>Recognition of the importance of institutions in development</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">2011</div><h4>Kate Raworth: Modern Popularization</h4><p>Doughnut Economics: bridging planetary boundaries with social floors for sustainable human development.</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">2013</div><h4>Mariana Mazzucato and the Entrepreneurial State</h4><p>The state as a creator of markets and innovation</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">2013</div><h4>Feminist Economics</h4><p>Consolidation as a recognized school of thought</p></div>
                </div>
            `,
            learningPath: `
                <h2>Pedagogical Analysis Sequence</h2>
                <p class="intro-text">
                    Follow these 4 steps to master the economic schools map and apply its concepts
                    to real-world situations.
                </p>
                <div class="path-grid">
                    <div class="path-step"><div class="step-number">1</div><h4>Explore the Map</h4><p>Start by getting familiar with the 12 schools and their relative positions. Use zoom and inspect each node.</p></div>
                    <div class="path-step"><div class="step-number">2</div><h4>Understand the Transitions</h4><p>Study the historical arrows to understand how economic ideas evolved over time.</p></div>
                    <div class="path-step"><div class="step-number">3</div><h4>Experiment with Variants</h4><p>Use the controls to see how different perspectives shift the positions of the schools.</p></div>
                    <div class="path-step"><div class="step-number">4</div><h4>Apply Them to Real Cases</h4><p>Use the thematic cocktails to analyze current economic problems from multiple perspectives.</p></div>
                </div>
            `,
            mapReadingGuide: `
                <div class="split-layout">
                    <div class="split-sidebar">
                        <h2>Epistemological Framework</h2>
                        <div class="sidebar-line"></div>
                        <div class="intro-text">
                            <p>
                                This map compares economic schools along two axes. While every simplification compresses deep debates, this guide highlights the limits, layers, and paths (trajectories) that shape the economic space.
                            </p>
                        </div>
                    </div>
                    
                    <div class="split-content">
                        <div class="principles-grid">
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">01</span>
                                    <h4>Layers & Paths</h4>
                                </div>
                                <div class="card-body">
                                    <p>Schools are the starting points. However, transverse <strong>layers</strong> (like gender or complexity) and <strong>paths</strong> (historical trajectories) reveal how these ideas interact and evolve.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">02</span>
                                    <h4>Biophysical Limits</h4>
                                </div>
                                <div class="card-body">
                                    <p>Theory is limitless, but nature is not. <strong>Ecological Economics</strong> (Georgescu-Roegen, Daly, Costanza, Raworth) establishes that all human economies must operate above a <strong>social floor</strong> and beneath a <strong>planetary ceiling</strong>.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">03</span>
                                    <h4>Rules of Inclusion</h4>
                                </div>
                                <div class="card-body">
                                    <p>To earn a node, a school must answer: <em>how is production organized?</em> and <em>what is its goal?</em> Frameworks like complexity or biophysical flows are analytical lenses, not separate schools.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">04</span>
                                    <h4>Suggested Readings</h4>
                                </div>
                                <div class="card-body">
                                    <p><strong>Donella Meadows</strong> (system feedback), <strong>Brian Arthur</strong> (network path-dependency), and <strong>Charles Hall</strong> (energy return on investment) provide the biophysical grounding missing in standard models.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            applications: `
                <h2>Spheres of Practical Application</h2>
                <p class="intro-text">
                    Learn how to apply different economic schools to real situations in three key areas:
                    public policy, business strategy, and citizenship.
                </p>
                <div class="tabs-container">
                    <button class="tab-btn active" data-tab="app-publicas" tabindex="0">Public Policy</button>
                    <button class="tab-btn" data-tab="app-organizativas" tabindex="0">Organizational Strategy</button>
                    <button class="tab-btn" data-tab="app-ciudadania" tabindex="0">Civic Action</button>
                </div>
                <div class="applications-grid">
                    <div class="application-category" id="app-publicas">
                        <h3>Public Policy and Governance</h3>
                        <div class="application-items">
                            <div class="application-item"><h4>Fiscal Policy</h4><p><strong>Keynesian:</strong> Increase spending during recessions</p><p><strong>Austrian:</strong> Cut taxes and public spending</p><p><strong>Neoclassical:</strong> Maintain budget balance</p></div>
                            <div class="application-item"><h4>Monetary Policy</h4><p><strong>Keynesian:</strong> Use interest rates to stabilize activity</p><p><strong>Monetarist:</strong> Follow money growth rules</p><p><strong>Developmentalist:</strong> Direct credit toward strategic sectors</p></div>
                            <div class="application-item"><h4>International Trade</h4><p><strong>Classical:</strong> Free trade and comparative advantage</p><p><strong>Developmentalist:</strong> Infant industry protection</p><p><strong>Institutionalist:</strong> Agreements with labor and social standards</p></div>
                        </div>
                    </div>
                    <div class="application-category" id="app-organizativas" style="display: none;">
                        <h3>Organizational and Corporate Strategy</h3>
                        <div class="application-items">
                            <div class="application-item"><h4>Corporate Strategy</h4><p><strong>Schumpeterian:</strong> Disruptive innovation</p><p><strong>Behavioral:</strong> Nudging and bounded decisions</p><p><strong>Institutionalist:</strong> Corporate social responsibility</p></div>
                            <div class="application-item"><h4>Human Resource Management</h4><p><strong>Neoclassical:</strong> Wages from marginal productivity</p><p><strong>Marxist:</strong> Exploitation and surplus value</p><p><strong>Feminist:</strong> Care economy and gender pay gaps</p></div>
                            <div class="application-item"><h4>Corporate Finance</h4><p><strong>Neoclassical:</strong> Maximize shareholder value</p><p><strong>Keynesian:</strong> Preference for liquidity</p><p><strong>Austrian:</strong> Economic calculation and capital markets</p></div>
                        </div>
                    </div>
                    <div class="application-category" id="app-ciudadania" style="display: none;">
                        <h3>Civic Action and Consumption Choices</h3>
                        <div class="application-items">
                            <div class="application-item"><h4>Consumption Decisions</h4><p><strong>Neoclassical:</strong> Utility maximization</p><p><strong>Behavioral:</strong> Cognitive biases and heuristics</p><p><strong>Institutionalist:</strong> Habits and social norms</p></div>
                            <div class="application-item"><h4>Political Participation</h4><p><strong>Classical:</strong> Rational voting through cost-benefit reasoning</p><p><strong>Marxist:</strong> Class consciousness and activism</p><p><strong>Feminist:</strong> Care-centered political economy</p></div>
                            <div class="application-item"><h4>Personal Saving and Investment</h4><p><strong>Neoclassical:</strong> Intertemporal choice</p><p><strong>Keynesian:</strong> Propensity to consume</p><p><strong>Austrian:</strong> Time preference</p></div>
                        </div>
                    </div>
                </div>
            `,
            pedagogicalLegend: `
                <div class="split-layout">
                    <div class="split-sidebar">
                        <h2>Think with Pluralism</h2>
                        <div class="sidebar-line"></div>
                        <div class="intro-text">
                            <p>
                                The value of this map is not memorizing locations, but fostering pluralism: realizing that no single economic truth exists, and that every school offers vital analytical tools.
                            </p>
                        </div>
                        <div class="final-message">
                            <h3>Learning Route</h3>
                            <ul>
                                <li><strong>Explore</strong> primary sources from each school</li>
                                <li><strong>Question</strong> your own assumptions and biases</li>
                                <li><strong>Engage</strong> in dialogue with dissenting views</li>
                                <li><strong>Apply</strong> multiple frameworks to concrete issues</li>
                            </ul>
                            <p class="final-quote">
                                "The purpose of education is to replace an empty mind with an open one."
                            </p>
                        </div>
                    </div>
                    
                    <div class="split-content">
                        <div class="principles-grid">
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">01</span>
                                    <h4>Open Mind</h4>
                                </div>
                                <div class="card-body">
                                    <blockquote>"True wisdom is in recognizing one's own ignorance." <cite>— Socrates</cite></blockquote>
                                    <p>No single model explains the entire economy. Stay curious and open to insights from other frameworks.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">02</span>
                                    <h4>Analytical Rigor</h4>
                                </div>
                                <div class="card-body">
                                    <blockquote>"Doubt everything at least once, even whether two plus two makes four." <cite>— G. Lichtenberg</cite></blockquote>
                                    <p>Examine the underlying assumptions of each claim. Ask under what conditions a theory works and what evidence supports it.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">03</span>
                                    <h4>Contextual Thinking</h4>
                                </div>
                                <div class="card-body">
                                    <blockquote>"There is nothing so practical as a good theory." <cite>— Kurt Lewin</cite></blockquote>
                                    <p>Economic ideas are products of their time and space. Avoid applying generic formulas without understanding local history.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="card-header">
                                    <span class="card-number">04</span>
                                    <h4>Creative Synthesis</h4>
                                </div>
                                <div class="card-body">
                                    <blockquote>"Truth is a pathless land." <cite>— J. Krishnamurti</cite></blockquote>
                                    <p>Don't get locked into a single camp. Integrate the best features of different schools to design better solutions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            footer: `
                <!-- Ecosystem Stepper -->
                <div class="ecosystem-stepper-section">
                    <h3>Critical Thought Path</h3>
                    <p class="stepper-subtitle">A network of interactive visualizations to explore economics and society</p>
                    <div class="ecosystem-stepper">
                        <div class="step-item active">
                            <div class="step-badge">1</div>
                            <div class="step-meta">
                                <span class="step-title">Understand</span>
                                <span class="step-project">Schools Map</span>
                                <span class="step-status">You are here</span>
                            </div>
                        </div>
                        <a href="https://willkwolf.github.io/economic-bar/" class="step-item" target="_blank" rel="noopener">
                            <div class="step-badge">2</div>
                            <div class="step-meta">
                                <span class="step-title">Mix</span>
                                <span class="step-project">The Cocktails Bar</span>
                                <span class="step-status">Explore ➔</span>
                            </div>
                        </a>
                        <a href="https://willkwolf.github.io/isaiah-berlin-liberty-infographic/" class="step-item" target="_blank" rel="noopener">
                            <div class="step-badge">3</div>
                            <div class="step-meta">
                                <span class="step-title">Contrast</span>
                                <span class="step-project">Liberty Philosophy</span>
                                <span class="step-status">Explore ➔</span>
                            </div>
                        </a>
                        <a href="https://willkwolf.github.io/global-inequality-21Century/Escala-visual-de-riqueza-mundial.html" class="step-item" target="_blank" rel="noopener">
                            <div class="step-badge">4</div>
                            <div class="step-meta">
                                <span class="step-title">Scale</span>
                                <span class="step-project">Global Wealth Gap</span>
                                <span class="step-status">Explore ➔</span>
                            </div>
                        </a>
                        <a href="https://willkwolf.github.io/colombia-palma-desigualdad/" class="step-item" target="_blank" rel="noopener">
                            <div class="step-badge">5</div>
                            <div class="step-meta">
                                <span class="step-title">Land</span>
                                <span class="step-project">Inequality in Colombia</span>
                                <span class="step-status">Explore ➔</span>
                            </div>
                        </a>
                    </div>
                </div>

                <hr class="footer-divider">

                <div class="footer-bottom-grid">
                    <div class="footer-info">
                        <p>
                            Inspired by <strong>Ha-Joon Chang</strong>'s research, from his book <em>Economics: The User's Guide</em> (2015), Chapter 4.
                        </p>
                        <p class="footer-meta">
                            Project: Political Economy Schools Map • Version 3.3 • Author: William Camilo Artunduaga Viana
                        </p>
                    </div>
                    <div class="footer-links-column">
                        <div class="footer-links">
                            <a href="https://github.com/willkwolf/EcoSchoolMap" target="_blank" rel="noopener">GitHub</a>
                            <a href="https://github.com/willkwolf/EcoSchoolMap/issues" target="_blank" rel="noopener">Report Issue</a>
                            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>
                        </div>
                    </div>
                </div>
            `
        }
    }
};
