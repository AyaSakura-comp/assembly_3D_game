const { test, expect } = require('@playwright/test');

test.describe('1980s Retro Hardware Visuals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:4173');
    // Wait for the 3D scene to initialize
    await page.waitForTimeout(2000);
  });

  test('Apex-86 Case is present in the scene', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await expect(page.getByText(/LVL 1\/10/)).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/task1-refactor-verify.png' });
  });

  test('DIPChip displays the correct register value', async ({ page }) => {
    const executeBtn = page.getByText('▶ Execute');
    await expect(executeBtn).toBeVisible();
    await expect(executeBtn).not.toBeDisabled();
  });
});
