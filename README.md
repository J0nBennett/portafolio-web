# Portfolio Web Profesional (Astro + Tailwind + MDX)

Portfolio técnico reusable, orientado a demostrar criterio de ingeniería con contenido desacoplado (`content/` y `data/`), build estático y deploy automático en GitHub Pages.

## Stack
- Astro (SSG)
- TailwindCSS
- MDX para contenido
- GitHub Actions para deploy

## Setup local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy en GitHub Pages
El workflow está en `/.github/workflows/deploy.yml` y se ejecuta al hacer push a `main`.

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
Existe `public/404.html` para cubrir rutas desconocidas en GitHub Pages.

- En project site (`username.github.io/repo/...`) la página infiere `repo` como base y redirige a `/<repo>/`.
- En user site (`username.github.io/...`) redirige a `/`.

Esto evita quedar en una 404 dura al abrir URLs inexistentes o rutas antiguas.

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
