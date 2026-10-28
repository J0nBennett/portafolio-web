# Portfolio Web Profesional (Astro + Tailwind + MDX)

Portfolio técnico reusable, orientado a demostrar criterio de ingeniería con contenido desacoplado (`content/` y `data/`), build estático y deploy automático en GitHub Pages.

## Stack
- Astro (SSG)
- TailwindCSS
- MDX para contenido
- GitHub Actions para deploy

## Setup local
Usar Node.js 24 LTS (`.nvmrc`). El lockfile forma parte del repositorio.
```bash
npm ci
npm run dev
```

## Build
```bash
npm run build
npm run check:build
```

## Deploy en GitHub Pages
El workflow está en `/.github/workflows/deploy.yml`. Las pull requests ejecutan tipos, auditoría de dependencias, build y verificación del HTML generado, sin permisos de despliegue. Solo `main` puede publicar en Pages.

Las Actions están fijadas a commits revisables. Dependabot propone actualizaciones semanales de npm y GitHub Actions; los permisos `pages: write` e `id-token: write` solo pertenecen al job de despliegue.

### Configuración de URL/base para Pages
Este repo soporta:
- User site: `https://username.github.io`
- Project site: `https://username.github.io/REPO`

La acción detecta automáticamente el tipo de repositorio y exporta:
- `SITE_URL=https://<owner>.github.io`
- `BASE_PATH=/` para user site
- `BASE_PATH=/REPO` para project site

`astro.config.mjs` consume estas variables para construir rutas correctas.

### Fallback 404 para project site
`src/pages/404.astro` genera `404.html` con la misma CSP que las demás páginas.

- En project site (`username.github.io/repo/...`) la página usa la base configurada y redirige a `/<repo>/`.
- En user site (`username.github.io/...`) redirige a `/`.

Esto evita quedar en una 404 dura al abrir URLs inexistentes o rutas antiguas.

## Seguridad

Astro 7 usa loaders de contenido y conserva los slugs del frontmatter como identificadores de ruta. La CSP se genera durante el build con hashes de los scripts; no permite `unsafe-inline` ni `unsafe-eval` en JavaScript. Solo los atributos de estilo admiten estilos inline para mantener compatibilidad con el resaltado MDX. El formulario mantiene honeypot y CAPTCHA de FormSubmit; no se debe desactivar al editarlo.

Validación antes de publicar:

```bash
npm run check
npm audit --audit-level=low
npm run build
npm run check:build
```

La verificación del build recorre todas las páginas y comprueba la CSP, hashes de scripts, enlaces locales, rutas MDX, CAPTCHA y destino del 404. Para un user site, ejecutar build y verificación con `BASE_PATH=/`.

### Ajustes externos pendientes

En Settings → Rules → Rulesets, proteger `main`: exigir pull request, revisión, el check `Validate and build`, bloquear force pushes y borrado. Configurar Pages para publicar solo desde `main`. Estas opciones pertenecen a la cuenta de GitHub y no se activan mediante archivos del repositorio.

GitHub Pages no aplica archivos `_headers` ni permite configurar cabeceras HTTP arbitrarias desde Astro. La CSP en `<meta>` no sustituye `X-Content-Type-Options: nosniff` ni una protección HTTP `frame-ancestors 'none'` / `X-Frame-Options: DENY`. Para esos controles hace falta una capa de entrega compatible; esta corrección mantiene GitHub Pages y no afirma haberlos habilitado.

## Español e inglés

El español conserva las URL existentes. La versión inglesa vive en `/en/`; el selector de la cabecera conserva la página, los parámetros y el fragmento al cambiar de idioma. Los enlaces internos y las descargas del CV siguen el idioma seleccionado, sin traducción automática en el navegador ni dependencias nuevas.

- Datos profesionales: `src/data/site.json` y `src/data/site.en.json`.
- Traducciones de interfaz: `src/data/ui.en.json`, usando el texto español como clave.
- Contenido inglés: `src/content/en/`, con los mismos nombres y slugs de las colecciones españolas.
- Plantillas compartidas: `src/pages/en/[...path].astro` reutiliza las páginas y layouts del sitio.
- SEO: atributo `lang`, canonical y alternates `es`, `en` y `x-default` por página; ambas versiones se incluyen en el sitemap.
- CV: `/cv.pdf` en español y `/cv-en.pdf` en inglés. Los datos editables del inglés están en `docs/cv-en.json`; se puede regenerar con `python scripts/build-cv.py` teniendo ReportLab instalado. El PDF ya generado forma parte del repositorio; Python no es necesario para desplegar el sitio.

Al agregar contenido, crear también su traducción con el mismo slug. `npm run check:build` verifica las dos rutas, la selección de idioma y los CV, además de los controles de seguridad.

## Release checklist
1. Definir `SITE_URL` y `BASE_PATH` según tipo de Pages:
   - user site: `SITE_URL=https://<owner>.github.io`, `BASE_PATH=/`
   - project site: `SITE_URL=https://<owner>.github.io`, `BASE_PATH=/REPO`
2. Activar GitHub Pages en el repositorio (Source: `GitHub Actions`).
3. Verificar metadatos SEO en build/deploy final:
   - `canonical` con la ruta correcta (incluyendo base en project site).
   - `og:image` absoluto y apuntando a una URL válida bajo la base correcta.
4. Verificar fallback 404:
   - abrir una ruta inexistente y confirmar redirección a home.

## Estructura principal
```text
src/
  components/
    layout/
    projects/
    seo/
    ui/
  content/
    projects/
    case-studies/
    posts/
  data/
  layouts/
  pages/
  styles/
public/
docs/
```

## Agregar nuevo Project (MDX)
1. Crear archivo en `src/content/projects/*.mdx`
2. Frontmatter requerido:
```yaml
title: "Nombre"
slug: "slug-unico"
summary: "Resumen"
tags: ["tag1", "tag2"]
stack: ["Astro", "TailwindCSS"]
links:
  repo: "https://github.com/..."
  demo: "https://..."
featured: false
date: 2026-01-01
```
3. Agregar cuerpo con problema, solución y decisiones.

## Agregar nuevo Case Study
1. Crear archivo en `src/content/case-studies/*.mdx`
2. Frontmatter: `title`, `slug`, `summary`, `tags`, `date`
3. Incluir secciones:
- Contexto
- Problema
- Decisiones
- Arquitectura
- Resultados
- Lecciones

## Agregar nuevo Post
1. Crear archivo en `src/content/posts/*.mdx`
2. Frontmatter: `title`, `slug`, `summary`, `tags`, `date`
3. Mantener texto técnico corto y concreto.
