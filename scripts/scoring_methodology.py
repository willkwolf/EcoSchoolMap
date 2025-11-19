"""
scoring_methodology.py - Metodología de Puntuación para Escuelas Económicas

Basado en el análisis de Ha-Joon Chang sobre la Weltanschauung (visión del mundo)
de las escuelas económicas. Este módulo traduce características cualitativas en
posiciones cuantitativas en un espacio 2D.

Autor: William Camilo Artunduaga Viana
Versión: 5.0
Fecha: 2025-10-23

METODOLOGÍA:
============
Usamos 6 descriptores fundamentales para capturar la esencia de cada escuela:

1. CONCEPCIÓN DE LA ECONOMÍA
   - ¿Analiza clases sociales, individuos, o es ambiguo?

2. CONCEPCIÓN DEL SER HUMANO
   - ¿Racional-egoísta, determinado por clase, racionalidad limitada, o indefinido?

3. NATURALEZA DEL MUNDO
   - ¿El mundo económico es cierto y predecible, o complejo e incierto?

4. ÁMBITO ECONÓMICO RELEVANTE
   - ¿Enfoque en producción, comercio, consumo, o distribución?

5. MOTOR DEL CAMBIO ECONÓMICO
   - ¿Acumulación de capital, decisiones individuales, lucha de clases, innovación?

6. POLÍTICAS ECONÓMICAS PREFERIDAS
   - ¿Libre mercado, intervención estatal, redistribución, o ambiguas?

EJE X: Grado de Control Estatal (de fuerte negativo a débil positivo)
EJE Y: Prioridad Equidad vs Crecimiento (equidad positivo, crecimiento negativo)

Rango de valores: [-0.9, 0.9] para evitar puntos en los bordes extremos
Zona de ambigüedad: [-0.25, 0.25] para posiciones intermedias
"""

import numpy as np
from typing import Dict, Tuple, List
from scipy import stats


# ============================================================
# WEIGHT VALIDATOR
# ============================================================

class WeightValidator:
    """
    Validador para configuraciones de pesos en el SchoolScorer.
    """

    VALID_KEYS_X = {'concepcion_economia', 'concepcion_humano', 'naturaleza_mundo',
                    'motor_cambio', 'politicas_preferidas'}
    VALID_KEYS_Y = {'concepcion_humano', 'ambito_economico', 'motor_cambio'}

    @classmethod
    def validate(cls, weights: Dict[str, float], axis: str) -> None:
        """
        Valida una configuración de pesos.

        Args:
            weights: Diccionario con pesos
            axis: 'x' o 'y'

        Raises:
            ValueError: Si los pesos no son válidos
        """
        cls.validate_keys(weights, axis)
        cls.validate_range(weights)
        cls.validate_sum(weights)

    @classmethod
    def validate_keys(cls, weights: Dict[str, float], axis: str) -> None:
        """
        Valida que las claves sean correctas para el eje dado.

        Args:
            weights: Diccionario con pesos
            axis: 'x' o 'y'

        Raises:
            ValueError: Si faltan claves o hay claves incorrectas
        """
        valid_keys = cls.VALID_KEYS_X if axis == 'x' else cls.VALID_KEYS_Y
        provided_keys = set(weights.keys())

        missing = valid_keys - provided_keys
        extra = provided_keys - valid_keys

        if missing:
            raise ValueError(f"Faltan claves en weights_{axis}: {missing}")
        if extra:
            raise ValueError(f"Claves no válidas en weights_{axis}: {extra}")

    @classmethod
    def validate_range(cls, weights: Dict[str, float]) -> None:
        """
        Valida que todos los pesos estén en el rango [0, 1].

        Args:
            weights: Diccionario con pesos

        Raises:
            ValueError: Si algún peso está fuera del rango
        """
        for key, value in weights.items():
            if not (0.0 <= value <= 1.0):
                raise ValueError(f"Peso '{key}' = {value} fuera del rango [0, 1]")

    @classmethod
    def validate_sum(cls, weights: Dict[str, float], tolerance: float = 0.01) -> None:
        """
        Valida que la suma de pesos sea aproximadamente 1.0.

        Args:
            weights: Diccionario con pesos
            tolerance: Tolerancia para la suma (por defecto 0.01)

        Raises:
            ValueError: Si la suma difiere significativamente de 1.0
        """
        total = sum(weights.values())
        if not (1.0 - tolerance <= total <= 1.0 + tolerance):
            raise ValueError(f"La suma de pesos ({total:.3f}) debe ser aproximadamente 1.0")


# ============================================================
# WEIGHT PRESETS
# ============================================================

# Preset 1: BASE (configuración original, balanceada)
WEIGHT_PRESET_BASE_X = {
    'concepcion_economia': 0.25,
    'concepcion_humano': 0.20,
    'naturaleza_mundo': 0.15,
    'motor_cambio': 0.20,
    'politicas_preferidas': 0.20
}

WEIGHT_PRESET_BASE_Y = {
    'concepcion_humano': 0.30,
    'ambito_economico': 0.30,
    'motor_cambio': 0.40
}

# Preset 2: STATE_EMPHASIS (énfasis en rol del estado)
# Aumenta peso de políticas_preferidas y concepcion_economia en X
WEIGHT_PRESET_STATE_EMPHASIS_X = {
    'concepcion_economia': 0.35,       # +0.10
    'concepcion_humano': 0.15,         # -0.05
    'naturaleza_mundo': 0.10,          # -0.05
    'motor_cambio': 0.10,              # -0.10
    'politicas_preferidas': 0.30       # +0.10
}

WEIGHT_PRESET_STATE_EMPHASIS_Y = {
    'concepcion_humano': 0.25,         # -0.05
    'ambito_economico': 0.35,          # +0.05
    'motor_cambio': 0.40               # sin cambio
}

# Preset 3: EQUITY_EMPHASIS (énfasis en equidad)
# Aumenta peso de ambito_economico en Y
WEIGHT_PRESET_EQUITY_EMPHASIS_X = {
    'concepcion_economia': 0.25,
    'concepcion_humano': 0.25,         # +0.05
    'naturaleza_mundo': 0.15,
    'motor_cambio': 0.15,              # -0.05
    'politicas_preferidas': 0.20
}

WEIGHT_PRESET_EQUITY_EMPHASIS_Y = {
    'concepcion_humano': 0.35,         # +0.05
    'ambito_economico': 0.45,          # +0.15
    'motor_cambio': 0.20               # -0.20
}

# Preset 4: MARKET_EMPHASIS (énfasis en mercado libre)
# Aumenta peso de motor_cambio individualista
WEIGHT_PRESET_MARKET_EMPHASIS_X = {
    'concepcion_economia': 0.20,       # -0.05
    'concepcion_humano': 0.25,         # +0.05
    'naturaleza_mundo': 0.20,          # +0.05
    'motor_cambio': 0.25,              # +0.05
    'politicas_preferidas': 0.10       # -0.10
}

WEIGHT_PRESET_MARKET_EMPHASIS_Y = {
    'concepcion_humano': 0.35,         # +0.05
    'ambito_economico': 0.25,          # -0.05
    'motor_cambio': 0.40               # sin cambio
}

# Preset 5: HISTORICAL_EMPHASIS (énfasis en tradiciones históricas)
# Balancea todos los factores estructurales
WEIGHT_PRESET_HISTORICAL_EMPHASIS_X = {
    'concepcion_economia': 0.30,       # +0.05
    'concepcion_humano': 0.15,         # -0.05
    'naturaleza_mundo': 0.20,          # +0.05
    'motor_cambio': 0.25,              # +0.05
    'politicas_preferidas': 0.10       # -0.10
}

WEIGHT_PRESET_HISTORICAL_EMPHASIS_Y = {
    'concepcion_humano': 0.20,         # -0.10
    'ambito_economico': 0.40,          # +0.10
    'motor_cambio': 0.40               # sin cambio
}

# Preset 6: GROWTH_EMPHASIS (énfasis en crecimiento)
# Aumenta peso de producción/acumulación
WEIGHT_PRESET_GROWTH_EMPHASIS_X = {
    'concepcion_economia': 0.20,       # -0.05
    'concepcion_humano': 0.20,
    'naturaleza_mundo': 0.15,
    'motor_cambio': 0.30,              # +0.10
    'politicas_preferidas': 0.15       # -0.05
}

WEIGHT_PRESET_GROWTH_EMPHASIS_Y = {
    'concepcion_humano': 0.25,         # -0.05
    'ambito_economico': 0.20,          # -0.10
    'motor_cambio': 0.55               # +0.15
}

# Preset 7: BALANCED (pesos uniformes)
# Distribución completamente equitativa
WEIGHT_PRESET_BALANCED_X = {
    'concepcion_economia': 0.20,
    'concepcion_humano': 0.20,
    'naturaleza_mundo': 0.20,
    'motor_cambio': 0.20,
    'politicas_preferidas': 0.20
}

WEIGHT_PRESET_BALANCED_Y = {
    'concepcion_humano': 0.33,
    'ambito_economico': 0.34,
    'motor_cambio': 0.33
}

# Preset 8: PRAGMATIC_EMPHASIS (balance pragmático intermedio)
# Reduce extremos, favorece posiciones centristas
WEIGHT_PRESET_PRAGMATIC_X = {
    'concepcion_economia': 0.18,       # -0.07
    'concepcion_humano': 0.22,         # +0.02
    'naturaleza_mundo': 0.18,          # +0.03
    'motor_cambio': 0.22,              # +0.02
    'politicas_preferidas': 0.20       # sin cambio
}

WEIGHT_PRESET_PRAGMATIC_Y = {
    'concepcion_humano': 0.32,         # +0.02
    'ambito_economico': 0.36,          # +0.06
    'motor_cambio': 0.32               # -0.08
}

# Diccionario de todos los presets para fácil acceso
WEIGHT_PRESETS = {
    'base': {'x': WEIGHT_PRESET_BASE_X, 'y': WEIGHT_PRESET_BASE_Y},
    'state-emphasis': {'x': WEIGHT_PRESET_STATE_EMPHASIS_X, 'y': WEIGHT_PRESET_STATE_EMPHASIS_Y},
    'equity-emphasis': {'x': WEIGHT_PRESET_EQUITY_EMPHASIS_X, 'y': WEIGHT_PRESET_EQUITY_EMPHASIS_Y},
    'market-emphasis': {'x': WEIGHT_PRESET_MARKET_EMPHASIS_X, 'y': WEIGHT_PRESET_MARKET_EMPHASIS_Y},
    'historical-emphasis': {'x': WEIGHT_PRESET_HISTORICAL_EMPHASIS_X, 'y': WEIGHT_PRESET_HISTORICAL_EMPHASIS_Y},
    'growth-emphasis': {'x': WEIGHT_PRESET_GROWTH_EMPHASIS_X, 'y': WEIGHT_PRESET_GROWTH_EMPHASIS_Y},
    'balanced': {'x': WEIGHT_PRESET_BALANCED_X, 'y': WEIGHT_PRESET_BALANCED_Y},
    'pragmatic-emphasis': {'x': WEIGHT_PRESET_PRAGMATIC_X, 'y': WEIGHT_PRESET_PRAGMATIC_Y}
}


class SchoolScorer:
    """
    Calculador de posiciones para escuelas económicas basado en descriptores cualitativos.
    """

    # ============================================================
    # CONSTANTES DE SCORING
    # ============================================================

    # Descriptor 1: Concepción de la Economía
    # Contribuye principalmente al Eje X (control estatal)
    CONCEPCION_ECONOMIA = {
        'clases_sociales': -0.8,      # Visión colectivista → estado fuerte
        'individuos': 0.8,             # Visión individualista → estado débil
        'estructuras': -0.5,           # Enfoque estructural → regulación
        'indefinido': 0.0              # Ambiguo → neutral
    }

    # Descriptor 2: Concepción del Ser Humano
    # Contribuye a ambos ejes
    CONCEPCION_HUMANO = {
        'racional_egoista': {'x': 0.7, 'y': -0.6},    # Individuo racional → mercado libre, crecimiento
        'condicionado_clase': {'x': -0.8, 'y': 0.7},  # Determinismo social → estado, equidad
        'racionalidad_limitada': {'x': 0.2, 'y': 0.3}, # Necesita guía → regulación moderada
        'no_definido': {'x': 0.0, 'y': 0.0}           # Ambiguo → neutral
    }

    # Descriptor 3: Naturaleza del Mundo
    # Contribuye principalmente al Eje X
    NATURALEZA_MUNDO = {
        'cierto_predecible': 0.6,      # Confianza en modelos → menos intervención
        'complejo_incierto': -0.6,     # Incertidumbre → más regulación
        'ambiguo': 0.0                 # Indefinido → neutral
    }

    # Descriptor 4: Ámbito Económico Relevante
    # Contribuye principalmente al Eje Y
    AMBITO_ECONOMICO = {
        'produccion': -0.4,            # Enfoque en crear → crecimiento
        'comercio': 0.2,               # Intercambio → mixto
        'consumo': -0.3,               # Demanda → crecimiento con regulación
        'distribucion': 0.8            # Redistribución → equidad
    }

    # Descriptor 5: Motor del Cambio
    # Contribuye a ambos ejes
    MOTOR_CAMBIO = {
        'acumulacion_capital': {'x': 0.5, 'y': -0.5},      # Capitalismo → mercado, crecimiento
        'decisiones_individuales': {'x': 0.7, 'y': -0.4},  # Libertad individual → mercado
        'lucha_clases': {'x': -0.9, 'y': 0.8},             # Conflicto → estado fuerte, equidad
        'innovacion_tecnologica': {'x': 0.3, 'y': -0.2},   # Innovación → mixto, crecimiento
        'instituciones': {'x': -0.3, 'y': 0.4}             # Coordinación → regulación, balance
    }

    # Descriptor 6: Políticas Preferidas
    # Contribuye principalmente al Eje X
    POLITICAS_PREFERIDAS = {
        'libre_mercado': 0.9,          # Máxima libertad económica → estado débil
        'intervencion_estatal': -0.7,  # Regulación activa → estado fuerte
        'redistribucion': -0.9,        # Redistribución radical → estado muy fuerte
        'ambiguas': 0.0                # Mixtas → neutral
    }

    # Pesos para cada descriptor (suman 1.0)
    # Permiten ajustar la importancia relativa de cada factor
    PESOS_EJE_X = {
        'concepcion_economia': 0.25,
        'concepcion_humano': 0.20,
        'naturaleza_mundo': 0.15,
        'motor_cambio': 0.20,
        'politicas_preferidas': 0.20
    }

    PESOS_EJE_Y = {
        'concepcion_humano': 0.30,
        'ambito_economico': 0.30,
        'motor_cambio': 0.40
    }

    def __init__(self,
                 normalization_method: str = 'percentile',
                 weights_x: Dict[str, float] = None,
                 weights_y: Dict[str, float] = None):
        """
        Inicializa el calculador de scores.

        Args:
            normalization_method: Método de normalización ('percentile', 'zscore', 'minmax', 'none')
            weights_x: Pesos personalizados para el eje X. Si None, usa PESOS_EJE_X por defecto
            weights_y: Pesos personalizados para el eje Y. Si None, usa PESOS_EJE_Y por defecto
        """
        self.normalization_method = normalization_method

        # Usar pesos personalizados o valores por defecto
        self.weights_x = weights_x if weights_x is not None else self.PESOS_EJE_X.copy()
        self.weights_y = weights_y if weights_y is not None else self.PESOS_EJE_Y.copy()

        # Validar pesos si se proporcionaron personalizados
        if weights_x is not None:
            WeightValidator.validate(weights_x, 'x')
        if weights_y is not None:
            WeightValidator.validate(weights_y, 'y')

    def calculate_position(self, descriptors: Dict) -> Tuple[float, float]:
        """
        Calcula la posición (x, y) de una escuela basándose en sus descriptores.

        Args:
            descriptors: Diccionario con los 6 descriptores de la escuela

        Returns:
            Tupla (x, y) con valores en el rango aproximado [-0.9, 0.9]

        Ejemplo:
            descriptors = {
                'concepcion_economia': 'individuos',
                'concepcion_humano': 'racional_egoista',
                'naturaleza_mundo': 'cierto_predecible',
                'ambito_economico': 'comercio',
                'motor_cambio': 'decisiones_individuales',
                'politicas_preferidas': 'libre_mercado'
            }
        """
        x_raw = self._calculate_x(descriptors)
        y_raw = self._calculate_y(descriptors)

        # Aplicar normalización si se desea
        x_norm = self._normalize_value(x_raw, axis='x')
        y_norm = self._normalize_value(y_raw, axis='y')

        # Limitar al rango [-0.9, 0.9]
        x_final = np.clip(x_norm, -0.9, 0.9)
        y_final = np.clip(y_norm, -0.9, 0.9)

        return (round(x_final, 2), round(y_final, 2))

    def _calculate_x(self, descriptors: Dict) -> float:
        """
        Calcula el valor del eje X (Control Estatal).
        Valores negativos = Estado fuerte, valores positivos = Estado débil
        """
        x = 0.0

        # Contribución de concepción de economía
        if 'concepcion_economia' in descriptors:
            valor = self.CONCEPCION_ECONOMIA.get(descriptors['concepcion_economia'], 0)
            x += valor * self.weights_x['concepcion_economia']

        # Contribución de concepción del humano (componente x)
        if 'concepcion_humano' in descriptors:
            humano_data = self.CONCEPCION_HUMANO.get(descriptors['concepcion_humano'], {'x': 0})
            x += humano_data['x'] * self.weights_x['concepcion_humano']

        # Contribución de naturaleza del mundo
        if 'naturaleza_mundo' in descriptors:
            valor = self.NATURALEZA_MUNDO.get(descriptors['naturaleza_mundo'], 0)
            x += valor * self.weights_x['naturaleza_mundo']

        # Contribución del motor de cambio (componente x)
        if 'motor_cambio' in descriptors:
            motor_data = self.MOTOR_CAMBIO.get(descriptors['motor_cambio'], {'x': 0})
            x += motor_data['x'] * self.weights_x['motor_cambio']

        # Contribución de políticas preferidas
        if 'politicas_preferidas' in descriptors:
            valor = self.POLITICAS_PREFERIDAS.get(descriptors['politicas_preferidas'], 0)
            x += valor * self.weights_x['politicas_preferidas']

        return x

    def _calculate_y(self, descriptors: Dict) -> float:
        """
        Calcula el valor del eje Y (Equidad vs Crecimiento).
        Valores positivos = Equidad, valores negativos = Crecimiento
        """
        y = 0.0

        # Contribución de concepción del humano (componente y)
        if 'concepcion_humano' in descriptors:
            humano_data = self.CONCEPCION_HUMANO.get(descriptors['concepcion_humano'], {'y': 0})
            y += humano_data['y'] * self.weights_y['concepcion_humano']

        # Contribución del ámbito económico
        if 'ambito_economico' in descriptors:
            valor = self.AMBITO_ECONOMICO.get(descriptors['ambito_economico'], 0)
            y += valor * self.weights_y['ambito_economico']

        # Contribución del motor de cambio (componente y)
        if 'motor_cambio' in descriptors:
            motor_data = self.MOTOR_CAMBIO.get(descriptors['motor_cambio'], {'y': 0})
            y += motor_data['y'] * self.weights_y['motor_cambio']

        return y

    def _normalize_value(self, value: float, axis: str) -> float:
        """
        Normaliza un valor según el método configurado.

        Args:
            value: Valor a normalizar
            axis: 'x' o 'y' (para futura expansión)

        Returns:
            Valor normalizado
        """
        if self.normalization_method == 'none':
            return value

        # Para métodos estadísticos, necesitaríamos un conjunto de valores
        # Por ahora, solo aplicamos escalado simple
        # Los valores ya vienen en rangos razonables por diseño de las constantes

        return value

    def batch_calculate_positions(self, schools_descriptors: Dict[str, Dict]) -> Dict[str, Tuple[float, float]]:
        """
        Calcula posiciones para múltiples escuelas y opcionalmente normaliza usando estadísticas del conjunto.

        Args:
            schools_descriptors: Dict con {school_id: descriptors_dict}

        Returns:
            Dict con {school_id: (x, y)}
        """
        # Calcular posiciones raw para todas las escuelas
        positions_raw = {}
        for school_id, descriptors in schools_descriptors.items():
            x_raw = self._calculate_x(descriptors)
            y_raw = self._calculate_y(descriptors)
            positions_raw[school_id] = (x_raw, y_raw)

        # Aplicar normalización basada en el conjunto completo si se requiere
        if self.normalization_method == 'percentile':
            return self._normalize_percentile(positions_raw)
        elif self.normalization_method == 'zscore':
            return self._normalize_zscore(positions_raw)
        elif self.normalization_method == 'minmax':
            return self._normalize_minmax(positions_raw)
        else:
            # Sin normalización, solo clip
            return {
                school_id: (round(np.clip(x, -0.9, 0.9), 2), round(np.clip(y, -0.9, 0.9), 2))
                for school_id, (x, y) in positions_raw.items()
            }

    def _normalize_percentile(self, positions: Dict[str, Tuple[float, float]]) -> Dict[str, Tuple[float, float]]:
        """
        Normaliza usando percentiles para mejor distribución visual.
        Mapea el rango de valores a [-0.9, 0.9] preservando la distribución relativa.
        """
        xs = [x for x, y in positions.values()]
        ys = [y for x, y in positions.values()]

        normalized = {}
        for school_id, (x, y) in positions.items():
            # Calcular percentil (0 a 100)
            x_percentile = stats.percentileofscore(xs, x)
            y_percentile = stats.percentileofscore(ys, y)

            # Mapear de [0, 100] a [-0.9, 0.9]
            x_norm = (x_percentile / 100.0) * 1.8 - 0.9
            y_norm = (y_percentile / 100.0) * 1.8 - 0.9

            normalized[school_id] = (round(x_norm, 2), round(y_norm, 2))

        return normalized

    def _normalize_zscore(self, positions: Dict[str, Tuple[float, float]]) -> Dict[str, Tuple[float, float]]:
        """
        Normaliza usando z-scores para centrar la distribución.
        """
        xs = np.array([x for x, y in positions.values()])
        ys = np.array([y for x, y in positions.values()])

        # Calcular z-scores
        x_mean, x_std = xs.mean(), xs.std() if xs.std() > 0 else 1.0
        y_mean, y_std = ys.mean(), ys.std() if ys.std() > 0 else 1.0

        normalized = {}
        for school_id, (x, y) in positions.items():
            # Z-score
            x_z = (x - x_mean) / x_std
            y_z = (y - y_mean) / y_std

            # Escalar a [-0.9, 0.9], asumiendo 3 desviaciones estándar como máximo
            x_norm = np.clip(x_z / 3.0, -1.0, 1.0) * 0.9
            y_norm = np.clip(y_z / 3.0, -1.0, 1.0) * 0.9

            normalized[school_id] = (round(x_norm, 2), round(y_norm, 2))

        return normalized

    def _normalize_minmax(self, positions: Dict[str, Tuple[float, float]]) -> Dict[str, Tuple[float, float]]:
        """
        Normaliza usando min-max scaling para usar todo el rango [-0.9, 0.9].
        """
        xs = [x for x, y in positions.values()]
        ys = [y for x, y in positions.values()]

        x_min, x_max = min(xs), max(xs)
        y_min, y_max = min(ys), max(ys)

        x_range = x_max - x_min if x_max != x_min else 1.0
        y_range = y_max - y_min if y_max != y_min else 1.0

        normalized = {}
        for school_id, (x, y) in positions.items():
            # Normalizar a [0, 1]
            x_01 = (x - x_min) / x_range
            y_01 = (y - y_min) / y_range

            # Mapear a [-0.9, 0.9]
            x_norm = x_01 * 1.8 - 0.9
            y_norm = y_01 * 1.8 - 0.9

            normalized[school_id] = (round(x_norm, 2), round(y_norm, 2))

        return normalized

    def generate_justification(self, descriptors: Dict, position: Tuple[float, float]) -> str:
        """
        Genera una justificación textual de por qué una escuela está en cierta posición.

        Args:
            descriptors: Descriptores de la escuela
            position: Posición calculada (x, y)

        Returns:
            String con justificación
        """
        x, y = position

        # Determinar cuadrante
        cuadrante_x = "Estado fuerte" if x < 0 else "Estado débil"
        cuadrante_y = "énfasis en equidad" if y > 0 else "énfasis en crecimiento"

        # Construir justificación
        parts = []
        parts.append(f"{cuadrante_x} ({cuadrante_x.split()[1]})")
        parts.append(f"{cuadrante_y}")

        # Agregar detalles clave
        if 'concepcion_economia' in descriptors:
            parts.append(f"concibe economía como {descriptors['concepcion_economia'].replace('_', ' ')}")

        if 'motor_cambio' in descriptors:
            parts.append(f"motor: {descriptors['motor_cambio'].replace('_', ' ')}")

        return " + ".join(parts)


def get_descriptor_options() -> Dict[str, List[str]]:
    """
    Retorna las opciones válidas para cada descriptor.
    Útil para validación y documentación.
    """
    return {
        'concepcion_economia': list(SchoolScorer.CONCEPCION_ECONOMIA.keys()),
        'concepcion_humano': list(SchoolScorer.CONCEPCION_HUMANO.keys()),
        'naturaleza_mundo': list(SchoolScorer.NATURALEZA_MUNDO.keys()),
        'ambito_economico': list(SchoolScorer.AMBITO_ECONOMICO.keys()),
        'motor_cambio': list(SchoolScorer.MOTOR_CAMBIO.keys()),
        'politicas_preferidas': list(SchoolScorer.POLITICAS_PREFERIDAS.keys())
    }


def get_weight_preset(preset_name: str) -> Dict[str, Dict[str, float]]:
    """
    Obtiene un preset de pesos por nombre.

    Args:
        preset_name: Nombre del preset ('base', 'state-emphasis', etc.)

    Returns:
        Dict con keys 'x' e 'y' conteniendo los pesos

    Raises:
        ValueError: Si el preset no existe
    """
    if preset_name not in WEIGHT_PRESETS:
        available = ', '.join(WEIGHT_PRESETS.keys())
        raise ValueError(f"Preset '{preset_name}' no existe. Disponibles: {available}")

    return WEIGHT_PRESETS[preset_name]


def get_available_presets() -> List[str]:
    """
    Retorna la lista de presets disponibles.

    Returns:
        Lista de nombres de presets
    """
    return list(WEIGHT_PRESETS.keys())


# ============================================================
# EJEMPLO DE USO
# ============================================================

if __name__ == '__main__':
    """
    Ejemplo de uso del sistema de scoring con weight presets.
    """

    print("=" * 70)
    print("SCORING METHODOLOGY - EJEMPLO DE USO")
    print("=" * 70)
    print()

    # ============================================================
    # 1. Uso básico (pesos por defecto)
    # ============================================================
    print("1. SCORER CON PESOS POR DEFECTO (BASE)")
    print("-" * 70)

    scorer_default = SchoolScorer(normalization_method='none')

    # Ejemplo: Escuela Neoclásica
    neoclasica = {
        'concepcion_economia': 'individuos',
        'concepcion_humano': 'racional_egoista',
        'naturaleza_mundo': 'cierto_predecible',
        'ambito_economico': 'comercio',
        'motor_cambio': 'decisiones_individuales',
        'politicas_preferidas': 'libre_mercado'
    }

    pos_neoclasica = scorer_default.calculate_position(neoclasica)
    just_neoclasica = scorer_default.generate_justification(neoclasica, pos_neoclasica)

    print(f"Neoclásica: {pos_neoclasica}")
    print(f"Justificación: {just_neoclasica}")
    print()

    # Ejemplo: Escuela Marxista
    marxista = {
        'concepcion_economia': 'clases_sociales',
        'concepcion_humano': 'condicionado_clase',
        'naturaleza_mundo': 'complejo_incierto',
        'ambito_economico': 'distribucion',
        'motor_cambio': 'lucha_clases',
        'politicas_preferidas': 'redistribucion'
    }

    pos_marxista = scorer_default.calculate_position(marxista)
    just_marxista = scorer_default.generate_justification(marxista, pos_marxista)

    print(f"Marxista: {pos_marxista}")
    print(f"Justificación: {just_marxista}")
    print()

    # ============================================================
    # 2. Uso con weight preset (STATE-EMPHASIS)
    # ============================================================
    print("2. SCORER CON PRESET 'STATE-EMPHASIS'")
    print("-" * 70)

    # Obtener preset
    state_weights = get_weight_preset('state-emphasis')

    # Crear scorer con pesos personalizados
    scorer_state = SchoolScorer(
        normalization_method='none',
        weights_x=state_weights['x'],
        weights_y=state_weights['y']
    )

    pos_marxista_state = scorer_state.calculate_position(marxista)
    print(f"Marxista (state-emphasis): {pos_marxista_state}")
    print(f"Diferencia vs base: x={pos_marxista_state[0] - pos_marxista[0]:.2f}, y={pos_marxista_state[1] - pos_marxista[1]:.2f}")
    print()

    # ============================================================
    # 3. Validación de pesos
    # ============================================================
    print("3. VALIDACIÓN DE PESOS")
    print("-" * 70)

    try:
        # Intentar crear pesos inválidos (no suman 1.0)
        invalid_weights_x = {
            'concepcion_economia': 0.5,
            'concepcion_humano': 0.2,
            'naturaleza_mundo': 0.1,
            'motor_cambio': 0.1,
            'politicas_preferidas': 0.05  # Suma = 0.95, inválido
        }
        WeightValidator.validate(invalid_weights_x, 'x')
    except ValueError as e:
        print(f"✓ Validación detectó error: {e}")
    print()

    # ============================================================
    # 4. Listar presets disponibles
    # ============================================================
    print("4. PRESETS DISPONIBLES")
    print("-" * 70)
    for preset_name in get_available_presets():
        print(f"  - {preset_name}")
    print()

    # ============================================================
    # 5. Opciones de descriptores
    # ============================================================
    print("5. OPCIONES DE DESCRIPTORES")
    print("-" * 70)
    for descriptor, opciones in get_descriptor_options().items():
        print(f"  {descriptor}:")
        for opcion in opciones:
            print(f"    - {opcion}")
    print()

    print("=" * 70)
    print("FIN DEL EJEMPLO")
    print("=" * 70)
