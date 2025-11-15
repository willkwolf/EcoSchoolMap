/**
 * SVG Symbols Utility
 * Custom symbols for different node types
 */

import * as d3 from 'd3';

/**
 * Get D3 symbol generator for node type
 * @param {string} tipo - Node type: 'tradicional', 'nuevo_paradigma', 'tradicion'
 * @param {number} size - Symbol size in pixels
 * @returns {Function} D3 symbol generator
 */
export function getNodeSymbol(tipo, size = 400) {
    const symbolTypes = {
        'tradicional': d3.symbolCircle,         // Circle
        'nuevo_paradigma': d3.symbolDiamond,    // Diamond
        'tradicion': d3.symbolSquare            // Square
    };

    const symbolType = symbolTypes[tipo] || d3.symbolCircle;

    return d3.symbol()
        .type(symbolType)
        .size(size);
}

/**
 * Get size for node based on type
 * @param {string} tipo - Node type
 * @returns {number} Size value
 */
export function getNodeSize(tipo) {
    const sizes = {
        'tradicional': 400,
        'nuevo_paradigma': 440,  // Slightly larger
        'tradicion': 400
    };

    return sizes[tipo] || 400;
}

/**
 * Get border styling for node type
 * @param {string} tipo - Node type
 * @returns {Object} Border style object
 */
export function getNodeBorderStyle(tipo) {
    const styles = {
        'tradicional': {
            width: 2.5,
            color: '#7f8c8d',
            opacity: 0.85
        },
        'nuevo_paradigma': {
            width: 3.5,
            color: '#34495e',
            opacity: 0.90
        },
        'tradicion': {
            width: 3,
            color: '#95a5a6',
            opacity: 0.8
        }
    };

    return styles[tipo] || styles.tradicional;
}

/**
 * Create arrow marker definition for SVG
 * @param {Object} svg - D3 SVG selection
 * @param {string} id - Marker ID
 * @param {string} color - Arrow color
 */
export function createArrowMarker(svg, id = 'arrow', color = '#2c3e50') {
    svg.append('defs')
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.7);
}

/**
 * Calculate label position offset based on node type
 * @param {string} tipo - Node type
 * @returns {number} Y offset in pixels
 */
export function getLabelOffset(tipo) {
    const offsets = {
        'tradicional': 20,
        'nuevo_paradigma': 25,
        'tradicion': 20
    };

    return offsets[tipo] || 20;
}
