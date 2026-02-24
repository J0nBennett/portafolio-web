# 📘 Portfolio Web – Documentación Maestra
*(AI + Human Collaboration Spec)*

## 1. Propósito del proyecto

Este repositorio contiene un **portafolio web profesional**, diseñado para:

- Representar perfiles técnicos (QA, Dev, DevOps, Automation, etc.)
- Demostrar **capacidad real de ingeniería**, no solo diseño visual
- Servir como **pieza de evaluación técnica** para recruiters, tech leads y clientes
- Ser **rápido, accesible, mantenible y escalable**
- Estar **100% deployado en GitHub Pages**

El proyecto **no está enfocado en un rol único**.
Debe ser **genérico, adaptable y reutilizable** para cualquier profesional tech.

---

## 2. Stack oficial (no cambiar sin justificar)

- **Framework:** Astro (Static Site Generation)
- **Estilos:** TailwindCSS
- **Contenido:** MDX + JSON
- **Deploy:** GitHub Pages vía GitHub Actions
- **Node:** LTS

### Principios técnicos
- Evitar JavaScript innecesario
- Priorizar HTML semántico y SSR
- Astro Islands solo si es estrictamente necesario
- No agregar librerías “por comodidad”

---

## 3. Arquitectura del proyecto (obligatoria)


src/
components/ → UI reutilizable
layouts/ → Layouts base y documentales
pages/ → Rutas del sitio
content/ → Contenido MDX (projects, case-studies, posts)
data/ → Configuración y data estática (JSON)
styles/ → Estilos globales


### Reglas
- ❌ No hardcodear contenido en páginas
- ✅ Todo texto proviene de `content/` o `data/`
- Componentes puros, sin lógica de negocio compleja
- Layout ≠ Componentes

---

## 4. Filosofía de diseño

### Objetivo visual
- Profesional
- Minimalista
- Premium
- Sin efectos innecesarios

### Lineamientos
- Espaciado generoso
- Cards limpias
- Tipografía legible
- Colores neutros
- Hover y animaciones sutiles
- Dark mode opcional (sin romper SSR)

❌ Evitar:
- Animaciones exageradas
- Gradientes sin justificación
- Librerías visuales pesadas
- UI tipo dashboard admin

---

## 5. Estructura de secciones

### Home
- Hero (nombre + rol + tagline)
- CTA claros (CV / Proyectos)
- Highlights (métricas reales)
- Featured Projects

### Projects
- Cards desde contenido MDX
- Filtros por tags
- Cada proyecto explica:
  - Problema
  - Solución
  - Stack
  - Rol humano vs IA (si aplica)

### Case Studies (crítico)
Cada case study debe incluir:
1. Contexto
2. Problema
3. Decisiones técnicas
4. Arquitectura
5. Resultados
6. Lecciones aprendidas

Formato MDX tipo documentación técnica.

### Writing
- Artículos técnicos cortos
- Aprendizajes reales
- Sin marketing ni relleno

### About
- Historia breve
- Enfoque profesional
- Valores técnicos
- Timeline de experiencia

---

## 6. Estándares de contenido

### Tono
- Claro
- Técnico
- Honesto
- Sin humo

### Reglas
- No exagerar logros
- No inventar métricas irreales
- Explicar el **por qué**, no solo el **qué**
- Priorizar decisiones técnicas

---

## 7. Uso de IA en el proyecto

Se permite:
- Código generado por IA
- Diseño asistido por IA
- Documentación generada por IA

Condiciones:
- Las decisiones finales son humanas
- Todo fue revisado y validado
- La IA es una herramienta, no la autora

Debe aclararse en proyectos/case studies:
- Qué parte fue asistida por IA
- Qué parte fue hecha manualmente

---

## 8. Convenciones de código

- Código limpio y legible
- Nombres descriptivos
- Comentarios solo cuando aportan contexto

### Componentes
- Una responsabilidad por componente
- Props explícitas
- Evitar lógica compleja en UI

---

## 9. SEO & Performance (no negociable)

Debe incluir:
- Meta tags
- OpenGraph
- Sitemap
- robots.txt
- Alto puntaje Lighthouse

Evitar:
- Imágenes sin optimizar
- JS pesado
- Assets bloqueantes

---

## 10. GitHub Pages & CI

- Deploy automático con GitHub Actions
- Build reproducible
- README con:
  - Setup local
  - Build
  - Deploy
  - Cómo agregar contenido nuevo

---

## 11. Qué NO hacer

❌ No convertir el portfolio en un CV largo  
❌ No usar buzzwords sin respaldo  
❌ No acoplar a un solo rol  
❌ No agregar frameworks innecesarios  
❌ No romper la arquitectura sin justificar  

---

## 12. Uso con IA

Este documento es la **fuente de verdad**.

Cuando se use IA:
1. Pasar este archivo completo como contexto
2. Pedir cambios específicos
3. No redefinir reglas ya establecidas

---

## 13. Estado mental del proyecto

Este portfolio es:
- Un producto profesional
- Un activo de carrera
- Una demostración de criterio técnico