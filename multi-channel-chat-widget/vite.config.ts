import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "MyChatWidget",
      fileName: (format) => `my-chat-widget.${format}.js`,
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        exports: "named",
      },
    },
    outDir: "dist",
    cssCodeSplit: false,
  },
  css: {
    devSourcemap: true,
  },
});
