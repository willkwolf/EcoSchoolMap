# 🎨 Contrato de Visualización y Experiencia de Usuario (Visual & UI Governance Contract)

> **Versión del Contrato:** 2.0.0  
> **Motor de Renderizado:** D3.js (v7.9.0)  
> **Motor de Animaciones:** GSAP (v3.13.0)  
> **Componente Principal:** `src/components/D3MapRenderer.js`

---

## 1. Mapeo Matemático de Coordenadas

El plano cartesiano bidimensional proyecta un espacio continuo acotado en $[-1.0, +1.0] \times [-1.0, +1.0]$.

### 1.1 Función de Posicionamiento Ponderado
La posición teórica de cada escuela $i$ para un preset de pesos $W = (W_x, W_y)$ se define mediante:

$$\text{Posición}_X(i) = \text{clip}\left( \sum_{d=1}^{6} S_{d, X}(i) \cdot W_{d, X}, \ -1.0, \ +1.0 \right)$$

$$\text{Posición}_Y(i) = \text{clip}\left( \sum_{d=1}^{6} S_{d, Y}(i) \cdot W_{d, Y}, \ -1.0, \ +1.0 \right)$$

Donde:
* $S_{d, \text{eje}}(i)$ es el puntaje de la dimensión $d$ en el eje correspondiente según la tabla de mapeo canónica (`SCORE_MAPPINGS` en `src/utils/scoring.js`).
* $W_{d, \text{eje}}$ es el peso asignado a la dimensión $d$ para el preset seleccionado (`WEIGHT_PRESETS`).

---

## 2. Métodos de Normalización y sus Invariantes

Para mitigar aglomeraciones en el centro del espacio o evaluar hipótesis metodológicas, el motor soporta 4 transformaciones:

### 2.1 Sin Normalización (`none`)
* **Propósito:** Muestra las sumas ponderadas puras derivadas de la teoría.
* **Invariante:** Preserva magnitudes absolutas; acotado entre $[-1.0, 1.0]$.

### 2.2 Normalización Z-Score (`zscore`)
* **Fórmula:** $z_i = \frac{v_i - \mu}{\sigma}$
* **Propósito:** Centra la distribución en la media empírica ($\mu = 0$) y expresa distancias en múltiplos de desviación estándar ($\sigma$).
* **Invariante:** Se aplica recorte estricto $\max(-1.0, \min(1.0, z_i))$ para no desbordar los márgenes del canvas SVG.

### 2.3 Normalización Percentil (`percentile`) — *Preset Predeterminado*
* **Fórmula:** Dado el rango ordinal $r_i \in \{1, \dots, N\}$, el percentil base es $p_i = \frac{r_i - 1}{N - 1} \in [0, 1]$.
* **Escalado al Plano Cartesiano:** $v_{\text{final}} = 2 \cdot p_i - 1 \in [-1.0, +1.0]$.
* **Propósito:** Distribución espacial uniforme que optimiza la legibilidad visual y minimiza aglomeraciones centrales.
* **Invariante:** Todo el rango visual $[-1, 1]$ es aprovechado simétricamente; nunca debe generarse en $[0, 1]$.

### 2.4 Normalización Min-Max (`minmax`)
* **Fórmula:** $v_{\text{final}} = 2 \cdot \left(\frac{v_i - \min(V)}{\max(V) - \min(V)}\right) - 1$.
* **Propósito:** Expande el subconjunto de escuelas al ancho y alto completo del viewport manteniendo distancias proporcionales.

---

## 3. Simulación de Fuerzas y Detección de Colisiones

Para garantizar legibilidad pedagógica sin alterar la posición teórica subyacente, la simulación física de D3 (`d3.forceSimulation`) opera bajo parámetros calibrados de alta prioridad:

### 3.1 Parámetros de Simulación Invariantes
```javascript
// Constantes obligatorias en D3MapRenderer.js
this.forceStrength = 0.12;   // Fuerza de repulsión base
this.collisionRadius = 45;   // Radio mínimo de exclusión entre etiquetas/nodos
```

### 3.2 Prioridad de Colisión y Fuerzas de Centrado
* **Fuerza de Colisión:**
  ```javascript
  .force('collision', d3.forceCollide()
      .radius(d => this.collisionRadius + getNodeSize(d.tipo) / 2)
      .strength(1.0)        // Máxima rigidez de colisión
      .iterations(8)        // Convergencia rápida en 8 iteraciones
  )
  ```
* **Fuerzas de Posicionamiento:**
  - Amortiguadas a `strength = 0.05` en los ejes X e Y para evitar que el anclaje al objetivo aplaste nodos superpuestos.
* **Micro-desplazamiento de Seguridad (Guardrail):**
  - Se inyecta un micro-offset aleatorio estocástico $\delta \in [-0.0005, +0.0005]$ sobre las coordenadas base para que pares de nodos matemáticamente idénticos (ej. Marxismo y Feminismo bajo ciertas proyecciones de z-score) no compartan un vector de repulsión cero.
* **Tiempos de Convergencia:**
  - Renderizado inicial: ventana de estabilización de 4.000 ms.
  - Transición interactiva de variantes: ventana de 3.500 ms con $\alpha = 1.0$ y $\alpha_{\text{decay}} = 0.01$.

---

## 4. Paleta Cromática y Accesibilidad (Klein Palette)

Para evitar la confusión visual generada por colores repetidos en un plano con 12 nodos, el proyecto implementa la **Paleta Klein** de 11 tonos categóricos de alto contraste:

| ID de Escuela | Color HEX | Familia Cromática | Ratio de Contraste sRGB |
| :--- | :--- | :--- | :--- |
| `clasica` | `#E69F00` | Ocre dorado | Accesible sobre fondos oscuros/claros |
| `neoclasica` | `#56B4E9` | Azul cielo | Alto contraste |
| `austriaca` | `#009E73` | Verde azulado | Diferenciable de Neoclásica |
| `keynesiana` | `#F0E442` | Amarillo brillante | Contraste con Institucionalista |
| `marxista` | `#D55E00` | Bermellón / Rojo tierra | Clásico para conflicto estructural |
| `desarrollista`| `#CC79A7` | Magenta apagado | Diferenciable de Marxista |
| `institucionalista`| `#0072B2`| Azul marino profundo | Contraste con Keynesiana |
| `schumpeteriana`| `#882255` | Vino / Burdeos | Innovación y dinámica |
| `conductual` | `#44AA99` | Turquesa mate | Contemporánea |
| `feminista` | `#AA4499` | Violeta rojizo | Crítica epistemológica |
| `ecologica` | `#117733` | Verde bosque profundo | Sostenibilidad y biofísica |
| `socialdemocrata`| `#DDCC77` | Mostaza suave | Síntesis institucional |

---

## 5. Contrato de UI y Scrollytelling

1. **Mobile-First Responsiveness:**
   - En viewports $< 768\text{px}$, el contenedor SVG se ajusta proporcionalmente manteniendo el viewBox $1:1$ ($1000 \times 1000$ unidades lógicas).
   - Los controles flotantes colapsan en menús de ancho completo.
2. **Tooltips Enriquecidos:**
   - La caja flotante HTML sigue el cursor con transición atenuada (fade $200\text{ms}$).
   - Incluye fijación de límites de viewport (*viewport boundary clamping*) para que el tooltip nunca sea truncado fuera de la pantalla.
3. **Exportación de Alta Resolución:**
   - La funcionalidad de descarga PNG (`saveSvgAsPng`) debe exportar a escala $2\times$ nativa con fondo blanco explícito (`#FFFFFF`) para papers y presentaciones académicas.
