import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "react",
        replacement: "preact/compat",
      },
      {
        find: "react-dom",
        replacement: "preact/compat",
      },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name][extname]`,
      },
    },
    //minify: false,
  },
})
