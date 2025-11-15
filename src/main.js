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
// import { TooltipManager } from './components/TooltipManager.js';
// import { ScrollController } from './scrollytelling/ScrollController.js';
import { loadVariant, loadBaseData, mergeVariantWithBase } from './data/loader.js';

console.log('🚀 Mapa de Escuelas Económicas - D3.js Version');
console.log('D3 version:', d3.version);
console.log('GSAP version:', gsap.version);

let mapRenderer = null;
let baseData = null;

// Initialize app
async function init() {
    console.log('Initializing app...');

    try {
        // Load base data
        baseData = await loadBaseData();
        console.log('Base data loaded:', baseData);

        // Load initial variant (base-percentile)
        const initialVariant = await loadVariant('base', 'percentile');
        const mergedData = mergeVariantWithBase(initialVariant, baseData);

        // Initialize D3 renderer
        mapRenderer = new D3MapRenderer('#map-container', mergedData);
        mapRenderer.render();

        // Setup variant selectors
        setupVariantControls();

        // TODO: Initialize scrollytelling
        // const scrollController = new ScrollController(mapRenderer);

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

    const loadAndUpdateVariant = async () => {
        const preset = presetDropdown.value;
        const normalization = normalizationDropdown.value;

        console.log(`Loading variant: ${preset}-${normalization}`);

        try {
            // Disable controls during transition
            presetDropdown.disabled = true;
            normalizationDropdown.disabled = true;

            // Show loading indicator
            loadingIndicator.style.display = 'block';

            const variantData = await loadVariant(preset, normalization);
            const mergedData = mergeVariantWithBase(variantData, baseData);
            mapRenderer.updateVariant(mergedData);

            // Re-enable controls and hide indicator after transition completes
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                presetDropdown.disabled = false;
                normalizationDropdown.disabled = false;
            }, 900);
        } catch (error) {
            console.error('Error loading variant:', error);
            loadingIndicator.style.display = 'none';
            presetDropdown.disabled = false;
            normalizationDropdown.disabled = false;
        }
    };

    presetDropdown.addEventListener('change', loadAndUpdateVariant);
    normalizationDropdown.addEventListener('change', loadAndUpdateVariant);

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
