/**
 * Production Toggle Test - Validates collision toggle with real data
 * Tests displacement thresholds and validates against production behavior
 */

import * as d3 from 'd3';
import * as fs from 'fs';

// Load real data from escuelas.json
const escuelasData = JSON.parse(fs.readFileSync('data/escuelas.json', 'utf8'));

// Extract nodes from real data
const SAMPLE_NODES = escuelasData.nodos || [];
const SAMPLE_TRANSITIONS = escuelasData.transiciones || [];

// Scale configuration (matching D3MapRenderer)
const SCALE_CONFIG = {
    width: 1200,
    height: 700,
    padding: 60
};

class ProductionToggleTester {
    constructor() {
        this.testResults = [];
        this.xScale = d3.scaleLinear().domain([-1.1, 1.1]).range([SCALE_CONFIG.padding, SCALE_CONFIG.width - SCALE_CONFIG.padding]);
        this.yScale = d3.scaleLinear().domain([-1.1, 1.1]).range([SCALE_CONFIG.height - SCALE_CONFIG.padding, SCALE_CONFIG.padding]);
        console.log(`📊 Loaded ${SAMPLE_NODES.length} real nodes from escuelas.json`);
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
     * Create node data with pixel coordinates (matching D3MapRenderer logic)
     */
    createNodeData(nodes) {
        return nodes.map(node => {
            const randomOffset = 0.001;
            const offsetX = (Math.random() - 0.5) * randomOffset;
            const offsetY = (Math.random() - 0.5) * randomOffset;

            const normalizedTargetX = Math.max(-1, Math.min(1, node.posicion.x + offsetX));
            const normalizedTargetY = Math.max(-1, Math.min(1, node.posicion.y + offsetY));

            const pixelTargetX = this.xScale(normalizedTargetX);
            const pixelTargetY = this.yScale(normalizedTargetY);

            return {
                ...node,
                x: pixelTargetX,
                y: pixelTargetY,
                targetX: pixelTargetX,
                targetY: pixelTargetY,
                fx: null,
                fy: null
            };
        });
    }

    /**
     * Get node size (simplified version)
     */
    getNodeSize(tipo) {
        const sizes = {
            'principal': 1200,
            'secundaria': 800,
            'terciaria': 500
        };
        return sizes[tipo] || 800;
    }

    /**
     * Create simulation with CURRENT optimized parameters (from D3MapRenderer)
     */
    createCurrentOptimizedSimulation(nodeData) {
        const simulation = d3.forceSimulation(nodeData)
            // Positioning forces (reduced when collisions enabled)
            .force('x', d3.forceX(d => d.targetX).strength(0.15))
            .force('y', d3.forceY(d => d.targetY).strength(0.15))

            // Collision forces (current optimized parameters)
            .force('collision', d3.forceCollide()
                .radius(d => {
                    const area = this.getNodeSize(d.tipo);
                    const visualRadius = Math.sqrt(area / Math.PI);
                    return visualRadius + 8;
                })
                .strength(0.4)
                .iterations(2)
            )

            // Charge forces (current optimized)
            .force('charge', d3.forceManyBody()
                .strength(-15)
                .distanceMax(100)
            )

            // Centering forces (current optimized)
            .force('centerX', d3.forceX(d => d.targetX).strength(0.12))
            .force('centerY', d3.forceY(d => d.targetY).strength(0.12))

            .alpha(0.6)
            .alphaDecay(0.08)
            .velocityDecay(0.3);

        return simulation;
    }

    /**
     * Create simulation WITHOUT collision forces (baseline)
     */
    createBaselineSimulation(nodeData) {
        const simulation = d3.forceSimulation(nodeData)
            // Only positioning forces (no collisions)
            .force('x', d3.forceX(d => d.targetX).strength(0.3))
            .force('y', d3.forceY(d => d.targetY).strength(0.3))
            .alpha(0.6)
            .alphaDecay(0.05)
            .velocityDecay(0.3);

        return simulation;
    }

    /**
     * Run simulation for specified ticks
     */
    async runSimulation(simulation, ticks = 100) {
        return new Promise((resolve) => {
            let tickCount = 0;

            simulation.on('tick', () => {
                tickCount++;
                if (tickCount >= ticks) {
                    simulation.stop();
                    resolve(simulation.nodes());
                }
            });

            simulation.restart();
        });
    }

    /**
     * Capture positions from node data
     */
    capturePositions(nodes) {
        const positions = {};
        nodes.forEach(node => {
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
     * Analyze displacement and check thresholds
     */
    analyzeDisplacement(before, after, threshold = 5) {
        let totalDisplacement = 0;
        let maxDisplacement = 0;
        let displacements = {};
        let nodesExceedingThreshold = [];
        let largeXMoves = [];
        let largeYMoves = [];

        Object.keys(before).forEach(nodeId => {
            if (after[nodeId]) {
                const b = before[nodeId];
                const a = after[nodeId];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const displacement = Math.sqrt(dx * dx + dy * dy);

                displacements[nodeId] = {
                    displacement,
                    dx,
                    dy,
                    before: { x: b.x, y: b.y },
                    after: { x: a.x, y: a.y }
                };

                totalDisplacement += displacement;
                maxDisplacement = Math.max(maxDisplacement, displacement);

                if (displacement > threshold) {
                    nodesExceedingThreshold.push({
                        id: nodeId,
                        displacement,
                        dx,
                        dy
                    });
                }

                // Check for large axis-specific movements
                if (Math.abs(dx) > threshold) {
                    largeXMoves.push({ id: nodeId, dx, displacement });
                }
                if (Math.abs(dy) > threshold) {
                    largeYMoves.push({ id: nodeId, dy, displacement });
                }
            }
        });

        const avgDisplacement = totalDisplacement / Object.keys(before).length;

        return {
            avgDisplacement,
            maxDisplacement,
            totalDisplacement,
            nodesExceedingThreshold,
            largeXMoves,
            largeYMoves,
            displacements,
            thresholdExceeded: nodesExceedingThreshold.length > 0,
            xAxisIssue: largeXMoves.length > 0,
            yAxisIssue: largeYMoves.length > 0
        };
    }

    /**
     * Test 1: Toggle On/Off with Real Data
     */
    async testToggleWithRealData() {
        console.log('\n🧪 Test 1: Toggle On/Off with Real Data');

        const results = {
            test: 'toggle_real_data',
            scenarios: []
        };

        // Create node data from real escuelas.json
        const nodeData = this.createNodeData(SAMPLE_NODES);
        console.log(`📊 Testing with ${nodeData.length} nodes from real data`);

        // Scenario 1: Baseline (no collisions)
        console.log('📍 Scenario 1: Baseline (no collisions)');
        const baselineSimulation = this.createBaselineSimulation(nodeData);
        const baselineNodes = await this.runSimulation(baselineSimulation, 50);
        const baselinePositions = this.capturePositions(baselineNodes);

        results.scenarios.push({
            name: 'baseline_no_collisions',
            positions: baselinePositions,
            nodeCount: baselineNodes.length
        });

        // Scenario 2: Toggle ON (with optimized collision forces)
        console.log('📍 Scenario 2: Toggle ON (optimized collision forces)');
        const collisionNodeData = nodeData.map(n => ({ ...n })); // Clone for collision test
        const collisionSimulation = this.createCurrentOptimizedSimulation(collisionNodeData);
        const collisionNodes = await this.runSimulation(collisionSimulation, 100);
        const collisionPositions = this.capturePositions(collisionNodes);

        // Analyze displacement from baseline to collision-enabled
        const displacementAnalysis = this.analyzeDisplacement(baselinePositions, collisionPositions, 5);

        console.log(`📊 Displacement Analysis:`);
        console.log(`   Average displacement: ${displacementAnalysis.avgDisplacement.toFixed(2)}px`);
        console.log(`   Max displacement: ${displacementAnalysis.maxDisplacement.toFixed(2)}px`);
        console.log(`   Nodes exceeding 5px threshold: ${displacementAnalysis.nodesExceedingThreshold.length}`);
        console.log(`   Large X-axis moves: ${displacementAnalysis.largeXMoves.length}`);
        console.log(`   Large Y-axis moves: ${displacementAnalysis.largeYMoves.length}`);

        if (displacementAnalysis.thresholdExceeded) {
            console.log('⚠️ DISPLACEMENT ISSUES DETECTED:');
            displacementAnalysis.nodesExceedingThreshold.slice(0, 5).forEach(node => {
                console.log(`   ${node.id}: ${node.displacement.toFixed(2)}px (${node.dx.toFixed(1)}, ${node.dy.toFixed(1)})`);
            });
        } else {
            console.log('✅ All displacements within acceptable limits (< 5px)');
        }

        results.scenarios.push({
            name: 'collision_enabled',
            positions: collisionPositions,
            displacementAnalysis,
            nodeCount: collisionNodes.length
        });

        // Scenario 3: Toggle OFF again (return to baseline)
        console.log('📍 Scenario 3: Toggle OFF (return to baseline)');
        const returnNodeData = collisionNodeData.map(n => ({ ...n })); // Clone
        const returnSimulation = this.createBaselineSimulation(returnNodeData);
        const returnNodes = await this.runSimulation(returnSimulation, 50);
        const returnPositions = this.capturePositions(returnNodes);

        const returnDisplacementAnalysis = this.analyzeDisplacement(collisionPositions, returnPositions, 5);

        console.log(`📊 Return Displacement Analysis:`);
        console.log(`   Average displacement: ${returnDisplacementAnalysis.avgDisplacement.toFixed(2)}px`);
        console.log(`   Max displacement: ${returnDisplacementAnalysis.maxDisplacement.toFixed(2)}px`);

        results.scenarios.push({
            name: 'collision_disabled_return',
            positions: returnPositions,
            displacementAnalysis: returnDisplacementAnalysis,
            nodeCount: returnNodes.length
        });

        // Overall assessment
        const overallAssessment = {
            acceptableDisplacement: displacementAnalysis.avgDisplacement < 3,
            noLargeMoves: !displacementAnalysis.thresholdExceeded,
            stableToggle: returnDisplacementAnalysis.avgDisplacement < 2,
            noAxisIssues: !displacementAnalysis.xAxisIssue && !displacementAnalysis.yAxisIssue
        };

        results.overallAssessment = overallAssessment;

        console.log('\n🎯 OVERALL ASSESSMENT:');
        console.log(`   Acceptable displacement (< 3px): ${overallAssessment.acceptableDisplacement ? '✅' : '❌'}`);
        console.log(`   No large moves (> 5px): ${overallAssessment.noLargeMoves ? '✅' : '❌'}`);
        console.log(`   Stable toggle behavior: ${overallAssessment.stableToggle ? '✅' : '❌'}`);
        console.log(`   No axis alignment issues: ${overallAssessment.noAxisIssues ? '✅' : '❌'}`);

        const allGood = Object.values(overallAssessment).every(v => v);
        console.log(`\n${allGood ? '✅ PRODUCTION READY' : '⚠️ REQUIRES FIXES'}: Toggle behavior ${allGood ? 'meets' : 'does not meet'} production standards`);

        this.testResults.push(results);
        return results;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🚀 Starting Production Toggle Tests with Real Data');

        try {
            const toggleResults = await this.testToggleWithRealData();

            console.log('\n📊 Test Results Summary:');
            console.log('Toggle Test:', toggleResults.scenarios.length, 'scenarios completed');

            // Generate comprehensive report
            this.generateReport();

        } catch (error) {
            console.error('❌ Test execution failed:', error);
            console.error(error.stack);
        }
    }

    /**
     * Generate comprehensive test report
     */
    generateReport() {
        console.log('\n📋 PRODUCTION VALIDATION REPORT');
        console.log('='.repeat(60));

        this.testResults.forEach((result, index) => {
            console.log(`\nTest ${index + 1}: ${result.test.replace('_', ' ').toUpperCase()}`);

            if (result.test === 'toggle_real_data') {
                result.scenarios.forEach(scenario => {
                    console.log(`  ${scenario.name}:`);
                    if (scenario.displacementAnalysis) {
                        const da = scenario.displacementAnalysis;
                        console.log(`    Avg displacement: ${da.avgDisplacement.toFixed(2)}px`);
                        console.log(`    Max displacement: ${da.maxDisplacement.toFixed(2)}px`);
                        console.log(`    Threshold exceeded: ${da.thresholdExceeded ? '⚠️ YES' : '✅ NO'}`);
                        console.log(`    Large X moves: ${da.largeXMoves.length}, Y moves: ${da.largeYMoves.length}`);
                    } else {
                        console.log(`    Node count: ${scenario.nodeCount}`);
                    }
                });

                if (result.overallAssessment) {
                    const oa = result.overallAssessment;
                    console.log(`\n  OVERALL ASSESSMENT:`);
                    console.log(`    Acceptable displacement: ${oa.acceptableDisplacement ? '✅' : '❌'}`);
                    console.log(`    No large moves: ${oa.noLargeMoves ? '✅' : '❌'}`);
                    console.log(`    Stable toggle: ${oa.stableToggle ? '✅' : '❌'}`);
                    console.log(`    No axis issues: ${oa.noAxisIssues ? '✅' : '❌'}`);
                }
            }
        });

        console.log('\n🎯 PRODUCTION READINESS:');

        const toggleResult = this.testResults.find(r => r.test === 'toggle_real_data');
        if (toggleResult?.overallAssessment) {
            const allAssessments = Object.values(toggleResult.overallAssessment);
            const productionReady = allAssessments.every(v => v);

            console.log(`Production Ready: ${productionReady ? '✅ YES' : '❌ NO'}`);

            if (!productionReady) {
                console.log('\nRequired fixes:');
                const issues = [];
                if (!toggleResult.overallAssessment.acceptableDisplacement) issues.push('Reduce average displacement');
                if (!toggleResult.overallAssessment.noLargeMoves) issues.push('Fix nodes exceeding 5px threshold');
                if (!toggleResult.overallAssessment.stableToggle) issues.push('Improve toggle stability');
                if (!toggleResult.overallAssessment.noAxisIssues) issues.push('Resolve axis alignment issues');

                issues.forEach(issue => console.log(`  - ${issue}`));
            }
        }
    }
}

// Run tests if executed directly
if (typeof process !== 'undefined' && process.argv) {
    const tester = new ProductionToggleTester();
    tester.runAllTests().then(() => {
        console.log('\n✅ Production validation tests completed');
        process.exit(0);
    }).catch((error) => {
        console.error('\n❌ Tests failed:', error);
        process.exit(1);
    });
}

export { ProductionToggleTester };