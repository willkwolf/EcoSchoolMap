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

            # Obtener cuadrantes del JSON si existe
            mapeo_visual = self.data.get('mapeo_visual', {})
            self.cuadrantes = mapeo_visual.get('cuadrantes', {})

            # Cargar leyenda pedagógica
            leyenda_ped = self.data.get('leyenda_pedagogica', {})
            self.siglas_escuelas = leyenda_ped.get('siglas_escuelas', {})
            self.guia_tematica = leyenda_ped.get('guia_tematica', [])
            self.advertencia = leyenda_ped.get('advertencia', '')

            # Generar mapeo de colores
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
            margin={'l': 60, 'r': 100, 't': 60, 'b': 60}
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
                arrowcolor=f'rgba(0,0,0,{opacity})',  # Negro para mejor contraste
                opacity=opacity
            )

            # Agregar etiqueta en el punto medio de la transición
            mid_x = (x0 + x1) / 2
            mid_y = (y0 + y1) / 2 + 0.03  # Offset vertical

            evento = trans.get('evento_disparador', '')
            año = trans.get('año', '')
            descripcion = trans.get('descripcion', '')

            # Etiqueta corta: primera palabra + año
            label_texto = f"{evento.split()[0]} {año}" if evento and año else str(año)

            # Agregar anotación de texto (sin flecha)
            fig.add_annotation(
                x=mid_x, y=mid_y,
                text=f"<b>{label_texto}</b>",
                showarrow=False,
                font=dict(size=9, color='#2c3e50', family='Arial'),
                bgcolor='rgba(255,255,255,0.9)',
                bordercolor='gray',
                borderwidth=1,
                borderpad=3,
                opacity=opacity,
                # Hover info con descripción completa
                hovertext=f"<b>{evento}</b><br>{descripcion}<br>Año: {año}",
                hoverlabel=dict(bgcolor='white', font_size=12)
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
                # Use grayscale for 'tradicion' type, colorful for others
                if nodo.get('tipo') == 'tradicion':
                    colores.append('#555555')  # Dark gray
                else:
                    colores.append(self.colores_mapeo.get(nodo['id'], '#888888'))
                tooltips.append(self._crear_tooltip_enriquecido(nodo))

            if not xs:
                continue

            # Legend names mapping
            legend_names = {
                'tradicional': 'Escuelas Establecidas',
                'nuevo_paradigma': 'Paradigmas Emergentes',
                'tradicion': 'Realpolitik Histórica'
            }

            # Agregar trace
            # Note: textposition='auto' is not supported in Plotly Python, only in Plotly.js
            # Using 'bottom center' here, but JavaScript version will use 'auto'
            fig.add_trace(go.Scatter(
                x=xs,
                y=ys,
                mode='markers+text',
                name=legend_names.get(tipo, tipo.replace('_', ' ').title()),
                text=nombres,
                textposition='bottom center',
                textfont={'size': 11, 'family': 'Arial, sans-serif'},
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
                showlegend=True  # Mostrar en leyenda
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
        Personaliza el HTML generado por Plotly con metadata, landing page y estilos mejorados.

        Args:
            html_plotly: HTML generado por Plotly

        Returns:
            HTML personalizado con estructura OnePage
        """
        # Leer la plantilla HTML completa del archivo docs
        # Por ahora, generamos el HTML completo aquí

        # Metadata
        metadata = """
    <meta name="description" content="Mapa interactivo de escuelas económicas - Visualización basada en metodología de Ha-Joon Chang">
    <meta name="keywords" content="economía, escuelas económicas, visualización, política económica">
    <meta name="author" content="Data Science Team">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>">
"""

        # Estilos completos (incluye landing, guía y selector)
        custom_styles = open(os.path.join(os.path.dirname(__file__), '..', 'docs', 'styles.css'), 'r').read() if os.path.exists(os.path.join(os.path.dirname(__file__), '..', 'docs', 'styles.css')) else self._get_default_styles()

        # Hero section
        hero_section = """
    <!-- HERO / LANDING SECTION -->
    <section class="hero" id="hero">
        <div class="hero-content">
            <h1>Mapa de Escuelas Económicas</h1>
            <p class="subtitle">Un viaje interactivo a través del pensamiento económico</p>
            <p class="description">
                Explora cómo diferentes escuelas de pensamiento económico se posicionan en un espacio bidimensional,
                basado en su visión sobre el rol del Estado y sus objetivos socioeconómicos.
                Una herramienta pedagógica inspirada en la metodología de Ha-Joon Chang.
            </p>
            <div class="hero-buttons">
                <a href="#guide" class="btn btn-primary">Cómo Funciona</a>
                <a href="#visualization" class="btn btn-secondary">Ver Mapa</a>
            </div>
        </div>
        <div class="scroll-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
        </div>
    </section>
"""

        # Guide section
        guide_section = self._generar_guide_section()

        # Variant selector
        variant_selector = self._generar_variant_selector()

        # Leyenda pedagógica
        leyenda_html = self._generar_leyenda_pedagogica_html()

        # JavaScript para interactividad
        javascript = self._generar_javascript()

        # Construir HTML completo
        html_final = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
{metadata}
{custom_styles}
</head>
<body>
{hero_section}
{guide_section}
{variant_selector}

    <!-- VISUALIZATION SECTION -->
    <section class="container" id="visualization">
        <div class="visualization-header">
            <h2>Mapa Interactivo</h2>
            <div class="info">
                Metodología basada en Ha-Joon Chang • Visualización interactiva • Versión 5.0
            </div>
        </div>

        <div class="main-content">
            <div class="plot-container" id="plot-container">
{html_plotly}
            </div>
{leyenda_html}
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <p>
            Generado con <a href="https://github.com/plotly/plotly.py" target="_blank">Plotly</a>
            • Metodología: Ha-Joon Chang
            • {len(self.nodos)} escuelas económicas • 8 variantes disponibles
        </p>
        <p style="margin-top: 10px; font-size: 0.85em;">
            Proyecto: Mapa de Escuelas Políticas Económicas • Versión 5.0 • 2025
        </p>
    </footer>

{javascript}
</body>
</html>"""

        return html_final

    def _get_default_styles(self) -> str:
        """Retorna los estilos CSS por defecto si no existe archivo externo."""
        return """
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            position: relative;
        }

        .hero-content { max-width: 900px; animation: fadeInUp 1s ease-out; }
        .hero h1 { font-size: 3.5em; margin-bottom: 20px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .hero .subtitle { font-size: 1.5em; margin-bottom: 30px; opacity: 0.95; font-weight: 300; }
        .hero .description { font-size: 1.1em; margin-bottom: 40px; line-height: 1.8; opacity: 0.9; }
        .hero-buttons { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }

        .btn { padding: 15px 35px; font-size: 1.1em; border: none; border-radius: 50px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-block; font-weight: 600; }
        .btn-primary { background: white; color: #667eea; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .btn-secondary { background: transparent; color: white; border: 2px solid white; }
        .btn-secondary:hover { background: white; color: #667eea; }

        .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); animation: bounce 2s infinite; }
        .scroll-indicator svg { width: 30px; height: 30px; stroke: white; }

        .guide-section { background: white; padding: 80px 20px; }
        .guide-content { max-width: 1200px; margin: 0 auto; }
        .guide-section h2 { font-size: 2.5em; color: #2c3e50; margin-bottom: 40px; text-align: center; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 50px; }

        .guide-card { background: #f8f9fa; padding: 30px; border-radius: 12px; border-left: 4px solid #667eea; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .guide-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .guide-card h3 { color: #667eea; margin-bottom: 15px; font-size: 1.4em; }
        .guide-card p { color: #555; line-height: 1.7; }
        .guide-card ul { margin-top: 15px; padding-left: 20px; }
        .guide-card li { margin-bottom: 8px; color: #555; }

        .variant-selector-section { background: #f8f9fa; padding: 40px 20px; border-top: 2px solid #e0e0e0; border-bottom: 2px solid #e0e0e0; }
        .variant-selector-content { max-width: 1200px; margin: 0 auto; }
        .variant-selector-section h3 { color: #2c3e50; margin-bottom: 20px; text-align: center; font-size: 1.8em; }
        .variant-description { text-align: center; color: #555; margin-bottom: 30px; font-size: 1.1em; }
        .variant-buttons { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin-bottom: 20px; }

        .variant-btn { padding: 12px 24px; background: white; border: 2px solid #667eea; color: #667eea; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-weight: 600; font-size: 0.95em; }
        .variant-btn:hover { background: #667eea; color: white; transform: translateY(-2px); }
        .variant-btn.active { background: #667eea; color: white; }
        .current-variant-info { text-align: center; padding: 15px; background: white; border-radius: 8px; margin-top: 20px; }

        .container { max-width: 100%; margin: 0 auto; background: white; padding: 40px 20px; }
        .visualization-header { text-align: center; margin-bottom: 30px; }
        .visualization-header h2 { font-size: 2.2em; color: #2c3e50; margin-bottom: 10px; }

        .main-content { display: flex; gap: 20px; align-items: flex-start; max-width: 1800px; margin: 0 auto; }
        .plot-container { flex: 1; min-width: 0; }

        .pedagogical-legend { flex: 0 0 380px; background: #f8f9fa; border: 2px solid #2c3e50; border-radius: 8px; padding: 20px; max-height: 800px; overflow-y: auto; font-size: 16px; line-height: 1.6; position: sticky; top: 20px; }
        .pedagogical-legend h3 { color: #2c3e50; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; }
        .pedagogical-legend h4 { color: #34495e; margin-top: 20px; margin-bottom: 10px; font-size: 14px; }
        .siglas-list { font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.8; }
        .guia-item { margin-bottom: 12px; padding-left: 10px; }
        .advertencia { background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin-top: 20px; color: #856404; font-weight: bold; }

        .info { text-align: center; color: #7f8c8d; margin-bottom: 20px; font-size: 0.9em; }
        .footer { text-align: center; margin-top: 40px; padding: 30px 20px; background: #2c3e50; color: white; }
        .footer a { color: #667eea; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); } 40% { transform: translateX(-50%) translateY(-10px); } 60% { transform: translateX(-50%) translateY(-5px); } }

        @media (max-width: 1200px) {
            .main-content { flex-direction: column; }
            .pedagogical-legend { flex: 1 1 auto; max-height: none; position: static; }
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5em; }
            .hero .subtitle { font-size: 1.2em; }
            .guide-grid { grid-template-columns: 1fr; }
            .variant-buttons { flex-direction: column; }
            .variant-btn { width: 100%; }
        }
    </style>
"""

    def _generar_guide_section(self) -> str:
        """Genera la sección de guía."""
        return """
    <!-- GUIDE SECTION -->
    <section class="guide-section" id="guide">
        <div class="guide-content">
            <h2>¿Cómo Interpretar el Mapa?</h2>

            <div class="guide-grid">
                <div class="guide-card">
                    <h3>📐 Ejes del Mapa</h3>
                    <p><strong>Eje Horizontal (X):</strong> Arquitectura Económica</p>
                    <ul>
                        <li>← Izquierda: Estado Fuerte (Economía Dirigida)</li>
                        <li>→ Derecha: Estado Limitado (Economía de Mercado)</li>
                    </ul>
                    <p><strong>Eje Vertical (Y):</strong> Objetivo Socioeconómico</p>
                    <ul>
                        <li>↑ Arriba: Equidad y Sostenibilidad</li>
                        <li>↓ Abajo: Productividad y Crecimiento</li>
                    </ul>
                </div>

                <div class="guide-card">
                    <h3>🎯 Cuadrantes</h3>
                    <p>El mapa se divide en 4 cuadrantes principales:</p>
                    <ul>
                        <li><strong>Q1:</strong> Estado Fuerte + Equidad (Marxista, Feminista)</li>
                        <li><strong>Q2:</strong> Estado Débil + Equidad (Conductista)</li>
                        <li><strong>Q3:</strong> Estado Fuerte + Crecimiento (Desarrollista)</li>
                        <li><strong>Q4:</strong> Estado Débil + Crecimiento (Clásica, Austriaca)</li>
                    </ul>
                </div>

                <div class="guide-card">
                    <h3>🔄 Transiciones</h3>
                    <p>Las flechas representan cambios históricos entre escuelas:</p>
                    <ul>
                        <li><strong>Línea sólida:</strong> Alta confianza histórica</li>
                        <li><strong>Línea punteada:</strong> Confianza media</li>
                        <li><strong>Línea discontinua:</strong> Baja confianza</li>
                    </ul>
                    <p>Cada transición incluye el evento disparador y el año.</p>
                </div>

                <div class="guide-card">
                    <h3>🎨 Variantes de Peso</h3>
                    <p>Diferentes perspectivas cambian las posiciones:</p>
                    <ul>
                        <li><strong>Base:</strong> Balanceada y neutral</li>
                        <li><strong>State Emphasis:</strong> Énfasis en rol del Estado</li>
                        <li><strong>Equity Emphasis:</strong> Énfasis en equidad</li>
                        <li><strong>Market Emphasis:</strong> Énfasis en mercado libre</li>
                    </ul>
                </div>

                <div class="guide-card">
                    <h3>📚 Metodología</h3>
                    <p>Basado en el enfoque de <strong>Ha-Joon Chang</strong>:</p>
                    <ul>
                        <li>Análisis multidimensional de escuelas económicas</li>
                        <li>Posicionamiento cualitativo cuantificado</li>
                        <li>Normalización mediante percentiles</li>
                        <li>Visualización pedagógica interactiva</li>
                    </ul>
                </div>

                <div class="guide-card">
                    <h3>⚠️ Advertencia Importante</h3>
                    <p style="color: #d63031; font-weight: bold;">
                        Basarse sólo en una escuela para explorar un tema tiene riesgo de:
                    </p>
                    <ul>
                        <li>Polarización ideológica</li>
                        <li>Visión de túnel</li>
                        <li>Arrogancia intelectual</li>
                        <li>Análisis incompleto</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
"""

    def _generar_variant_selector(self) -> str:
        """Genera el selector de variantes."""
        return """
    <!-- VARIANT SELECTOR SECTION -->
    <section class="variant-selector-section" id="variant-selector">
        <div class="variant-selector-content">
            <h3>🔀 Selecciona una Variante de Visualización</h3>
            <p class="variant-description">
                Cada variante aplica diferentes pesos a los descriptores, ofreciendo perspectivas únicas sobre el posicionamiento de las escuelas.
            </p>

            <div class="variant-buttons">
                <button class="variant-btn active" data-variant="base">Base (Balanceada)</button>
                <button class="variant-btn" data-variant="balanced">Balanced</button>
                <button class="variant-btn" data-variant="state-emphasis">State Emphasis</button>
                <button class="variant-btn" data-variant="equity-emphasis">Equity Emphasis</button>
                <button class="variant-btn" data-variant="market-emphasis">Market Emphasis</button>
                <button class="variant-btn" data-variant="growth-emphasis">Growth Emphasis</button>
                <button class="variant-btn" data-variant="historical-emphasis">Historical Emphasis</button>
                <button class="variant-btn" data-variant="pragmatic-emphasis">Pragmatic Emphasis</button>
            </div>

            <div class="current-variant-info">
                <strong>Variante Actual:</strong> <span id="current-variant-name">Base (Balanceada)</span>
                <br>
                <span id="current-variant-description">Pesos equilibrados en todos los descriptores</span>
            </div>
        </div>
    </section>
"""

    def _generar_javascript(self) -> str:
        """Genera el JavaScript para interactividad y carga dinámica de variantes."""
        return """
    <script>
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Klein color schema
        const KLEIN_COLORS = [
            "#FF4D6F", "#579EA4", "#DF7713", "#F9C000", "#86AD34",
            "#5D7298", "#81B28D", "#7E1A2F", "#2D2651", "#C8350D", "#BD777A"
        ];

        // Node type styles
        const NODE_STYLES = {
            'tradicional': { marker: 'circle', size: 16, lineWidth: 2 },
            'nuevo_paradigma': { marker: 'diamond', size: 20, lineWidth: 2.5 },
            'tradicion': { marker: 'square', size: 17, lineWidth: 2.2 }
        };

        // Legend names mapping
        const LEGEND_NAMES = {
            'tradicional': 'Escuelas Establecidas',
            'nuevo_paradigma': 'Paradigmas Emergentes',
            'tradicion': 'Realpolitik Histórica'
        };

        // Transition confidence styles
        const CONFIDENCE_STYLES = {
            'muy_alta': { width: 3, dash: 'solid', opacity: 0.9 },
            'alta': { width: 2.5, dash: 'solid', opacity: 0.75 },
            'media': { width: 2, dash: 'dash', opacity: 0.6 },
            'baja': { width: 1.5, dash: 'dot', opacity: 0.4 }
        };

        // Variant selector
        const variantDescriptions = {
            'base': {
                name: 'Base (Balanceada)',
                description: 'Pesos equilibrados en todos los descriptores'
            },
            'balanced': {
                name: 'Balanced',
                description: 'Configuración balanceada alternativa'
            },
            'state-emphasis': {
                name: 'State Emphasis',
                description: 'Énfasis en el rol del Estado en la economía'
            },
            'equity-emphasis': {
                name: 'Equity Emphasis',
                description: 'Énfasis en equidad y redistribución'
            },
            'market-emphasis': {
                name: 'Market Emphasis',
                description: 'Énfasis en libre mercado y autonomía'
            },
            'growth-emphasis': {
                name: 'Growth Emphasis',
                description: 'Énfasis en crecimiento y productividad'
            },
            'historical-emphasis': {
                name: 'Historical Emphasis',
                description: 'Énfasis en contexto histórico de desarrollo'
            },
            'pragmatic-emphasis': {
                name: 'Pragmatic Emphasis',
                description: 'Énfasis en pragmatismo y eficacia'
            }
        };

        const variantButtons = document.querySelectorAll('.variant-btn');
        const currentVariantName = document.getElementById('current-variant-name');
        const currentVariantDescription = document.getElementById('current-variant-description');

        variantButtons.forEach(button => {
            button.addEventListener('click', function() {
                const variant = this.getAttribute('data-variant');

                // Update active button
                variantButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Update info
                const info = variantDescriptions[variant];
                currentVariantName.textContent = info.name;
                currentVariantDescription.textContent = info.description;

                // Load new variant data
                loadVariant(variant);
            });
        });

        async function loadVariant(variantName) {
            // Show loading notification
            showNotification(`📊 Cargando variante: <strong>${variantDescriptions[variantName].name}</strong>`, 'info');

            try {
                console.log(`Fetching: data/variants/${variantName}.json`);
                console.log('Current location:', window.location.href);

                // Fetch variant JSON
                const response = await fetch(`data/variants/${variantName}.json`);
                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Data loaded:', data);

                // Update the Plotly chart
                updatePlotlyChart(data);

                showNotification(`✅ Variante cargada: <strong>${variantDescriptions[variantName].name}</strong>`, 'success');
            } catch (error) {
                console.error('Error loading variant:', error);
                console.error('Error type:', error.name);
                console.error('Error message:', error.message);

                let errorMsg = `❌ Error al cargar la variante: ${error.message}`;
                if (error.message.includes('Failed to fetch') || window.location.protocol === 'file:') {
                    errorMsg = `❌ CORS Error: Debes abrir este archivo desde un servidor HTTP. Usa: python -m http.server 8000`;
                }

                showNotification(errorMsg, 'error');
            }
        }

        function showNotification(message, type = 'info') {
            const colors = {
                'info': '#667eea',
                'success': '#48bb78',
                'error': '#f56565'
            };

            const notification = document.createElement('div');
            notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; animation: fadeInUp 0.5s ease-out;`;
            notification.innerHTML = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => notification.remove(), 500);
            }, 2500);
        }

        function updatePlotlyChart(data) {
            const nodos = data.nodos || [];
            const transiciones = data.transiciones || [];

            // Assign colors to nodes
            const nodeColors = {};
            nodos.forEach((node, idx) => {
                // Use grayscale for 'tradicion' type nodes, colorful for others
                if (node.tipo === 'tradicion') {
                    nodeColors[node.id] = '#555555';  // Dark gray
                } else {
                    nodeColors[node.id] = KLEIN_COLORS[idx % KLEIN_COLORS.length];
                }
            });

            // Group nodes by type
            const nodesByType = {
                'tradicional': [],
                'nuevo_paradigma': [],
                'tradicion': []
            };

            nodos.forEach(node => {
                const tipo = node.tipo || 'tradicional';
                if (!nodesByType[tipo]) nodesByType[tipo] = [];
                nodesByType[tipo].push(node);
            });

            // Create traces for each node type
            const traces = [];

            Object.entries(nodesByType).forEach(([tipo, nodes]) => {
                if (nodes.length === 0) return;

                const style = NODE_STYLES[tipo] || NODE_STYLES['tradicional'];

                const trace = {
                    x: nodes.map(n => n.posicion.x),
                    y: nodes.map(n => n.posicion.y),
                    mode: 'markers+text',
                    type: 'scatter',
                    name: LEGEND_NAMES[tipo] || tipo.replace('_', ' ').toUpperCase(),
                    text: nodes.map(n => n.nombre),
                    textposition: 'auto',
                    cliponaxis: false,
                    showlegend: true,
                    textfont: {
                        size: 11,
                        family: 'sans-serif',
                        color: '#2c3e50'
                    },
                    marker: {
                        size: style.size,
                        color: nodes.map(n => nodeColors[n.id]),
                        symbol: style.marker,
                        line: {
                            color: '#2c3e50',
                            width: style.lineWidth
                        }
                    },
                    hovertemplate: '<b>%{text}</b><br>x: %{x:.2f}<br>y: %{y:.2f}<extra></extra>'
                };

                traces.push(trace);
            });

            // Create annotations for transitions
            const annotations = [];
            const shapes = [];

            transiciones.forEach(trans => {
                const fromNode = nodos.find(n => n.id === trans.desde_nodo);
                const toNode = nodos.find(n => n.id === trans.hacia_nodo);

                if (!fromNode || !toNode) return;

                const x0 = fromNode.posicion.x;
                const y0 = fromNode.posicion.y;
                const x1 = toNode.posicion.x;
                const y1 = toNode.posicion.y;

                const confidence = trans.confianza || 'media';
                const style = CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES['media'];

                // Create arrow shape
                shapes.push({
                    type: 'line',
                    x0: x0,
                    y0: y0,
                    x1: x1,
                    y1: y1,
                    line: {
                        color: '#2c3e50',
                        width: style.width,
                        dash: style.dash
                    },
                    opacity: style.opacity
                });

                // Add label at midpoint
                const midX = (x0 + x1) / 2;
                const midY = (y0 + y1) / 2;

                annotations.push({
                    x: midX,
                    y: midY,
                    text: trans.evento_disparador || trans.id,
                    showarrow: false,
                    font: {
                        size: 8,
                        color: '#2c3e50',
                        family: 'sans-serif'
                    },
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                    borderpad: 2
                });
            });

            // Layout configuration
            const layout = {
                title: {
                    text: 'Escuelas Políticas Económicas: Espacio Posicional 2D',
                    font: { size: 18, family: 'sans-serif' }
                },
                xaxis: {
                    title: 'Arquitectura Económica: ← Economía Dirigida (Estado Fuerte) | Economía de Mercado (Estado Limitado) →',
                    range: [-1.2, 1.2],
                    zeroline: true,
                    zerolinecolor: 'gray',
                    zerolinewidth: 1,
                    gridcolor: '#e0e0e0'
                },
                yaxis: {
                    title: 'Objetivo Socioeconómico: ← Productividad y Crecimiento | Equidad y Sostenibilidad →',
                    range: [-1.1, 1.1],
                    zeroline: true,
                    zerolinecolor: 'gray',
                    zerolinewidth: 1,
                    gridcolor: '#e0e0e0'
                },
                plot_bgcolor: '#f8f9fa',
                paper_bgcolor: 'white',
                hovermode: 'closest',
                showlegend: true,
                legend: {
                    x: 1.02,
                    y: 0.5,
                    xanchor: 'left',
                    yanchor: 'middle'
                },
                annotations: annotations,
                shapes: shapes,
                margin: { l: 60, r: 100, t: 60, b: 60 }
            };

            // Update the chart
            const plotDiv = document.querySelector('.plotly-graph-div') || document.querySelector('[id*="plotly"]');
            if (plotDiv) {
                console.log('Updating plot with', nodos.length, 'nodes');
                Plotly.react(plotDiv, traces, layout, { responsive: true });
            } else {
                console.error('Plotly graph div not found');
                console.log('Available divs:', document.querySelectorAll('div'));
            }
        }

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    </script>
"""

    def _generar_leyenda_pedagogica_html(self) -> str:
        """
        Genera el HTML de la leyenda pedagógica a partir de los datos del JSON.

        Returns:
            HTML de la leyenda pedagógica
        """
        # Sección de siglas
        siglas_items = [
            f"<div>{sigla} = {info['nombre_completo']}</div>"
            for sigla, info in sorted(self.siglas_escuelas.items())
        ]
        siglas_html = "\n".join(siglas_items)

        # Sección de guía temática
        guia_items = []
        for idx, tema in enumerate(self.guia_tematica, 1):
            siglas_str = ", ".join(tema['siglas'])
            guia_items.append(
                f'<div class="guia-item"><strong>{idx}. {tema["titulo"]}:</strong> {siglas_str}</div>'
            )
        guia_html = "\n".join(guia_items)

        # Construir leyenda completa
        leyenda = f"""
            <div class="pedagogical-legend">
                <h3>Guía Pedagógica</h3>

                <h4>SIGLAS:</h4>
                <div class="siglas-list">
{siglas_html}
                </div>

                <h4>TRANSICIONES (flechas):</h4>
                <div>
                    <div>━━━ Muy alta confianza</div>
                    <div>- - - Confianza media</div>
                    <div>··· Baja confianza</div>
                </div>

                <h4>GUÍA TEMÁTICA:</h4>
{guia_html}

                <div class="advertencia">
                    ⚠ {self.advertencia}
                </div>
            </div>
"""
        return leyenda


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
