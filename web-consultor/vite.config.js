// web-consultor/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADICIONE ISTO: Força a resolução de arquivos .jsx
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
})