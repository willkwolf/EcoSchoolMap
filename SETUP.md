# Configuración del entorno con UV

Este proyecto ahora usa UV como gestor de paquetes Python para una instalación más rápida y segura.

## Requisitos previos

1. **Python**: Versión 3.10 o superior
2. **UV**: Instalar UV globalmente:
   ```bash
   pip install uv
   ```

## Configuración del entorno

1. **Crear entorno virtual**:
   ```bash
   uv venv
   ```

2. **Activar el entorno virtual**:
   - Windows PowerShell:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - Windows CMD:
     ```cmd
     .\.venv\Scripts\activate.bat
     ```
   - Linux/macOS:
     ```bash
     source .venv/bin/activate
     ```

3. **Instalar dependencias**:
   ```bash
   uv sync
   ```

## Uso del proyecto

1. **Generar visualizaciones**:
   ```bash
   python scripts/generate_plot.py
   ```
   Esto generará:
   - `output/mapa_escuelas.png`: Imagen estática del mapa
   - `docs/mapa_escuelas.html`: Versión interactiva con Vega-Lite
   - `docs/data/escuelas.json`: Copia de los datos para la web

2. **Ver resultado**:
   - Abre `docs/mapa_escuelas.html` en tu navegador
   - O despliega la carpeta `docs/` en GitHub Pages

## Estructura de datos

El archivo `data/escuelas.json` debe contener:
- `nodos`: Array de escuelas con `id`, `nombre`, `categoria` y `posicion:{x,y}`
- `cuadrantes`: (opcional) Mapeo de escuelas a cuadrantes, ejemplo:
  ```json
  {
    "q1": {
      "nombre": "Primer cuadrante",
      "color": "#ff0000",
      "escuelas": ["id1", "id2"]
    }
  }
  ```

## Desarrollo

1. **Instalar dependencias de desarrollo**:
   ```bash
   uv pip install -e ".[dev]"
   ```

2. **Actualizar dependencias**:
   Si necesitas actualizar versiones:
   ```bash
   uv pip freeze > requirements.txt
   ```

## Notas

- UV es significativamente más rápido que pip y ofrece mejor resolución de dependencias
- El archivo `pyproject.toml` define todas las dependencias y configuración
- Los entornos virtuales creados con UV son compatibles con pip/venv estándar