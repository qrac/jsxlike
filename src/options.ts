export type Options = {
  extractTags?: string[]
  mapAttrs?: { [attr: string]: string }
  styleAttrs?: boolean
  styleTags?: boolean | "erase"
  scriptTags?: boolean | "erase"
  commentTags?: boolean | "erase"
  voidTags?: string[]
  shortTags?: string[]
  absolutePath?: string
  absoluteAttrs?: { [tagName: string]: string[] }
}

export type ResolvedOptions = Required<Options>

export const voidTags = ["meta", "link", "img", "input", "br", "wbr", "hr"]

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
  voidTags,
  shortTags: ["*"],
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
