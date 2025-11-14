# Variantes del Mapa de Escuelas Políticas Económicas

Este directorio contiene 32 variantes pre-calculadas del mapa, combinando 8 perspectivas de peso con 4 métodos de normalización.

## Estructura de Archivos

Cada variante sigue el patrón de nomenclatura: `{preset}-{method}.json`

### Presets de Peso (8)

1. **base**: Pesos originales balanceados
2. **balanced**: Distribución equilibrada alternativa
3. **state-emphasis**: Énfasis en rol del Estado
4. **equity-emphasis**: Énfasis en equidad y redistribución
5. **market-emphasis**: Énfasis en libre mercado
6. **growth-emphasis**: Énfasis en crecimiento y productividad
7. **historical-emphasis**: Énfasis en contexto histórico
8. **pragmatic-emphasis**: Énfasis en pragmatismo y eficacia

### Métodos de Normalización (4)

#### 1. **percentile** (Recomendado)
- **Uso**: Visualización clara y distribuida
- **Descripción**: Calcula el percentil de cada escuela y mapea uniformemente al espacio visual
- **Ventajas**:
  - Distribución equilibrada de nodos
  - Fácil interpretación visual
  - Reduce clusters excesivos
- **Cuándo usar**: Para presentaciones y análisis general

#### 2. **zscore**
- **Uso**: Análisis estadístico comparativo
- **Descripción**: Normaliza usando media y desviación estándar (z-scores)
- **Ventajas**:
  - Resalta desviaciones de la media
  - Ideal para análisis estadístico
  - Mantiene proporciones relativas
- **Cuándo usar**: Para comparar distribuciones entre diferentes configuraciones

#### 3. **minmax**
- **Uso**: Máxima separación visual
- **Descripción**: Mapea el rango completo [min, max] a [-0.9, 0.9]
- **Ventajas**:
  - Usa todo el espacio disponible
  - Maximiza diferencias visuales
  - Menos overlaps en general
- **Cuándo usar**: Cuando se necesita máxima claridad visual

#### 4. **none** (Raw)
- **Uso**: Interpretación directa de puntuaciones
- **Descripción**: Valores brutos de scoring sin transformación
- **Ventajas**:
  - Interpretación más directa
  - Refleja puntuaciones originales
  - Sin distorsión estadística
- **Cuándo usar**: Para análisis técnico de los scores subyacentes

## Ejemplos de Uso

### Análisis Comparativo de Normalizaciones

Para ver cómo un mismo preset cambia con diferentes normalizaciones:

```javascript
// Base con percentile (distribución uniforme)
fetch('data/variants/base-percentile.json')

// Base con zscore (centrado estadístico)
fetch('data/variants/base-zscore.json')

// Base con minmax (rango completo)
fetch('data/variants/base-minmax.json')

// Base sin normalización (valores brutos)
fetch('data/variants/base-none.json')
```

### Análisis de Perspectivas

Para comparar diferentes énfasis con la misma normalización:

```javascript
// Énfasis en Estado (percentile)
fetch('data/variants/state-emphasis-percentile.json')

// Énfasis en Mercado (percentile)
fetch('data/variants/market-emphasis-percentile.json')

// Énfasis en Equidad (percentile)
fetch('data/variants/equity-emphasis-percentile.json')
```

## Estructura JSON

Cada variante contiene:

```json
{
  "metadata": {
    "version": "3.0",
    "variant_name": "base-percentile",
    "preset_name": "base",
    "normalization_method": "percentile",
    "generated_at": "2025-11-14T...",
    "generator_version": "1.0"
  },
  "nodos": [
    {
      "id": "marxista",
      "nombre": "Marxista",
      "descriptores": { ... },
      "posicion": {
        "x": -0.68,
        "y": 0.83,
        "justificacion": "..."
      }
    }
    // ... 11 nodos más
  ],
  "transiciones": [ ... ],
  "mapeo_visual": { ... }
}
```

## Consideraciones Técnicas

### Tamaño de Archivos
- Cada variante: ~20 KB
- Total (32 variantes): ~640 KB
- Compresión recomendada para producción

### Carga Dinámica
El HTML implementa carga dinámica usando `fetch()`:

```javascript
async function loadVariant(preset, method) {
    const response = await fetch(`data/variants/${preset}-${method}.json`);
    const data = await response.json();
    updatePlotlyChart(data);
}
```

### Validación
Usa el script de validación para verificar integridad:

```bash
python scripts/validate_variants.py
```

## Regeneración

Para regenerar todas las variantes:

```bash
# Regenerar todas (8 presets × 4 métodos = 32 variantes)
python scripts/generate_weight_variants.py --all-normalizations --output-dir docs/data/variants

# Regenerar solo un método específico
python scripts/generate_weight_variants.py --method percentile --output-dir docs/data/variants

# Regenerar solo algunos presets
python scripts/generate_weight_variants.py --presets base equity-emphasis --all-normalizations
```

## Limitaciones Conocidas

1. **Superposiciones Menores**: Algunas variantes (especialmente con zscore) tienen nodos muy cercanos
2. **Interpretación de Z-Score**: Valores extremos pueden quedar fuera del rango visible
3. **Raw Method**: Puede tener distribución desigual sin normalización

## Mejoras Futuras

- [ ] Implementar cálculo cliente-side para reducir archivos
- [ ] Añadir interpolación suave entre variantes
- [ ] Optimizar tamaño de archivos (eliminar datos redundantes)
- [ ] Añadir variantes con diferentes descriptor weights

## Autor

William Camilo Artunduaga Viana
Licencia: Creative Commons BY-SA 4.0
Metodología inspirada en Ha-Joon Chang

## Changelog

- **2025-11-14**: Generación inicial de 32 variantes
- Sistema de doble dropdown (preset + método)
- Validación automática implementada
