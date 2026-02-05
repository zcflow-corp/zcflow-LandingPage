import { ImageMetadata } from 'astro'

const allImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/*.{jpeg,jpg,png,gif,webp,svg}'
)

export const getImageMetadata = async (path: string): Promise<ImageMetadata | null> => {
  const cleanPath = path.startsWith('/src/') ? path : `/src/${path.replace(/^\/?(assets\/)?/, 'assets/')}`;

  const loader = allImages[cleanPath]

  if (!loader) {
    console.error(`no found: ${cleanPath}`)
    return null
  }
  const module = await loader()
  return module.default
}
