# Mapa de Escuelas Politicas Economicas - v5.0

Visualizacion interactiva de escuelas politicas economicas con:
- **Arquitectura modular refactorizada**
- **Metodologia de scoring basada en Ha-Joon Chang**
- **Descriptores cualitativos para posicionamiento fundamentado**
- **Generadores separados para PNG estatico y HTML interactivo**

## Arquitectura v5.0

```
data/escuelas.json                      (Data Scientists)
    ↓ Descriptores cualitativos + Posiciones
scripts/scoring_methodology.py          (Metodologia de puntuacion)
    ↓ Calcula posiciones desde descriptores
scripts/generate_static_plot.py         (Generador PNG)
    ↓ Imagen estatica de alta calidad
scripts/generate_interactive_plot.py    (Generador HTML)
    ↓ Visualizacion interactiva Plotly
scripts/config.py                       (Configuracion visual)
    ↓ Colores, estilos, constantes
output/ + docs/                         (Salidas)
```

### Novedades v5.0

- **Metodologia fundamentada**: Scoring basado en 6 descriptores de Ha-Joon Chang
- **Modulos separados**: PNG estatico e HTML interactivo en scripts independientes
- **Descriptores semanticos**: Cada escuela con caracteristicas cualitativas explícitas
- **Mejor diferenciacion**: Posiciones calculadas algoritmicamente, no arbitrarias
- **Tooltips enriquecidos**: HTML interactivo muestra descriptores completos
- **Scripts utilitarios**: Herramienta para recalcular posiciones automaticamente
- **Paleta Klein Schema**: 11 colores unicos, sin repeticion
- **Una verdad visual**: Mismo color para nodo + leyenda

## Metodologia de Scoring (Ha-Joon Chang)

La posicion de cada escuela economica se calcula a partir de **6 descriptores cualitativos** inspirados en el analisis de la Weltanschauung (vision del mundo) de Ha-Joon Chang:

### 6 Descriptores Fundamentales

1. **Concepcion de la economia**
   - `clases_sociales`: Analisis basado en conflicto entre clases
   - `individuos`: Enfoque en decisiones individuales
   - `estructuras`: Enfasis en estructuras e instituciones
   - `indefinido`: Sin postura clara

2. **Concepcion del ser humano**
   - `racional_egoista`: Homo economicus clasico
   - `condicionado_clase`: Determinado por posicion social
   - `racionalidad_limitada`: Bounded rationality (Kahneman, Simon)
   - `no_definido`: Ambiguo

3. **Naturaleza del mundo**
   - `cierto_predecible`: Confianza en modelos deterministicos
   - `complejo_incierto`: Incertidumbre fundamental, no ergodico
   - `ambiguo`: Posicion no definida

4. **Ambito economico relevante**
   - `produccion`: Enfasis en oferta y creacion de valor
   - `comercio`: Intercambio y mercados
   - `consumo`: Demanda agregada
   - `distribucion`: Redistribucion y equidad

5. **Motor del cambio economico**
   - `acumulacion_capital`: Inversion y ahorro
   - `decisiones_individuales`: Libre eleccion
   - `lucha_clases`: Conflicto social
   - `innovacion_tecnologica`: Schumpeteriano
   - `instituciones`: Cambio institucional (North, Ostrom)

6. **Politicas economicas preferidas**
   - `libre_mercado`: Minima intervencion estatal
   - `intervencion_estatal`: Regulacion activa
   - `redistribucion`: Redistribucion radical
   - `ambiguas`: Mixtas o no definidas

### Calculos y Normalizacion

- **Eje X (Control Estatal)**: Valores negativos = Estado fuerte, positivos = Estado debil
- **Eje Y (Equidad vs Crecimiento)**: Positivo = Equidad, negativo = Crecimiento
- **Rango**: [-0.9, 0.9] para evitar puntos en bordes
- **Normalizacion**: Opciones de 'none', 'percentile', 'zscore', 'minmax'

Cada descriptor aporta un peso especifico a los ejes X e Y, combinandose para producir una posicion fundamentada conceptualmente.

## Sistema de Colores

**Klein Schema** (11 colores):
```python
#FF4D6F  #579EA4  #DF7713  #F9C000  #86AD34
#5D7298  #81B28D  #7E1A2F  #2D2651  #C8350D  #BD777A
```

Fuente: https://python-graph-gallery.com/color-palette-finder/?palette=klein

**Asignación**: Secuencial sin repetición
- Nodo 1 → Color 1
- Nodo 2 → Color 2
- ...
- Nodo 11 → Color 11

Si hay más nodos que colores, recicla la paleta.

## Responsabilidades por Rol

| Rol | Archivos | Tareas |
|-----|----------|--------|
| **Data Scientist** | `data/escuelas.json`<br/>`scripts/scoring_methodology.py` | - Definir descriptores cualitativos de escuelas<br/>- Ajustar pesos y valores de scoring<br/>- Validar posiciones calculadas |
| **Viz Engineer** | `scripts/generate_static_plot.py`<br/>`scripts/generate_interactive_plot.py` | - Generar visualizaciones PNG e HTML<br/>- Personalizar graficos y tooltips<br/>- Agregar nuevos formatos de salida |
| **Architect** | `scripts/config.py` | - Definir paletas de colores<br/>- Configurar estilos visuales<br/>- Establecer constantes del sistema |
| **DevOps/Utilities** | `scripts/recalculate_positions.py` | - Recalcular posiciones en batch<br/>- Validar integridad de datos<br/>- Automatizar flujos de trabajo |

## Instalacion Rapida

```bash
# Clonar y entrar
git clone https://github.com/tu-usuario/mapa-escuelas-politicas.git
cd mapa-escuelas-politicas

# Entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias (incluye scipy para scoring)
pip install -r requirements.txt
```

## Uso - Generar Visualizaciones

### Opcion 1: Generar imagen estatica (PNG)

```bash
python scripts/generate_static_plot.py
```

**Salida:** `output/mapa_escuelas.png` - Imagen PNG de alta calidad (300 DPI)

**Opciones avanzadas:**
```bash
# Cambiar resolucion
python scripts/generate_static_plot.py --dpi 600

# Personalizar salida
python scripts/generate_static_plot.py --output mi_mapa.png
```

### Opcion 2: Generar visualizacion interactiva (HTML)

```bash
python scripts/generate_interactive_plot.py
```

**Salida:** `docs/mapa_escuelas.html` - Visualizacion interactiva con Plotly

**Opciones avanzadas:**
```bash
# Tema oscuro
python scripts/generate_interactive_plot.py --theme dark

# Personalizar salida
python scripts/generate_interactive_plot.py --output mi_mapa.html
```

### Opcion 3: Generar ambos

```bash
python scripts/generate_static_plot.py && python scripts/generate_interactive_plot.py
```

## Uso Avanzado - Recalcular Posiciones

Si modificas los descriptores de las escuelas en `escuelas.json`, puedes recalcular automaticamente todas las posiciones:

```bash
# Ver cambios sin aplicar (modo dry-run)
python scripts/recalculate_positions.py --dry-run

# Aplicar recalculo con normalizacion por percentiles
python scripts/recalculate_positions.py --method percentile

# Solo validar descriptores
python scripts/recalculate_positions.py --validate-only
```

**IMPORTANTE:** El script crea un backup automatico antes de modificar `escuelas.json`.

## Estructura JSON (v5.0)

### Nodos (con descriptores y posicion)
```json
{
  "id": "keynesiana",
  "nombre": "Keynesiana",
  "categoria": "regulacionista_coordinacion",
  "descripcion": "Intervencion estatal para estabilizar ciclos economicos",
  "autores": ["John Maynard Keynes"],
  "año_origen": 1936,
  "tipo": "tradicional",
  "descriptores": {
    "concepcion_economia": "estructuras",
    "concepcion_humano": "racionalidad_limitada",
    "naturaleza_mundo": "complejo_incierto",
    "ambito_economico": "consumo",
    "motor_cambio": "instituciones",
    "politicas_preferidas": "intervencion_estatal"
  },
  "posicion": {
    "x": 0.25,
    "y": 0.70,
    "justificacion": "Estado moderado + Equidad y crecimiento balanceados"
  }
}
```

Los **descriptores** son opcionales pero altamente recomendados. Si una escuela tiene descriptores, su posicion puede ser recalculada automaticamente usando `recalculate_positions.py`.

### Transiciones (entre nodos)
```json
{
  "id": "crisis_2008",
  "desde_nodo": "neoclasica",
  "hacia_nodo": "keynesiana",
  "evento_disparador": "Crisis financiera 2008",
  "año": 2008,
  "confianza": "muy_alta"
}
```

## 🔄 Ciclo de Desarrollo

### Para Data Scientists: Agregar escuela

1. Edita `data/escuelas.json`
2. Agrega nodo con propiedades (id, nombre, posición)
3. Ejecuta: `python scripts/generate_plot.py`
4. Script asigna color automáticamente

```bash
python scripts/generate_plot.py
```

### Para Architects: Cambiar paleta de colores

1. Edita `scripts/config.py`
2. Modifica `KLEIN_SCHEMA` (o agrega nueva paleta)
3. Ejecuta: `python scripts/generate_plot.py`

```python
# En config.py
KLEIN_SCHEMA = [
    "#FF4D6F",  # Tu nuevo color 1
    "#579EA4",  # Tu nuevo color 2
    ...
]
```

### Para Viz Engineers: Agregar nuevo formato

1. Edita `scripts/generate_plot.py`
2. Agrega método (ej: `generar_svg()`)
3. Script reutiliza colores asignados

```python
def generar_svg(self):
    """Genera versión SVG con mismos colores"""
    ...
```

## 📐 Sistemas de Coordenadas

```
       +1.0 (EQUIDAD)
         ↑
         |
-1.0 ← --+-- → +1.0 (CONTROL ESTATAL)
(FUERTE) 0  (DÉBIL)
         |
         ↓
       -1.0 (CRECIMIENTO)
```

**Cuadrantes:**
- Q1 (arriba-izq): Estado fuerte + Equidad
- Q2 (arriba-der): Estado fuerte + Crecimiento
- Q3 (abajo-izq): Estado débil + Equidad
- Q4 (abajo-der): Estado débil + Crecimiento

## 🎨 Tipos de Nodo (Geometría)

| Tipo | Símbolo | Uso |
|------|---------|-----|
| `tradicional` | ● (círculo) | Escuelas clásicas |
| `nuevo_paradigma` | ◆ (diamante) | Nuevos paradigmas S.XXI |
| `tradicion` | ■ (cuadrado) | Tradiciones históricas |

Bordes grises indican geometría, **no significado semántico**.

## 📈 Reporte de Validación

Al ejecutar el script, genera reporte automático:

```
📊 REPORTE DE VALIDACIÓN
================================================
Versión JSON: 3.0
Total de nodos: 12
Total de transiciones: 5

Nodos por categoría:
  • izquierda_redistribución: 2
  • regulacionista_coordinación: 2
  • nuevo_paradigma_sostenibilidad: 1
  • ...
```

## 🌐 Ver en línea

### GitHub Pages (sin instalar)
[![Ver gráfico](https://img.shields.io/badge/Ver%20gráfico-GitHub%20Pages-blue?style=for-the-badge)](https://tu-usuario.github.io/mapa-escuelas-politicas)

### Google Colab (reproducible)
[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/tu-usuario/mapa-escuelas-politicas/blob/main/notebooks/mapa_escuelas.ipynb)

## 🛠️ Troubleshooting

### Error: "mapa_escuelas.json not found"
```bash
# Asegúrate de ejecutar desde la raíz
cd mapa-escuelas-politicas
python scripts/generate_plot.py
```

### Error: "Nodo sin posición definida"
```bash
# Verifica que cada nodo en JSON tiene:
{
  "id": "...",
  "posicion": {
    "x": número,
    "y": número
  }
}
```

### Colores no se actualizan
1. Elimina `output/` y `docs/mapa_escuelas.html`
2. Ejecuta nuevamente: `python scripts/generate_plot.py`

## Referencias

### Metodologia de Scoring

- **Chang, Ha-Joon** (2014). "Economics: The User's Guide" - Analisis de la Weltanschauung de escuelas economicas
- **Chang, Ha-Joon** (2010). "23 Things They Don't Tell You About Capitalism"
- **Kahneman, Daniel** (2011). "Thinking, Fast and Slow" - Racionalidad limitada
- **North, Douglass** (1990). "Institutions, Institutional Change and Economic Performance"

### Escuelas Economicas

- **Raworth, Kate** (2012). "A Safe and Just Space for Humanity" - Economia ecologica
- **Mazzucato, Mariana** (2013). "The Entrepreneurial State"
- **Federici, Silvia** (2004). "Caliban and the Witch" - Economia feminista
- **Schumpeter, Joseph** (1942). "Capitalism, Socialism and Democracy"

## 📜 Licencia

MIT - Libre para usar, modificar y compartir.

---

## 🎓 Patrón Reutilizable

Esta arquitectura es aplicable a cualquier proyecto con:
- Datos nodales (JSON semántico)
- Posiciones explícitas
- Paleta de colores única
- Múltiples formatos de salida

**Fórmula:**
```
JSON (datos + posiciones)
  ↓
Config (colores, estilos)
  ↓
Script (visualización)
  ↓
Múltiples outputs (PNG, HTML, SVG, etc.)
```
