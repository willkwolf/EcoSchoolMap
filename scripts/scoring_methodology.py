"""
scoring_methodology_v8_fixed.py - Motor de Inferencia para Escuelas Económicas

CORRECCIÓN V8:
--------------
1. Se agregó 'PRODUCCION' al Enum ConceptoEconomia (causante del AttributeError).
2. Se mantiene el Eje X invertido:
   - Negativo: Mercado / Individuo
   - Positivo: Estado / Colectivo

EJE X: INTENSIDAD DE INTERVENCIÓN ESTATAL [-1.0 a 1.0]
EJE Y: OBJETIVO SOCIOECONÓMICO [-1.0 (Crecimiento) a 1.0 (Equidad)]
"""

import numpy as np
from enum import Enum
from dataclasses import dataclass
from typing import Dict, List

# ============================================================
# 1. DOMAIN DEFINITIONS (ENUMS)
# ============================================================

class ConceptoEconomia(Enum):
    CLASES = "clases_sociales"
    INDIVIDUOS = "individuos"
    INSTITUCIONES = "instituciones"
    SISTEMA = "sistema_complejo"
    PRODUCCION = "sistema_productivo"  # <--- AGREGADO: Faltaba esta definición

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
# 3. SCORING ENGINE (Eje X Invertido: + es Estado, - es Mercado)
# ============================================================

class EconomicSchoolScorer:
    
    # Diccionarios de puntaje
    # X: +1.0 (Estado Máximo) <-> -1.0 (Estado Mínimo)
    # Y: +1.0 (Equidad) <-> -1.0 (Crecimiento)

    _SCORES_ECONOMIA = {
        ConceptoEconomia.CLASES:        {'x': 0.7,  'y': 0.5},
        ConceptoEconomia.INDIVIDUOS:    {'x': -0.9, 'y': -0.5},
        ConceptoEconomia.INSTITUCIONES: {'x': 0.3,  'y': 0.0},
        ConceptoEconomia.SISTEMA:       {'x': 0.5,  'y': 0.2},
        # Definición agregada: Ver la economía como sistema productivo
        # implica coordinación (Estado +) para crecer (Crecimiento -)
        ConceptoEconomia.PRODUCCION:    {'x': 0.6,  'y': -0.6},
    }

    _SCORES_HUMANO = {
        ConceptoHumano.RACIONAL_EGOISTA:      {'x': -0.8, 'y': -0.8},
        ConceptoHumano.RACIONALIDAD_LIMITADA: {'x': 0.2,  'y': 0.3},
        ConceptoHumano.CONDICIONADO_CLASE:    {'x': 0.7,  'y': 0.7},
        ConceptoHumano.ADAPTABLE:             {'x': 0.1,  'y': 0.1},
    }
    
    _SCORES_MUNDO = {
        NaturalezaMundo.EQUILIBRIO_ESTATICO:   {'x': -0.7, 'y': -0.3},
        NaturalezaMundo.INCERTIDUMBRE_RADICAL: {'x': 0.4,  'y': 0.0},
        NaturalezaMundo.EVOLUTIVO:             {'x': -0.2, 'y': -0.6},
        NaturalezaMundo.DETERMINISTA:          {'x': 0.5,  'y': 0.0},
    }

    _SCORES_AMBITO = {
        AmbitoRelevante.INTERCAMBIO:  {'x': -0.6, 'y': -0.2},
        AmbitoRelevante.PRODUCCION:   {'x': 0.3,  'y': -0.9},
        AmbitoRelevante.DISTRIBUCION: {'x': 0.6,  'y': 0.9},
        AmbitoRelevante.DEMANDA:      {'x': 0.4,  'y': 0.3},
    }

    _SCORES_MOTOR = {
        MotorCambio.INDIVIDUO:           {'x': -1.0, 'y': -0.4},
        MotorCambio.CAPITAL:             {'x': -0.5, 'y': -0.8},
        MotorCambio.TECNOLOGIA:          {'x': -0.3, 'y': -0.7},
        MotorCambio.LUCHA_CLASES:        {'x': 0.8,  'y': 0.8},
        MotorCambio.POLITICA_INDUSTRIAL: {'x': 0.9,  'y': -0.7},
    }

    _SCORES_POLITICA = {
        PoliticaPreferida.LIBRE_MERCADO:        {'x': -1.0, 'y': -0.5},
        PoliticaPreferida.REGULACION_FALLOS:    {'x': -0.2, 'y': 0.0},
        PoliticaPreferida.ESTADO_BIENESTAR:     {'x': 0.5,  'y': 0.6},
        PoliticaPreferida.ESTADO_DESARROLLISTA: {'x': 0.8,  'y': -0.8},
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
        if x > 0 and y > 0: return "Socialismo / Estado de Bienestar"
        if x < 0 and y > 0: return "Econ. Social Mercado / Cooperativismo"
        if x < 0 and y < 0: return "Neoliberalismo / Escuela Austriaca"
        if x > 0 and y < 0: return "Estado Desarrollista / Mercantilismo"
        return "Centro / Híbrido"

# ============================================================
# 4. COMPATIBILITY LAYER FOR VARIANT GENERATION
# ============================================================

# Weight presets for variant generation
WEIGHT_PRESETS = {
    'base': {
        'x': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35},
        'y': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
    },
    'balanced': {
        'x': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35},
        'y': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
    },
    'state-emphasis': {
        'x': {'economia': 0.20, 'humano': 0.10, 'mundo': 0.10, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.25},
        'y': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
    },
    'equity-emphasis': {
        'x': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35},
        'y': {'economia': 0.15, 'humano': 0.20, 'mundo': 0.10, 'ambito': 0.20, 'motor': 0.15, 'politica': 0.20}
    },
    'market-emphasis': {
        'x': {'economia': 0.05, 'humano': 0.10, 'mundo': 0.15, 'ambito': 0.20, 'motor': 0.25, 'politica': 0.25},
        'y': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
    },
    'growth-emphasis': {
        'x': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35},
        'y': {'economia': 0.05, 'humano': 0.10, 'mundo': 0.15, 'ambito': 0.20, 'motor': 0.25, 'politica': 0.25}
    },
    'historical-emphasis': {
        'x': {'economia': 0.15, 'humano': 0.10, 'mundo': 0.20, 'ambito': 0.10, 'motor': 0.15, 'politica': 0.30},
        'y': {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
    },
    'pragmatic-emphasis': {
        'x': {'economia': 0.12, 'humano': 0.18, 'mundo': 0.08, 'ambito': 0.12, 'motor': 0.18, 'politica': 0.32},
        'y': {'economia': 0.12, 'humano': 0.18, 'mundo': 0.08, 'ambito': 0.12, 'motor': 0.18, 'politica': 0.32}
    }
}

def get_available_presets():
    """Get list of available weight presets."""
    return list(WEIGHT_PRESETS.keys())

def get_weight_preset(preset_name: str):
    """Get weight preset by name."""
    return WEIGHT_PRESETS.get(preset_name, WEIGHT_PRESETS['balanced'])

class SchoolScorer:
    """Compatibility class for variant generation."""

    # Mapping from string values to Enums
    _ECONOMIA_MAP = {
        'clases_sociales': ConceptoEconomia.CLASES,
        'individuos': ConceptoEconomia.INDIVIDUOS,
        'estructuras': ConceptoEconomia.INSTITUCIONES,
        'sistema_complejo': ConceptoEconomia.SISTEMA,
        'sistema_productivo': ConceptoEconomia.PRODUCCION
    }

    _HUMANO_MAP = {
        'racional_egoista': ConceptoHumano.RACIONAL_EGOISTA,
        'racional_limitada': ConceptoHumano.RACIONALIDAD_LIMITADA,
        'condicionado_clase': ConceptoHumano.CONDICIONADO_CLASE,
        'adaptable_cultural': ConceptoHumano.ADAPTABLE
    }

    _MUNDO_MAP = {
        'equilibrio_cierto': NaturalezaMundo.EQUILIBRIO_ESTATICO,
        'incertidumbre': NaturalezaMundo.INCERTIDUMBRE_RADICAL,
        'evolutivo_dinamico': NaturalezaMundo.EVOLUTIVO,
        'determinista_historico': NaturalezaMundo.DETERMINISTA
    }

    _AMBITO_MAP = {
        'intercambio_mercado': AmbitoRelevante.INTERCAMBIO,
        'produccion': AmbitoRelevante.PRODUCCION,
        'distribucion': AmbitoRelevante.DISTRIBUCION,
        'consumo_demanda': AmbitoRelevante.DEMANDA
    }

    _MOTOR_MAP = {
        'accion_individual': MotorCambio.INDIVIDUO,
        'acumulacion_capital': MotorCambio.CAPITAL,
        'innovacion': MotorCambio.TECNOLOGIA,
        'conflicto_social': MotorCambio.LUCHA_CLASES,
        'politica_estado': MotorCambio.POLITICA_INDUSTRIAL
    }

    _POLITICA_MAP = {
        'laissez_faire': PoliticaPreferida.LIBRE_MERCADO,
        'fallos_mercado': PoliticaPreferida.REGULACION_FALLOS,
        'welfare_state': PoliticaPreferida.ESTADO_BIENESTAR,
        'developmental_state': PoliticaPreferida.ESTADO_DESARROLLISTA,
        'planificacion_central': PoliticaPreferida.PLANIFICACION
    }

    def __init__(self, normalization_method='percentile', weights_x=None, weights_y=None):
        self.normalization_method = normalization_method
        self.weights_x = weights_x or {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
        self.weights_y = weights_y or {'economia': 0.10, 'humano': 0.15, 'mundo': 0.05, 'ambito': 0.15, 'motor': 0.20, 'politica': 0.35}
        self.scorer = EconomicSchoolScorer()

    def batch_calculate_positions(self, schools_descriptors):
        """Calculate positions for multiple schools."""
        results = {}
        for school_id, descriptors in schools_descriptors.items():
            # Convert descriptors to SchoolDescriptors object
            school_desc = self._create_school_descriptors(descriptors)
            if school_desc:
                result = self.scorer.calculate(school_desc)
                results[school_id] = (result.x_final, result.y_final)

        # Apply normalization method to all results
        if self.normalization_method != 'none':
            results = self._apply_normalization(results)

        return results

    def _apply_normalization(self, results):
        """Apply the specified normalization method to the results."""
        if not results:
            return results

        # Extract x and y values
        x_values = [pos[0] for pos in results.values()]
        y_values = [pos[1] for pos in results.values()]

        if self.normalization_method == 'percentile':
            x_normalized = self._percentile_normalize(x_values)
            y_normalized = self._percentile_normalize(y_values)
        elif self.normalization_method == 'zscore':
            x_normalized = self._zscore_normalize(x_values)
            y_normalized = self._zscore_normalize(y_values)
        elif self.normalization_method == 'minmax':
            x_normalized = self._minmax_normalize(x_values)
            y_normalized = self._minmax_normalize(y_values)
        else:
            # Default to none (no normalization)
            return results

        # Reconstruct results with normalized values
        normalized_results = {}
        for i, school_id in enumerate(results.keys()):
            normalized_results[school_id] = (x_normalized[i], y_normalized[i])

        return normalized_results

    def _percentile_normalize(self, values):
        """Convert values to percentiles (0-1 range)."""
        import numpy as np
        values_array = np.array(values)
        # Calculate percentiles
        percentiles = (values_array - np.min(values_array)) / (np.max(values_array) - np.min(values_array))
        # Handle case where all values are the same
        percentiles = np.nan_to_num(percentiles, nan=0.5)
        return percentiles.tolist()

    def _zscore_normalize(self, values):
        """Convert values to z-scores (standardized with mean=0, std=1)."""
        import numpy as np
        values_array = np.array(values)
        mean_val = np.mean(values_array)
        std_val = np.std(values_array)
        if std_val == 0:
            # All values are the same, return zeros
            return [0.0] * len(values)
        z_scores = (values_array - mean_val) / std_val
        return z_scores.tolist()

    def _minmax_normalize(self, values):
        """Scale values to [0, 1] range."""
        import numpy as np
        values_array = np.array(values)
        min_val = np.min(values_array)
        max_val = np.max(values_array)
        if max_val == min_val:
            # All values are the same, return 0.5
            return [0.5] * len(values)
        normalized = (values_array - min_val) / (max_val - min_val)
        return normalized.tolist()

    def _create_school_descriptors(self, descriptors):
        """Create SchoolDescriptors from dict."""
        try:
            return SchoolDescriptors(
                nombre=descriptors.get('nombre', 'Unknown'),
                economia=self._ECONOMIA_MAP.get(descriptors.get('concepcion_economia'), ConceptoEconomia.INDIVIDUOS),
                humano=self._HUMANO_MAP.get(descriptors.get('concepcion_humano'), ConceptoHumano.RACIONAL_EGOISTA),
                mundo=self._MUNDO_MAP.get(descriptors.get('naturaleza_mundo'), NaturalezaMundo.EQUILIBRIO_ESTATICO),
                ambito=self._AMBITO_MAP.get(descriptors.get('ambito_economico'), AmbitoRelevante.INTERCAMBIO),
                motor=self._MOTOR_MAP.get(descriptors.get('motor_cambio'), MotorCambio.INDIVIDUO),
                politica=self._POLITICA_MAP.get(descriptors.get('politicas_preferidas'), PoliticaPreferida.LIBRE_MERCADO)
            )
        except Exception as e:
            print(f"Error creating descriptors: {e}")
            return None

# ============================================================
# 4. EXECUTION
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
            # AHORA SÍ FUNCIONARÁ: ConceptoEconomia.PRODUCCION existe
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
        
        # Visualización ASCII
        bar_len = 8
        x_val_norm = int(res.x_final * bar_len)
        
        if res.x_final < 0:
            vis_x = "Mkt " + "█"*abs(x_val_norm)
        else:
            vis_x = "Est " + "█"*abs(x_val_norm)
            
        print(f"{s.nombre:<22} | {res.x_final:>5.2f} {vis_x:<11} | {res.y_final:>5.2f}           | {res.quadrant_label}")