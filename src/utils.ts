import { html as beautifyHtml } from "js-beautify"

export type Options = {
  indentSize: number
  inlineTags: string[]
  omitCloseTags: boolean
}

export const defaultOptions: Options = {
  indentSize: 2,
  inlineTags: ["span", "strong", "b", "small", "del", "s", "code", "br", "wbr"],
  omitCloseTags: true,
}

function isValidSelector(selector: string): boolean {
  try {
    document.createDocumentFragment().querySelector(selector)
    return true
  } catch {
    return false
  }
}

export function arrayToString(array: string[]) {
  if (array.length === 0) return ""
  return array.join(", ")
}

export function stringToArray(string: string) {
  if (!string) return []
  return string
    .split(",")
    .map((s) => s.trim())
    .filter((s) => isValidSelector(s))
}

export function replaceAttrNames(input: string) {
  let value = input

  const attrs = {
    class: "className",
    charset: "charSet",
    for: "htmlFor",
    tabindex: "tabIndex",
    readonly: "readOnly",
    maxlength: "maxLength",
    colspan: "colSpan",
    rowspan: "rowSpan",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    usemap: "useMap",
    frameborder: "frameBorder",
    "xlink:href": "href",
  }
  const attrItems = Object.entries(attrs)

  if (!attrItems.length) {
    return value
  }
  attrItems.map((item) => {
    const htmlAttr = item[0]
    const reactAttr = item[1]
    const reg = new RegExp(`(<(?!!--)[^>]+)${htmlAttr}=`, "g")
    value = value.replace(reg, `$1${reactAttr}=`)
    return
  })
  return value
}

export function replaceStyleAttrs(input: string) {
  let value = input

  const reg = new RegExp(`(<(?!!--)[^>]+style=)["|'](.*?)["|']`, "g")

  function replaceStyleName(styleName: string) {
    if (styleName.match(/^--/)) {
      return styleName
    }
    return styleName.replace(/-[a-z]/g, (match) => {
      return match[1].toUpperCase()
    })
  }
  return value.replace(reg, (_, before: string, styles: string) => {
    const styleObject = styles
      .split(";")
      .filter((style) => style.trim().length)
      .reduce((styleObj: { [key: string]: string }, style) => {
        const [key, value] = style.split(":")
        styleObj[replaceStyleName(key.trim())] = value.trim()
        return styleObj
      }, {})
    const styleStr = Object.entries(styleObject)
      .map(([key, value]) => {
        const isCssVariables = key.startsWith("--")
        const q = isCssVariables ? `"` : ""
        return `${q}${key}${q}: "${value}"`
      })
      .join(", ")
    return `${before}{{ ${styleStr} }}`
  })
}

export function replaceStyleTags(input: string) {
  let value = input

  const reg = new RegExp(`<style[^>]*>((?!</style>)[\\s\\S]*?)</style>`, "g")
  return value.replace(
    reg,
    `<style dangerouslySetInnerHTML={{ __html: \`$1\` }} />`
  )
}

export function replaceScriptTags(input: string) {
  let value = input

  const reg = new RegExp(`<script[^>]*>((?!</script>)[\\s\\S]*?)</script>`, "g")
  return value.replace(
    reg,
    `<script dangerouslySetInnerHTML={{ __html: \`$1\` }} />`
  )
}

export function replaceCommentTags(input: string) {
  let value = input

  const reg = new RegExp(`<!--((?!-->)[\\s\\S]*?)-->`, "g")
  return value.replace(reg, `{/*$1*/}`)
}

export function replaceSingleTags(input: string) {
  let value = input

  const singleTags = ["meta", "link", "img", "input", "br", "wbr", "hr"]

  singleTags.map((tagName) => {
    const reg = new RegExp(`(<${tagName}[^>]*)>`, "g")
    value = value.replace(reg, `$1 />`)
    return
  })
  return value
}

export function replaceCloseTags(input: string) {
  let value = input

  const reg = new RegExp(`<(\\w+)([^>]*)>\\s*</\\1>`, "g")
  return value.replace(reg, "<$1$2 />")
}

export function htmlToJsx(html: string, options?: Partial<Options>) {
  const opts: Options = { ...defaultOptions, ...(options || {}) }

  let _html = html

  _html = replaceAttrNames(_html)
  _html = replaceStyleAttrs(_html)
  _html = replaceStyleTags(_html)
  _html = replaceScriptTags(_html)
  _html = replaceCommentTags(_html)
  _html = replaceSingleTags(_html)

  if (opts.omitCloseTags) {
    _html = replaceCloseTags(_html)
  }

  return beautifyHtml(_html, {
    indent_size: opts.indentSize,
    max_preserve_newlines: 0,
    indent_inner_html: true,
    extra_liners: [],
    inline: opts.inlineTags,
  })
}
