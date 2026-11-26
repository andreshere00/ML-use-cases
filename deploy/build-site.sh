#!/usr/bin/env bash
# Compila el sitio estático completo (simuladores, presentaciones y portada).
#
#   <base>/                   portada
#   <base>/idealista/         simulador Idealista
#   <base>/uber/              simulador Uber
#   <base>/presentation/en/   presentación en inglés
#   <base>/presentacion/es/   presentación en castellano
#
# Uso: ./deploy/build-site.sh [directorio-de-salida]
#   SITE_BASE=/ML-use-cases   prefijo de la URL (GitHub Pages). Vacío por defecto (raíz).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${1:-$ROOT/tmp/deploy/site}"
BASE="${SITE_BASE:-}"; BASE="${BASE%/}"

if command -v pnpm >/dev/null 2>&1; then PNPM="pnpm"; else PNPM="npx --yes pnpm@10"; fi

install_deps() { # $1 = carpeta
  [ -d "$ROOT/$1/node_modules" ] || (cd "$ROOT/$1" && $PNPM install --frozen-lockfile)
}

build_sim() { # $1 = carpeta del simulador, $2 = ruta pública
  install_deps "$1/simulator"
  echo "Compilando $1/simulator -> $BASE/$2/"
  (cd "$ROOT/$1/simulator" && node node_modules/vite/bin/vite.js build --base="$BASE/$2/" \
     --outDir "$SITE/$2" --emptyOutDir --logLevel warn)
}

build_deck() { # $1 = carpeta de la presentación, $2 = ruta pública
  install_deps "$1"
  echo "Compilando $1 -> $BASE/$2/"
  (cd "$ROOT/$1" && node node_modules/@slidev/cli/bin/slidev.mjs build slides.md \
     --base "$BASE/$2/" --out "$SITE/$2")
  # Fallback para enlaces directos a una diapositiva (GitHub Pages sirve 404.html).
  cp "$SITE/$2/index.html" "$SITE/$2/404.html"
}

rm -rf "$SITE" && mkdir -p "$SITE"
build_sim idealista idealista
build_sim uber uber
build_deck general/en presentation/en
build_deck general/es presentacion/es
cp "$ROOT/deploy/landing.html" "$SITE/index.html"
touch "$SITE/.nojekyll"
echo "Sitio listo en $SITE"
