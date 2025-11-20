/**
 * Data Loader - Manages loading and dynamic calculation of school positions
 *
 * This module provides functions to:
 * - Load the base escuelas.json with complete school descriptions
 * - Dynamically calculate positions using client-side scoring engine
 * - Merge calculated positions with base data
 * - No pre-generated files needed - calculations happen on-demand
 *
 * @module data/loader
 */

import { calculatePositions } from '../utils/scoring.js';

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
 * Calculate variant positions dynamically using client-side scoring engine
 *
 * Instead of loading pre-generated files, this function:
 * - Takes the base data with school descriptors
 * - Calculates positions using the specified preset and normalization
 * - Returns a variant object with calculated positions
 *
 * Available presets:
 * - base, state-emphasis, equity-emphasis, market-emphasis,
 *   growth-emphasis, historical-emphasis, pragmatic-emphasis
 *
 * Available normalizations:
 * - none (default), zscore, percentile, minmax
 *
 * @param {Object} baseData - Base data object from loadBaseData()
 * @param {string} preset - Preset name (e.g., 'base', 'state-emphasis')
 * @param {string} normalization - Normalization method (e.g., 'none', 'zscore')
 * @returns {Object} Variant data object with calculated positions
 * @throws {Error} If calculation fails
 *
 * @example
 * const baseData = await loadBaseData();
 * const variant = calculateVariant(baseData, 'state-emphasis', 'zscore');
 * console.log(variant.metadata.variant_name); // 'state-emphasis-zscore'
 */
export function calculateVariant(baseData, preset = 'base', normalization = 'none') {
    const variantName = `${preset}-${normalization}`;

    try {
        console.log(`🔢 Calculating variant: ${variantName}`);

        // Calculate positions for all schools
        const positions = calculatePositions(baseData.nodos, preset, normalization);

        // Debug: log some positions
        console.log('Sample calculated positions:', {
            marxista: positions['marxista'],
            neoclasica: positions['neoclasica'],
            keynesiana: positions['keynesiana']
        });

        // Create variant data structure
        const variantData = {
            metadata: {
                variant_name: variantName,
                preset_name: preset,
                normalization_method: normalization,
                generated_at: new Date().toISOString(),
                generator_version: '2.0',
                generator_type: 'client-side'
            },
            nodos: baseData.nodos.map(node => ({
                id: node.id,
                nombre: node.nombre,
                posicion: positions[node.id] || { x: 0, y: 0 }
            })),
            transiciones: baseData.transiciones // Keep transitions as-is
        };

        console.log(`✅ Variant calculated: ${variantName}`);
        return variantData;
    } catch (error) {
        console.error(`❌ Error calculating variant ${variantName}:`, error);
        throw error;
    }
}

/**
 * Load and calculate variant data dynamically
 *
 * This is a convenience function that combines loadBaseData + calculateVariant + mergeVariantWithBase
 * for cases where you want the complete merged data object
 *
 * @param {string} preset - Preset name (e.g., 'base', 'state-emphasis')
 * @param {string} normalization - Normalization method (e.g., 'none', 'zscore')
 * @returns {Promise<Object>} Complete data object with calculated positions
 * @throws {Error} If loading or calculation fails
 *
 * @example
 * const data = await loadVariantData('state-emphasis', 'zscore');
 * console.log(data.metadata.variant_name); // 'state-emphasis-zscore'
 */
export async function loadVariantData(preset = 'base', normalization = 'none') {
    try {
        // Load base data
        const baseData = await loadBaseData();

        // Calculate variant positions
        const variantData = calculateVariant(baseData, preset, normalization);

        // Merge with base data
        const mergedData = mergeVariantWithBase(variantData, baseData);

        return mergedData;
    } catch (error) {
        console.error(`❌ Error loading variant data ${preset}-${normalization}:`, error);
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
 * @param {Object} variantData - Variant with calculated positions (from calculateVariant)
 * @param {Object} baseData - Base with complete descriptions (from loadBaseData)
 * @returns {Object} Merged data object with positions + descriptions
 *
 * @example
 * const baseData = await loadBaseData();
 * const variantData = calculateVariant(baseData, 'state-emphasis', 'zscore');
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

