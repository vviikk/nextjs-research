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

  test('should add a new grocery item', async () => {
    // Open the Add Grocery Dialog
    await page.click('[data-testid="add-grocery-button"]')
    await page.waitForSelector('[data-testid="add-grocery-dialog"]')

    // Enter the grocery name
    await page.fill(
      '[data-testid="grocery-name-input"] input',
      'New Grocery Item'
    )

    // Click the Add button
    await page.click('[data-testid="add-button"]')

    // Wait for the new grocery item to appear in the list
    // await page.waitForSelector('[data-testid="grocery-item"]')
    // const groceryItem = await page.$('[data-testid="grocery-item"]')

    // wait for text to appear
    await page.waitForSelector('text=New Grocery Item')
    // expect(groceryItem).toBeTruthy()
  })

  // test('should add a new grocery', async () => {
  //   // Type the grocery name in the input field
  //   await page.fill('input[aria-label="Add Grocery"]', 'Milk')

  //   // Click the add button
  //   await page.click('button')

  //   // Wait for the grocery item to be added
  //   await page.waitForSelector('li:last-child .grocery-item')

  //   // Verify that the grocery item is added with the correct name
  //   const groceryName = await page.textContent('li:last-child .grocery-item')
  //   expect(groceryName).toBe('Milk')
  // })

  test('should mark a grocery as purchased', async () => {
    // get the test id of the first grocery
    const firstGroceryTestId = await page.getAttribute(
      'li:first-child',
      'data-testid'
    )

    // find the checkbox inside the first grocery and click it
    await page.click(
      `[data-testid="${firstGroceryTestId}"] input[type="checkbox"]`
    )

    // Wait for the grocery item's checkbox with that test id to be checked
    await page.waitForSelector(
      `[data-testid="${firstGroceryTestId}"] input[type="checkbox"]:checked`
    )

    // Verify that the grocery item is marked as purchased
    const isChecked = await page.isChecked(
      `[data-testid="${firstGroceryTestId}"] input[type="checkbox"]`
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
