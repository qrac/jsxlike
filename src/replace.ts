export function replaceMapAttrs(
  input: string,
  attrMaps?: { [attr: string]: string }
) {
  let value = input

  const attrItems = Object.entries(attrMaps || {})

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

export function replaceStyleName(styleName: string) {
  if (styleName.match(/^--/)) {
    return styleName
  }
  return styleName.replace(/-[a-z]/g, (match) => {
    return match[1].toUpperCase()
  })
}

export function replaceStyleAttrs(input: string) {
  let value = input

  const reg = new RegExp(`(<(?!!--)[^>]+style=)["|'](.*?)["|']`, "g")

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

export function replaceStyleTags(input: string, erase?: boolean) {
  let value = input

  if (erase) {
    const reg = new RegExp(`<style[^>]*>((?!</style>)[\\s\\S]*?)</style>`, "g")
    return value.replace(reg, "")
  } else {
    const reg = new RegExp(`<style[^>]*>((?!</style>)[\\s\\S]*?)</style>`, "g")
    return value.replace(
      reg,
      `<style dangerouslySetInnerHTML={{ __html: \`$1\` }} />`
    )
  }
}

export function replaceScriptTags(input: string, erase?: boolean) {
  let value = input

  if (erase) {
    const reg = new RegExp(
      `<script[^>]*>((?!</script>)[\\s\\S]*?)</script>`,
      "g"
    )
    return value.replace(reg, "")
  } else {
    const reg = new RegExp(
      `<script[^>]*>((?!</script>)[\\s\\S]*?)</script>`,
      "g"
    )
    return value.replace(
      reg,
      `<script dangerouslySetInnerHTML={{ __html: \`$1\` }} />`
    )
  }
}

export function replaceCommentTags(input: string, erase?: boolean) {
  let value = input

  if (erase) {
    const reg = new RegExp(`<!--(?!-->).*?-->`, "g")
    return value.replace(reg, "")
  } else {
    const reg = new RegExp(`<!--((?!-->).*?)-->`, "g")
    return value.replace(reg, `{/*$1*/}`)
  }
}

export function replaceNoSlashTags(input: string, tagNames?: string[]) {
  let value = input

  if (!tagNames?.length) {
    return value
  }
  tagNames.map((tagName) => {
    const reg = new RegExp(`(<${tagName}[^>]*)>`, "g")
    value = value.replace(reg, `$1 />`)
    return
  })
  return value
}

export function replaceEmptyTags(input: string, tagNames?: string[]) {
  let value = input

  if (!tagNames?.length) {
    return value
  }
  if (tagNames.includes("*")) {
    const reg = new RegExp(`<(\\w+)([^>]*)>\\s*</\\1>`, "g")
    return value.replace(reg, "<$1$2 />")
  }
  tagNames.map((tagName) => {
    const reg = new RegExp(`(<${tagName}[^>]*)>\\s*</${tagName}>`, "g")
    value = value.replace(reg, `$1 />`)
    return
  })
  return value
}
