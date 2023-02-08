import type { Options } from "./options"
import { defaultOptions } from "./options"
import {
  replaceMapAttrs,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
  replaceNoSlashTags,
  replaceEmptyTags,
} from "./replace"

function jsxlike(input: string, options?: Options) {
  const resolvedOptions = { ...defaultOptions, ...options }
  const {
    changeMapAttrs,
    changeStyleAttrs,
    changeStyleTags,
    changeScriptTags,
    changeCommentTags,
    changeNoSlashTags,
    changeEmptyTags,
    mapAttrs,
    noSlashTags,
    emptyTags,
  } = resolvedOptions
  const eraseStyleTags = changeStyleTags === "erase"
  const eraseScriptTags = changeScriptTags === "erase"
  const eraseCommentTags = changeCommentTags === "erase"

  let value = input

  changeMapAttrs && (value = replaceMapAttrs(value, mapAttrs))
  changeStyleAttrs && (value = replaceStyleAttrs(value))
  changeStyleTags && (value = replaceStyleTags(value, eraseStyleTags))
  changeScriptTags && (value = replaceScriptTags(value, eraseScriptTags))
  changeCommentTags && (value = replaceCommentTags(value, eraseCommentTags))
  changeNoSlashTags && (value = replaceNoSlashTags(value, noSlashTags))
  changeEmptyTags && (value = replaceEmptyTags(value, emptyTags))

  return value
}

export default jsxlike
