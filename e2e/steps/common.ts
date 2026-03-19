import { Given, Then } from '../fixtures'

Given('I open the app', async ({ page }) => {
  await page.goto('/')
})

Then('I see the heading {string}', async ({ page }, heading: string) => {
  await page.getByRole('heading', { name: heading }).waitFor()
})
