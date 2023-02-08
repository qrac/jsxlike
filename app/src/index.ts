const attrMaps = {
  class: "className",
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

const closeList = ["meta", "link", "br"]

export default function (
  input: string,
  options?: {
    closeEmpty?: boolean
  }
) {
  const defaultOptions = {
    closeEmpty: true,
  }
  const resolvedOptions = { ...defaultOptions, ...options }
  const { closeEmpty } = resolvedOptions

  let value = input

  Object.entries(attrMaps).map((item) => {
    const htmlAttr = item[0]
    const reactAttr = item[1]
    const attrRegex = new RegExp(`(<[^>]+)(${htmlAttr}=)`, "g")
    value = value.replace(attrRegex, `$1${reactAttr}=`)
    return
  })

  closeList.map((item) => {
    const htmlAttr = item
    const attrRegex = new RegExp(`(<${htmlAttr}[^>]+)(>)`, "g")
    value = value.replace(attrRegex, `$1 />`)
    return
  })

  if (closeEmpty) {
    value = value.replace(/<(\w+)([^>]+)>\s*<\/\1>/g, "<$1 $2 />")
  }

  return value
}
