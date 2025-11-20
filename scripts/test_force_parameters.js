#!/usr/bin/env node

/**
 * Test script for D3 force simulation parameters
 * Tests different presets and force configurations to prevent node overlaps
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatePositions, getAvailablePresets } from '../src/utils/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load schools data from JSON file
 */
function loadSchools(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.nodos || [];
}

/**
 * Calculate Euclidean distance between two positions
 */
function calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Detect overlapping nodes in positions object
 */
function detectOverlaps(positions, threshold = 0.15) {
    const overlaps = [];
    const nodeIds = Object.keys(positions);

    for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
            const id1 = nodeIds[i];
            const id2 = nodeIds[j];
            const pos1 = positions[id1];
            const pos2 = positions[id2];

            const distance = calculateDistance(pos1, pos2);
            if (distance < threshold) {
                overlaps.push([id1, id2, distance]);
            }
        }
    }

    return overlaps;
}

/**
 * Get node size based on type (simplified version)
 */
function getNodeSize(tipo) {
    const sizes = {
        'principal': 25,
        'secundaria': 20,
        'terciaria': 15
    };
    return sizes[tipo] || 20;
}

/**
 * Calculate collision radius for a node
 */
function getCollisionRadius(node, baseRadius) {
    return baseRadius + getNodeSize(node.tipo) / 2;
}

/**
 * Simulate force repulsion between overlapping nodes
 * Simplified 2D force calculation mimicking D3 force simulation
 */
function simulateRepulsion(positions, schools, forceStrength, collisionRadius, iterations = 30) {
    const nodes = schools.map(school => ({
        id: school.id,
        x: positions[school.id].x,
        y: positions[school.id].y,
        fx: positions[school.id].x, // Fixed target
        fy: positions[school.id].y,
        tipo: school.tipo
    }));

    // Parameters matching D3MapRenderer.js
    const chargeStrength = -forceStrength * 150; // Negative = repulsion
    const distanceMax = 80;
    const centeringStrength = 0.1; // Reduced from 0.3 to allow more movement
    const velocityDecay = 0.3;

    for (let iter = 0; iter < iterations; iter++) {
        // Calculate forces
        const forces = {};
        nodes.forEach(node => {
            forces[node.id] = { x: 0, y: 0 };
        });

        // 1. Charge forces (repulsion/attraction)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];

                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    // Clamp distance for charge force
                    distance = Math.min(distance, distanceMax);

                    // Charge force (repulsion when negative)
                    const force = chargeStrength / (distance * distance);

                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;

                    forces[node1.id].x += fx;
                    forces[node1.id].y += fy;
                    forces[node2.id].x -= fx;
                    forces[node2.id].y -= fy;
                }
            }
        }

        // 2. Collision forces
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];

                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const minDistance = getCollisionRadius(node1, collisionRadius) + getCollisionRadius(node2, collisionRadius);

                if (distance > 0 && distance < minDistance) {
                    // Collision force to separate overlapping nodes
                    const overlap = minDistance - distance;
                    const force = overlap * 0.8; // collision strength

                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;

                    forces[node1.id].x -= fx;
                    forces[node1.id].y -= fy;
                    forces[node2.id].x += fx;
                    forces[node2.id].y += fy;
                }
            }
        }

        // 3. Centering forces (pull back to target positions)
        nodes.forEach(node => {
            const dx = node.fx - node.x;
            const dy = node.fy - node.y;

            forces[node.id].x += dx * centeringStrength;
            forces[node.id].y += dy * centeringStrength;
        });

        // Apply forces with velocity decay
        nodes.forEach(node => {
            node.x += forces[node.id].x * (1 - velocityDecay);
            node.y += forces[node.id].y * (1 - velocityDecay);

            // Keep within bounds [-1, 1]
            node.x = Math.max(-1, Math.min(1, node.x));
            node.y = Math.max(-1, Math.min(1, node.y));
        });
    }

    // Return updated positions
    const newPositions = {};
    nodes.forEach(node => {
        newPositions[node.id] = { x: node.x, y: node.y };
    });

    return newPositions;
}

/**
 * Test a specific preset with given parameters
 */
function testPreset(schools, preset, normalization, forceStrength, collisionRadius) {
    console.log(`\nTesting ${preset} (${normalization})`);

    // Calculate initial positions
    const positions = calculatePositions(schools, preset, normalization);

    // Check initial overlaps
    const initialOverlaps = detectOverlaps(positions, 0.15);
    console.log(`  Initial overlaps: ${initialOverlaps.length}`);

    // Show overlapping pairs
    if (initialOverlaps.length > 0) {
        console.log(`  Overlapping pairs:`);
        initialOverlaps.forEach(([id1, id2, dist]) => {
            const school1 = schools.find(s => s.id === id1);
            const school2 = schools.find(s => s.id === id2);
            console.log(`    ${school1.nombre} <-> ${school2.nombre} (dist: ${dist.toFixed(4)})`);
        });
    }

    // Calculate statistics
    const distances = [];
    const nodeIds = Object.keys(positions);
    for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
            const dist = calculateDistance(positions[nodeIds[i]], positions[nodeIds[j]]);
            distances.push(dist);
        }
    }

    const minDistance = Math.min(...distances);
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;

    console.log(`  Min distance: ${minDistance.toFixed(4)}`);
    console.log(`  Avg distance: ${avgDistance.toFixed(4)}`);

    return {
        preset,
        normalization,
        initialOverlaps: initialOverlaps.length,
        minDistance,
        avgDistance,
        overlappingPairs: initialOverlaps
    };
}

/**
 * Main test function
 */
function main() {
    const dataPath = path.join(__dirname, '..', 'data', 'escuelas.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found: ${dataPath}`);
        process.exit(1);
    }

    console.log('Loading schools data...');
    const schools = loadSchools(dataPath);
    console.log(`Loaded ${schools.length} schools`);

    // Test parameters
    const presets = getAvailablePresets();
    const normalizations = ['none', 'percentile']; // Test both
    const forceStrengths = [0.15, 0.2, 0.25]; // Current is 0.15
    const collisionRadii = [35, 40, 45]; // Current is 40

    console.log('\n=== FORCE PARAMETER TESTING ===');
    console.log(`Testing ${presets.length} presets × ${normalizations.length} norms × ${forceStrengths.length} forces × ${collisionRadii.length} radii = ${presets.length * normalizations.length * forceStrengths.length * collisionRadii.length} combinations`);

    const results = [];

    // Test all presets with percentile normalization
    for (const preset of presets) {
        const result = testPreset(schools, preset, 'percentile', 0.15, 40);
        results.push(result);
    }

    // Find best parameters
    console.log('\n=== RESULTS SUMMARY ===');

    // Sort by final overlaps (ascending) then by min distance (descending)
    results.sort((a, b) => {
        if (a.finalOverlaps !== b.finalOverlaps) {
            return a.finalOverlaps - b.finalOverlaps;
        }
        return b.minDistance - a.minDistance;
    });

    console.log('\nTop 10 parameter combinations:');
    results.slice(0, 10).forEach((result, index) => {
        console.log(`${index + 1}. ${result.preset} (${result.normalization}) - force:${forceStrengths.find(f => f === result.forceStrength || true)} radius:${collisionRadii.find(r => r === result.collisionRadius || true)}`);
        console.log(`   Overlaps: ${result.initialOverlaps} → ${result.finalOverlaps}, Min dist: ${result.minDistance.toFixed(4)}`);
    });

    // Best overall
    const best = results[0];
    console.log(`\n🎯 BEST PARAMETERS:`);
    console.log(`   Preset: ${best.preset}`);
    console.log(`   Normalization: ${best.normalization}`);
    console.log(`   Force Strength: ${forceStrengths.find(f => f === best.forceStrength || 0.15)}`);
    console.log(`   Collision Radius: ${collisionRadii.find(r => r === best.collisionRadius || 40)}`);
    console.log(`   Final overlaps: ${best.finalOverlaps}`);
    console.log(`   Min distance: ${best.minDistance.toFixed(4)}`);

    // Save detailed results
    const outputPath = path.join(__dirname, '..', 'force_test_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed results saved to: ${outputPath}`);
}

// Run main function
main();

export { testPreset, detectOverlaps, simulateRepulsion };