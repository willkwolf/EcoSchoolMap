# OpenWiki - Repository Overview

**Project Name:** Mapa de Escuelas Políticas y Económicas (`EcoSchoolMap`)  
**Author:** William Camilo Artunduaga Viana (`@willkwolf`)  
**Live Site:** [https://willkwolf.github.io/EcoSchoolMap/](https://willkwolf.github.io/EcoSchoolMap/)  
**License:** CC BY-SA 4.0  

---

## What is EcoSchoolMap?

`EcoSchoolMap` is an interactive data visualization and academic scrollytelling essay mapping **12 economic schools of thought** onto a continuous two-dimensional cartesian plane $[-1.0, 1.0]^2$.

The epistemological framework is drawn from **Ha-Joon Chang** (*Economics: The User's Guide*, 2014), championing pluralist economics against the neoclassical monism dominant in modern academia.

## Placement in the Ecosystem ("La Ruta del Pensamiento Crítico")

This repository represents **Step 1: Understand (Comprender)** of a 5-step critical thinking digital ecosystem authored by `@willkwolf`:

1. **Step 1: EcoSchoolMap** (Understand theoretical paradigms & Weltanschauungen).
2. **Step 2: BAR-Economic** (Mix ideological cocktails).
3. **Step 3: Liberty Infographic - Isaiah Berlin** (Contrast positive vs negative liberty).
4. **Step 4: Global Inequality** (Scale inequality metrics).
5. **Step 5: Colombia Palma Inequality** (Ground in local context).

## Core Structure
* `data/`: Canonical source of truth (`escuelas.json`).
* `src/`: Client-side reactive visualization (D3.js, GSAP, Sass, Vanilla ES Modules).
* `docs/`: Production build output (`index.html`, `assets/`, `data/`) AND academic/governance documentation (`docs/conceptual/`, `docs/contracts/`, `docs/methodology/`).
* `scripts/`: Build tools and automated data validation scripts.
* `openwiki/`: Machine-readable agent knowledge base.
