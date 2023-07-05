import { chromium, Browser, Page, test } from '@playwright/test'
import { text } from 'stream/consumers'

const { describe, beforeAll, afterAll, beforeEach, afterEach, expect } = test

const URL = `http://localhost:${process.env.PORT || 3050}`

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
    await page.goto(URL) // Update the URL to match your development environment
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

  test('should Create, edit, modify & delete an item', async () => {
    const groceryName = 'New Grocery Item ' + Date.now()
    // get the test id of the first grocery
    await page.goto(URL)
    await page.getByTestId('add-grocery-button').click()
    await page.getByLabel('Grocery Name').click()
    await page.getByLabel('Grocery Name').fill(groceryName)
    await page.getByTestId('add-button').click()

    // wait for the new grocery item with groceryName to appear in the list
    await page.waitForSelector(`text=${groceryName}`)

    // find the test id of the last item in li[data-testid="section-pendingGroceries"]
    const lastGroceryTestId = await page.getAttribute(
      'li[data-testid="pendingGroceries"] li:last-child',
      'data-testid'
    )

    // expect checkbox of item is unchecked
    expect(
      await page.isChecked(
        `li[data-testid="${lastGroceryTestId}"] input[type="checkbox"]`
      )
    ).toBe(false)

    // find the edit button inside the last grocery and click it
    page
      .getByTestId(lastGroceryTestId)
      .getByRole('button', { name: 'edit' })
      .click()
    await page.getByRole('textbox').click()
    await page.waitForTimeout(150)
    await page.getByRole('textbox').fill('A New Item EDITED')
    await page.getByRole('spinbutton').click()
    await page.waitForTimeout(50)
    await page.getByRole('spinbutton').fill('42')
    // wait for .5 seconds
    await page.waitForTimeout(50)
    await page.getByRole('button', { name: 'save' }).click()
    // wait for the edit button to be shown again
    await page.waitForSelector(
      `li[data-testid="${lastGroceryTestId}"] [data-testid="edit-button"]`
    )

    // wait for the grocery name to be updated
    await page.waitForSelector(`text='A New Item EDITED (x 42)'`)

    //expect the grocery name to be updated
    expect(
      await page.textContent(`li[data-testid="${lastGroceryTestId}"]`)
    ).toBe('A New Item EDITED (x 42)')

    await page
      .getByTestId(lastGroceryTestId)
      .getByRole('button', { name: 'delete' })
      .click()

    // wait for the last grocery to be removed
    await page.waitForSelector(
      `li[data-testid="section-pendingGroceries"] li[data-testid="${lastGroceryTestId}"]`,
      { state: 'detached' }
    )
  })

  test('should toggle the checkbox and move the item to isPurchased & move back when toggled', async () => {
    const groceryName = 'New Grocery Item ' + Date.now()
    // get the test id of the first grocery
    await page.goto(URL)
    await page.getByTestId('add-grocery-button').click()
    await page.getByLabel('Grocery Name').click()
    await page.getByLabel('Grocery Name').fill(groceryName)
    await page.getByTestId('add-button').click()

    // find the test id of the last item in li[data-testid="section-pendingGroceries"]
    const lastGroceryTestId = await page.getAttribute(
      'li[data-testid="pendingGroceries"] li:last-child',
      'data-testid'
    )

    // expect checkbox of item is unchecked
    expect(
      await page.isChecked(
        `li[data-testid="${lastGroceryTestId}"] input[type="checkbox"]`
      )
    ).toBe(false)

    // click the checkbox
    await page.getByTestId(lastGroceryTestId).getByRole('checkbox').click()

    // expect checkbox of item is checked and item is moved to isPurchased
    expect(
      await page.isChecked(
        `li[data-testid="purchasedGroceries"] li[data-testid="${lastGroceryTestId}"] input[type="checkbox"]`
      )
    ).toBe(true)

    // click the checkbox
    await page.getByTestId(lastGroceryTestId).getByRole('checkbox').click()

    // expect checkbox of item is unchecked and item is moved back to pendingGroceries
    expect(
      await page.isChecked(
        `li[data-testid="pendingGroceries"] li[data-testid="${lastGroceryTestId}"] input[type="checkbox"]`
      )
    ).toBe(false)
  })
})
