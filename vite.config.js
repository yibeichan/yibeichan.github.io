import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths work correctly
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})