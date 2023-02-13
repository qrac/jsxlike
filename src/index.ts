import type { Options } from "./options"
import { defaultOptions } from "./options"
import {
  replaceAttrMaps,
  replaceSlashTags,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
  replaceEmptyTags,
} from "./replace"

function jsxlike(input: string, options?: Options) {
  const resolvedOptions = { ...defaultOptions, ...options }
  const {
    attrMaps,
    slashTags,
    emptyTags,
    styleAttrs,
    styleTags,
    scriptTags,
    commentTags,
  } = resolvedOptions

  const changeAttrMaps = Object.keys(attrMaps).length > 0
  const changeSlashTags = slashTags.length > 0
  const changeEmptyTags = emptyTags.length > 0

  const eraseStyleTags = styleTags === "erase"
  const eraseScriptTags = scriptTags === "erase"
  const eraseCommentTags = commentTags === "erase"

  let value = input

  changeAttrMaps && (value = replaceAttrMaps(value, attrMaps))
  changeSlashTags && (value = replaceSlashTags(value, slashTags))
  changeEmptyTags && (value = replaceEmptyTags(value, emptyTags))

  styleAttrs && (value = replaceStyleAttrs(value))
  styleTags && (value = replaceStyleTags(value, eraseStyleTags))
  scriptTags && (value = replaceScriptTags(value, eraseScriptTags))
  commentTags && (value = replaceCommentTags(value, eraseCommentTags))

  return value
}

export default jsxlike
