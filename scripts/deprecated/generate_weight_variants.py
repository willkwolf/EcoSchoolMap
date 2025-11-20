"""
generate_weight_variants.py - Generador de Variantes de Peso

Genera múltiples archivos JSON con diferentes configuraciones de pesos,
preservando el archivo original escuelas.json intacto.

Este script crea variantes para cada uno de los 8 presets de pesos definidos
en scoring_methodology.py, permitiendo comparar cómo diferentes énfasis
(estado, equidad, mercado, etc.) afectan las posiciones de las escuelas.

Versión: 1.0
Fecha: 2025-11-13

Uso:
    python scripts/generate_weight_variants.py
    python scripts/generate_weight_variants.py --output-dir data/variants
    python scripts/generate_weight_variants.py --presets base state-emphasis equity-emphasis
"""

import json
import os
import sys
import argparse
from datetime import datetime
from typing import List

# Importar módulos necesarios
from scoring_methodology import (
    SchoolScorer, get_available_presets,
    get_weight_preset, WEIGHT_PRESETS
)
from config import RUTA_DATOS, NORMALIZATION_METHOD


def load_json(file_path: str) -> dict:
    """Carga un archivo JSON."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(file_path: str, data: dict):
    """Guarda un archivo JSON con formato bonito."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_metadata(data: dict, variant_name: str, preset_name: str,
                normalization_method: str) -> dict:
    """Agrega metadata al JSON sobre la configuración usada."""
    if 'metadata' not in data:
        data['metadata'] = {}

    data['metadata'].update({
        'variant_name': variant_name,
        'preset_name': preset_name,
        'normalization_method': normalization_method,
        'generated_at': datetime.now().isoformat(),
        'generator_version': '1.0',
        'generator_script': 'generate_weight_variants.py'
    })

    return data


def generate_variant(source_data: dict, preset_name: str,
                    normalization_method: str) -> dict:
    """
    Genera una variante de datos con un preset de pesos específico.

    Args:
        source_data: Datos originales del JSON
        preset_name: Nombre del preset a usar
        normalization_method: Método de normalización

    Returns:
        Diccionario con datos actualizados
    """
    # Crear copia profunda de los datos
    import copy
    data = copy.deepcopy(source_data)

    # Obtener preset de pesos
    weights = get_weight_preset(preset_name)

    # Crear scorer con los pesos del preset
    scorer = SchoolScorer(
        normalization_method=normalization_method,
        weights_x=weights['x'],
        weights_y=weights['y']
    )

    # Preparar descriptores para batch calculation
    schools_descriptors = {}
    for nodo in data.get('nodos', []):
        descriptors = nodo.get('descriptores', {})
        if descriptors:
            schools_descriptors[nodo['id']] = descriptors

    # Calcular nuevas posiciones
    new_positions = scorer.batch_calculate_positions(schools_descriptors)

    # Actualizar posiciones en los nodos
    for nodo in data['nodos']:
        school_id = nodo['id']
        if school_id in new_positions:
            x_nueva, y_nueva = new_positions[school_id]

            if isinstance(nodo.get('posicion'), dict):
                nodo['posicion']['x'] = x_nueva
                nodo['posicion']['y'] = y_nueva
            else:
                nodo['x'] = x_nueva
                nodo['y'] = y_nueva

    # Agregar metadata
    data = add_metadata(data, preset_name, preset_name, normalization_method)

    # Update weights_preset in metadata to reflect the actual preset used
    if 'metadata' in data:
        data['metadata']['weights_preset'] = preset_name

    return data


def generate_all_variants(source_file: str, output_dir: str,
                         presets: List[str],
                         normalization_methods: List[str]) -> dict:
    """
    Genera todas las variantes especificadas.

    Args:
        source_file: Archivo JSON fuente
        output_dir: Directorio de salida
        presets: Lista de nombres de presets a generar
        normalization_methods: Lista de métodos de normalización a usar

    Returns:
        Dict con estadísticas de generación
    """
    # Cargar datos fuente
    print(f"Cargando datos desde: {source_file}")
    source_data = load_json(source_file)
    num_schools = len(source_data.get('nodos', []))
    print(f"[OK] Cargadas {num_schools} escuelas\n")

    # Crear directorio de salida si no existe
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"[OK] Directorio creado: {output_dir}\n")

    # Generar cada variante
    total_combinations = len(presets) * len(normalization_methods)
    stats = {
        'generated': [],
        'failed': [],
        'total': total_combinations
    }

    print("=" * 80)
    print("GENERANDO VARIANTES DE PESO")
    print("=" * 80)
    print(f"Presets: {len(presets)} | Metodos: {len(normalization_methods)} | Total: {total_combinations}")
    print()

    for preset_name in presets:
        for norm_method in normalization_methods:
            try:
                variant_id = f"{preset_name}-{norm_method}"
                print(f"Generando: {variant_id}")

                # Generar variante
                variant_data = generate_variant(source_data, preset_name, norm_method)

                # Guardar en archivo
                output_file = os.path.join(output_dir, f"{variant_id}.json")
                save_json(output_file, variant_data)

                print(f"  [OK] Guardado: {output_file}")
                stats['generated'].append(variant_id)

            except Exception as e:
                print(f"  [ERROR] Fallo al generar {variant_id}: {e}")
                stats['failed'].append(variant_id)
                import traceback
                traceback.print_exc()

    # Resumen
    print("\n" + "=" * 80)
    print("RESUMEN DE GENERACION")
    print("=" * 80)
    print(f"[OK] Variantes generadas: {len(stats['generated'])}/{stats['total']}")

    if stats['generated']:
        print("\nVariantes generadas:")
        total_size = 0
        for name in stats['generated']:
            output_file = os.path.join(output_dir, f"{name}.json")
            size_kb = os.path.getsize(output_file) / 1024
            total_size += size_kb
            print(f"  * {name:<35} ({size_kb:.1f} KB)")
        print(f"\nTamano total: {total_size:.1f} KB ({total_size/1024:.2f} MB)")

    if stats['failed']:
        print(f"\n[!] Variantes fallidas: {len(stats['failed'])}")
        for name in stats['failed']:
            print(f"  * {name}")

    print("=" * 80)

    return stats


def main():
    """Función principal con CLI."""
    parser = argparse.ArgumentParser(
        description='Genera variantes de peso para el mapa de escuelas económicas',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  # Generar todas las variantes
  python scripts/generate_weight_variants.py

  # Generar solo algunas variantes
  python scripts/generate_weight_variants.py --presets base state-emphasis equity-emphasis

  # Especificar directorio de salida
  python scripts/generate_weight_variants.py --output-dir output/variants

  # Usar método de normalización específico
  python scripts/generate_weight_variants.py --method zscore
        """
    )

    parser.add_argument('--data', '-d',
                       default=RUTA_DATOS,
                       help=f'Ruta al archivo JSON fuente (default: {RUTA_DATOS})')

    parser.add_argument('--output-dir', '-o',
                       default='data/variants',
                       help='Directorio para guardar variantes (default: data/variants)')

    parser.add_argument('--presets', '-p',
                       nargs='+',
                       choices=get_available_presets(),
                       help='Presets específicos a generar (default: todos)')

    parser.add_argument('--method', '-m',
                       choices=['none', 'percentile', 'zscore', 'minmax'],
                       default=NORMALIZATION_METHOD,
                       help=f'Método de normalización (default: {NORMALIZATION_METHOD})')

    parser.add_argument('--all-normalizations',
                       action='store_true',
                       help='Generar variantes con TODOS los métodos de normalización (32 archivos)')

    parser.add_argument('--list-presets',
                       action='store_true',
                       help='Listar presets disponibles y salir')

    args = parser.parse_args()

    # Si se pide listar presets
    if args.list_presets:
        print("\n📋 PRESETS DISPONIBLES:")
        print("=" * 70)
        for preset_name in get_available_presets():
            weights = WEIGHT_PRESETS[preset_name]
            print(f"\n{preset_name}:")
            print(f"  Pesos X: {weights['x']}")
            print(f"  Pesos Y: {weights['y']}")
        return 0

    # Banner
    print("\nGenerador de Variantes de Peso - v1.0")
    print("=" * 80)

    # Verificar archivo fuente
    if not os.path.exists(args.data):
        print(f"[ERROR] No se encontro el archivo fuente {args.data}")
        return 1

    # Determinar qué presets generar
    presets_to_generate = args.presets if args.presets else get_available_presets()

    # Determinar qué métodos de normalización usar
    if args.all_normalizations:
        normalization_methods = ['none', 'percentile', 'zscore', 'minmax']
    else:
        normalization_methods = [args.method]

    total_variants = len(presets_to_generate) * len(normalization_methods)

    print(f"\nConfiguracion:")
    print(f"  * Archivo fuente: {args.data}")
    print(f"  * Directorio salida: {args.output_dir}")
    print(f"  * Metodos normalizacion: {normalization_methods}")
    print(f"  * Presets a generar: {len(presets_to_generate)}")
    print(f"  * Total variantes: {total_variants}")
    print()

    # Generar variantes
    try:
        stats = generate_all_variants(
            args.data,
            args.output_dir,
            presets_to_generate,
            normalization_methods
        )

        if stats['failed']:
            print("\n[!] Algunas variantes fallaron")
            return 1
        else:
            print("\n[OK] Todas las variantes generadas exitosamente")
            return 0

    except Exception as e:
        print(f"\n[ERROR] Error fatal: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
