import { describe, expect, it } from "vitest"

import {
  replaceAttrMaps,
  replaceSlashTags,
  replaceEmptyTags,
  replaceStyleName,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
} from "../src/replace"

describe("replaceAttrMaps", () => {
  it("Blank", () => {
    const result = replaceAttrMaps(`<p>aa</p>`, {})
    expect(result).toEqual(`<p>aa</p>`)
  })

  it("Replace", () => {
    const result = replaceAttrMaps(`<p class="test" data-a="test">a</p>`, {
      class: "className",
      "data-a": "data-b",
    })
    expect(result).toEqual(`<p className="test" data-b="test">a</p>`)
  })

  it("Replace with comment", () => {
    const result = replaceAttrMaps(`<p class="test">a</p><!-- class= -->`, {
      class: "className",
    })
    expect(result).toEqual(`<p className="test">a</p><!-- class= -->`)
  })

  it("Replace with containing a newline", () => {
    const result = replaceAttrMaps(
      `<p
  class="test"
  data-a="test"
>a</p>`,
      {
        class: "className",
        "data-a": "data-b",
      }
    )
    expect(result).toEqual(`<p
  className="test"
  data-b="test"
>a</p>`)
  })
})

describe("replaceSlashTags", () => {
  it("Blank", () => {
    const result = replaceSlashTags(`<meta name="viewport">`, [])
    expect(result).toEqual(`<meta name="viewport">`)
  })

  it("Replace", () => {
    const result = replaceSlashTags(`<meta name="viewport">`, ["meta"])
    expect(result).toEqual(`<meta name="viewport" />`)
  })
})

describe("replaceEmptyTags", () => {
  it("Blank", () => {
    const result = replaceEmptyTags(`<p class="a"></p><div></div><a></a>`, [])
    expect(result).toEqual(`<p class="a"></p><div></div><a></a>`)
  })

  it("All", () => {
    const result = replaceEmptyTags(`<p class="a"></p><div></div><a></a>`, [
      "*",
    ])
    expect(result).toEqual(`<p class="a" /><div /><a />`)
  })

  it("All with containing a newline", () => {
    const result = replaceEmptyTags(
      `<p class="a">
    </p>
<div></div>
<a>
</a>`,
      ["*"]
    )
    expect(result).toEqual(`<p class="a" />\n<div />\n<a />`)
  })

  it("Tags", () => {
    const result = replaceEmptyTags(`<p class="a"></p><div></div><a></a>`, [
      "p",
      "a",
    ])
    expect(result).toEqual(`<p class="a" /><div></div><a />`)
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
      `<style>
  .test > a {
    display: block;
  }
</style>`
    )
    expect(result).toEqual(
      `<style dangerouslySetInnerHTML={{ __html: \`\n  .test > a {\n    display: block;\n  }\n\` }} />`
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
    const result = replaceScriptTags(`<script>
  console.log("test")
</script>`)
    expect(result).toEqual(
      `<script dangerouslySetInnerHTML={{ __html: \`\n  console.log(\"test\")\n\` }} />`
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
    const result = replaceCommentTags(`<!-- aaa
aaa --><p>b</p><!-- c -->`)
    expect(result).toEqual(`{/* aaa
aaa */}<p>b</p>{/* c */}`)
  })

  it("Erase", () => {
    const result = replaceCommentTags(`<!-- a --><p>b</p><!-- c -->`, true)
    expect(result).toEqual(`<p>b</p>`)
  })
})
