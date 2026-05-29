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
import { InteractiveUIManager } from './components/InteractiveUIManager.js';
import {
    applyLocalizedContent,
    getCurrentLocale,
    getSections,
    initializeLocale,
    onLocaleChange,
    setLocale,
    t
} from './i18n/index.js';

console.log('🚀 Mapa de Escuelas Económicas - D3.js Version');

let mapRenderer = null;
let baseData = null;
let scrollController = null;
let isLoadingVariant = false;
let localeListenerRegistered = false;

// Initialize app
async function init() {
    console.log('Initializing app...');

    try {
        // Load initial variant data (base-percentile) with calculated positions
        baseData = await loadVariantData('base', 'percentile');
        console.log('Initial data loaded:', baseData);

        // Initialize D3 renderer
        mapRenderer = new D3MapRenderer('#map-container', baseData, {
            locale: getCurrentLocale()
        });
        mapRenderer.render();

        // Setup variant selectors
        setupVariantControls();

        // Initialize scrollytelling
        scrollController = new ScrollController(getSections(), {
            navAriaLabel: t('scroll.navAriaLabel')
        });

        // Initialize UI manager for interactive tabs and accordions
        new InteractiveUIManager();

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

    // Collision toggle
    const collisionToggle = document.getElementById('collision-toggle');

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
                    pElement.textContent = t('ui.loadingVariant');
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
                    errorText.textContent = t('ui.loadingError');
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

    // Collision toggle event listener
    collisionToggle.addEventListener('change', () => {
        const enabled = collisionToggle.checked;
        mapRenderer.setCollisionEnabled(enabled);
        updateCollisionToggleLabel(enabled);

        console.log(`Collision forces ${enabled ? 'enabled' : 'disabled'}`);
    });

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
            const filename = `${t('ui.downloadFilenamePrefix')}-${preset}-${normalization}.png`;

            saveSvgAsPng(svg, filename, {
                scale: 2,
                backgroundColor: 'white'
            });
            console.log(`✅ Downloaded: ${filename}`);
        }
    });
}

function updateCollisionToggleLabel(enabled) {
    const labelText = document.querySelector('.checkbox-label-text');
    if (labelText) {
        labelText.textContent = enabled ? t('ui.collisionEnabled') : t('ui.collisionDisabled');
    }
}

function bindLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (!languageSelector) {
        return;
    }

    languageSelector.value = getCurrentLocale();
    languageSelector.addEventListener('change', (event) => {
        setLocale(event.target.value);
    });
}

function cleanupApp() {
    if (scrollController) {
        scrollController.destroy();
        scrollController = null;
    }

    if (mapRenderer?.tooltipManager) {
        mapRenderer.tooltipManager.destroy();
    }

    mapRenderer = null;
}

async function bootstrapApp() {
    cleanupApp();
    applyLocalizedContent(getCurrentLocale());
    bindLanguageSelector();
    await init();
}

function registerLocaleListener() {
    if (localeListenerRegistered) {
        return;
    }

    onLocaleChange(() => {
        bootstrapApp();
    });
    localeListenerRegistered = true;
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeLocale();
        registerLocaleListener();
        bootstrapApp();
    });
} else {
    initializeLocale();
    registerLocaleListener();
    bootstrapApp();
}
