# 📁 Scripts Deprecated

Esta carpeta contiene scripts que ya no se utilizan en la arquitectura actual del proyecto.

## Scripts Obsoletos

### `generate_weight_variants.py`
- **Estado**: Obsoleto
- **Motivo**: Las variantes de peso ahora se calculan dinámicamente en el cliente (client-side)
- **Reemplazo**: `src/utils/scoring.js` con función `calculatePositions()`

### `sync_data.py`
- **Estado**: Obsoleto
- **Motivo**: Ya no se necesitan sincronizar variantes pre-generadas
- **Reemplazo**: Datos se cargan directamente desde `data/escuelas.json`

### `recalculate_positions.py`
- **Estado**: Obsoleto
- **Motivo**: Script de migración para actualizar posiciones en archivos JSON
- **Reemplazo**: Cálculo dinámico en tiempo real

### `scoring_methodology.py`
- **Estado**: Obsoleto
- **Motivo**: Lógica de scoring migrada a JavaScript client-side
- **Reemplazo**: `src/utils/scoring.js`

### `update_positions.py`
- **Estado**: Obsoleto
- **Motivo**: Actualización manual de posiciones ya no necesaria
- **Reemplazo**: Cálculo automático

## ⚠️ Importante

Estos scripts se mantienen por referencia histórica pero **NO deben ejecutarse** en producción, ya que pueden:
- Sobreescribir datos importantes
- Generar archivos innecesarios
- Causar conflictos con la nueva arquitectura

## 🏗️ Nueva Arquitectura

La nueva arquitectura calcula posiciones dinámicamente:
1. **Cliente** solicita datos con preset específico
2. **JavaScript** calcula posiciones usando descriptores
3. **D3.js** renderiza nodos en posiciones calculadas
4. **Sin archivos intermedios** ni pre-cálculos

Esto elimina la necesidad de mantener 32+ archivos JSON de variantes.