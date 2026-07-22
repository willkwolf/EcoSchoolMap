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
        // Read URL params if available (Deep Linking)
        const { preset, normalization } = restoreFromUrlParams();

        // Load initial variant data with calculated positions
        baseData = await loadVariantData(preset, normalization);
        console.log('Initial data loaded:', baseData);

        // Initialize D3 renderer
        mapRenderer = new D3MapRenderer('#map-container', baseData, {
            locale: getCurrentLocale()
        });
        mapRenderer.render();
        mapRenderer.updateExplorationCounterUI();

        // Setup variant selectors & deep linking
        setupVariantControls();

        // Setup Phase 2 & 3 Interactive Features
        setupViewToggle();
        setupGuidedTour();
        setupGlossaryPopovers();
        setupHeroScrollButton();

        // Initialize scrollytelling
        scrollController = new ScrollController(getSections(), {
            navAriaLabel: t('scroll.navAriaLabel')
        });

        // Initialize UI manager for interactive tabs and accordions
        new InteractiveUIManager();

        console.log('✅ App initialized successfully with Phase 2 & 3 features');
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
    const toggleControlsBtn = document.getElementById('toggle-controls-btn');
    const controlsContainer = document.getElementById('map-controls');

    // Mobile Controls Drawer Toggle
    if (toggleControlsBtn && controlsContainer) {
        toggleControlsBtn.addEventListener('click', () => {
            const isOpen = controlsContainer.classList.toggle('is-open');
            toggleControlsBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            const toggleText = toggleControlsBtn.querySelector('.toggle-text');
            if (toggleText) {
                toggleText.textContent = isOpen ? t('ui.toggleControlsHide') : t('ui.toggleControlsShow');
            }
        });
    }

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

            // Sync URL search params for deep linking & sharing
            syncUrlParams(preset, normalization);

            // If table view is active, update table content
            if (document.getElementById('btn-view-table')?.classList.contains('active')) {
                mapRenderer.renderDataTable('#map-table-container');
            }

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

// ============================================================
// Phase 2 & 3 Helper Functions (View Toggle, Tour, Glossary, URL Sync)
// ============================================================

function setupViewToggle() {
    const btnMap = document.getElementById('btn-view-map');
    const btnTable = document.getElementById('btn-view-table');
    const mapContainer = document.getElementById('map-container');
    const tableContainer = document.getElementById('map-table-container');

    if (!btnMap || !btnTable || !mapContainer || !tableContainer) return;

    btnMap.addEventListener('click', () => {
        btnMap.classList.add('active');
        btnMap.setAttribute('aria-selected', 'true');
        btnTable.classList.remove('active');
        btnTable.setAttribute('aria-selected', 'false');

        mapContainer.style.display = 'block';
        tableContainer.style.display = 'none';
    });

    btnTable.addEventListener('click', () => {
        btnTable.classList.add('active');
        btnTable.setAttribute('aria-selected', 'true');
        btnMap.classList.remove('active');
        btnMap.setAttribute('aria-selected', 'false');

        mapContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        if (mapRenderer) {
            mapRenderer.renderDataTable('#map-table-container');
        }
    });
}

let tourTimer = null;
function setupGuidedTour() {
    const startTourBtn = document.getElementById('start-guided-tour-btn');
    if (!startTourBtn) return;

    const tourSchools = ['clasica', 'marxista', 'keynesiana', 'neoclasica', 'ecologica', 'schumpeteriana'];

    startTourBtn.addEventListener('click', () => {
        if (!mapRenderer) return;

        if (startTourBtn.classList.contains('is-touring')) {
            clearTimeout(tourTimer);
            startTourBtn.classList.remove('is-touring');
            startTourBtn.querySelector('span').textContent = t('ui.startTour');
            mapRenderer.resetZoom();
            return;
        }

        startTourBtn.classList.add('is-touring');
        startTourBtn.querySelector('span').textContent = t('ui.tourRunning');

        let step = 0;
        const runStep = () => {
            if (step >= tourSchools.length) {
                startTourBtn.classList.remove('is-touring');
                startTourBtn.querySelector('span').textContent = t('ui.startTour');
                mapRenderer.resetZoom();
                return;
            }

            const schoolId = tourSchools[step];
            mapRenderer.focusSchoolNode(schoolId);

            const nodeData = mapRenderer.data.nodos.find(n => n.id === schoolId);
            if (nodeData && mapRenderer.tooltipManager) {
                mapRenderer.recordVisitedSchool(schoolId);
            }

            step++;
            tourTimer = setTimeout(runStep, 3200);
        };

        runStep();
    });
}

function setupGlossaryPopovers() {
    const terms = document.querySelectorAll('.glossary-term');
    let popover = null;

    terms.forEach(el => {
        const termKey = el.dataset.term;
        const text = t(`glossary.${termKey}`);
        if (!text) return;

        const show = (event) => {
            if (popover) popover.remove();
            popover = document.createElement('div');
            popover.className = 'glossary-popover';
            popover.innerHTML = `<strong>${el.textContent}</strong>${text}`;
            document.body.appendChild(popover);

            const rect = el.getBoundingClientRect();
            popover.style.top = `${window.scrollY + rect.bottom + 8}px`;
            popover.style.left = `${Math.max(10, Math.min(rect.left, window.innerWidth - 330))}px`;
        };

        const hide = () => {
            if (popover) {
                popover.remove();
                popover = null;
            }
        };

        el.addEventListener('mouseenter', show);
        el.addEventListener('mouseleave', hide);
        el.addEventListener('focus', show);
        el.addEventListener('blur', hide);
    });
}

function syncUrlParams(preset, normalization) {
    try {
        const url = new URL(window.location);
        url.searchParams.set('preset', preset);
        url.searchParams.set('norm', normalization);
        window.history.replaceState({}, '', url);
    } catch (e) {
        console.warn('Could not sync URL params:', e);
    }
}

function restoreFromUrlParams() {
    try {
        const params = new URLSearchParams(window.location.search);
        const preset = params.get('preset');
        const norm = params.get('norm');

        if (preset) {
            const dropdown = document.getElementById('preset-dropdown');
            if (dropdown) dropdown.value = preset;
        }
        if (norm) {
            const dropdown = document.getElementById('normalization-dropdown');
            if (dropdown) dropdown.value = norm;
        }
        return { preset: preset || 'base', normalization: norm || 'percentile' };
    } catch (e) {
        return { preset: 'base', normalization: 'percentile' };
    }
}

function setupHeroScrollButton() {
    const heroScrollBtn = document.getElementById('hero-scroll-btn');
    if (!heroScrollBtn) return;

    heroScrollBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (scrollController) {
            scrollController.scrollToSection('guide');
        } else {
            const guideElement = document.getElementById('guide');
            if (guideElement) {
                guideElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}
