"""
scoring_methodology_v6.py - Motor de Inferencia para Escuelas Económicas

Rigor Académico: Basado en la taxonomía institucional de Ha-Joon Chang.
Rigor Metodológico: Implementación con tipado estático, Enums y validación de integridad.

Ejes del Plano Cartesiano:
--------------------------
EJE X: PODER DEL ESTADO (Intervencionismo)
    Range: [-1.0, 1.0]
    -1.0: Máximo control estatal (Planificación central).
     0.0: Economía mixta / Rol regulador.
    +1.0: Mínimo estado (Laissez-faire / Estado vigilante).

EJE Y: OBJETIVO SOCIOECONÓMICO (Trade-off de Okun)
    Range: [-1.0, 1.0]
    -1.0: Prioridad Eficiencia/Crecimiento (Acumulación).
     0.0: Balance / Sostenibilidad.
    +1.0: Prioridad Equidad/Redistribución (Bienestar).
"""

import numpy as np
from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

# ============================================================
# 1. DOMAIN DEFINITIONS (ENUMS)
# ============================================================

class ConceptoEconomia(Enum):
    CLASES = "clases_sociales"       # Marxismo, Clásica (Ricardo)
    INDIVIDUOS = "individuos"        # Neoclásica, Austriaca
    INSTITUCIONES = "instituciones"  # Institucionalismo
    SISTEMA = "sistema_complejo"     # Keynesianismo, Estructuralismo

class ConceptoHumano(Enum):
    RACIONAL_EGOISTA = "racional_egoista"      # Homo Economicus
    RACIONALIDAD_LIMITADA = "racional_limitada" # Conductual/Keynesiana
    CONDICIONADO_CLASE = "condicionado_clase"   # Marxista
    ADAPTABLE = "adaptable_cultural"            # Institucionalista/Histórica

class NaturalezaMundo(Enum):
    EQUILIBRIO_ESTATICO = "equilibrio_cierto"   # Neoclásica (Ceteris Paribus)
    INCERTIDUMBRE_RADICAL = "incertidumbre"     # Keynesiana/Austriaca
    EVOLUTIVO = "evolutivo_dinamico"            # Schumpeteriana
    DETERMINISTA = "determinista_historico"