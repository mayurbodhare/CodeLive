import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        "/socket.io": {
            target: process.env.VITE_BACKEND_URL || "https://codelive-ulrf.onrender.com",
            ws: true,  // Enable WebSockets proxy
            changeOrigin: true,
            secure: true,
        },
    },
},
})
