/**
 * Synchronous Toggle Test - Check displacement without async issues
 */

import * as d3 from 'd3';
import * as fs from 'fs';

// Load real data
const escuelasData = JSON.parse(fs.readFileSync('data/escuelas.json', 'utf8'));
const SAMPLE_NODES = escuelasData.nodos || [];

console.log(`🔍 SYNC TOGGLE TEST - Testing ${SAMPLE_NODES.length} real nodes`);

// Scale setup
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

console.log('\n📊 BASELINE: Running simulation without collision forces...');

// Baseline simulation (no collisions)
const baselineNodes = JSON.parse(JSON.stringify(nodeData)); // Deep clone
const baselineSim = d3.forceSimulation(baselineNodes)
    .force('x', d3.forceX(d => d.targetX).strength(0.3))
    .force('y', d3.forceY(d => d.targetY).strength(0.3))
    .alpha(0.6)
    .alphaDecay(0.05)
    .stop();

// Run baseline simulation synchronously
for (let i = 0; i < 50; i++) {
    baselineSim.tick();
}
baselineSim.stop();

console.log('✅ Baseline simulation completed');

console.log('\n📊 COLLISIONS: Running simulation with optimized collision forces...');

// Collision simulation with balanced parameters
const collisionNodes = JSON.parse(JSON.stringify(nodeData)); // Deep clone
const collisionSim = d3.forceSimulation(collisionNodes)
    .force('x', d3.forceX(d => d.targetX).strength(0.4))
    .force('y', d3.forceY(d => d.targetY).strength(0.4))
    .force('collision', d3.forceCollide()
        .radius(d => {
            const area = getNodeSize(d.tipo);
            const visualRadius = Math.sqrt(area / Math.PI);
            return visualRadius + 3; // Tiny padding
        })
        .strength(0.15) // Balanced strength
        .iterations(2) // More iterations
    )
    .alpha(0.6)
    .alphaDecay(0.08)
    .stop();

// Run collision simulation synchronously
for (let i = 0; i < 100; i++) {
    collisionSim.tick();
}
collisionSim.stop();

console.log('✅ Collision simulation completed');

// Analyze displacement
console.log('\n📊 ANALYZING DISPLACEMENT...');

let totalDisplacement = 0;
let maxDisplacement = 0;
let nodesExceedingThreshold = [];
let largeXMoves = [];
let largeYMoves = [];

baselineNodes.forEach((baselineNode, index) => {
    const collisionNode = collisionNodes[index];
    if (baselineNode.id === collisionNode.id) {
        const dx = collisionNode.x - baselineNode.x;
        const dy = collisionNode.y - baselineNode.y;
        const displacement = Math.sqrt(dx * dx + dy * dy);

        totalDisplacement += displacement;
        maxDisplacement = Math.max(maxDisplacement, displacement);

        if (displacement > 5) {
            nodesExceedingThreshold.push({
                id: baselineNode.id,
                displacement,
                dx,
                dy
            });
        }

        if (Math.abs(dx) > 5) {
            largeXMoves.push({ id: baselineNode.id, dx, displacement });
        }
        if (Math.abs(dy) > 5) {
            largeYMoves.push({ id: baselineNode.id, dy, displacement });
        }
    }
});

const avgDisplacement = totalDisplacement / baselineNodes.length;

console.log(`\n📊 RESULTS:`);
console.log(`Average displacement: ${avgDisplacement.toFixed(2)}px`);
console.log(`Max displacement: ${maxDisplacement.toFixed(2)}px`);
console.log(`Nodes exceeding 5px threshold: ${nodesExceedingThreshold.length}`);
console.log(`Large X-axis moves: ${largeXMoves.length}`);
console.log(`Large Y-axis moves: ${largeYMoves.length}`);

if (nodesExceedingThreshold.length > 0) {
    console.log('\n⚠️ NODES WITH LARGE DISPLACEMENT:');
    nodesExceedingThreshold.slice(0, 5).forEach(node => {
        console.log(`  ${node.id}: ${node.displacement.toFixed(2)}px (${node.dx.toFixed(1)}, ${node.dy.toFixed(1)})`);
    });
}

// Production readiness check
const acceptableDisplacement = avgDisplacement < 3;
const noLargeMoves = nodesExceedingThreshold.length === 0;
const noAxisIssues = largeXMoves.length === 0 && largeYMoves.length === 0;

console.log('\n🎯 PRODUCTION READINESS CHECK:');
console.log(`Acceptable displacement (< 3px): ${acceptableDisplacement ? '✅' : '❌'}`);
console.log(`No large moves (> 5px): ${noLargeMoves ? '✅' : '❌'}`);
console.log(`No axis alignment issues: ${noAxisIssues ? '✅' : '❌'}`);

const productionReady = acceptableDisplacement && noLargeMoves && noAxisIssues;
console.log(`\n${productionReady ? '✅ PRODUCTION READY' : '❌ REQUIRES FIXES'}`);

if (!productionReady) {
    console.log('\nRequired fixes:');
    if (!acceptableDisplacement) console.log('  - Reduce average displacement below 3px');
    if (!noLargeMoves) console.log('  - Fix nodes exceeding 5px movement threshold');
    if (!noAxisIssues) console.log('  - Resolve axis alignment issues');
}

console.log('\n✅ Sync test completed');