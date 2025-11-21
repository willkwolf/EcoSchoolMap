/**
 * Test Framework for D3MapRenderer Force Simulation
 *
 * Tests node displacement and collision behavior after force simplifications:
 * - Collision strength: 0.9 → 0.4
 * - Charge strength: -50 → -15
 * - Added gentle centering forces
 * - Reduced positioning strength when collisions enabled
 */

import * as d3 from 'd3';
import { D3MapRenderer } from '../src/components/D3MapRenderer.js';

// Sample test data with overlapping nodes
const SAMPLE_NODES = [
    { id: 'marxista', nombre: 'Marxista', tipo: 'principal', posicion: { x: 0.0, y: 0.0 } },
    { id: 'keynesiana', nombre: 'Keynesiana', tipo: 'principal', posicion: { x: 0.1, y: 0.1 } },
    { id: 'neoclasica', nombre: 'Neoclásica', tipo: 'principal', posicion: { x: -0.1, y: -0.1 } },
    { id: 'austriaca', nombre: 'Austriaca', tipo: 'secundaria', posicion: { x: 0.05, y: 0.05 } },
    { id: 'estructuralista', nombre: 'Estructuralista', tipo: 'secundaria', posicion: { x: -0.05, y: -0.05 } },
    { id: 'post_keynesiana', nombre: 'Post-Keynesiana', tipo: 'secundaria', posicion: { x: 0.0, y: 0.2 } }
];

const SAMPLE_TRANSITIONS = [
    { id: 't1', desde_nodo: 'marxista', hacia_nodo: 'keynesiana', año: 1936, confianza: 'alta' }
];

class ForceSimulationTester {
    constructor() {
        this.renderer = null;
        this.container = null;
        this.testResults = [];
    }

    /**
     * Initialize test environment
     */
    async init() {
        // Create test container
        this.container = d3.select('body').append('div')
            .attr('id', 'test-container')
            .style('position', 'absolute')
            .style('left', '-9999px')
            .style('top', '-9999px')
            .style('width', '1200px')
            .style('height', '700px');

        // Create mock data
        const testData = {
            nodos: SAMPLE_NODES,
            transiciones: SAMPLE_TRANSITIONS,
            metadata: { last_updated: '2025-11-21T02:54:00.000000', engine_version: 'v8.1 (Test)', weights_preset: 'test' },
            mapeo_visual: {},
            leyenda_pedagogica: {}
        };

        // Initialize renderer
        this.renderer = new D3MapRenderer('#test-container', testData, {
            width: 1200,
            height: 700,
            padding: 60
        });

        console.log('✅ Test environment initialized');
    }

    /**
     * Utility: Calculate distance between two points
     */
    distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Utility: Calculate average displacement
     */
    calculateAverageDisplacement(initialPositions, currentPositions) {
        let totalDisplacement = 0;
        let count = 0;

        Object.keys(initialPositions).forEach(nodeId => {
            if (currentPositions[nodeId]) {
                const displacement = this.distance(initialPositions[nodeId], currentPositions[nodeId]);
                totalDisplacement += displacement;
                count++;
            }
        });

        return count > 0 ? totalDisplacement / count : 0;
    }

    /**
     * Utility: Calculate position variance
     */
    calculatePositionVariance(positions) {
        const values = Object.values(positions);
        if (values.length === 0) return 0;

        const meanX = values.reduce((sum, pos) => sum + pos.x, 0) / values.length;
        const meanY = values.reduce((sum, pos) => sum + pos.y, 0) / values.length;

        const variance = values.reduce((sum, pos) => {
            const dx = pos.x - meanX;
            const dy = pos.y - meanY;
            return sum + (dx * dx + dy * dy);
        }, 0) / values.length;

        return variance;
    }

    /**
     * Capture current node positions
     */
    captureNodePositions() {
        const positions = {};
        this.renderer.simulation.nodes().forEach(node => {
            positions[node.id] = {
                x: node.x,
                y: node.y,
                targetX: node.targetX,
                targetY: node.targetY
            };
        });
        return positions;
    }

    /**
     * Wait for specified milliseconds
     */
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Test 1: Toggle On/Off Displacement Measurement
     */
    async testToggleOnOff() {
        console.log('\n🧪 Test 1: Toggle On/Off Displacement Measurement');

        const results = {
            test: 'toggle_on_off',
            scenarios: []
        };

        // Scenario 1: Start with collisions OFF
        console.log('📊 Scenario 1: Collisions OFF (baseline)');
        this.renderer.setCollisionEnabled(false);
        await this.wait(2000); // Wait for stabilization

        const baselinePositions = this.captureNodePositions();
        const baselineDisplacement = this.calculateAverageDisplacement(baselinePositions, baselinePositions);
        const baselineVariance = this.calculatePositionVariance(baselinePositions);

        results.scenarios.push({
            name: 'collisions_off_baseline',
            initialDisplacement: baselineDisplacement,
            finalVariance: baselineVariance,
            positions: baselinePositions
        });

        // Scenario 2: Toggle ON and measure displacement over time
        console.log('📊 Scenario 2: Toggle Collisions ON');
        const preTogglePositions = this.captureNodePositions();
        this.renderer.setCollisionEnabled(true);

        const timeIntervals = [1000, 2000, 5000, 10000];
        const onScenarios = [];

        for (const interval of timeIntervals) {
            await this.wait(interval);
            const currentPositions = this.captureNodePositions();
            const avgDisplacement = this.calculateAverageDisplacement(preTogglePositions, currentPositions);
            const variance = this.calculatePositionVariance(currentPositions);

            onScenarios.push({
                timeMs: interval,
                avgDisplacement,
                variance,
                positions: currentPositions
            });

            console.log(`   ${interval}ms: Avg displacement = ${avgDisplacement.toFixed(2)}px, Variance = ${variance.toFixed(4)}`);
        }

        results.scenarios.push({
            name: 'collisions_on_progression',
            preTogglePositions,
            timeSeries: onScenarios
        });

        // Scenario 3: Toggle OFF again and measure return to baseline
        console.log('📊 Scenario 3: Toggle Collisions OFF (return to baseline)');
        const preOffTogglePositions = this.captureNodePositions();
        this.renderer.setCollisionEnabled(false);

        await this.wait(2000); // Wait for stabilization
        const finalPositions = this.captureNodePositions();
        const returnDisplacement = this.calculateAverageDisplacement(preOffTogglePositions, finalPositions);
        const finalVariance = this.calculatePositionVariance(finalPositions);

        results.scenarios.push({
            name: 'collisions_off_return',
            preTogglePositions: preOffTogglePositions,
            finalPositions,
            returnDisplacement,
            finalVariance
        });

        console.log(`   Return displacement: ${returnDisplacement.toFixed(2)}px, Final variance: ${finalVariance.toFixed(4)}`);

        this.testResults.push(results);
        return results;
    }

    /**
     * Test 2: Collision Scenarios Comparison (Soft vs Aggressive)
     */
    async testCollisionScenarios() {
        console.log('\n🧪 Test 2: Collision Scenarios Comparison');

        const results = {
            test: 'collision_scenarios',
            softParams: {
                collisionStrength: 0.4,
                chargeStrength: -15,
                positioningStrength: 0.15,
                hasCentering: true
            },
            aggressiveParams: {
                collisionStrength: 0.9,
                chargeStrength: -50,
                positioningStrength: 0.3,
                hasCentering: false
            },
            comparisons: []
        };

        // Test with SOFT parameters (current implementation)
        console.log('📊 Testing SOFT parameters (current implementation)');
        this.renderer.setCollisionEnabled(false);
        await this.wait(1000);

        const softPrePositions = this.captureNodePositions();
        this.renderer.setCollisionEnabled(true);

        // Temporarily modify renderer to use soft parameters
        await this.wait(5000); // Let simulation stabilize
        const softPostPositions = this.captureNodePositions();
        const softDisplacement = this.calculateAverageDisplacement(softPrePositions, softPostPositions);
        const softVariance = this.calculatePositionVariance(softPostPositions);

        console.log(`   Soft - Displacement: ${softDisplacement.toFixed(2)}px, Variance: ${softVariance.toFixed(4)}`);

        // Test with AGGRESSIVE parameters (previous implementation)
        console.log('📊 Testing AGGRESSIVE parameters (previous implementation)');
        this.renderer.setCollisionEnabled(false);
        await this.wait(1000);

        // Temporarily override forces to aggressive parameters
        this.renderer.simulation
            .force('collision', d3.forceCollide()
                .radius(d => {
                    const area = this.renderer.getNodeSize(d.tipo);
                    const visualRadius = Math.sqrt(area / Math.PI);
                    return visualRadius + 15;
                })
                .strength(0.9)
                .iterations(4)
            )
            .force('charge', d3.forceManyBody()
                .strength(-50)
                .distanceMax(150)
            )
            .force('x', d3.forceX(d => d.targetX).strength(0.3))
            .force('y', d3.forceY(d => d.targetY).strength(0.3));

        // Remove centering forces
        this.renderer.simulation
            .force('centerX', null)
            .force('centerY', null);

        this.renderer.simulation.alpha(1).restart();

        const aggressivePrePositions = this.captureNodePositions();
        await this.wait(5000); // Let simulation stabilize
        const aggressivePostPositions = this.captureNodePositions();
        const aggressiveDisplacement = this.calculateAverageDisplacement(aggressivePrePositions, aggressivePostPositions);
        const aggressiveVariance = this.calculatePositionVariance(aggressivePostPositions);

        console.log(`   Aggressive - Displacement: ${aggressiveDisplacement.toFixed(2)}px, Variance: ${aggressiveVariance.toFixed(4)}`);

        // Compare results
        const displacementDifference = Math.abs(softDisplacement - aggressiveDisplacement);
        const displacementPercentDiff = aggressiveDisplacement > 0 ?
            (displacementDifference / aggressiveDisplacement) * 100 : 0;

        const varianceDifference = Math.abs(softVariance - aggressiveVariance);
        const variancePercentDiff = aggressiveVariance > 0 ?
            (varianceDifference / aggressiveVariance) * 100 : 0;

        results.comparisons.push({
            soft: {
                displacement: softDisplacement,
                variance: softVariance,
                positions: softPostPositions
            },
            aggressive: {
                displacement: aggressiveDisplacement,
                variance: aggressiveVariance,
                positions: aggressivePostPositions
            },
            differences: {
                displacement: displacementDifference,
                displacementPercent: displacementPercentDiff,
                variance: varianceDifference,
                variancePercent: variancePercentDiff
            }
        });

        console.log(`   Comparison - Displacement diff: ${displacementPercentDiff.toFixed(1)}%, Variance diff: ${variancePercentDiff.toFixed(1)}%`);

        // Check if soft parameters meet stability criteria (< 20% difference)
        const stabilityCriteria = {
            displacementStability: displacementPercentDiff < 20,
            varianceStability: variancePercentDiff < 20
        };

        results.stabilityCriteria = stabilityCriteria;
        console.log(`   Stability criteria met: Displacement=${stabilityCriteria.displacementStability ? '✅' : '❌'}, Variance=${stabilityCriteria.varianceStability ? '✅' : '❌'}`);

        this.testResults.push(results);
        return results;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🚀 Starting D3MapRenderer Force Simulation Tests');

        try {
            await this.init();

            const toggleResults = await this.testToggleOnOff();
            const collisionResults = await this.testCollisionScenarios();

            console.log('\n📊 Test Results Summary:');
            console.log('Toggle Test:', toggleResults.scenarios.length, 'scenarios completed');
            console.log('Collision Comparison:', collisionResults.comparisons.length, 'comparisons completed');

            // Generate report
            this.generateReport();

        } catch (error) {
            console.error('❌ Test execution failed:', error);
        } finally {
            this.cleanup();
        }
    }

    /**
     * Generate comprehensive test report
     */
    generateReport() {
        console.log('\n📋 COMPREHENSIVE TEST REPORT');
        console.log('='.repeat(50));

        this.testResults.forEach((result, index) => {
            console.log(`\nTest ${index + 1}: ${result.test.toUpperCase()}`);

            if (result.test === 'toggle_on_off') {
                result.scenarios.forEach(scenario => {
                    console.log(`  ${scenario.name}:`);
                    if (scenario.timeSeries) {
                        scenario.timeSeries.forEach(point => {
                            console.log(`    ${point.timeMs}ms: ${point.avgDisplacement.toFixed(2)}px displacement`);
                        });
                    } else {
                        console.log(`    Variance: ${scenario.finalVariance.toFixed(4)}`);
                    }
                });
            }

            if (result.test === 'collision_scenarios') {
                const comp = result.comparisons[0];
                console.log(`  Soft params: ${comp.soft.displacement.toFixed(2)}px displacement`);
                console.log(`  Aggressive params: ${comp.aggressive.displacement.toFixed(2)}px displacement`);
                console.log(`  Difference: ${comp.differences.displacementPercent.toFixed(1)}%`);
                console.log(`  Stability criteria: ${result.stabilityCriteria.displacementStability ? '✅' : '❌'} displacement, ${result.stabilityCriteria.varianceStability ? '✅' : '❌'} variance`);
            }
        });

        console.log('\n🎯 RECOMMENDATIONS:');
        const lastResult = this.testResults[this.testResults.length - 1];
        if (lastResult?.stabilityCriteria) {
            if (lastResult.stabilityCriteria.displacementStability && lastResult.stabilityCriteria.varianceStability) {
                console.log('✅ Soft parameters provide stable collision behavior with minimal displacement differences');
            } else {
                console.log('⚠️  Consider adjusting force parameters for better stability');
            }
        }
    }

    /**
     * Cleanup test environment
     */
    cleanup() {
        if (this.container) {
            this.container.remove();
        }
        console.log('🧹 Test environment cleaned up');
    }
}

// Export for use in test runner
export { ForceSimulationTester };

// Auto-run if executed directly
if (typeof window !== 'undefined' && window.location) {
    // Browser environment - run tests
    const tester = new ForceSimulationTester();
    tester.runAllTests().then(() => {
        console.log('✅ All tests completed');
    });
}