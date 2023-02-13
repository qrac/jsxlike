export type Options = {
  emptyTags?: string[]
  slashTags?: string[]
  mapAttrs?: { [attr: string]: string }
  styleAttrs?: boolean
  styleTags?: boolean | "erase"
  scriptTags?: boolean | "erase"
  commentTags?: boolean | "erase"
}

export type ResolvedOptions = Required<Options>

export const defaultOptions: ResolvedOptions = {
  emptyTags: ["*"],
  slashTags: ["meta", "link", "input", "br"],
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
}
