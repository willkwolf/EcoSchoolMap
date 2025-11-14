"""
recalculate_positions.py - Utilidad para Recalcular Posiciones

Recalcula las posiciones de todas las escuelas económicas usando la metodología
de scoring basada en descriptores. Actualiza el archivo JSON con las nuevas posiciones.

IMPORTANTE: Este script modifica el archivo escuelas.json. Se recomienda hacer
un backup antes de ejecutar.

Versión: 6.0
Fecha: 2025-11-13

Uso:
    python scripts/recalculate_positions.py
    python scripts/recalculate_positions.py --dry-run
    python scripts/recalculate_positions.py --method percentile
    python scripts/recalculate_positions.py --preset state-emphasis --output data/variants/state-emphasis.json
    python scripts/recalculate_positions.py --compare-with data/variants/equity-emphasis.json
"""

import json
import os
import sys
import argparse
import shutil
from datetime import datetime

# Importar módulo de scoring
from scoring_methodology import (
    SchoolScorer, get_descriptor_options,
    get_weight_preset, get_available_presets
)
from config import RUTA_DATOS, NORMALIZATION_METHOD


def backup_file(file_path: str) -> str:
    """
    Crea un backup del archivo JSON antes de modificarlo.

    Args:
        file_path: Ruta del archivo a respaldar

    Returns:
        Ruta del archivo de backup
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{file_path}.backup_{timestamp}"
    shutil.copy2(file_path, backup_path)
    return backup_path


def load_json(file_path: str) -> dict:
    """
    Carga el archivo JSON de escuelas.

    Args:
        file_path: Ruta del archivo JSON

    Returns:
        Diccionario con los datos
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(file_path: str, data: dict):
    """
    Guarda el archivo JSON con formato bonito.

    Args:
        file_path: Ruta del archivo JSON
        data: Diccionario con los datos
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_metadata(data: dict, variant_name: str = 'base', preset_name: str = 'base',
                normalization_method: str = 'percentile') -> dict:
    """
    Agrega metadata al JSON sobre la configuración usada.

    Args:
        data: Diccionario con los datos del JSON
        variant_name: Nombre de la variante
        preset_name: Nombre del preset de pesos usado
        normalization_method: Método de normalización usado

    Returns:
        Diccionario con metadata agregada
    """
    if 'metadata' not in data:
        data['metadata'] = {}

    data['metadata'].update({
        'variant_name': variant_name,
        'preset_name': preset_name,
        'normalization_method': normalization_method,
        'generated_at': datetime.now().isoformat(),
        'generator_version': '6.0'
    })

    return data


def compare_positions(data1: dict, data2: dict, label1: str = 'Actual', label2: str = 'Comparación') -> None:
    """
    Compara las posiciones de dos JSONs y muestra las diferencias.

    Args:
        data1: Primer diccionario de datos
        data2: Segundo diccionario de datos
        label1: Etiqueta para el primer dataset
        label2: Etiqueta para el segundo dataset
    """
    nodos1 = {n['id']: n for n in data1.get('nodos', [])}
    nodos2 = {n['id']: n for n in data2.get('nodos', [])}

    print("\n" + "="*100)
    print(f"COMPARACIÓN: {label1} vs {label2}")
    print("="*100)
    print(f"{'Escuela':<25} {label1+' (x,y)':<20} {label2+' (x,y)':<20} {'Distancia':<15}")
    print("="*100)

    total_distance = 0
    count = 0

    for school_id in sorted(nodos1.keys()):
        if school_id not in nodos2:
            continue

        nodo1 = nodos1[school_id]
        nodo2 = nodos2[school_id]

        # Extraer posiciones
        pos1 = nodo1.get('posicion', {})
        pos2 = nodo2.get('posicion', {})

        x1 = pos1.get('x', 0) if isinstance(pos1, dict) else nodo1.get('x', 0)
        y1 = pos1.get('y', 0) if isinstance(pos1, dict) else nodo1.get('y', 0)
        x2 = pos2.get('x', 0) if isinstance(pos2, dict) else nodo2.get('x', 0)
        y2 = pos2.get('y', 0) if isinstance(pos2, dict) else nodo2.get('y', 0)

        # Calcular distancia
        distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5
        total_distance += distance
        count += 1

        # Mostrar fila
        nombre = nodo1.get('nombre', school_id)
        pos1_str = f"({x1:.2f}, {y1:.2f})"
        pos2_str = f"({x2:.2f}, {y2:.2f})"
        dist_str = f"Δ={distance:.3f}"

        # Marcar cambios significativos
        marker = "⚠️ " if distance > 0.2 else ""
        print(f"{marker}{nombre:<23} {pos1_str:<20} {pos2_str:<20} {dist_str:<15}")

    print("="*100)
    if count > 0:
        avg_distance = total_distance / count
        print(f"\n📊 Estadísticas de comparación:")
        print(f"   • Escuelas comparadas: {count}")
        print(f"   • Distancia total: {total_distance:.3f}")
        print(f"   • Distancia promedio: {avg_distance:.3f}")
        print(f"   • Cambios significativos (Δ > 0.2): {sum(1 for _ in range(count) if _ > 0.2)}")


def recalculate_all_positions(data: dict, scorer: SchoolScorer, dry_run: bool = False) -> dict:
    """
    Recalcula las posiciones de todas las escuelas.

    Args:
        data: Diccionario con los datos del JSON
        scorer: Instancia de SchoolScorer
        dry_run: Si es True, solo muestra los cambios sin aplicarlos

    Returns:
        Diccionario con datos actualizados
    """
    nodos = data.get('nodos', [])

    # Preparar descriptores para batch calculation
    schools_descriptors = {}
    nodos_sin_descriptores = []

    for nodo in nodos:
        descriptors = nodo.get('descriptores', {})
        if descriptors:
            schools_descriptors[nodo['id']] = descriptors
        else:
            nodos_sin_descriptores.append(nodo['id'])

    if nodos_sin_descriptores:
        print(f"\n⚠️  Advertencia: {len(nodos_sin_descriptores)} escuelas sin descriptores:")
        for school_id in nodos_sin_descriptores:
            print(f"   • {school_id}")
        print("   Estas escuelas mantendrán sus posiciones actuales.\n")

    # Calcular nuevas posiciones
    print(f"📊 Calculando posiciones para {len(schools_descriptors)} escuelas...")
    new_positions = scorer.batch_calculate_positions(schools_descriptors)

    # Mostrar tabla de cambios
    print("\n" + "="*80)
    print(f"{'Escuela':<25} {'Pos. Actual':<15} {'Pos. Nueva':<15} {'Cambio':<15}")
    print("="*80)

    cambios_significativos = 0

    for nodo in nodos:
        school_id = nodo['id']
        nombre = nodo.get('nombre', school_id)

        # Posición actual
        pos_actual = nodo.get('posicion', {})
        if isinstance(pos_actual, dict):
            x_actual = pos_actual.get('x', 0)
            y_actual = pos_actual.get('y', 0)
        else:
            x_actual = nodo.get('x', 0)
            y_actual = nodo.get('y', 0)

        # Posición nueva
        if school_id in new_positions:
            x_nueva, y_nueva = new_positions[school_id]

            # Calcular magnitud del cambio
            delta = ((x_nueva - x_actual)**2 + (y_nueva - y_actual)**2)**0.5

            if delta > 0.1:  # Cambio significativo
                cambios_significativos += 1

            # Imprimir fila
            pos_actual_str = f"({x_actual:.2f}, {y_actual:.2f})"
            pos_nueva_str = f"({x_nueva:.2f}, {y_nueva:.2f})"
            delta_str = f"Δ={delta:.3f}"

            print(f"{nombre:<25} {pos_actual_str:<15} {pos_nueva_str:<15} {delta_str:<15}")

            # Actualizar en el diccionario (si no es dry-run)
            if not dry_run:
                if isinstance(nodo.get('posicion'), dict):
                    nodo['posicion']['x'] = x_nueva
                    nodo['posicion']['y'] = y_nueva
                else:
                    nodo['x'] = x_nueva
                    nodo['y'] = y_nueva
        else:
            pos_actual_str = f"({x_actual:.2f}, {y_actual:.2f})"
            print(f"{nombre:<25} {pos_actual_str:<15} {'(sin cambio)':<15} {'-':<15}")

    print("="*80)
    print(f"\n📈 Resumen:")
    print(f"   • Total de escuelas: {len(nodos)}")
    print(f"   • Posiciones recalculadas: {len(new_positions)}")
    print(f"   • Cambios significativos (Δ > 0.1): {cambios_significativos}")

    return data


def validate_descriptors(data: dict) -> bool:
    """
    Valida que los descriptores de las escuelas sean correctos.

    Args:
        data: Diccionario con los datos del JSON

    Returns:
        True si todos son válidos, False en caso contrario
    """
    valid_options = get_descriptor_options()
    nodos = data.get('nodos', [])

    print("\n🔍 Validando descriptores...")
    errores = []

    for nodo in nodos:
        school_id = nodo['id']
        descriptors = nodo.get('descriptores', {})

        if not descriptors:
            continue

        for key, value in descriptors.items():
            if key not in valid_options:
                errores.append(f"  ❌ {school_id}: descriptor desconocido '{key}'")
            elif value not in valid_options[key]:
                errores.append(f"  ❌ {school_id}: valor inválido '{value}' para '{key}'")
                errores.append(f"     Opciones válidas: {', '.join(valid_options[key])}")

    if errores:
        print(f"\n⚠️  Se encontraron {len(errores)} errores de validación:")
        for error in errores[:10]:  # Mostrar máximo 10
            print(error)
        if len(errores) > 10:
            print(f"   ... y {len(errores) - 10} errores más")
        return False
    else:
        print("✓ Todos los descriptores son válidos")
        return True


def main():
    """
    Función principal con CLI.
    """
    parser = argparse.ArgumentParser(
        description='Recalcula posiciones de escuelas económicas usando scoring methodology',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  # Ver cambios sin aplicar
  python scripts/recalculate_positions.py --dry-run

  # Aplicar cambios con normalización por percentiles
  python scripts/recalculate_positions.py --method percentile

  # Crear variante con preset de pesos
  python scripts/recalculate_positions.py --preset state-emphasis --output data/variants/state-emphasis.json

  # Comparar con otra variante
  python scripts/recalculate_positions.py --compare-with data/variants/equity-emphasis.json

  # Listar presets disponibles
  python scripts/recalculate_positions.py --list-presets
        """
    )

    parser.add_argument('--data', '-d',
                       default=RUTA_DATOS,
                       help=f'Ruta al archivo JSON de datos (default: {RUTA_DATOS})')

    parser.add_argument('--method', '-m',
                       choices=['none', 'percentile', 'zscore', 'minmax'],
                       default=NORMALIZATION_METHOD,
                       help=f'Método de normalización (default: {NORMALIZATION_METHOD})')

    parser.add_argument('--preset', '-p',
                       choices=get_available_presets(),
                       help='Preset de pesos a usar (base, state-emphasis, equity-emphasis, etc.)')

    parser.add_argument('--output', '-o',
                       help='Archivo de salida (si no se especifica, sobrescribe el archivo de entrada)')

    parser.add_argument('--variant-name',
                       help='Nombre de la variante para metadata (default: usa el nombre del preset)')

    parser.add_argument('--compare-with',
                       help='Ruta a otro JSON para comparar posiciones')

    parser.add_argument('--dry-run',
                       action='store_true',
                       help='Mostrar cambios sin aplicar (no modifica el archivo)')

    parser.add_argument('--no-backup',
                       action='store_true',
                       help='No crear backup antes de modificar (no recomendado)')

    parser.add_argument('--validate-only',
                       action='store_true',
                       help='Solo validar descriptores sin recalcular')

    parser.add_argument('--list-presets',
                       action='store_true',
                       help='Listar presets de pesos disponibles y salir')

    args = parser.parse_args()

    # Si se pide listar presets, mostrarlos y salir
    if args.list_presets:
        print("\n📋 PRESETS DE PESOS DISPONIBLES:")
        print("=" * 70)
        for preset_name in get_available_presets():
            print(f"  • {preset_name}")
        print("\nUso: --preset <nombre>")
        return 0

    # Banner
    print("🔄 Recalculador de Posiciones - v6.0")
    print("=" * 80)

    # Verificar que existe el archivo
    if not os.path.exists(args.data):
        print(f"❌ Error: No se encontró el archivo {args.data}")
        return 1

    # Cargar datos
    try:
        data = load_json(args.data)
        print(f"✓ Datos cargados desde: {args.data}")
    except Exception as e:
        print(f"❌ Error al cargar datos: {e}")
        return 1

    # Si se pidió comparación, hacerla y salir
    if args.compare_with:
        if not os.path.exists(args.compare_with):
            print(f"❌ Error: No se encontró el archivo de comparación {args.compare_with}")
            return 1
        try:
            data_compare = load_json(args.compare_with)
            compare_positions(data, data_compare,
                            label1=os.path.basename(args.data),
                            label2=os.path.basename(args.compare_with))
            return 0
        except Exception as e:
            print(f"❌ Error al comparar archivos: {e}")
            return 1

    # Validar descriptores
    if not validate_descriptors(data):
        print("\n⚠️  Se encontraron errores de validación. Corrígelos antes de continuar.")
        return 1

    if args.validate_only:
        print("\n✨ Validación completada exitosamente")
        return 0

    # Determinar variant_name y preset_name
    preset_name = args.preset if args.preset else 'base'
    variant_name = args.variant_name if args.variant_name else preset_name

    # Crear scorer con o sin preset de pesos
    if args.preset:
        print(f"✓ Usando preset de pesos: {args.preset}")
        weights = get_weight_preset(args.preset)
        scorer = SchoolScorer(
            normalization_method=args.method,
            weights_x=weights['x'],
            weights_y=weights['y']
        )
    else:
        scorer = SchoolScorer(normalization_method=args.method)

    print(f"✓ Scorer configurado con método: {args.method}")

    # Recalcular posiciones
    try:
        data_updated = recalculate_all_positions(data, scorer, dry_run=args.dry_run)
    except Exception as e:
        print(f"\n❌ Error al recalcular posiciones: {e}")
        import traceback
        traceback.print_exc()
        return 1

    # Agregar metadata
    if not args.dry_run:
        data_updated = add_metadata(data_updated, variant_name, preset_name, args.method)
        print(f"\n✓ Metadata agregada: variant={variant_name}, preset={preset_name}, method={args.method}")

    # Guardar cambios
    if not args.dry_run:
        # Determinar archivo de salida
        output_file = args.output if args.output else args.data

        # Crear directorio de salida si no existe
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"✓ Directorio creado: {output_dir}")

        # Crear backup solo si sobrescribimos el archivo original
        if output_file == args.data and not args.no_backup:
            try:
                backup_path = backup_file(args.data)
                print(f"💾 Backup creado: {backup_path}")
            except Exception as e:
                print(f"\n⚠️  Error al crear backup: {e}")
                respuesta = input("¿Continuar sin backup? (s/N): ")
                if respuesta.lower() != 's':
                    print("Operación cancelada")
                    return 1

        # Guardar archivo actualizado
        try:
            save_json(output_file, data_updated)
            print(f"✓ Posiciones actualizadas guardadas en: {output_file}")
        except Exception as e:
            print(f"\n❌ Error al guardar archivo: {e}")
            return 1
    else:
        print("\n🔍 Modo dry-run: No se aplicaron cambios")
        print("   Ejecuta sin --dry-run para aplicar los cambios")

    print("=" * 80)
    print("✨ Proceso completado exitosamente")
    return 0


if __name__ == '__main__':
    sys.exit(main())
