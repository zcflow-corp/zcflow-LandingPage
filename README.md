# Zcflow Landing — ES por defecto, sin 404
- **ES por defecto**, i18n nativo (`/` ES, `/en/` EN)
- `trailingSlash: 'always'` para evitar 404 en hosts que requieren barra final
- `Lang.astro` asegura barra final en el path al cambiar idioma
- Theme switch claro/oscuro (default **claro**)
- Tabs y LineChart como islas React (JSX)
- SCSS con tokens, Outfit (títulos) + Inter (cuerpo)

## Dev
npm i
npm run dev

## Build
npm run build
npm run preview

## QA & Multi-browser Testing
Este proyecto utiliza **Playwright** para garantizar que los componentes complejos (como el FlowBox en Canvas) funcionen correctamente en todos los motores, especialmente en **WebKit (Safari)**.

- `npx playwright test` — Ejecuta los tests en todos los navegadores (Chromium, Firefox, WebKit).
- `npx playwright test --project=webkit` — Ejecuta tests solo para Safari (útil para debuggear el bug de `overflow`).
- `npx playwright show-report` — Abre el reporte visual interactivo del último test.
- `npx playwright test --ui` — Abre el modo interactivo para ver los tests ejecutarse en tiempo real.