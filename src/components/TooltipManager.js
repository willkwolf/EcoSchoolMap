/**
 * TooltipManager - Handles rich HTML tooltips for nodes and transitions
 * Includes intelligent viewport boundary clamping to prevent tooltip overflow.
 */

import * as d3 from 'd3';
import {
    getCategoryLabel,
    getDescriptorValueLabel,
    getNodeDescription,
    getNodeDisplayName,
    getTransitionDescription,
    getTransitionEvent,
    t
} from '../i18n/index.js';

export class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    /**
     * Initialize tooltip div
     */
    init() {
        // Clear any previous tooltips
        d3.selectAll('.custom-tooltip').remove();

        // Create tooltip container
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'custom-tooltip')
            .style('opacity', 0)
            .style('display', 'none')
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('z-index', '100000');

        console.log('✅ TooltipManager initialized');
    }

    /**
     * Calculate position to keep tooltip strictly inside the viewport at all times
     * @param {Event} event - Mouse or touch event
     */
    positionTooltip(event) {
        if (!this.tooltip || !event) return;

        const node = this.tooltip.node();
        if (!node) return;

        const tooltipWidth = node.offsetWidth || 300;
        const tooltipHeight = node.offsetHeight || 200;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        const clientX = event.clientX !== undefined ? event.clientX : (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
        const clientY = event.clientY !== undefined ? event.clientY : (event.touches && event.touches[0] ? event.touches[0].clientY : 0);

        const pageX = event.pageX !== undefined ? event.pageX : clientX + scrollX;
        const pageY = event.pageY !== undefined ? event.pageY : clientY + scrollY;

        const padding = 15;

        // Horizontal positioning: default to right (+15px)
        let left = pageX + padding;

        // If tooltip extends past right viewport edge, flip to left of cursor
        if (clientX + padding + tooltipWidth > windowWidth - padding) {
            left = pageX - tooltipWidth - padding;
        }

        // Clamp to left viewport edge
        if (left < scrollX + padding) {
            left = scrollX + padding;
        }

        // Vertical positioning: default to slightly above/at cursor (-28px)
        let top = pageY - 28;

        // If tooltip extends past bottom viewport edge, shift/flip above cursor
        if (clientY + tooltipHeight + 10 > windowHeight - padding) {
            top = pageY - tooltipHeight - padding;
        }

        // Clamp to top viewport edge
        if (top < scrollY + padding) {
            top = scrollY + padding;
        }

        this.tooltip
            .style('left', `${left}px`)
            .style('top', `${top}px`);
    }

    /**
     * Show tooltip for a school node
     * @param {Event} event - Mouse event
     * @param {Object} node - School node data
     */
    showNodeTooltip(event, node) {
        const html = this.buildNodeTooltipHTML(node);

        this.tooltip
            .html(html)
            .style('display', 'block')
            .style('opacity', 0);

        this.positionTooltip(event);

        this.tooltip
            .transition()
            .duration(150)
            .style('opacity', 0.98);
    }

    /**
     * Show tooltip for a transition arrow
     * @param {Event} event - Mouse event
     * @param {Object} transition - Transition data
     */
    showTransitionTooltip(event, transition) {
        const html = this.buildTransitionTooltipHTML(transition);

        this.tooltip
            .html(html)
            .style('display', 'block')
            .style('opacity', 0);

        this.positionTooltip(event);

        this.tooltip
            .transition()
            .duration(150)
            .style('opacity', 0.98);
    }

    /**
     * Hide tooltip
     */
    hide() {
        if (!this.tooltip) return;
        this.tooltip
            .transition()
            .duration(150)
            .style('opacity', 0)
            .on('end', () => {
                if (this.tooltip) {
                    this.tooltip.style('display', 'none');
                }
            });
    }

    /**
     * Move tooltip to follow cursor safely within screen bounds
     * @param {Event} event - Mouse event
     */
    move(event) {
        this.positionTooltip(event);
    }

    /**
     * Build HTML for node tooltip
     * @param {Object} node - Node data
     * @returns {string} HTML string
     */
    buildNodeTooltipHTML(node) {
        const descriptoresHTML = Object.entries(node.descriptores || {})
            .map(([key, value]) => {
                const label = this.formatDescriptorKey(key);
                const formattedValue = this.formatDescriptorValue(value);
                return `<span class="descriptor"><strong>${label}:</strong> ${formattedValue}</span>`;
            })
            .join('');

        const autoresText = Array.isArray(node.autores)
            ? node.autores.join(', ')
            : node.autores || t('ui.notAvailable');

        return `
            <div class="tooltip-header">
                <h3>${getNodeDisplayName(node)}</h3>
                <span class="categoria">${getCategoryLabel(node.categoria)}</span>
            </div>
            <div class="tooltip-body">
                <p><strong>${t('tooltip.year')}:</strong> ${node.año_origen || t('ui.notAvailable')}</p>
                <p><strong>${t('tooltip.authors')}:</strong> ${autoresText}</p>
                <p>${getNodeDescription(node)}</p>
                ${descriptoresHTML ? `<div class="descriptores">${descriptoresHTML}</div>` : ''}
            </div>
        `;
    }

    /**
     * Build HTML for transition tooltip
     * @param {Object} transition - Transition data
     * @returns {string} HTML string
     */
    buildTransitionTooltipHTML(transition) {
        const referenciaHTML = transition.referencia && transition.referencia.APA
            ? `
                <div class="referencia">
                    <h4>${t('tooltip.reference')}:</h4>
                    <p><em>${transition.referencia.APA}</em></p>
                    ${transition.referencia.DOI ? `<p>DOI: ${transition.referencia.DOI}</p>` : ''}
                </div>
            `
            : '';

        return `
            <div class="tooltip-header">
                <h3>${getTransitionEvent(transition)}</h3>
                <span class="categoria">${t('tooltip.year')}: ${transition.año}</span>
            </div>
            <div class="tooltip-body">
                <p>${getTransitionDescription(transition)}</p>
                <p><strong>${t('tooltip.confidence')}:</strong> ${this.formatConfianza(transition.confianza)}</p>
                ${referenciaHTML}
            </div>
        `;
    }

    /**
     * Format descriptor key for display
     * @param {string} key - Descriptor key
     * @returns {string} Formatted key
     */
    formatDescriptorKey(key) {
        return t(`tooltip.descriptors.${key}`);
    }

    /**
     * Format descriptor value for display
     * @param {string} value - Descriptor value
     * @returns {string} Formatted value
     */
    formatDescriptorValue(value) {
        if (!value) return '';
        return getDescriptorValueLabel(value);
    }

    /**
     * Format confidence level for display
     * @param {string} confianza - Confidence level
     * @returns {string} Formatted confidence
     */
    formatConfianza(confianza) {
        return t(`tooltip.confidenceValues.${confianza}`);
    }

    /**
     * Destroy tooltip (cleanup)
     */
    destroy() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
}
