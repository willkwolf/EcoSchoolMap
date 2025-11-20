# Force Simulation Test Framework for Node Overlap Prevention

## Problem Statement

When switching between different weight presets in the economic schools map, nodes can overlap because the D3 force simulation parameters are not optimized for all position distributions. The current parameters work for some presets but fail for others, causing visual clutter and poor user experience.

## Current Parameters (D3MapRenderer.js)

```javascript
// Base parameters
this.forceStrength = 0.15; // Repulsion strength
this.collisionRadius = 40; // Minimum distance between nodes

// In renderNodes():
charge: strength = -this.forceStrength * 150 = -22.5
collision: radius = this.collisionRadius + getNodeSize(d.tipo) / 2
collision: strength = 0.8, iterations = 3
x/y forces: strength = 0.3
alpha = 0.8, alphaDecay = 0.02, velocityDecay = 0.3
simulation time: 2000ms
```

## Test Framework Design

### 1. Position Calculation Test

**Script**: `scripts/test_force_parameters.js`

**Purpose**: Calculate positions for all presets and detect overlaps before force simulation.

**Algorithm**:
```javascript
// Load data
const schools = loadSchools('data/escuelas.json');

// Test all presets with percentile normalization (most common)
const presets = ['base', 'state-emphasis', 'equity-emphasis', 'market-emphasis', 'growth-emphasis', 'historical-emphasis', 'pragmatic-emphasis'];

presets.forEach(preset => {
    const positions = calculatePositions(schools, preset, 'percentile');
    const overlaps = detectOverlaps(positions, threshold = 0.15);

    console.log(`${preset}: ${overlaps.length} overlaps`);
    if (overlaps.length > 0) {
        overlaps.forEach(([id1, id2, dist]) => {
            console.log(`  ${schools.find(s => s.id === id1).nombre} <-> ${schools.find(s => s.id === id2).nombre}: ${dist.toFixed(4)}`);
        });
    }
});
```

### 2. Force Parameter Optimization

**Approach**: Grid search over parameter combinations to find optimal settings.

**Parameters to Test**:
- `forceStrength`: [0.1, 0.15, 0.2, 0.25, 0.3]
- `collisionRadius`: [30, 35, 40, 45, 50]
- `collisionStrength`: [0.7, 0.8, 0.9, 1.0]
- `simulationTime`: [1500, 2000, 2500, 3000]

**Optimization Metric**:
- Minimize overlaps after simulation
- Maximize minimum distance between nodes
- Ensure simulation converges within time limit

### 3. Simulation Testing

**Method**: Use D3 force simulation in Node.js environment.

**Setup**:
```javascript
// Create headless simulation
const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(chargeStrength))
    .force('collision', d3.forceCollide().radius(collisionRadius))
    .force('x', d3.forceX(d => targetX).strength(0.3))
    .force('y', d3.forceY(d => targetY).strength(0.3));

// Run simulation synchronously
let ticks = 0;
const maxTicks = 300; // ~3 seconds at 100fps

simulation.on('tick', () => {
    ticks++;
    if (ticks >= maxTicks) {
        simulation.stop();
        // Check overlaps
        const finalOverlaps = detectOverlaps(currentPositions);
        // Record results
    }
});
```

### 4. Validation Criteria

**Success Criteria**:
- No overlaps > 0.1 distance units after simulation
- All nodes within [-1, 1] bounds
- Simulation converges within 3 seconds
- Visual stability across preset switches

**Failure Cases**:
- Nodes stuck in overlapping positions
- Excessive vibration/oscillation
- Nodes pushed outside map bounds

## Implementation Plan

### Phase 1: Basic Overlap Detection
1. Create test script for position calculation
2. Identify problematic presets
3. Establish baseline metrics

### Phase 2: Parameter Tuning
1. Implement grid search algorithm
2. Test parameter combinations
3. Find optimal settings per preset

### Phase 3: Dynamic Parameter Adjustment
1. Implement adaptive parameters based on position distribution
2. Test across all presets
3. Validate in browser environment

### Phase 4: Integration
1. Update D3MapRenderer.js with tuned parameters
2. Add parameter documentation
3. Create regression tests

## Expected Results

**Before Tuning**:
- Some presets show 2-5 overlapping node pairs
- Inconsistent visual quality
- User-reported overlap issues

**After Tuning**:
- Zero overlaps across all presets
- Consistent 0.15+ minimum distance
- Smooth transitions between presets
- Stable visual layout

## Files to Create/Modify

1. `scripts/test_force_parameters.js` - Main test script
2. `src/utils/forceTuning.js` - Parameter optimization utilities
3. `src/components/D3MapRenderer.js` - Updated with tuned parameters
4. `FORCE_SIMULATION_ANALYSIS.md` - Results documentation

## Risk Mitigation

- **Fallback**: Keep original parameters as fallback
- **Testing**: Extensive browser testing before deployment
- **Performance**: Ensure no significant performance impact
- **Compatibility**: Test across different browsers/devices