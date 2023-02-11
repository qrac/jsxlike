export type Options = {
  changeMapAttrs?: boolean
  changeStyleAttrs?: boolean
  changeStyleTags?: boolean | "erase"
  changeScriptTags?: boolean | "erase"
  changeCommentTags?: boolean | "erase"
  changeNoSlashTags?: boolean
  changeEmptyTags?: boolean
  mapAttrs?: { [attr: string]: string }
  noSlashTags?: string[]
  emptyTags?: string[]
}

export const defaultOptions: Options = {
  changeMapAttrs: true,
  changeStyleAttrs: true,
  changeStyleTags: true,
  changeScriptTags: true,
  changeCommentTags: true,
  changeNoSlashTags: true,
  changeEmptyTags: true,
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
  noSlashTags: ["meta", "link", "input", "br"],
  emptyTags: ["*"],
}
