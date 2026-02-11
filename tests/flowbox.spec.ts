import { test, expect } from '@playwright/test'

test('Verificar renderizado de gráfica en todos los motores', async ({ page }) => {
  await page.goto('/')

  const canvas = page.locator('canvas.flowbox__canvas')

  await expect(canvas).toBeVisible()

  const dimensiones = await canvas.boundingBox()
  expect(dimensiones?.height).toBeGreaterThan(100)
})
