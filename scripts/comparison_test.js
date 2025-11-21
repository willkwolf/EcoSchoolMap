/**
 * Force Simulation Comparison Test
 * Compare soft vs aggressive parameters
 */

import * as d3 from 'd3';

// Test data with overlapping nodes
const nodes = [
    { id: 'A', x: 100, y: 100, targetX: 100, targetY: 100 },
    { id: 'B', x: 105, y: 105, targetX: 200, targetY: 200 }, // Close to A initially
    { id: 'C', x: 110, y: 110, targetX: 300, targetY: 100 }  // Close to B initially
];

console.log('🧪 Comparing Soft vs Aggressive Force Parameters');

async function runSimulationWithParams(params, label) {
    console.log(`\n📊 Testing ${label} parameters:`);
    console.log(`  Collision strength: ${params.collisionStrength}`);
    console.log(`  Charge strength: ${params.chargeStrength}`);
    console.log(`  Positioning strength: ${params.positioningStrength}`);
    console.log(`  Has centering: ${params.hasCentering}`);

    // Clone nodes for each test
    const testNodes = nodes.map(n => ({ ...n }));

    const simulation = d3.forceSimulation(testNodes)
        .force('x', d3.forceX(d => d.targetX).strength(params.positioningStrength))
        .force('y', d3.forceY(d => d.targetY).strength(params.positioningStrength))
        .force('collision', d3.forceCollide()
            .radius(25)
            .strength(params.collisionStrength)
            .iterations(params.collisionStrength > 0.5 ? 4 : 2)
        )
        .force('charge', d3.forceManyBody()
            .strength(params.chargeStrength)
            .distanceMax(params.chargeStrength < -30 ? 150 : 100)
        );

    if (params.hasCentering) {
        simulation
            .force('centerX', d3.forceX(d => d.targetX).strength(params.centeringStrength || 0.1))
            .force('centerY', d3.forceY(d => d.targetY).strength(params.centeringStrength || 0.1));
    }

    simulation.alpha(params.collisionStrength > 0.5 ? 1 : 0.8)
            .alphaDecay(params.collisionStrength > 0.5 ? 0.05 : 0.06);

    return new Promise((resolve) => {
        let tickCount = 0;
        simulation.on('tick', () => {
            tickCount++;
            if (tickCount >= 100) {
                simulation.stop();

                // Calculate metrics
                let totalDisplacement = 0;
                let maxDisplacement = 0;
                testNodes.forEach(n => {
                    const distance = Math.sqrt((n.x - n.targetX) ** 2 + (n.y - n.targetY) ** 2);
                    totalDisplacement += distance;
                    maxDisplacement = Math.max(maxDisplacement, distance);
                });

                const avgDisplacement = totalDisplacement / testNodes.length;

                // Calculate variance
                const meanX = testNodes.reduce((sum, n) => sum + n.x, 0) / testNodes.length;
                const meanY = testNodes.reduce((sum, n) => sum + n.y, 0) / testNodes.length;
                const variance = testNodes.reduce((sum, n) => {
                    const dx = n.x - meanX;
                    const dy = n.y - meanY;
                    return sum + (dx * dx + dy * dy);
                }, 0) / testNodes.length;

                console.log(`  Results: Avg displacement = ${avgDisplacement.toFixed(2)}px, Max = ${maxDisplacement.toFixed(2)}px, Variance = ${variance.toFixed(4)}`);

                resolve({
                    label,
                    avgDisplacement,
                    maxDisplacement,
                    variance,
                    finalPositions: testNodes.map(n => ({ id: n.id, x: n.x, y: n.y, targetX: n.targetX, targetY: n.targetY }))
                });
            }
        });

        simulation.restart();
    });
}

async function main() {
    // Define parameter sets
    const softParams = {
        collisionStrength: 0.4,
        chargeStrength: -15,
        positioningStrength: 0.15,
        centeringStrength: 0.12, // Optimized from 0.1 to 0.12
        hasCentering: true
    };

    const aggressiveParams = {
        collisionStrength: 0.9,
        chargeStrength: -50,
        positioningStrength: 0.3,
        hasCentering: false
    };

    // Run both tests
    const softResult = await runSimulationWithParams(softParams, 'SOFT');
    const aggressiveResult = await runSimulationWithParams(aggressiveParams, 'AGGRESSIVE');

    // Compare results
    console.log('\n📊 COMPARISON RESULTS:');
    console.log('='.repeat(50));

    const displacementDiff = Math.abs(softResult.avgDisplacement - aggressiveResult.avgDisplacement);
    const displacementPercentDiff = aggressiveResult.avgDisplacement > 0 ?
        (displacementDiff / aggressiveResult.avgDisplacement) * 100 : 0;

    const varianceDiff = Math.abs(softResult.variance - aggressiveResult.variance);
    const variancePercentDiff = aggressiveResult.variance > 0 ?
        (varianceDiff / aggressiveResult.variance) * 100 : 0;

    console.log(`Soft parameters:     ${softResult.avgDisplacement.toFixed(2)}px avg, ${softResult.variance.toFixed(4)} variance`);
    console.log(`Aggressive parameters: ${aggressiveResult.avgDisplacement.toFixed(2)}px avg, ${aggressiveResult.variance.toFixed(4)} variance`);
    console.log(`Differences:         ${displacementPercentDiff.toFixed(1)}% displacement, ${variancePercentDiff.toFixed(1)}% variance`);

    // Stability criteria (< 20% difference)
    const displacementStable = displacementPercentDiff < 20;
    const varianceStable = variancePercentDiff < 20;

    console.log(`\nStability Criteria (< 20% difference):`);
    console.log(`Displacement stability: ${displacementStable ? '✅ MET' : '❌ NOT MET'}`);
    console.log(`Variance stability:     ${varianceStable ? '✅ MET' : '❌ NOT MET'}`);

    if (displacementStable && varianceStable) {
        console.log('\n🎯 CONCLUSION: Soft parameters provide stable collision behavior with minimal differences from aggressive parameters.');
    } else {
        console.log('\n⚠️  CONCLUSION: Soft parameters show significant differences - may need parameter tuning.');
    }

    // Check for axis alignment issues
    console.log('\n🔍 Axis Alignment Analysis:');
    [softResult, aggressiveResult].forEach(result => {
        const xPositions = result.finalPositions.map(p => p.x);
        const yPositions = result.finalPositions.map(p => p.y);

        const xSpread = Math.max(...xPositions) - Math.min(...xPositions);
        const ySpread = Math.max(...yPositions) - Math.min(...yPositions);

        // Check if nodes are clustered at axis edges (potential alignment issue)
        const xEdgeCount = result.finalPositions.filter(p => {
            const minX = Math.min(...xPositions);
            const maxX = Math.max(...xPositions);
            const threshold = xSpread * 0.1;
            return Math.abs(p.x - minX) < threshold || Math.abs(p.x - maxX) < threshold;
        }).length;

        const yEdgeCount = result.finalPositions.filter(p => {
            const minY = Math.min(...yPositions);
            const maxY = Math.max(...yPositions);
            const threshold = ySpread * 0.1;
            return Math.abs(p.y - minY) < threshold || Math.abs(p.y - maxY) < threshold;
        }).length;

        const xAlignmentRatio = xEdgeCount / result.finalPositions.length;
        const yAlignmentRatio = yEdgeCount / result.finalPositions.length;

        console.log(`${result.label}: X-edge alignment = ${(xAlignmentRatio * 100).toFixed(1)}%, Y-edge alignment = ${(yAlignmentRatio * 100).toFixed(1)}%`);
    });
}

main().then(() => {
    console.log('\n✅ Comparison test completed');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});