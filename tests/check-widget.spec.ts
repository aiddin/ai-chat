import { test, expect } from '@playwright/test';

test.describe('CDN Example Widget Check', () => {
  test('should show widget button on cdn-example.html', async ({ page }) => {
    // Navigate to the CDN example page
    await page.goto('http://localhost:3000/examples/cdn-example.html');

    console.log('📄 Navigated to cdn-example.html');

    // Wait a bit for the component to load from CDN
    await page.waitForTimeout(3000);

    // Take a screenshot of the whole page
    await page.screenshot({ path: 'test-results/cdn-example-full.png', fullPage: true });
    console.log('📸 Screenshot saved to test-results/cdn-example-full.png');

    // Check if ai-chat element exists
    const chatExists = await page.locator('ai-chat').count();
    console.log(`🔍 Found ${chatExists} ai-chat element(s)`);

    if (chatExists > 0) {
      const chatComponent = page.locator('ai-chat');

      // Get attributes
      const mode = await chatComponent.getAttribute('mode');
      const apiUrl = await chatComponent.getAttribute('api-url');
      const title = await chatComponent.getAttribute('title');

      console.log('📋 Component attributes:');
      console.log(`   - mode: ${mode}`);
      console.log(`   - api-url: ${apiUrl}`);
      console.log(`   - title: ${title}`);

      // Check if component has shadow root
      const hasShadowRoot = await chatComponent.evaluate((el) => !!el.shadowRoot);
      console.log(`🌓 Has shadow root: ${hasShadowRoot}`);

      if (hasShadowRoot) {
        // Try to find widget button in shadow DOM
        const widgetButtonExists = await chatComponent.evaluate((el) => {
          const button = el.shadowRoot?.querySelector('.widget-button');
          return !!button;
        });

        console.log(`🔘 Widget button exists: ${widgetButtonExists}`);

        if (widgetButtonExists) {
          // Get button position and size
          const buttonInfo = await chatComponent.evaluate((el) => {
            const button = el.shadowRoot?.querySelector('.widget-button') as HTMLElement;
            if (button) {
              const rect = button.getBoundingClientRect();
              const style = window.getComputedStyle(button);
              return {
                visible: rect.width > 0 && rect.height > 0,
                position: { x: rect.x, y: rect.y },
                size: { width: rect.width, height: rect.height },
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity
              };
            }
            return null;
          });

          console.log('📐 Widget button info:', JSON.stringify(buttonInfo, null, 2));

          expect(buttonInfo).not.toBeNull();
          expect(buttonInfo?.visible).toBe(true);

          // Try to click the button
          await chatComponent.evaluate((el) => {
            const button = el.shadowRoot?.querySelector('.widget-button') as HTMLElement;
            button?.click();
          });

          await page.waitForTimeout(500);
          console.log('🖱️ Clicked widget button');

          // Check if window opened
          const windowOpen = await chatComponent.evaluate((el) => {
            const window = el.shadowRoot?.querySelector('.widget-window.open');
            return !!window;
          });

          console.log(`📂 Widget window opened: ${windowOpen}`);

          // Take screenshot after click
          await page.screenshot({ path: 'test-results/cdn-example-clicked.png', fullPage: true });
          console.log('📸 Screenshot after click saved');

          expect(windowOpen).toBe(true);
        }
      }
    } else {
      console.log('❌ No ai-chat component found on page');

      // Log page content for debugging
      const bodyContent = await page.locator('body').innerHTML();
      console.log('📄 Page body content:', bodyContent.substring(0, 500));
    }
  });

  test('should load component from CDN', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/cdn-example.html');

    // Check if script loaded
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).map(s => ({
        src: s.src,
        type: s.type
      }));
    });

    console.log('📜 Page scripts:', JSON.stringify(scripts, null, 2));

    // Check for any errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.waitForTimeout(3000);

    if (errors.length > 0) {
      console.log('❌ Page errors:', errors);
    } else {
      console.log('✅ No page errors detected');
    }
  });
});
