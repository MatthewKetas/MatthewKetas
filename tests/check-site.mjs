import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = ["index.html", "projects/index.html", "projects/saveit/index.html", "projects/cad-pcb/index.html"];

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  assert.match(html, /class="nav-toggle"[^>]+aria-controls="primary-navigation"/, `${page}: missing mobile nav toggle`);
  assert.match(html, /class="site-nav" id="primary-navigation"/, `${page}: missing controlled navigation`);

  for (const [tag] of html.matchAll(/<script\b[^>]*\bsrc="https:[^"]+"[^>]*>/g)) {
    assert.match(tag, /\bintegrity="sha384-[^"]+"/, `${page}: external script missing SHA-384 integrity`);
    assert.match(tag, /\bcrossorigin="anonymous"/, `${page}: external script missing anonymous CORS`);
  }
}

console.log(`Checked mobile navigation and script integrity on ${pages.length} pages.`);
