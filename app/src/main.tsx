import { createRoot } from "react-dom/client"

import "./main.css"
import App from "./app"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
