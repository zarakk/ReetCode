import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    reactRefresh(),
    {
      name: "vite-plugin-mui",
      enforce: "pre",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          "<head>",
          `<head><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />`
        );
      },
    },
  ],
});
