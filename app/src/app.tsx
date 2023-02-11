import { useState } from "react"
import jsBeautify from "js-beautify"

import defaultHtml from "../syntax/default.html?raw"
import "./app.css"
import jsxlike from "../../src"

function htmlToJsx(value: string) {
  return jsBeautify.html(jsxlike(value), {
    indent_size: 2,
    max_preserve_newlines: 0,
    indent_inner_html: true,
    extra_liners: [],
    inline: ["span", "strong", "b", "small", "del", "s", "code", "br", "wbr"],
  })
}

export default function App() {
  const defaultHtmlStr = defaultHtml.replace(/^<!-- prettier-ignore -->\n/, "")
  const defaultJsxStr = htmlToJsx(defaultHtmlStr)

  const [jsxOutput, setJsxOutput] = useState(defaultJsxStr)

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setJsxOutput(htmlToJsx(event.target.value))
  }
  return (
    <>
      <div className="app">
        <header className="app-header">
          <div className="block-titles">
            <h1 className="block-title">
              <span className="block-title-text is-pattern-1">jsx</span>
              <span className="block-title-text is-pattern-2">like</span>
            </h1>
            <h2 className="block-subtitle">HTML → React JSX におおむね変換</h2>
          </div>
        </header>
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
