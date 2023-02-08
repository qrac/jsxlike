import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "jsxlike",
      fileName: (format) => {
        if (format === "umd") {
          return "jsxlike.js"
        }
        if (format === "es") {
          return "jsxlike.esm.js"
        }
        return `jsxlike.${format}.js`
      },
    },
  },
})
