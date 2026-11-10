# OpenWiki - Software Architecture & Tech Stack

## Technology Overview

### Frontend Visualization Engine
* **D3.js (v7.9.0):** Reactive SVG rendering, zoom/pan transforms, and headless force-simulation physics (`d3.forceSimulation`).
* **GSAP (v3.13.0):** Smooth interpolations (800ms) for transitions between presets and normalization modes.
* **Vite (v7.2.2):** Bundler and development server, outputting to `docs/` for native GitHub Pages hosting.
* **Sass (v1.94.0):** Modular stylesheet preprocessor with responsive CSS grid and flexbox.
* **save-svg-as-png (v1.4.17):** Client-side 2x PNG rendering for academic exports.

### Backend & Data Pipeline
* **Python (3.11+):** Mathematical validation and offline plot generation (`validate_data_integrity.py`).
* **JSON Schema (Draft-07):** Formal contract enforcement for school nodes and transitions.

## Data Flow Architecture

```mermaid
flowchart LR
    A["data/escuelas.json<br>(Source of Truth)"] -->|npm run validate-data| B["scripts/data_validation/"]
    A -->|npm run build<br>(copy_data.js)| C["docs/data/escuelas.json"]
    C -->|Client-Side Fetch| D["src/data/loader.js"]
    D --> E["src/utils/scoring.js<br>(Client Scoring Engine)"]
    E --> F["src/components/D3MapRenderer.js<br>(D3.js SVG & Forces)"]
    F --> G["Browser Viewport<br>(Interactive Map)"]
```

## Build Pipeline Scripts (`package.json`)
* `npm run dev`: Starts Vite local development server on `http://localhost:3000`.
* `npm run prebuild`: Executes `node scripts/build_tools/copy_data.js` to ensure data parity.
* `npm run build`: Bundles the client app with asset hashing into `docs/`.
* `npm run postbuild`: Executes `node scripts/build_tools/clean_assets.js` to purge stale hashed assets.
* `npm run validate-data`: Runs Python data integrity checks across source and distribution files.
