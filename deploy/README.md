# Publicar los simuladores con ngrok

Un único túnel de ngrok sirve los dos simuladores (compilados para producción) y una portada:

| URL | Contenido |
|---|---|
| `https://<NGROK_DOMAIN>/` | Portada con enlaces a los dos simuladores |
| `https://<NGROK_DOMAIN>/uber/` | Simulador de precio dinámico (Uber) |
| `https://<NGROK_DOMAIN>/idealista/` | Simulador de valoración (idealista) |

El plan gratuito de ngrok incluye **un** dominio estático, por eso los dos simuladores comparten dominio y se separan por ruta.

## Preparación (una vez)

```bash
brew install ngrok
ngrok config add-authtoken <tu-token>      # https://dashboard.ngrok.com/get-started/your-authtoken
cp deploy/ngrok.env.example deploy/ngrok.env   # ajusta NGROK_DOMAIN si cambia
(cd deploy && npx pnpm@10 install)         # solo para generar los QR
```

## Publicar

```bash
./deploy/deploy.sh             # compila, sirve en :8080 y abre el túnel
./deploy/deploy.sh --local     # igual, sin ngrok (http://localhost:8080)
./deploy/deploy.sh --no-build  # reutiliza la última compilación
```

Los simuladores solo están accesibles mientras el script esté en marcha y el ordenador encendido.

`bun run start` lo lanza junto con la presentación general (es + en), los simuladores y JupyterLab (servidor `deploy` de `start-all.sh`); `bun run start --all` lanza además el resto de presentaciones. Si ngrok no está instalado, se sirve solo en local.

## Códigos QR

```bash
node deploy/make-qr.mjs
```

Genera `public/qr/simulator.svg` en cada presentación y PNG de 1200 px en `deploy/qr/`:

| Presentación | El QR abre |
|---|---|
| `general/es`, `general/en` | la portada (`/`) |
| `uber/es`, `uber/en` | `/uber/` |
| `idealista/es`, `idealista/en` | `/idealista/` |

El componente `<SimulatorQr>` lo muestra en la diapositiva de cierre. Si cambias de dominio, edita `deploy/ngrok.env`, vuelve a ejecutar `make-qr.mjs` y reexporta los PDF.

## Notas

- **Aviso de ngrok:** con el plan gratuito, la primera visita muestra una página de aviso de ngrok; el visitante pulsa *Visit Site* y continúa. Solo desaparece con un plan de pago.
- **Servidor de desarrollo:** `vite.config.ts` admite hosts `*.ngrok-free.dev`, así que también puedes hacer `ngrok http 5183` sobre `pnpm dev`, pero la compilación de producción carga más rápido en el móvil.
