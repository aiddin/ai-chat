import { test, expect } from '@playwright/test';

test.describe('AI Chat Web Component', () => {
  test('should load the Next.js page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    console.log('✅ Page title:', title);
    expect(title).toBeTruthy();
  });

  test('should render the web component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const chatExists = await page.evaluate(() => {
      return document.querySelector('ai-chat') !== null;
    });

    console.log('✅ Component exists:', chatExists);
    expect(chatExists).toBe(true);
  });

  test('should have shadow DOM', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasShadowRoot = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      return chat?.shadowRoot !== null;
    });

    console.log('✅ Has shadow root:', hasShadowRoot);
    expect(hasShadowRoot).toBe(true);
  });

  test('should display the title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const titleText = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      const title = chat?.shadowRoot?.querySelector('.title');
      return title?.textContent;
    });

    console.log('✅ Title text:', titleText);
    expect(titleText).toContain('AI Chat');
  });

  test('should have input field and send button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const elements = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      const input = chat?.shadowRoot?.querySelector('.input-field');
      const button = chat?.shadowRoot?.querySelector('.send-button');
      return {
        hasInput: input !== null,
        hasButton: button !== null
      };
    });

    console.log('✅ Has input:', elements.hasInput, 'Has button:', elements.hasButton);
    expect(elements.hasInput).toBe(true);
    expect(elements.hasButton).toBe(true);
  });

  test('should show empty state message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const emptyStateText = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      const emptyState = chat?.shadowRoot?.querySelector('.empty-state p');
      return emptyState?.textContent;
    });

    console.log('✅ Empty state:', emptyStateText);
    expect(emptyStateText).toContain('How can I help');
  });

  test('should accept input text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const testMessage = 'Hello, AI!';

    const inputValue = await page.evaluate((msg) => {
      const chat = document.querySelector('ai-chat');
      const input = chat?.shadowRoot?.querySelector('.input-field') as HTMLInputElement;
      if (input) {
        input.value = msg;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return input.value;
      }
      return null;
    }, testMessage);

    console.log('✅ Input value:', inputValue);
    expect(inputValue).toBe(testMessage);
  });

  test('should have correct api-url attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const apiUrl = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      return chat?.getAttribute('api-url');
    });

    console.log('✅ API URL:', apiUrl);
    expect(apiUrl).toBeTruthy();
  });

  test('should have theme attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const theme = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      return chat?.getAttribute('theme');
    });

    console.log('✅ Theme:', theme);
    expect(theme).toBe('light');
  });

  test('screenshot - visual verification', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-results/component-screenshot.png',
      fullPage: true
    });

    const chatExists = await page.evaluate(() => {
      return document.querySelector('ai-chat') !== null;
    });

    console.log('✅ Screenshot saved, component exists:', chatExists);
    expect(chatExists).toBe(true);
  });
});
