# 🛠️ Build Tools

Esta carpeta contiene scripts utilizados durante el proceso de construcción y generación de contenido estático.

## Scripts Disponibles

### `config.py`
- **Propósito**: Configuración central del proyecto
- **Contiene**:
  - Rutas de archivos
  - Constantes de normalización
  - Configuración de presets
- **Importante**: Usado por otros scripts Python

### `generate_static_plot.py`
- **Propósito**: Generar imágenes estáticas del mapa
- **Uso**: Para documentación o previews
- **Salida**: Archivos PNG/SVG

### `generate_interactive_plot.py`
- **Propósito**: Generar versiones interactivas embebidas
- **Uso**: Para integración en otros sitios
- **Salida**: HTML con D3.js embebido

### `legends.py`
- **Propósito**: Generar leyendas y metadatos para el mapa
- **Uso**: Crear contenido para la interfaz
- **Salida**: Datos JSON para leyendas

## 🔄 Integración con Build

Estos scripts pueden integrarse en el proceso de build de Vite:

```json
{
  "scripts": {
    "prebuild": "python scripts/build_tools/generate_static_plot.py",
    "build": "vite build",
    "postbuild": "python scripts/build_tools/generate_interactive_plot.py"
  }
}
```

## 📊 Uso Típico

1. **Desarrollo**: Scripts ejecutados manualmente según necesidad
2. **Build**: Algunos scripts pueden automatizarse
3. **Deploy**: Generar assets estáticos adicionales

## ⚠️ Consideraciones

- Scripts requieren dependencias Python específicas
- Algunos generan archivos que deben incluirse en build
- Verificar compatibilidad con nueva arquitectura client-side