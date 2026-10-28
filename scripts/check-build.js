import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("dist");
const base = `/${(process.env.BASE_PATH ?? "/portafolio-web/").replace(/^\/+|\/+$/g, "")}`.replace(/\/?$/, "/");
const origin = process.env.SITE_URL ?? "https://j0nbennett.github.io";

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : [filename];
  }));
  return nested.flat();
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)]
    .map(([, name, value]) => [name.toLowerCase(), value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"')]));
}

const pages = (await filesIn(output)).filter((filename) => filename.endsWith(".html"));
assert(pages.length > 0, "Build output is empty");

for (const filename of pages) {
  const html = await readFile(filename, "utf8");
  const label = path.relative(output, filename);
  const isEnglish = label.replaceAll(path.sep, "/").startsWith("en/");
  if (label !== "404.html") {
    assert.match(html, new RegExp(`<html[^>]+lang="${isEnglish ? "en" : "es"}"`), `${label}: document language`);
    const alternates = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((attrs) => attrs.rel === "alternate");
    for (const lang of ["es", "en", "x-default"]) assert(alternates.some((attrs) => attrs.hreflang === lang), `${label}: missing ${lang} alternate`);
    const switcher = html.match(/<nav\b[^>]*data-language-switcher[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert(switcher, `${label}: missing visible language selector`);
    const route = label.replaceAll(path.sep, "/").replace(/^en\//, "").replace(/index\.html$/, "");
    const languageLinks = [...switcher.matchAll(/<a\b[^>]*>/g)].map(([tag]) => attributes(tag));
    for (const lang of ["es", "en"]) {
      const expected = `${base}${lang === "en" ? "en/" : ""}${route}`;
      const link = languageLinks.find((attrs) => attrs.lang === lang);
      assert.equal(link?.href, expected, `${label}: language switch must preserve the page`);
      assert.equal(link?.["aria-current"], lang === (isEnglish ? "en" : "es") ? "page" : undefined, `${label}: selected language`);
    }
    const cv = isEnglish ? "cv-en.pdf" : "cv.pdf";
    assert(html.includes(`href="${base}${cv}"`), `${label}: incorrect CV language`);
    if (isEnglish) assert(!/Ir al contenido|Volver a Proyectos|Disponible para proyectos|Sobre mí|Envíame un mensaje/.test(html), `${label}: untranslated interface`);
  }
  const policies = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => attributes(tag))
    .filter((attrs) => attrs["http-equiv"]?.toLowerCase() === "content-security-policy");
  assert.equal(policies.length, 1, `${label}: expected one CSP`);
  const policy = new Map(policies[0].content.split(";").filter((part) => part.trim()).map((part) => {
    const [directive, ...sources] = part.trim().split(/\s+/);
    return [directive, sources];
  }));
  for (const directive of ["default-src", "base-uri", "object-src", "form-action"]) {
    assert(policy.has(directive), `${label}: missing ${directive}`);
  }
  assert.deepEqual(policy.get("base-uri"), ["'none'"], `${label}: base URI policy`);
  assert.deepEqual(policy.get("object-src"), ["'none'"], `${label}: object policy`);
  const scriptSources = policy.get("script-src");
  assert(scriptSources?.length, `${label}: missing script policy`);
  assert(!scriptSources.some((source) => ["'unsafe-inline'", "'unsafe-eval'", "*", "https:"].includes(source)), `${label}: unsafe script source`);
  for (const [, tag, script] of html.matchAll(/(<script\b[^>]*>)([\s\S]*?)<\/script>/gi)) {
    const attrs = attributes(tag);
    if (attrs.src) {
      assert.equal(new URL(attrs.src, origin).origin, new URL(origin).origin, `${label}: external script`);
    } else {
      const hash = `'sha256-${createHash("sha256").update(script).digest("base64")}'`;
      assert(scriptSources.includes(hash), `${label}: inline script lacks its CSP hash`);
    }
  }
  assert(!/\son[a-z]+\s*=/i.test(html), `${label}: inline event handler`);
  assert(!/<meta[^>]+http-equiv="X-Content-Type-Options"/i.test(html), `${label}: ineffective nosniff meta`);

  // Every local navigation and asset must stay under the configured Pages base and resolve.
  const relative = label.replaceAll(path.sep, "/").replace(/index\.html$/, "");
  const pageUrl = new URL(`${base}${relative}`, origin);
  for (const [tag] of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    const reference = attrs.href ?? attrs.src;
    if (!reference || reference.startsWith("#")) continue;
    const url = new URL(reference, pageUrl);
    if (url.origin !== pageUrl.origin) continue;
    assert(url.pathname.startsWith(base), `${label}: URL outside base: ${reference}`);
    const target = path.resolve(output, decodeURIComponent(url.pathname.slice(base.length)));
    assert(target === output || target.startsWith(output + path.sep), `${label}: path outside output`);
    assert(existsSync(target) || existsSync(path.join(target, "index.html")), `${label}: missing target: ${reference}`);
  }
}

for (const [collection, route] of [["projects", "projects"], ["case-studies", "case-studies"], ["posts", "writing"]]) {
  for (const filename of await filesIn(path.resolve("src/content", collection))) {
    if (!filename.endsWith(".mdx")) continue;
    const source = await readFile(filename, "utf8");
    const slug = source.match(/^slug:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]?.trim() ?? path.basename(filename, ".mdx");
    assert(existsSync(path.join(output, route, slug, "index.html")), `Missing content route: ${route}/${slug}`);
    assert(existsSync(path.join(output, "en", route, slug, "index.html")), `Missing English content route: ${route}/${slug}`);
  }
}

const contact = await readFile(path.join(output, "contact/index.html"), "utf8");
assert.match(contact, /name="_captcha"\s+value="true"/, "CAPTCHA must remain enabled");
assert.match(contact, /name="_honey"/, "Honeypot must remain present");
const nextField = [...contact.matchAll(/<input\b[^>]*>/gi)].map(([tag]) => attributes(tag)).find((attrs) => attrs.name === "_next");
assert.equal(nextField?.value, new URL(`${base}contact/?sent=true`, origin).href, "Form redirect must respect the configured site and base");
const englishContact = await readFile(path.join(output, "en/contact/index.html"), "utf8");
assert.match(englishContact, /name="_captcha"\s+value="true"/, "English CAPTCHA must remain enabled");
const englishNext = [...englishContact.matchAll(/<input\b[^>]*>/gi)].map(([tag]) => attributes(tag)).find((attrs) => attrs.name === "_next");
assert.equal(englishNext?.value, new URL(`${base}en/contact/?sent=true`, origin).href, "English form must return to English contact");
const fallback = await readFile(path.join(output, "404.html"), "utf8");
assert(fallback.includes(`href="${base}"`), "404 must return to the configured base");
console.log(`Verified CSP, script hashes, local links, content routes, contact protection and 404 for ${pages.length} pages (base ${base}).`);
