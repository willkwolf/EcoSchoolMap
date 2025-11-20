#!/usr/bin/env python3
"""
Script para verificar superposiciones en TODAS las variantes.
"""

import json
import sys
from pathlib import Path
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


def check_variant(variant_path: Path, threshold: float = 0.15):
    """Verifica superposiciones en una variante específica."""
    data = load_json(variant_path)
    nodos = data.get('nodos', [])
    overlaps = []

    # Comparar todos los pares
    for i, nodo1 in enumerate(nodos):
        for nodo2 in nodos[i + 1:]:
            pos1 = nodo1.get('posicion', {})
            pos2 = nodo2.get('posicion', {})

            if not pos1 or not pos2:
                continue

            distance = calculate_distance(pos1, pos2)

            if distance < threshold:
                overlaps.append((nodo1['nombre'], nodo2['nombre'], distance))

    return overlaps


def main():
    """Función principal."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    variants_dir = project_root / 'docs' / 'data' / 'variants'

    if not variants_dir.exists():
        print(f"ERROR: Directorio de variantes no encontrado: {variants_dir}")
        return

    variant_files = list(variants_dir.glob('*.json'))

    if not variant_files:
        print(f"WARNING: No se encontraron archivos JSON en {variants_dir}")
        return

    print(f"Analizando {len(variant_files)} variantes...")
    print("=" * 80)

    threshold = 0.15
    problematic_variants = []

    for variant_file in sorted(variant_files):
        variant_name = variant_file.stem
        overlaps = check_variant(variant_file, threshold)

        if overlaps:
            problematic_variants.append((variant_name, overlaps))
            print(f"\n[!] {variant_name}: {len(overlaps)} superposicion(es)")
            for nombre1, nombre2, dist in overlaps:
                print(f"    * {nombre1} <-> {nombre2} (dist: {dist:.4f})")
        else:
            print(f"[OK] {variant_name}")

    print("\n" + "=" * 80)
    if problematic_variants:
        print(f"\nRESUMEN: {len(problematic_variants)}/{len(variant_files)} variantes con superposiciones")
    else:
        print(f"\n[OK] Todas las variantes sin superposiciones (threshold: {threshold})")


if __name__ == '__main__':
    main()
