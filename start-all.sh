#!/usr/bin/env bash
# Lanza a la vez todos los servidores del repositorio:
#   - las 10 presentaciones Slidev (5 casos x 2 idiomas),
#   - los simuladores de Uber e idealista,
#   - JupyterLab con los notebooks.
#
# Uso:
#   ./start-all.sh                 # todo
#   ./start-all.sh slides sims     # solo algunos grupos: slides, sims, notebooks
#
# Ctrl+C detiene todos los servidores. Los logs quedan en tmp/start-all/.

set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT/tmp/start-all"
mkdir -p "$LOG_DIR"

# Grupos a lanzar (por defecto, todos).
GROUPS_WANTED="${*:-slides sims notebooks}"
for g in $GROUPS_WANTED; do
  case "$g" in
    slides|sims|notebooks) ;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Grupo desconocido: $g (usa slides, sims o notebooks)" >&2; exit 1 ;;
  esac
done
wants() { case " $GROUPS_WANTED " in *" $1 "*) return 0 ;; *) return 1 ;; esac; }

# pnpm instalado o, si no, el de npx.
if command -v pnpm >/dev/null 2>&1; then
  PNPM="pnpm"
else
  PNPM="npx --yes pnpm@10"
fi

# Al salir (Ctrl+C, error o fin), se detiene todo el grupo de procesos.
trap 'trap - INT TERM EXIT; echo; echo "Deteniendo servidores..."; kill 0 2>/dev/null; wait 2>/dev/null' INT TERM EXIT

SUMMARY=""
add_summary() { SUMMARY="$SUMMARY$(printf '  %-22s %s' "$1" "$2")"$'\n'; }

ensure_node_deps() {
  if [ ! -d "$ROOT/$1/node_modules" ]; then
    echo "Instalando dependencias de $1..."
    (cd "$ROOT/$1" && $PNPM install --frozen-lockfile) || { echo "Falló pnpm install en $1" >&2; return 1; }
  fi
}

# start <nombre> <carpeta> <url> <comando...>
start() {
  local name="$1" dir="$2" url="$3"; shift 3
  local log="$LOG_DIR/$(echo "$name" | tr '/ ' '--').log"
  (cd "$ROOT/$dir" && exec "$@") >"$log" 2>&1 &
  add_summary "$name" "$url"
}

if wants slides; then
  port=3030
  for case_dir in general idealista cabify spotify uber; do
    for lang in es en; do
      dir="$case_dir/$lang"
      ensure_node_deps "$dir" || { port=$((port + 1)); continue; }
      start "$dir" "$dir" "http://localhost:$port" $PNPM exec slidev slides.md --port "$port"
      port=$((port + 1))
    done
  done
fi

if wants sims; then
  ensure_node_deps uber/simulator &&
    start "uber/simulator" uber/simulator "http://localhost:5183" $PNPM exec vite --port 5183 --strictPort
  ensure_node_deps idealista/simulator &&
    start "idealista/simulator" idealista/simulator "http://localhost:5184" $PNPM exec vite --port 5184 --strictPort
fi

if wants notebooks; then
  if command -v uv >/dev/null 2>&1; then
    (cd "$ROOT/notebooks" && uv sync --quiet) || echo "Falló uv sync en notebooks" >&2
    start "notebooks" notebooks "http://localhost:8888/lab" \
      uv run jupyter lab --no-browser --port 8888 --IdentityProvider.token=''
  else
    echo "uv no está instalado: se omiten los notebooks." >&2
  fi
fi

echo
echo "Servidores en marcha (logs en tmp/start-all/):"
printf '%s' "$SUMMARY"
echo
echo "Pulsa Ctrl+C para detenerlos todos."
wait
