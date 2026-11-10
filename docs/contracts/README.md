# 🏛️ Marco de Gobernanza del Sitio Web (Website Governance Contracts)

Este directorio establece los contratos formales y normativos que rigen el ciclo de vida del repositorio **Mapa de Escuelas Políticas y Económicas** (`EcoSchoolMap`).

La arquitectura del proyecto separa estrictamente la **Data** (conjuntos de datos, esquemas de validación, descriptores numéricos y ontología computable) de la **Conceptualización** (fundamentos epistemológicos, ontología del espacio 2D, ensayos académicos y taxonomía teórica).

---

## 📑 Índice de Contratos

```
docs/contracts/
├── README.md                      # Este documento (Visión general y matriz de cumplimiento)
├── DATA_GOVERNANCE_CONTRACT.md    # Contrato de datos, esquemas, mutabilidad e invariantes
├── VISUAL_AND_UI_CONTRACT.md      # Contrato de proyección visual, simulación física, paleta y UI
└── AGENT_GOVERNANCE_CONTRACT.md   # Directrices de operación para agentes de IA autónomos
```

---

## 🎯 Propósito de los Contratos

1. **Garantizar la Integridad Epistemológica**: Evitar que modificaciones de código o datos distorsionen las categorías teóricas de Ha-Joon Chang o fuercen marcos transversales como puntos de decisión.
2. **Prevenir Regresiones de Visualización**: Establecer invariantes estrictos sobre la simulación de colisiones D3, la escala cromática Klein y el sistema de normalización.
3. **Estandarizar la Automatización**: Proporcionar a desarrolladores y agentes de IA directrices unívocas sobre qué archivos pueden modificarse, qué reglas de validación son obligatorias y cómo preservar la compatibilidad con GitHub Pages.

---

## 📊 Matriz de Responsabilidad Arquitectónica

| Capa | Archivos Clave | Responsabilidad Primaria | Contrato Rector |
| :--- | :--- | :--- | :--- |
| **Data Contract** | `data/escuelas.json`<br>`docs/schemas/escuelas.schema.json` | Contrato de verdad empírica y descriptores | `DATA_GOVERNANCE_CONTRACT.md` |
| **Mathematical Engine** | `src/utils/scoring.js`<br>`src/utils/scales.js` | Funciones deterministas de scoring y normalización | `VISUAL_AND_UI_CONTRACT.md` |
| **Visual Renderer** | `src/components/D3MapRenderer.js`<br>`src/styles/main.scss` | Proyección SVG, paleta Klein y simulación de fuerzas | `VISUAL_AND_UI_CONTRACT.md` |
| **Interactive Scrolly** | `src/scrollytelling/ScrollController.js`<br>`index.html` | Narrativa pedagógica y eventos de scroll | `VISUAL_AND_UI_CONTRACT.md` |
| **Agent / Automation** | `openwiki/`<br>`AGENTS.md`<br>`scripts/` | Pipelines de validación, wiki y mantenimiento asistido | `AGENT_GOVERNANCE_CONTRACT.md` |

---

## 🛡️ Checklist de Cumplimiento Pre-Deploy

Antes de cualquier despliegue a producción en la rama `master`:

- [ ] `npm run validate-data`: Valida que `data/escuelas.json` y `docs/data/escuelas.json` cumplan los invariantes de integridad posicional y de metadatos.
- [ ] `npm run build`: Genera los bundles optimizados en `docs/` asegurando la sincronización de `index.html` y los assets hash de Vite.
- [ ] Validación de Esquema: Ninguna escuela nueva o modificada puede carecer de los 6 descriptores cualitativos estándar en el rango $[0.0, 1.0]$.
- [ ] Preservación de Capas Transversales: Ninguna restricción biofísica o sistémica (Daly, Meadows, Arthur) puede ser agregada como nodo estático sin previo consenso académico.
