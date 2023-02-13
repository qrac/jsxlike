import type { Options } from "./options"
import { defaultOptions } from "./options"
import {
  replaceEmptyTags,
  replaceSlashTags,
  replaceMapAttrs,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
} from "./replace"

function jsxlike(input: string, options?: Options) {
  const resolvedOptions = { ...defaultOptions, ...options }
  const {
    emptyTags,
    slashTags,
    mapAttrs,
    styleAttrs,
    styleTags,
    scriptTags,
    commentTags,
  } = resolvedOptions

  const hasEmptyTags = emptyTags.length > 0
  const hasSlashTags = slashTags.length > 0
  const hasMapAttrs = Object.keys(mapAttrs).length > 0
  const eraseStyleTags = styleTags === "erase"
  const eraseScriptTags = scriptTags === "erase"
  const eraseCommentTags = commentTags === "erase"

  let value = input

  hasEmptyTags && (value = replaceEmptyTags(value, emptyTags))
  hasSlashTags && (value = replaceSlashTags(value, slashTags))
  hasMapAttrs && (value = replaceMapAttrs(value, mapAttrs))
  styleAttrs && (value = replaceStyleAttrs(value))
  styleTags && (value = replaceStyleTags(value, eraseStyleTags))
  scriptTags && (value = replaceScriptTags(value, eraseScriptTags))
  commentTags && (value = replaceCommentTags(value, eraseCommentTags))

  return value
}

export default jsxlike
