# OpenWiki Agent Instructions

This repository uses **OpenWiki** to maintain structured, synchronized Markdown documentation for human developers, academic researchers, and autonomous coding agents.

## Core Rules for OpenWiki Maintenance
1. **Grounding in Code and Evidence:**
   - Every claim regarding the visual renderer must reference `src/components/D3MapRenderer.js` or `src/styles/main.scss`.
   - Every claim regarding scoring formulas must reference `src/utils/scoring.js` or `docs/contracts/VISUAL_AND_UI_CONTRACT.md`.
   - Every claim regarding the data format must reference `data/escuelas.json` and `docs/schemas/escuelas.schema.json`.
2. **Separation of Concerns:**
   - Never mix empirical data contracts (`docs/contracts/DATA_GOVERNANCE_CONTRACT.md`) with theoretical philosophy (`docs/conceptual/`).
3. **Validation Verification:**
   - Before committing documentation updates, ensure `npm run validate-data` and `npm run build` succeed.
4. **Link Integrity:**
   - Always verify that relative markdown links between `openwiki/`, `docs/`, and root files remain valid.
