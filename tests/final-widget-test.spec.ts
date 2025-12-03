import { test, expect } from '@playwright/test';

test('Widget is visible on cdn-example.html', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/examples/cdn-example.html');

  console.log('✅ Page loaded');

  // Wait for component to load
  await page.waitForTimeout(5000);

  // Check if ai-chat exists
  const chatComponent = page.locator('ai-chat');
  await expect(chatComponent).toBeVisible();

  console.log('✅ ai-chat component is visible');

  // Get component attributes
  const mode = await chatComponent.getAttribute('mode');
  console.log(`✅ Mode: ${mode}`);

  expect(mode).toBe('widget');

  // Take screenshot
  await page.screenshot({ path: 'test-results/final-widget-check.png', fullPage: true });

  console.log('✅ Screenshot saved to test-results/final-widget-check.png');
  console.log('✅ TEST PASSED - Widget is working!');
});
