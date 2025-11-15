# 🗺️ Mapa de Escuelas Económicas

[![Demo Live](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=github)](https://willkwolf.github.io/EcoSchoolMap/)
[![Licencia CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg?style=for-the-badge)](https://creativecommons.org/licenses/by-sa/4.0/)
[![D3.js](https://img.shields.io/badge/D3.js-v7-orange?style=for-the-badge&logo=d3.js)](https://d3js.org/)
[![Vite](https://img.shields.io/badge/Vite-v7-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> Visualización interactiva de 12 escuelas de pensamiento económico en un espacio bidimensional, basada en la metodología de **Ha-Joon Chang** (Economics: The User's Guide, 2015).

---

## 📊 Descripción

Este proyecto mapea escuelas económicas en un plano 2D donde:
- **Eje X:** Arquitectura Económica (Estado Fuerte ← → Mercado Libre)
- **Eje Y:** Objetivo Socioeconómico (Crecimiento ↓ ↑ Equidad)

Cada posición se calcula a partir de **6 descriptores cualitativos** fundamentados en la investigación de Ha-Joon Chang sobre la Weltanschauung (visión del mundo) de las escuelas económicas.

### ✨ Características

- 🎯 **12 escuelas económicas:** Desde Clásica hasta Ecológica
- 🔄 **32 variantes de peso:** 8 perspectivas × 4 métodos de normalización
- 📈 **Transiciones históricas:** Eventos que provocaron cambios de paradigma
- 📱 **Diseño responsive:** Mobile-first, optimizado para todos los dispositivos
- 🎨 **Scrollytelling:** Navegación fluida por secciones educativas
- 📥 **Export PNG:** Descarga directa desde el navegador

---

## 🚀 Demo en Vivo

### 🌐 Versión Web Interactiva (D3.js)
**[→ Ver en GitHub Pages](https://willkwolf.github.io/EcoSchoolMap/)**

Incluye:
- Zoom/pan interactivo
- Control de transiciones históricas
- Cambio dinámico entre 32 variantes
- Tooltips ricos con información detallada
- Animaciones suaves con GSAP

---

## 🛠️ Stack Tecnológico

### Frontend (Producción)
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **D3.js** | v7.9.0 | Visualización de datos |
| **GSAP** | v3.13.0 | Animaciones fluidas |
| **Vite** | v7.2.2 | Build tool moderno |
| **Sass** | v1.94.0 | Preprocesador CSS |
| **save-svg-as-png** | v1.4.17 | Export PNG |

### Backend (Data Pipeline)
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Python** | 3.11+ | Lenguaje base |
| **NumPy** | 2.1.3 | Cálculos numéricos |
| **SciPy** | 1.15.3 | Estadística (percentiles, z-scores) |
| **Pandas** | 2.2.3 | Manipulación de datos |
| **matplotlib** | 3.10.0 | Gráficos estáticos PNG |
| **Plotly** | 6.3.0 | HTML standalone (legacy) |

---

## 📦 Instalación

### Requisitos Previos
- **Node.js** 18+ (para frontend)
- **Python** 3.11+ (para data pipeline)
- **Git**

### Frontend - Desarrollo Web

```bash
# Clonar repositorio
git clone https://github.com/willkwolf/EcoSchoolMap.git
cd EcoSchoolMap

# Instalar dependencias npm
npm install

# Servidor de desarrollo con hot reload
npm run dev
# → http://localhost:3000
```

### Backend - Generación de Datos

#### Opción 1: UV (Recomendado)
```bash
# Instalar UV
pip install uv

# Crear entorno virtual
uv venv

# Activar entorno
source .venv/bin/activate  # Linux/Mac
# o
.venv\Scripts\activate     # Windows

# Instalar dependencias
uv sync
```

#### Opción 2: pip tradicional
```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno
source .venv/bin/activate  # Linux/Mac
# o
.venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt
```

---

## 🎯 Uso

### 1️⃣ Visualización Web Interactiva (D3.js)

```bash
# Desarrollo
npm run dev          # Servidor local con hot reload

# Producción
npm run build        # Build optimizado en docs/
npm run preview      # Preview del build
```

**Output:** `docs/index.html` + assets (listo para GitHub Pages)

---

### 2️⃣ HTML Standalone (Plotly - Offline)

Útil para presentaciones sin conexión o distribución standalone:

```bash
python scripts/generate_interactive_plot.py
```

**Output:** `docs/mapa_escuelas.html` (66KB, se abre en cualquier navegador sin servidor)

**Características:**
- Plotly.js embebido
- Funciona offline
- Compatible con PowerPoint/Google Slides

---

### 3️⃣ PNG Estático (Alta Calidad)

Para papers académicos, publicaciones, o impresión:

```bash
# PNG por defecto (300 DPI)
python scripts/generate_static_plot.py

# Alta resolución (600 DPI)
python scripts/generate_static_plot.py --dpi 600

# Variante específica
python scripts/generate_static_plot.py --preset balanced --normalization zscore
```

**Output:** `output/mapa_escuelas.png`

---

## 🔧 Regeneración de Datos

### Generar Variantes de Peso

Si modificas pesos o descriptores:

```bash
# Genera las 32 variantes JSON (8 presets × 4 normalizaciones)
python scripts/generate_weight_variants.py

# Las variantes se guardan en:
# - data/variants/*.json (fuente)
# - public/data/variants/*.json (Vite)
# - docs/data/variants/*.json (build)
```

### Recalcular Posiciones

Si cambias descriptores de escuelas en `data/escuelas.json`:

```bash
# Ver cambios sin aplicar (dry-run)
python scripts/recalculate_positions.py --dry-run

# Aplicar recálculo con normalización por percentiles
python scripts/recalculate_positions.py --method percentile

# Solo validar descriptores
python scripts/recalculate_positions.py --validate-only
```

**IMPORTANTE:** El script crea un backup automático antes de modificar archivos.

### Validar Datos

```bash
# Validar integridad de 32 variantes
python scripts/validate_variants.py

# Detectar solapamientos de nodos
python scripts/detect_overlaps.py

# Comparar resultados entre presets
python scripts/compare_weight_results.py
```

---

## 📁 Estructura del Proyecto

```
/
├── src/                          # Código fuente D3.js
│   ├── main.js                  # Entry point
│   ├── components/
│   │   ├── D3MapRenderer.js     # Renderer principal D3
│   │   └── TooltipManager.js    # Sistema de tooltips
│   ├── data/
│   │   └── loader.js            # Carga async de JSON
│   ├── scrollytelling/
│   │   └── ScrollController.js  # Intersection Observer
│   └── styles/
│       └── main.scss            # Estilos SASS
│
├── scripts/                      # Pipeline Python
│   ├── scoring_methodology.py   # ⭐ Core del scoring
│   ├── generate_weight_variants.py  # Genera 32 variantes
│   ├── recalculate_positions.py     # Recalcula posiciones
│   ├── generate_interactive_plot.py # HTML Plotly standalone
│   ├── generate_static_plot.py      # PNG matplotlib
│   ├── validate_variants.py         # Validación de datos
│   ├── detect_overlaps.py           # Análisis de solapamientos
│   ├── config.py                    # Configuración visual
│   └── legends.py                   # Utilidad leyendas
│
├── data/                         # Fuente de verdad
│   ├── escuelas.json            # 12 escuelas + transiciones
│   └── variants/                # 32 variantes generadas
│
├── public/                       # Assets estáticos (Vite)
│   └── data/                    # Copiado desde data/
│
├── docs/                         # Build producción (GitHub Pages)
│   ├── index.html               # Entry point D3.js
│   ├── assets/                  # Bundles JS/CSS
│   └── data/                    # Datos JSON
│
├── index.html                    # HTML fuente
├── package.json                  # Dependencias npm
├── vite.config.js                # Config Vite
├── pyproject.toml                # Dependencias Python (UV)
├── requirements.txt              # Dependencias Python (pip)
├── README.md                     # Este archivo
├── CONTRIBUTING.md               # Guía para colaboradores
└── CHANGELOG.md                  # Registro de cambios
```

---

## 🧮 Metodología de Scoring

### Fundamentación Teórica

Basado en **Ha-Joon Chang** (Economics: The User's Guide, 2015), cada escuela económica tiene una **Weltanschauung** (visión del mundo) única que determina:
- Qué fenómenos considera importantes
- Cómo los explica
- Qué políticas recomienda

### Los 6 Descriptores Fundamentales

#### 1️⃣ Concepción de la Economía
**¿Cuál es la unidad de análisis?**
- `0.0` = **Individuos** (metodología individualista)
- `0.5` = **Estructuras** (instituciones, mercados)
- `1.0` = **Clases Sociales** (conflicto de clases)

#### 2️⃣ Concepción del Ser Humano
**¿Cómo toma decisiones el ser humano?**
- `0.0` = **Racional Egoísta** (homo economicus)
- `1.0` = **Racionalidad Limitada** / Condicionado por Clase

#### 3️⃣ Naturaleza del Mundo
**¿Qué tan predecible es la economía?**
- `0.0` = **Cierto y Predecible** (equilibrio, leyes universales)
- `1.0` = **Complejo e Incierto** (cambio histórico, contingencia)

#### 4️⃣ Ámbito Económico Principal
**¿Qué aspecto de la economía es más importante?**
- `0.0` = **Producción** (oferta, tecnología)
- `0.33` = **Consumo** (demanda agregada)
- `0.67` = **Comercio** (intercambio, mercados)
- `1.0` = **Distribución** (desigualdad, redistribución)

#### 5️⃣ Motor del Cambio Económico
**¿Qué impulsa el desarrollo económico?**
- `0.0` = **Acumulación de Capital** (ahorro e inversión)
- `0.25` = **Decisiones Individuales** (libre elección)
- `0.5` = **Innovación Tecnológica** (Schumpeter)
- `0.75` = **Instituciones** (North, Ostrom)
- `1.0` = **Lucha de Clases** (Marx)

#### 6️⃣ Políticas Preferidas
**¿Qué rol debe tener el Estado?**
- `0.0` = **Libre Mercado** (laissez-faire, Estado mínimo)
- `0.5` = **Ambiguas / Mixtas**
- `1.0` = **Intervención Estatal / Redistribución**

### Cálculo de Posiciones

Los descriptores se combinan con **pesos configurables** para calcular:

```
X (Arquitectura Económica) = f(politicas_preferidas, motor_cambio, ...)
Y (Objetivo Socioeconómico) = f(ambito_economico, concepcion_humano, ...)
```

**Rango:** `[-0.9, 0.9]` (evita puntos en bordes del gráfico)

---

## 🎨 Presets de Peso

Diferentes perspectivas enfatizan distintos aspectos:

| Preset | Enfoque | Descriptores Enfatizados |
|--------|---------|--------------------------|
| `base` | Original balanceado | Todos con peso equitativo |
| `balanced` | Equilibrado ajustado | Ajustes menores sobre base |
| `state-emphasis` | Rol del Estado | ++politicas_preferidas |
| `equity-emphasis` | Equidad social | ++ambito_economico (distribución) |
| `market-emphasis` | Mercado libre | ++politicas_preferidas (mercado) |
| `growth-emphasis` | Crecimiento | ++ambito_economico (producción) |
| `historical-emphasis` | Evolución histórica | ++naturaleza_mundo |
| `pragmatic-emphasis` | Pragmatismo | ++concepcion_humano |

### Métodos de Normalización

| Método | Descripción | Uso Recomendado |
|--------|-------------|-----------------|
| `percentile` | Distribución uniforme (0-100%) | **Por defecto**, distribución balanceada |
| `zscore` | Centrado estadístico (media=0, σ=1) | Resaltar desviaciones extremas |
| `minmax` | Rango completo [-1, 1] | Maximizar dispersión visual |
| `none` | Sin normalizar (valores crudos) | Debugging, análisis raw |

---

## 🎨 Sistema de Colores

**Klein Schema** - Paleta de 11 colores único:

```python
#FF4D6F  #579EA4  #DF7713  #F9C000  #86AD34
#5D7298  #81B28D  #7E1A2F  #2D2651  #C8350D  #BD777A
```

**Fuente:** [Python Graph Gallery - Klein Palette](https://python-graph-gallery.com/color-palette-finder/?palette=klein)

**Asignación:** Secuencial sin repetición (Nodo 1 → Color 1, Nodo 2 → Color 2, etc.)

---

## 🗂️ Formato de Datos

### Estructura de `data/escuelas.json`

```json
{
  "metadata": {
    "version": "5.0",
    "autor": "William Camilo Artunduaga Viana",
    "fuente_metodologica": "Ha-Joon Chang - Economics: The User's Guide (2015)"
  },
  "nodos": [
    {
      "id": "keynesiana",
      "nombre": "Keynesiana",
      "tipo": "tradicional",
      "ano_fundacion": 1936,
      "autores": "John Maynard Keynes",
      "descripcion": "Intervención estatal para estabilizar ciclos económicos",
      "descripcion_corta": "Regulacionista Coordinación",
      "color": "#86AD34",
      "posicion": { "x": -0.4, "y": 0.04 },
      "descriptores": {
        "concepcion_economia": 0.5,
        "concepcion_humano": 1.0,
        "naturaleza_mundo": 1.0,
        "ambito_economico": 0.33,
        "motor_cambio": 0.75,
        "politicas_preferidas": 1.0
      },
      "caracteristicas": {
        "Concepcion Economia": "Estructuras",
        "Concepcion Humano": "Racionalidad Limitada",
        "Naturaleza Mundo": "Complejo Incierto",
        "Ambito Economico": "Consumo",
        "Motor Cambio": "Instituciones",
        "Politicas Preferidas": "Intervencion Estatal"
      }
    }
  ],
  "transiciones": [
    {
      "id": "crisis_2008",
      "desde_nodo": "neoclasica",
      "hacia_nodo": "keynesiana",
      "evento_disparador": "Crisis financiera 2008",
      "descripcion": "Del laissez-faire a regulación y rescates estatales",
      "año": 2008,
      "confianza": "muy_alta"
    }
  ]
}
```

### Tipos de Nodo (Geometría)

| Tipo | Símbolo | Uso |
|------|---------|-----|
| `tradicional` | ● Círculo | Escuelas clásicas (Keynesiana, Neoclásica, etc.) |
| `nuevo_paradigma` | ◆ Diamante | Paradigmas emergentes S.XXI (Ecológica, Estado Emprendedor) |
| `tradicion` | ■ Cuadrado | Tradiciones históricas (Desarrollista) |

---

## 🚀 Deploy a GitHub Pages

### Configuración Automática

El proyecto está configurado para deployar automáticamente a GitHub Pages desde `docs/`:

1. **Build producción:**
   ```bash
   npm run build
   # Genera: docs/index.html + assets/
   ```

2. **Commit y push:**
   ```bash
   git add docs/
   git commit -m "build: Update production build v2.0.0"
   git push origin master
   ```

3. **GitHub Pages:**
   - Settings → Pages → Source: "Deploy from branch"
   - Branch: `master`, Folder: `/docs`
   - URL: `https://willkwolf.github.io/EcoSchoolMap/`

### Verificación

Después de push, espera 1-2 minutos y visita:
```
https://willkwolf.github.io/EcoSchoolMap/
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Agregar nuevas escuelas económicas
- Modificar pesos/descriptores
- Mejorar la visualización
- Reportar bugs

### Quick Start para Contribuidores

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-escuela`
3. Haz tus cambios y commit: `git commit -m 'feat: Add Austrian School'`
4. Push a tu fork: `git push origin feature/nueva-escuela`
5. Abre un Pull Request

---

## 📚 Referencias

### Metodología
- **Chang, Ha-Joon** (2014). _Economics: The User's Guide_ - Análisis de la Weltanschauung
- **Chang, Ha-Joon** (2010). _23 Things They Don't Tell You About Capitalism_
- **North, Douglass** (1990). _Institutions, Institutional Change and Economic Performance_
- **Kahneman, Daniel** (2011). _Thinking, Fast and Slow_ - Racionalidad limitada

### Escuelas Económicas
- **Raworth, Kate** (2012). _A Safe and Just Space for Humanity_ - Economía ecológica
- **Mazzucato, Mariana** (2013). _The Entrepreneurial State_
- **Federici, Silvia** (2004). _Caliban and the Witch_ - Economía feminista
- **Schumpeter, Joseph** (1942). _Capitalism, Socialism and Democracy_

---

## 📜 Licencia

**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**

[![CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-sa/4.0/)

**Esto significa que puedes:**
- ✅ Compartir - copiar y redistribuir el material
- ✅ Adaptar - remezclar, transformar y crear a partir del material
- ✅ Uso comercial permitido

**Bajo las siguientes condiciones:**
- 📝 **Atribución:** Debes dar crédito apropiado
- 🔗 **ShareAlike:** Debes distribuir bajo la misma licencia
- 🎓 **Académico:** Cita como fuente en trabajos de investigación

### Cómo Citar

```bibtex
@software{artunduaga2025mapa,
  author = {Artunduaga Viana, William Camilo},
  title = {Mapa de Escuelas Políticas Económicas},
  year = {2025},
  url = {https://github.com/willkwolf/EcoSchoolMap},
  note = {Basado en la metodología de Ha-Joon Chang}
}
```

---

## 👤 Autor

**William Camilo Artunduaga Viana**

- GitHub: [@willkwolf](https://github.com/willkwolf)
- Proyecto: [EcoSchoolMap](https://github.com/willkwolf/EcoSchoolMap)

---

## 📝 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para el historial completo de versiones.

**Versión Actual:** 2.0.0 (Migración D3.js)

---

<p align="center">
  Hecho con ❤️ para la comunidad educativa y de investigación económica
</p>

<p align="center">
  <a href="https://willkwolf.github.io/EcoSchoolMap/">🌐 Ver Demo en Vivo</a> •
  <a href="https://github.com/willkwolf/EcoSchoolMap/issues">🐛 Reportar Bug</a> •
  <a href="https://github.com/willkwolf/EcoSchoolMap/discussions">💡 Sugerir Feature</a>
</p>
