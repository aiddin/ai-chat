import { test, expect } from '@playwright/test';

test.describe('Live Server - CDN Example Widget', () => {
  test('should display widget on live server', async ({ page }) => {
    // Navigate to live server URL
    await page.goto('http://127.0.0.1:5500/examples/cdn-example.html');

    console.log('📄 Opened: http://127.0.0.1:5500/examples/cdn-example.html');

    // Wait for component to load from CDN
    await page.waitForTimeout(5000);

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/live-server-initial.png', fullPage: true });
    console.log('📸 Initial screenshot saved');

    // Check if ai-chat element exists
    const chatComponent = page.locator('ai-chat');
    const exists = await chatComponent.count();

    console.log(`🔍 ai-chat elements found: ${exists}`);

    if (exists > 0) {
      // Get component details
      const mode = await chatComponent.getAttribute('mode');
      const apiUrl = await chatComponent.getAttribute('api-url');
      const sessionId = await chatComponent.getAttribute('session-id');
      const title = await chatComponent.getAttribute('title');
      const theme = await chatComponent.getAttribute('theme');

      console.log('📋 Component Configuration:');
      console.log(`   mode: ${mode}`);
      console.log(`   api-url: ${apiUrl}`);
      console.log(`   session-id: ${sessionId}`);
      console.log(`   title: ${title}`);
      console.log(`   theme: ${theme}`);

      // Check shadow DOM
      const shadowInfo = await chatComponent.evaluate((el) => {
        const hasShadow = !!el.shadowRoot;
        if (!hasShadow) return { hasShadow: false };

        const widgetButton = el.shadowRoot?.querySelector('.widget-button');
        const widgetWindow = el.shadowRoot?.querySelector('.widget-window');

        return {
          hasShadow: true,
          hasWidgetButton: !!widgetButton,
          hasWidgetWindow: !!widgetWindow,
          widgetButtonVisible: widgetButton ? window.getComputedStyle(widgetButton).display !== 'none' : false
        };
      });

      console.log('🌓 Shadow DOM Info:', JSON.stringify(shadowInfo, null, 2));

      expect(shadowInfo.hasShadow).toBe(true);
      expect(shadowInfo.hasWidgetButton).toBe(true);

      if (shadowInfo.hasWidgetButton) {
        console.log('✅ Widget button found in shadow DOM');

        // Click the widget button
        await chatComponent.evaluate((el) => {
          const button = el.shadowRoot?.querySelector('.widget-button') as HTMLElement;
          if (button) {
            button.click();
            console.log('Clicked widget button');
          }
        });

        await page.waitForTimeout(1000);

        // Take screenshot after click
        await page.screenshot({ path: 'test-results/live-server-opened.png', fullPage: true });
        console.log('📸 Widget opened screenshot saved');

        // Check if window is open
        const isOpen = await chatComponent.evaluate((el) => {
          const window = el.shadowRoot?.querySelector('.widget-window.open');
          return !!window;
        });

        console.log(`📂 Widget window open: ${isOpen}`);
        expect(isOpen).toBe(true);

        console.log('✅ TEST PASSED: Widget is working correctly!');
      } else {
        console.log('❌ Widget button not found');
      }
    } else {
      console.log('❌ TEST FAILED: ai-chat component not found');

      // Debug info
      const pageContent = await page.content();
      console.log('Page HTML (first 1000 chars):', pageContent.substring(0, 1000));
    }
  });

  test('check for console errors', async ({ page }) => {
    const errors: string[] = [];
    const consoleMessages: string[] = [];

    page.on('console', (msg) => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    await page.goto('http://127.0.0.1:5500/examples/cdn-example.html');
    await page.waitForTimeout(5000);

    console.log('\n📜 All Console Messages:');
    consoleMessages.forEach(msg => console.log(msg));

    if (errors.length > 0) {
      console.log('\n❌ Errors detected:');
      errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\n✅ No errors detected');
    }

    expect(errors.length).toBe(0);
  });
});
