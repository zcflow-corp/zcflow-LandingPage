import { test, expect } from '@playwright/test'

test('Verificar renderizado de gráfica en todos los motores', async ({ page }) => {
  await page.goto('/')

  const canvas = page.locator('canvas.flowbox__canvas')

  await expect(canvas).toBeVisible()

  const dimensiones = await canvas.boundingBox()
  expect(dimensiones?.height).toBeGreaterThan(100)
})

test('Comparativa visual: Hero Search en Chrome vs Safari', async ({ page }) => {
  await page.goto('http://localhost:4321')

  const searchBox = page.locator('.hero__search')
  await expect(searchBox).toBeVisible()

  await page.locator('#hero-flow').screenshot({
    path: `hero-full-${test.info().project.name}.jpg`,
  })

  await searchBox.screenshot({
    path: `search-box-${test.info().project.name}.jpg`,
  })
})
