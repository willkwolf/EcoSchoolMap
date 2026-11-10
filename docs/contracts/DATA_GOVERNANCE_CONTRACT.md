# 📄 Contrato de Gobierno de Datos (Data Governance Contract)

> **Versión del Contrato:** 2.0.0  
> **Estado:** Vigente y Vinculante  
> **Fuente de Verdad:** `data/escuelas.json`  
> **Esquema Formal:** `docs/schemas/escuelas.schema.json`

---

## 1. Principios Fundamentales de Datos

1. **Fuente Única de Verdad (`Single Source of Truth`)**: El archivo `data/escuelas.json` en la raíz es el único repositorio canónico de información cualitativa y cuantitativa. Los archivos bajo `docs/data/escuelas.json` o `public/data/escuelas.json` son artefactos de distribución copiados durante el ciclo de compilación.
2. **Separación Estricta entre Entrada Cualitativa y Coordenadas Calculadas**:
   - Los **descriptores cualitativos** son inmutables por la visualización y provienen del consenso académico basado en Ha-Joon Chang.
   - Las **posiciones $(x, y)$** reflejan la proyección base canónica en el espacio $[-1.0, 1.0]^2$. El cliente web recalcula dinámicamente las posiciones en memoria (`client-side scoring`) según los presets y normalizaciones seleccionados por el usuario, sin sobreescribir el archivo de datos base.
3. **Determinismo y Trazabilidad**: Todo cambio en la posición de una escuela debe ser reproducible a través de las fórmulas del motor de scoring en función de los descriptores y la matriz de pesos.

---

## 2. Definición de Entidades y Esquema

El dataset debe validar contra el esquema JSON Schema Draft-07 ubicado en [`escuelas.schema.json`](../schemas/escuelas.schema.json).

### 2.1 Metadatos (`metadata`)
```json
{
  "version": "3.1.0",
  "titulo": "Mapa de Escuelas Políticas y Económicas",
  "autor": "William Camilo Artunduaga Viana",
  "licencia": "CC BY-SA 4.0",
  "referencia_principal": "Ha-Joon Chang (2014), Economics: The User's Guide"
}
```

### 2.2 Ejes del Espacio Cartesiano (`ejes`)
Ambos ejes están acotados estrictamente en el dominio continuo $[-1.0, +1.0]$:
* **Eje X (Mecanismo de Coordinación Institucional):**
  - `-1.0`: Dominio de Mercado / Decisiones Individuales Descentralizadas (*Laissez-faire*).
  - `+1.0`: Dominio del Estado / Coordinación Colectiva y Planificación Pública.
* **Eje Y (Objetivo Socioeconómico - Trade-off de Okun):**
  - `-1.0`: Eficiencia Productiva, Crecimiento y Acumulación de Capital.
  - `+1.0`: Equidad Distributiva, Bienestar Social y Derechos Colectivos.

### 2.3 Nodos de Escuelas Económicas (`nodos`)
Cada objeto dentro del array `nodos` debe contener:
* `id` (`string`, slug único, ej. `"marxista"`, `"neoclasica"`).
* `nombre` (`string`, título formal para visualización).
* `tipo` (`string`, enumeración: `"tradicional"`, `"heterodoxa"`, `"contemporanea"`, `"emergente"`).
* `ano_fundacion` (`integer`, año aproximado de consolidación histórica).
* `autores` (`string`, principales exponentes separados por comas).
* `descripcion` (`string`, síntesis conceptual de 2-4 líneas).
* `descripcion_corta` (`string`, descriptor para cuadrante y tooltips).
* `color` (`string`, código HEX asignado según la paleta Klein reglamentaria).
* `posicion` (`object`: `{ "x": float [-1, 1], "y": float [-1, 1] }`).
* `descriptores` (`object`: diccionario de 6 dimensiones normalizadas en $[0.0, 1.0]$).
* `caracteristicas` (`object`: etiquetas pedagógicas textuales para la UI).

---

## 3. El Diccionario de Descriptores Cualitativos

El motor matemático evalúa cada escuela a partir de exactamente 6 dimensiones cualitativas. Los valores numéricos permitidos y su correspondencia semántica son:

| Dimensión (`key`) | Dominio $[0.0, 1.0]$ | Semántica y Puntos de Referencia |
| :--- | :--- | :--- |
| `concepcion_economia` | `0.0` → `1.0` | `0.0` = **Individuos** (individualismo metodológico)<br>`0.5` = **Estructuras / Instituciones** (reglas de juego)<br>`1.0` = **Clases Sociales** (conflicto estructural) |
| `concepcion_humano` | `0.0` → `1.0` | `0.0` = **Racional Egoísta** (*Homo economicus* maximizador)<br>`1.0` = **Racionalidad Limitada** / Condicionado socialmente |
| `naturaleza_mundo` | `0.0` → `1.0` | `0.0` = **Cierto y Predecible** (tendencia al equilibrio estático)<br>`1.0` = **Complejo e Incierto** (incertidumbre radical, dinamismo) |
| `ambito_economico` | `0.0` → `1.0` | `0.0` = **Producción** (oferta, tecnología)<br>`0.33` = **Consumo** (demanda)<br>`0.67` = **Intercambio / Mercado** (precios)<br>`1.0` = **Distribución** (reparto del excedente) |
| `motor_cambio` | `0.0` → `1.0` | `0.0` = **Acumulación de Capital**<br>`0.25` = **Acción Individual**<br>`0.50` = **Innovación / Destrucción Creativa**<br>`0.75` = **Instituciones y Políticas de Estado**<br>`1.0` = **Lucha de Clases / Contradicciones** |
| `politicas_preferidas` | `0.0` → `1.0` | `0.0` = **Libre Mercado** (*Laissez-faire*, desregulación)<br>`0.50` = **Economía Mixta** (regulación de fallos de mercado)<br>`1.0` = **Intervención Estatal / Planificación** |

---

## 4. Transiciones Históricas y Teóricas (`transiciones`)

Las conexiones dirigidas representan filiaciones, rupturas o divergencias conceptuales entre escuelas:
* `origen`: `id` de la escuela origen.
* `destino`: `id` de la escuela receptora o heredera.
* `tipo`: `"influencia"`, `"ruptura"`, `"sintesis"`, `"bifurcacion"`.
* `confianza`: Grado de consenso en la historiografía del pensamiento económico (`"alta"`, `"media-alta"`, `"media"`).
* `label`: Explicación sintética de la relación teórica.
* `bibliografia`: Referencia académica de soporte (cita o texto clave).

---

## 5. Protocolo de Validación y Ciclo de Vida

1. **Prohibición de Edición Manual de Coordenadas**: Bajo ninguna circunstancia se deben alterar manualmente los campos `x` e `y` sin actualizar previamente los `descriptores` correspondientes.
2. **Pipeline de Integridad Obligatorio**:
   ```bash
   # Valida coherencia y no-degeneración entre data/, docs/ y public/
   npm run validate-data
   ```
3. **Copia de Distribución Automatizada**: El script `scripts/build_tools/copy_data.js` copia `data/escuelas.json` a `docs/data/escuelas.json` durante el `prebuild`. Queda prohibido modificar manualmente la copia en `docs/data/`.
