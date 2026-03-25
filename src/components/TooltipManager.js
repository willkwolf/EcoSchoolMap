/**
 * TooltipManager - Handles rich HTML tooltips for nodes and transitions
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
        // Create tooltip container
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'custom-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('z-index', '1000');

        console.log('✅ TooltipManager initialized');
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
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 28}px`)
            .transition()
            .duration(200)
            .style('opacity', 0.95);
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
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 28}px`)
            .transition()
            .duration(200)
            .style('opacity', 0.95);
    }

    /**
     * Hide tooltip
     */
    hide() {
        this.tooltip
            .transition()
            .duration(200)
            .style('opacity', 0);
    }

    /**
     * Move tooltip to follow cursor
     * @param {Event} event - Mouse event
     */
    move(event) {
        this.tooltip
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 28}px`);
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
