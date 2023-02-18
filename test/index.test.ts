import { describe, expect, it } from "vitest"

import jsxlike from "../src"

describe("jsxlike", () => {
  it("Default", () => {
    const result = jsxlike(`<p class="aaa">bbb</p><div></div>`)
    expect(result).toEqual(`<p className="aaa">bbb</p><div />`)
  })

  it("Custom mapAttrs", () => {
    const result = jsxlike(`<p class="aaa">bbb</p><div data-ccc=""></div>`, {
      mapAttrs: { "data-ccc": "dataCcc" },
    })
    expect(result).toEqual(`<p className="aaa">bbb</p><div dataCcc="" />`)
  })
})
