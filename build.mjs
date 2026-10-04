// ビルド：src/ をまとめて、そのまま開ける1ファイルの index.html を作る
import * as esbuild from "esbuild";
import fs from "fs";

const r = await esbuild.build({
  entryPoints: ["src/main.jsx"], bundle: true, minify: true, write: false, format: "iife",
  jsx: "transform", loader: { ".js": "jsx" }, target: "es2019",
  define: { "process.env.NODE_ENV": '"production"' },
});
const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = fs.readFileSync("src/styles.css", "utf8");
const html = fs.readFileSync("template.html", "utf8")
  .replace("/*CSS*/", () => css)
  .replace("/*JS*/", () => js);
fs.writeFileSync("index.html", html);
console.log(`index.html を作成しました（${Math.round(html.length / 1024)}KB）`);
