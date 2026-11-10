# 🤖 Contrato de Gobernanza para Agentes de IA (Agent Governance Contract)

> **Versión del Contrato:** 2.0.0  
> **Destinatarios:** Agentes de IA Autónomos (Antigravity, DeepAgents, OpenWiki, Cursor, Codex, etc.) y Desarrolladores Humanos

---

## 1. Principio Rector de No Regresión

Cualquier agente que opere en este repositorio actúa como un custodio técnico y epistemológico del proyecto. Debe garantizar que sus intervenciones:
1. No degraden la fidelidad conceptual de las 12 escuelas de pensamiento económico.
2. No sobrescriban coordenadas $(x, y)$ en `data/escuelas.json` con datos temporales generados por el cliente o la simulación física.
3. No reintroduzcan artefactos de depuración, checklists obsoletos o archivos de configuración locales en el historial de Git.

---

## 2. Permisos y Restricciones de Archivos

### 2.1 Archivos Protegidos (Edición Restringida a Verificación Estricta)
* `data/escuelas.json`: Cualquier modificación en los descriptores requiere justificación bibliográfica y validación posterior con `npm run validate-data`.
* `docs/schemas/escuelas.schema.json`: Esquema canónico. Solo modificable tras acuerdo sobre evolución de versiones semánticas.
* `docs/contracts/*`: Contratos de gobernanza. Solo modificables para clarificar o elevar estándares de calidad.

### 2.2 Archivos Derivados y Prohibición de Modificación Directa
* `docs/data/escuelas.json`: Generado automáticamente por `scripts/build_tools/copy_data.js`. **Nunca editar manualmente**.
* `docs/assets/*`: Compilados generados por Vite (`vite build`). **Nunca editar manualmente**.
* `docs/index.html`: Generado a partir de la raíz `index.html` durante `npm run build`.

### 2.3 Archivos Permitidos para Evolución y Mejora
* `src/*`: Lógica de componentes, estilos Sass, utilidades matemáticas y animaciones.
* `index.html`: Estructura semántica, textos pedagógicos y accesibilidad del visor interactivo.
* `docs/conceptual/*`: Ensayos académicos, notas epistemológicas y análisis historiográfico.
* `openwiki/*`: Base de conocimiento sincronizada para agentes y humanos.

---

## 3. Comandos de Validación Obligatorios

Antes de que un agente dé por concluida una tarea que afecte el código, los datos o la documentación, debe ejecutar y verificar satisfactoriamente:

```bash
# 1. Validación de integridad de datos entre data/, docs/ y schemas
npm run validate-data

# 2. Compilación de producción limpia y sin errores de bundler
npm run build
```

Si alguno de estos comandos falla con código de salida $\ne 0$, el agente está **bloqueado** y debe reparar el fallo antes de finalizar su turno.

---

## 4. Gobernanza de Git y Secretos

1. **Sin Secretos ni Credenciales:** Nunca hacer commit de claves API (OpenAI, Anthropic, Gemini, etc.), tokens de GitHub o archivos de credenciales.
2. **Archivos Ignorados:** Respetar rigurosamente `.gitignore`. No hacer tracking de carpetas de herramientas locales (`.claude/`, `.gitclaude/`, `.venv/`, `node_modules/`, `dist/`).
3. **Mensajes de Commit Profesionales:** Utilizar el estándar [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `test:`), redactados con claridad e independencia de nombres de herramientas o agentes.

---

## 5. Integración con OpenWiki

El repositorio incorpora la herramienta `openwiki` de DeepAgents / LangChain:
* La base de conocimiento canónica para agentes reside en `openwiki/`.
* Cualquier cambio sustancial en la arquitectura del software debe reflejarse en `openwiki/architecture.md`.
* Los contratos de gobernanza deben enlazarse desde `openwiki/contracts.md` y `AGENTS.md`.

---

## 6. Política de Neutralidad Epistémica y Pluralismo Pedagógico (POL-EP-002)

Para garantizar que el mapa sea un espacio de aprendizaje riguroso, sereno y enriquecedor para cualquier lector —independientemente de que profese posturas anarquistas, socialistas, libertarias, socialdemócratas o no tenga ninguna adscripción partidaria—, todo agente y colaborador debe acatar los siguientes principios semánticos:

1. **Descriptivismo vs. Prescriptivismo Moral:**
   * El artefacto **nunca** debe declarar un cuadrante, escuela o eje como "moralmente superior", "correcto" o "la verdad definitiva".
   * Las etiquetas deben formularse como **preguntas y prioridades analíticas**, no como juicios de valor.
2. **Fundamento Investigativo vs. Falsa Certeza Absoluta:**
   * Sustituir términos dogmáticos como "Fundamento Científico" por **"Fundamento Investigativo"** o **"Marco Metodológico"**, reconociendo que la economía política opera mediante modelos explicativos contrastables y no verdades cerradas.
3. **Respeto Simétrico a Toda Tradición Intelectual:**
   * **Corrientes Descentralizadas y Pro-Mercado (Austríaca, Clásica, Anarcocapitalismo, Libertarismo):** Explicar con honestidad académica sus aportes (coordinación descentralizada por precios, cálculo económico, orden espontáneo, libertad individual), sin descalificaciones peyorativas.
   * **Corrientes Estatales, Comunitarias y Socialistas (Marxismo, Desarrollismo, Anarcosindicalismo):** Describir sus premisas con profundidad (fuerzas productivas, planificación estratégica, derechos laborales, relaciones de poder), sin caricaturas autoritarias.
   * **Enfoques Pluralistas y de Frontera (Feminista, Ecológica, Conductual, Institucional):** Presentar su trabajo como expansiones metodológicas legítimas (límites de la biosfera, economía del cuidado no remunerada, sesgos cognitivos, reglas formales e informales), sin condescendencia ni etiquetados como "escuelas marginadas".
4. **Acogida al Lector Independiente y Pensador Crítico:**
   * La UI y la documentación deben evitar un tono paternalista o admonitorio. El objetivo del mapa es dotar al visitante de herramientas cartográficas para que ejerza su propio juicio crítico con libertad y tranquilidad.
