# 🤖 Directrices para Agentes de IA / Instructions for AI Agents

Bienvenido al repositorio **Mapa de Escuelas Políticas y Económicas** (`EcoSchoolMap`).

Este archivo contiene las directrices primarias para agentes autónomos y asistentes de código. Antes de realizar cualquier modificación, debes consultar los contratos formales bajo [`docs/contracts/`](docs/contracts/README.md) y la base de conocimiento en [`openwiki/`](openwiki/overview.md).

---

## ⚡ Reglas Cardinales

1. **Separación Estricta entre Datos y Conceptualización:**
   - **Data:** Reside únicamente en `data/escuelas.json` y se valida contra [`docs/schemas/escuelas.schema.json`](docs/schemas/escuelas.schema.json).
   - **Conceptualización:** Reside en [`docs/conceptual/`](docs/conceptual/README.md) y abarca los fundamentos epistemológicos y el ensayo académico.
2. **Invariantes del Build y GitHub Pages:**
   - La carpeta `docs/` contiene el sitio de producción servido por GitHub Pages (`docs/index.html`, `docs/assets/`, `docs/data/`).
   - `vite.config.js` está configurado con `emptyOutDir: false` para preservar la documentación en `/docs`.
   - **Nunca** borres ni modifiques manualmente los archivos dentro de `docs/assets/` o `docs/data/`.
3. **Validación Obligatoria:**
   - Antes de dar por finalizada cualquier tarea, debes ejecutar:
     ```bash
     npm run validate-data
     npm run build
     ```
   - Ambos comandos deben salir con código `0`.
4. **Git Limpio:**
   - Nunca hagas commit de directorios de herramientas locales (`.claude/`, `.gitclaude/`, `.venv/`, `node_modules/`).
   - Mantén mensajes de commit profesionales bajo el estándar Conventional Commits.

---

## 📚 Mapa de Referencias Rápidas

* [Contrato de Gobierno de Datos](docs/contracts/DATA_GOVERNANCE_CONTRACT.md)
* [Contrato de Visualización y UI](docs/contracts/VISUAL_AND_UI_CONTRACT.md)
* [Contrato de Agentes de IA](docs/contracts/AGENT_GOVERNANCE_CONTRACT.md)
* [Epistemología del Espacio 2D](docs/conceptual/01_epistemologia_espacio_2d.md)
* [Espacio Conceptual vs Factible](docs/conceptual/02_espacio_conceptual_vs_factible.md)
* [Taxonomía de Escuelas (Chang)](docs/conceptual/03_taxonomia_escuelas_chang.md)
* [Ensayo Académico Completo](docs/conceptual/04_ensayo_academico.md)
* [Metodología de Scoring](docs/methodology/SCORING_METHODOLOGY.md)
* [OpenWiki Architecture](openwiki/architecture.md)
