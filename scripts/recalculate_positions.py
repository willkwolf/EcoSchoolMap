"""
recalculate_positions.py - Utilidad para Recalcular Posiciones

Recalcula las posiciones de todas las escuelas económicas usando la metodología
de scoring basada en descriptores. Actualiza el archivo JSON con las nuevas posiciones.

IMPORTANTE: Este script modifica el archivo escuelas.json. Se recomienda hacer
un backup antes de ejecutar.

Versión: 5.0
Fecha: 2025-10-23

Uso:
    python scripts/recalculate_positions.py
    python scripts/recalculate_positions.py --dry-run
    python scripts/recalculate_positions.py --method percentile
"""

import json
import os
import sys
import argparse
import shutil
from datetime import datetime

# Importar módulo de scoring
from scoring_methodology import SchoolScorer, get_descriptor_options
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

  # Aplicar cambios sin normalización
  python scripts/recalculate_positions.py --method none
        """
    )

    parser.add_argument('--data', '-d',
                       default=RUTA_DATOS,
                       help=f'Ruta al archivo JSON de datos (default: {RUTA_DATOS})')

    parser.add_argument('--method', '-m',
                       choices=['none', 'percentile', 'zscore', 'minmax'],
                       default=NORMALIZATION_METHOD,
                       help=f'Método de normalización (default: {NORMALIZATION_METHOD})')

    parser.add_argument('--dry-run',
                       action='store_true',
                       help='Mostrar cambios sin aplicar (no modifica el archivo)')

    parser.add_argument('--no-backup',
                       action='store_true',
                       help='No crear backup antes de modificar (no recomendado)')

    parser.add_argument('--validate-only',
                       action='store_true',
                       help='Solo validar descriptores sin recalcular')

    args = parser.parse_args()

    # Banner
    print("🔄 Recalculador de Posiciones - v5.0")
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

    # Validar descriptores
    if not validate_descriptors(data):
        print("\n⚠️  Se encontraron errores de validación. Corrígelos antes de continuar.")
        return 1

    if args.validate_only:
        print("\n✨ Validación completada exitosamente")
        return 0

    # Crear scorer
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

    # Guardar cambios
    if not args.dry_run:
        # Crear backup
        if not args.no_backup:
            try:
                backup_path = backup_file(args.data)
                print(f"\n💾 Backup creado: {backup_path}")
            except Exception as e:
                print(f"\n⚠️  Error al crear backup: {e}")
                respuesta = input("¿Continuar sin backup? (s/N): ")
                if respuesta.lower() != 's':
                    print("Operación cancelada")
                    return 1

        # Guardar archivo actualizado
        try:
            save_json(args.data, data_updated)
            print(f"✓ Posiciones actualizadas guardadas en: {args.data}")
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
