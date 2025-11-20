"""
generate_static_plot.py - Generador de Imagen Estática (PNG)

Genera únicamente visualizaciones estáticas en formato PNG de alta calidad
usando matplotlib. Separado de la generación HTML para mejor modularidad.

Responsable: Visualization Engineers
Versión: 5.0
Fecha: 2025-10-23

Uso:
    python scripts/generate_static_plot.py
    python scripts/generate_static_plot.py --output custom_output.png
    python scripts/generate_static_plot.py --dpi 600
"""

import json
import os
import sys
import argparse
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch
import numpy as np
from legends import obtener_leyenda_cuadrantes

# Importar configuración
from config import (
    KLEIN_SCHEMA, asignar_colores_a_nodos,
    FIGURA_WIDTH, FIGURA_HEIGHT, DPI_SALIDA,
    EJE_X_LABEL, EJE_Y_LABEL, TITULO_PRINCIPAL,
    EJE_X_MIN, EJE_X_MAX, EJE_Y_MIN, EJE_Y_MAX,
    TAMAÑO_TITULO, TAMAÑO_ETIQUETA_EJE, TAMAÑO_NOMBRE_NODO,
    TIPO_NODO_A_ESTILO, CUADRANTE_COLORES, CONFIANZA_A_ESTILO,
    RUTA_DATOS, RUTA_SALIDA_PNG,
    # Nuevas constantes para transiciones y leyenda
    MOSTRAR_LABELS_TRANSICIONES, TAMAÑO_FONT_LABEL_TRANSICION,
    OFFSET_LABEL_TRANSICION_Y, LABEL_TRANSICION_BGCOLOR, LABEL_TRANSICION_ALPHA,
    LABEL_OVERLAP_ADJUSTMENTS,
    LEYENDA_FONTSIZE, LEYENDA_LINEHEIGHT, LEYENDA_PADDING,
    LEYENDA_POSICION_X, LEYENDA_POSICION_Y, LEYENDA_BGCOLOR,
    LEYENDA_EDGECOLOR, LEYENDA_EDGEWIDTH, LEYENDA_ALPHA
)


def calcular_punto_medio_arco(x1, y1, x2, y2, rad=0.2):
    """
    Calcula el punto medio de un arco Bezier cuadrático (arc3).

    Los arcos con connectionstyle='arc3,rad=0.2' en matplotlib crean
    una curva Bezier cuadrática. El punto medio del arco está desplazado
    perpendicularmente al punto medio de la línea recta.

    Args:
        x1, y1: Coordenadas del punto inicial
        x2, y2: Coordenadas del punto final
        rad: Radio de curvatura (0.2 por defecto, debe coincidir con el usado en FancyArrowPatch)

    Returns:
        tuple: (arc_mid_x, arc_mid_y) - Coordenadas del punto medio del arco curvo
    """
    # Vector dirección
    dx = x2 - x1
    dy = y2 - y1

    # Punto medio de línea recta
    mid_x = (x1 + x2) / 2
    mid_y = (y1 + y2) / 2

    # Offset perpendicular (rad/2 para punto medio de Bezier cuadrático)
    # La perpendicular a (dx, dy) es (-dy, dx)
    arc_mid_x = mid_x - dy * rad / 2
    arc_mid_y = mid_y + dx * rad / 2

    return arc_mid_x, arc_mid_y


class StaticPlotGenerator:
    """
    Generador de visualizaciones estáticas en PNG para el mapa de escuelas económicas.
    """

    def __init__(self, data_path: str, output_path: str, dpi: int = DPI_SALIDA):
        """
        Inicializa el generador de gráficos estáticos.

        Args:
            data_path: Ruta al archivo JSON con los datos
            output_path: Ruta donde guardar el PNG
            dpi: Resolución de la imagen (default: 300)
        """
        self.data_path = data_path
        self.output_path = output_path
        self.dpi = dpi
        self.data = None
        self.nodos = []
        self.transiciones = []
        self.colores_mapeo = {}
        self.leyenda_cuadrantes = {}
        self.siglas_escuelas = {}
        self.guia_tematica = []
        self.advertencia = ""

    def cargar_datos(self) -> bool:
        """
        Carga los datos desde el archivo JSON.

        Returns:
            True si la carga fue exitosa, False en caso contrario
        """
        if not os.path.exists(self.data_path):
            print(f"[ERROR] No se encontro el archivo {self.data_path}")
            return False

        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)

            self.nodos = self.data.get('nodos', [])
            self.transiciones = self.data.get('transiciones', [])
            self.leyenda_cuadrantes = obtener_leyenda_cuadrantes(self.data)

            # Cargar leyenda pedagógica
            leyenda_ped = self.data.get('leyenda_pedagogica', {})
            self.siglas_escuelas = leyenda_ped.get('siglas_escuelas', {})
            self.guia_tematica = leyenda_ped.get('guia_tematica', [])
            self.advertencia = leyenda_ped.get('advertencia', '')

            # Generar mapeo de colores (asegurando que todos los nodos tengan color)
            ids = [n['id'] for n in self.nodos]
            self.colores_mapeo = asignar_colores_a_nodos(ids)

            print(f"[OK] Datos cargados: {len(self.nodos)} nodos, {len(self.transiciones)} transiciones")
            print(f"[OK] Leyenda pedagógica: {len(self.siglas_escuelas)} siglas, {len(self.guia_tematica)} temas")
            return True

        except Exception as e:
            print(f"[ERROR] Error al cargar datos: {e}")
            return False

    def _extraer_posicion(self, nodo: dict) -> tuple:
        """
        Extrae las coordenadas (x, y) de un nodo, considerando varios formatos posibles.

        Args:
            nodo: Diccionario del nodo

        Returns:
            Tupla (x, y) o (None, None) si no se encuentra
        """
        # Intentar varios formatos
        pos = nodo.get('posicion') or nodo.get('pos') or nodo.get('position') or {}

        if isinstance(pos, dict):
            x = pos.get('x')
            y = pos.get('y')
        else:
            x = nodo.get('x')
            y = nodo.get('y')

        return (x, y)

    def _dibujar_cuadrantes_fondo(self, ax):
        """
        Dibuja los cuadrantes de fondo con colores sutiles y etiquetas.

        Args:
            ax: Axis de matplotlib
        """
        # Q1: Superior izquierda (Estado fuerte + Equidad)
        ax.fill_between([EJE_X_MIN, 0], 0, EJE_Y_MAX,
                        color=CUADRANTE_COLORES['superior_izquierda'][0],
                        alpha=CUADRANTE_COLORES['superior_izquierda'][1],
                        label=self.leyenda_cuadrantes.get('q1', {}).get('nombre', 'Estado fuerte + Equidad'))

        # Q2: Superior derecha (Estado débil + Equidad)
        ax.fill_between([0, EJE_X_MAX], 0, EJE_Y_MAX,
                        color=CUADRANTE_COLORES['superior_derecha'][0],
                        alpha=CUADRANTE_COLORES['superior_derecha'][1],
                        label=self.leyenda_cuadrantes.get('q2', {}).get('nombre', 'Estado débil + Equidad'))

        # Q3: Inferior izquierda (Estado fuerte + Crecimiento)
        ax.fill_between([EJE_X_MIN, 0], EJE_Y_MIN, 0,
                        color=CUADRANTE_COLORES['inferior_izquierda'][0],
                        alpha=CUADRANTE_COLORES['inferior_izquierda'][1],
                        label=self.leyenda_cuadrantes.get('q3', {}).get('nombre', 'Estado fuerte + Crecimiento'))

        # Q4: Inferior derecha (Estado débil + Crecimiento)
        ax.fill_between([0, EJE_X_MAX], EJE_Y_MIN, 0,
                        color=CUADRANTE_COLORES['inferior_derecha'][0],
                        alpha=CUADRANTE_COLORES['inferior_derecha'][1],
                        label=self.leyenda_cuadrantes.get('q4', {}).get('nombre', 'Estado débil + Crecimiento'))

        # Agregar etiquetas de texto visibles en cada cuadrante
        cuadrante_labels = [
            ('ESTADO FUERTE + Equidad/Sostenibilidad', -0.6, 0.75, CUADRANTE_COLORES['superior_izquierda'][0]),
            ('ESTADO DÉBIL + Equidad/Sostenibilidad', 0.6, 0.75, CUADRANTE_COLORES['superior_derecha'][0]),
            ('ESTADO FUERTE + Crecimiento/Innovación', -0.6, -0.75, CUADRANTE_COLORES['inferior_izquierda'][0]),
            ('ESTADO DÉBIL + Crecimiento/Innovación', 0.6, -0.75, CUADRANTE_COLORES['inferior_derecha'][0]),
        ]

        for texto, x, y, color in cuadrante_labels:
            ax.text(x, y, texto,
                   fontsize=13,
                   ha='center', va='center',
                   fontweight='bold',
                   color=color,
                   alpha=0.6,
                   bbox=dict(boxstyle='round,pad=0.8',
                            facecolor='white',
                            edgecolor=color,
                            alpha=0.3,
                            linewidth=1.5),
                   zorder=1)

        # Líneas de ejes en el origen
        ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.6)
        ax.axvline(x=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.6)

    def _dibujar_nodos(self, ax):
        """
        Dibuja los nodos en el gráfico.

        Args:
            ax: Axis de matplotlib
        """
        # Primero construir mapa de posiciones para detectar solapamientos
        posiciones_map = {}
        for nodo in self.nodos:
            x, y = self._extraer_posicion(nodo)
            if x is None or y is None:
                continue
            key = (round(float(x), 4), round(float(y), 4))
            posiciones_map.setdefault(key, []).append(nodo)

        # Para posiciones con múltiples nodos, generaremos offsets circulares pequeños
        offsets_map = {}
        for key, nodos_en_pos in posiciones_map.items():
            cantidad = len(nodos_en_pos)
            if cantidad == 1:
                offsets_map[key] = [(0.0, 0.0)]
                continue

            # Radio del desplazamiento depende del tamaño de la figura y cantidad
            base_radius = 0.03  # en unidades de eje; pequeño para no distorsionar la topología
            radius = base_radius * (1 + (cantidad - 2) * 0.25)
            angles = np.linspace(0, 2 * np.pi, cantidad, endpoint=False)
            offsets = [(radius * np.cos(a), radius * np.sin(a)) for a in angles]
            offsets_map[key] = offsets

        # Ahora dibujar cada nodo aplicando offset si corresponde
        for key, nodos_en_pos in posiciones_map.items():
            x0, y0 = key
            offsets = offsets_map.get(key, [(0.0, 0.0)])

            for idx, nodo in enumerate(nodos_en_pos):
                x = x0 + offsets[idx][0]
                y = y0 + offsets[idx][1]

                # Obtener estilo según tipo
                tipo = nodo.get('tipo', 'tradicional')
                estilo = TIPO_NODO_A_ESTILO.get(tipo, TIPO_NODO_A_ESTILO['tradicional'])

                # Color del nodo (asegurar que existe)
                color = self.colores_mapeo.get(nodo['id'])
                if not color:
                    print(f"[WARNING] Nodo '{nodo['id']}' sin color asignado")
                    color = '#888888'

                # Dibujar nodo (con posible desplazamiento)
                ax.scatter(x, y,
                          c=color,
                          s=estilo['tamaño'],
                          marker=estilo['marcador'],
                          edgecolors=estilo['borde_color'],
                          linewidths=estilo['borde_ancho'],
                          alpha=estilo['opacidad'],
                          zorder=3)

                # Etiqueta del nodo; si hubo desplazamiento, ajustar la etiqueta hacia afuera
                nombre = nodo.get('nombre') or nodo.get('id')
                label_offset_y = -0.08
                if offsets[idx] != (0.0, 0.0):
                    # empujar la etiqueta ligeramente en la dirección del offset
                    ox, oy = offsets[idx]
                    label_offset_x = ox * 1.2
                    label_offset_y = oy - 0.10
                else:
                    label_offset_x = 0.0

                ax.text(x + label_offset_x, y + label_offset_y, nombre,
                       fontsize=TAMAÑO_NOMBRE_NODO,
                       ha='center',
                       va='top',
                       fontweight='bold',
                       bbox=dict(boxstyle='round,pad=0.3',
                                 facecolor='white',
                                 edgecolor='none',
                                 alpha=0.7),
                       zorder=4)

    def _dibujar_transiciones(self, ax):
        """
        Dibuja las transiciones (flechas) entre nodos con alta visibilidad.

        Args:
            ax: Axis de matplotlib
        """
        if not self.transiciones:
            return

        # Crear diccionario de posiciones para búsqueda rápida
        posiciones = {}
        for nodo in self.nodos:
            x, y = self._extraer_posicion(nodo)
            if x is not None and y is not None:
                posiciones[nodo['id']] = (x, y)

        for trans in self.transiciones:
            desde_id = trans.get('desde_nodo')
            hacia_id = trans.get('hacia_nodo')

            if desde_id not in posiciones or hacia_id not in posiciones:
                print(f"[WARNING] Transición '{trans.get('id')}': nodo no encontrado ({desde_id} -> {hacia_id})")
                continue

            x1, y1 = posiciones[desde_id]
            x2, y2 = posiciones[hacia_id]

            # Estilo de flecha según confianza (usando config)
            confianza = trans.get('confianza', 'media')
            estilo = CONFIANZA_A_ESTILO.get(confianza, CONFIANZA_A_ESTILO['media'])

            # Dibujar flecha con mejor visibilidad
            arrow = FancyArrowPatch((x1, y1), (x2, y2),
                                   arrowstyle='->',
                                   color='#000000',  # Negro para máximo contraste
                                   linewidth=estilo['ancho_linea'],
                                   linestyle=estilo['estilo_linea'],
                                   alpha=estilo['opacidad'],
                                   connectionstyle='arc3,rad=0.2',
                                   zorder=3)  # Sobre cuadrantes, bajo nodos
            ax.add_patch(arrow)

            # Agregar etiqueta a la transición
            if MOSTRAR_LABELS_TRANSICIONES:
                # Calcular punto medio del arco curvo (no de la línea recta)
                arc_mid_x, arc_mid_y = calcular_punto_medio_arco(x1, y1, x2, y2, rad=0.2)

                # Aplicar ajustes manuales para evitar superposiciones
                trans_id = trans.get('id')
                offset_x, offset_y = LABEL_OVERLAP_ADJUSTMENTS.get(trans_id, (0, 0))

                # Posición final con offsets
                mid_x = arc_mid_x + offset_x
                mid_y = arc_mid_y + offset_y + OFFSET_LABEL_TRANSICION_Y

                # Obtener información de la transición
                evento = trans.get('evento_disparador', '')
                año = trans.get('año', '')

                # Crear etiqueta corta: "Crisis 2008"
                label_texto = f"{evento.split()[0]} {año}" if evento and año else str(año)

                # Dibujar etiqueta con fondo
                ax.text(mid_x, mid_y, label_texto,
                       fontsize=TAMAÑO_FONT_LABEL_TRANSICION,
                       ha='center', va='center',
                       fontweight='bold',
                       bbox=dict(boxstyle='round,pad=0.3',
                                facecolor=LABEL_TRANSICION_BGCOLOR,
                                edgecolor='gray',
                                alpha=LABEL_TRANSICION_ALPHA,
                                linewidth=0.5),
                       zorder=2.5)  # Entre flechas y nodos

    def _crear_leyenda(self, ax):
        """
        Crea la leyenda pedagógica del gráfico organizada por temáticas.
        Lee los datos desde el JSON cargado.

        Args:
            ax: Axis de matplotlib
        """
        # ============================================================
        # SECCIÓN 1: SIGLAS DE ESCUELAS (desde JSON)
        # ============================================================
        siglas_texto = "SIGLAS:\n" + ", ".join([
            f"{sigla}={info['nombre_completo']}"
            for sigla, info in sorted(self.siglas_escuelas.items())
        ])

        # ============================================================
        # SECCIÓN 2: INFORMACIÓN DE TRANSICIONES
        # ============================================================
        transiciones_texto = "\n\nTRANSICIONES (flechas):\n" + \
                           "━━━ Alta confianza\n" + \
                           "- - - Confianza media\n" + \
                           "··· Baja confianza"

        # ============================================================
        # SECCIÓN 3: GUÍA TEMÁTICA PEDAGÓGICA (desde JSON)
        # ============================================================
        guia_texto = "\n\nGUIA POR TEMAS:\n"
        for idx, tema in enumerate(self.guia_tematica, 1):
            siglas_str = ", ".join(tema['siglas'])
            guia_texto += f"{idx}. {tema['titulo']}: {siglas_str}\n"

        # ============================================================
        # SECCIÓN 4: ADVERTENCIA (desde JSON)
        # ============================================================
        advertencia_texto = f"\n⚠ ADVERTENCIA:\n{self.advertencia}"

        # Combinar todo el texto
        #Original: texto_completo = siglas_texto + transiciones_texto + guia_texto + advertencia_texto
        
        texto_completo = transiciones_texto

        # Crear cuadro de texto con la leyenda pedagógica (usando constantes de config)
        props = dict(boxstyle=f'round,pad={LEYENDA_PADDING}',
                    facecolor=LEYENDA_BGCOLOR,
                    edgecolor=LEYENDA_EDGECOLOR,
                    linewidth=LEYENDA_EDGEWIDTH,
                    alpha=LEYENDA_ALPHA)

        ax.text(LEYENDA_POSICION_X, LEYENDA_POSICION_Y, texto_completo,
               transform=ax.transAxes,
               fontsize=LEYENDA_FONTSIZE,
               verticalalignment='top',  # Anclaje superior para mejor control
               bbox=props,
               family='monospace',
               linespacing=LEYENDA_LINEHEIGHT)

    def generar(self) -> bool:
        """
        Genera el gráfico estático completo.

        Returns:
            True si la generación fue exitosa, False en caso contrario
        """
        if not self.nodos:
            print("[ERROR] No hay nodos para graficar")
            return False

        # Crear figura y ejes
        fig, ax = plt.subplots(figsize=(FIGURA_WIDTH, FIGURA_HEIGHT), dpi=self.dpi)
        ax.set_facecolor('#ffffff')

        # Dibujar componentes
        self._dibujar_cuadrantes_fondo(ax)
        self._dibujar_nodos(ax)
        self._dibujar_transiciones(ax)

        # Configurar ejes
        ax.set_xlim(EJE_X_MIN, EJE_X_MAX)
        ax.set_ylim(EJE_Y_MIN, EJE_Y_MAX)
        ax.set_xlabel(EJE_X_LABEL, fontsize=TAMAÑO_ETIQUETA_EJE)
        ax.set_ylabel(EJE_Y_LABEL, fontsize=TAMAÑO_ETIQUETA_EJE)
        ax.set_title(TITULO_PRINCIPAL, fontsize=TAMAÑO_TITULO, fontweight='bold', pad=20)

        # Crear leyenda
        self._crear_leyenda(ax)

        # Grid sutil
        ax.grid(True, linestyle=':', alpha=0.3, linewidth=0.5)

        # Ajustar layout
        plt.tight_layout()

        # Guardar
        try:
            os.makedirs(os.path.dirname(self.output_path) or '.', exist_ok=True)
            fig.savefig(self.output_path, dpi=self.dpi, bbox_inches='tight')
            plt.close(fig)
            print(f"[OK] PNG guardado exitosamente: {self.output_path}")
            print(f"  Dimensiones: {FIGURA_WIDTH}x{FIGURA_HEIGHT} pulgadas")
            print(f"  Resolucion: {self.dpi} DPI")
            return True

        except Exception as e:
            print(f"[ERROR] Error al guardar PNG: {e}")
            plt.close(fig)
            return False


def process_batch(batch_dir: str, output_dir: str, dpi: int) -> dict:
    """
    Procesa múltiples archivos JSON en modo batch.

    Args:
        batch_dir: Directorio con archivos JSON
        output_dir: Directorio de salida para PNGs
        dpi: Resolución DPI

    Returns:
        Dict con estadísticas de procesamiento
    """
    import glob

    # Buscar archivos JSON
    json_files = glob.glob(os.path.join(batch_dir, '*.json'))

    if not json_files:
        print(f"[ERROR] No se encontraron archivos JSON en {batch_dir}")
        return {'processed': 0, 'failed': 0, 'total': 0}

    # Crear directorio de salida
    os.makedirs(output_dir, exist_ok=True)

    stats = {'processed': [], 'failed': [], 'total': len(json_files)}

    print("\n" + "=" * 80)
    print(f"PROCESAMIENTO BATCH: {len(json_files)} archivos")
    print("=" * 80)

    for json_file in sorted(json_files):
        basename = os.path.basename(json_file)
        variant_name = os.path.splitext(basename)[0]
        output_file = os.path.join(output_dir, f"mapa_{variant_name}.png")

        print(f"\n📊 Procesando: {basename}")
        print("-" * 80)

        try:
            generator = StaticPlotGenerator(
                data_path=json_file,
                output_path=output_file,
                dpi=dpi
            )

            if generator.cargar_datos() and generator.generar():
                stats['processed'].append(variant_name)
                file_size_mb = os.path.getsize(output_file) / (1024 * 1024)
                print(f"✓ Generado: {output_file} ({file_size_mb:.2f} MB)")
            else:
                stats['failed'].append(variant_name)
                print(f"❌ Falló: {variant_name}")

        except Exception as e:
            stats['failed'].append(variant_name)
            print(f"❌ Error en {variant_name}: {e}")
            import traceback
            traceback.print_exc()

    # Resumen
    print("\n" + "=" * 80)
    print("RESUMEN DE BATCH")
    print("=" * 80)
    print(f"✓ Procesados exitosamente: {len(stats['processed'])}/{stats['total']}")

    if stats['failed']:
        print(f"❌ Fallidos: {len(stats['failed'])}")
        for name in stats['failed']:
            print(f"  • {name}")

    return stats


def main():
    """
    Función principal con CLI.
    """
    parser = argparse.ArgumentParser(
        description='Genera visualización estática (PNG) del mapa de escuelas económicas',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  # Generar un solo gráfico
  python scripts/generate_static_plot.py
  python scripts/generate_static_plot.py --output mi_grafico.png
  python scripts/generate_static_plot.py --dpi 600 --data data/escuelas.json

  # Procesar múltiples variantes en batch
  python scripts/generate_static_plot.py --batch-dir data/variants --batch-output output/variants
        """
    )

    parser.add_argument('--data', '-d',
                       default=RUTA_DATOS,
                       help=f'Ruta al archivo JSON de datos (default: {RUTA_DATOS})')

    parser.add_argument('--output', '-o',
                       default=RUTA_SALIDA_PNG,
                       help=f'Ruta del archivo PNG de salida (default: {RUTA_SALIDA_PNG})')

    parser.add_argument('--dpi',
                       type=int,
                       default=DPI_SALIDA,
                       help=f'Resolución en DPI (default: {DPI_SALIDA})')

    parser.add_argument('--batch-dir',
                       help='Directorio con archivos JSON para procesamiento batch')

    parser.add_argument('--batch-output',
                       default='output/variants',
                       help='Directorio de salida para modo batch (default: output/variants)')

    args = parser.parse_args()

    # Modo batch
    if args.batch_dir:
        print("[*] Generador de Visualizacion Estatica - v6.0 (BATCH MODE)")
        print("=" * 80)

        stats = process_batch(args.batch_dir, args.batch_output, args.dpi)

        if stats['failed']:
            print("\n⚠️  Algunas visualizaciones fallaron")
            return 1
        else:
            print("\n✨ Todas las visualizaciones generadas exitosamente")
            return 0

    # Modo single file (original)
    print("[*] Generador de Visualizacion Estatica - v6.0")
    print("=" * 60)

    generator = StaticPlotGenerator(
        data_path=args.data,
        output_path=args.output,
        dpi=args.dpi
    )

    # Cargar datos
    if not generator.cargar_datos():
        return 1

    # Generar gráfico
    if not generator.generar():
        return 1

    print("=" * 60)
    print("[OK] Generacion completada exitosamente")
    return 0


if __name__ == '__main__':
    sys.exit(main())
