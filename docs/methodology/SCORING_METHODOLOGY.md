# ⚙️ Metodología de Scoring, Ponderación y Normalización

> **Versión del Motor:** 8.0 (Cliente-Side Dinámico en JavaScript & Python Pipeline)  
> **Ubicación del Código:** `src/utils/scoring.js`, `src/utils/scales.js`, `scripts/build_tools/config.py`

---

## 1. Fundamento Matemático del Motor

El posicionamiento de cada escuela económica en el mapa bidimensional no es manual ni arbitrario. Responde a un algoritmo determinista ponderado que evalúa las 6 dimensiones cualitativas de cada escuela.

### 1.1 Fórmulas Generales de Posicionamiento

Para cada escuela $i$ y cada eje $E \in \{X, Y\}$:

$$\text{Puntaje Bruto}_E(i) = \sum_{d=1}^{6} S_{d, E}(v_{i, d}) \cdot W_{d, E}$$

$$\text{Posición}_E(i) = \text{clip}\left(\text{Puntaje Bruto}_E(i), \ -1.0, \ +1.0\right)$$

Donde:
* $v_{i, d}$ es el valor cualitativo de la escuela $i$ en la dimensión $d$.
* $S_{d, E}$ es la función de asignación de puntaje para esa dimensión y eje (definida en `SCORE_MAPPINGS`).
* $W_{d, E}$ es el coeficiente de ponderación para la dimensión $d$ en el eje $E$ según el preset activo (`WEIGHT_PRESETS`).
* $\text{clip}(x, a, b) = \max(a, \min(b, x))$ acota estrictamente la posición dentro de los márgenes del canvas.

---

## 2. Los Presets de Ponderación (Lentes de Análisis)

El sistema permite alternar entre distintas visiones analíticas variando los pesos $W$:

| Preset ID | Nombre | Énfasis Principal | Caso de Uso Pedagógico |
| :--- | :--- | :--- | :--- |
| `balanced` | **Equilibrado** (Default) | Pesos uniformes entre descriptores | La visión canónica y académica de referencia |
| `state-emphasis` | **Énfasis Estatal** | Mayor peso a *Políticas Preferidas* y *Concepción de Economía* | Maximiza la separación sobre el Eje X (Mercado vs. Estado) |
| `equity-emphasis` | **Énfasis en Equidad** | Mayor peso al *Ámbito Económico* (Distribución) y *Concepción Humano* | Separa claramente escuelas orientadas a justicia social |
| `market-emphasis` | **Énfasis de Mercado** | Mayor peso al *Mecanismo de Intercambio* y *Acción Individual* | Diferencia matices entre escuelas liberales y pro-mercado |
| `growth-emphasis` | **Énfasis en Crecimiento** | Mayor peso a *Acumulación de Capital* e *Innovación* | Destaca doctrinas orientadas a la expansión de la oferta |
| `historical-emphasis`| **Énfasis Histórico** | Ponderación de trayectoria temporal y cambio estructural | Rastrea transiciones y mutaciones a lo largo del tiempo |
| `pragmatic-emphasis` | **Énfasis Pragmático** | Ponderación orientada a políticas públicas aplicadas | Enfoque en instrumentos de intervención y regulación |

---

## 3. Algoritmos de Normalización Dinámica

El usuario puede aplicar una de cuatro técnicas matemáticas de normalización para evaluar la sensibilidad distributiva:

### 3.1 `none` (Valores Teóricos Puros)
Preserva las sumas ponderadas sin transformación adicional:
$$\text{Pos}_E = \text{clip}(\text{Puntaje Bruto}_E, -1.0, 1.0)$$

### 3.2 `zscore` (Estandarización Estadística)
Centra los datos en la media del conjunto de escuelas y expresa las distancias en desviaciones estándar:
$$z_i = \frac{v_i - \mu}{\sigma}$$
$$\text{Pos}_E = \max(-1.0, \min(1.0, z_i))$$

### 3.3 `percentile` (Distribución Uniforme por Rangos) — *Default del Visor*
Calcula el rango ordinal $r_i \in \{1, \dots, N\}$ y lo escala uniformemente al espacio completo:
$$p_i = \frac{r_i - 1}{N - 1} \in [0.0, 1.0]$$
$$\text{Pos}_E = 2 \cdot p_i - 1 \in [-1.0, +1.0]$$
*Garantiza una distribución visual armónica y homogénea que previene el hacinamiento central de nodos.*

### 3.4 `minmax` (Escalamiento de Rango Extremo)
Estira el subconjunto de escuelas para ocupar la totalidad del ancho y alto disponible:
$$v_{\text{norm}} = \frac{v_i - \min(V)}{\max(V) - \min(V)}$$
$$\text{Pos}_E = 2 \cdot v_{\text{norm}} - 1$$
