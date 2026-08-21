# JSXlike

HTMLをReact JSXへ変換するWebツール / CLI / Node APIです。

v2では正規表現ベースの変換を廃止し、HTMLパーサーでDOM構造を解釈してからJSXを生成します。`img` などのvoid要素、SVG属性、inline style、コメント、`script` / `style` をより安全に扱います。

## Web App

- https://jsxlike.qranoko.jp

## CLI

```bash
npx jsxlike input.html
```

標準入力にも対応しています。

```bash
cat input.html | npx jsxlike
```

ファイルへ保存する場合：

```bash
npx jsxlike input.html -o Component.jsx
```

React Componentとして出力する場合：

```bash
npx jsxlike input.html --mode component --name Hero
```

### Options

```text
-o, --output <file>    output file
--mode <mode>          fragment | component
--name <name>          component name
--indent <size>        indentation size
--collapse-empty       collapse empty non-void elements
```

## Node API

```ts
import { htmlToJsx } from "jsxlike"

const result = await htmlToJsx(`<img src="/hero.jpg" class="hero">`)

console.log(result.code)
console.log(result.warnings)
```

`htmlToJsx()` は `{ code, warnings }` を返します。

```ts
await htmlToJsx(html, {
  mode: "fragment",
  componentName: "Component",
  indentSize: 2,
  collapseEmptyElements: false,
})
```

## Conversion policy

- HTMLは `parse5` で構文解析してから変換します。
- `class` → `className`、`for` → `htmlFor` などReact DOM向け属性へ変換します。
- `data-*` / `aria-*` は保持します。
- inline styleはCSSパーサーを通してReact style objectへ変換します。
- HTML void elementは常に自己終了タグへ変換します。
- HTMLコメントはJSXコメントへ変換します。
- `script` / `style` の内容は `dangerouslySetInnerHTML` へ安全にエスケープします。
- `onclick="..."` のようなHTML文字列イベントハンドラーはReact callbackと意味が異なるため、警告を返して除外します。
- doctypeはJSX内部では無効なため、警告を返して除外します。

## Development

```bash
npm install
npm run test
npm run build
```

`npm run check` でテストとWeb / Nodeの両ビルドを実行します。

## License

MIT

## Credit

- Author: [Qrac](https://qrac.jp)
- Organization: [QRANOKO](https://qranoko.jp)
