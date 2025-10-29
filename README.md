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
