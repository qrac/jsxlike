import { useState } from "react"
import jsBeautify from "js-beautify"

import "./app.css"
import jsxlike from "../../src"

export default function App() {
  const [jsxOutput, setJsxOutput] = useState("")

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = jsxlike(event.target.value)
    const result = jsBeautify.html(value, {
      indent_size: 2,
      max_preserve_newlines: 0,
      indent_inner_html: true,
      extra_liners: [],
      inline: ["span", "strong", "b", "small", "del", "s", "code", "br", "wbr"],
    })
    setJsxOutput(result)
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
                defaultValue=""
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
