import { createRoot } from "react-dom/client";
import App from "./components/App";
import "rsuite/styles/index.less";

document.title = "Blueprint";

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);
root.render(<App />);
