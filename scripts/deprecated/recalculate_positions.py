"""
recalculate_positions_v7.py - Utilidad de Migración y Recálculo

Adapta el archivo JSON de escuelas a la nueva Metodología v8 (Enums/Dataclasses).
Recalcula posiciones respetando la inversión del Eje X (Estado vs Mercado).

Uso:
    python scripts/recalculate_positions.py
    python scripts/recalculate_positions.py --preset balanced
    python scripts/recalculate_positions.py --compare-with data/old_version.json
"""

import json
import os
import sys
import argparse
import shutil
from datetime import datetime
from typing import Dict, Any, List

# ============================================================
# IMPORTS DEL NUEVO MOTOR (v8)
# ============================================================
try:
    from scoring_methodology import (
        EconomicSchoolScorer, 
        SchoolDescriptors,
        ConceptoEconomia, 
        ConceptoHumano, 
        NaturalezaMundo, 
        AmbitoRelevante, 
        MotorCambio, 
        PoliticaPreferida
    )
except ImportError:
    print("❌ Error Crítico: No se encuentra 'scoring_methodology.py'. Asegúrate de estar en el directorio correcto.")
    sys.exit(1)

from config import RUTA_DATOS  # Asumimos que existe, si no, definir RUTA_DATOS = 'data/escuelas.json'

# ============================================================
# UTILIDADES DE ARCHIVO
# ============================================================

def backup_file(file_path: str) -> str:
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{file_path}.backup_{timestamp}"
    shutil.copy2(file_path, backup_path)
    return backup_path

def load_json(file_path: str) -> dict:
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path: str, data: dict):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ============================================================
# LÓGICA DE MIGRACIÓN (String -> Enum)
# ============================================================

def map_json_to_dataclass(nombre: str, descriptores: Dict[str, str]) -> SchoolDescriptors:
    """
    Convierte el diccionario de strings del JSON al Dataclass con Enums.
    Lanza ValueError si un string no coincide con ningún Enum válido.
    """
    try:
        return SchoolDescriptors(
            nombre=nombre,
            economia=ConceptoEconomia(descriptores['concepcion_economia']),
            humano=ConceptoHumano(descriptores['concepcion_humano']),
            mundo=NaturalezaMundo(descriptores['naturaleza_mundo']),
            ambito=AmbitoRelevante(descriptores['ambito_economico']),
            motor=MotorCambio(descriptores['motor_cambio']),
            politica=PoliticaPreferida(descriptores['politicas_preferidas'])
        )
    except ValueError as e:
        # Captura errores de mapeo (ej: string antiguo que ya no existe)
        raise ValueError(f"Error mapeando descriptores para '{nombre}': {e}")
    except KeyError as e:
        raise ValueError(f"Falta una clave requerida en '{nombre}': {e}")

def get_valid_options() -> Dict[str, List[str]]:
    """Genera dinámicamente las opciones válidas basadas en los Enums actuales."""
    return {
        'concepcion_economia': [e.value for e in ConceptoEconomia],
        'concepcion_humano': [e.value for e in ConceptoHumano],
        'naturaleza_mundo': [e.value for e in NaturalezaMundo],
        'ambito_economico': [e.value for e in AmbitoRelevante],
        'motor_cambio': [e.value for e in MotorCambio],
        'politicas_preferidas': [e.value for e in PoliticaPreferida]
    }

# ============================================================
# VALIDACIÓN
# ============================================================

def validate_descriptors(data: dict) -> bool:
    """Valida que los strings en el JSON correspondan a Enums válidos en v8."""
    valid_opts = get_valid_options()
    nodos = data.get('nodos', [])
    errores = []

    print("\n🔍 Validando integridad de datos contra el esquema v8...")

    # Mapeo de claves JSON antiguas a nuevas (si hubiera cambios de nombre de keys)
    # Asumimos que las keys del JSON coinciden con las esperadas por map_json_to_dataclass
    
    for nodo in nodos:
        school_id = nodo.get('id', 'Desconocido')
        desc = nodo.get('descriptores', {})
        
        if not desc:
            continue

        # Verificar cada campo manualmente para dar feedback preciso
        mapping_keys = {
            'concepcion_economia': valid_opts['concepcion_economia'],
            'concepcion_humano': valid_opts['concepcion_humano'],
            'naturaleza_mundo': valid_opts['naturaleza_mundo'],
            'ambito_economico': valid_opts['ambito_economico'],
            'motor_cambio': valid_opts['motor_cambio'],
            'politicas_preferidas': valid_opts['politicas_preferidas']
        }

        for json_key, valid_values in mapping_keys.items():
            val = desc.get(json_key)
            if val not in valid_values:
                errores.append(f" ❌ {school_id}: '{json_key}' tiene valor inválido '{val}'.")

    if errores:
        print(f"\n⚠️  Se encontraron {len(errores)} errores de consistencia:")
        for err in errores[:10]:
            print(err)
        if len(errores) > 10: print(f"... y {len(errores)-10} más.")
        return False
    
    print("✓ Todos los descriptores son compatibles con el nuevo motor.")
    return True

# ============================================================
# CORE LOGIC
# ============================================================

def recalculate_all_positions(data: dict, scorer: EconomicSchoolScorer, dry_run: bool = False) -> dict:
    nodos = data.get('nodos', [])
    cambios_significativos = 0
    
    print("\n" + "="*90)
    print(f"{'Escuela':<25} {'Pos. Actual':<18} {'Pos. Nueva':<18} {'Cuadrante Nuevo'}")
    print("="*90)

    for nodo in nodos:
        school_id = nodo.get('id')
        nombre = nodo.get('nombre', school_id)
        descriptors_dict = nodo.get('descriptores', {})

        if not descriptors_dict:
            print(f"⚠️  {nombre:<24} (Sin descriptores - Omitido)")
            continue

        try:
            # 1. Convertir Dict -> Dataclass
            school_obj = map_json_to_dataclass(nombre, descriptors_dict)
            
            # 2. Calcular con el nuevo motor
            result = scorer.calculate(school_obj)
            
            # 3. Obtener posiciones actuales para comparar
            # Soporte para estructura plana (x,y) o anidada (posicion:{x,y})
            if 'posicion' in nodo and isinstance(nodo['posicion'], dict):
                x_old = nodo['posicion'].get('x', 0)
                y_old = nodo['posicion'].get('y', 0)
            else:
                x_old = nodo.get('x', 0)
                y_old = nodo.get('y', 0)

            # 4. Calcular delta
            delta = ((result.x_final - x_old)**2 + (result.y_final - y_old)**2)**0.5
            if delta > 0.15:
                cambios_significativos += 1
                marker = "⚡" # Cambio fuerte
            else:
                marker = ""

            # 5. Imprimir log
            print(f"{marker} {nombre:<23} ({x_old:>5.2f}, {y_old:>5.2f}) -> ({result.x_final:>5.2f}, {result.y_final:>5.2f})   {result.quadrant_label[:30]}...")

            # 6. Actualizar datos (si no es dry-run)
            if not dry_run:
                if 'posicion' not in nodo:
                    nodo['posicion'] = {}
                
                nodo['posicion']['x'] = float(round(result.x_final, 2))
                nodo['posicion']['y'] = float(round(result.y_final, 2))
                
                # Agregar etiqueta calculada para frontend
                nodo['posicion']['etiqueta_cuadrante'] = result.quadrant_label
                
                # Limpiar campos antiguos de la raíz si existen para evitar duplicidad
                if 'x' in nodo: del nodo['x']
                if 'y' in nodo: del nodo['y']

        except ValueError as e:
            print(f"❌ Error calculando {nombre}: {e}")

    print("="*90)
    print(f"Cambios significativos (>0.15): {cambios_significativos}")
    return data

def compare_positions(data1: dict, data2: dict, label1: str, label2: str):
    # Función de comparación simplificada para verificar integridad
    nodos1 = {n['id']: n for n in data1.get('nodos', [])}
    nodos2 = {n['id']: n for n in data2.get('nodos', [])}
    
    print(f"\n🔍 Comparando {label1} vs {label2}")
    for pid, n1 in nodos1.items():
        if pid in nodos2:
            n2 = nodos2[pid]
            p1 = n1.get('posicion', {'x':0,'y':0})
            p2 = n2.get('posicion', {'x':0,'y':0})
            dist = ((p1['x']-p2['x'])**2 + (p1['y']-p2['y'])**2)**0.5
            if dist > 0.05:
                print(f"  • {n1.get('nombre')}: Δ {dist:.3f}")

# ============================================================
# MAIN CLI
# ============================================================

def main():
    parser = argparse.ArgumentParser(description='Recalculador de Posiciones Escuelas Económicas (Migración v8)')
    
    parser.add_argument('--data', default=RUTA_DATOS, help='Archivo JSON de entrada')
    parser.add_argument('--preset', default='balanced', help='Preset de pesos (balanced, philosophical)')
    parser.add_argument('--output', help='Archivo de salida')
    parser.add_argument('--dry-run', action='store_true', help='No guardar cambios')
    parser.add_argument('--no-backup', action='store_true', help='Saltar backup')
    parser.add_argument('--validate-only', action='store_true', help='Solo validar')
    parser.add_argument('--compare-with', help='Archivo para comparar')

    args = parser.parse_args()

    # 1. Cargar
    if not os.path.exists(args.data):
        print(f"❌ Archivo no encontrado: {args.data}")
        return
    
    data = load_json(args.data)

    # 2. Comparar (Opcional)
    if args.compare_with:
        try:
            data_comp = load_json(args.compare_with)
            compare_positions(data, data_comp, "Actual", "Referencia")
            return
        except Exception as e:
            print(f"Error comparando: {e}")
            return

    # 3. Validar
    if not validate_descriptors(data):
        print("⚠️  Corrige los errores en el JSON antes de procesar.")
        return
        
    if args.validate_only:
        return

    # 4. Inicializar Motor
    print(f"\n⚙️  Inicializando motor con preset: '{args.preset}'")
    try:
        scorer = EconomicSchoolScorer(weights_preset=args.preset)
    except Exception as e:
        print(f"❌ Error iniciando scorer: {e}")
        return

    # 5. Procesar
    data_updated = recalculate_all_positions(data, scorer, dry_run=args.dry_run)

    # 6. Metadata y Guardado
    if not args.dry_run:
        data_updated['metadata'] = {
            'last_updated': datetime.now().isoformat(),
            'engine_version': 'v8.0 (Inverted X Axis)',
            'weights_preset': args.preset
        }

        out_file = args.output if args.output else args.data
        
        if out_file == args.data and not args.no_backup:
            backup_file(args.data)
            print("💾 Backup creado.")

        save_json(out_file, data_updated)
        print(f"✅ Archivo guardado exitosamente en: {out_file}")
    else:
        print("\n🚧 Dry Run finalizado. Ningún archivo fue modificado.")

if __name__ == '__main__':
    main()