export type Options = {
  mapAttrs?: { [attr: string]: string }
  slashTags?: string[]
  emptyTags?: string[]
  styleAttrs?: boolean
  styleTags?: boolean | "erase"
  scriptTags?: boolean | "erase"
  commentTags?: boolean | "erase"
}

export type ResolvedOptions = Required<Options>

export const defaultOptions: ResolvedOptions = {
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
  slashTags: ["meta", "link", "input", "br"],
  emptyTags: ["*"],
  styleAttrs: true,
  styleTags: true,
  scriptTags: true,
  commentTags: true,
}
