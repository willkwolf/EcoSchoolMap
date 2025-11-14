"""
compare_weight_results.py - Comparador Visual de Variantes de Peso

Genera visualizaciones comparativas entre diferentes configuraciones de peso,
mostrando cómo las escuelas se mueven en el espacio 2D según diferentes énfasis.

Versión: 1.0
Fecha: 2025-11-13

Uso:
    python scripts/compare_weight_results.py data/escuelas.json data/variants/state-emphasis.json
    python scripts/compare_weight_results.py --variants data/variants/*.json --output output/comparisons
"""

import json
import os
import sys
import argparse
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch
import numpy as np
from typing import List, Dict, Tuple

from config import (
    KLEIN_SCHEMA, asignar_colores_a_nodos,
    EJE_X_MIN, EJE_X_MAX, EJE_Y_MIN, EJE_Y_MAX,
    FIGURA_WIDTH, FIGURA_HEIGHT, DPI_SALIDA
)


def load_json(file_path: str) -> dict:
    """Carga un archivo JSON."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def extract_positions(data: dict) -> Dict[str, Tuple[float, float]]:
    """
    Extrae las posiciones de los nodos de un JSON.

    Args:
        data: Datos del JSON

    Returns:
        Dict {school_id: (x, y)}
    """
    positions = {}
    for nodo in data.get('nodos', []):
        school_id = nodo['id']
        pos = nodo.get('posicion', {})

        if isinstance(pos, dict):
            x = pos.get('x', 0)
            y = pos.get('y', 0)
        else:
            x = nodo.get('x', 0)
            y = nodo.get('y', 0)

        positions[school_id] = (x, y)

    return positions


def get_metadata(data: dict) -> dict:
    """Extrae metadata del JSON."""
    metadata = data.get('metadata', {})
    return {
        'variant_name': metadata.get('variant_name', 'unknown'),
        'preset_name': metadata.get('preset_name', 'unknown'),
        'normalization_method': metadata.get('normalization_method', 'unknown')
    }


def compare_two_variants(file1: str, file2: str, output_path: str):
    """
    Compara dos variantes visualmente mostrando vectores de movimiento.

    Args:
        file1: Primer archivo JSON
        file2: Segundo archivo JSON
        output_path: Ruta para guardar la visualización
    """
    # Cargar datos
    print(f"\n📊 Comparando:")
    print(f"  Base: {os.path.basename(file1)}")
    print(f"  vs.  : {os.path.basename(file2)}")

    data1 = load_json(file1)
    data2 = load_json(file2)

    positions1 = extract_positions(data1)
    positions2 = extract_positions(data2)

    metadata1 = get_metadata(data1)
    metadata2 = get_metadata(data2)

    # Crear mapeo de colores
    all_ids = list(positions1.keys())
    colores_mapeo = asignar_colores_a_nodos(all_ids)

    # Obtener nombres
    nombres = {n['id']: n.get('nombre', n['id']) for n in data1.get('nodos', [])}

    # Crear figura
    fig, ax = plt.subplots(figsize=(FIGURA_WIDTH * 0.8, FIGURA_HEIGHT * 0.8), dpi=DPI_SALIDA)
    ax.set_facecolor('#f8f9fa')

    # Título
    title = f"Comparación: {metadata1['variant_name']} → {metadata2['variant_name']}"
    ax.set_title(title, fontsize=16, fontweight='bold', pad=20)

    # Ejes
    ax.set_xlim(EJE_X_MIN, EJE_X_MAX)
    ax.set_ylim(EJE_Y_MIN, EJE_Y_MAX)
    ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.6)
    ax.axvline(x=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.6)
    ax.grid(True, linestyle=':', alpha=0.3)

    # Estadísticas
    total_distance = 0
    max_distance = 0
    max_mover = None

    # Dibujar vectores de movimiento
    for school_id in sorted(positions1.keys()):
        if school_id not in positions2:
            continue

        x1, y1 = positions1[school_id]
        x2, y2 = positions2[school_id]

        # Calcular distancia
        distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        total_distance += distance

        if distance > max_distance:
            max_distance = distance
            max_mover = school_id

        color = colores_mapeo.get(school_id, '#888888')

        # Posición inicial (punto más pequeño)
        ax.scatter(x1, y1, s=80, c=color, alpha=0.3, edgecolors='gray', linewidths=0.5, zorder=2)

        # Posición final (punto más grande)
        ax.scatter(x2, y2, s=200, c=color, alpha=0.9, edgecolors='black', linewidths=2, zorder=4)

        # Vector de movimiento (flecha)
        if distance > 0.01:  # Solo dibujar si hay movimiento significativo
            arrow = FancyArrowPatch(
                (x1, y1), (x2, y2),
                arrowstyle='->', mutation_scale=20,
                color=color, linewidth=1.5, alpha=0.6, zorder=3
            )
            ax.add_patch(arrow)

        # Etiqueta
        nombre = nombres.get(school_id, school_id)
        ax.text(x2, y2, f" {nombre}", fontsize=7, ha='left', va='center',
               fontweight='bold', zorder=5,
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white',
                        edgecolor='none', alpha=0.7))

    # Leyenda
    legend_elements = [
        mpatches.Patch(facecolor='lightgray', edgecolor='gray', alpha=0.3,
                      label=f'Posición inicial ({metadata1["variant_name"]})'),
        mpatches.Patch(facecolor='darkgray', edgecolor='black',
                      label=f'Posición final ({metadata2["variant_name"]})'),
        mpatches.FancyArrow(0, 0, 0.1, 0.1, width=0.01, color='gray', alpha=0.6,
                           label='Vector de movimiento')
    ]
    ax.legend(handles=legend_elements, loc='upper right', fontsize=9)

    # Estadísticas en el gráfico
    avg_distance = total_distance / len(positions1) if positions1 else 0
    stats_text = f"Distancia promedio: {avg_distance:.3f}\n"
    stats_text += f"Máximo movimiento: {nombres.get(max_mover, max_mover)} ({max_distance:.3f})"

    ax.text(0.02, 0.98, stats_text, transform=ax.transAxes,
           fontsize=9, verticalalignment='top',
           bbox=dict(boxstyle='round,pad=0.5', facecolor='white',
                    edgecolor='gray', alpha=0.9))

    plt.tight_layout()

    # Guardar
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    fig.savefig(output_path, dpi=DPI_SALIDA, bbox_inches='tight')
    plt.close(fig)

    print(f"✓ Comparación guardada: {output_path}")
    print(f"  Distancia promedio: {avg_distance:.3f}")
    print(f"  Máximo movimiento: {nombres.get(max_mover, max_mover)} ({max_distance:.3f})")


def compare_matrix(variant_files: List[str], output_dir: str):
    """
    Crea una matriz de comparaciones entre todas las variantes.

    Args:
        variant_files: Lista de archivos JSON a comparar
        output_dir: Directorio de salida
    """
    print("\n" + "=" * 80)
    print("MATRIZ DE COMPARACIONES")
    print("=" * 80)

    os.makedirs(output_dir, exist_ok=True)

    # Cargar todas las variantes
    variants = {}
    for vfile in variant_files:
        data = load_json(vfile)
        metadata = get_metadata(data)
        variant_name = metadata['variant_name']
        variants[variant_name] = {
            'file': vfile,
            'data': data,
            'positions': extract_positions(data),
            'metadata': metadata
        }

    variant_names = sorted(variants.keys())

    # Calcular matriz de distancias
    n = len(variant_names)
    distance_matrix = np.zeros((n, n))

    for i, name1 in enumerate(variant_names):
        for j, name2 in enumerate(variant_names):
            if i == j:
                continue

            pos1 = variants[name1]['positions']
            pos2 = variants[name2]['positions']

            # Calcular distancia promedio
            total_dist = 0
            count = 0
            for school_id in pos1.keys():
                if school_id in pos2:
                    x1, y1 = pos1[school_id]
                    x2, y2 = pos2[school_id]
                    dist = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
                    total_dist += dist
                    count += 1

            distance_matrix[i, j] = total_dist / count if count > 0 else 0

    # Crear visualización de matriz
    fig, ax = plt.subplots(figsize=(12, 10), dpi=150)

    im = ax.imshow(distance_matrix, cmap='YlOrRd', aspect='auto')

    # Etiquetas
    ax.set_xticks(np.arange(n))
    ax.set_yticks(np.arange(n))
    ax.set_xticklabels(variant_names, rotation=45, ha='right')
    ax.set_yticklabels(variant_names)

    # Valores en celdas
    for i in range(n):
        for j in range(n):
            text = ax.text(j, i, f'{distance_matrix[i, j]:.3f}',
                          ha="center", va="center", color="black", fontsize=8)

    ax.set_title("Matriz de Distancias entre Variantes\n(Distancia promedio de movimiento de escuelas)",
                fontsize=14, fontweight='bold', pad=20)

    fig.colorbar(im, ax=ax, label='Distancia Promedio')
    plt.tight_layout()

    matrix_path = os.path.join(output_dir, 'distance_matrix.png')
    fig.savefig(matrix_path, dpi=150, bbox_inches='tight')
    plt.close(fig)

    print(f"✓ Matriz de distancias guardada: {matrix_path}")


    # Mostrar tabla en consola
    print("\nTABLA DE DISTANCIAS PROMEDIO:")
    print("-" * 80)
    header = f"{'Variante':<25}" + "".join([f"{name[:8]:>10}" for name in variant_names])
    print(header)
    print("-" * 80)

    for i, name1 in enumerate(variant_names):
        row = f"{name1:<25}"
        for j in range(n):
            if i == j:
                row += f"{'---':>10}"
            else:
                row += f"{distance_matrix[i, j]:>10.3f}"
        print(row)

    print("=" * 80)


def main():
    """Función principal con CLI."""
    parser = argparse.ArgumentParser(
        description='Compara visualmente diferentes variantes de peso',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  # Comparar dos variantes específicas
  python scripts/compare_weight_results.py data/escuelas.json data/variants/state-emphasis.json

  # Generar matriz de comparación entre todas las variantes
  python scripts/compare_weight_results.py --matrix data/variants/*.json --output output/comparisons

  # Comparar variante base con todas las demás
  python scripts/compare_weight_results.py data/escuelas.json data/variants/*.json --output-dir output/comparisons
        """
    )

    parser.add_argument('files', nargs='*',
                       help='Archivos JSON a comparar')

    parser.add_argument('--matrix',
                       nargs='+',
                       help='Generar matriz de comparación entre múltiples variantes')

    parser.add_argument('--output', '-o',
                       help='Archivo de salida para comparación de dos variantes')

    parser.add_argument('--output-dir',
                       default='output/comparisons',
                       help='Directorio de salida para múltiples comparaciones')

    args = parser.parse_args()

    print("\n📊 Comparador de Variantes de Peso - v1.0")
    print("=" * 80)

    # Modo matriz
    if args.matrix:
        if len(args.matrix) < 2:
            print("❌ Error: Se necesitan al menos 2 variantes para la matriz")
            return 1

        compare_matrix(args.matrix, args.output_dir)
        print("\n✨ Matriz de comparación generada exitosamente")
        return 0

    # Modo comparación de dos variantes
    if len(args.files) == 2:
        file1, file2 = args.files
        basename1 = os.path.splitext(os.path.basename(file1))[0]
        basename2 = os.path.splitext(os.path.basename(file2))[0]

        output_path = args.output if args.output else os.path.join(
            args.output_dir, f"compare_{basename1}_vs_{basename2}.png"
        )

        compare_two_variants(file1, file2, output_path)
        print("\n✨ Comparación generada exitosamente")
        return 0

    # Modo comparación base vs múltiples
    elif len(args.files) > 2:
        base_file = args.files[0]
        os.makedirs(args.output_dir, exist_ok=True)

        print(f"\nComparando {os.path.basename(base_file)} con {len(args.files) - 1} variantes")

        for variant_file in args.files[1:]:
            basename_base = os.path.splitext(os.path.basename(base_file))[0]
            basename_variant = os.path.splitext(os.path.basename(variant_file))[0]

            output_path = os.path.join(
                args.output_dir, f"compare_{basename_base}_vs_{basename_variant}.png"
            )

            try:
                compare_two_variants(base_file, variant_file, output_path)
            except Exception as e:
                print(f"❌ Error comparando {basename_variant}: {e}")

        print("\n✨ Todas las comparaciones generadas exitosamente")
        return 0

    else:
        parser.print_help()
        print("\n❌ Error: Proporciona al menos 2 archivos para comparar")
        return 1


if __name__ == '__main__':
    sys.exit(main())
