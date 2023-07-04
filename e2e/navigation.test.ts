import { test, expect } from '@playwright/test'

const PORT = process.env.PORT || 3000
test('should navigate to the about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto(`http://localhost:${PORT}/about`)
  // Find an element with the text 'About Page' and click on it
  await page.click('text=Home')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL(`http://localhost:${PORT}/`)
  // The new page should contain an h1 with "About Page"
  // await expect(page.locator('h1')).toContainText('About Page')
})
