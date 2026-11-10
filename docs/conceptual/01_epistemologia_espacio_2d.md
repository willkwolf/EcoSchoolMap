# 📐 Epistemología del Espacio Bidimensional y Reducción Dimensional

> **Autor:** William Camilo Artunduaga Viana  
> **Referencia Central:** Ha-Joon Chang, *Economics: The User's Guide* (Pelican Books, 2014)

---

## 1. El Fracaso del Espectro Político Unidimensional (1D)

La discusión pública contemporánea suele reducir la economía a una línea recta simplista: "Izquierda vs. Derecha". Este reduccionismo genera profundas contradicciones analíticas:
* ¿Dónde se sitúa la **Escuela Austríaca** (antiestatal radical pero centrada en la acción subjetiva y el tiempo) frente a la **Escuela Neoclásica** (centrada en equilibrios estáticos de oferta/demanda y permeable a corregir "fallos de mercado")?
* ¿Por qué el **Desarrollismo** de Asia Oriental combinó intervención estatal masiva y proteccionismo industrial con una estricta subordinación a la acumulación de capital privado, desafiando las etiquetas socialistas?
* ¿Cómo distinguir la **Escuela Institucionalista** clásica (Veblen, Commons), que cuestiona el poder corporativo mediante regulaciones jurídicas, de la tradición **Keynesiana** orientada a la gestión macroeconómica de la demanda agregada?

Para superar esta limitación, este artefacto adopta un **espacio continuo bidimensional** $[-1.0, +1.0]^2$ que desacopla el *mecanismo institucional de asignación* del *objetivo normativo fundamental*.

---

## 2. Definición Funcional de los Ejes

```
                    +1.0 (Y: Equidad y Justicia Social)
                               ▲
                               │
               Cuadrante II    │    Cuadrante I
            (Socialdemócrata / │  (Marxista /
               Keynesiano)     │   Feminista /
                               │   Desarrollista Social)
                               │
-1.0 ──────────────────────────┼──────────────────────────► +1.0 (X: Estado y Planificación)
(Mercado / Individuo)          │
               Cuadrante III   │    Cuadrante IV
             (Austríaca /      │  (Desarrollismo Puro /
              Neoclásica pura) │   Capitalismo de Estado)
                               │
                               ▼
                    -1.0 (Y: Crecimiento y Acumulación)
```

### 2.1 Eje X: Intensidad de Intervención y Coordinación Institucional
* **Dominio:** $x \in [-1.0, +1.0]$.
* **Pregunta Operativa:** *¿Quién y mediante qué arquitectura se toman las decisiones de producción, inversión y distribución en la sociedad?*
* **Extremo Negativo ($-1.0$):** **Mercado Auto-regulado y Decisiones Descentralizadas.** Primacía de los precios de mercado como procesadores de información dispersa (Hayek), propiedad privada irrestricta y ausencia de coerción gubernamental.
* **Extremo Positivo ($+1.0$):** **Coordinación Colectiva, Planificación Pública y Estado.** Control democrático o estatal sobre los medios estratégicos, política industrial activa, propiedad pública y dirección deliberada de la inversión.

### 2.2 Eje Y: Objetivo Socioeconómico Fundamental (El Dilema de Okun)
* **Dominio:** $y \in [-1.0, +1.0]$.
* **Pregunta Operativa:** *¿Qué prioridad ética y material subyace al diseño del sistema económico?*
* **Extremo Negativo ($-1.0$):** **Eficiencia Productiva, Crecimiento y Acumulación de Capital.** Prioridad a la expansión del excedente, la productividad marginal, el retorno a la inversión y la maximización de la tasa de crecimiento del PIB.
* **Extremo Positivo ($+1.0$):** **Equidad Distributiva, Bienestar Colectivo y Justicia Social.** Prioridad a la erradicación de la desigualdad, protección del trabajo frente al capital, sostenibilidad distributiva y garantía de pisos sociales universales.

---

## 3. La Cartografía como Reducción Dimensional (*Embedding*)

Cada escuela de pensamiento económico es, en rigor, un constructo de alta dimensionalidad $\mathbb{R}^k$ que abarca epistemología, teoría del valor, psicología humana, sociología política y filosofía moral.

Al proyectar estas visiones en $\mathbb{R}^2$, el mapa opera como un **algoritmo de reducción de dimensionalidad** guiado por conocimiento experto:

$$\Phi: \mathcal{D}^6 \longrightarrow [-1.0, +1.0]^2$$

Donde $\mathcal{D}^6$ representa el espacio de los 6 descriptores cualitativos fundamentales:
1. Concepción de la Economía ($\text{Individuo} \to \text{Estructura} \to \text{Clases}$).
2. Concepción del Ser Humano ($\text{Racional Maximadador} \to \text{Racionalidad Limitada / Social}$).
3. Naturaleza del Mundo ($\text{Equilibrio Predecible} \to \text{Incertidumbre Radical / Dinámico}$).
4. Ámbito Económico Principal ($\text{Producción} \to \text{Consumo} \to \text{Mercado} \to \text{Distribución}$).
5. Motor del Cambio Histórico ($\text{Acumulación} \to \text{Innovación} \to \text{Instituciones} \to \text{Conflicto}$).
6. Políticas Preferidas ($\text{Laissez-faire} \to \text{Economía Mixta} \to \text{Planificación}$).

Esta reducción matemática preserva las distancias relativas esenciales entre escuelas, permitiendo al usuario navegar visualmente las diferencias estructurales sin perder de vista los matices particulares que se expanden a través de las interacciones y tooltips.
