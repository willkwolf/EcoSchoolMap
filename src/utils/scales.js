/**
 * D3 Scales Utility
 * Creates and manages D3 scales for positioning
 */

import * as d3 from 'd3';

/**
 * Create X and Y scales for the map
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @param {Object} options - Scale options
 * @returns {Object} Object with xScale and yScale
 */
export function createScales(width, height, options = {}) {
    const {
        xDomain = [-1.1, 1.1],
        yDomain = [-1.1, 1.1],
        padding = 60
    } = options;

    const xScale = d3.scaleLinear()
        .domain(xDomain)
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([height - padding, padding]); // Inverted for SVG coordinates

    return { xScale, yScale };
}

/**
 * Create color scale for nodes
 * Klein Schema palette (11 colors)
 */
export const KLEIN_SCHEMA = [
    "#FF4D6F",  // 0 - Rojo brillante
    "#579EA4",  // 1 - Azul-verde
    "#DF7713",  // 2 - Naranja tostado
    "#F9C000",  // 3 - Amarillo dorado
    "#86AD34",  // 4 - Verde oliva
    "#5D7298",  // 5 - Azul pizarra
    "#81B28D",  // 6 - Verde salvia
    "#7E1A2F",  // 7 - Rojo vino
    "#2D2651",  // 8 - Púrpura oscuro
    "#C8350D",  // 9 - Rojo naranja
    "#BD777A",  // 10 - Rosa polvorienta
];

/**
 * Assign colors to nodes sequentially
 * @param {Array} nodes - Array of node objects
 * @returns {Map} Map of node ID to color
 */
export function assignColorsToNodes(nodes) {
    const colorMap = new Map();

    nodes.forEach((node, index) => {
        const colorIndex = index % KLEIN_SCHEMA.length;
        colorMap.set(node.id, KLEIN_SCHEMA[colorIndex]);
    });

    return colorMap;
}

/**
 * Get confidence level styling
 * @param {string} confidence - 'muy_alta', 'alta', 'media', 'baja'
 * @returns {Object} Style object
 */
export function getConfidenceStyle(confidence) {
    const styles = {
        muy_alta: {
            width: 3.5,
            opacity: 0.9,
            dasharray: 'none',
            labelAlpha: 0.85
        },
        alta: {
            width: 2.8,
            opacity: 0.75,
            dasharray: 'none',
            labelAlpha: 0.75
        },
        media: {
            width: 2.0,
            opacity: 0.6,
            dasharray: '5,5',
            labelAlpha: 0.65
        },
        baja: {
            width: 1.5,
            opacity: 0.4,
            dasharray: '2,3',
            labelAlpha: 0.5
        }
    };

    return styles[confidence] || styles.media;
}
