import { describe, expect, it } from "vitest"

import { htmlToJsx } from "../src/core"

describe("htmlToJsx", () => {
  it("converts common React attributes and void elements", async () => {
    const result = await htmlToJsx(
      `<label for="name" class="field"><img src="/a.jpg" alt="A"><input id="name" readonly></label>`,
    )

    expect(result.code).toContain('className="field"')
    expect(result.code).toContain('htmlFor="name"')
    expect(result.code).toContain('<img src="/a.jpg" alt="A" />')
    expect(result.code).toContain("readOnly")
  })

  it("parses complex inline styles without splitting data URLs", async () => {
    const result = await htmlToJsx(
      `<div style="background-image: url(data:image/svg+xml;base64,PHN2Zz4=); border-radius: 8px"></div>`,
    )

    expect(result.code).toContain("backgroundImage")
    expect(result.code).toContain("data:image/svg+xml;base64,PHN2Zz4=")
    expect(result.code).toContain("borderRadius")
    expect(result.warnings).toEqual([])
  })

  it("keeps data and aria attributes", async () => {
    const result = await htmlToJsx(
      `<button data-id="42" aria-label="Open">Open</button>`,
    )

    expect(result.code).toContain('data-id="42"')
    expect(result.code).toContain('aria-label="Open"')
  })

  it("omits string event handlers with a warning", async () => {
    const result = await htmlToJsx(`<button onclick="alert(1)">Open</button>`)

    expect(result.code).not.toContain("onclick")
    expect(result.code).not.toContain("onClick")
    expect(result.warnings.some((warning) => warning.code === "event-handler-omitted")).toBe(true)
  })

  it("handles script and style text safely", async () => {
    const result = await htmlToJsx(
      `<style>.a { color: red; }</style><script>const value = \`x${"${y}"}\`</script>`,
    )

    expect(result.code).toContain("dangerouslySetInnerHTML")
    expect(result.code).toContain("const value")
  })

  it("supports SVG attributes", async () => {
    const result = await htmlToJsx(
      `<svg viewBox="0 0 10 10"><path stroke-width="2" fill-rule="evenodd"></path></svg>`,
    )

    expect(result.code).toContain('viewBox="0 0 10 10"')
    expect(result.code).toContain('strokeWidth="2"')
    expect(result.code).toContain('fillRule="evenodd"')
  })

  it("can wrap output as a component", async () => {
    const result = await htmlToJsx(`<main>Hello</main>`, {
      mode: "component",
      componentName: "Hero",
    })

    expect(result.code).toContain("export default function Hero()")
    expect(result.code).toContain("<main>Hello</main>")
  })

  it("only collapses non-void empty elements when requested", async () => {
    const normal = await htmlToJsx(`<div></div><img src="a">`)
    const collapsed = await htmlToJsx(`<div></div>`, {
      collapseEmptyElements: true,
    })

    expect(normal.code).toContain("<div></div>")
    expect(normal.code).toContain('<img src="a" />')
    expect(collapsed.code).toContain("<div />")
  })
})
