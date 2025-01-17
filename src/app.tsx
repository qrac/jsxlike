import { useState, useEffect } from "react"

import type { Options } from "./utils"
import {
  defaultOptions,
  arrayToString,
  stringToArray,
  htmlToJsx,
} from "./utils"

import "./app.css"
import { version, repository } from "../package.json"
import demoHtml from "./demo.html?raw"

const demoHtmlStr = demoHtml.replace(/^<!-- prettier-ignore -->\n/, "")

export default function App() {
  const [options, setOptions] = useState<Options>(defaultOptions)
  const [mainInput, setMainInput] = useState(demoHtmlStr)
  const [mainOutput, setMainOutput] = useState(htmlToJsx(demoHtmlStr, options))

  function handleArrayChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = stringToArray(event.target.value)
    setOptions({ ...options, ...{ [name]: value } })
  }

  /*function handleStringChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = event.target.value
    setOptions({ ...options, ...{ [name]: value } })
  }*/

  function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    let value = Number(event.target.value)

    if (isNaN(value) || value < 0) {
      value = 0
    } else {
      value = Math.floor(value)
    }
    setOptions({ ...options, [name]: value })
  }

  function handleToggleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const check = options[name]
    setOptions({ ...options, ...{ [name]: !check } })
  }

  function handleMainChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMainInput(event.target.value)
    setMainOutput(htmlToJsx(event.target.value, options))
  }

  useEffect(() => {
    setMainOutput(htmlToJsx(mainInput, options))
  }, [options])
  return (
    <div className="app">
      <header className="header">
        <div className="header-column">
          <h1 className="header-logo">
            <span className="header-logo-texts">
              <span className="header-logo-text is-ac-1">JSX</span>
              <span className="header-logo-text is-ac-2">like</span>
            </span>
          </h1>
          <p className="header-text">v{version}</p>
          <h2 className="header-text">HTMLをReactのJSXにおおむね変換</h2>
        </div>
        <div className="header-column">
          <a
            href={repository.url}
            target="_blank"
            className="header-text is-link"
          >
            GitHub
          </a>
        </div>
      </header>

      <aside className="option">
        <details>
          <summary className="option-summary">オプション</summary>
          <div className="option-content">
            <div className="option-content-items">
              <div className="option-content-item is-full">
                <label className="option-content-label">
                  <span>インラインタグ：</span>
                  <input
                    className="option-content-input"
                    type="text"
                    name="inlineTags"
                    defaultValue={arrayToString(options.inlineTags)}
                    placeholder="span, strong"
                    onChange={handleArrayChange}
                  />
                </label>
              </div>
              <div className="option-content-item">
                <label className="option-content-label">
                  <span>インデント：</span>
                  <input
                    className="option-content-input is-number"
                    type="number"
                    name="indentSize"
                    min={0}
                    defaultValue={options.indentSize}
                    placeholder="2"
                    onChange={handleNumberChange}
                  />
                </label>
              </div>
              <div className="option-content-item">
                <label className="option-content-label">
                  <input
                    type="checkbox"
                    name="omitCloseTags"
                    checked={options.omitCloseTags}
                    onChange={handleToggleChange}
                  />
                  <span>閉じタグを省略</span>
                </label>
              </div>
            </div>
          </div>
        </details>
      </aside>

      <main className="main">
        <div className="editor">
          <div className="editor-column">
            <label htmlFor="editor-textarea-before" className="editor-label">
              Before
            </label>
            <textarea
              className="editor-textarea"
              id="editor-textarea-before"
              defaultValue={mainInput}
              onChange={handleMainChange}
            />
          </div>
          <div className="editor-column">
            <label htmlFor="editor-textarea-after" className="editor-label">
              After
            </label>
            <textarea
              className="editor-textarea"
              id="editor-textarea-after"
              value={mainOutput}
              readOnly
            />
          </div>
        </div>
      </main>
    </div>
  )
}
