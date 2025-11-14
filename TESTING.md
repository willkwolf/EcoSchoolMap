# Instrucciones de Prueba - Variantes Interactivas

## Problema CORS
Los navegadores modernos bloquean las solicitudes `fetch()` cuando abres archivos HTML directamente (`file://`). Por eso **debes usar un servidor HTTP local**.

## Cómo Probar

### Opción 1: Usar el script batch (Recomendado)
1. Haz doble clic en `start_server.bat`
2. Abre tu navegador en: http://localhost:8000/mapa_escuelas.html
3. Haz clic en los botones de variantes para probar

### Opción 2: Línea de comandos
```bash
cd docs
..\venv\Scripts\python.exe -m http.server 8000
```
Luego abre: http://localhost:8000/mapa_escuelas.html

### Opción 3: VS Code Live Server
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `docs/mapa_escuelas.html`
3. Selecciona "Open with Live Server"

## Qué Probar

1. **Botones de Variantes**: Haz clic en cada uno de los 8 botones:
   - Base (Balanceada)
   - Balanced
   - State Emphasis
   - Equity Emphasis
   - Market Emphasis
   - Growth Emphasis
   - Historical Emphasis
   - Pragmatic Emphasis

2. **Consola del Navegador** (F12):
   - Deberías ver logs como:
     ```
     Fetching: data/variants/balanced.json
     Current location: http://localhost:8000/mapa_escuelas.html
     Response status: 200
     Data loaded: {metadata: {...}, nodos: [...], transiciones: [...]}
     Updating plot with 12 nodes
     ```

3. **Verificar el Gráfico**:
   - El mapa debería actualizarse instantáneamente
   - Los nodos deberían cambiar de posición
   - Las transiciones deberían actualizar
   - Los colores se mantienen consistentes (Klein schema)

## Correcciones Implementadas

### 1. Selector de Div Correcto
**Problema**: El div de Plotly tiene un ID aleatorio único
**Solución**:
```javascript
const plotDiv = document.querySelector('.plotly-graph-div') || document.querySelector('[id*="plotly"]');
```

### 2. Logs de Debug
Agregados para diagnosticar problemas:
- URL que se está cargando
- Status de la respuesta HTTP
- Datos cargados
- Número de nodos

### 3. Manejo de Errores CORS
Detecta automáticamente si estás usando `file://` y muestra mensaje claro:
```
❌ CORS Error: Debes abrir este archivo desde un servidor HTTP.
Usa: python -m http.server 8000
```

## Estructura de Archivos

```
docs/
├── mapa_escuelas.html          # Archivo principal
└── data/
    └── variants/               # Variantes de peso
        ├── base.json
        ├── balanced.json
        ├── state-emphasis.json
        ├── equity-emphasis.json
        ├── market-emphasis.json
        ├── growth-emphasis.json
        ├── historical-emphasis.json
        └── pragmatic-emphasis.json
```

## Troubleshooting

### Error: "Failed to fetch"
- **Causa**: CORS bloqueado (estás usando file://)
- **Solución**: Usa un servidor HTTP local

### Error: "Plotly graph div not found"
- **Causa**: El selector no encuentra el div de Plotly
- **Solución**: Ya corregido con selector dual
- **Verifica**: Abre consola y busca el log "Available divs:"

### El gráfico no cambia
- **Verifica consola**: Debería mostrar "Updating plot with N nodes"
- **Verifica datos**: El JSON debería cargarse (ver "Data loaded:")
- **Verifica Plotly**: `Plotly.react()` debería ejecutarse sin errores

## Logs Esperados (Éxito)

```
Fetching: data/variants/state-emphasis.json
Current location: http://localhost:8000/mapa_escuelas.html
Response status: 200
Data loaded: {metadata: {variant_name: "state-emphasis", ...}, nodos: Array(12), transiciones: Array(6)}
Updating plot with 12 nodes
```

## Próximos Pasos

Si todo funciona correctamente:
1. ✅ Los botones cambian el estado visual (active)
2. ✅ Las notificaciones se muestran (cargando, éxito)
3. ✅ El gráfico se actualiza con nuevas posiciones
4. ✅ Los logs de consola son claros
5. ✅ No hay errores CORS

Ahora puedes compartir el archivo con confianza! 🎉
