# Guía de Contribución

Gracias por tu interés en contribuir al Mapa de Escuelas Económicas! Esta guía te ayudará a colaborar efectivamente.

## Tabla de Contenidos

- [Cómo Contribuir](#cómo-contribuir)
- [Agregar una Nueva Escuela Económica](#agregar-una-nueva-escuela-económica)
- [Modificar Pesos o Descriptores](#modificar-pesos-o-descriptores)
- [Mejorar la Visualización](#mejorar-la-visualización)
- [Reportar Bugs](#reportar-bugs)
- [Pull Requests](#pull-requests)

---

## Cómo Contribuir

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Crea una rama** para tu feature: `git checkout -b feature/nueva-escuela`
4. **Haz commits** con mensajes descriptivos
5. **Push** a tu fork: `git push origin feature/nueva-escuela`
6. **Abre un Pull Request** en GitHub

---

## Agregar una Nueva Escuela Económica

### 1. Editar `data/escuelas.json`

Agrega un nuevo nodo al array `nodos` con la siguiente estructura:

```json
{
  "id": "nombre_escuela",
  "nombre": "Nombre de la Escuela",
  "tipo": "tradicional",
  "ano_fundacion": 1950,
  "autores": "Autor Principal, Otros Autores",
  "descripcion": "Descripción breve de 1-2 líneas",
  "descripcion_corta": "Etiqueta corta para cuadrante",
  "color": "#HEXCOLOR",
  "posicion": {
    "x": 0.0,
    "y": 0.0
  },
  "descriptores": {
    "concepcion_economia": 0.5,
    "concepcion_humano": 0.5,
    "naturaleza_mundo": 0.5,
    "ambito_economico": 0.5,
    "motor_cambio": 0.5,
    "politicas_preferidas": 0.5
  },
  "caracteristicas": {
    "Concepcion Economia": "Individuos / Clases Sociales / Estructuras",
    "Concepcion Humano": "Racional Egoista / Racionalidad Limitada",
    "Naturaleza Mundo": "Cierto Predecible / Complejo Incierto",
    "Ambito Economico": "Produccion / Consumo / Distribucion",
    "Motor Cambio": "Acumulacion Capital / Innovacion / Instituciones",
    "Politicas Preferidas": "Libre Mercado / Intervencion Estatal"
  }
}
```

### 2. Definir Descriptores Cualitativos

Los **6 descriptores** determinan la posición en el mapa. Cada uno tiene escala **0.0 - 1.0**:

#### 1. Concepción de la Economía
- `0.0` = Individuos (metodología individualista)
- `0.5` = Estructuras (instituciones, mercados)
- `1.0` = Clases Sociales (conflicto de clases)

#### 2. Concepción del Ser Humano
- `0.0` = Racional Egoísta (homo economicus)
- `1.0` = Racionalidad Limitada / Condicionado por Clase

#### 3. Naturaleza del Mundo
- `0.0` = Cierto y Predecible (equilibrio, leyes universales)
- `1.0` = Complejo e Incierto (cambio histórico, contingencia)

#### 4. Ámbito Económico Principal
- `0.0` = Producción (oferta, tecnología)
- `0.5` = Comercio (intercambio, mercados)
- `1.0` = Distribución (desigualdad, redistribución)

#### 5. Motor del Cambio
- `0.0` = Acumulación de Capital
- `0.33` = Decisiones Individuales
- `0.67` = Innovación Tecnológica
- `1.0` = Instituciones / Lucha de Clases

#### 6. Políticas Preferidas
- `0.0` = Libre Mercado (laissez-faire)
- `0.5` = Ambiguas / Mixtas
- `1.0` = Intervención Estatal / Redistribución

### 3. Asignar Color

Usa la paleta **Klein Schema** (definida en `scripts/config.py`):

```python
KLEIN_COLORS = [
    "#FF4D6F",  # Rosa fuerte
    "#579EA4",  # Turquesa
    "#DF7713",  # Naranja
    "#F9C000",  # Amarillo
    "#86AD34",  # Verde lima
    "#5D7298",  # Azul grisáceo
    "#81B28D",  # Verde claro
    "#7E1A2F",  # Vino
    "#2D2651",  # Morado oscuro
    "#C8350D",  # Rojo ladrillo
    "#BD777A"   # Rosa pálido
]
```

### 4. Regenerar Variantes

```bash
# Regenerar las 32 variantes de peso
python scripts/generate_weight_variants.py

# Copiar datos a public/ para Vite
cp -r data/* public/data/
```

### 5. Validar Datos

```bash
# Validar integridad de variantes
python scripts/validate_variants.py

# Detectar solapamientos (opcional)
python scripts/detect_overlaps.py
```

### 6. Probar en Desarrollo

```bash
npm run dev
# Visita http://localhost:3000 y prueba todas las variantes
```

---

## Modificar Pesos o Descriptores

### Metodología de Scoring

El sistema de scoring está documentado en `scripts/scoring_methodology.py`.

#### Presets de Pesos Disponibles

| Preset | Enfoque | Pesos Principales |
|--------|---------|-------------------|
| `base` | Original balanceado | Equitativo entre 6 descriptores |
| `balanced` | Equilibrado | Similar a base con ajustes |
| `state-emphasis` | Rol del Estado | ++politicas_preferidas |
| `equity-emphasis` | Equidad | ++ambito_economico (distribución) |
| `market-emphasis` | Mercado Libre | ++politicas_preferidas (mercado) |
| `growth-emphasis` | Crecimiento | ++ambito_economico (producción) |
| `historical-emphasis` | Evolución Histórica | ++naturaleza_mundo |
| `pragmatic-emphasis` | Pragmatismo | ++concepcion_humano |

### Crear un Nuevo Preset

1. Edita `scripts/scoring_methodology.py`
2. Agrega tu preset a `PRESET_CONFIGS`:

```python
'mi_preset': {
    'concepcion_economia': 1.2,
    'concepcion_humano': 0.8,
    'naturaleza_mundo': 1.0,
    'ambito_economico': 1.5,
    'motor_cambio': 1.0,
    'politicas_preferidas': 2.0
}
```

3. Regenera variantes:

```bash
python scripts/generate_weight_variants.py
```

4. Actualiza dropdown en `index.html`:

```html
<select id="preset-dropdown">
    <option value="mi-preset">Mi Preset Custom</option>
</select>
```

---

## Mejorar la Visualización

### Estructura del Código Frontend

```
src/
├── main.js                     # Entry point, inicialización
├── components/
│   ├── D3MapRenderer.js        # Renderer principal D3.js
│   └── TooltipManager.js       # Sistema de tooltips
├── data/
│   └── loader.js               # Carga async de JSON
├── scrollytelling/
│   └── ScrollController.js     # Intersection Observer
└── styles/
    └── main.scss               # Estilos SASS
```

### Agregar una Nueva Feature

1. **Si es un componente visual:**
   - Crea archivo en `src/components/`
   - Importa en `src/main.js`
   - Agrega estilos en `src/styles/`

2. **Si es una animación:**
   - Usa GSAP para transiciones suaves
   - Mantén duración consistente (800ms por defecto)

3. **Si es interacción:**
   - Agrega event listeners en `src/main.js`
   - Usa D3 selections para manipular SVG

### Testing

```bash
# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Reportar Bugs

Usa [GitHub Issues](https://github.com/willkwolf/EcoSchoolMap/issues) con:

- **Título descriptivo**
- **Pasos para reproducir**
- **Comportamiento esperado** vs **actual**
- **Screenshots** (si aplica)
- **Navegador/OS** (para bugs visuales)

---

## Pull Requests

### Checklist antes de PR

- [ ] Código funciona localmente (`npm run dev`)
- [ ] Build sin errores (`npm run build`)
- [ ] Datos válidos (`python scripts/validate_variants.py`)
- [ ] Commits con mensajes descriptivos
- [ ] README actualizado (si cambió funcionalidad)

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add Austrian school to economic map
fix: Correct Keynesian x-axis position
docs: Update CONTRIBUTING with new preset guide
chore: Remove legacy Plotly files
```

Tipos:
- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Formato (no afecta código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

---

## Código de Conducta

- **Respeto:** Discusiones académicas respetuosas
- **Inclusión:** Todas las perspectivas económicas son bienvenidas
- **Rigor:** Cita fuentes para cambios metodológicos
- **Colaboración:** Ayuda a otros contribuidores

---

## Preguntas

Abre un [GitHub Issue](https://github.com/willkwolf/EcoSchoolMap/issues) o discusión para:
- Dudas sobre metodología de scoring
- Sugerencias de nuevas escuelas
- Propuestas de mejoras visuales

---

## Licencia

Al contribuir, aceptas que tu código se licencie bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

**Gracias por contribuir al proyecto!** 🎉
