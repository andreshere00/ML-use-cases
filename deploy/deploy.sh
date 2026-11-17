#!/usr/bin/env bash
# Publica los dos simuladores en Internet con un único túnel de ngrok.
#
#   https://<NGROK_DOMAIN>/            portada con los dos simuladores
#   https://<NGROK_DOMAIN>/uber/       simulador de precio dinámico (Uber)
#   https://<NGROK_DOMAIN>/idealista/  simulador de valoración (idealista)
#
# Uso:
#   ./deploy/deploy.sh             # compila, sirve y abre el túnel
#   ./deploy/deploy.sh --no-build  # reutiliza la última compilación
#   ./deploy/deploy.sh --local     # compila y sirve sin ngrok (para probar)
#
# Requisitos: Node.js, ngrok (brew install ngrok) con authtoken configurado
# (ngrok config add-authtoken <token>) y deploy/ngrok.env (ver ngrok.env.example).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/tmp/deploy/site"
BUILD=1
TUNNEL=1
for arg in "$@"; do
  case "$arg" in
    --no-build) BUILD=0 ;;
    --local) TUNNEL=0 ;;
    -h|--help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Opción desconocida: $arg" >&2; exit 1 ;;
  esac
done

ENV_FILE="$ROOT/deploy/ngrok.env"
[ -f "$ENV_FILE" ] || ENV_FILE="$ROOT/deploy/ngrok.env.example"
# shellcheck disable=SC1090
source "$ENV_FILE"
PORT="${PORT:-8080}"

if command -v pnpm >/dev/null 2>&1; then PNPM="pnpm"; else PNPM="npx --yes pnpm@10"; fi

build_sim() { # $1 = carpeta del simulador, $2 = ruta pública
  local dir="$ROOT/$1/simulator"
  [ -d "$dir/node_modules" ] || (cd "$dir" && $PNPM install --frozen-lockfile)
  echo "Compilando $1 -> /$2/"
  (cd "$dir" && node node_modules/vite/bin/vite.js build --base="/$2/" \
     --outDir "$SITE/$2" --emptyOutDir --logLevel warn)
}

if [ "$BUILD" = 1 ]; then
  rm -rf "$SITE" && mkdir -p "$SITE"
  build_sim uber uber
  build_sim idealista idealista
  cp "$ROOT/deploy/landing.html" "$SITE/index.html"
fi
[ -f "$SITE/index.html" ] || { echo "No hay compilación: ejecuta sin --no-build." >&2; exit 1; }

node "$ROOT/deploy/serve.mjs" "$PORT" &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT INT TERM

if [ "$TUNNEL" = 0 ]; then
  echo "Modo local: http://localhost:$PORT  (Ctrl+C para parar)"
  wait $SERVER_PID
  exit 0
fi

command -v ngrok >/dev/null 2>&1 || { echo "Falta ngrok: brew install ngrok" >&2; exit 1; }
[ -n "${NGROK_DOMAIN:-}" ] || { echo "Define NGROK_DOMAIN en deploy/ngrok.env" >&2; exit 1; }

echo
echo "Publicando en https://$NGROK_DOMAIN"
echo "  Uber:      https://$NGROK_DOMAIN/uber/"
echo "  idealista: https://$NGROK_DOMAIN/idealista/"
echo
ngrok http "$PORT" --url "https://$NGROK_DOMAIN" --log stdout --log-level warn
