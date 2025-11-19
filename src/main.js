/**
 * Main Entry Point - Mapa de Escuelas Económicas D3.js
 * Versión 1.0 - Migración desde Plotly
 */

import './styles/main.scss';
import * as d3 from 'd3';
import { gsap } from 'gsap';
import { saveSvgAsPng } from 'save-svg-as-png';

// Import components
import { D3MapRenderer } from './components/D3MapRenderer.js';
import { ScrollController } from './scrollytelling/ScrollController.js';
import { loadVariantData } from './data/loader.js';

console.log('🚀 Mapa de Escuelas Económicas - D3.js Version');

let mapRenderer = null;
let baseData = null;
let scrollController = null;
let isLoadingVariant = false;

// Define sections for scrollytelling
const sections = [
    { id: 'hero', name: 'Introducción' },
    { id: 'guide', name: 'Guía de Lectura' },
    { id: 'timeline', name: 'Línea de Tiempo' },
    { id: 'cocktails', name: 'Cocteles Temáticos' },
    { id: 'visualization', name: 'Mapa Interactivo' },
    { id: 'learning-path', name: 'Ruta de Aprendizaje' },
    { id: 'applications', name: 'Aplicaciones Prácticas' },
    { id: 'pedagogical-legend', name: 'Leyenda Pedagógica' }
];

// Initialize app
async function init() {
    console.log('Initializing app...');

    try {
        // Load initial variant data (base-none) with calculated positions
        baseData = await loadVariantData('base', 'none');
        console.log('Initial data loaded:', baseData);

        // Initialize D3 renderer
        mapRenderer = new D3MapRenderer('#map-container', baseData);
        mapRenderer.render();

        // Setup variant selectors
        setupVariantControls();

        // Initialize scrollytelling
        scrollController = new ScrollController(sections);

        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

// Setup variant controls
function setupVariantControls() {
    const presetDropdown = document.getElementById('preset-dropdown');
    const normalizationDropdown = document.getElementById('normalization-dropdown');
    const resetZoomBtn = document.getElementById('reset-zoom-btn');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Transition checkboxes
    const transitionCheckboxes = [
        document.getElementById('transition-muy_alta'),
        document.getElementById('transition-alta'),
        document.getElementById('transition-media')
    ];
    const selectAllBtn = document.getElementById('select-all-transitions');
    const deselectAllBtn = document.getElementById('deselect-all-transitions');

    const loadAndUpdateVariant = async () => {
        if (isLoadingVariant) {
            return; // Prevent multiple simultaneous loads
        }

        const preset = presetDropdown.value;
        const normalization = normalizationDropdown.value;

        console.log(`Loading variant: ${preset}-${normalization}`);

        isLoadingVariant = true;

        try {
            // Show loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
                loadingIndicator.style.color = '';
                const pElement = loadingIndicator.querySelector('p');
                if (pElement) {
                    pElement.textContent = 'Cargando variante...';
                }
            }

            // Load variant data with calculated positions
            const mergedData = await loadVariantData(preset, normalization);

            // Update map (triggers 800ms D3 transition)
            mapRenderer.updateVariant(mergedData);

            // Wait for D3 transition to complete (800ms)
            await new Promise(resolve => setTimeout(resolve, 850));

            // Hide indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        } catch (error) {
            console.error('❌ Error loading variant:', error);

            // Show error message to user
            if (loadingIndicator) {
                const errorText = loadingIndicator.querySelector('p');
                if (errorText) {
                    errorText.textContent = 'Error al cargar variante. Intenta de nuevo.';
                    errorText.style.color = '#e74c3c';
                }
                const spinner = loadingIndicator.querySelector('.spinner');
                if (spinner) {
                    spinner.style.display = 'none';
                }
            }

            // Hide error after 3 seconds
            setTimeout(() => {
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                    const spinner = loadingIndicator.querySelector('.spinner');
                    if (spinner) {
                        spinner.style.display = 'block';
                    }
                    const errorText = loadingIndicator.querySelector('p');
                    if (errorText) {
                        errorText.style.color = '';
                    }
                }
            }, 3000);
        } finally {
            isLoadingVariant = false;
        }
    };

    presetDropdown.addEventListener('change', loadAndUpdateVariant);
    normalizationDropdown.addEventListener('change', loadAndUpdateVariant);

    // Transitions visibility control with checkboxes
    const updateTransitionVisibility = () => {
        const selectedConfidences = transitionCheckboxes
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id.replace('transition-', ''));

        mapRenderer.setTransitionVisibility(selectedConfidences);
    };

    // Add event listeners for checkboxes
    transitionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTransitionVisibility);
    });

    // Select all button
    selectAllBtn.addEventListener('click', () => {
        transitionCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        updateTransitionVisibility();
    });

    // Deselect all button
    deselectAllBtn.addEventListener('click', () => {
        transitionCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateTransitionVisibility();
    });

    // Reset zoom button
    resetZoomBtn.addEventListener('click', () => {
        mapRenderer.resetZoom();
    });

    // Download PNG button
    downloadPngBtn.addEventListener('click', () => {
        const svg = document.querySelector('#map-container svg');
        if (svg) {
            const preset = presetDropdown.value;
            const normalization = normalizationDropdown.value;
            const filename = `mapa-escuelas-${preset}-${normalization}.png`;

            saveSvgAsPng(svg, filename, {
                scale: 2,
                backgroundColor: 'white'
            });
            console.log(`✅ Downloaded: ${filename}`);
        }
    });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
