import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Entry point for the library
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'MyChatWidget',
      fileName: (format) => `my-chat-widget.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    outDir: 'dist',
  }
})
