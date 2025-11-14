"""
config.py - Configuración de UI/UX para visualizaciones
Versión 4.0: Esquema único de colores, sin acoplamiento a categorías

Responsable: Information Architects / Diseñadores de Interacción

Las posiciones vienen del JSON (decisión de Data Science)
Los colores se asignan secuencialmente sin repetición
Este archivo solo controla VISUALS (colores, tamaños, estilos)
"""

# ============================================================
# PALETA DE COLORES ÚNICA (Klein Schema)
# Fuente: https://python-graph-gallery.com/color-palette-finder/?palette=klein
# 11 colores disponibles para 11 nodos + 1 paleta flexible
# ============================================================
KLEIN_SCHEMA = [
    "#FF4D6F",  # 0 - Rojo brillante
    "#579EA4",  # 1 - Azul-verde
    "#DF7713",  # 2 - Naranja tostado
    "#F9C000",  # 3 - Amarillo dorado
    "#86AD34",  # 4 - Verde oliva
    "#5D7298",  # 5 - Azul pizarra
    "#81B28D",  # 6 - Verde salvia
    "#7E1A2F",  # 7 - Rojo vino
    "#2D2651",  # 8 - Púrpura oscuro
    "#C8350D",  # 9 - Rojo naranja
    "#BD777A",  # 10 - Rosa polvorienta
]

# ============================================================
# DIMENSIONES DE FIGURA
# ============================================================
FIGURA_WIDTH = 30  # Aumentado para acomodar leyenda pedagógica vertical
FIGURA_HEIGHT = 15.5  # Incrementado para mejor proporción con nodos más grandes
DPI_SALIDA = 300
FONT_FAMILY = 'sans-serif'

# ============================================================
# ASIGNACIÓN DE COLORES A NODOS
# Se asignan secuencialmente sin repetición
# Esta es una FUNCIÓN que genera el mapeo dinámicamente
# ============================================================
def asignar_colores_a_nodos(nodos_lista):
    """
    Asigna colores de KLEIN_SCHEMA a nodos secuencialmente.
    
    Args:
        nodos_lista: lista de IDs de nodos en orden de aparición
    
    Returns:
        dict: {nodo_id: color_hex}
    """
    mapeo = {}
    for idx, nodo_id in enumerate(nodos_lista):
        color_idx = idx % len(KLEIN_SCHEMA)  # Recicla si hay más nodos que colores
        mapeo[nodo_id] = KLEIN_SCHEMA[color_idx]
    return mapeo

# ============================================================
# COLORES PARA TIPOS Y CATEGORÍAS (SOLO REFERENCIA VISUAL)
# Gris para indicar geometría, no diferenciación semántica
# ============================================================
TIPO_NODO_A_ESTILO = {
    'tradicional': {
        'marcador': 'o',
        'tamaño': 320,
        'borde_ancho': 2.5,
        'borde_color': '#7f8c8d',      # Gris para indicar círculo
        'opacidad': 0.85
    },
    'nuevo_paradigma': {
        'marcador': 'D',
        'tamaño': 400,
        'borde_ancho': 3.5,
        'borde_color': '#34495e',      # Gris más oscuro para indicar diamante
        'opacidad': 0.90
    },
    'tradicion': {
        'marcador': 's',
        'tamaño': 340,
        'borde_ancho': 3,
        'borde_color': '#95a5a6',      # Gris para indicar cuadrado
        'opacidad': 0.8
    }
}

# ============================================================
# MAPEO: Confianza de Transición → Estilo
# ============================================================
CONFIANZA_A_ESTILO = {
    'muy_alta': {
        'ancho_linea': 3.5,
        'opacidad': 0.9,
        'estilo_linea': 'solid',
        'alpha_label': 0.85
    },
    'alta': {
        'ancho_linea': 2.8,
        'opacidad': 0.75,
        'estilo_linea': 'solid',
        'alpha_label': 0.75
    },
    'media': {
        'ancho_linea': 2.0,
        'opacidad': 0.6,
        'estilo_linea': 'dashed',
        'alpha_label': 0.65
    },
    'baja': {
        'ancho_linea': 1.5,
        'opacidad': 0.4,
        'estilo_linea': 'dotted',
        'alpha_label': 0.5
    }
}

# ============================================================
# COLORES DE FONDO (Cuadrantes)
# ============================================================
CUADRANTE_COLORES = {
    'superior_izquierda':  ('#7E1A2F', 0.15),  # Rojo oscuro para Estado Fuerte + Equidad
    'superior_derecha':    ('#579EA4', 0.15),  # Azul verdoso para Estado Débil + Equidad
    'inferior_izquierda':  ('#86AD34', 0.15),  # Verde oliva para Estado Fuerte + Crecimiento
    'inferior_derecha':    ('#DF7713', 0.15),  # Naranja para Estado Débil + Crecimiento
}

# ============================================================
# MAPEO DE CUADRANTES (agrupa escuelas por cuadrante y etiqueta)
# El usuario puede personalizar los identificadores de escuela
# ============================================================
CUADRANTES = {
    "q1": {
        "nombre": "Estado Fuerte + Equidad",
        "descripcion": "Intervención estatal radical para equidad",
        "escuelas": ["marxista", "feminista", "ecologica"],
        "color": "#7E1A2F",
        "caracteristicas": ["Redistribución radical", "Crítica del capitalismo", "Equidad social"]
    },
    "q2": {
        "nombre": "Estado Fuerte + Crecimiento",
        "descripcion": "Control estatal para desarrollo económico",
        "escuelas": ["keynesiana", "institucionalista", "estado_emprendedor", "tradicion_desarrollista"],
        "color": "#579EA4",
        "caracteristicas": ["Intervención estatal", "Gestión económica", "Desarrollo industrial"]
    },
    "q3": {
        "nombre": "Estado Débil + Equidad",
        "descripcion": "Incentivos y diseño conductual",
        "escuelas": ["conductista"],
        "color": "#86AD34",
        "caracteristicas": ["Nudges conductuales", "Equidad vía diseño", "Mínima intervención"]
    },
    "q4": {
        "nombre": "Estado Débil + Crecimiento",
        "descripcion": "Mercado libre y crecimiento espontáneo",
        "escuelas": ["clasica", "neoclasica", "austriaca", "schumpeteriana"],
        "color": "#DF7713",
        "caracteristicas": ["Libre mercado", "Mínima intervención", "Innovación privada"]
    }
}

# ============================================================
# ETIQUETAS DE EJES
# ============================================================
EJE_X_LABEL = 'Arquitectura Económica: ← Economía Dirigida (Estado Fuerte) | Economía de Mercado (Estado Limitado) →'
EJE_Y_LABEL = 'Objetivo Socioeconómico: ← Productividad y Crecimiento | Equidad y Sostenibilidad →'
TITULO_PRINCIPAL = 'Escuelas Políticas Económicas: Espacio Posicional 2D'

# ============================================================
# ESTILOS DE TEXTO
# ============================================================
TAMAÑO_TITULO = 18
TAMAÑO_ETIQUETA_EJE = 13
TAMAÑO_NOMBRE_NODO = 11.5
TAMAÑO_LABEL_TRANSICION = 8.0
PESO_TEXTO_NODO = 'bold'
PESO_ETIQUETA_TRANSICION = 'bold'

# ============================================================
# RUTAS (relativas a raíz del proyecto)
# ============================================================
RUTA_DATOS = 'data/escuelas.json'
RUTA_SALIDA_PNG = 'output/mapa_escuelas.png'
RUTA_SALIDA_HTML = 'docs/mapa_escuelas.html'

# ============================================================
# PARÁMETROS DE TRANSICIÓN
# ============================================================
TRANSICION_COLOR = '#2c3e50'          # Gris oscuro neutro
TRANSICION_CURVATURA = 0.3
TRANSICION_MUTATION_SCALE = 25
POSICION_LABEL_OFFSET = 0.15

# ============================================================
# AJUSTES DE LEYENDA
# ============================================================
POSICION_LEYENDA = 'center left'
LEYENDA_BBOX_ANCHOR = (1.02, 0.5)
LEYENDA_FONTSIZE = 11
MOSTRAR_LEYENDA = True

# ============================================================
# RANGO DE EJES (fijo para reproducibilidad)
# ============================================================
EJE_X_MIN = -1.2
EJE_X_MAX = 1.2
EJE_Y_MIN = -1.1
EJE_Y_MAX = 1.1

# ============================================================
# CONFIGURACIÓN DE SCORING METHODOLOGY (v5.0)
# ============================================================
# Método de normalización para cálculo de posiciones
# Opciones: 'none', 'percentile', 'zscore', 'minmax'
NORMALIZATION_METHOD = 'percentile'

# Rango de valores para posiciones (evita puntos en los bordes)
POSITION_MIN = -0.99
POSITION_MAX = 0.99

# Zona de ambigüedad para posiciones intermedias
AMBIGUITY_ZONE_MIN = -0.34
AMBIGUITY_ZONE_MAX = 0.34

# ============================================================
# CONFIGURACIÓN DE ETIQUETAS DE TRANSICIONES
# ============================================================
MOSTRAR_LABELS_TRANSICIONES = True
TAMAÑO_FONT_LABEL_TRANSICION = 9.5
OFFSET_LABEL_TRANSICION_Y = 0.03  # Offset vertical desde el punto medio
LABEL_TRANSICION_BGCOLOR = 'white'
LABEL_TRANSICION_ALPHA = 0.85

# Ajustes manuales para evitar superposiciones de etiquetas de transiciones
# Formato: {transition_id: (offset_x, offset_y)}
LABEL_OVERLAP_ADJUSTMENTS = {
    'crisis_2008': (0, -0.08),        # Desplazar hacia abajo (evita inflacion_2022)
    'inflacion_2022': (0, 0.08),      # Desplazar hacia arriba (evita crisis_2008)
    'crisis_desigualdad': (0.05, 0),  # Desplazar hacia derecha
    'pandemia_covid': (-0.05, 0),     # Desplazar hacia izquierda
    'crisis_climatica': (0, 0)        # Sin ajuste necesario (vertical, aislada)
}

# ============================================================
# CONFIGURACIÓN DE LEYENDA PEDAGÓGICA
# ============================================================
LEYENDA_FONTSIZE = 11.5  # Incrementado para mejor legibilidad
LEYENDA_LINEHEIGHT = 1.7  # Aumentado para mejor espaciado
LEYENDA_PADDING = 1.4  # Aumentado para más relleno interno
LEYENDA_POSICION_X = 1.03  # Posición horizontal relativa
LEYENDA_POSICION_Y = 0.65  # Posición vertical (más arriba)
LEYENDA_BGCOLOR = '#f8f9fa'
LEYENDA_EDGECOLOR = '#2c3e50'
LEYENDA_EDGEWIDTH = 2
LEYENDA_ALPHA = 0.95

# ============================================================
# VALIDACIÓN
# ============================================================
print(f"[OK] config.py cargado exitosamente")
print(f"[OK] Paleta Klein con {len(KLEIN_SCHEMA)} colores disponibles")
print(f"[OK] Configuracion de scoring: {NORMALIZATION_METHOD}")
print(f"[OK] Leyenda pedagógica: font={LEYENDA_FONTSIZE}pt, labels_transiciones={MOSTRAR_LABELS_TRANSICIONES}")