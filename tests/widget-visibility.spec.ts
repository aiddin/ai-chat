import { test, expect } from '@playwright/test';

test.describe('Widget Visibility Tests', () => {
  test('cdn-example.html - widget button should be visible', async ({ page }) => {
    // Go to the CDN example page
    await page.goto('http://localhost:3000/examples/cdn-example.html');

    // Wait for the ai-chat component to load
    const chatComponent = page.locator('ai-chat');
    await expect(chatComponent).toBeVisible({ timeout: 10000 });

    // Check that mode is widget
    const mode = await chatComponent.getAttribute('mode');
    expect(mode).toBe('widget');

    // Access shadow DOM and check for widget button
    const widgetButton = chatComponent.locator('.widget-button');
    await expect(widgetButton).toBeVisible({ timeout: 5000 });

    console.log('✅ Widget button is visible');

    // Take screenshot
    await page.screenshot({ path: 'test-results/widget-visible.png', fullPage: true });
  });

  test('cdn-example.html - widget button should be clickable', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/cdn-example.html');

    const chatComponent = page.locator('ai-chat');
    await expect(chatComponent).toBeVisible({ timeout: 10000 });

    // Click the widget button
    const widgetButton = chatComponent.locator('.widget-button');
    await widgetButton.click();

    // Wait a bit for animation
    await page.waitForTimeout(500);

    // Check if widget window is now open
    const widgetWindow = chatComponent.locator('.widget-window.open');
    await expect(widgetWindow).toBeVisible();

    console.log('✅ Widget opens on click');

    // Take screenshot of open widget
    await page.screenshot({ path: 'test-results/widget-open.png', fullPage: true });
  });

  test('cdn-example.html - widget should be in bottom-right corner', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/cdn-example.html');

    const chatComponent = page.locator('ai-chat');
    await expect(chatComponent).toBeVisible({ timeout: 10000 });

    // Check component position
    const box = await chatComponent.boundingBox();
    const viewportSize = page.viewportSize();

    if (box && viewportSize) {
      // Widget should be near bottom-right
      const isNearBottom = box.y > viewportSize.height - 200;
      const isNearRight = box.x > viewportSize.width - 200;

      expect(isNearBottom).toBeTruthy();
      expect(isNearRight).toBeTruthy();

      console.log(`✅ Widget positioned at: x=${box.x}, y=${box.y}`);
    }
  });

  test('widget-cdn.html - widget should be visible', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/widget-cdn.html');

    const chatComponent = page.locator('ai-chat');
    await expect(chatComponent).toBeVisible({ timeout: 10000 });

    const widgetButton = chatComponent.locator('.widget-button');
    await expect(widgetButton).toBeVisible();

    console.log('✅ Widget-cdn.html widget is visible');

    await page.screenshot({ path: 'test-results/widget-cdn-visible.png', fullPage: true });
  });
});
