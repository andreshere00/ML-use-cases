"""Estilo visual de InnoIT para las gráficas de matplotlib de los notebooks.

Usa los mismos tokens que el tema de Slidev (`theme/styles/tokens.css`) y los exploradores:
morado #4D225D como color principal, coral #E64366 como acento, lavanda #EDE9EF para
fondos y rejillas, y la tipografía Urbane (300 para el texto, 600 para los títulos).

    import innoit_style as inno
    inno.aplicar()
"""
import logging
from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.colors import LinearSegmentedColormap

# Tokens de marca (tokens.css)
MORADO = '#4D225D'
CORAL = '#E64366'
LAVANDA = '#EDE9EF'
GRIS = '#A8A8A8'
TEXTO_SUAVE = '#73687A'
BLANCO = '#FFFFFF'
CORAL_CLARO = '#FFF3F5'
LAVANDA_OSCURA = '#D8D0DC'

# Paleta categórica de los exploradores (SpotifyClusteringExplorer.vue)
PALETA = ['#4D225D', '#E64366', '#237C82', '#A16A16', '#466DB4',
          '#8F5195', '#6B7933', '#C65D36', '#395E59', '#88566B']
TEAL = PALETA[2]

# Escalas de color
SECUENCIAL = LinearSegmentedColormap.from_list('inno', [LAVANDA, '#A98BB4', MORADO])
DIVERGENTE = LinearSegmentedColormap.from_list('inno_div', [MORADO, '#A98BB4', BLANCO, '#F29AAE', CORAL])

FUENTE = 'Urbane'
_FUENTES_REPO = Path(__file__).resolve().parent.parent / 'general' / 'es' / 'public' / 'fonts'
_CACHE = Path(__file__).resolve().parent / '.fonts'


def _registrar_urbane():
    """Convierte los .woff2 del repositorio a .otf (una sola vez) y los registra en matplotlib.

    Los tres pesos se agrupan bajo la familia «Urbane» para poder usar fontweight=300/500/600.
    """
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        return False
    _CACHE.mkdir(exist_ok=True)
    nombres = {300: 'Light', 500: 'Medium', 600: 'DemiBold'}
    for peso, estilo in nombres.items():
        destino = _CACHE / f'Urbane-{estilo}.otf'
        origen = _FUENTES_REPO / f'urbane-{peso}.woff2'
        if not destino.exists():
            if not origen.exists():
                return False
            f = TTFont(origen)
            f.flavor = None
            tabla = f['name']
            for rec in list(tabla.names):
                if rec.nameID in (1, 16):
                    tabla.setName(FUENTE, rec.nameID, rec.platformID, rec.platEncID, rec.langID)
                elif rec.nameID in (2, 17):
                    tabla.setName(estilo, rec.nameID, rec.platformID, rec.platEncID, rec.langID)
            f['OS/2'].usWeightClass = peso
            f.save(destino)
        font_manager.fontManager.addfont(str(destino))
    return True


def aplicar():
    """Aplica el estilo InnoIT a todas las gráficas siguientes."""
    hay_urbane = _registrar_urbane()
    logging.getLogger('matplotlib.font_manager').setLevel(logging.ERROR)   # sin avisos de pesos aproximados
    mpl.colormaps.register(SECUENCIAL, force=True)
    mpl.colormaps.register(DIVERGENTE, force=True)
    plt.rcParams.update({
        'figure.dpi': 110,
        'figure.facecolor': BLANCO,
        'savefig.facecolor': BLANCO,
        # DejaVu Sans solo cubre los símbolos que Urbane no trae (β, →, ≥…)
        'font.family': [FUENTE, 'DejaVu Sans'] if hay_urbane else ['Arial', 'DejaVu Sans'],
        'axes.unicode_minus': False,   # Urbane no tiene el signo menos tipográfico
        'font.weight': 300,
        'font.size': 10.5,
        'text.color': MORADO,
        'axes.facecolor': BLANCO,
        'axes.edgecolor': LAVANDA_OSCURA,
        'axes.linewidth': 1,
        'axes.labelcolor': TEXTO_SUAVE,
        'axes.labelweight': 300,
        'axes.titlecolor': MORADO,
        'axes.titleweight': 600,
        'axes.titlesize': 12.5,
        'axes.titlelocation': 'left',
        'axes.titlepad': 10,
        'axes.spines.top': False,
        'axes.spines.right': False,
        'axes.grid': True,
        'axes.axisbelow': True,
        'axes.prop_cycle': mpl.cycler(color=PALETA),
        'grid.color': LAVANDA,
        'grid.linewidth': 1,
        'grid.alpha': 1,
        'xtick.color': TEXTO_SUAVE,
        'ytick.color': TEXTO_SUAVE,
        'xtick.labelcolor': TEXTO_SUAVE,
        'ytick.labelcolor': TEXTO_SUAVE,
        'xtick.major.size': 0,
        'ytick.major.size': 0,
        'legend.frameon': False,
        'legend.fontsize': 9,
        'legend.labelcolor': MORADO,
        'image.cmap': 'inno',
        'lines.linewidth': 2,
        'patch.edgecolor': BLANCO,
        'scatter.edgecolors': 'none',
        'figure.titleweight': 600,
        'figure.titlesize': 14,
    })


def cascada(ax, base, nombres, contribs, etiqueta_base='Media', etiqueta_total='Resultado', fmt='{:,.0f}'):
    """Gráfico de cascada: parte de una línea base y suma cada contribución hasta el resultado.

    Gris = punto de partida, coral = suma, teal = resta, morado = resultado.
    """
    xs = [etiqueta_base] + list(nombres) + [etiqueta_total]
    acc, bottoms, heights, colors = base, [0], [base], [GRIS]
    for c in contribs:
        bottoms.append(acc if c >= 0 else acc + c); heights.append(abs(c))
        colors.append(CORAL if c >= 0 else TEAL); acc += c
    bottoms.append(0); heights.append(acc); colors.append(MORADO)
    ax.bar(range(len(xs)), heights, bottom=bottoms, color=colors, width=.62)
    for i, (b, h) in enumerate(zip(bottoms, heights)):
        extremo = i in (0, len(xs) - 1)
        valor = h if extremo else contribs[i - 1]
        texto = fmt.format(valor) if extremo else ('+' if valor >= 0 else '') + fmt.format(valor)
        ax.text(i, max(b, b + h), texto, ha='center', va='bottom', fontsize=8.5,
                color=MORADO, fontweight=600 if extremo else 300)
    ax.axhline(0, color=MORADO, lw=.8)
    ax.set_xticks(range(len(xs)), xs, rotation=30, ha='right')
    ax.grid(axis='x', visible=False)
    return acc
