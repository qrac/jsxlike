import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["./test/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "./app/**/*.*"],
    testTimeout: 20000,
  },
})
