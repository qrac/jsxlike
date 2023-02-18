import { describe, expect, it } from "vitest"

import {
  replaceExtractTags,
  replaceMapAttrs,
  replaceStyleName,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
  replaceVoidTags,
  replaceShortTags,
  replaceAbsolutePath,
} from "../src/replace"

describe("replaceExtractTags", () => {
  it("Blank", () => {
    const result = replaceExtractTags(`<p class="a"></p><div></div>`, [])
    expect(result).toEqual(`<p class="a"></p><div></div>`)
  })

  it("Extract one", () => {
    const result = replaceExtractTags(`<p class="a"></p><div></div>`, ["p"])
    expect(result).toEqual(`<p class="a"></p>`)
  })

  it("Extract no slash and slash", () => {
    const result = replaceExtractTags(
      `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><p class="a"></p><div></div><p></p>`,
      ["meta", "div"]
    )
    expect(result).toEqual(
      `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<div></div>`
    )
  })
})

describe("replaceMapAttrs", () => {
  it("Blank", () => {
    const result = replaceMapAttrs(`<p>aa</p>`, {})
    expect(result).toEqual(`<p>aa</p>`)
  })

  it("Replace", () => {
    const result = replaceMapAttrs(`<p class="test" data-a="test">a</p>`, {
      class: "className",
      "data-a": "data-b",
    })
    expect(result).toEqual(`<p className="test" data-b="test">a</p>`)
  })

  it("Replace with comment", () => {
    const result = replaceMapAttrs(`<p class="test">a</p><!-- class= -->`, {
      class: "className",
    })
    expect(result).toEqual(`<p className="test">a</p><!-- class= -->`)
  })

  it("Replace with containing a newline", () => {
    const result = replaceMapAttrs(`<p \nclass="test"\ndata-a="test"\n>a</p>`, {
      class: "className",
      "data-a": "data-b",
    })
    expect(result).toEqual(`<p \nclassName="test"\ndata-b="test"\n>a</p>`)
  })
})

describe("replaceStyleName", () => {
  it("Default", () => {
    const result = replaceStyleName("border")
    expect(result).toEqual("border")
  })

  it("Camelcase", () => {
    const result = replaceStyleName("border-radius")
    expect(result).toEqual("borderRadius")
  })

  it("Camelcase 2", () => {
    const result = replaceStyleName("border-block-end-color")
    expect(result).toEqual("borderBlockEndColor")
  })

  it("Vendor prefixes", () => {
    const result = replaceStyleName("-webkit-transform")
    expect(result).toEqual("WebkitTransform")
  })

  it("CSS Variables", () => {
    const result = replaceStyleName("--theme-color")
    expect(result).toEqual("--theme-color")
  })
})

describe("replaceStyleAttrs", () => {
  it("Default", () => {
    const result = replaceStyleAttrs(
      `<p style="display: block; border-radius: 8px">b</p>`
    )
    expect(result).toEqual(
      `<p style={{ display: "block", borderRadius: "8px" }}>b</p>`
    )
  })

  it("With CSS Variables", () => {
    const result = replaceStyleAttrs(
      `<p style="display: block; --test: 8px">b</p>`
    )
    expect(result).toEqual(
      `<p style={{ display: "block", "--test": "8px" }}>b</p>`
    )
  })
})

describe("replaceStyleTags", () => {
  it("Default", () => {
    const result = replaceStyleTags(
      `<style>.test > a { display: block; }</style>`
    )
    expect(result).toEqual(
      `<style dangerouslySetInnerHTML={{ __html: \`.test > a { display: block; }\` }} />`
    )
  })

  it("Containing a newline", () => {
    const result = replaceStyleTags(
      `<style>\n.test > a {\ndisplay: block;\n}\n</style>`
    )
    expect(result).toEqual(
      `<style dangerouslySetInnerHTML={{ __html: \`\n.test > a {\ndisplay: block;\n}\n\` }} />`
    )
  })

  it("Erase", () => {
    const result = replaceStyleTags(
      `<style>.test { display: block; }</style>`,
      true
    )
    expect(result).toEqual(``)
  })
})

describe("replaceScriptTags", () => {
  it("Default", () => {
    const result = replaceScriptTags(`<script>console.log("test")</script>`)
    expect(result).toEqual(
      `<script dangerouslySetInnerHTML={{ __html: \`console.log(\"test\")\` }} />`
    )
  })

  it("Containing a newline", () => {
    const result = replaceScriptTags(`<script>\nconsole.log("test")\n</script>`)
    expect(result).toEqual(
      `<script dangerouslySetInnerHTML={{ __html: \`\nconsole.log(\"test\")\n\` }} />`
    )
  })

  it("Erase", () => {
    const result = replaceScriptTags(
      `<script>console.log("test")</script>`,
      true
    )
    expect(result).toEqual(``)
  })
})

describe("replaceCommentTags", () => {
  it("Default", () => {
    const result = replaceCommentTags(`<!-- a --><p>b</p><!-- c -->`)
    expect(result).toEqual(`{/* a */}<p>b</p>{/* c */}`)
  })

  it("Containing a newline", () => {
    const result = replaceCommentTags(`<!-- aaa\naaa --><p>b</p><!-- c -->`)
    expect(result).toEqual(`{/* aaa\naaa */}<p>b</p>{/* c */}`)
  })

  it("Erase", () => {
    const result = replaceCommentTags(`<!-- a --><p>b</p><!-- c -->`, true)
    expect(result).toEqual(`<p>b</p>`)
  })
})

describe("replaceVoidTags", () => {
  it("Blank", () => {
    const result = replaceVoidTags(`<meta name="viewport">`, [])
    expect(result).toEqual(`<meta name="viewport">`)
  })

  it("Replace", () => {
    const result = replaceVoidTags(`<meta name="viewport">`, ["meta"])
    expect(result).toEqual(`<meta name="viewport" />`)
  })
})

describe("replaceShortTags", () => {
  it("Blank", () => {
    const result = replaceShortTags(`<p class="a"></p><div></div><a></a>`, [])
    expect(result).toEqual(`<p class="a"></p><div></div><a></a>`)
  })

  it("All", () => {
    const result = replaceShortTags(`<p class="a"></p><div></div><a></a>`, [
      "*",
    ])
    expect(result).toEqual(`<p class="a" /><div /><a />`)
  })

  it("All with containing a newline", () => {
    const result = replaceShortTags(
      `<p class="a">\n</p>\n<div>\n</div>\n<a>\n</a>`,
      ["*"]
    )
    expect(result).toEqual(`<p class="a" />\n<div />\n<a />`)
  })

  it("Tags", () => {
    const result = replaceShortTags(`<p class="a"></p><div></div><a></a>`, [
      "p",
      "a",
    ])
    expect(result).toEqual(`<p class="a" /><div></div><a />`)
  })
})

describe("replaceAbsolutePath", () => {
  it("Blank", () => {
    const result = replaceAbsolutePath(`<link href="/style.css">`)
    expect(result).toEqual(`<link href="/style.css">`)
  })

  it("Active", () => {
    const result = replaceAbsolutePath(
      `<link href="/style.css">`,
      "https://example.com",
      { link: ["href"] }
    )
    expect(result).toEqual(`<link href="https://example.com/style.css">`)
  })
})
