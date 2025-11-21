/**
 * D3MapRenderer - Main visualization component for economic schools map
 *
 * Renders an interactive 2D map of economic schools using D3.js with:
 * - Zoom/pan functionality
 * - Dynamic node rendering with custom shapes
 * - Historical transitions between schools
 * - Interactive tooltips with rich content
 * - Smooth GSAP animations for variant transitions
 *
 * @class
 * @example
 * const renderer = new D3MapRenderer('#map-container', mergedData, {
 *   width: 1200,
 *   height: 700,
 *   padding: 60
 * });
 * renderer.render();
 */

import * as d3 from 'd3';
import { createScales, assignColorsToNodes, getConfidenceStyle } from '../utils/scales.js';
import { getNodeSymbol, getNodeSize, getNodeBorderStyle, createArrowMarker, getLabelOffset } from '../utils/symbols.js';
import { TooltipManager } from './TooltipManager.js';

export class D3MapRenderer {
    /**
     * Creates a new D3MapRenderer instance
     *
     * @param {string} containerSelector - CSS selector for container element (e.g., '#map-container')
     * @param {Object} data - Merged data object with schools and transitions
     * @param {Array<Object>} data.nodos - Array of school nodes
     * @param {Array<Object>} data.transiciones - Array of historical transitions
     * @param {Object} [options={}] - Configuration options
     * @param {number} [options.width=1200] - SVG width in pixels
     * @param {number} [options.height=700] - SVG height in pixels
     * @param {number} [options.padding=60] - Padding around the plot area
     */
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

        // Force simulation properties
        this.simulation = null;
        this.forceStrength = 0.12; // Reduced repulsion strength for better stability
        this.collisionRadius = 45; // Increased collision radius for better separation
        this.collisionEnabled = false; // Default: collisions disabled

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
            .filter((event) => {
                // Allow touch events and prevent default browser gestures from interfering
                // Prevent zoom on double-click (better for mobile)
                return !event.button && event.type !== 'dblclick';
            })
            .on('zoom', (event) => {
                this.zoomGroup.attr('transform', event.transform);
            });

        this.svg.call(this.zoom)
            .on('dblclick.zoom', null); // Disable double-click zoom for better mobile UX

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

        // Initialize force simulation
        this.initForceSimulation();

        console.log('✅ D3MapRenderer initialized');
    }

    /**
     * Initialize D3 force simulation for node repulsion and collision prevention
     */
    initForceSimulation() {
        // Create force simulation with multiple forces
        this.simulation = d3.forceSimulation()
            // Repulsion force (like electrical charges)
            .force('charge', d3.forceManyBody()
                .strength(-this.forceStrength * 100) // Negative = repulsion
                .distanceMax(100)
            )
            // Collision detection to prevent overlapping
            .force('collision', d3.forceCollide()
                .radius(this.collisionRadius)
                .strength(0.9) // Increased collision strength
                .iterations(4) // More iterations for better convergence
            )
            // Center force to keep nodes near their target positions
            .force('x', d3.forceX()
                .strength(0.05) // Very weak centering force to allow collision to work
            )
            .force('y', d3.forceY()
                .strength(0.05) // Very weak centering force to allow collision to work
            )
            // Custom positioning force to maintain target coordinates
            .force('position', () => {
                // This will be updated dynamically with target positions
            })
            .alphaDecay(0.02) // Slow decay for smooth convergence
            .velocityDecay(0.3); // Moderate velocity decay

        console.log('✅ Force simulation initialized');
    }

    /**
     * Set collision forces enabled/disabled
     * @param {boolean} enabled - Whether to enable collision forces
     */
    setCollisionEnabled(enabled) {
        const wasEnabled = this.collisionEnabled;
        this.collisionEnabled = enabled;

        // CRITICAL: Clear ALL existing event handlers FIRST to prevent race conditions
        // during rapid toggling. Multiple handlers running simultaneously cause conflicts.
        this.simulation.on('tick', null);
        this.simulation.on('end', null);

        if (enabled) {
            // Enabling collisions: add forces and start simulation
            this.enableCollisionForces();
            this.restartSimulation();
        } else {
            // Disabling collisions: remove forces, stop simulation, reset positions
            this.disableCollisionForces();
            this.simulation.stop();
            this.resetNodesToTargets();
            this.updateTransitionsToFinalPositions();
        }

        console.log(`Collision forces ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Add collision and charge forces to simulation
     */
    enableCollisionForces() {
        this.simulation
            .force('collision', d3.forceCollide()
                .radius(d => {
                    const area = getNodeSize(d.tipo);
                    const visualRadius = Math.sqrt(area / Math.PI);
                    return visualRadius + 15;
                })
                .strength(0.9)
                .iterations(3)
            )
            .force('charge', d3.forceManyBody()
                .strength(-50)
                .distanceMax(150)
            );
    }

    /**
     * Remove collision and charge forces from simulation
     */
    disableCollisionForces() {
        this.simulation
            .force('collision', null)
            .force('charge', null);
    }

    /**
     * Immediately reset all nodes to their target positions (synchronous)
     */
    resetNodesToTargets() {
        const nodes = this.simulation.nodes();
        if (!nodes || nodes.length === 0) return;

        nodes.forEach(node => {
            const element = this.zoomGroup.select(`.node.${node.id}`);
            if (!element.empty()) {
                // Immediately set to target position
                element.attr('transform', `translate(${node.targetX},${node.targetY})`);
                node.x = node.targetX;
                node.y = node.targetY;
            }
        });

        console.log('🔄 Nodes immediately reset to target positions');
    }

    /**
     * Restart the force simulation with positioning forces
     * Collision/charge forces are managed separately by enable/disable methods
     */
    restartSimulation() {
        const nodes = this.simulation.nodes();
        if (!nodes || nodes.length === 0) return;

        // Always apply positioning forces
        this.simulation
            .force('x', d3.forceX(d => d.targetX).strength(0.3))
            .force('y', d3.forceY(d => d.targetY).strength(0.3))
            .alpha(0.6)
            .alphaDecay(0.05)
            .restart();

        // Stop after convergence if collisions are enabled
        if (this.collisionEnabled) {
            setTimeout(() => {
                this.simulation.alpha(0).restart();
                this.updateTransitionsToFinalPositions();
            }, 4000);
        }
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
     * Render historical transition arrows and labels
     */
    renderTransitions() {
        if (!this.data.transiciones || this.data.transiciones.length === 0) return;

        const transitionGroup = this.zoomGroup.append('g').attr('class', 'transitions');

        this.data.transiciones.forEach(transition => {
            const fromNode = this.data.nodos.find(n => n.id === transition.desde_nodo);
            const toNode = this.data.nodos.find(n => n.id === transition.hacia_nodo);

            if (!fromNode || !toNode) return;

            // Calculate arrow path
            const x1 = this.xScale(fromNode.posicion.x);
            const y1 = this.yScale(fromNode.posicion.y);
            const x2 = this.xScale(toNode.posicion.x);
            const y2 = this.yScale(toNode.posicion.y);

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = x1 + dx / 2;
            const cy = y1 + dy / 2 - 30;

            const path = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

            // Get confidence style
            const style = getConfidenceStyle(transition.confianza);

            // Create arrow path
            transitionGroup.append('path')
                .attr('class', `transition-arrow ${transition.id}`)
                .attr('d', path)
                .attr('stroke', style.color)
                .attr('stroke-width', style.width)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#arrowhead)')
                .style('opacity', style.opacity)
                .style('cursor', 'pointer')
                .on('mouseenter', (event) => this.onTransitionHover(event, transition))
                .on('mouseleave', () => this.onTransitionLeave());

            // Create label
            transitionGroup.append('text')
                .attr('class', `transition-label ${transition.id}`)
                .attr('x', cx)
                .attr('y', cy)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px')
                .attr('font-weight', 'bold')
                .attr('fill', style.color)
                .style('pointer-events', 'none')
                .text(transition.año);
        });

        console.log(`✅ Rendered ${this.data.transiciones.length} transition arrows`);
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

        // Desktop axis labels (hidden on mobile)
        axesGroup.append('text')
            .attr('class', 'axis-label axis-label-x desktop-only')
            .attr('x', this.options.width / 2)
            .attr('y', this.options.height - 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#2c3e50')
            .text('Arquitectura Económica: ← Economía de Mercado (Estado Débil) | Economía Dirigida (Estado Fuerte) →');

        axesGroup.append('text')
            .attr('class', 'axis-label axis-label-y desktop-only')
            .attr('x', -this.options.height / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#2c3e50')
            .attr('transform', `rotate(-90, 0, 0)`)
            .text('Objetivo Socioeconómico: Productividad y Crecimiento ↓ | Equidad y Sostenibilidad ↑');

        // Mobile axis labels (hidden on desktop)
        axesGroup.append('text')
            .attr('class', 'axis-label axis-label-x mobile-only')
            .attr('x', this.options.width / 2)
            .attr('y', this.options.height - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#2c3e50')
            .text('← Estado Débil | Estado Fuerte →');

        axesGroup.append('text')
            .attr('class', 'axis-label axis-label-y mobile-only')
            .attr('x', -this.options.height / 2)
            .attr('y', 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#2c3e50')
            .attr('transform', `rotate(-90, 0, 0)`)
            .text('Crecimiento ↓ | Equidad ↑');
    }

    /**
     * Render school nodes with force simulation for collision prevention
     * REFACTORIZADO: Corrige el bloqueo de fx/fy y optimiza el rendimiento
     */
    renderNodes() {
        const nodesGroup = this.zoomGroup.append('g').attr('class', 'nodes');

        // 1. PREPARACIÓN DE DATOS
        const nodeData = this.data.nodos.map(node => {
            // Offset minúsculo para evitar división por cero en el primer tick
            const randomOffset = 0.001;
            const offsetX = (Math.random() - 0.5) * randomOffset;
            const offsetY = (Math.random() - 0.5) * randomOffset;

            // Coordenadas objetivo (El "Ideal" matemático)
            const normalizedTargetX = Math.max(-1, Math.min(1, node.posicion.x + offsetX));
            const normalizedTargetY = Math.max(-1, Math.min(1, node.posicion.y + offsetY));

            const pixelTargetX = this.xScale(normalizedTargetX);
            const pixelTargetY = this.yScale(normalizedTargetY);

            return {
                ...node,
                // Posición inicial (donde empieza la simulación)
                x: pixelTargetX, 
                y: pixelTargetY,
                
                // CRÍTICO: Usamos propiedades personalizadas, NO fx/fy
                targetX: pixelTargetX, 
                targetY: pixelTargetY,
                
                // fx y fy deben ser null para permitir que la física actúe
                fx: null,
                fy: null
            };
        });

        // 2. CREACIÓN DE ELEMENTOS DOM
        const nodeElements = nodesGroup.selectAll('.node')
            .data(nodeData, d => d.id)
            .enter()
            .append('g')
            .attr('class', d => `node ${d.id}`)
            // Inicializamos en el target, la simulación los moverá si es necesario
            .attr('transform', d => `translate(${d.x},${d.y})`);

        // (Tu código de agregar símbolos y textos se mantiene igual aquí...)
        this.appendNodeVisuals(nodeElements); // Asumo que moviste esto a una fn auxiliar para limpieza

        // 3. CONFIGURACIÓN DE LA SIMULACIÓN (Solo si colisiones activadas)
        if (this.collisionEnabled) {
            this.simulation
                .nodes(nodeData)
                // A. Fuerza de Posicionamiento (El "Elástico" hacia su lugar ideal)
                .force('x', d3.forceX(d => d.targetX).strength(0.3))
                .force('y', d3.forceY(d => d.targetY).strength(0.3))

                // B. Fuerza de Colisión (El "Escudo" personal)
                .force('collision', d3.forceCollide()
                    .radius(d => {
                        const area = getNodeSize(d.tipo);
                        const visualRadius = Math.sqrt(area / Math.PI);
                        return visualRadius + 15;
                    })
                    .strength(0.9)
                    .iterations(3)
                )

                // C. Fuerza de Carga (Repulsión global suave para "airear" el gráfico)
                .force('charge', d3.forceManyBody()
                    .strength(-50)
                    .distanceMax(150)
                )
                .alpha(1) // Energía inicial completa
                .alphaDecay(0.05) // Decaimiento más rápido
                .restart();
        } else {
            // Sin simulación: solo posicionar en targets
            this.simulation.nodes(nodeData).stop();
        }

        // 4. MANEJO DEL TICK (Optimizado)
        this.simulation.on('tick', () => {
            // Limitación de bordes (Boundary Constraint)
            // Lo hacemos directamente en el tick para "rebotar" en las paredes
            nodeData.forEach(d => {
                const r = 15; // Margen de seguridad en píxeles
                const minX = this.xScale(-0.95);
                const maxX = this.xScale(0.95);
                const minY = this.yScale(-0.95);
                const maxY = this.yScale(0.95);

                // Clamping suave
                d.x = Math.max(minX + r, Math.min(maxX - r, d.x));
                d.y = Math.max(minY + r, Math.min(maxY - r, d.y));
            });

            // Actualización visual
            nodeElements.attr('transform', d => `translate(${d.x},${d.y})`);
            
            // Actualizar flechas (Si es costoso, hacer cada 2 o 3 ticks)
            this.updateTransitionsDuringMovement();
        });

        // 5. FINALIZACIÓN
        this.simulation.on('end', () => {
             console.log('✅ Simulación estabilizada');
             this.updateTransitionsToFinalPositions();
        });
    }

    // Helper para limpieza del código principal
    appendNodeVisuals(nodeElements) {
        nodeElements.each((d, i, nodes) => {
            const nodeGroup = d3.select(nodes[i]);
            const color = this.colorMap.get(d.id);
            const size = getNodeSize(d.tipo);
            const symbolGenerator = getNodeSymbol(d.tipo, size);
            const borderStyle = getNodeBorderStyle(d.tipo);

            // Draw symbol
            nodeGroup.append('path')
                .attr('d', symbolGenerator)
                .attr('fill', color)
                .attr('stroke', borderStyle.color)
                .attr('stroke-width', borderStyle.width)
                .attr('opacity', borderStyle.opacity)
                .style('cursor', 'pointer')
                .on('mouseenter', (event) => this.onNodeHover(event, d))
                .on('mouseleave', () => this.onNodeLeave());

            // Draw label
            const labelOffset = getLabelOffset(d.tipo);
            nodeGroup.append('text')
                .attr('class', 'node-label')
                .attr('y', labelOffset)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .attr('fill', '#2c3e50')
                .text(d.nombre);
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
     * Update nodes with force simulation for smooth transitions to new positions
     * @param {Array} newNodos - New node data with updated positions
     */
    updateNodesWithTransition(newNodos) {
        // Update simulation nodes with new target positions
        this.simulation.nodes().forEach(node => {
            const newNode = newNodos.find(n => n.id === node.id);
            if (newNode) {
                // Offset minúsculo para evitar división por cero
                const randomOffset = 0.001;
                const offsetX = (Math.random() - 0.5) * randomOffset;
                const offsetY = (Math.random() - 0.5) * randomOffset;

                const normalizedTargetX = Math.max(-1, Math.min(1, newNode.posicion.x + offsetX));
                const normalizedTargetY = Math.max(-1, Math.min(1, newNode.posicion.y + offsetY));

                const pixelTargetX = this.xScale(normalizedTargetX);
                const pixelTargetY = this.yScale(normalizedTargetY);

                // Usamos propiedades personalizadas, NO fx/fy
                node.targetX = pixelTargetX;
                node.targetY = pixelTargetY;

                // fx y fy deben ser null para permitir que la física actúe
                node.fx = null;
                node.fy = null;
            }
        });

        // Siempre actualizar posiciones visuales a nuevos targets
        const transitionDuration = 800;
        const nodes = this.simulation.nodes();

        nodes.forEach(node => {
            const element = this.zoomGroup.select(`.node.${node.id}`);
            if (!element.empty()) {
                element
                    .transition()
                    .duration(transitionDuration)
                    .ease(d3.easeCubicInOut)
                    .attr('transform', `translate(${node.targetX},${node.targetY})`);

                // Actualizar coordenadas del nodo
                node.x = node.targetX;
                node.y = node.targetY;
            }
        });

        // Configuración de la simulación solo si colisiones activadas
        if (this.collisionEnabled) {
            this.simulation
                // A. Fuerza de Posicionamiento (El "Elástico" hacia su lugar ideal)
                .force('x', d3.forceX(d => d.targetX).strength(0.3))
                .force('y', d3.forceY(d => d.targetY).strength(0.3))

                // B. Fuerza de Colisión (El "Escudo" personal)
                .force('collision', d3.forceCollide()
                    .radius(d => {
                        const area = getNodeSize(d.tipo);
                        const visualRadius = Math.sqrt(area / Math.PI);
                        return visualRadius + 15;
                    })
                    .strength(0.9)
                    .iterations(3)
                )

                // C. Fuerza de Carga (Repulsión global suave)
                .force('charge', d3.forceManyBody()
                    .strength(-50)
                    .distanceMax(150)
                )
                .alpha(1)
                .alphaDecay(0.05)
                .restart();

            // Finalización
            this.simulation.on('end', () => {
                console.log('✅ Transición estabilizada con colisiones');
            });
        } else {
            // Sin simulación: solo transición suave a targets
            setTimeout(() => {
                console.log('✅ Transición completada sin colisiones');
            }, transitionDuration);
        }

        console.log('✅ Nodes transitioning with smooth animation');
    }

    /**
     * Update transitions with animated path recalculation
     * @param {Array} newTransiciones - New transition data
     */
    updateTransitionsWithAnimation(newTransiciones) {
        const duration = 800;
        const easing = d3.easeCubicInOut;

        newTransiciones.forEach(transition => {
            const fromNode = this.data.nodos.find(n => n.id === transition.desde_nodo);
            const toNode = this.data.nodos.find(n => n.id === transition.hacia_nodo);

            if (!fromNode || !toNode) return;

            const x1 = this.xScale(fromNode.posicion.x);
            const y1 = this.yScale(fromNode.posicion.y);
            const x2 = this.xScale(toNode.posicion.x);
            const y2 = this.yScale(toNode.posicion.y);

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = x1 + dx / 2;
            const cy = y1 + dy / 2 - 30;

            const newPath = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

            // Animate arrow path
            const arrow = this.zoomGroup.select(`.transition-arrow.${transition.id}`);
            if (!arrow.empty()) {
                arrow
                    .transition()
                    .duration(duration)
                    .ease(easing)
                    .attr('d', newPath);
            }

            // Animate label position
            const label = this.zoomGroup.select(`.transition-label.${transition.id}`);
            if (!label.empty()) {
                label
                    .transition()
                    .duration(duration)
                    .ease(easing)
                    .attr('x', cx)
                    .attr('y', cy);
            }
        });
    }

    /**
     * Update transition arrows during node movement (called on each tick)
     */
    updateTransitionsDuringMovement() {
        if (!this.data.transiciones) return;

        // Get current node positions from the force simulation
        const currentNodePositions = {};
        this.simulation.nodes().forEach(node => {
            // Convert pixel coordinates back to normalized coordinates for scaling
            const normalizedX = this.xScale.invert(node.x);
            const normalizedY = this.yScale.invert(node.y);
            currentNodePositions[node.id] = { x: normalizedX, y: normalizedY };
        });

        this.data.transiciones.forEach(transition => {
            const fromNodePos = currentNodePositions[transition.desde_nodo];
            const toNodePos = currentNodePositions[transition.hacia_nodo];

            if (!fromNodePos || !toNodePos) return;

            // Use current positions for arrow endpoints
            const x1 = this.xScale(fromNodePos.x);
            const y1 = this.yScale(fromNodePos.y);
            const x2 = this.xScale(toNodePos.x);
            const y2 = this.yScale(toNodePos.y);

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = x1 + dx / 2;
            const cy = y1 + dy / 2 - 30;

            const currentPath = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

            // Update arrow path immediately (no animation)
            const arrow = this.zoomGroup.select(`.transition-arrow.${transition.id}`);
            if (!arrow.empty()) {
                arrow.attr('d', currentPath);
            }

            // Update label position immediately
            const label = this.zoomGroup.select(`.transition-label.${transition.id}`);
            if (!label.empty()) {
                label
                    .attr('x', cx)
                    .attr('y', cy);
            }
        });
    }

    /**
     * Update transition arrows to use final node positions after force simulation
     * Uses appropriate positions based on collision state to avoid race conditions
     */
    updateTransitionsToFinalPositions() {
        if (!this.data.transiciones) return;

        console.log('🔄 Updating transition arrows to final node positions...');

        // Get node positions based on collision state to avoid stale data
        const currentNodePositions = {};
        this.simulation.nodes().forEach(node => {
            let normalizedX, normalizedY;

            if (this.collisionEnabled) {
                // When collisions enabled: use current simulation positions
                normalizedX = this.xScale.invert(node.x);
                normalizedY = this.yScale.invert(node.y);
            } else {
                // When collisions disabled: use target positions (more reliable)
                normalizedX = this.xScale.invert(node.targetX);
                normalizedY = this.yScale.invert(node.targetY);
            }

            currentNodePositions[node.id] = { x: normalizedX, y: normalizedY };
        });

        this.data.transiciones.forEach(transition => {
            const fromNodePos = currentNodePositions[transition.desde_nodo];
            const toNodePos = currentNodePositions[transition.hacia_nodo];

            if (!fromNodePos || !toNodePos) return;

            // Use positions for arrow endpoints
            const x1 = this.xScale(fromNodePos.x);
            const y1 = this.yScale(fromNodePos.y);
            const x2 = this.xScale(toNodePos.x);
            const y2 = this.yScale(toNodePos.y);

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = x1 + dx / 2;
            const cy = y1 + dy / 2 - 30;

            const finalPath = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

            // Update arrow path immediately (no animation)
            const arrow = this.zoomGroup.select(`.transition-arrow.${transition.id}`);
            if (!arrow.empty()) {
                arrow.attr('d', finalPath);
            }

            // Update label position immediately
            const label = this.zoomGroup.select(`.transition-label.${transition.id}`);
            if (!label.empty()) {
                label
                    .attr('x', cx)
                    .attr('y', cy);
            }
        });

        console.log('✅ Transition arrows updated to final positions');
    }

    /**
     * Update visualization with new data (for variant switching)
     * @param {Object} newData - New data object
     */
    updateVariant(newData) {
        this.data = newData;
        this.colorMap = assignColorsToNodes(newData.nodos);

        // Update nodes with force simulation for smooth repulsion-aware transitions
        this.updateNodesWithTransition(newData.nodos);
        this.updateTransitionsWithAnimation(newData.transiciones);

        console.log('✅ Variant updated with force simulation');
    }

    /**
     * Detect overlapping nodes (for debugging)
     * @param {Object} positions - Position object
     * @param {number} threshold - Distance threshold
     * @returns {Array} Array of overlapping pairs
     */
    detectOverlaps(positions, threshold = 0.15) {
        const overlaps = [];
        const nodeIds = Object.keys(positions);

        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                const id1 = nodeIds[i];
                const id2 = nodeIds[j];
                const pos1 = positions[id1];
                const pos2 = positions[id2];

                const dx = pos1.x - pos2.x;
                const dy = pos1.y - pos2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < threshold) {
                    overlaps.push([id1, id2, distance]);
                }
            }
        }

        return overlaps;
    }

    /**
     * Set visibility of transition arrows based on selected confidence levels
     * @param {Array<string>} selectedConfidences - Array of confidence levels to show: ['muy_alta', 'alta', 'media']
     */
    setTransitionVisibility(selectedConfidences) {
        const transitionGroup = this.zoomGroup.select('.transitions');

        if (!transitionGroup || transitionGroup.empty()) {
            console.warn('Transition group not found');
            return;
        }

        // If no confidences selected, hide all transitions
        if (!selectedConfidences || selectedConfidences.length === 0) {
            transitionGroup.style('display', 'none');
            console.log('✅ Transition visibility: none selected');
            return;
        }

        // Show transition group and filter by selected confidences
        transitionGroup.style('display', null);
        this.data.transiciones.forEach(transition => {
            const display = selectedConfidences.includes(transition.confianza) ? null : 'none';
            transitionGroup.select(`.transition-arrow.${transition.id}`).style('display', display);
            transitionGroup.select(`.transition-label.${transition.id}`).style('display', display);
        });

        console.log(`✅ Transition visibility set to: ${selectedConfidences.join(', ')}`);
    }
}
