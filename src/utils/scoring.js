/**
 * Client-side Economic School Scoring Engine
 * Ported from Python scoring_methodology.py
 * Calculates positions dynamically instead of using pre-generated files
 */

// Weight presets (same as Python version)
export const WEIGHT_PRESETS = {
    'base': {
        x: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 },
        y: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 }
    },
    'state-emphasis': {
        x: { economia: 0.20, humano: 0.10, mundo: 0.10, ambito: 0.15, motor: 0.20, politica: 0.25 },
        y: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 }
    },
    'equity-emphasis': {
        x: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 },
        y: { economia: 0.15, humano: 0.20, mundo: 0.10, ambito: 0.20, motor: 0.15, politica: 0.20 }
    },
    'market-emphasis': {
        x: { economia: 0.05, humano: 0.10, mundo: 0.15, ambito: 0.20, motor: 0.25, politica: 0.25 },
        y: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 }
    },
    'growth-emphasis': {
        x: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 },
        y: { economia: 0.05, humano: 0.10, mundo: 0.15, ambito: 0.20, motor: 0.25, politica: 0.25 }
    },
    'historical-emphasis': {
        x: { economia: 0.15, humano: 0.10, mundo: 0.20, ambito: 0.10, motor: 0.15, politica: 0.30 },
        y: { economia: 0.10, humano: 0.15, mundo: 0.05, ambito: 0.15, motor: 0.20, politica: 0.35 }
    },
    'pragmatic-emphasis': {
        x: { economia: 0.12, humano: 0.18, mundo: 0.08, ambito: 0.12, motor: 0.18, politica: 0.32 },
        y: { economia: 0.12, humano: 0.18, mundo: 0.08, ambito: 0.12, motor: 0.18, politica: 0.32 }
    }
};

// Scoring dictionaries (same as Python version)
const SCORES_ECONOMIA = {
    'clases_sociales': { x: 0.7, y: 0.5 },
    'individuos': { x: -0.9, y: -0.5 },
    'instituciones': { x: 0.3, y: 0.0 },
    'sistema_complejo': { x: 0.5, y: 0.2 },
    'sistema_productivo': { x: 0.6, y: -0.6 }
};

const SCORES_HUMANO = {
    'racional_egoista': { x: -0.8, y: -0.8 },
    'racional_limitada': { x: 0.2, y: 0.3 },
    'condicionado_clase': { x: 0.7, y: 0.7 },
    'adaptable_cultural': { x: 0.1, y: 0.1 }
};

const SCORES_MUNDO = {
    'equilibrio_cierto': { x: -0.7, y: -0.3 },
    'incertidumbre': { x: 0.4, y: 0.0 },
    'evolutivo_dinamico': { x: -0.2, y: -0.6 },
    'determinista_historico': { x: 0.5, y: 0.0 }
};

const SCORES_AMBITO = {
    'intercambio_mercado': { x: -0.6, y: -0.2 },
    'produccion': { x: 0.3, y: -0.9 },
    'distribucion': { x: 0.6, y: 0.9 },
    'consumo_demanda': { x: 0.4, y: 0.3 }
};

const SCORES_MOTOR = {
    'accion_individual': { x: -1.0, y: -0.4 },
    'acumulacion_capital': { x: -0.5, y: -0.8 },
    'innovacion': { x: -0.3, y: -0.7 },
    'conflicto_social': { x: 0.8, y: 0.8 },
    'politica_estado': { x: 0.9, y: -0.7 }
};

const SCORES_POLITICA = {
    'laissez_faire': { x: -1.0, y: -0.5 },
    'fallos_mercado': { x: -0.2, y: 0.0 },
    'welfare_state': { x: 0.5, y: 0.6 },
    'developmental_state': { x: 0.8, y: -0.8 },
    'planificacion_central': { x: 1.0, y: 0.5 }
};

const SCORE_MAPPINGS = {
    'economia': SCORES_ECONOMIA,
    'humano': SCORES_HUMANO,
    'mundo': SCORES_MUNDO,
    'ambito': SCORES_AMBITO,
    'motor': SCORES_MOTOR,
    'politica': SCORES_POLITICA
};

/**
 * Calculate positions for all schools using specified preset and normalization
 * @param {Array} schools - Array of school objects with descriptors
 * @param {string} presetName - Name of the weight preset
 * @param {string} normalizationMethod - Normalization method ('none', 'zscore', 'percentile', 'minmax')
 * @returns {Object} Object with school IDs as keys and {x, y} positions as values
 */
export function calculatePositions(schools, presetName = 'base', normalizationMethod = 'none') {
    const weights = WEIGHT_PRESETS[presetName];
    if (!weights) {
        throw new Error(`Unknown preset: ${presetName}`);
    }

    // Calculate raw positions for all schools
    const rawPositions = {};
    for (const school of schools) {
        const position = calculateSchoolPosition(school.descriptores, weights);
        rawPositions[school.id] = position;
    }

    // Apply normalization if needed
    if (normalizationMethod !== 'none') {
        return applyNormalization(rawPositions, normalizationMethod);
    }

    return rawPositions;
}

/**
 * Calculate position for a single school
 * @param {Object} descriptors - School descriptors
 * @param {Object} weights - Weight configuration
 * @returns {Object} {x, y} position
 */
function calculateSchoolPosition(descriptors, weights) {
    let xWeightedSum = 0.0;
    let yWeightedSum = 0.0;

    // Map data keys to scoring keys
    const keyMapping = {
        'economia': 'concepcion_economia',
        'humano': 'concepcion_humano',
        'mundo': 'naturaleza_mundo',
        'ambito': 'ambito_economico',
        'motor': 'motor_cambio',
        'politica': 'politicas_preferidas'
    };

    // Calculate weighted sum for each dimension
    for (const [scoreKey, scoreDict] of Object.entries(SCORE_MAPPINGS)) {
        const dataKey = keyMapping[scoreKey];
        const descriptorValue = descriptors[dataKey];

        if (descriptorValue && scoreDict[descriptorValue]) {
            const scores = scoreDict[descriptorValue];
            const weight = weights.x[scoreKey]; // Use x weights for x calculation
            xWeightedSum += scores.x * weight;

            const yWeight = weights.y[scoreKey]; // Use y weights for y calculation
            yWeightedSum += scores.y * yWeight;
        }
    }

    // Clip to [-1, 1] range (same as Python version)
    const xFinal = Math.max(-1.0, Math.min(1.0, xWeightedSum));
    const yFinal = Math.max(-1.0, Math.min(1.0, yWeightedSum));

    return { x: xFinal, y: yFinal };
}

/**
 * Apply normalization to a set of positions
 * @param {Object} positions - Object with school IDs as keys and {x, y} as values
 * @param {string} method - Normalization method
 * @returns {Object} Normalized positions
 */
function applyNormalization(positions, method) {
    const schoolIds = Object.keys(positions);
    const xValues = schoolIds.map(id => positions[id].x);
    const yValues = schoolIds.map(id => positions[id].y);

    let xNormalized, yNormalized;

    switch (method) {
        case 'zscore':
            xNormalized = zscoreNormalize(xValues);
            yNormalized = zscoreNormalize(yValues);
            break;
        case 'percentile':
            xNormalized = percentileNormalize(xValues);
            yNormalized = percentileNormalize(yValues);
            break;
        case 'minmax':
            xNormalized = minmaxNormalize(xValues);
            yNormalized = minmaxNormalize(yValues);
            break;
        default:
            return positions; // No normalization
    }

    // Reconstruct positions object
    const normalizedPositions = {};
    schoolIds.forEach((id, index) => {
        normalizedPositions[id] = {
            x: xNormalized[index],
            y: yNormalized[index]
        };
    });

    return normalizedPositions;
}

/**
 * Z-score normalization (clipped to [-1, 1])
 * @param {Array} values - Array of numbers
 * @returns {Array} Z-score normalized values
 */
function zscoreNormalize(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    if (std === 0) {
        return new Array(values.length).fill(0); // All values are the same
    }

    const zscores = values.map(val => (val - mean) / std);
    // Clip to [-1, 1] range for map compatibility
    return zscores.map(z => Math.max(-1.0, Math.min(1.0, z)));
}

/**
 * Percentile normalization (rank-based, scaled to [-1, 1] range)
 * @param {Array} values - Array of numbers
 * @returns {Array} Percentile normalized values
 */
function percentileNormalize(values) {
    // Create array of [value, index] pairs
    const indexed = values.map((val, idx) => [val, idx]);
    // Sort by value
    indexed.sort((a, b) => a[0] - b[0]);
    // Assign ranks (1-based)
    const ranks = new Array(values.length);
    indexed.forEach(([val, originalIdx], rankIdx) => {
        ranks[originalIdx] = rankIdx + 1; // 1-based rank
    });
    // Convert to percentiles (0-1 range) then scale to [-1, 1]
    const percentiles = ranks.map(rank => (rank - 1) / (values.length - 1));
    return percentiles.map(p => 2 * p - 1); // Scale [0,1] to [-1,1]
}

/**
 * Min-max normalization (scales to [-1, 1] range)
 * @param {Array} values - Array of numbers
 * @returns {Array} Min-max normalized values
 */
function minmaxNormalize(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (max === min) {
        return new Array(values.length).fill(0.0); // All values are the same, center at 0
    }

    // Scale to [0, 1] first, then to [-1, 1]
    const normalized01 = values.map(val => (val - min) / (max - min));
    return normalized01.map(val => 2 * val - 1); // Scale [0,1] to [-1,1]
}

/**
 * Get available preset names
 * @returns {Array} Array of preset names
 */
export function getAvailablePresets() {
    return Object.keys(WEIGHT_PRESETS);
}

/**
 * Get weight configuration for a preset
 * @param {string} presetName - Name of the preset
 * @returns {Object} Weight configuration
 */
export function getWeightPreset(presetName) {
    return WEIGHT_PRESETS[presetName] || WEIGHT_PRESETS['base'];
}