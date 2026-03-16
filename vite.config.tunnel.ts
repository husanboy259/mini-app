/**
 * Vite dev server HTTP rejimida (tunnel uchun).
 * Ngrok HTTPS qiladi; localhost da HTTP yetadi.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // 5173 band bo'lsa boshqa portga o'tmaslik — tunnel 5173 ga ulanadi
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io', '.ngrok-free.app', 'localhost'],
  },
})
