import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('CDN Examples', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/ask', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: `Mock response to: "${postData.question}"`
          // FAQ functionality - commented out for now
          // faqs_used: [
          //   { "no.": "1", question: "How do I get started?" },
          //   { "no.": "2", question: "What features are available?" }
          // ]
        })
      });
    });
  });

  test('local-test.html - should load and display chat component', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/local-test.html');
    await page.goto(`file://${filePath}`);

    // Wait for component to load
    await page.waitForSelector('ai-chat', { timeout: 10000 });

    // Check if component is visible
    const chatComponent = page.locator('ai-chat');
    await expect(chatComponent).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/local-test.png', fullPage: true });

    console.log('✅ Chat component loaded successfully');
  });

  test('local-test.html - should send and receive messages', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/local-test.html');
    await page.goto(`file://${filePath}`);

    // Wait for component to load
    await page.waitForSelector('ai-chat', { timeout: 10000 });

    const chatComponent = page.locator('ai-chat');

    // Access shadow DOM
    const shadowRoot = await chatComponent.evaluateHandle((el) => el.shadowRoot);

    // Find input field in shadow DOM
    const inputField = await shadowRoot.$('input[type="text"]');
    expect(inputField).not.toBeNull();

    // Type a message
    if (inputField) {
      await inputField.type('Hello, test message!');

      // Find and click send button
      const sendButton = await shadowRoot.$('button[type="submit"]');
      expect(sendButton).not.toBeNull();

      if (sendButton) {
        await sendButton.click();

        // Wait for response
        await page.waitForTimeout(1000);

        // Verify message was sent (check for user message in shadow DOM)
        const messages = await shadowRoot.$$('.message');
        expect(messages.length).toBeGreaterThan(0);

        console.log('✅ Message sent and received successfully');
      }
    }
  });

  // FAQ click test - commented out for now
  // test('local-test.html - should handle FAQ clicks', async ({ page }) => {
  //   const filePath = resolve(__dirname, '../examples/local-test.html');
  //   await page.goto(`file://${filePath}`);
  //
  //   await page.waitForSelector('ai-chat', { timeout: 10000 });
  //   const chatComponent = page.locator('ai-chat');
  //   const shadowRoot = await chatComponent.evaluateHandle((el) => el.shadowRoot);
  //
  //   // Send initial message to get FAQs
  //   const inputField = await shadowRoot.$('input[type="text"]');
  //   if (inputField) {
  //     await inputField.type('Test question');
  //     const sendButton = await shadowRoot.$('button[type="submit"]');
  //     if (sendButton) {
  //       await sendButton.click();
  //       await page.waitForTimeout(1500);
  //
  //       // Check if FAQs appear
  //       const faqItems = await shadowRoot.$$('.faq-item-static');
  //       if (faqItems.length > 0) {
  //         console.log(`✅ Found ${faqItems.length} FAQ items`);
  //
  //         // Click first FAQ
  //         await faqItems[0].click();
  //         await page.waitForTimeout(1000);
  //
  //         console.log('✅ FAQ click handled successfully');
  //       }
  //     }
  //   }
  // });

  test('local-test.html - should support theme attribute', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/local-test.html');
    await page.goto(`file://${filePath}`);

    await page.waitForSelector('ai-chat', { timeout: 10000 });
    const chatComponent = page.locator('ai-chat');

    // Check theme attribute
    const theme = await chatComponent.getAttribute('theme');
    expect(theme).toBe('light');

    // Change theme
    await chatComponent.evaluate((el: any) => {
      el.theme = 'dark';
    });

    await page.waitForTimeout(500);

    const newTheme = await chatComponent.getAttribute('theme');
    expect(newTheme).toBe('dark');

    console.log('✅ Theme switching works');
  });

  test('local-test.html - should emit custom events', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/local-test.html');
    await page.goto(`file://${filePath}`);

    await page.waitForSelector('ai-chat', { timeout: 10000 });

    // Listen for custom events
    const events: string[] = [];

    await page.evaluate(() => {
      const chat = document.querySelector('ai-chat');
      if (chat) {
        chat.addEventListener('message-sent', () => {
          (window as any).messageSentFired = true;
        });
        chat.addEventListener('response-received', () => {
          (window as any).responseReceivedFired = true;
        });
      }
    });

    const chatComponent = page.locator('ai-chat');
    const shadowRoot = await chatComponent.evaluateHandle((el) => el.shadowRoot);

    const inputField = await shadowRoot.$('input[type="text"]');
    if (inputField) {
      await inputField.type('Test event');
      const sendButton = await shadowRoot.$('button[type="submit"]');
      if (sendButton) {
        await sendButton.click();
        await page.waitForTimeout(1500);

        // Check if events were fired
        const messageSentFired = await page.evaluate(() => (window as any).messageSentFired);
        const responseReceivedFired = await page.evaluate(() => (window as any).responseReceivedFired);

        expect(messageSentFired).toBe(true);
        expect(responseReceivedFired).toBe(true);

        console.log('✅ Custom events fired successfully');
      }
    }
  });

  test('widget-cdn.html - should display floating widget', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/widget-cdn.html');

    // Navigate to the page
    await page.goto(`file://${filePath}`);

    // Wait for component to load
    await page.waitForSelector('ai-chat', { timeout: 10000 });

    const chatComponent = page.locator('ai-chat');
    await expect(chatComponent).toBeVisible();

    // Check if it's in widget mode
    const mode = await chatComponent.getAttribute('mode');
    expect(mode).toBe('widget');

    // Take screenshot
    await page.screenshot({ path: 'test-results/widget-mode.png', fullPage: true });

    console.log('✅ Widget mode loaded successfully');
  });

  test('widget-cdn.html - should toggle widget open/close', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/widget-cdn.html');
    await page.goto(`file://${filePath}`);

    await page.waitForSelector('ai-chat', { timeout: 10000 });
    const chatComponent = page.locator('ai-chat');
    const shadowRoot = await chatComponent.evaluateHandle((el) => el.shadowRoot);

    // Find widget button
    const widgetButton = await shadowRoot.$('.widget-button');
    expect(widgetButton).not.toBeNull();

    if (widgetButton) {
      // Click to open
      await widgetButton.click();
      await page.waitForTimeout(500);

      // Check if window is open
      const widgetWindow = await shadowRoot.$('.widget-window.open');
      expect(widgetWindow).not.toBeNull();

      // Take screenshot of open widget
      await page.screenshot({ path: 'test-results/widget-open.png', fullPage: true });

      // Click to close
      await widgetButton.click();
      await page.waitForTimeout(500);

      console.log('✅ Widget toggle works');
    }
  });
});

test.describe('Component Properties', () => {
  test('should accept and update properties via JavaScript', async ({ page }) => {
    const filePath = resolve(__dirname, '../examples/local-test.html');
    await page.goto(`file://${filePath}`);

    await page.waitForSelector('ai-chat', { timeout: 10000 });

    const properties = await page.evaluate(() => {
      const chat = document.querySelector('ai-chat') as any;

      // Test property access
      const initialApiUrl = chat.apiUrl;
      const initialSessionId = chat.sessionId;
      const initialTitle = chat.chatTitle;

      // Update properties
      chat.apiUrl = 'https://new-api.com';
      chat.sessionId = 'new-session';
      chat.chatTitle = 'New Title';

      return {
        initialApiUrl,
        initialSessionId,
        initialTitle,
        newApiUrl: chat.apiUrl,
        newSessionId: chat.sessionId,
        newTitle: chat.chatTitle
      };
    });

    expect(properties.initialApiUrl).toBe('http://localhost:8000');
    expect(properties.newApiUrl).toBe('https://new-api.com');
    expect(properties.newSessionId).toBe('new-session');

    console.log('✅ Properties can be updated via JavaScript');
  });
});
