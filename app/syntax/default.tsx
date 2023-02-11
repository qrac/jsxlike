export default function () {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>jsxlike</title>
        <link rel="stylesheet" href="/assets/bundle.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
      .header > .title {
        color: red;
      }
    `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
      console.log("test")
    `,
          }}
        />
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
          {/* main content
      input checkbox! */}
          <input type="checkbox" checked />
        </main>
      </body>
    </html>
  )
}
