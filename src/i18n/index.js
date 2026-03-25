import { translations } from './translations.js';
import { dataTranslations } from './dataTranslations.js';

const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'eco-school-map-locale';
const SUPPORTED_LOCALES = ['es', 'en'];
const listeners = new Set();
const originalContent = new Map();

const contentTargets = [
    '#hero .hero-content',
    '#guide .guide-container',
    '#visualization .vis-container',
    '#cocktails .cocktails-container',
    '#timeline .timeline-container',
    '#learning-path .learning-path-container',
    '#map-reading-guide .pedagogical-legend',
    '#applications .applications-container',
    '#pedagogical-legend .pedagogical-legend',
    '.footer .footer-content'
];

let currentLocale = DEFAULT_LOCALE;

function interpolate(template, params = {}) {
    return Object.entries(params).reduce(
        (result, [key, value]) => result.replaceAll(`{${key}}`, value),
        template
    );
}

function getNestedValue(object, key) {
    return key.split('.').reduce((value, part) => value?.[part], object);
}

export function normalizeLocale(locale) {
    if (!locale || typeof locale !== 'string') {
        return null;
    }

    const normalized = locale.toLowerCase().trim();

    if (normalized.startsWith('es')) {
        return 'es';
    }

    if (normalized.startsWith('en')) {
        return 'en';
    }

    return null;
}

export function getCurrentLocale() {
    return currentLocale;
}

export function getTranslations(locale = currentLocale) {
    return translations[locale] || translations[DEFAULT_LOCALE];
}

export function t(key, params = {}, locale = currentLocale) {
    const value = getNestedValue(getTranslations(locale), key);

    if (typeof value !== 'string') {
        return key;
    }

    return interpolate(value, params);
}

export function detectPreferredLocale() {
    const url = new URL(window.location.href);
    const urlLocale = normalizeLocale(url.searchParams.get('lang'));
    if (urlLocale) {
        return urlLocale;
    }

    const storedLocale = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (storedLocale) {
        return storedLocale;
    }

    const browserLocales = navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

    for (const locale of browserLocales) {
        const normalized = normalizeLocale(locale);
        if (normalized) {
            return normalized;
        }
    }

    return DEFAULT_LOCALE;
}

export function initializeLocale() {
    currentLocale = detectPreferredLocale();
    window.localStorage.setItem(STORAGE_KEY, currentLocale);
    return currentLocale;
}

export function onLocaleChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

export function setLocale(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized || !SUPPORTED_LOCALES.includes(normalized) || normalized === currentLocale) {
        return;
    }

    currentLocale = normalized;
    window.localStorage.setItem(STORAGE_KEY, currentLocale);

    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLocale);
    window.history.replaceState({}, '', url);

    listeners.forEach(listener => listener(currentLocale));
}

export function applyLocalizedContent(locale = currentLocale) {
    currentLocale = normalizeLocale(locale) || DEFAULT_LOCALE;
    captureOriginalContent();

    const content = getTranslations(currentLocale);
    document.documentElement.lang = currentLocale;
    document.title = content.meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
        description.setAttribute('content', content.meta.description);
    }

    const htmlBySelector = {
        '#hero .hero-content': content.html?.hero,
        '#guide .guide-container': content.html?.guide,
        '#visualization .vis-container': content.html?.visualization,
        '#cocktails .cocktails-container': content.html?.cocktails,
        '#timeline .timeline-container': content.html?.timeline,
        '#learning-path .learning-path-container': content.html?.learningPath,
        '#map-reading-guide .pedagogical-legend': content.html?.mapReadingGuide,
        '#applications .applications-container': content.html?.applications,
        '#pedagogical-legend .pedagogical-legend': content.html?.pedagogicalLegend,
        '.footer .footer-content': content.html?.footer
    };

    contentTargets.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
            const localizedHTML = htmlBySelector[selector] || originalContent.get(selector);
            if (localizedHTML) {
                element.innerHTML = localizedHTML;
            }
        }
    });

    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = currentLocale;
    }
}

export function getSections() {
    const content = getTranslations(currentLocale);
    const sectionIds = [
        'hero',
        'guide',
        'visualization',
        'cocktails',
        'timeline',
        'learning-path',
        'map-reading-guide',
        'applications',
        'pedagogical-legend'
    ];

    return sectionIds.map((id) => {
        const name = content.sections[id];
        return {
            id,
            name,
            ariaLabel: interpolate(content.scroll.goToSection, { section: name })
        };
    });
}

export function getNodeDisplayName(node) {
    const translatedName = getTranslations(currentLocale).nodes?.[node.id];
    return translatedName || node.nombre;
}

export function getNodeDescription(node) {
    return dataTranslations[currentLocale]?.nodes?.[node.id]?.description || node.descripcion || '';
}

export function getTransitionEvent(transition) {
    return dataTranslations[currentLocale]?.transitions?.[transition.id]?.event || transition.evento_disparador || '';
}

export function getTransitionDescription(transition) {
    return dataTranslations[currentLocale]?.transitions?.[transition.id]?.description || transition.descripcion || '';
}

export function getCategoryLabel(category) {
    return dataTranslations[currentLocale]?.categories?.[category] || humanizeKey(category);
}

export function getDescriptorValueLabel(value) {
    return dataTranslations[currentLocale]?.descriptorValues?.[value] || humanizeKey(value);
}

function captureOriginalContent() {
    if (originalContent.size > 0) {
        return;
    }

    contentTargets.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
            originalContent.set(selector, element.innerHTML);
        }
    });
}

function humanizeKey(value) {
    if (!value) {
        return '';
    }

    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}
