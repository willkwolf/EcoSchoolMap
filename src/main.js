/**
 * Main Entry Point - Mapa de Escuelas Económicas D3.js
 * Versión 1.0 - Migración desde Plotly
 */

import './styles/main.scss';
import * as d3 from 'd3';
import { gsap } from 'gsap';

// Import components (to be created)
// import { D3MapRenderer } from './components/D3MapRenderer.js';
// import { TooltipManager } from './components/TooltipManager.js';
// import { ScrollController } from './scrollytelling/ScrollController.js';
// import { loadVariant, loadBaseData } from './data/loader.js';

console.log('🚀 Mapa de Escuelas Económicas - D3.js Version');
console.log('D3 version:', d3.version);
console.log('GSAP version:', gsap.version);

// Initialize app
async function init() {
    console.log('Initializing app...');

    // TODO: Load base data
    // const baseData = await loadBaseData();
    // console.log('Base data loaded:', baseData);

    // TODO: Initialize D3 renderer
    // const mapRenderer = new D3MapRenderer('#map-container', baseData);

    // TODO: Setup variant selectors
    // setupVariantControls(mapRenderer);

    // TODO: Initialize scrollytelling
    // const scrollController = new ScrollController(mapRenderer);

    console.log('App initialized successfully');
}

// Setup variant controls
function setupVariantControls(mapRenderer) {
    const presetDropdown = document.getElementById('preset-dropdown');
    const normalizationDropdown = document.getElementById('normalization-dropdown');

    const loadVariant = async () => {
        const preset = presetDropdown.value;
        const normalization = normalizationDropdown.value;

        console.log(`Loading variant: ${preset}-${normalization}`);

        // TODO: Load and render variant
        // const variantData = await loadVariant(preset, normalization);
        // mapRenderer.updateVariant(variantData);
    };

    presetDropdown.addEventListener('change', loadVariant);
    normalizationDropdown.addEventListener('change', loadVariant);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
