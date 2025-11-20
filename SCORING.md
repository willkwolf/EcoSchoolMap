# 🧠 Metodología de Scoring Económico

> **Versión del Motor:** 8.0 (Cliente-Side Dinámico)
> **Última Actualización:** Noviembre 2025

Este proyecto utiliza un algoritmo determinista para situar escuelas de pensamiento económico en un plano cartesiano (2D). A diferencia de los mapas políticos tradicionales (izquierda/derecha), este modelo utiliza **criterios técnicos** basados en la filosofía económica y la teoría institucional (inspirado en la taxonomía de Ha-Joon Chang).



## 1. El Plano Cartesiano (Los Ejes)

Para evitar sesgos ideológicos contemporáneos, definimos los ejes de manera funcional:

### ↔️ Eje X: Intensidad de Intervención Estatal
Mide **quién** toma las decisiones económicas principales.
* **-1.0 (Izquierda del gráfico):** **Dominio del Mercado / Individuo.** Decisiones descentralizadas, laissez-faire, propiedad privada absoluta.
* **+1.0 (Derecha del gráfico):** **Dominio del Estado / Colectivo.** Planificación central, propiedad pública, regulación estricta.

### ↕️ Eje Y: Objetivo Socioeconómico (Trade-off de Okun)
Mide **qué** se prioriza en el diseño de políticas.
* **-1.0 (Abajo):** **Eficiencia y Crecimiento.** Acumulación de capital, productividad, expansión de la oferta.
* **+1.0 (Arriba):** **Equidad y Justicia Social.** Redistribución, bienestar, sostenibilidad, derechos laborales.

---

## 2. El Algoritmo de Cálculo

La posición de cada escuela no se "dibuja" a mano. Se **calcula** a partir de 6 dimensiones cualitativas.

Cada escuela se define en el archivo `data/escuelas.json` con los siguientes descriptores. El motor asigna un puntaje numérico a cada descriptor y calcula un promedio ponderado.

| Dimensión | Pregunta Clave | Ejemplo de Valores |
| :--- | :--- | :--- |
| **1. Concepción de la Economía** | ¿Qué es la economía? | `individuos` (Mercado), `clases_sociales` (Marxismo), `sistema_productivo` (Desarrollismo) |
| **2. Concepción del Humano** | ¿Cómo decidimos? | `racional_egoista` (Homo Economicus), `racional_limitada` (Conductual), `condicionado_clase` |
| **3. Naturaleza del Mundo** | ¿Es predecible el futuro? | `equilibrio_cierto` (Neoclásica), `incertidumbre` (Keynesiana), `evolutivo` (Schumpeteriana) |
| **4. Ámbito Relevante** | ¿Dónde ocurre el valor? | `intercambio` (Comercio), `produccion` (Fabrica), `distribucion` (Reparto) |
| **5. Motor del Cambio** | ¿Qué mueve la historia? | `accion_individual`, `innovacion`, `lucha_clases`, `politica_industrial` |
| **6. Política Preferida** | ¿Herramienta principal? | `libre_mercado`, `estado_bienestar`, `planificacion`, `estado_desarrollista` |

### Fórmula Simplificada

Para cada eje ($E \in \{x, y\}$):

$$Posición_E = \sum_{d=1}^{6} (PuntajeDescriptor_{d,E} \times Peso_{d,E})$$

Donde:
* Los **Puntajes** están definidos por expertos (basados en literatura académica).
* Los **Pesos** varían según el "Preset" seleccionado (ver abajo).
* El resultado se recorta (clip) entre $[-1, 1]$.

---

## 3. Presets de Ponderación (Lentes de Análisis)

El usuario puede cambiar "las gafas" con las que ve el mapa. Esto altera ligeramente los pesos ($W$) del algoritmo:

* **⚖️ Balanced (Por defecto):** Distribución equilibrada de pesos entre todas las dimensiones. Es la visión más académica.
* **🏛️ State Emphasis:** Da más peso a la "Política Preferida" y "Concepción de Economía". Separa más claramente a las escuelas según su visión del gobierno.
* **🤝 Equity Emphasis:** Da más peso al "Ámbito Económico" (Distribución vs Producción). Útil para diferenciar escuelas sociales.
* **📈 Growth Emphasis:** Pondera más el "Motor de Cambio". Destaca a las escuelas enfocadas en innovación y capital.

---

## 4. Guía para Contribuidores

Si deseas agregar una nueva escuela o corregir una existente en `escuelas.json`:

1.  **No edites las coordenadas (x, y) manualmente.** Estas son sobrescritas por el motor.
2.  **Edita los `descriptores`.** Asegúrate de usar las claves exactas permitidas (ver `scoring_engine.js` o la tabla de arriba).
3.  **Verifica la coherencia.**
    * *Ejemplo:* Si defines una escuela con `politicas_preferidas: "libre_mercado"`, no debería tener `concepcion_economia: "clases_sociales"`.

### Ejemplo de JSON Válido

```json
{
  "id": "nueva_escuela",
  "nombre": "Nueva Escuela Institucional",
  "descriptores": {
    "concepcion_economia": "instituciones",
    "concepcion_humano": "racional_limitada",
    "naturaleza_mundo": "incertidumbre",
    "ambito_economico": "intercambio_mercado",
    "motor_cambio": "politica_estado",
    "politicas_preferidas": "fallos_mercado"
  }
  // "posicion" se calculará automáticamente
}

```

### 4. Normalización Dinámica

Para mejorar la visualización cuando muchas escuelas se aglomeran en el centro, el motor soporta modos de normalización:

None: Posición teórica pura.

Percentile: Distribuye las escuelas uniformemente por el espacio (útil para evitar superposiciones).

Z-Score: Centra el mapa en el promedio de las escuelas actuales.