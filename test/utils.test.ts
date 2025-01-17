import { describe, expect, it } from "vitest"

import {
  replaceAttrNames,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
  replaceSingleTags,
  replaceCloseTags,
} from "../src/utils"

describe("replaceAttrNames", () => {
  it("Default", () => {
    const result = replaceAttrNames(`<p class="test" data-a="test">a</p>`)
    expect(result).toEqual(`<p className="test" data-a="test">a</p>`)
  })

  it("Default with comment", () => {
    const result = replaceAttrNames(`<p class="test">a</p><!-- class= -->`)
    expect(result).toEqual(`<p className="test">a</p><!-- class= -->`)
  })

  it("Default with newline", () => {
    const result = replaceAttrNames(`<p \nclass="test"\ndata-a="test"\n>a</p>`)
    expect(result).toEqual(`<p \nclassName="test"\ndata-a="test"\n>a</p>`)
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

  it("Default with css variables", () => {
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

  it("Default with newline", () => {
    const result = replaceStyleTags(
      `<style>\n.test > a {\ndisplay: block;\n}\n</style>`
    )
    expect(result).toEqual(
      `<style dangerouslySetInnerHTML={{ __html: \`\n.test > a {\ndisplay: block;\n}\n\` }} />`
    )
  })
})

describe("replaceScriptTags", () => {
  it("Default", () => {
    const result = replaceScriptTags(`<script>console.log("test")</script>`)
    expect(result).toEqual(
      `<script dangerouslySetInnerHTML={{ __html: \`console.log(\"test\")\` }} />`
    )
  })

  it("Default with newline", () => {
    const result = replaceScriptTags(`<script>\nconsole.log("test")\n</script>`)
    expect(result).toEqual(
      `<script dangerouslySetInnerHTML={{ __html: \`\nconsole.log(\"test\")\n\` }} />`
    )
  })
})

describe("replaceCommentTags", () => {
  it("Default", () => {
    const result = replaceCommentTags(`<!-- a --><p>b</p><!-- c -->`)
    expect(result).toEqual(`{/* a */}<p>b</p>{/* c */}`)
  })

  it("Default with newline", () => {
    const result = replaceCommentTags(`<!-- aaa\naaa --><p>b</p><!-- c -->`)
    expect(result).toEqual(`{/* aaa\naaa */}<p>b</p>{/* c */}`)
  })
})

describe("replaceSingleTags", () => {
  it("Default", () => {
    const result = replaceSingleTags(`<meta name="viewport">`)
    expect(result).toEqual(`<meta name="viewport" />`)
  })

  it("Default with newline", () => {
    const result = replaceSingleTags(`<meta\n name="viewport"\n>`)
    expect(result).toEqual(`<meta\n name="viewport"\n />`)
  })
})

describe("replaceCloseTags", () => {
  it("Default", () => {
    const result = replaceCloseTags(`<p class="a"></p><div></div><a></a>`)
    expect(result).toEqual(`<p class="a" /><div /><a />`)
  })

  it("Default with newline", () => {
    const result = replaceCloseTags(
      `<p class="a">\n</p>\n<div>\n</div>\n<a>\n</a>`
    )
    expect(result).toEqual(`<p class="a" />\n<div />\n<a />`)
  })
})
