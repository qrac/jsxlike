import type { Options } from "./options"
import { resolveOptions } from "./options"
import {
  replaceExtractTags,
  replaceMapAttrs,
  replaceStyleAttrs,
  replaceStyleTags,
  replaceScriptTags,
  replaceCommentTags,
  replaceVoidTags,
  replaceShortTags,
  replaceAbsolutePath,
} from "./replace"

function jsxlike(input: string, options?: Options) {
  const resolvedOptions = resolveOptions(options || {})
  const {
    extractTags,
    mapAttrs,
    styleAttrs,
    styleTags,
    scriptTags,
    commentTags,
    voidTags,
    shortTags,
    absolutePath,
    absoluteAttrs,
  } = resolvedOptions

  const hasExtractTags = extractTags.length > 0
  const hasMapAttrs = Object.keys(mapAttrs).length > 0
  const eraseStyleTags = styleTags === "erase"
  const eraseScriptTags = scriptTags === "erase"
  const eraseCommentTags = commentTags === "erase"
  const hasVoidTags = voidTags.length > 0
  const hasShortTags = shortTags.length > 0
  const abPath = absolutePath
  const abAttrs = absoluteAttrs
  const hasAbsolute = abPath && Object.keys(abAttrs).length > 0

  let value = input

  hasExtractTags && (value = replaceExtractTags(value, extractTags))
  hasMapAttrs && (value = replaceMapAttrs(value, mapAttrs))
  styleAttrs && (value = replaceStyleAttrs(value))
  styleTags && (value = replaceStyleTags(value, eraseStyleTags))
  scriptTags && (value = replaceScriptTags(value, eraseScriptTags))
  commentTags && (value = replaceCommentTags(value, eraseCommentTags))
  hasVoidTags && (value = replaceVoidTags(value, voidTags))
  hasShortTags && (value = replaceShortTags(value, shortTags))
  hasAbsolute && (value = replaceAbsolutePath(value, abPath, abAttrs))

  return value
}

//export { defaultOptions } from "./options"
export default jsxlike
