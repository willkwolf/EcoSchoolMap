"""
legends.py - Utilitario para generar texto de leyendas basado en cuadrantes del JSON
"""

from typing import Dict, Any


def obtener_leyenda_cuadrantes(data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """
    Extrae información de cuadrantes desde el JSON y genera textos descriptivos.
    
    Args:
        data: Datos del JSON cargado

    Returns:
        Diccionario con información de leyenda por cuadrante
    """
    # Si existe mapeo_visual.cuadrantes, usar eso
    try:
        cuadrantes = data['mapeo_visual']['cuadrantes']
    except (KeyError, TypeError):
        # Fallback: construir desde posiciones de nodos
        cuadrantes = _construir_cuadrantes_desde_nodos(data.get('nodos', []))
    
    leyenda = {}
    
    # Para cada cuadrante en el JSON
    for qid, q in cuadrantes.items():
        escuelas = q.get('escuelas', [])
        # Encontrar los nodos correspondientes
        nodos_cuadrante = [
            n for n in data.get('nodos', [])
            if n.get('id') in escuelas
        ]
        
        # Extraer características principales
        caracteristicas = set()
        for n in nodos_cuadrante:
            if 'caracteristicas' in n:
                caracteristicas.update(n['caracteristicas'][:2])  # Tomar 2 primeras
        
        leyenda[qid] = {
            'nombre': q.get('nombre', ''),
            'escuelas': len(escuelas),
            'caracteristicas': list(caracteristicas)[:3],  # Top 3 características
            'nodos': [n.get('nombre', n.get('id')) for n in nodos_cuadrante]
        }
    
    return leyenda


def _construir_cuadrantes_desde_nodos(nodos: list) -> Dict[str, Dict[str, Any]]:
    """
    Construye información de cuadrantes basada en posiciones de nodos.
    
    Args:
        nodos: Lista de nodos del JSON

    Returns:
        Diccionario de cuadrantes con escuelas asignadas por posición
    """
    q1, q2, q3, q4 = [], [], [], []
    
    for nodo in nodos:
        pos = nodo.get('posicion') or {}
        x = pos.get('x', 0)
        y = pos.get('y', 0)
        
        # Asignar a cuadrante
        if x <= 0:  # Izquierda
            if y >= 0:  # Superior
                q1.append(nodo['id'])
            else:  # Inferior
                q3.append(nodo['id'])
        else:  # Derecha
            if y >= 0:  # Superior
                q2.append(nodo['id'])
            else:  # Inferior
                q4.append(nodo['id'])
    
    return {
        'q1': {
            'nombre': 'Estado Fuerte + Equidad',
            'escuelas': q1,
            'color': '#7E1A2F'  # Rojo oscuro
        },
        'q2': {
            'nombre': 'Estado Débil + Equidad',
            'escuelas': q2,
            'color': '#579EA4'  # Azul verdoso
        },
        'q3': {
            'nombre': 'Estado Fuerte + Crecimiento',
            'escuelas': q3,
            'color': '#86AD34'  # Verde oliva
        },
        'q4': {
            'nombre': 'Estado Débil + Crecimiento',
            'escuelas': q4,
            'color': '#DF7713'  # Naranja
        }
    }