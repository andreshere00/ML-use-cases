#!/usr/bin/env bash
# Lanza los servidores del repositorio: presentaciones Slidev, simuladores y JupyterLab.
#
# Uso:
#   ./start-all.sh                    # presentaciones + notebooks + deploy (ngrok con los dos simuladores)
#   ./start-all.sh all                # todo, incluidos los simuladores por separado
#   ./start-all.sh slides sims        # grupos: slides, sims, notebooks, deploy
#   ./start-all.sh uber-es uber-sim   # servidores concretos (ver lista abajo)
#   ./start-all.sh --setup            # solo instala las dependencias que falten
#   ./start-all.sh --no-open ...      # no abre el navegador
#
# Servidores: general-es general-en idealista-es idealista-en cabify-es cabify-en
#             spotify-es spotify-en uber-es uber-en uber-sim idealista-sim notebooks deploy
#
# "deploy" compila los dos simuladores, los sirve juntos (uber/ e idealista/) y abre
# el túnel de ngrok (ver deploy/README.md). Sin ngrok instalado, los sirve solo en local.
# Por eso, sin argumentos no se lanzan los simuladores por separado.
#
# Cada servidor se abre en el navegador en cuanto responde (salvo con --no-open y salvo
# deploy). Con un solo servidor, su salida va a la terminal. Con varios, va a tmp/start-all/.
# Ctrl+C los detiene todos.

set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT/tmp/start-all"

# Puerto del servidor de deploy: el mismo que usa deploy/deploy.sh (PORT en deploy/ngrok.env).
DEPLOY_PORT=8080
for f in "$ROOT/deploy/ngrok.env" "$ROOT/deploy/ngrok.env.example"; do
  [ -f "$f" ] || continue
  p="$(sed -n 's/^PORT=\([0-9][0-9]*\).*/\1/p' "$f" | head -n1)"
  [ -z "$p" ] || { DEPLOY_PORT="$p"; break; }
done

# Catálogo: nombre|carpeta|puerto|tipo|grupo
CATALOG="
general-es|general/es|3030|slidev|slides
general-en|general/en|3031|slidev|slides
idealista-es|idealista/es|3032|slidev|slides
idealista-en|idealista/en|3033|slidev|slides
cabify-es|cabify/es|3034|slidev|slides
cabify-en|cabify/en|3035|slidev|slides
spotify-es|spotify/es|3036|slidev|slides
spotify-en|spotify/en|3037|slidev|slides
uber-es|uber/es|3038|slidev|slides
uber-en|uber/en|3039|slidev|slides
uber-sim|uber/simulator|5183|vite|sims
idealista-sim|idealista/simulator|5184|vite|sims
notebooks|notebooks|8888|jupyter|notebooks
deploy|.|$DEPLOY_PORT|deploy|deploy
"

usage() { sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'; }

# --- Argumentos -> lista de servidores seleccionados -------------------------
SETUP_ONLY=0
OPEN_BROWSER=1
SELECTED=""
select_where() { # $1 = columna (1 nombre, 5 grupo), $2 = valor
  local hits
  hits="$(echo "$CATALOG" | awk -F'|' -v c="$1" -v v="$2" 'NF && $c == v { print $1 }')"
  [ -n "$hits" ] || return 1
  SELECTED="$SELECTED $hits"
}

for arg in "$@"; do
  case "$arg" in
    -h|--help) usage; exit 0 ;;
    --no-open) OPEN_BROWSER=0 ;;
    --setup) SETUP_ONLY=1; select_where 5 slides; select_where 5 sims; select_where 5 notebooks ;;
    all) select_where 5 slides; select_where 5 sims; select_where 5 notebooks; select_where 5 deploy ;;
    *) select_where 5 "$arg" || select_where 1 "$arg" || {
         echo "Desconocido: $arg" >&2; echo >&2; usage >&2; exit 1; } ;;
  esac
done
# Sin argumentos: los simuladores van juntos en deploy, no por separado.
[ -n "$SELECTED" ] || { select_where 5 slides; select_where 5 notebooks; select_where 5 deploy; }
# Quita duplicados conservando el orden.
SELECTED="$(echo $SELECTED | tr ' ' '\n' | awk '!seen[$0]++' | tr '\n' ' ')"

# --- Herramientas -------------------------------------------------------------
if command -v pnpm >/dev/null 2>&1; then
  PNPM="pnpm"
else
  PNPM="npx --yes pnpm@10"
fi

ensure_deps() { # $1 = carpeta, $2 = tipo
  if [ "$2" = deploy ]; then
    return 0  # deploy.sh instala lo que falte al compilar los simuladores
  elif [ "$2" = jupyter ]; then
    command -v uv >/dev/null 2>&1 || { echo "uv no está instalado: se omiten los notebooks." >&2; return 1; }
    (cd "$ROOT/$1" && uv sync --quiet) || { echo "Falló uv sync en $1" >&2; return 1; }
  elif [ ! -d "$ROOT/$1/node_modules" ]; then
    echo "Instalando dependencias de $1..."
    (cd "$ROOT/$1" && $PNPM install --frozen-lockfile) || { echo "Falló pnpm install en $1" >&2; return 1; }
  fi
}

command_for() { # $1 = tipo, $2 = puerto
  case "$1" in
    slidev)  echo "$PNPM exec slidev slides.md --port $2" ;;
    vite)    echo "$PNPM exec vite --port $2 --strictPort" ;;
    jupyter) echo "uv run jupyter lab --no-browser --port $2 --IdentityProvider.token=" ;;
    deploy)
      if command -v ngrok >/dev/null 2>&1; then echo "./deploy/deploy.sh"
      else echo "./deploy/deploy.sh --local"; fi ;;
  esac
}

# Abre la URL en el navegador en cuanto el servidor responde (máx. 3 minutos).
open_when_ready() { # $1 = url
  [ "$OPEN_BROWSER" = 1 ] || return 0
  local opener
  if command -v open >/dev/null 2>&1; then opener=open
  elif command -v xdg-open >/dev/null 2>&1; then opener=xdg-open
  else return 0; fi
  (
    for _ in $(seq 1 180); do
      if curl -s -o /dev/null --max-time 2 "$1"; then $opener "$1" >/dev/null 2>&1; exit 0; fi
      sleep 1
    done
  ) &
}

url_for() { [ "$1" = jupyter ] && echo "http://localhost:$2/lab" || echo "http://localhost:$2"; }

# Dominio público de ngrok (para mostrarlo al lanzar deploy).
ngrok_domain() {
  local f
  for f in "$ROOT/deploy/ngrok.env" "$ROOT/deploy/ngrok.env.example"; do
    [ -f "$f" ] || continue
    sed -n 's/^NGROK_DOMAIN=\(.*\)$/\1/p' "$f" | head -n1
    return 0
  done
}

# Texto extra que se muestra junto a la URL de cada servidor.
note_for() { # $1 = tipo
  [ "$1" = deploy ] || return 0
  if command -v ngrok >/dev/null 2>&1; then
    echo " (público: https://$(ngrok_domain)/)"
  else
    echo " (ngrok no instalado: solo local; brew install ngrok)"
  fi
}

# --- Preparar dependencias ----------------------------------------------------
READY=""
for name in $SELECTED; do
  IFS='|' read -r _ dir port kind _ <<EOF
$(echo "$CATALOG" | awk -F'|' -v n="$name" '$1 == n')
EOF
  ensure_deps "$dir" "$kind" && READY="$READY $name"
done

if [ "$SETUP_ONLY" = 1 ]; then
  echo "Dependencias listas."
  exit 0
fi

set -- $READY
[ $# -gt 0 ] || { echo "No hay nada que lanzar." >&2; exit 1; }

# --- Un solo servidor: en primer plano ----------------------------------------
if [ $# -eq 1 ]; then
  IFS='|' read -r name dir port kind _ <<EOF
$(echo "$CATALOG" | awk -F'|' -v n="$1" '$1 == n')
EOF
  echo "$name -> $(url_for "$kind" "$port")$(note_for "$kind")"
  [ "$kind" = deploy ] || open_when_ready "$(url_for "$kind" "$port")"
  cd "$ROOT/$dir" && exec $(command_for "$kind" "$port")
fi

# --- Varios servidores: en segundo plano, con logs ----------------------------
mkdir -p "$LOG_DIR"
trap 'trap - INT TERM EXIT; echo; echo "Deteniendo servidores..."; kill 0 2>/dev/null; wait 2>/dev/null' INT TERM EXIT

echo
echo "Servidores en marcha (logs en tmp/start-all/):"
for name in "$@"; do
  IFS='|' read -r _ dir port kind _ <<EOF
$(echo "$CATALOG" | awk -F'|' -v n="$name" '$1 == n')
EOF
  (cd "$ROOT/$dir" && exec $(command_for "$kind" "$port")) >"$LOG_DIR/$name.log" 2>&1 &
  printf '  %-15s %s%s\n' "$name" "$(url_for "$kind" "$port")" "$(note_for "$kind")"
  [ "$kind" = deploy ] || open_when_ready "$(url_for "$kind" "$port")"
done
echo
echo "Pulsa Ctrl+C para detenerlos todos."
wait
