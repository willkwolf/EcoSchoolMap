/**
 * Simple Force Simulation Test
 * Quick test to verify collision force behavior
 */

import * as d3 from 'd3';

// Test data
const nodes = [
    { id: 'A', x: 100, y: 100, targetX: 100, targetY: 100 },
    { id: 'B', x: 120, y: 120, targetX: 200, targetY: 200 },
    { id: 'C', x: 110, y: 110, targetX: 300, targetY: 100 }
];

console.log('🧪 Testing D3 Force Simulation with Soft Parameters');

// Create simulation with SOFT parameters (current implementation)
const simulation = d3.forceSimulation(nodes)
    .force('x', d3.forceX(d => d.targetX).strength(0.15))
    .force('y', d3.forceY(d => d.targetY).strength(0.15))
    .force('collision', d3.forceCollide()
        .radius(30)
        .strength(0.4)
        .iterations(2)
    )
    .force('charge', d3.forceManyBody()
        .strength(-15)
        .distanceMax(100)
    )
    .force('centerX', d3.forceX(d => d.targetX).strength(0.1))
    .force('centerY', d3.forceY(d => d.targetY).strength(0.1))
    .alpha(0.8)
    .alphaDecay(0.06);

console.log('Initial positions:');
nodes.forEach(n => console.log(`  ${n.id}: (${n.x.toFixed(1)}, ${n.y.toFixed(1)}) → target (${n.targetX}, ${n.targetY})`));

// Run simulation for 100 ticks
let tickCount = 0;
simulation.on('tick', () => {
    tickCount++;
    if (tickCount % 25 === 0) {
        console.log(`\nTick ${tickCount}:`);
        nodes.forEach(n => {
            const distance = Math.sqrt((n.x - n.targetX) ** 2 + (n.y - n.targetY) ** 2);
            console.log(`  ${n.id}: (${n.x.toFixed(1)}, ${n.y.toFixed(1)}) - ${distance.toFixed(1)}px from target`);
        });
    }

    if (tickCount >= 100) {
        simulation.stop();

        console.log('\n📊 Final Results:');
        let totalDisplacement = 0;
        nodes.forEach(n => {
            const distance = Math.sqrt((n.x - n.targetX) ** 2 + (n.y - n.targetY) ** 2);
            totalDisplacement += distance;
            console.log(`  ${n.id}: ${distance.toFixed(1)}px from target`);
        });

        const avgDisplacement = totalDisplacement / nodes.length;
        console.log(`\nAverage displacement: ${avgDisplacement.toFixed(2)}px`);

        // Check for convergence (should be low)
        if (avgDisplacement < 5) {
            console.log('✅ GOOD: Low displacement indicates stable convergence');
        } else {
            console.log('⚠️  HIGH: Significant displacement may indicate instability');
        }

        process.exit(0);
    }
});

simulation.restart();
console.log('\nRunning simulation...');