import { useEffect, useMemo, useState } from "react"

import {
  defaultOptions,
  htmlToJsx,
  type HtmlToJsxOptions,
  type HtmlToJsxWarning,
} from "./core"
import demoHtml from "./demo.html?raw"
import { repository, version } from "../package.json"

import "./app.css"

const demoHtmlStr = demoHtml.replace(/^<!-- prettier-ignore -->\n/, "")

export default function App() {
  const [options, setOptions] = useState<HtmlToJsxOptions>(defaultOptions)
  const [mainInput, setMainInput] = useState(demoHtmlStr)
  const [mainOutput, setMainOutput] = useState("")
  const [warnings, setWarnings] = useState<HtmlToJsxWarning[]>([])
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    let active = true
    setIsConverting(true)

    void htmlToJsx(mainInput, options)
      .then((result) => {
        if (!active) return
        setMainOutput(result.code)
        setWarnings(result.warnings)
      })
      .finally(() => {
        if (active) setIsConverting(false)
      })

    return () => {
      active = false
    }
  }, [mainInput, options])

  const warningText = useMemo(
    () => warnings.map((warning) => warning.message).join("\n"),
    [warnings],
  )

  function updateOption<Key extends keyof HtmlToJsxOptions>(
    key: Key,
    value: HtmlToJsxOptions[Key],
  ) {
    setOptions((current) => ({ ...current, [key]: value }))
  }

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
          <h2 className="header-text">HTMLをReact JSXへ安全に変換</h2>
        </div>
        <div className="header-column">
          <a
            href={repository.url}
            target="_blank"
            rel="noreferrer"
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
              <label className="option-content-label">
                <span>出力：</span>
                <select
                  className="option-content-select"
                  value={options.mode}
                  onChange={(event) =>
                    updateOption(
                      "mode",
                      event.target.value === "component" ? "component" : "fragment",
                    )
                  }
                >
                  <option value="fragment">JSX Fragment</option>
                  <option value="component">React Component</option>
                </select>
              </label>

              {options.mode === "component" && (
                <label className="option-content-label">
                  <span>名前：</span>
                  <input
                    className="option-content-input"
                    value={options.componentName}
                    onChange={(event) => updateOption("componentName", event.target.value)}
                  />
                </label>
              )}

              <label className="option-content-label">
                <span>インデント：</span>
                <input
                  className="option-content-input is-number"
                  type="number"
                  min={1}
                  max={8}
                  value={options.indentSize}
                  onChange={(event) =>
                    updateOption(
                      "indentSize",
                      Math.max(1, Math.min(8, Number(event.target.value) || 2)),
                    )
                  }
                />
              </label>

              <label className="option-content-label">
                <input
                  type="checkbox"
                  checked={options.collapseEmptyElements}
                  onChange={(event) =>
                    updateOption("collapseEmptyElements", event.target.checked)
                  }
                />
                <span>空要素を自己終了タグにする</span>
              </label>
            </div>

            {warningText && (
              <pre className="option-warning" aria-live="polite">
                {warningText}
              </pre>
            )}
          </div>
        </details>
      </aside>

      <main className="main">
        <div className="editor">
          <div className="editor-column">
            <label htmlFor="editor-textarea-before" className="editor-label">
              HTML
            </label>
            <textarea
              className="editor-textarea"
              id="editor-textarea-before"
              value={mainInput}
              onChange={(event) => setMainInput(event.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="editor-column">
            <label htmlFor="editor-textarea-after" className="editor-label">
              {isConverting ? "Converting..." : "JSX"}
            </label>
            <textarea
              className="editor-textarea"
              id="editor-textarea-after"
              value={mainOutput}
              readOnly
              spellCheck={false}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
