/**
 * Main Entry Point - Mapa de Escuelas Económicas D3.js
 * Versión 1.0 - Migración desde Plotly
 */

import './styles/main.scss';
import * as d3 from 'd3';
import { gsap } from 'gsap';

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

    const loadAndUpdateVariant = async () => {
        const preset = presetDropdown.value;
        const normalization = normalizationDropdown.value;

        console.log(`Loading variant: ${preset}-${normalization}`);

        try {
            const variantData = await loadVariant(preset, normalization);
            const mergedData = mergeVariantWithBase(variantData, baseData);
            mapRenderer.updateVariant(mergedData);
        } catch (error) {
            console.error('Error loading variant:', error);
        }
    };

    presetDropdown.addEventListener('change', loadAndUpdateVariant);
    normalizationDropdown.addEventListener('change', loadAndUpdateVariant);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
