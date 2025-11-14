#!/usr/bin/env python3
"""
Script para detectar superposiciones de nodos en el mapa de escuelas políticas.

Analiza el archivo escuelas.json y detecta nodos cuyas posiciones están
demasiado cerca, lo que puede causar superposición visual de labels.
"""

import json
import sys
from pathlib import Path
from typing import List, Tuple, Dict
import math


def load_json(file_path: Path) -> dict:
    """Carga archivo JSON."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def calculate_distance(pos1: dict, pos2: dict) -> float:
    """Calcula distancia euclidiana entre dos posiciones."""
    x1, y1 = pos1['x'], pos1['y']
    x2, y2 = pos2['x'], pos2['y']
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)


def detect_overlaps(
    json_path: Path,
    threshold: float = 0.15
) -> List[Tuple[dict, dict, float]]:
    """
    Detecta pares de nodos con posiciones superpuestas.

    Args:
        json_path: Ruta al archivo JSON
        threshold: Distancia mínima para considerar superposición

    Returns:
        Lista de tuplas (nodo1, nodo2, distancia)
    """
    data = load_json(json_path)
    nodos = data.get('nodos', [])
    overlaps = []

    # Comparar todos los pares de nodos
    for i, nodo1 in enumerate(nodos):
        for nodo2 in nodos[i + 1:]:
            pos1 = nodo1.get('posicion', {})
            pos2 = nodo2.get('posicion', {})

            if not pos1 or not pos2:
                continue

            distance = calculate_distance(pos1, pos2)

            if distance < threshold:
                overlaps.append((nodo1, nodo2, distance))

    return overlaps


def analyze_descriptors(nodo1: dict, nodo2: dict) -> Dict[str, Tuple[str, str]]:
    """
    Compara descriptores de dos nodos y retorna diferencias.

    Returns:
        Dict con descriptores que difieren: {descriptor: (valor1, valor2)}
    """
    desc1 = nodo1.get('descriptores', {})
    desc2 = nodo2.get('descriptores', {})

    differences = {}
    all_keys = set(desc1.keys()) | set(desc2.keys())

    for key in all_keys:
        val1 = desc1.get(key, 'N/A')
        val2 = desc2.get(key, 'N/A')
        if val1 != val2:
            differences[key] = (val1, val2)

    return differences


def suggest_descriptor_changes(nodo1: dict, nodo2: dict) -> List[str]:
    """
    Sugiere cambios en descriptores para separar nodos superpuestos.

    Returns:
        Lista de sugerencias en texto
    """
    suggestions = []
    desc1 = nodo1.get('descriptores', {})
    desc2 = nodo2.get('descriptores', {})

    # Descriptores que más afectan la posición
    critical_descriptors = [
        'concepcion_economia',
        'concepcion_humano',
        'politicas_preferidas',
        'motor_cambio'
    ]

    for desc in critical_descriptors:
        if desc1.get(desc) == desc2.get(desc):
            suggestions.append(
                f"  * Considerar cambiar '{desc}' en {nodo1['nombre']} o {nodo2['nombre']}"
            )

    return suggestions


def print_report(overlaps: List[Tuple[dict, dict, float]], threshold: float):
    """Imprime reporte detallado de superposiciones."""
    if not overlaps:
        print(f"[OK] No se detectaron superposiciones (threshold: {threshold})")
        return

    print(f"\n{'=' * 80}")
    print(f"REPORTE DE SUPERPOSICIONES (threshold: {threshold})")
    print(f"{'=' * 80}\n")
    print(f"Se encontraron {len(overlaps)} pares de nodos superpuestos:\n")

    for i, (nodo1, nodo2, distance) in enumerate(overlaps, 1):
        print(f"{i}. {nodo1['nombre']} <-> {nodo2['nombre']}")
        print(f"   Distancia: {distance:.4f}")
        print(f"   Posiciones:")
        print(f"     * {nodo1['nombre']}: ({nodo1['posicion']['x']:.2f}, {nodo1['posicion']['y']:.2f})")
        print(f"     * {nodo2['nombre']}: ({nodo2['posicion']['x']:.2f}, {nodo2['posicion']['y']:.2f})")

        # Analizar descriptores
        differences = analyze_descriptors(nodo1, nodo2)
        same_count = 6 - len(differences)  # Asumiendo 6 descriptores totales

        print(f"   Descriptores: {same_count}/6 identicos")

        if differences:
            print(f"   Diferencias:")
            for desc, (val1, val2) in differences.items():
                print(f"     * {desc}: {val1} vs {val2}")
        else:
            print(f"   [!] CRITICO: Descriptores 100% identicos")

        # Sugerencias
        suggestions = suggest_descriptor_changes(nodo1, nodo2)
        if suggestions:
            print(f"   Sugerencias:")
            for suggestion in suggestions:
                print(suggestion)

        print()

    print(f"{'=' * 80}\n")


def main():
    """Función principal."""
    # Detectar directorio raíz del proyecto
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    # Rutas a analizar
    paths_to_check = [
        project_root / 'data' / 'escuelas.json',
        project_root / 'docs' / 'data' / 'escuelas.json'
    ]

    threshold = 0.15  # Distancia mínima para detectar overlap

    for json_path in paths_to_check:
        if not json_path.exists():
            print(f"WARNING: Archivo no encontrado: {json_path}")
            continue

        print(f"\nAnalizando: {json_path.relative_to(project_root)}")
        print("-" * 80)

        overlaps = detect_overlaps(json_path, threshold)
        print_report(overlaps, threshold)


if __name__ == '__main__':
    main()
