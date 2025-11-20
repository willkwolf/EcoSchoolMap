#!/usr/bin/env python3
"""
Script de validación completa para todas las variantes generadas.

Valida:
- Existencia de las 32 variantes esperadas
- Estructura JSON válida
- Presencia de metadatos correctos
- Posiciones de nodos dentro del rango válido
- Superposiciones críticas
"""

import json
import sys
from pathlib import Path
from typing import List, Dict
import math


def load_json(file_path: Path) -> dict:
    """Carga archivo JSON."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def validate_json_structure(data: dict, variant_name: str) -> List[str]:
    """Valida estructura básica del JSON."""
    errors = []

    # Verificar campos requeridos
    if 'metadata' not in data:
        errors.append(f"{variant_name}: Falta campo 'metadata'")
    if 'nodos' not in data:
        errors.append(f"{variant_name}: Falta campo 'nodos'")
    else:
        if not isinstance(data['nodos'], list):
            errors.append(f"{variant_name}: 'nodos' debe ser una lista")
        elif len(data['nodos']) != 12:
            errors.append(f"{variant_name}: Se esperan 12 nodos, encontrados {len(data['nodos'])}")

    return errors


def validate_metadata(data: dict, variant_name: str, expected_preset: str, expected_method: str) -> List[str]:
    """Valida metadatos de la variante."""
    errors = []
    metadata = data.get('metadata', {})

    if metadata.get('preset_name') != expected_preset:
        errors.append(f"{variant_name}: preset_name incorrecto (esperado: {expected_preset}, encontrado: {metadata.get('preset_name')})")

    if metadata.get('normalization_method') != expected_method:
        errors.append(f"{variant_name}: normalization_method incorrecto (esperado: {expected_method}, encontrado: {metadata.get('normalization_method')})")

    return errors


def validate_node_positions(data: dict, variant_name: str) -> List[str]:
    """Valida que las posiciones de nodos estén dentro del rango válido."""
    errors = []
    nodos = data.get('nodos', [])

    for nodo in nodos:
        pos = nodo.get('posicion', {})
        x = pos.get('x')
        y = pos.get('y')

        if x is None or y is None:
            errors.append(f"{variant_name}: Nodo '{nodo.get('nombre')}' sin posición")
            continue

        if not isinstance(x, (int, float)) or not isinstance(y, (int, float)):
            errors.append(f"{variant_name}: Nodo '{nodo.get('nombre')}' con posición inválida")
            continue

        if x < -1.0 or x > 1.0:
            errors.append(f"{variant_name}: Nodo '{nodo.get('nombre')}' x fuera de rango [-1, 1]: {x}")

        if y < -1.0 or y > 1.0:
            errors.append(f"{variant_name}: Nodo '{nodo.get('nombre')}' y fuera de rango [-1, 1]: {y}")

    return errors


def check_overlaps(data: dict, variant_name: str, threshold: float = 0.10) -> List[str]:
    """Detecta superposiciones críticas (threshold muy bajo)."""
    warnings = []
    nodos = data.get('nodos', [])

    for i, nodo1 in enumerate(nodos):
        for nodo2 in nodos[i + 1:]:
            pos1 = nodo1.get('posicion', {})
            pos2 = nodo2.get('posicion', {})

            x1, y1 = pos1.get('x', 0), pos1.get('y', 0)
            x2, y2 = pos2.get('x', 0), pos2.get('y', 0)

            distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

            if distance < threshold:
                warnings.append(
                    f"{variant_name}: Superposicion CRITICA entre '{nodo1.get('nombre')}' y '{nodo2.get('nombre')}' (dist: {distance:.4f})"
                )

    return warnings


def validate_all_variants():
    """Valida todas las variantes."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    variants_dir = project_root / 'docs' / 'data' / 'variants'

    # Definir variantes esperadas
    presets = ['base', 'balanced', 'state-emphasis', 'equity-emphasis',
               'market-emphasis', 'growth-emphasis', 'historical-emphasis', 'pragmatic-emphasis']
    methods = ['none', 'percentile', 'zscore', 'minmax']

    expected_variants = []
    for preset in presets:
        for method in methods:
            expected_variants.append((preset, method, f"{preset}-{method}.json"))

    print("=" * 80)
    print("VALIDACION DE VARIANTES")
    print("=" * 80)
    print(f"Directorio: {variants_dir}")
    print(f"Variantes esperadas: {len(expected_variants)}")
    print()

    all_errors = []
    all_warnings = []
    validated = 0
    missing = 0

    for preset, method, filename in expected_variants:
        variant_path = variants_dir / filename
        variant_name = filename[:-5]  # Remove .json

        if not variant_path.exists():
            all_errors.append(f"[!] FALTA: {filename}")
            missing += 1
            continue

        try:
            # Cargar y validar JSON
            data = load_json(variant_path)

            # Validar estructura
            errors = validate_json_structure(data, variant_name)
            all_errors.extend(errors)

            # Validar metadatos
            errors = validate_metadata(data, variant_name, preset, method)
            all_errors.extend(errors)

            # Validar posiciones
            errors = validate_node_positions(data, variant_name)
            all_errors.extend(errors)

            # Detectar overlaps críticos
            warnings = check_overlaps(data, variant_name, threshold=0.10)
            all_warnings.extend(warnings)

            validated += 1
            print(f"[OK] {variant_name}")

        except json.JSONDecodeError as e:
            all_errors.append(f"{variant_name}: Error de JSON - {e}")
        except Exception as e:
            all_errors.append(f"{variant_name}: Error inesperado - {e}")

    # Resumen
    print("\n" + "=" * 80)
    print("RESUMEN DE VALIDACION")
    print("=" * 80)
    print(f"Total esperadas: {len(expected_variants)}")
    print(f"Validadas correctamente: {validated}")
    print(f"Faltantes: {missing}")
    print(f"Errores encontrados: {len(all_errors)}")
    print(f"Advertencias: {len(all_warnings)}")

    if all_errors:
        print("\n[!] ERRORES:")
        for error in all_errors:
            print(f"  * {error}")

    if all_warnings:
        print("\n[!] ADVERTENCIAS (superposiciones criticas < 0.10):")
        for warning in all_warnings:
            print(f"  * {warning}")

    print("=" * 80)

    if all_errors:
        return 1  # Falló
    elif all_warnings:
        print("\n[OK] Validacion completa con advertencias")
        return 0
    else:
        print("\n[OK] Validacion completa - Todo correcto!")
        return 0


if __name__ == '__main__':
    sys.exit(validate_all_variants())
