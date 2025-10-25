"""
generate_interactive_plot.py - Generador de Visualización Interactiva HTML

Genera únicamente visualizaciones interactivas en HTML usando Plotly.
Optimizado para publicación en GitHub Pages con interactividad completa.

Responsable: Visualization Engineers
Versión: 5.0
Fecha: 2025-10-23

Uso:
    python scripts/generate_interactive_plot.py
    python scripts/generate_interactive_plot.py --output docs/index.html
    python scripts/generate_interactive_plot.py --theme dark
"""

import json
import os
import sys
import argparse
import shutil
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Importar configuración
from config import (
    KLEIN_SCHEMA, asignar_colores_a_nodos,
    EJE_X_LABEL, EJE_Y_LABEL, TITULO_PRINCIPAL,
    EJE_X_MIN, EJE_X_MAX, EJE_Y_MIN, EJE_Y_MAX,
    RUTA_DATOS, RUTA_SALIDA_HTML
)


class InteractivePlotGenerator:
    """
    Generador de visualizaciones interactivas en HTML para el mapa de escuelas económicas.
    Usa Plotly para crear gráficos interactivos con tooltips, zoom, pan, etc.
    """

    def __init__(self, data_path: str, output_path: str, theme: str = 'light'):
        """
        Inicializa el generador de gráficos interactivos.

        Args:
            data_path: Ruta al archivo JSON con los datos
            output_path: Ruta donde guardar el HTML
            theme: Tema visual ('light' o 'dark')
        """
        self.data_path = data_path
        self.output_path = output_path
        self.theme = theme
        self.data = None
        self.nodos = []
        self.transiciones = []
        self.colores_mapeo = {}
        self.cuadrantes = {}

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

            # Obtener cuadrantes del JSON si existe
            mapeo_visual = self.data.get('mapeo_visual', {})
            self.cuadrantes = mapeo_visual.get('cuadrantes', {})

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
        Extrae las coordenadas (x, y) de un nodo.

        Args:
            nodo: Diccionario del nodo

        Returns:
            Tupla (x, y) o (None, None) si no se encuentra
        """
        pos = nodo.get('posicion') or nodo.get('pos') or nodo.get('position') or {}

        if isinstance(pos, dict):
            x = pos.get('x')
            y = pos.get('y')
        else:
            x = nodo.get('x')
            y = nodo.get('y')

        return (x, y)

    def _crear_tooltip_enriquecido(self, nodo: dict) -> str:
        """
        Crea un tooltip enriquecido con toda la información del nodo.

        Args:
            nodo: Diccionario del nodo

        Returns:
            String HTML con el tooltip
        """
        nombre = nodo.get('nombre', nodo.get('id', 'Sin nombre'))
        categoria = nodo.get('categoria', 'N/A')
        descripcion = nodo.get('descripcion', '')
        autores = nodo.get('autores', [])
        año = nodo.get('año_origen', nodo.get('año_origen_aproximado', 'N/A'))

        # Construir tooltip
        tooltip_parts = [
            f"<b>{nombre}</b>",
            f"<i>{categoria.replace('_', ' ').title()}</i>",
            f"<br>Año: {año}",
        ]

        if autores:
            autores_str = ', '.join(autores[:3])  # Máximo 3 autores
            tooltip_parts.append(f"Autores: {autores_str}")

        if descripcion:
            desc_corta = descripcion[:150] + '...' if len(descripcion) > 150 else descripcion
            tooltip_parts.append(f"<br>{desc_corta}")

        # Agregar descriptores si existen
        descriptores = nodo.get('descriptores', {})
        if descriptores:
            tooltip_parts.append("<br><b>Caracteristicas:</b>")
            for key, value in descriptores.items():
                key_formatted = key.replace('_', ' ').title()
                value_formatted = value.replace('_', ' ').title()
                tooltip_parts.append(f"• {key_formatted}: {value_formatted}")

        return '<br>'.join(tooltip_parts)

    def _crear_figura_plotly(self) -> go.Figure:
        """
        Crea la figura interactiva de Plotly.

        Returns:
            Objeto Figure de Plotly
        """
        fig = go.Figure()

        # Configurar tema
        template = 'plotly_dark' if self.theme == 'dark' else 'plotly_white'

        # Dibujar cuadrantes de fondo
        self._agregar_cuadrantes(fig)

        # Dibujar transiciones (flechas)
        self._agregar_transiciones(fig)

        # Dibujar nodos por tipo (para tener control sobre símbolos)
        self._agregar_nodos(fig)

        # Configurar layout
        fig.update_layout(
            title={
                'text': TITULO_PRINCIPAL,
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 20, 'family': 'Arial, sans-serif'}
            },
            xaxis={
                'title': EJE_X_LABEL,
                'range': [EJE_X_MIN, EJE_X_MAX],
                'zeroline': True,
                'zerolinewidth': 2,
                'zerolinecolor': 'gray',
                'gridcolor': 'rgba(128,128,128,0.2)',
                'showgrid': True
            },
            yaxis={
                'title': EJE_Y_LABEL,
                'range': [EJE_Y_MIN, EJE_Y_MAX],
                'zeroline': True,
                'zerolinewidth': 2,
                'zerolinecolor': 'gray',
                'gridcolor': 'rgba(128,128,128,0.2)',
                'showgrid': True
            },
            template=template,
            hovermode='closest',
            showlegend=True,
            legend={
                'x': 1.02,
                'y': 0.5,
                'xanchor': 'left',
                'yanchor': 'middle',
                'bgcolor': 'rgba(255,255,255,0.9)' if self.theme == 'light' else 'rgba(0,0,0,0.9)',
                'bordercolor': 'gray',
                'borderwidth': 1
            },
            width=1200,
            height=700,
            margin={'l': 80, 'r': 250, 't': 100, 'b': 80}
        )

        return fig

    def _agregar_cuadrantes(self, fig: go.Figure):
        """
        Agrega rectángulos de fondo para los cuadrantes.

        Args:
            fig: Figura de Plotly
        """
        cuadrantes_config = [
            # (x0, y0, x1, y1, color, nombre)
            (EJE_X_MIN, 0, 0, EJE_Y_MAX, 'rgba(0,255,0,0.05)', 'Q1: Estado fuerte + Equidad'),
            (0, 0, EJE_X_MAX, EJE_Y_MAX, 'rgba(0,0,255,0.05)', 'Q2: Estado débil + Equidad'),
            (EJE_X_MIN, EJE_Y_MIN, 0, 0, 'rgba(255,165,0,0.05)', 'Q3: Estado fuerte + Crecimiento'),
            (0, EJE_Y_MIN, EJE_X_MAX, 0, 'rgba(128,0,128,0.05)', 'Q4: Estado débil + Crecimiento'),
        ]

        for x0, y0, x1, y1, color, nombre in cuadrantes_config:
            fig.add_shape(
                type='rect',
                x0=x0, y0=y0, x1=x1, y1=y1,
                fillcolor=color,
                line={'width': 0},
                layer='below',
                name=nombre
            )

    def _agregar_transiciones(self, fig: go.Figure):
        """
        Agrega flechas de transiciones entre nodos.

        Args:
            fig: Figura de Plotly
        """
        if not self.transiciones:
            return

        # Crear diccionario de posiciones
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

            x0, y0 = posiciones[desde_id]
            x1, y1 = posiciones[hacia_id]

            # Estilo según confianza
            confianza = trans.get('confianza', 'media')
            opacity = 0.3 if confianza == 'baja' else 0.5 if confianza == 'media' else 0.7
            width = 1 if confianza == 'baja' else 2 if confianza == 'media' else 3
            dash = 'dot' if confianza == 'baja' else 'dash' if confianza == 'media' else 'solid'

            # Agregar anotación de flecha
            fig.add_annotation(
                x=x1, y=y1,
                ax=x0, ay=y0,
                xref='x', yref='y',
                axref='x', ayref='y',
                showarrow=True,
                arrowhead=2,
                arrowsize=1,
                arrowwidth=width,
                arrowcolor=f'rgba(44,62,80,{opacity})',
                opacity=opacity
            )

    def _agregar_nodos(self, fig: go.Figure):
        """
        Agrega nodos al gráfico, agrupados por tipo para símbolos diferentes.

        Args:
            fig: Figura de Plotly
        """
        # Mapeo de tipos a símbolos de Plotly
        tipo_a_simbolo = {
            'tradicional': 'circle',
            'nuevo_paradigma': 'diamond',
            'tradicion': 'square'
        }

        # Agrupar nodos por tipo
        nodos_por_tipo = {}
        for nodo in self.nodos:
            tipo = nodo.get('tipo', 'tradicional')
            if tipo not in nodos_por_tipo:
                nodos_por_tipo[tipo] = []
            nodos_por_tipo[tipo].append(nodo)

        # Dibujar cada grupo
        for tipo, nodos_grupo in nodos_por_tipo.items():
            xs, ys, nombres, colores, tooltips = [], [], [], [], []

            for nodo in nodos_grupo:
                x, y = self._extraer_posicion(nodo)
                if x is None or y is None:
                    continue

                xs.append(x)
                ys.append(y)
                nombres.append(nodo.get('nombre', nodo.get('id')))
                colores.append(self.colores_mapeo.get(nodo['id'], '#888888'))
                tooltips.append(self._crear_tooltip_enriquecido(nodo))

            if not xs:
                continue

            # Agregar trace
            fig.add_trace(go.Scatter(
                x=xs,
                y=ys,
                mode='markers+text',
                name=tipo.replace('_', ' ').title(),
                text=nombres,
                textposition='bottom center',
                textfont={'size': 9, 'family': 'Arial, sans-serif'},
                hovertemplate='%{hovertext}<extra></extra>',
                hovertext=tooltips,
                marker={
                    'size': 18 if tipo == 'nuevo_paradigma' else 15,
                    'symbol': tipo_a_simbolo.get(tipo, 'circle'),
                    'color': colores,
                    'line': {
                        'width': 2,
                        'color': '#555555'
                    }
                },
                showlegend=False  # No mostrar en leyenda, solo los nombres
            ))

    def _copiar_datos_a_docs(self):
        """
        Copia el archivo JSON de datos al directorio docs/ para GitHub Pages.
        """
        docs_data_dir = os.path.join(os.path.dirname(self.output_path), 'data')
        os.makedirs(docs_data_dir, exist_ok=True)

        destino = os.path.join(docs_data_dir, os.path.basename(self.data_path))

        try:
            shutil.copyfile(self.data_path, destino)
            print(f"[OK] Datos copiados a: {destino}")
        except Exception as e:
            print(f"[WARNING] No se pudo copiar datos: {e}")

    def generar(self) -> bool:
        """
        Genera el HTML interactivo completo.

        Returns:
            True si la generación fue exitosa, False en caso contrario
        """
        if not self.nodos:
            print("[ERROR] No hay nodos para graficar")
            return False

        # Crear figura
        fig = self._crear_figura_plotly()

        # Guardar HTML
        try:
            os.makedirs(os.path.dirname(self.output_path) or '.', exist_ok=True)

            # Generar HTML con Plotly
            html_content = fig.to_html(
                include_plotlyjs='cdn',
                config={
                    'responsive': True,
                    'displayModeBar': True,
                    'displaylogo': False,
                    'modeBarButtonsToRemove': ['lasso2d', 'select2d'],
                    'toImageButtonOptions': {
                        'format': 'png',
                        'filename': 'mapa_escuelas',
                        'height': 1000,
                        'width': 1600,
                        'scale': 2
                    }
                }
            )

            # Agregar metadatos y estilos personalizados
            html_final = self._personalizar_html(html_content)

            with open(self.output_path, 'w', encoding='utf-8') as f:
                f.write(html_final)

            print(f"[OK] HTML interactivo guardado: {self.output_path}")

            # Copiar datos si es para GitHub Pages
            if 'docs' in self.output_path:
                self._copiar_datos_a_docs()

            return True

        except Exception as e:
            print(f"[ERROR] Error al guardar HTML: {e}")
            return False

    def _personalizar_html(self, html_plotly: str) -> str:
        """
        Personaliza el HTML generado por Plotly con metadata y estilos.

        Args:
            html_plotly: HTML generado por Plotly

        Returns:
            HTML personalizado
        """
        # Agregar metadata en el head
        metadata = """
    <meta name="description" content="Mapa interactivo de escuelas económicas - Visualización basada en metodología de Ha-Joon Chang">
    <meta name="keywords" content="economía, escuelas económicas, visualización, política económica">
    <meta name="author" content="Data Science Team">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>">
"""

        # Agregar estilos personalizados
        custom_styles = """
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .info {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 20px;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #95a5a6;
            font-size: 0.85em;
        }
    </style>
"""

        # Construir HTML completo
        html_final = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
{metadata}
{custom_styles}
</head>
<body>
    <div class="container">
        <h1>{TITULO_PRINCIPAL}</h1>
        <div class="info">
            Metodología basada en Ha-Joon Chang • Visualización interactiva • Versión 5.0
        </div>
{html_plotly}
        <div class="footer">
            Generado con <a href="https://github.com/plotly/plotly.py" target="_blank">Plotly</a>
            • Datos: {os.path.basename(self.data_path)}
            • {len(self.nodos)} escuelas económicas
        </div>
    </div>
</body>
</html>"""

        return html_final


def main():
    """
    Función principal con CLI.
    """
    parser = argparse.ArgumentParser(
        description='Genera visualización interactiva (HTML) del mapa de escuelas económicas',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python scripts/generate_interactive_plot.py
  python scripts/generate_interactive_plot.py --output docs/index.html
  python scripts/generate_interactive_plot.py --theme dark
        """
    )

    parser.add_argument('--data', '-d',
                       default=RUTA_DATOS,
                       help=f'Ruta al archivo JSON de datos (default: {RUTA_DATOS})')

    parser.add_argument('--output', '-o',
                       default=RUTA_SALIDA_HTML,
                       help=f'Ruta del archivo HTML de salida (default: {RUTA_SALIDA_HTML})')

    parser.add_argument('--theme', '-t',
                       choices=['light', 'dark'],
                       default='light',
                       help='Tema visual (default: light)')

    args = parser.parse_args()

    # Crear generador
    print("[*] Generador de Visualizacion Interactiva - v5.0")
    print("=" * 60)

    generator = InteractivePlotGenerator(
        data_path=args.data,
        output_path=args.output,
        theme=args.theme
    )

    # Cargar datos
    if not generator.cargar_datos():
        return 1

    # Generar HTML
    if not generator.generar():
        return 1

    print("=" * 60)
    print("[OK] Generacion completada exitosamente")
    print(f"   Abre {args.output} en tu navegador para ver el resultado")
    return 0


if __name__ == '__main__':
    sys.exit(main())
