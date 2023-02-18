import { describe, expect, it } from "vitest"

import { resolveOptions } from "../src/options"

describe("resolveOptions", () => {
  it("Default", () => {
    const result = resolveOptions({})
    expect(result.styleTags).toEqual(true)
  })

  it("Custom", () => {
    const result = resolveOptions({ styleTags: false })
    expect(result.styleTags).toEqual(false)
  })
})
