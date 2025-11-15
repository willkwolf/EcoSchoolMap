/**
 * Data Loader - Manages loading and merging of JSON data
 */

/**
 * Load base escuelas.json with complete descriptive data
 * @returns {Promise<Object>} Base data object
 */
export async function loadBaseData() {
    try {
        const response = await fetch('/data/escuelas.json');
        if (!response.ok) {
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
 * Load specific variant JSON file
 * @param {string} preset - Preset name (e.g., 'base', 'balanced')
 * @param {string} normalization - Normalization method (e.g., 'percentile', 'zscore')
 * @returns {Promise<Object>} Variant data object
 */
export async function loadVariant(preset, normalization) {
    const variantName = `${preset}-${normalization}`;

    try {
        const response = await fetch(`/data/variants/${variantName}.json`);
        if (!response.ok) {
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
 * @param {Object} variantData - Variant with calculated positions
 * @param {Object} baseData - Base with complete descriptions
 * @returns {Object} Merged data object
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
 * Preload all variants for faster switching (optional optimization)
 * @returns {Promise<Map>} Map of variant name to data
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
