/**
 * D3MapRenderer - Main visualization component
 * Renders economic schools map with D3.js
 */

import * as d3 from 'd3';
import { createScales, assignColorsToNodes, getConfidenceStyle } from '../utils/scales.js';
import { getNodeSymbol, getNodeSize, getNodeBorderStyle, createArrowMarker, getLabelOffset } from '../utils/symbols.js';
import { TooltipManager } from './TooltipManager.js';

export class D3MapRenderer {
    constructor(containerSelector, data, options = {}) {
        this.container = d3.select(containerSelector);
        this.data = data;
        this.options = {
            width: 1200,
            height: 700,
            padding: 60,
            ...options
        };

        this.svg = null;
        this.zoomGroup = null;
        this.xScale = null;
        this.yScale = null;
        this.colorMap = null;
        this.tooltipManager = new TooltipManager();
        this.zoom = null;

        this.init();
    }

    /**
     * Initialize the SVG container and scales
     */
    init() {
        // Clear container
        this.container.selectAll('*').remove();

        // Create responsive SVG
        this.svg = this.container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background-color', '#ffffff');

        // Create zoom group (all content will be rendered here)
        this.zoomGroup = this.svg.append('g').attr('class', 'zoom-group');

        // Setup zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.5, 4]) // Min and max zoom
            .on('zoom', (event) => {
                this.zoomGroup.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Create scales
        const scales = createScales(this.options.width, this.options.height, {
            padding: this.options.padding
        });
        this.xScale = scales.xScale;
        this.yScale = scales.yScale;

        // Assign colors to nodes
        this.colorMap = assignColorsToNodes(this.data.nodos);

        // Create arrow marker (in defs, outside zoom group)
        createArrowMarker(this.svg);

        console.log('✅ D3MapRenderer initialized');
    }

    /**
     * Reset zoom to initial state
     */
    resetZoom() {
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    /**
     * Render complete visualization
     */
    render() {
        this.renderQuadrants();
        this.renderAxes();
        this.renderTransitions();
        this.renderNodes();

        console.log('✅ Visualization rendered');
    }

    /**
     * Render background quadrants
     */
    renderQuadrants() {
        const quadrants = [
            { x: -1.1, y: 0, width: 1.1, height: 1.1, fill: 'rgba(0,255,0,0.05)', name: 'Q1' },
            { x: 0, y: 0, width: 1.1, height: 1.1, fill: 'rgba(0,0,255,0.05)', name: 'Q2' },
            { x: -1.1, y: -1.1, width: 1.1, height: 1.1, fill: 'rgba(255,165,0,0.05)', name: 'Q3' },
            { x: 0, y: -1.1, width: 1.1, height: 1.1, fill: 'rgba(128,0,128,0.05)', name: 'Q4' }
        ];

        const quadrantGroup = this.zoomGroup.append('g').attr('class', 'quadrants');

        quadrantGroup.selectAll('rect')
            .data(quadrants)
            .enter()
            .append('rect')
            .attr('class', d => `quadrant ${d.name}`)
            .attr('x', d => this.xScale(d.x))
            .attr('y', d => this.yScale(d.y + d.height))
            .attr('width', d => this.xScale(d.width) - this.xScale(0))
            .attr('height', d => this.yScale(0) - this.yScale(d.height))
            .attr('fill', d => d.fill);
    }

    /**
     * Render X and Y axes with zero lines
     */
    renderAxes() {
        const axesGroup = this.zoomGroup.append('g').attr('class', 'axes');

        // X axis (vertical line at x=0)
        axesGroup.append('line')
            .attr('class', 'axis-line axis-x')
            .attr('x1', this.xScale(0))
            .attr('y1', this.yScale(-1.1))
            .attr('x2', this.xScale(0))
            .attr('y2', this.yScale(1.1))
            .attr('stroke', 'gray')
            .attr('stroke-width', 2);

        // Y axis (horizontal line at y=0)
        axesGroup.append('line')
            .attr('class', 'axis-line axis-y')
            .attr('x1', this.xScale(-1.1))
            .attr('y1', this.yScale(0))
            .attr('x2', this.xScale(1.1))
            .attr('y2', this.yScale(0))
            .attr('stroke', 'gray')
            .attr('stroke-width', 2);

        // Axis labels
        axesGroup.append('text')
            .attr('class', 'axis-label axis-label-x')
            .attr('x', this.options.width / 2)
            .attr('y', this.options.height - 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#2c3e50')
            .text('Arquitectura Económica: ← Economía Dirigida (Estado Fuerte) | Economía de Mercado (Estado Limitado) →');

        axesGroup.append('text')
            .attr('class', 'axis-label axis-label-y')
            .attr('x', -this.options.height / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#2c3e50')
            .attr('transform', `rotate(-90, 0, 0)`)
            .text('Objetivo Socioeconómico: ← Productividad y Crecimiento | Equidad y Sostenibilidad →');
    }

    /**
     * Render transition arrows between schools
     */
    renderTransitions() {
        if (!this.data.transiciones) return;

        const transitionGroup = this.zoomGroup.append('g').attr('class', 'transitions');

        this.data.transiciones.forEach(transition => {
            const fromNode = this.data.nodos.find(n => n.id === transition.desde_nodo);
            const toNode = this.data.nodos.find(n => n.id === transition.hacia_nodo);

            if (!fromNode || !toNode) return;

            const x1 = this.xScale(fromNode.posicion.x);
            const y1 = this.yScale(fromNode.posicion.y);
            const x2 = this.xScale(toNode.posicion.x);
            const y2 = this.yScale(toNode.posicion.y);

            // Calculate curve control point
            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = x1 + dx / 2;
            const cy = y1 + dy / 2 - 30; // Curve upward

            const style = getConfidenceStyle(transition.confianza);

            // Create curved path
            const path = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

            transitionGroup.append('path')
                .attr('class', `transition-arrow ${transition.id}`)
                .attr('d', path)
                .attr('fill', 'none')
                .attr('stroke', '#2c3e50')
                .attr('stroke-width', style.width)
                .attr('stroke-dasharray', style.dasharray)
                .attr('opacity', style.opacity)
                .attr('marker-end', 'url(#arrow)')
                .on('mouseenter', (event) => this.onTransitionHover(event, transition))
                .on('mouseleave', () => this.onTransitionLeave());

            // Add label at midpoint (optional - can be toggled)
            const labelX = cx;
            const labelY = cy;

            transitionGroup.append('text')
                .attr('class', `transition-label ${transition.id}`)
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .attr('fill', '#2c3e50')
                .attr('opacity', style.labelAlpha)
                .text(transition.año);
        });
    }

    /**
     * Render school nodes
     */
    renderNodes() {
        const nodesGroup = this.zoomGroup.append('g').attr('class', 'nodes');

        this.data.nodos.forEach(node => {
            const x = this.xScale(node.posicion.x);
            const y = this.yScale(node.posicion.y);
            const color = this.colorMap.get(node.id);
            const size = getNodeSize(node.tipo);
            const symbolGenerator = getNodeSymbol(node.tipo, size);
            const borderStyle = getNodeBorderStyle(node.tipo);

            // Create node group
            const nodeGroup = nodesGroup.append('g')
                .attr('class', `node ${node.id}`)
                .attr('transform', `translate(${x},${y})`);

            // Draw symbol
            nodeGroup.append('path')
                .attr('d', symbolGenerator)
                .attr('fill', color)
                .attr('stroke', borderStyle.color)
                .attr('stroke-width', borderStyle.width)
                .attr('opacity', borderStyle.opacity)
                .style('cursor', 'pointer')
                .on('mouseenter', (event) => this.onNodeHover(event, node))
                .on('mouseleave', () => this.onNodeLeave());

            // Draw label
            const labelOffset = getLabelOffset(node.tipo);
            nodeGroup.append('text')
                .attr('class', 'node-label')
                .attr('y', labelOffset)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .attr('fill', '#2c3e50')
                .text(node.nombre);
        });
    }

    /**
     * Node hover handler
     */
    onNodeHover(event, node) {
        this.tooltipManager.showNodeTooltip(event, node);
    }

    /**
     * Node leave handler
     */
    onNodeLeave() {
        this.tooltipManager.hide();
    }

    /**
     * Transition hover handler
     */
    onTransitionHover(event, transition) {
        this.tooltipManager.showTransitionTooltip(event, transition);
    }

    /**
     * Transition leave handler
     */
    onTransitionLeave() {
        this.tooltipManager.hide();
    }

    /**
     * Update visualization with new data (for variant switching)
     * @param {Object} newData - New data object
     */
    updateVariant(newData) {
        this.data = newData;
        this.colorMap = assignColorsToNodes(newData.nodos);

        // Clear only the zoom group content (preserve zoom behavior)
        this.zoomGroup.selectAll('*').remove();

        // Re-render
        this.render();

        console.log('✅ Variant updated');

        // TODO: Add smooth transitions (FASE 3)
    }
}
