/**
 * Quick Toggle Diagnostic - Check for large displacements
 */

import * as d3 from 'd3';
import * as fs from 'fs';

// Load real data
const escuelasData = JSON.parse(fs.readFileSync('data/escuelas.json', 'utf8'));
const SAMPLE_NODES = escuelasData.nodos || [];

console.log(`🔍 QUICK TOGGLE DIAGNOSTIC - Testing ${SAMPLE_NODES.length} real nodes`);

// Scale setup (matching D3MapRenderer)
const xScale = d3.scaleLinear().domain([-1.1, 1.1]).range([60, 1200 - 60]);
const yScale = d3.scaleLinear().domain([-1.1, 1.1]).range([700 - 60, 60]);

// Create node data
const nodeData = SAMPLE_NODES.map(node => {
    const randomOffset = 0.001;
    const offsetX = (Math.random() - 0.5) * randomOffset;
    const offsetY = (Math.random() - 0.5) * randomOffset;

    const normalizedTargetX = Math.max(-1, Math.min(1, node.posicion.x + offsetX));
    const normalizedTargetY = Math.max(-1, Math.min(1, node.posicion.y + offsetY));

    const pixelTargetX = xScale(normalizedTargetX);
    const pixelTargetY = yScale(normalizedTargetY);

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

// Get node size
function getNodeSize(tipo) {
    const sizes = { 'principal': 1200, 'secundaria': 800, 'terciaria': 500 };
    return sizes[tipo] || 800;
}

// Test function
async function runToggleDiagnostic() {
    console.log('\n📊 BASELINE: No collision forces');
    const baselineSim = d3.forceSimulation(nodeData.map(n => ({ ...n })))
        .force('x', d3.forceX(d => d.targetX).strength(0.3))
        .force('y', d3.forceY(d => d.targetY).strength(0.3))
        .alpha(0.6)
        .alphaDecay(0.05);

    const baselineNodes = await runSimulation(baselineSim, 50);
    const baselinePositions = capturePositions(baselineNodes);

    console.log('\n📊 COLLISION ENABLED: Current optimized parameters');
    const collisionSim = d3.forceSimulation(nodeData.map(n => ({ ...n })))
        .force('x', d3.forceX(d => d.targetX).strength(0.15))
        .force('y', d3.forceY(d => d.targetY).strength(0.15))
        .force('collision', d3.forceCollide()
            .radius(d => {
                const area = getNodeSize(d.tipo);
                const visualRadius = Math.sqrt(area / Math.PI);
                return visualRadius + 8;
            })
            .strength(0.4)
            .iterations(2)
        )
        .force('charge', d3.forceManyBody().strength(-15).distanceMax(100))
        .force('centerX', d3.forceX(d => d.targetX).strength(0.12))
        .force('centerY', d3.forceY(d => d.targetY).strength(0.12))
        .alpha(0.6)
        .alphaDecay(0.08);

    const collisionNodes = await runSimulation(collisionSim, 100);
    const collisionPositions = capturePositions(collisionNodes);

    // Analyze displacement
    const analysis = analyzeDisplacement(baselinePositions, collisionPositions);

    console.log('\n📊 DIAGNOSTIC RESULTS:');
    console.log(`Average displacement: ${analysis.avgDisplacement.toFixed(2)}px`);
    console.log(`Max displacement: ${analysis.maxDisplacement.toFixed(2)}px`);
    console.log(`Nodes exceeding 5px: ${analysis.nodesExceedingThreshold.length}`);
    console.log(`Large X-axis moves: ${analysis.largeXMoves.length}`);
    console.log(`Large Y-axis moves: ${analysis.largeYMoves.length}`);

    if (analysis.nodesExceedingThreshold.length > 0) {
        console.log('\n⚠️ NODES WITH LARGE DISPLACEMENT:');
        analysis.nodesExceedingThreshold.slice(0, 10).forEach(node => {
            console.log(`  ${node.id}: ${node.displacement.toFixed(2)}px (${node.dx.toFixed(1)}, ${node.dy.toFixed(1)})`);
        });
    }

    // Production readiness check
    const productionReady = analysis.avgDisplacement < 3 &&
                           !analysis.thresholdExceeded &&
                           !analysis.xAxisIssue &&
                           !analysis.yAxisIssue;

    console.log(`\n🎯 PRODUCTION READINESS: ${productionReady ? '✅ READY' : '❌ NEEDS FIXES'}`);

    if (!productionReady) {
        console.log('Issues:');
        if (analysis.avgDisplacement >= 3) console.log('  - High average displacement');
        if (analysis.thresholdExceeded) console.log('  - Nodes exceeding 5px threshold');
        if (analysis.xAxisIssue) console.log('  - X-axis alignment issues');
        if (analysis.yAxisIssue) console.log('  - Y-axis alignment issues');
    }
}

function capturePositions(nodes) {
    const positions = {};
    nodes.forEach(node => {
        positions[node.id] = { x: node.x, y: node.y, targetX: node.targetX, targetY: node.targetY };
    });
    return positions;
}

function analyzeDisplacement(before, after, threshold = 5) {
    let totalDisplacement = 0;
    let maxDisplacement = 0;
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

            totalDisplacement += displacement;
            maxDisplacement = Math.max(maxDisplacement, displacement);

            if (displacement > threshold) {
                nodesExceedingThreshold.push({ id: nodeId, displacement, dx, dy });
            }

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
        nodesExceedingThreshold,
        largeXMoves,
        largeYMoves,
        thresholdExceeded: nodesExceedingThreshold.length > 0,
        xAxisIssue: largeXMoves.length > 0,
        yAxisIssue: largeYMoves.length > 0
    };
}

function runSimulation(simulation, ticks) {
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

// Run diagnostic
runToggleDiagnostic().then(() => {
    console.log('\n✅ Diagnostic completed');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Diagnostic failed:', error);
    process.exit(1);
});