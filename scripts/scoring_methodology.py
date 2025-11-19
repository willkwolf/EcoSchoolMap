"""
scoring_methodology_v7.py - Motor de Inferencia para Escuelas Económicas (Eje X Invertido)

CAMBIO IMPORTANTE V7:
---------------------
Se ha invertido el Eje X para eliminar coincidencias con el espectro político tradicional "Derecha/Izquierda".
Ahora el eje representa puramente la MAGNITUD DE LA INTERVENCIÓN ESTATAL.

Nuevos Ejes:
------------
EJE X: INTENSIDAD DE INTERVENCIÓN ESTATAL
    Range: [-1.0, 1.0]
    -1.0: Estado Mínimo / Ausente (Laissez-faire).
     0.0: Estado Regulador / Mixto.
    +1.0: Estado Máximo / Omnipresente (Planificación Central).

EJE Y: OBJETIVO SOCIOECONÓMICO (Trade-off de Okun)
    Range: [-1.0, 1.0]
    -1.0: Prioridad Eficiencia / Crecimiento (Acumulación).
     0.0: Balance.
    +1.0: Prioridad Equidad / Justicia Social (Redistribución).
"""

import numpy as np
from enum import Enum
from dataclasses import dataclass
from typing import Dict, List

# ============================================================
# 1. DOMAIN DEFINITIONS (ENUMS - Sin Cambios)
# ============================================================

class ConceptoEconomia(Enum):
    CLASES = "clases_sociales"
    INDIVIDUOS = "individuos"
    INSTITUCIONES = "instituciones"
    SISTEMA = "sistema_complejo"

class ConceptoHumano(Enum):
    RACIONAL_EGOISTA = "racional_egoista"
    RACIONALIDAD_LIMITADA = "racional_limitada"
    CONDICIONADO_CLASE = "condicionado_clase"
    ADAPTABLE = "adaptable_cultural"

class NaturalezaMundo(Enum):
    EQUILIBRIO_ESTATICO = "equilibrio_cierto"
    INCERTIDUMBRE_RADICAL = "incertidumbre"
    EVOLUTIVO = "evolutivo_dinamico"
    DETERMINISTA = "determinista_historico"

class AmbitoRelevante(Enum):
    INTERCAMBIO = "intercambio_mercado"
    PRODUCCION = "produccion"
    DISTRIBUCION = "distribucion"
    DEMANDA = "consumo_demanda"

class MotorCambio(Enum):
    INDIVIDUO = "accion_individual"
    CAPITAL = "acumulacion_capital"
    TECNOLOGIA = "innovacion"
    LUCHA_CLASES = "conflicto_social"
    POLITICA_INDUSTRIAL = "politica_estado"

class PoliticaPreferida(Enum):
    LIBRE_MERCADO = "laissez_faire"
    REGULACION_FALLOS = "fallos_mercado"
    ESTADO_BIENESTAR = "welfare_state"
    ESTADO_DESARROLLISTA = "developmental_state"
    PLANIFICACION = "planificacion_central"

# ============================================================
# 2. DATA STRUCTURES
# ============================================================

@dataclass(frozen=True)
class SchoolDescriptors:
    nombre: str
    economia: ConceptoEconomia
    humano: ConceptoHumano
    mundo: NaturalezaMundo
    ambito: AmbitoRelevante
    motor: MotorCambio
    politica: PoliticaPreferida

@dataclass
class ScoringResult:
    x_final: float
    y_final: float
    quadrant_label: str
    
    def __repr__(self):
        return f"Pos(Estado={self.x_final:.2f}, Objetivo={self.y_final:.2f})"

# ============================================================
# 3. SCORING ENGINE (SIGNOS INVERTIDOS EN X)
# ============================================================

class EconomicSchoolScorer:
    
    # ---------------------------------------------------------
    # PUNTAJES BASE (Invertidos en X respecto a V6)
    # X: -1 (Mercado/Individuo) <-> +1 (Estado/Colectivo)
    # ---------------------------------------------------------
    
    _SCORES_ECONOMIA = {
        # Antes -0.6 (fuerte estado), ahora +0.6
        ConceptoEconomia.CLASES:        {'x': 0.6,  'y': 0.4},
        # Antes +0.9 (débil estado), ahora -0.9
        ConceptoEconomia.INDIVIDUOS:    {'x': -0.9, 'y': -0.5},
        ConceptoEconomia.INSTITUCIONES: {'x': 0.3,  'y': 0.0},
        ConceptoEconomia.SISTEMA:       {'x': 0.5,  'y': 0.2},
    }

    _SCORES_HUMANO = {
        ConceptoHumano.RACIONAL_EGOISTA:      {'x': -0.8, 'y': -0.8}, # Menos estado
        ConceptoHumano.RACIONALIDAD_LIMITADA: {'x': 0.2,  'y': 0.3},  # Requiere regulación
        ConceptoHumano.CONDICIONADO_CLASE:    {'x': 0.7,  'y': 0.7},  # Requiere intervención
        ConceptoHumano.ADAPTABLE:             {'x': 0.1,  'y': 0.1},
    }
    
    _SCORES_MUNDO = {
        NaturalezaMundo.EQUILIBRIO_ESTATICO:   {'x': -0.7, 'y': -0.3}, # Se autorregula -> Menos estado
        NaturalezaMundo.INCERTIDUMBRE_RADICAL: {'x': 0.4,  'y': 0.0},  # Necesita estabilizador -> Más estado
        NaturalezaMundo.EVOLUTIVO:             {'x': -0.2, 'y': -0.6},
        NaturalezaMundo.DETERMINISTA:          {'x': 0.5,  'y': 0.0},
    }

    _SCORES_AMBITO = {
        AmbitoRelevante.INTERCAMBIO:  {'x': -0.6, 'y': -0.2},
        AmbitoRelevante.PRODUCCION:   {'x': 0.2,  'y': -0.9}, # Puede implicar política industrial (+)
        AmbitoRelevante.DISTRIBUCION: {'x': 0.6,  'y': 0.9},  # Requiere estado redistribuidor (+)
        AmbitoRelevante.DEMANDA:      {'x': 0.4,  'y': 0.3},
    }

    _SCORES_MOTOR = {
        MotorCambio.INDIVIDUO:           {'x': -1.0, 'y': -0.4},
        MotorCambio.CAPITAL:             {'x': -0.5, 'y': -0.8},
        MotorCambio.TECNOLOGIA:          {'x': -0.3, 'y': -0.7},
        MotorCambio.LUCHA_CLASES:        {'x': 0.8,  'y': 0.8},
        MotorCambio.POLITICA_INDUSTRIAL: {'x': 0.9,  'y': -0.6}, # Alto estado (+), fin crecimiento (-)
    }

    _SCORES_POLITICA = {
        PoliticaPreferida.LIBRE_MERCADO:        {'x': -1.0, 'y': -0.5},
        PoliticaPreferida.REGULACION_FALLOS:    {'x': -0.2, 'y': 0.0},
        PoliticaPreferida.ESTADO_BIENESTAR:     {'x': 0.5,  'y': 0.6},
        PoliticaPreferida.ESTADO_DESARROLLISTA: {'x': 0.8,  'y': -0.7},
        PoliticaPreferida.PLANIFICACION:        {'x': 1.0,  'y': 0.5},
    }

    def __init__(self, weights_preset: str = 'balanced'):
        self.weights = self._get_weights(weights_preset)

    def _get_weights(self, preset: str) -> Dict[str, float]:
        presets = {
            'balanced': {
                'economia': 0.10, 'humano': 0.15, 'mundo': 0.05,
                'ambito': 0.15, 'motor': 0.20, 'politica': 0.35
            }
        }
        return presets.get(preset, presets['balanced'])

    def calculate(self, school: SchoolDescriptors) -> ScoringResult:
        x_weighted_sum = 0.0
        y_weighted_sum = 0.0

        mapping = [
            ('economia', school.economia, self._SCORES_ECONOMIA),
            ('humano', school.humano, self._SCORES_HUMANO),
            ('mundo', school.mundo, self._SCORES_MUNDO),
            ('ambito', school.ambito, self._SCORES_AMBITO),
            ('motor', school.motor, self._SCORES_MOTOR),
            ('politica', school.politica, self._SCORES_POLITICA),
        ]

        for key, enum_val, score_dict in mapping:
            weight = self.weights[key]
            scores = score_dict[enum_val]
            x_weighted_sum += scores['x'] * weight
            y_weighted_sum += scores['y'] * weight

        x_final = np.clip(x_weighted_sum, -1.0, 1.0)
        y_final = np.clip(y_weighted_sum, -1.0, 1.0)

        return ScoringResult(
            x_final=x_final,
            y_final=y_final,
            quadrant_label=self._get_label(x_final, y_final)
        )

    def _get_label(self, x: float, y: float) -> str:
        """
        Etiquetado de cuadrantes actualizado para X invertido.
        X Positivo = Estado Fuerte.
        X Negativo = Estado Débil.
        """
        # Cuadrante 1: Estado Fuerte (+X) y Equidad (+Y)
        if x > 0 and y > 0: return "Socialismo / Estado de Bienestar"
        
        # Cuadrante 2: Estado Débil (-X) y Equidad (+Y)
        # (Raro teóricamente, suele ser mutualismo, cooperativismo o socialdemocracia muy ligera)
        if x < 0 and y > 0: return "Economía Social de Mercado / Cooperativismo"
        
        # Cuadrante 3: Estado Débil (-X) y Crecimiento (-Y)
        if x < 0 and y < 0: return "Neoliberalismo / Escuela Austriaca"
        
        # Cuadrante 4: Estado Fuerte (+X) y Crecimiento (-Y)
        if x > 0 and y < 0: return "Estado Desarrollista / Mercantilismo"
        
        return "Centro / Híbrido"

# ============================================================
# 4. EJEMPLO DE VISUALIZACIÓN
# ============================================================

if __name__ == "__main__":
    scorer = EconomicSchoolScorer(weights_preset='balanced')

    schools_data = [
        SchoolDescriptors(
            "Neoclásica", ConceptoEconomia.INDIVIDUOS, ConceptoHumano.RACIONAL_EGOISTA,
            NaturalezaMundo.EQUILIBRIO_ESTATICO, AmbitoRelevante.INTERCAMBIO,
            MotorCambio.INDIVIDUO, PoliticaPreferida.LIBRE_MERCADO
        ),
        SchoolDescriptors(
            "Keynesiana", ConceptoEconomia.SISTEMA, ConceptoHumano.RACIONALIDAD_LIMITADA,
            NaturalezaMundo.INCERTIDUMBRE_RADICAL, AmbitoRelevante.DEMANDA,
            MotorCambio.INDIVIDUO, PoliticaPreferida.ESTADO_BIENESTAR
        ),
        SchoolDescriptors(
            "Desarrollista (Asia)", ConceptoEconomia.PRODUCCION, ConceptoHumano.ADAPTABLE,
            NaturalezaMundo.EVOLUTIVO, AmbitoRelevante.PRODUCCION,
            MotorCambio.POLITICA_INDUSTRIAL, PoliticaPreferida.ESTADO_DESARROLLISTA
        ),
        SchoolDescriptors(
            "Marxista Clásica", ConceptoEconomia.CLASES, ConceptoHumano.CONDICIONADO_CLASE,
            NaturalezaMundo.DETERMINISTA, AmbitoRelevante.DISTRIBUCION,
            MotorCambio.LUCHA_CLASES, PoliticaPreferida.PLANIFICACION
        )
    ]

    print(f"{'ESCUELA':<22} | {'PODER ESTATAL (X)':<18} | {'OBJETIVO (Y)':<15} | {'CUADRANTE RESULTANTE'}")
    print("-" * 95)
    
    for s in schools_data:
        res = scorer.calculate(s)
        
        # Visualización de barras ASCII
        # X negativo (izquierda) es Mercado, X positivo (derecha) es Estado
        bar_len = 8
        
        # Lógica visual X: [-1 (Mkt) ... 0 ... +1 (Est)]
        x_val_norm = int(res.x_final * bar_len)
        if res.x_final < 0:
            vis_x = "Mkt " + "█"*abs(x_val_norm)
        else:
            vis_x = "Est " + "█"*abs(x_val_norm)
            
        print(f"{s.nombre:<22} | {res.x_final:>5.2f} {vis_x:<11} | {res.y_final:>5.2f}           | {res.quadrant_label}")