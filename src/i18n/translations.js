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
            'map-reading-guide': 'Guía para leer el mapa',
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
            notAvailable: 'N/D'
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
            'map-reading-guide': 'Map Reading Guide',
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
            notAvailable: 'N/A'
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
                <h2>Reading Guide: How to Interpret the Map</h2>
                <div class="guide-grid">
                    <div class="guide-card">
                        <h3>Map Axes</h3>
                        <p><strong>How is it organized? (Horizontal Axis X):</strong></p>
                        <ul>
                            <li>← Left: Limited State (Trust in the Free Market)</li>
                            <li>→ Right: Strong State (Planning and State Control)</li>
                        </ul>
                        <p><strong>What is prioritized? (Vertical Axis Y):</strong></p>
                        <ul>
                            <li>↑ Top: Equity and Sustainability (better distribution and nature protection)</li>
                            <li>↓ Bottom: Growth and Productivity (producing more and accumulating capital)</li>
                        </ul>
                        <p class="axis-subtext">Okun's Balance: The trade-off between producing more (efficiency) and sharing better (equity)</p>
                    </div>
                    <div class="guide-card">
                        <h3>Map Zones (Quadrants)</h3>
                        <p>The map is divided into 4 main zones or quadrants:</p>
                        <ul>
                            <li><strong>Q1 (Market + Equity):</strong> The market operates freely, but with a focus on social justice and ecological care.</li>
                            <li><strong>Q2 (State + Equity):</strong> The government directs the economy seeking equality and protecting the planet.</li>
                            <li><strong>Q3 (Market + Growth):</strong> The market operates without barriers, focusing on producing more wealth.</li>
                            <li><strong>Q4 (State + Growth):</strong> The government intervenes to accelerate industrialization and national production.</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>Historical Transitions</h3>
                        <p>The arrows represent historical shifts and jumps in theory:</p>
                        <ul>
                            <li><strong>Solid line:</strong> High historical certainty (very clear sources)</li>
                            <li><strong>Dotted line:</strong> Medium certainty</li>
                            <li><strong>Dashed line:</strong> Low certainty</li>
                        </ul>
                        <p>Each path includes its trigger event and year.</p>
                    </div>
                    <div class="guide-card">
                        <h3>Lenses of Analysis (Presets)</h3>
                        <p>Different perspectives shift the positions of the schools on the map:</p>
                        <ul>
                            <li><strong>Base:</strong> Balanced (Academic)</li>
                            <li><strong>State Emphasis:</strong> State Emphasis (prioritizes the role of government)</li>
                            <li><strong>Equity Emphasis:</strong> Equity Emphasis (prioritizes fair sharing)</li>
                            <li><strong>Market Emphasis:</strong> Market Emphasis (prioritizes free exchange)</li>
                            <li><strong>Growth Emphasis:</strong> Growth Emphasis (prioritizes production)</li>
                            <li><strong>Historical Emphasis:</strong> Historical Emphasis (prioritizes time evolution)</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>Scientific Foundation</h3>
                        <p>Based on Chapter 4 of <strong>Economics: The User's Guide</strong> by <strong>Ha-Joon Chang</strong> (2015):</p>
                        <ul>
                            <li>Multidimensional analysis of economic schools</li>
                            <li>Qualitative positioning translated into comparable values</li>
                            <li>Percentile and statistical normalization</li>
                            <li>Interactive pedagogical visualization</li>
                        </ul>
                    </div>
                    <div class="guide-card">
                        <h3>The danger of using a single lens</h3>
                        <p class="caution-highlight">
                            Mapping problems using only one school of economics can cause:
                        </p>
                        <ul>
                            <li><strong>Polarization:</strong> Believing economics is a debate of good vs. bad.</li>
                            <li><strong>Tunnel vision:</strong> Seeing only one part of the problem and ignoring the rest.</li>
                            <li><strong>Intellectual arrogance:</strong> Thinking your school has the only right answer.</li>
                            <li><strong>Incomplete answers:</strong> Designing solutions that fail because they ignore other factors.</li>
                        </ul>
                    </div>
                </div>
            `,
            visualization: `
                <h2>Interactive Map</h2>
                <div class="controls">
                    <div class="control-group">
                        <label for="preset-dropdown" title="Lenses of analysis alter school positions to show different economic perspectives">Lenses of Analysis (Presets):</label>
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
                  <div id="map-container" class="map-container">
                      <div id="loading-indicator" class="loading-indicator" style="display: none;">
                          <div class="spinner"></div>
                          <p>Loading variant...</p>
                      </div>
                  </div>
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
                <h2>Map Reading Guide: Limits, Layers, and Paths (Interpretation)</h2>
                <div class="intro-text">
                    <p>
                        This map places economic schools on two axes so that very different ideas can be compared. That simplification is useful for learning, but it also compresses much broader debates into a single image.
                    </p>
                    <p>
                        That is why a complementary guide helps: some important theories do not need a new point on the map, but rather an explanation of the <strong>limits, layers, and paths (trajectories)</strong> that shape the economic space.
                    </p>
                </div>
                <h3>Pedagogical Keys for Deepening Analysis</h3>
                <div class="principles-grid">
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">01</span>
                            <h4>Beyond points: the map has layers and paths</h4>
                        </div>
                        <div class="card-body">
                            <p><em>Key idea:</em> The schools are the main <strong>points (nodes)</strong>. But there are also <strong>layers</strong> (topics that cross the entire map, like gender or complexity) and <strong>paths (trajectories)</strong> that show how ideas change over time and influence each other.</p>
                        </div>
                    </div>
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">02</span>
                            <h4>The map vs. reality (What is feasible?)</h4>
                        </div>
                        <div class="card-body">
                            <p><em>Physical limits:</em> The map shows ideas on paper, but in the real world every economy is constrained by biophysical resources like energy, water, and ecosystems. <strong>Ecological Economics</strong>, conceptually founded on <strong>Nicholas Georgescu-Roegen\'s</strong> entropy law, institutionalized by <strong>Herman Daly</strong> (Steady-State economy) and <strong>Robert Costanza</strong> (ecosystem services valuation), and modernized by <strong>Kate Raworth\'s Doughnut Economics</strong>, explains that human activity must operate within a safe space between a <strong>social floor</strong> of well-being and a <strong>planetary ceiling</strong>.</p>
                        </div>
                    </div>
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">03</span>
                            <h4>Why some perspectives do not have their own point</h4>
                        </div>
                        <div class="card-body">
                            <p><em>Rule of thumb:</em> To have a point on this map, a theory must answer two questions: how is the economy organized? and what is its goal? Frameworks like <strong>complexity theory</strong> or the <strong>biophysical approach</strong> do not compete with the schools, but help us understand the boundaries and rules of the map.</p>
                        </div>
                    </div>
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">04</span>
                            <h4>Suggested readings to broaden your frame</h4>
                        </div>
                        <div class="card-body">
                            <p><strong>Donella Meadows</strong> will teach you how complex systems work and why responses can be delayed. <strong>Brian Arthur</strong> explains how networks and uncertainty shape development. <strong>Charles Hall</strong> reminds us that without net energy, no economic system can sustain itself over time.</p>
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
                <h2>Conclusion: Why Use Different Lenses? (Methodological Pluralism)</h2>
                <div class="intro-text">
                    <p>
                        The true value of this map does not lie in memorizing the position of each school, but in understanding that <strong>there is no single absolute truth in economics</strong>. Each school offers a different lens to look at reality, and each contributes valuable tools.
                    </p>
                    <p>
                        As philosopher <strong>John Stuart Mill</strong> wrote: <em>"He who knows only his own side of the case knows little of that"</em>. In economics, this is especially true. Better decisions and policies emerge when we consider multiple perspectives, rather than clinging dogmatically to one single school.
                    </p>
                </div>
                <h3>Principles for Clear Thinking</h3>
                <div class="principles-grid">
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">01</span>
                            <h4>Open Mind (Intellectual Humility)</h4>
                        </div>
                        <div class="card-body">
                            <blockquote>"True wisdom is in recognizing one's own ignorance" <cite>— Socrates</cite></blockquote>
                            <p>No school of economics has all the answers for every country or era. Stay curious and be willing to learn from different approaches.</p>
                        </div>
                    </div>
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">02</span>
                            <h4>Think with Evidence (Analytical Rigor)</h4>
                        </div>
                        <div class="card-body">
                            <blockquote>"Doubt everything at least once, even whether two plus two makes four" <cite>— Georg Lichtenberg</cite></blockquote>
                            <p>Examine the assumptions of each school critically. Ask: under what conditions does this theory work best? what data supports it? and where does it fail?</p>
                        </div>
                    </div>
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">03</span>
                            <h4>Look at the Setting (Contextual Thinking)</h4>
                        </div>
                        <div class="card-body">
                            <blockquote>"There is nothing so practical as a good theory" <cite>— Kurt Lewin</cite></blockquote>
                            <p>Economic theories do not float in a vacuum; they are born in specific historical moments. Consider the customs and history of a place before applying a rigid formula.</p>
                        </div>
                    </div>
                    <div class="principle-card">
                        <div class="card-header">
                            <span class="card-number">04</span>
                            <h4>Create New Ideas (Creative Synthesis)</h4>
                        </div>
                        <div class="card-body">
                            <blockquote>"Truth is a pathless land" <cite>— Jiddu Krishnamurti</cite></blockquote>
                            <p>Do not force yourself to pick a single side. Learn to take the best insights from multiple schools to build more complete and useful answers.</p>
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
