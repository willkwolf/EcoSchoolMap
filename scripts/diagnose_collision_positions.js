/**
 * Diagnostic script to check node positions before and after enabling collision forces
 */

import * as d3 from 'd3';
import * as fs from 'fs';

// Load real data
const escuelasData = JSON.parse(fs.readFileSync('data/escuelas.json', 'utf8'));
const SAMPLE_NODES = escuelasData.nodos || [];

console.log(`🔍 COLLISION POSITION DIAGNOSTIC - Testing ${SAMPLE_NODES.length} real nodes`);

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

console.log('\n📊 BASELINE: Recording positions without collision forces...');

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

console.log('\n📊 COLLISIONS: Recording positions with collision forces...');

// Collision simulation
const collisionNodes = JSON.parse(JSON.stringify(nodeData)); // Deep clone
const collisionSim = d3.forceSimulation(collisionNodes)
    .force('x', d3.forceX(d => d.targetX).strength(0.15))
    .force('y', d3.forceY(d => d.targetY).strength(0.15))
    .force('collision', d3.forceCollide()
        .radius(d => {
            const area = getNodeSize(d.tipo);
            const visualRadius = Math.sqrt(area / Math.PI);
            return visualRadius + 3;
        })
        .strength(0.1)
        .iterations(1)
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

console.log('\n📊 ANALYZING POSITION DIFFERENCES...');

// Check if all nodes are at the same position in collision mode
const collisionPositions = new Set();
collisionNodes.forEach(node => {
    collisionPositions.add(`${node.x.toFixed(1)},${node.y.toFixed(1)}`);
});

console.log(`Unique positions in collision mode: ${collisionPositions.size} out of ${collisionNodes.length} nodes`);

if (collisionPositions.size === 1) {
    console.log('❌ ERROR: All nodes are at the same position!');
    const [pos] = collisionPositions;
    console.log(`Position: ${pos}`);
} else if (collisionPositions.size < collisionNodes.length * 0.5) {
    console.log('⚠️ WARNING: Many nodes share the same position');
}

// Check target positions
const targetPositions = new Set();
collisionNodes.forEach(node => {
    targetPositions.add(`${node.targetX.toFixed(1)},${node.targetY.toFixed(1)}`);
});

console.log(`Unique target positions: ${targetPositions.size} out of ${collisionNodes.length} nodes`);

if (targetPositions.size === 1) {
    console.log('❌ ERROR: All targets are the same!');
}

// Show sample positions
console.log('\n📊 SAMPLE POSITIONS:');
console.log('Node | Baseline X,Y | Collision X,Y | Target X,Y | Displacement');
console.log('-----|--------------|---------------|------------|-------------');

baselineNodes.slice(0, 5).forEach((baselineNode, index) => {
    const collisionNode = collisionNodes[index];
    const dx = collisionNode.x - baselineNode.x;
    const dy = collisionNode.y - baselineNode.y;
    const displacement = Math.sqrt(dx * dx + dy * dy);

    console.log(`${baselineNode.nombre.padEnd(15)} | ${baselineNode.x.toFixed(1)},${baselineNode.y.toFixed(1)} | ${collisionNode.x.toFixed(1)},${collisionNode.y.toFixed(1)} | ${collisionNode.targetX.toFixed(1)},${collisionNode.targetY.toFixed(1)} | ${displacement.toFixed(2)}px`);
});

console.log('\n✅ Diagnostic completed');