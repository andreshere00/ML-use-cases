import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // allowedHosts: permite abrir el servidor de desarrollo a través de ngrok.
  server: { port: 5183, allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.app'] },
})
