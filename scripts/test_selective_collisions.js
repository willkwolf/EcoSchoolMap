/**
 * Test script for selective collision avoidance
 * Tests the fix for charge force remaining active during selective collision
 */

import { JSDOM } from 'jsdom';
import * as d3 from 'd3';
import * as fs from 'fs';
import { calculateVariant, mergeVariantWithBase } from '../src/data/loader.js';

// Setup jsdom
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Load data directly
function loadBaseData() {
    const data = JSON.parse(fs.readFileSync('data/escuelas.json', 'utf8'));
    return data;
}

function loadVariantData(preset, normalization) {
    const baseData = loadBaseData();
    const variantData = calculateVariant(baseData, preset, normalization);
    const mergedData = mergeVariantWithBase(variantData, baseData);
    return mergedData;
}

class SelectiveCollisionTester {
    constructor(D3MapRendererClass) {
        this.D3MapRenderer = D3MapRendererClass;
        this.renderer = null;
        this.container = null;
        this.testData = null;
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

        // Load pragmatic-emphasis zscore variant
        console.log('Loading pragmatic-emphasis zscore variant...');
        this.testData = loadVariantData('pragmatic-emphasis', 'zscore');
        console.log('Data loaded:', this.testData.metadata.variant_name);

        // Initialize renderer
        this.renderer = new this.D3MapRenderer('#test-container', this.testData, {
            width: 1200,
            height: 700,
            padding: 60
        });

        // Render without collisions first
        this.renderer.render();
        this.renderer.setCollisionEnabled(false);

        console.log('✅ Test environment initialized');
    }

    /**
     * Wait for specified milliseconds
     */
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Capture current normalized positions
     */
    captureNormalizedPositions() {
        const positions = {};
        this.renderer.simulation.nodes().forEach(node => {
            positions[node.id] = {
                x: this.renderer.xScale.invert(node.x),
                y: this.renderer.yScale.invert(node.y),
                targetX: this.renderer.xScale.invert(node.targetX),
                targetY: this.renderer.yScale.invert(node.targetY)
            };
        });
        return positions;
    }

    /**
     * Calculate displacement between two position sets
     */
    calculateDisplacements(before, after) {
        const displacements = {};
        Object.keys(before).forEach(nodeId => {
            if (after[nodeId]) {
                const b = before[nodeId];
                const a = after[nodeId];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                displacements[nodeId] = Math.sqrt(dx * dx + dy * dy);
            }
        });
        return displacements;
    }

    /**
     * Test selective collision for a specific variant
     */
    async testSelectiveCollisionForVariant(preset, normalization) {
        console.log(`\n🧪 Testing ${preset}-${normalization}`);

        // Load variant
        const testData = loadVariantData(preset, normalization);

        // Reinitialize renderer with new data
        this.container.selectAll('*').remove();
        this.renderer = new this.D3MapRenderer('#test-container', testData, {
            width: 1200,
            height: 700,
            padding: 60
        });
        this.renderer.render();
        this.renderer.setCollisionEnabled(false);

        await this.wait(500); // Wait for render

        // Step 1: Capture baseline positions (collisions disabled)
        const baselinePositions = this.captureNormalizedPositions();

        // Step 2: Enable collisions
        this.renderer.setCollisionEnabled(true);
        await this.wait(500); // Wait for adjustment

        // Step 3: Capture post-collision positions
        const collisionPositions = this.captureNormalizedPositions();

        // Step 4: Calculate displacements
        const displacements = this.calculateDisplacements(baselinePositions, collisionPositions);

        const displacementValues = Object.values(displacements);
        const avgDisplacement = displacementValues.reduce((a, b) => a + b, 0) / displacementValues.length;
        const maxDisplacement = Math.max(...displacementValues);

        // Check for boundary violations
        const boundaryViolations = Object.values(collisionPositions).filter(pos =>
            Math.abs(pos.x) > 1.0 || Math.abs(pos.y) > 1.0
        ).length;

        // Check for issues
        const largeDisplacements = Object.entries(displacements).filter(([id, d]) => d > 0.1).length;
        const disappeared = Object.entries(displacements).filter(([id, d]) => d > 1.0).length;

        console.log(`  ${preset}-${normalization}: Avg ${avgDisplacement.toFixed(3)}, Max ${maxDisplacement.toFixed(3)}, Large ${largeDisplacements}, Disappeared ${disappeared}, Boundary violations ${boundaryViolations}`);

        return {
            variant: `${preset}-${normalization}`,
            avgDisplacement,
            maxDisplacement,
            largeDisplacements,
            disappeared,
            boundaryViolations,
            passed: disappeared === 0 && largeDisplacements <= 2 && boundaryViolations === 0 // No boundary violations allowed
        };
    }

    /**
     * Run comprehensive test across all variants
     */
    async runComprehensiveTest() {
        console.log('🚀 Starting Comprehensive Selective Collision Test');

        const presets = ['base', 'state-emphasis', 'equity-emphasis', 'market-emphasis', 'growth-emphasis', 'historical-emphasis', 'pragmatic-emphasis'];
        const normalizations = ['none', 'zscore', 'percentile', 'minmax'];

        const results = [];
        let passed = 0;
        let failed = 0;

        try {
            await this.init(); // Initialize with default

            for (const preset of presets) {
                for (const normalization of normalizations) {
                    try {
                        const result = await this.testSelectiveCollisionForVariant(preset, normalization);
                        results.push(result);
                        if (result.passed) {
                            passed++;
                        } else {
                            failed++;
                        }
                    } catch (error) {
                        console.error(`❌ Error testing ${preset}-${normalization}:`, error);
                        results.push({
                            variant: `${preset}-${normalization}`,
                            error: error.message,
                            passed: false
                        });
                        failed++;
                    }
                }
            }

            console.log('\n📋 COMPREHENSIVE TEST RESULTS:');
            console.log(`Total variants tested: ${results.length}`);
            console.log(`Passed: ${passed}`);
            console.log(`Failed: ${failed}`);

            if (failed > 0) {
                console.log('\n❌ Failed variants:');
                results.filter(r => !r.passed).forEach(r => {
                    console.log(`  ${r.variant}: ${r.error || `Large ${r.largeDisplacements}, Disappeared ${r.disappeared}, Boundary violations ${r.boundaryViolations}`}`);
                });
            }

            if (passed === results.length) {
                console.log('✅ ALL TESTS PASSED: Selective collision working across all variants');
            } else {
                console.log('⚠️ SOME TESTS FAILED: Review failed variants');
            }

        } catch (error) {
            console.error('❌ Test suite failed:', error);
        } finally {
            this.cleanup();
        }
    }

    /**
     * Cleanup
     */
    cleanup() {
        if (this.container) {
            this.container.remove();
        }
        console.log('🧹 Test environment cleaned up');
    }
}

// Import D3MapRenderer dynamically
import('../src/components/D3MapRenderer.js').then(async module => {
    const { D3MapRenderer } = module;

    // Run comprehensive test
    const tester = new SelectiveCollisionTester(D3MapRenderer);
    await tester.runComprehensiveTest();
    console.log('✅ Comprehensive test completed');
    process.exit(0);
}).catch(error => {
    console.error('❌ Failed to import D3MapRenderer:', error);
    process.exit(1);
});