export type Options = {
  extractTags?: string[]
  mapAttrs?: { [attr: string]: string }
  styleAttrs?: boolean
  styleTags?: boolean | "erase"
  scriptTags?: boolean | "erase"
  commentTags?: boolean | "erase"
  slashTags?: string[]
  emptyTags?: string[]
  absolutePath?: string
  absoluteAttrs?: { [tagName: string]: string[] }
}

export type ResolvedOptions = Required<Options>

const defaultOptions: Required<Options> = {
  extractTags: [],
  mapAttrs: {
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
  },
  styleAttrs: true,
  styleTags: true,
  scriptTags: true,
  commentTags: true,
  slashTags: ["meta", "link", "img", "input", "br", "hr"],
  emptyTags: ["*"],
  absolutePath: "",
  absoluteAttrs: {
    link: ["href"],
    script: ["src"],
    img: ["src"],
    use: ["xlink:href", "href"],
  },
}

export function resolveOptions(options: Options): ResolvedOptions {
  let opts = { ...defaultOptions, ...options }

  opts = {
    ...opts,
    mapAttrs: {
      ...defaultOptions.mapAttrs,
      ...(options.mapAttrs || {}),
    },
    absoluteAttrs: {
      ...defaultOptions.absoluteAttrs,
      ...(options.absoluteAttrs || {}),
    },
  }
  return opts
}
