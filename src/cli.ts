#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises"
import process from "node:process"
import { cac } from "cac"

import { htmlToJsx, type OutputMode } from "./core.js"

const cli = cac("jsxlike")

cli
  .command("[input]", "Convert HTML from a file or stdin into React JSX")
  .option("-o, --output <file>", "Write JSX to a file instead of stdout")
  .option("--mode <mode>", "Output mode: fragment or component", {
    default: "fragment",
  })
  .option("--name <name>", "Component name used with --mode component", {
    default: "Component",
  })
  .option("--indent <size>", "Indent size", { default: 2 })
  .option("--collapse-empty", "Collapse empty non-void elements")
  .action(async (input: string | undefined, flags) => {
    const html = input ? await readFile(input, "utf8") : await readStdin()
    const mode: OutputMode = flags.mode === "component" ? "component" : "fragment"

    const result = await htmlToJsx(html, {
      mode,
      componentName: flags.name,
      indentSize: Number(flags.indent) || 2,
      collapseEmptyElements: Boolean(flags.collapseEmpty),
    })

    if (flags.output) {
      await writeFile(flags.output, `${result.code}\n`, "utf8")
    } else {
      process.stdout.write(`${result.code}\n`)
    }

    for (const warning of result.warnings) {
      process.stderr.write(`[jsxlike:${warning.code}] ${warning.message}\n`)
    }
  })

cli.help()
cli.version("2.0.0")
cli.parse()

async function readStdin() {
  if (process.stdin.isTTY) return ""

  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString("utf8")
}
