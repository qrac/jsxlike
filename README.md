# jsxlike

<p>
  <a aria-label="Made by QRANOKO" href="https://qranoko.jp">
    <img src="https://img.shields.io/badge/MADE%20BY%20QRANOKO-212121.svg?style=for-the-badge&labelColor=212121">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/jsxlike">
    <img alt="" src="https://img.shields.io/npm/v/jsxlike.svg?style=for-the-badge&labelColor=212121">
  </a>
  <a aria-label="License" href="https://github.com/qrac/jsxlike/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/jsxlike.svg?style=for-the-badge&labelColor=212121">
  </a>
</p>

## Web Tool

- https://jsxlike.qranoko.jp

## About

HTML 文字列を React の JSX で使える構文におおよそ変換します。

- 依存ライブラリゼロ
- 正規表現の文字列マッチングと replace 関数のみなので軽量で高速
- 厳密な構文処理ではないので未実装のパターンは処理されない

## How To Use

```sh
$ npm i jsxlike
```

```js
import jsxlike from "jsxlike"

const htmlStr = `<p class="aaa">bbb</p>`

console.log(jsxlike(htmlStr, {} /* options */))
// => <p className="aaa">bbb</p>
```

## Options

```ts
const defaultOptions = {
  extractTags: [],
  mapAttrs: {
    class: "className",
    charset: "charSet",
    for: "htmlFor",
    tabindex: "tabIndex",
    readonly: "readOnly",
    maxlength: "maxLength",
    colspan: "colSpan",
    rowspan: "rowSpan",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    usemap: "useMap",
    frameborder: "frameBorder",
    "xlink:href": "href",
  },
  styleAttrs: true,
  styleTags: true,
  scriptTags: true,
  commentTags: true,
  voidTags: ["meta", "link", "img", "input", "br", "wbr", "hr"],
  shortTags: ["*"],
  absolutePath: "",
  absoluteAttrs: {
    link: ["href"],
    script: ["src"],
    img: ["src"],
    use: ["xlink:href", "href"],
  },
}
```

### extractTags

type: `string[]`

特定の HTML タグを抽出できます。例えば `["link", "script"]` とすることで `<link />` `<script />` タグのみを出力できます。

### mapAttrs

type: `{ [attr: string]: string }`

属性名 `attr` を `value` に置換する設定。オプションを設定するとデフォルトオプションとマージされます。

### styleAttrs

type: `boolean`

スタイル属性を置換するか否か。

### styleTags

type: `boolean | "erase"`

スタイルタグを置換するか否か。または `erase` にすることで除去します。

### scriptTags

type: `boolean | "erase"`

スクリプトタグを置換するか否か。または `erase` にすることで除去します。

### commentTags

type: `boolean | "erase"`

コメントタグを置換するか否か。または `erase` にすることで除去します。

### voidTags

type: `string[]`

設定した空要素に閉じスラッシュを追加します。

### shortTags

type: `string[]`

設定した要素に子要素がない場合は閉じタグを省略します。配列に `*` を含むとすべての要素が対象となります。

### absolutePath

type: `string`

URL を設定するとルートパスが絶対パスに置換されます。

### absoluteAttrs

type: `{ [tagName: string]: string[] }`

絶対パスに置換するタグと属性を指定します。

## Security

jsxlike にエスケープ処理は含まれていません。ユーザーの入力を含んだ実行結果をそのままブラウザでレンダリングすると XSS の脆弱性に繋がる可能性があります。そういった場合はレンダリング前にサニタイジングを追加してください。

## License

- MIT

## Credit

- Author: [Qrac](https://qrac.jp)
- Organization: [QRANOKO](https://qranoko.jp)
