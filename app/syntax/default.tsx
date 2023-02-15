export default function () {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>jsxlike</title>
        <link rel="stylesheet" href="/assets/reset.css" />
        <link rel="stylesheet" href="/assets/base.css" />
        <link rel="stylesheet" href="/assets/parts.css" />
        <style dangerouslySetInnerHTML={{ __html: `.title { color: red; }` }} />
      </head>
      <body>
        {/* + Header */}
        <header className="header">
          <h1 className="title">jsxlike</h1>
          <a href="/">
            <svg>
              <use href="/assets/images/icons.svg#home" />
            </svg>
          </a>
        </header>
        {/* - Header */}
        <main className="main">
          <img src="/assets/images/thumb.png" width="80" height="80" alt="" />
          <input type="checkbox" checked />
        </main>
        <script src="/assets/common.js" />
        <script src="/assets/animations.js" />
        <script dangerouslySetInnerHTML={{ __html: `console.log("test")` }} />
      </body>
    </html>
  )
}
