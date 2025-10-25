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

# Importar configuración
from config import (
    KLEIN_SCHEMA, asignar_colores_a_nodos,
    FIGURA_WIDTH, FIGURA_HEIGHT, DPI_SALIDA,
    EJE_X_LABEL, EJE_Y_LABEL, TITULO_PRINCIPAL,
    EJE_X_MIN, EJE_X_MAX, EJE_Y_MIN, EJE_Y_MAX,
    TAMAÑO_TITULO, TAMAÑO_ETIQUETA_EJE, TAMAÑO_NOMBRE_NODO,
    TIPO_NODO_A_ESTILO, CUADRANTE_COLORES,
    RUTA_DATOS, RUTA_SALIDA_PNG
)


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

            # Generar mapeo de colores
            ids = [n['id'] for n in self.nodos]
            self.colores_mapeo = asignar_colores_a_nodos(ids)

            print(f"[OK] Datos cargados: {len(self.nodos)} nodos, {len(self.transiciones)} transiciones")
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
        Dibuja los cuadrantes de fondo con colores sutiles.

        Args:
            ax: Axis de matplotlib
        """
        # Q1: Superior izquierda (Estado fuerte + Equidad)
        ax.fill_between([EJE_X_MIN, 0], 0, EJE_Y_MAX,
                        color=CUADRANTE_COLORES['superior_izquierda'][0],
                        alpha=CUADRANTE_COLORES['superior_izquierda'][1],
                        label='Estado fuerte + Equidad')

        # Q2: Superior derecha (Estado débil + Equidad)
        ax.fill_between([0, EJE_X_MAX], 0, EJE_Y_MAX,
                        color=CUADRANTE_COLORES['superior_derecha'][0],
                        alpha=CUADRANTE_COLORES['superior_derecha'][1],
                        label='Estado débil + Equidad')

        # Q3: Inferior izquierda (Estado fuerte + Crecimiento)
        ax.fill_between([EJE_X_MIN, 0], EJE_Y_MIN, 0,
                        color=CUADRANTE_COLORES['inferior_izquierda'][0],
                        alpha=CUADRANTE_COLORES['inferior_izquierda'][1],
                        label='Estado fuerte + Crecimiento')

        # Q4: Inferior derecha (Estado débil + Crecimiento)
        ax.fill_between([0, EJE_X_MAX], EJE_Y_MIN, 0,
                        color=CUADRANTE_COLORES['inferior_derecha'][0],
                        alpha=CUADRANTE_COLORES['inferior_derecha'][1],
                        label='Estado débil + Crecimiento')

        # Líneas de ejes en el origen
        ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.6)
        ax.axvline(x=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.6)

    def _dibujar_nodos(self, ax):
        """
        Dibuja los nodos en el gráfico.

        Args:
            ax: Axis de matplotlib
        """
        for nodo in self.nodos:
            x, y = self._extraer_posicion(nodo)

            if x is None or y is None:
                print(f"[WARNING] Nodo '{nodo.get('id')}' sin posicion, omitido")
                continue

            # Obtener estilo según tipo
            tipo = nodo.get('tipo', 'tradicional')
            estilo = TIPO_NODO_A_ESTILO.get(tipo, TIPO_NODO_A_ESTILO['tradicional'])

            # Color del nodo
            color = self.colores_mapeo.get(nodo['id'], '#888888')

            # Dibujar nodo
            ax.scatter(x, y,
                      c=color,
                      s=estilo['tamaño'],
                      marker=estilo['marcador'],
                      edgecolors=estilo['borde_color'],
                      linewidths=estilo['borde_ancho'],
                      alpha=estilo['opacidad'],
                      zorder=3)

            # Etiqueta del nodo
            nombre = nodo.get('nombre') or nodo.get('id')
            ax.text(x, y - 0.08, nombre,
                   fontsize=TAMAÑO_NOMBRE_NODO,
                   ha='center',
                   va='top',
                   fontweight='bold',
                   bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='none', alpha=0.7),
                   zorder=4)

    def _dibujar_transiciones(self, ax):
        """
        Dibuja las transiciones (flechas) entre nodos.

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
                continue

            x1, y1 = posiciones[desde_id]
            x2, y2 = posiciones[hacia_id]

            # Estilo de flecha según confianza
            confianza = trans.get('confianza', 'media')
            alpha = 0.3 if confianza == 'baja' else 0.5 if confianza == 'media' else 0.7
            linestyle = 'dotted' if confianza == 'baja' else 'dashed' if confianza == 'media' else 'solid'

            # Dibujar flecha
            arrow = FancyArrowPatch((x1, y1), (x2, y2),
                                   arrowstyle='->',
                                   color='#2c3e50',
                                   linewidth=1.5,
                                   linestyle=linestyle,
                                   alpha=alpha,
                                   connectionstyle='arc3,rad=0.2',
                                   zorder=1)
            ax.add_patch(arrow)

    def _crear_leyenda(self, ax):
        """
        Crea la leyenda del gráfico con colores de escuelas.

        Args:
            ax: Axis de matplotlib
        """
        # Crear handles para la leyenda
        handles = []
        for nodo in self.nodos:
            color = self.colores_mapeo.get(nodo['id'], '#888888')
            nombre = nodo.get('nombre') or nodo.get('id')
            patch = mpatches.Patch(color=color, label=nombre)
            handles.append(patch)

        # Agregar leyenda
        ax.legend(handles=handles,
                 loc='center left',
                 bbox_to_anchor=(1.02, 0.5),
                 fontsize=9,
                 frameon=True,
                 fancybox=True,
                 shadow=True,
                 title='Escuelas Económicas')

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


def main():
    """
    Función principal con CLI.
    """
    parser = argparse.ArgumentParser(
        description='Genera visualización estática (PNG) del mapa de escuelas económicas',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python scripts/generate_static_plot.py
  python scripts/generate_static_plot.py --output mi_grafico.png
  python scripts/generate_static_plot.py --dpi 600 --data data/escuelas.json
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

    args = parser.parse_args()

    # Crear generador
    print("[*] Generador de Visualizacion Estatica - v5.0")
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
