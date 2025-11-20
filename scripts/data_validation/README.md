# 🔍 Scripts de Validación de Datos

Esta carpeta contiene scripts para validar la integridad y consistencia de los datos del proyecto.

## Scripts Disponibles

### `validate_data_integrity.py`
- **Propósito**: Validar que `data/escuelas.json` tenga estructura correcta
- **Uso**: `python scripts/data_validation/validate_data_integrity.py`
- **Verifica**:
  - Estructura JSON válida
  - Campos requeridos presentes
  - Descriptores completos para cada escuela
  - Formato de posiciones correcto

### `validate_variants.py`
- **Propósito**: Validar archivos de variantes (si existen)
- **Nota**: Obsoleto en nueva arquitectura, pero mantenido por compatibilidad

### `check_variant_overlaps.py`
- **Propósito**: Detectar superposiciones entre escuelas en diferentes variantes
- **Nota**: Útil para debugging de posiciones

### `detect_overlaps.py`
- **Propósito**: Algoritmo general de detección de superposiciones
- **Puede reutilizarse** para otras validaciones

### `compare_weight_results.py`
- **Propósito**: Comparar resultados entre diferentes configuraciones de pesos
- **Útil para**: Análisis de sensibilidad de presets

## 🚀 Uso en Build

```json
{
  "scripts": {
    "validate-data": "python scripts/data_validation/validate_data_integrity.py"
  }
}
```

## ✅ Recomendaciones

- Ejecutar validación antes de cada build importante
- Usar en CI/CD pipeline
- Monitorear cambios en estructura de datos