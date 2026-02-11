import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    /* --- MÓVILES APPLE (Safari/WebKit) --- */
    {
      name: 'iPhone SE (Pantalla pequeña)',
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'iPhone 13/14 (Estándar)',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'iPhone 14 Pro Max (Pantalla grande)',
      use: { ...devices['iPhone 14 Pro Max'] },
    },

    /* --- MÓVILES ANDROID (Chrome/Blink) --- */
    {
      name: 'Pixel 5 (Android Estándar)',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Galaxy S21 Ultra (Android Grande)',
      use: { ...devices['Galaxy S21'] },
    },

    /* --- TABLETS (Crucial para gráficas/Canvas) --- */
    {
      name: 'iPad Pro 11 (Safari Tablet)',
      use: { ...devices['iPad Pro 11'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
})
