import { useState, useEffect } from "react"
import { html as beautifyHtml } from "js-beautify"

import type { Options } from "../../src/options"
import jsxlike from "../../src"

import { ReactComponent as Logo } from "./logo.svg"
import { ReactComponent as GithubLogo } from "./github.svg"
import { version, repository } from "../../package.json"
import defaultHtml from "../syntax/default.html?raw"
import "./app.css"

type AppOptions = {
  extractTags: string
  absolutePath: string
  activeShortTags: boolean
  eraseCommentTags: boolean
}
type AppOptionBooleans = "activeShortTags" | "eraseCommentTags"

const extractTagLabels = [
  { value: "*", text: "すべて" },
  { value: "link", text: "link" },
  { value: "script", text: "script" },
  { value: "style", text: "style" },
  { value: "use", text: "use" },
  { value: "img", text: "img" },
]

const otherCheckboxes: {
  name: AppOptionBooleans
  text: string
}[] = [
  { name: "activeShortTags", text: "閉じタグを省略" },
  { name: "eraseCommentTags", text: "コメントを削除" },
]

function htmlToJsx(value: string, appOptions: AppOptions) {
  const options: Options = {
    extractTags: appOptions.extractTags === "*" ? [] : [appOptions.extractTags],
    shortTags: appOptions.activeShortTags ? ["*"] : [],
    commentTags: appOptions.eraseCommentTags ? "erase" : true,
    absolutePath: appOptions.absolutePath,
  }
  return beautifyHtml(jsxlike(value, options), {
    indent_size: 2,
    max_preserve_newlines: 0,
    indent_inner_html: true,
    extra_liners: [],
    inline: ["span", "strong", "b", "small", "del", "s", "code", "br", "wbr"],
  })
}

export default function App() {
  const defaultAppOptions: AppOptions = {
    extractTags: "*",
    absolutePath: "",
    activeShortTags: true,
    eraseCommentTags: false,
  }
  const defaultHtmlStr = defaultHtml.replace(/^<!-- prettier-ignore -->\n/, "")
  const defaultJsxStr = htmlToJsx(defaultHtmlStr, defaultAppOptions)

  const [appOptions, setAppOptions] = useState<AppOptions>(defaultAppOptions)
  const [htmlInput, setHtmlInput] = useState(defaultHtmlStr)
  const [jsxOutput, setJsxOutput] = useState(defaultJsxStr)

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = event.target.value
    setAppOptions({ ...appOptions, ...{ [name]: value } })
  }

  function handleToggleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name as AppOptionBooleans
    const check = appOptions[name]
    setAppOptions({ ...appOptions, ...{ [name]: !check } })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setHtmlInput(event.target.value)
    setJsxOutput(htmlToJsx(event.target.value, appOptions))
  }

  useEffect(() => {
    setJsxOutput(htmlToJsx(htmlInput, appOptions))
  }, [appOptions])
  return (
    <>
      <div className="app">
        <header className="app-header">
          <div className="block-titles">
            <h1 className="block-title">
              <Logo className="block-title-logo" title="jsxlike" />
            </h1>
            <span className="block-version">v{version}</span>
            <h2 className="block-subtitle">HTMLをReactのJSXにおおむね変換</h2>
            <a className="block-link-icon" href={repository.url}>
              <GithubLogo className="block-github" />
            </a>
          </div>
        </header>

        <aside className="app-aside">
          <details className="block-option">
            <summary className="block-option-trigger">オプション</summary>
            <div className="block-option-body">
              <ul className="block-option-items">
                <li className="block-option-item">
                  <span className="block-option-item-title">タグを抽出:</span>
                  <div className="block-option-item-labels">
                    {extractTagLabels.map((content, index) => {
                      const name = "extractTags"
                      return (
                        <label key={index} className="block-option-item-label">
                          <input
                            className="block-option-item-label-radio"
                            type="radio"
                            name={name}
                            value={content.value}
                            checked={appOptions[name] === content.value}
                            onChange={handleValueChange}
                          />
                          <span className="block-option-item-label-text">
                            {content.text}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </li>
                <li className="block-option-item">
                  <span className="block-option-item-title">
                    ルートパス置換:
                  </span>
                  <input
                    className="block-option-item-input"
                    type="text"
                    name="absolutePath"
                    defaultValue={appOptions.absolutePath}
                    placeholder="https://example.com"
                    onChange={handleValueChange}
                  />
                </li>
                <li className="block-option-item">
                  <div className="block-option-item-labels">
                    {otherCheckboxes.map((content, index) => {
                      return (
                        <label key={index} className="block-option-item-label">
                          <input
                            className="block-option-item-label-checkbox"
                            type="checkbox"
                            name={content.name}
                            checked={appOptions[content.name]}
                            onChange={handleToggleChange}
                          />
                          <span className="block-option-item-label-text">
                            {content.text}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </aside>

        <main className="app-main">
          <div className="block-editor">
            <div className="block-editor-column">
              <label htmlFor="textarea-html" className="block-editor-label">
                html
              </label>
              <textarea
                id="textarea-html"
                className="block-editor-textarea"
                defaultValue={defaultHtmlStr}
                onChange={handleInputChange}
              />
            </div>
            <div className="block-editor-column">
              <label htmlFor="textarea-jsx" className="block-editor-label">
                jsx
              </label>
              <textarea
                id="textarea-jsx"
                className="block-editor-textarea"
                value={jsxOutput}
                readOnly
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
