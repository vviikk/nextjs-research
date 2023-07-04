import { chromium, Browser, Page, test } from '@playwright/test'

const { describe, beforeAll, afterAll, beforeEach, afterEach } = test

describe('GroceryApp', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await chromium.launch()
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto(`http://localhost:${process.env.PORT}`) // Update the URL to match your development environment
  })

  afterEach(async () => {
    await page.close()
  })

  test('should add a new grocery', async () => {
    // Type the grocery name in the input field
    await page.fill('input[aria-label="Add Grocery"]', 'Milk')

    // Click the add button
    await page.click('button')

    // Wait for the grocery item to be added
    await page.waitForSelector('li:last-child .grocery-item')

    // Verify that the grocery item is added with the correct name
    const groceryName = await page.textContent('li:last-child .grocery-item')
    expect(groceryName).toBe('Milk')
  })

  test('should mark a grocery as purchased', async () => {
    // Mark the first grocery as purchased
    await page.click('input[type="checkbox"]')

    // Wait for the grocery item to be updated
    await page.waitForSelector('li:first-child input[type="checkbox"]:checked')

    // Verify that the grocery item is marked as purchased
    const isChecked = await page.isChecked(
      'li:first-child input[type="checkbox"]'
    )
    expect(isChecked).toBe(true)
  })

  test('should edit a grocery name', async () => {
    // Click the edit button of the second grocery
    await page.click('li:nth-child(2) button[aria-label="edit"]')

    // Wait for the edit dialog to appear
    await page.waitForSelector('.edit-dialog')

    // Type the new grocery name in the text field
    await page.fill('.edit-dialog input', 'Eggs')

    // Click the save button
    await page.click('.edit-dialog button[aria-label="save"]')

    // Wait for the grocery item to be updated
    await page.waitForSelector('li:nth-child(2) .grocery-item')

    // Verify that the grocery item is updated with the new name
    const groceryName = await page.textContent('li:nth-child(2) .grocery-item')
    expect(groceryName).toBe('Eggs')
  })

  test('should delete a grocery', async () => {
    // Click the delete button of the third grocery
    await page.click('li:nth-child(3) button[aria-label="delete"]')

    // Wait for the grocery item to be removed
    await page.waitForSelector('li:nth-child(3)', { state: 'detached' })

    // Verify that the grocery item is deleted
    const groceryItem = await page.$('li:nth-child(3)')
    expect(groceryItem).toBeNull()
  })
})
