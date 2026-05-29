export const translations = {
    es: {
        meta: {
            title: 'Mapa de Escuelas Económicas | Visualización Interactiva',
            description: 'Mapa interactivo de escuelas políticas económicas con D3.js y scrollytelling'
        },
        scroll: {
            navAriaLabel: 'Navegación de secciones',
            goToSection: 'Ir a {section}'
        },
        sections: {
            hero: 'Introducción',
            guide: 'Guía de Lectura',
            visualization: 'Mapa Interactivo',
            cocktails: 'Sinergias Metodológicas',
            timeline: 'Línea de Tiempo',
            'learning-path': 'Secuencia Pedagógica',
            'map-reading-guide': 'Guía de Interpretación',
            applications: 'Ámbitos de Aplicación',
            'pedagogical-legend': 'Epílogo Epistemológico'
        },
        ui: {
            localeLabel: 'Idioma',
            loadingVariant: 'Cargando variante...',
            loadingError: 'Error al cargar variante. Intenta de nuevo.',
            collisionEnabled: 'Permitir Colisiones',
            collisionDisabled: 'No Permitir Colisiones',
            downloadFilenamePrefix: 'mapa-escuelas',
            notAvailable: 'N/D'
        },
        visualization: {
            axes: {
                xDesktop: 'Arquitectura Económica: ← Economía de Mercado (Estado Débil) | Economía Dirigida (Estado Fuerte) →',
                yDesktop: 'Objetivo Socioeconómico: Productividad y Crecimiento ↓ | Equidad y Sostenibilidad ↑',
                xMobile: '← Estado Débil | Estado Fuerte →',
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
            ecologica: 'Ecológica (Raworth)',
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
            cocktails: 'Methodological Synergies',
            timeline: 'Timeline',
            'learning-path': 'Pedagogical Sequence',
            'map-reading-guide': 'Interpretation Guide',
            applications: 'Spheres of Application',
            'pedagogical-legend': 'Epistemological Epilogue'
        },
        ui: {
            localeLabel: 'Language',
            loadingVariant: 'Loading variant...',
            loadingError: 'Unable to load the variant. Please try again.',
            collisionEnabled: 'Allow Collisions',
            collisionDisabled: 'Prevent Collisions',
            downloadFilenamePrefix: 'economic-schools-map',
            notAvailable: 'N/A'
        },
        visualization: {
            axes: {
                xDesktop: 'Economic Architecture: ← Market Economy (Limited State) | Directed Economy (Strong State) →',
                yDesktop: 'Socioeconomic Goal: Productivity and Growth ↓ | Equity and Sustainability ↑',
                xMobile: '← Limited State | Strong State →',
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
            ecologica: 'Ecological (Raworth)',
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
                    Explore the 12 major schools of economic thought in a two-dimensional space
                    that represents the role of the state and socioeconomic goals.
                </p>
                <div class="hero-actions">
                    <a href="#visualization" class="btn btn-primary">Explore the Map</a>
                    <a href="https://github.com/willkwolf/EcoSchoolMap" class="btn btn-secondary" target="_blank" rel="noopener">View on GitHub</a>
                </div>
                <div class="scroll-indicator">
                    <span>Scroll to explore</span>
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <polyline points="5,7 10,12 15,7" stroke="currentColor" fill="none" stroke-width="2"></polyline>
                    </svg>
                </div>
            `,
            guide: `
                <h2>Reading Guide</h2>
                <div class="guide-grid">
                    <div class="guide-card">
                        <h3>Map Axes</h3>
                        <p><strong>Horizontal Axis (X):</strong> Economic Architecture</p>
                        <ul>
                            <li>← Left: Limited State (Market Economy)</li>
                            <li>→ Right: Strong State (Directed Economy)</li>
                        </ul>
                        <p><strong>Vertical Axis (Y):</strong> Socioeconomic Goal</p>
                        <ul>
                            <li>↑ Top: Equity and Sustainability</li>
                            <li>↓ Bottom: Productivity and Growth</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>Quadrants of Analysis</h3>
                        <p>The map is organized into 4 main quadrants:</p>
                        <ul>
                            <li><strong>Q1:</strong> Weak State + Equity and Sustainability</li>
                            <li><strong>Q2:</strong> Strong State + Equity and Sustainability</li>
                            <li><strong>Q3:</strong> Weak State + Growth and Productivity</li>
                            <li><strong>Q4:</strong> Strong State + Growth and Productivity</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>Historical Transitions</h3>
                        <p>The arrows represent historical shifts between schools:</p>
                        <ul>
                            <li><strong>Solid line:</strong> High historical confidence</li>
                            <li><strong>Dotted line:</strong> Medium confidence</li>
                            <li><strong>Dashed line:</strong> Low confidence</li>
                        </ul>
                        <p>Each transition includes its trigger event and year.</p>
                    </div>
                    <div class="guide-card">
                        <h3>Weighting Variants</h3>
                        <p>Different perspectives shift the positions of the schools:</p>
                        <ul>
                            <li><strong>Base:</strong> Balanced and neutral</li>
                            <li><strong>State Emphasis:</strong> Focus on the role of the state</li>
                            <li><strong>Equity Emphasis:</strong> Focus on equity</li>
                            <li><strong>Market Emphasis:</strong> Focus on free markets</li>
                            <li><strong>Growth Emphasis:</strong> Focus on growth</li>
                            <li><strong>Historical Emphasis:</strong> Focus on historical evolution</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>Methodological Foundation</h3>
                        <p>Based on Chapter 4 of <strong>Economics: The User's Guide</strong> by <strong>Ha-Joon Chang</strong> (2015):</p>
                        <ul>
                            <li>Multidimensional analysis of economic schools</li>
                            <li>Qualitative positioning translated into comparable values</li>
                            <li>Percentile-based normalization</li>
                            <li>Interactive pedagogical visualization</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>Methodological Warnings</h3>
                        <p class="caution-highlight">
                            Relying on only one school to study a topic creates a risk of:
                        </p>
                        <ul>
                            <li>Ideological polarization</li>
                            <li>Tunnel vision</li>
                            <li>Intellectual arrogance</li>
                            <li>Incomplete analysis</li>
                        </ul>
                    </div>
                </div>
            `,
            visualization: `
                <h2>Interactive Map</h2>
                <div class="controls">
                    <div class="control-group">
                        <label for="preset-dropdown" title="Weight presets alter school positions to show different economic perspectives">Weight Preset:</label>
                        <select id="preset-dropdown">
                            <option value="base" selected>Base (Original)</option>
                            <option value="state-emphasis">State Emphasis</option>
                            <option value="equity-emphasis">Equity Emphasis</option>
                            <option value="market-emphasis">Market Emphasis</option>
                            <option value="growth-emphasis">Growth Emphasis</option>
                            <option value="historical-emphasis">Historical Emphasis</option>
                            <option value="pragmatic-emphasis">Pragmatic Emphasis</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="normalization-dropdown" title="Normalization methods change how values are represented on the map">Normalization Method:</label>
                        <select id="normalization-dropdown">
                            <option value="percentile" selected>Percentile (Uniform Distribution)</option>
                            <option value="zscore">Z-Score (Statistical Centering)</option>
                            <option value="minmax">Min-Max (Full Range)</option>
                            <option value="none">Raw (No Normalization)</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label title="Controls the visibility of historical transitions between schools">Historical Transitions:</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="transition-muy_alta" checked>
                                <span class="checkmark"></span>
                                Very High Confidence
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="transition-alta" checked>
                                <span class="checkmark"></span>
                                High Confidence
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="transition-media" checked>
                                <span class="checkmark"></span>
                                Medium Confidence
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
                <div id="map-container" class="map-container">
                    <div id="loading-indicator" class="loading-indicator" style="display: none;">
                        <div class="spinner"></div>
                        <p>Loading variant...</p>
                    </div>
                </div>
            `,
            cocktails: `
                <h2>Methodological Synergies: Integrated Analytical Frameworks</h2>
                <div class="intro-text">
                    <p>
                        There are good reasons to learn the differences between economic schools,
                        but the idea of exploring nine distinct approaches can still feel overwhelming.
                        It is like being offered nine ice cream flavors when you thought vanilla was the only one.
                        Even curious learners may feel that nine is too much.
                    </p>
                    <p>
                        That is why the thematic guide below proposes "cocktails" or synergies: combinations of two
                        to four schools applied to concrete topics. The hope is that after tasting a few
                        of these cocktails, you will want to explore the whole shelf. And even if you do not,
                        trying one or two flavors is enough to show that there are many ways to think about,
                        practice, and approach economics.
                    </p>
                </div>
                <h3>Analytical Configurations: Recommended Thematic Groupings</h3>
                <div class="tabs-container">
                    <button class="tab-btn active" data-tab="all" tabindex="0">Show All</button>
                    <button class="tab-btn" data-tab="gobernanza" tabindex="0">Governance and State</button>
                    <button class="tab-btn" data-tab="capitalismo" tabindex="0">Capitalism Dynamics</button>
                    <button class="tab-btn" data-tab="sociedad" tabindex="0">Individual and Society</button>
                    <button class="tab-btn" data-tab="sostenibilidad" tabindex="0">Sustainability and Limits</button>
                </div>
                <div class="cocktails-grid">
                    <div class="cocktail-card" data-category="capitalismo"><div class="cocktail-number">1</div><h4>Vitality and visibility of capitalism</h4><p class="cocktail-schools"><strong>Schools:</strong> Classical, Marxist, Schumpeterian, Institutionalist</p></div>
                    <div class="cocktail-card" data-category="gobernanza"><div class="cocktail-number">2</div><h4>Defense of the free market</h4><p class="cocktail-schools"><strong>Schools:</strong> Classical, Austrian, Neoclassical</p></div>
                    <div class="cocktail-card" data-category="sociedad"><div class="cocktail-number">3</div><h4>Conceptualizing the individual</h4><p class="cocktail-schools"><strong>Schools:</strong> Neoclassical, Austrian, Behavioral</p></div>
                    <div class="cocktail-card" data-category="gobernanza"><div class="cocktail-number">4</div><h4>The need for state intervention</h4><p class="cocktail-schools"><strong>Schools:</strong> Neoclassical, Developmentalist, Keynesian</p></div>
                    <div class="cocktail-card" data-category="sociedad"><div class="cocktail-number">5</div><h4>Theories of groups and classes</h4><p class="cocktail-schools"><strong>Schools:</strong> Classical, Marxist, Keynesian, Institutionalist</p></div>
                    <div class="cocktail-card" data-category="sostenibilidad"><div class="cocktail-number">6</div><h4>Economy beyond markets</h4><p class="cocktail-schools"><strong>Schools:</strong> Marxist, Institutionalist, Behavioral</p></div>
                    <div class="cocktail-card" data-category="capitalismo"><div class="cocktail-number">7</div><h4>Complete economic systems</h4><p class="cocktail-schools"><strong>Schools:</strong> Marxist, Developmentalist, Keynesian, Institutionalist</p></div>
                    <div class="cocktail-card" data-category="capitalismo"><div class="cocktail-number">8</div><h4>Technological development and productivity</h4><p class="cocktail-schools"><strong>Schools:</strong> Classical, Marxist, Developmentalist, Schumpeterian</p></div>
                    <div class="cocktail-card" data-category="sociedad"><div class="cocktail-number">9</div><h4>Interaction between individuals and society</h4><p class="cocktail-schools"><strong>Schools:</strong> Austrian, Neoclassical, Institutionalist, Behavioral</p></div>
                    <div class="cocktail-card" data-category="capitalismo"><div class="cocktail-number">10</div><h4>Corporations and how they work</h4><p class="cocktail-schools"><strong>Schools:</strong> Schumpeterian, Institutionalist, Behavioral</p></div>
                    <div class="cocktail-card" data-category="gobernanza"><div class="cocktail-number">11</div><h4>Unemployment and recession</h4><p class="cocktail-schools"><strong>Schools:</strong> Classical, Keynesian</p></div>
                    <div class="cocktail-card" data-category="sociedad"><div class="cocktail-number">12</div><h4>Care economy and gender inequality</h4><p class="cocktail-schools"><strong>Schools:</strong> Feminist, Marxist, Keynesian, Behavioral</p></div>
                    <div class="cocktail-card" data-category="sostenibilidad"><div class="cocktail-number">13</div><h4>Sustainability and planetary boundaries</h4><p class="cocktail-schools"><strong>Schools:</strong> Ecological, Developmentalist, Keynesian, Institutionalist</p></div>
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
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1979</div><h4>Kahneman and Tversky: Behavioral Economics</h4><p>Prospect Theory, cognitive biases, and bounded rationality</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1980s</div><h4>The Neoliberal Revolution</h4><p>Consolidation of market-centered thought under Reagan and Thatcher</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1980s</div><h4>Feminist Economics</h4><p>Integration of gender into economic analysis</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">1990s</div><h4>Renewed Focus on Institutions</h4><p>Recognition of the importance of institutions in development</p></div>
                    <div class="timeline-item" data-category="era-contemporanea"><div class="timeline-year">2011</div><h4>Kate Raworth and Ecological Economics</h4><p>Doughnut Economics, planetary boundaries, and social floors</p></div>
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
                <h2>Analytical Interpretation Guide: Limits, Layers, and Trajectories</h2>
                <div class="intro-text">
                    <p>
                        This map places economic schools on two axes so that very different ideas can be compared.
                        That simplification is useful for learning, but it also means the visualization compresses
                        much broader debates into a single image.
                    </p>
                    <p>
                        That is why a complementary reading helps: some frameworks do not need a new node.
                        They need an explicit explanation of the <strong>limits, layers, and trajectories</strong>
                        that shape the space represented by the map.
                    </p>
                </div>
                <h3>Pedagogical Keys for Deepening Analysis</h3>
                <div class="principles-grid">
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>1. Distinguish nodes, layers, and trajectories</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>Key idea:</em> <strong>Nodes</strong> are schools that propose both a way to organize the economy and a main goal.</p>
                                <p><strong>Layers</strong> cut across the whole map and condition it, while <strong>trajectories</strong> remind us that ideas change over time and that movement between positions is never automatic.</p>
                            </div>
                        </div>
                    </div>
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>2. Not every part of the plane is equally feasible</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>Feasible region:</em> The map shows conceptual possibilities, but real economies are also constrained by resources, energy, institutions, and ecological limits.</p>
                                <p>Readings such as <strong>Kate Raworth</strong>, <strong>Nicholas Georgescu-Roegen</strong>, and <strong>Herman Daly</strong> help explain that every proposal operates between a social floor and a biophysical ceiling.</p>
                            </div>
                        </div>
                    </div>
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>3. Why some perspectives do not appear as nodes</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>Quick rule:</em> If a theory does not define both a coordination mechanism and a final goal, it works better here as complementary reading than as a school placed on the plane.</p>
                                <p>That is why <strong>complexity</strong>, <strong>systems dynamics</strong>, or the <strong>biophysical approach</strong> do not compete with the schools in the map. They help interpret the borders, constraints, and stability zones of those schools.</p>
                            </div>
                        </div>
                    </div>
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>4. Suggested readings to broaden the frame</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><strong>Donella Meadows</strong> helps readers think about delays, accumulations, and unintended effects in complex systems.</p>
                                <p><strong>Brian Arthur</strong> and <strong>Doyne Farmer</strong> show how networks, uncertainty, and path dependence reshape the reading of economic development.</p>
                                <p><strong>Charles Hall</strong> reminds us that energy availability also constrains what an economy can sustain over time.</p>
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
                <h2>Epistemological Epilogue: The Value of Methodological Pluralism</h2>
                <div class="intro-text">
                    <p>
                        The real value of this map does not lie in memorizing the position of each school,
                        but in understanding that <strong>there is no single economic truth</strong>. Each school
                        offers a different lens for reading reality, and each contributes something valuable.
                    </p>
                    <p>
                        As philosopher <strong>John Stuart Mill</strong> wrote: <em>"He who knows only his own side of the case knows little of that"</em>.
                        In economics this is especially true. Better policies and decisions emerge when we consider
                        multiple perspectives, not when we cling dogmatically to one school.
                    </p>
                </div>
                <h3>Foundational Principles for Rigorous Study</h3>
                <div class="principles-grid">
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>1. Intellectual Humility</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>"The only true wisdom is in knowing you know nothing"</em> - Socrates</p><p>Recognize that no school has every answer. Stay open to new ideas and be willing to revise your views when evidence demands it.</p>
                            </div>
                        </div>
                    </div>
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>2. Analytical Rigor</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>"Doubt everything at least once, even that two plus two makes four"</em> - Georg Lichtenberg</p><p>Examine each school's assumptions critically. Ask what evidence supports it, where it works best, and what its limits are.</p>
                            </div>
                        </div>
                    </div>
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>3. Contextual Thinking</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>"There is nothing so practical as a good theory"</em> - Kurt Lewin</p><p>Economic theories do not exist in a vacuum. Consider historical, institutional, and cultural context when applying ideas from different schools.</p>
                            </div>
                        </div>
                    </div>
                    <div class="principle-card accordion-card">
                        <button class="accordion-trigger" aria-expanded="false" tabindex="0">
                            <h4>4. Creative Synthesis</h4>
                            <span class="accordion-icon"></span>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-body-inner">
                                <p><em>"Truth is a pathless land"</em> - Jiddu Krishnamurti</p><p>Do not limit yourself to choosing one school. Learn to combine insights from multiple traditions to build a more nuanced understanding of the economy.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="final-message">
                    <h3>Your Research Trajectory</h3>
                    <p>This map is only the beginning. You are invited to:</p>
                    <ul>
                        <li><strong>Explore</strong> the original sources of each school</li>
                        <li><strong>Question</strong> your own assumptions and biases</li>
                        <li><strong>Engage</strong> with people who think differently</li>
                        <li><strong>Apply</strong> multiple perspectives to real problems</li>
                        <li><strong>Contribute</strong> to economic debate with rigor and openness</li>
                    </ul>
                    <p class="final-quote">
                        "The purpose of education is to replace an empty mind with an open one" - Malcolm Forbes
                    </p>
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
