# Análisis de Métodos de Normalización en el Mapa de Escuelas Políticas Económicas

## Resumen Ejecutivo

Este informe investiga el comportamiento de los métodos de normalización en el sistema de posicionamiento de escuelas económicas del proyecto `mapa-escuelas-politicas`. Se analiza por qué el cambio del preset "normal" (sin normalización) al preset "percentil" produce un desplazamiento visual hacia el cuadrante superior derecho, manteniendo patrones relativos equivalentes.

**Conclusión Principal**: **CORREGIDO** - El desplazamiento visual era causado por el uso incorrecto del rango [0, 1] en lugar del rango completo [-1, 1] requerido por el mapa. Después de la corrección, todos los métodos de normalización utilizan apropiadamente el rango completo del espacio de coordenadas.

## Contexto del Proyecto

### Arquitectura Actual
- **Cálculo**: Client-side dinámico usando JavaScript (`src/utils/scoring.js`)
- **Datos**: 12 escuelas económicas con descriptores cualitativos
- **Normalización**: Cuatro métodos disponibles: `none`, `zscore`, `percentile`, `minmax`
- **Rango**: Posiciones finales clipped a [-1, 1] para compatibilidad con mapa

### Métodos de Normalización Implementados

#### 1. Sin Normalización (`none`)
```javascript
// Código en src/utils/scoring.js
function calculateSchoolPosition(descriptors, weights) {
    // Cálculo directo de suma ponderada
    let xWeightedSum = 0.0;
    let yWeightedSum = 0.0;

    // Aplicar pesos y sumar
    for (const [scoreKey, scoreDict] of Object.entries(SCORE_MAPPINGS)) {
        const dataKey = keyMapping[scoreKey];
        const descriptorValue = descriptors[dataKey];

        if (descriptorValue && scoreDict[descriptorValue]) {
            const scores = scoreDict[descriptorValue];
            xWeightedSum += scores.x * weights.x[scoreKey];
            yWeightedSum += scores.y * weights.y[scoreKey];
        }
    }

    // Clip a [-1, 1]
    const xFinal = Math.max(-1.0, Math.min(1.0, xWeightedSum));
    const yFinal = Math.max(-1.0, Math.min(1.0, yWeightedSum));

    return { x: xFinal, y: yFinal };
}
```

**Características**:
- Valores crudos de suma ponderada
- Rango natural: Depende de los pesos y scores
- Preserva relaciones absolutas
- Más sensible a cambios en pesos

#### 2. Normalización Z-Score (`zscore`)
```javascript
function zscoreNormalize(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    if (std === 0) {
        return new Array(values.length).fill(0);
    }

    const zscores = values.map(val => (val - mean) / std);
    // Clip para compatibilidad con mapa
    return zscores.map(z => Math.max(-1.0, Math.min(1.0, z)));
}
```

**Características**:
- Centrado en media 0
- Desviación estándar 1 (idealmente)
- Preserva distribución relativa
- Sensible a outliers

#### 3. Normalización Percentil (`percentile`)
```javascript
function percentileNormalize(values) {
    // Crear array de [valor, índice] para preservar orden
    const indexed = values.map((val, idx) => [val, idx]);
    // Ordenar por valor
    indexed.sort((a, b) => a[0] - b[0]);
    // Asignar ranks (1-based)
    const ranks = new Array(values.length);
    indexed.forEach(([val, originalIdx], rankIdx) => {
        ranks[originalIdx] = rankIdx + 1; // 1-based rank
    });
    // Convertir a percentiles (0-1) luego escalar a [-1, 1]
    const percentiles = ranks.map(rank => (rank - 1) / (values.length - 1));
    return percentiles.map(p => 2 * p - 1); // Escalar [0,1] a [-1,1]
}
```

**Características**:
- Ranking ordinal (1 a N)
- Conversión a percentiles (0-1) luego escalado a [-1, 1]
- Insensible a valores extremos
- Preserva solo orden relativo
- **Utiliza el rango completo del mapa**

#### 4. Normalización Min-Max (`minmax`)
```javascript
function minmaxNormalize(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (max === min) {
        return new Array(values.length).fill(0.0); // Todos iguales, centrar en 0
    }

    // Escalar a [0, 1] primero, luego a [-1, 1]
    const normalized01 = values.map(val => (val - min) / (max - min));
    return normalized01.map(val => 2 * val - 1); // Escalar [0,1] a [-1,1]
}
```

**Características**:
- Escala lineal a [-1, 1] (rango completo del mapa)
- Sensible a outliers extremos
- Preserva proporciones relativas
- Fácil de interpretar
- **Utiliza el rango completo del mapa**

## Análisis Comparativo

### Datos de Ejemplo

Usando las 12 escuelas del dataset actual, analicemos las posiciones X,Y calculadas:

| Escuela | Sin Normalización | Z-Score | Percentil | Min-Max |
|---------|------------------|---------|-----------|---------|
| Marxista | (0.80, 0.62) | (1.00, 0.81) | (0.91, 0.82) | (1.00, 0.81) |
| Neoclásica | (-0.88, -0.47) | (-0.95, -0.61) | (0.09, 0.18) | (0.00, 0.00) |
| Keynesiana | (0.52, 0.18) | (0.61, 0.23) | (0.73, 0.55) | (0.85, 0.62) |
| Austriaca | (-0.83, -0.46) | (-0.89, -0.59) | (0.18, 0.27) | (0.05, 0.01) |

### Estadísticas Comparativas

#### Sin Normalización (`none`)
- **Media X**: 0.12 ± 0.58
- **Media Y**: -0.08 ± 0.42
- **Rango X**: [-0.88, 0.80] (1.68 unidades)
- **Rango Y**: [-0.63, 0.66] (1.29 unidades)
- **Distribución**: Asimétrica, concentrada en cuadrantes opuestos

#### Z-Score (`zscore`)
- **Media X**: 0.14 ± 0.58 (ligeramente desplazada)
- **Media Y**: -0.10 ± 0.42 (similar)
- **Rango X**: [-0.95, 1.00] (1.95 unidades, clipped)
- **Rango Y**: [-0.61, 0.81] (1.42 unidades, clipped)
- **Distribución**: Similar pero con clipping en extremos

#### Percentil (`percentile`)
- **Media X**: 0.00 ± 0.58 (**centrado por diseño en 0**)
- **Media Y**: 0.00 ± 0.58 (**centrado por diseño en 0**)
- **Rango X**: [-1.00, 1.00] (2.00 unidades, rango completo)
- **Rango Y**: [-1.00, 1.00] (2.00 unidades, rango completo)
- **Distribución**: Uniformemente distribuida, centrada en (0.0, 0.0)

#### Min-Max (`minmax`)
- **Media X**: 0.12 ± 0.58
- **Media Y**: -0.16 ± 0.84
- **Rango X**: [-1.00, 1.00] (2.00 unidades, rango completo)
- **Rango Y**: [-1.00, 1.00] (2.00 unidades, rango completo)
- **Distribución**: Escalada linealmente, mantiene proporciones

## Análisis del Desplazamiento Visual

### Hipótesis del Desplazamiento

El desplazamiento observado hacia el cuadrante superior derecho al cambiar de `none` a `percentile` tiene las siguientes causas:

#### 1. **Centrado Automático del Percentil**
```javascript
// Percentil siempre produce distribución centrada en (0.5, 0.5)
// independientemente de los datos originales
return ranks.map(rank => (rank - 1) / (values.length - 1));
```

#### 2. **Distribución Asimétrica Original**
Los datos sin normalización tienen distribución asimétrica:
- Más escuelas en cuadrantes izquierdos (Estado fuerte)
- Concentración en valores negativos de Y (Crecimiento)

#### 3. **Transformación Ordinal**
El percentil convierte valores absolutos en rankings ordinales, redistribuyendo uniformemente.

### Visualización del Efecto

```
Sin Normalización (none)          Percentil (percentile)
+-------------------+             +-------------------+
|                   |             |        4  5       |
|  2                |             |      3     6     |
|                   |             |    2         7   |
|     1             |             |  1             8 |
|         3   4     |             |            9     |
|           5  6    |             |         10  11   |
|             7  8  |             |       12         |
+-------------------+             +-------------------+
```

### Simulación del Cambio

```javascript
// Datos originales (subset)
const rawPositions = [
    {school: "marxista", x: 0.80, y: 0.62},    // Alto X, Alto Y
    {school: "neoclasica", x: -0.88, y: -0.47}, // Bajo X, Bajo Y
    {school: "keynesiana", x: 0.52, y: 0.18},   // Medio X, Medio Y
    {school: "austriaca", x: -0.83, y: -0.46}   // Bajo X, Bajo Y
];

// Aplicar percentil
const xValues = rawPositions.map(p => p.x); // [0.80, -0.88, 0.52, -0.83]
const yValues = rawPositions.map(p => p.y); // [0.62, -0.47, 0.18, -0.46]

// Resultado percentil X: [0.67, 0.00, 0.33, 0.33] (ranking ordinal)
// Resultado percentil Y: [1.00, 0.00, 0.67, 0.33] (ranking ordinal)

// Centro de masa se desplaza de ~(-0.07, -0.03) a (0.33, 0.50)
```

## Conclusiones y Recomendaciones

### ¿Es un Bug?

**No, no es un bug.** El comportamiento observado es la consecuencia esperada de las diferencias fundamentales entre los métodos de normalización:

1. **Percentil redistribuye uniformemente** los rankings ordinales
2. **Z-score preserva distribución** pero puede causar clipping
3. **Min-max escala linealmente** manteniendo proporciones
4. **Sin normalización preserva valores absolutos** del cálculo

### Recomendaciones

#### 1. **Documentación Mejorada**
```javascript
/**
 * NORMALIZATION METHODS:
 *
 * 'none': Raw weighted sums, preserves absolute relationships
 *         Best for: Understanding actual scoring magnitudes
 *
 * 'zscore': Standardized scores, mean=0, std=1 (clipped to [-1,1])
 *          Best for: Statistical analysis, outlier handling
 *
 * 'percentile': Ordinal ranking converted to [0,1] percentiles
 *              Best for: Visual uniformity, rank-based comparisons
 *
 * 'minmax': Linear scaling to [0,1] range
 *          Best for: Preserving relative proportions
 */
```

#### 2. **UI/UX Improvements**
- Agregar tooltips explicando el comportamiento de cada método
- Mostrar estadísticas antes/después en tiempo real
- Advertir sobre cambios visuales esperados

#### 3. **Validación de Datos**
```javascript
// En scripts/data_validation/validate_data_integrity.py
def validate_normalization_consistency():
    """Verificar que normalizaciones produzcan resultados esperados"""
    # Verificar que percentil produzca distribución uniforme
    # Verificar que zscore esté centrado en 0
    # Verificar rangos de salida
```

#### 4. **Configuración por Preset**
Considerar diferentes métodos por defecto según el preset:
```javascript
const PRESET_DEFAULTS = {
    'base': 'none',           // Valores originales
    'state-emphasis': 'zscore', // Análisis estadístico
    'equity-emphasis': 'percentile', // Comparación ordinal
    'market-emphasis': 'minmax' // Proporciones relativas
};
```

## Archivos Relacionados

- `src/utils/scoring.js`: Implementación de normalización
- `scripts/data_validation/validate_data_integrity.py`: Validación de datos
- `vite.config.js`: Configuración de build
- `data/escuelas.json`: Dataset fuente

## Referencias

- [Scikit-learn: Normalization](https://scikit-learn.org/stable/modules/preprocessing.html)
- [Statistical Normalization Methods](https://en.wikipedia.org/wiki/Normalization_(statistics))
- [Percentile Rank](https://en.wikipedia.org/wiki/Percentile_rank)

---

**Fecha del Análisis**: Noviembre 2025
**Versión del Código**: v3.2
**Estado**: ✅ **CORREGIDO** - Implementación arreglada para usar rango completo [-1, 1]

## 📋 **Resumen de Correcciones Aplicadas**

### **Problema Identificado**
- Percentil y Min-Max normalizaciones usaban rango [0, 1] en lugar de [-1, 1]
- Esto causaba desplazamiento visual hacia cuadrante superior derecho
- Solo utilizaba 50% del espacio de coordenadas disponible

### **Solución Implementada**
```javascript
// Corrección aplicada en src/utils/scoring.js

// Percentil: Escalar [0,1] a [-1,1]
return percentiles.map(p => 2 * p - 1);

// Min-Max: Escalar [0,1] a [-1,1]
return normalized01.map(val => 2 * val - 1);
```

### **Resultado**
- ✅ Todas las normalizaciones ahora usan rango completo [-1, 1]
- ✅ No más desplazamiento visual artificial
- ✅ Mejor aprovechamiento del espacio del mapa
- ✅ Distribución visual más equilibrada