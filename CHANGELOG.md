# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0] - 2025-11-15

### 🚀 Added - Migración Completa a D3.js

#### Visualización Web Moderna
- **D3.js v7.9.0:** Reemplazo completo de Plotly por D3.js nativo
- **SVG responsivo:** Renderizado vectorial con zoom/pan fluido
- **GSAP v3.13.0:** Animaciones suaves para transiciones de variantes (800ms)
- **Scrollytelling:** Navegación automática por secciones con Intersection Observer
- **Mobile-first:** Diseño responsive optimizado para dispositivos móviles

#### Interactividad Mejorada
- **Control de transiciones:** Filtrar por nivel de confianza (todas/alta/media-alta/ninguna)
- **Export PNG mejorado:** Descarga directa desde SVG del navegador
- **Tooltips ricos:** HTML custom con información detallada de cada escuela
- **Variantes dinámicas:** Cambio fluido entre 32 combinaciones (8 presets × 4 normalizaciones)

#### Arquitectura y Tooling
- **Vite v7.2.2:** Build tool moderno con hot reload y optimización automática
- **Sass:** Preprocesador CSS con variables y mixins
- **ES6 Modules:** Código modular y tree-shakeable
- **Bundle optimizado:** 86KB JS + 13KB CSS (gzipped)

### 📝 Changed

#### Build System
- **Output directory:** Build ahora genera en `docs/` (antes `dist/` y manual)
- **Base path:** Configurado como `./` para GitHub Pages
- **Asset hashing:** Vite genera hashes automáticos para cache-busting

#### Estructura del Proyecto
```
src/
├── main.js                 # Entry point (antes todo en un HTML)
├── components/             # Componentes separados
│   ├── D3MapRenderer.js
│   └── TooltipManager.js
├── data/loader.js          # Carga async centralizada
├── scrollytelling/         # Sistema de scroll
└── styles/main.scss        # Estilos organizados
```

#### Estilos
- **CSS → Sass:** Migración completa con variables CSS
- **Mobile-first:** Media queries progressive enhancement
- **Grid moderno:** CSS Grid y Flexbox para layouts

### ✅ Maintained - Compatibilidad Hacia Atrás

#### Scripts Python Conservados
- `scripts/generate_interactive_plot.py` - Genera HTML Plotly standalone (útil para presentaciones offline)
- `scripts/generate_static_plot.py` - Genera PNG de alta calidad con matplotlib (papers académicos)
- **Razón:** Permiten uso sin servidor y exportación de alta calidad

#### Metodología de Scoring
- Sistema de 6 descriptores cualitativos (sin cambios)
- 8 presets de pesos (base, balanced, state-emphasis, etc.)
- 4 métodos de normalización (percentile, zscore, minmax, none)
- Basado en Ha-Joon Chang (Economics: The User's Guide, 2015)

#### Datos
- `data/escuelas.json` - Formato sin cambios
- `data/variants/*.json` - 32 archivos generados por Python
- Compatibilidad total entre versiones Plotly y D3.js

### 🗑️ Removed

#### Archivos Legacy Eliminados del Repositorio
- `docs/mapa_escuelas.html` - HTML Plotly standalone generado (puede regenerarse)
- `docs/assets/main-B*.js` - Builds antiguos de Vite (4 archivos, ~320KB)

**Nota:** Los *scripts* Python que generan estos archivos se mantienen funcionales.

### 🔧 Technical Details

#### Performance
- **Tamaño del bundle:** 86KB JS (vs 150KB Plotly CDN)
- **Tiempo de carga:** ~800ms (vs ~1.2s con Plotly)
- **FPS transiciones:** 60fps con GSAP (vs 30fps CSS)

#### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

---

## [1.0.0] - 2024-10

### Initial Release - Sistema Plotly

#### Features
- Visualización interactiva con Plotly.js
- Sistema de scoring de Ha-Joon Chang (6 descriptores)
- 12 escuelas económicas mapeadas
- Transiciones históricas anotadas
- Generadores Python:
  - `generate_interactive_plot.py` - HTML standalone
  - `generate_static_plot.py` - PNG estático
- 32 variantes de peso (8 presets × 4 normalizaciones)
- Cuadrantes coloreados por zona económica
- Klein Schema color palette
- Metadata detallada por escuela

#### Metodología
- Descriptores cualitativos → posiciones cuantitativas
- Normalización estadística (percentiles, z-scores)
- Pesos configurables por preset
- Validación automática de variantes

#### Licencia
- Creative Commons BY-SA 4.0
- Código abierto para uso educativo
- Créditos a Ha-Joon Chang

---

## [Unreleased]

### Planeado para v2.1
- [ ] Tests unitarios con Vitest
- [ ] CI/CD con GitHub Actions
- [ ] Internacionalización (i18n) - inglés/español
- [ ] Modo dark/light
- [ ] Comparación lado a lado de variantes
- [ ] Animación de transiciones históricas timeline
- [ ] Accessibility (WCAG 2.1 AA)

### En Consideración
- TypeScript migration
- PWA (Progressive Web App)
- API REST para datos
- Editor visual de escuelas

---

## Formato del Changelog

### Tipos de Cambios
- **Added:** Nuevas features
- **Changed:** Cambios en funcionalidad existente
- **Deprecated:** Features que se eliminarán pronto
- **Removed:** Features eliminadas
- **Fixed:** Bug fixes
- **Security:** Parches de seguridad

### Versionado Semántico
- **MAJOR** (2.0.0): Cambios incompatibles con versión anterior
- **MINOR** (2.1.0): Nuevas features compatibles hacia atrás
- **PATCH** (2.0.1): Bug fixes compatibles hacia atrás

---

**[2.0.0]:** https://github.com/willkwolf/EcoSchoolMap/releases/tag/v2.0.0
**[1.0.0]:** https://github.com/willkwolf/EcoSchoolMap/releases/tag/v1.0.0
