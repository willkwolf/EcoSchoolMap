/**
 * Data Loader - Manages loading and merging of JSON data
 *
 * This module provides functions to:
 * - Load the base escuelas.json with complete school descriptions
 * - Load variant JSON files with calculated positions
 * - Merge variants with base data
 * - Optionally preload all 32 variants for faster switching
 *
 * @module data/loader
 */

/**
 * Load base escuelas.json with complete descriptive data
 *
 * Contains full information for all schools:
 * - Descriptive metadata (nombre, autores, descripcion)
 * - Qualitative descriptors (6 core descriptors)
 * - Historical transitions
 * - Visual mapping (colors, types)
 *
 * @returns {Promise<Object>} Base data object with nodos and transiciones
 * @throws {Error} If fetch fails or JSON parsing fails
 *
 * @example
 * const baseData = await loadBaseData();
 * console.log(baseData.nodos.length); // 12 schools
 */
export async function loadBaseData() {
    try {
        const response = await fetch('./data/escuelas.json');
        if (response.status >= 400) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ Base data loaded:', data.metadata);
        return data;
    } catch (error) {
        console.error('❌ Error loading base data:', error);
        throw error;
    }
}

/**
 * Load specific variant JSON file with calculated positions
 *
 * Variants contain only:
 * - Node IDs and calculated positions (x, y)
 * - Metadata about preset and normalization method
 *
 * Available presets:
 * - base, balanced, state-emphasis, equity-emphasis, market-emphasis,
 *   growth-emphasis, historical-emphasis, pragmatic-emphasis
 *
 * Available normalizations:
 * - percentile (default), zscore, minmax, none
 *
 * @param {string} preset - Preset name (e.g., 'base', 'balanced')
 * @param {string} normalization - Normalization method (e.g., 'percentile', 'zscore')
 * @returns {Promise<Object>} Variant data object with positions
 * @throws {Error} If fetch fails or variant file doesn't exist
 *
 * @example
 * const variant = await loadVariant('balanced', 'zscore');
 * console.log(variant.metadata.variant_name); // 'balanced-zscore'
 */
export async function loadVariant(preset, normalization) {
    const variantName = `${preset}-${normalization}`;

    try {
        const response = await fetch(`./data/variants/${variantName}.json`);
        if (response.status >= 400) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`✅ Variant loaded: ${variantName}`);
        return data;
    } catch (error) {
        console.error(`❌ Error loading variant ${variantName}:`, error);
        throw error;
    }
}

/**
 * Merge variant position data with base descriptive data
 *
 * Strategy:
 * 1. Clone baseData to avoid mutations
 * 2. Update node positions from variantData
 * 3. Keep all descriptive metadata from baseData
 * 4. Add variant metadata (preset, normalization)
 *
 * @param {Object} variantData - Variant with calculated positions (from loadVariant)
 * @param {Object} baseData - Base with complete descriptions (from loadBaseData)
 * @returns {Object} Merged data object with positions + descriptions
 *
 * @example
 * const baseData = await loadBaseData();
 * const variantData = await loadVariant('balanced', 'zscore');
 * const merged = mergeVariantWithBase(variantData, baseData);
 * // merged now has positions from variant + descriptions from base
 */
export function mergeVariantWithBase(variantData, baseData) {
    // Deep clone baseData to avoid mutations
    const merged = JSON.parse(JSON.stringify(baseData));

    // Update node positions from variant
    merged.nodos = merged.nodos.map(baseNode => {
        const variantNode = variantData.nodos.find(vn => vn.id === baseNode.id);

        if (variantNode && variantNode.posicion) {
            return {
                ...baseNode,
                posicion: variantNode.posicion
            };
        }

        return baseNode;
    });

    // Use variant's transitions (they include the same references as base)
    if (variantData.transiciones) {
        merged.transiciones = variantData.transiciones;
    }

    // Update metadata with variant info
    merged.metadata = {
        ...merged.metadata,
        variant_name: variantData.metadata?.variant_name,
        preset_name: variantData.metadata?.preset_name,
        normalization_method: variantData.metadata?.normalization_method
    };

    console.log('✅ Data merged successfully');
    return merged;
}

/**
 * Preload all 32 variants for instant switching (optional optimization)
 *
 * Loads all combinations of:
 * - 8 presets × 4 normalizations = 32 variants
 * - Total ~736KB (23KB per variant)
 *
 * Trade-off:
 * - ✅ Instant variant switching (no network delay)
 * - ❌ Initial load time increases by ~2-3 seconds
 *
 * @returns {Promise<Map<string, Object>>} Map of variant name (e.g., 'balanced-zscore') to data
 *
 * @example
 * const variantsCache = await preloadAllVariants();
 * const variant = variantsCache.get('balanced-zscore');
 */
export async function preloadAllVariants() {
    const presets = [
        'base', 'balanced', 'state-emphasis', 'equity-emphasis',
        'market-emphasis', 'growth-emphasis', 'historical-emphasis', 'pragmatic-emphasis'
    ];
    const normalizations = ['percentile', 'zscore', 'minmax', 'none'];

    const variantsMap = new Map();
    const promises = [];

    for (const preset of presets) {
        for (const norm of normalizations) {
            promises.push(
                loadVariant(preset, norm).then(data => {
                    variantsMap.set(`${preset}-${norm}`, data);
                })
            );
        }
    }

    await Promise.all(promises);
    console.log(`✅ Preloaded ${variantsMap.size} variants`);
    return variantsMap;
}
