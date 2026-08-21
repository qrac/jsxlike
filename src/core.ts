import { parse, parseFragment } from "parse5"
import { format } from "prettier/standalone"
import * as babelPlugin from "prettier/plugins/babel"
import * as estreePlugin from "prettier/plugins/estree"
import styleToJs from "style-to-js"

export type OutputMode = "fragment" | "component"

export type HtmlToJsxOptions = {
  mode: OutputMode
  componentName: string
  indentSize: number
  collapseEmptyElements: boolean
}

export type HtmlToJsxWarning = {
  code: "doctype-omitted" | "event-handler-omitted" | "invalid-style"
  message: string
}

export type HtmlToJsxResult = {
  code: string
  warnings: HtmlToJsxWarning[]
}

export const defaultOptions: HtmlToJsxOptions = {
  mode: "fragment",
  componentName: "Component",
  indentSize: 2,
  collapseEmptyElements: false,
}

type AttrNode = {
  name: string
  value: string
  prefix?: string | null
}

type AstNode = {
  nodeName: string
  tagName?: string
  attrs?: AttrNode[]
  childNodes?: AstNode[]
  content?: AstNode
  value?: string
  data?: string
}

const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
])

const booleanAttrs = new Set([
  "allowFullScreen",
  "async",
  "autoFocus",
  "autoPlay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formNoValidate",
  "hidden",
  "loop",
  "multiple",
  "muted",
  "noModule",
  "noValidate",
  "open",
  "playsInline",
  "readOnly",
  "required",
  "reversed",
  "selected",
])

const attrNames: Record<string, string> = {
  acceptcharset: "acceptCharset",
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  charset: "charSet",
  class: "className",
  colspan: "colSpan",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  datetime: "dateTime",
  enctype: "encType",
  for: "htmlFor",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  http-equiv: "httpEquiv",
  inputmode: "inputMode",
  keyparams: "keyParams",
  keytype: "keyType",
  maxlength: "maxLength",
  minlength: "minLength",
  nomodule: "noModule",
  novalidate: "noValidate",
  playsinline: "playsInline",
  readonly: "readOnly",
  referrerpolicy: "referrerPolicy",
  rowspan: "rowSpan",
  spellcheck: "spellCheck",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  tabindex: "tabIndex",
  usemap: "useMap",
  viewbox: "viewBox",
  "xlink:href": "xlinkHref",
  "xml:lang": "xmlLang",
}

function toReactAttrName(attr: AttrNode) {
  const rawName = attr.prefix ? `${attr.prefix}:${attr.name}` : attr.name
  const lowerName = rawName.toLowerCase()

  if (lowerName.startsWith("data-") || lowerName.startsWith("aria-")) {
    return rawName
  }

  if (attrNames[lowerName]) {
    return attrNames[lowerName]
  }

  if (rawName.includes("-")) {
    return rawName.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())
  }

  return rawName
}

function serializeStyle(value: string, warnings: HtmlToJsxWarning[]) {
  try {
    const parsed = styleToJs(value, { reactCompat: true })
    const items = Object.entries(parsed)
    if (items.length === 0) return "{{}}"

    return `{{ ${items
      .map(([key, itemValue]) => `${JSON.stringify(key)}: ${JSON.stringify(itemValue)}`)
      .join(", ")} }}`
  } catch {
    warnings.push({
      code: "invalid-style",
      message: "An inline style attribute could not be parsed and was omitted.",
    })
    return null
  }
}

function serializeAttrs(attrs: AttrNode[] = [], warnings: HtmlToJsxWarning[]) {
  const values: string[] = []

  for (const attr of attrs) {
    const sourceName = attr.prefix ? `${attr.prefix}:${attr.name}` : attr.name
    const lowerName = sourceName.toLowerCase()

    if (/^on[a-z]/i.test(lowerName)) {
      warnings.push({
        code: "event-handler-omitted",
        message: `HTML event handler \`${sourceName}\` was omitted because a string handler is not equivalent to a React callback.`,
      })
      continue
    }

    const reactName = toReactAttrName(attr)

    if (reactName === "style") {
      const style = serializeStyle(attr.value, warnings)
      if (style) values.push(`style=${style}`)
      continue
    }

    if (booleanAttrs.has(reactName)) {
      values.push(reactName)
      continue
    }

    values.push(`${reactName}=${JSON.stringify(attr.value)}`)
  }

  return values.length ? ` ${values.join(" ")}` : ""
}

function serializeText(value: string) {
  if (!value) return ""

  if (/[<{]/.test(value)) {
    return `{${JSON.stringify(value)}}`
  }

  return value
}

function serializeChildren(node: AstNode, warnings: HtmlToJsxWarning[]) {
  const children = node.tagName === "template" ? node.content?.childNodes : node.childNodes
  return (children || []).map((child) => serializeNode(child, warnings)).join("")
}

function serializeRawElement(node: AstNode, warnings: HtmlToJsxWarning[]) {
  const tagName = node.tagName || node.nodeName
  const attrs = serializeAttrs(node.attrs, warnings)
  const rawValue = (node.childNodes || [])
    .map((child) => child.value ?? child.data ?? "")
    .join("")

  if (!rawValue) return `<${tagName}${attrs} />`

  return `<${tagName}${attrs} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(rawValue)} }} />`
}

function serializeNode(node: AstNode, warnings: HtmlToJsxWarning[]): string {
  if (node.nodeName === "#text") {
    return serializeText(node.value || "")
  }

  if (node.nodeName === "#comment") {
    const comment = (node.data || "").replace(/\*\//g, "* /")
    return `{/*${comment}*/}`
  }

  if (node.nodeName === "#documentType") {
    warnings.push({
      code: "doctype-omitted",
      message: "The HTML doctype was omitted because it is not valid inside JSX.",
    })
    return ""
  }

  const tagName = node.tagName
  if (!tagName) {
    return serializeChildren(node, warnings)
  }

  if (tagName === "script" || tagName === "style") {
    return serializeRawElement(node, warnings)
  }

  const attrs = serializeAttrs(node.attrs, warnings)
  const children = serializeChildren(node, warnings)

  if (voidTags.has(tagName)) {
    return `<${tagName}${attrs} />`
  }

  if (!children && defaultOptions.collapseEmptyElements) {
    return `<${tagName}${attrs} />`
  }

  return `<${tagName}${attrs}>${children}</${tagName}>`
}

function hasDocumentMarkup(html: string) {
  return /<!doctype|<html[\s>]|<head[\s>]|<body[\s>]/i.test(html)
}

function wrapTopLevel(source: string) {
  const trimmed = source.trim()
  if (!trimmed) return "<></>"
  return `<>${trimmed}</>`
}

function validComponentName(value: string) {
  const clean = value.trim()
  if (/^[A-Z_$][\w$]*$/.test(clean)) return clean
  return defaultOptions.componentName
}

export async function htmlToJsx(
  html: string,
  options: Partial<HtmlToJsxOptions> = {},
): Promise<HtmlToJsxResult> {
  const opts = { ...defaultOptions, ...options }
  const warnings: HtmlToJsxWarning[] = []
  const tree = (hasDocumentMarkup(html) ? parse(html) : parseFragment(html)) as unknown as AstNode
  const raw = serializeChildren(tree, warnings)
  const jsx = wrapTopLevel(raw)

  const source =
    opts.mode === "component"
      ? `export default function ${validComponentName(opts.componentName)}() { return (${jsx}) }`
      : jsx

  const code = await format(source, {
    parser: "babel",
    plugins: [babelPlugin, estreePlugin],
    tabWidth: opts.indentSize,
    semi: false,
  })

  return { code: code.trimEnd(), warnings }
}
