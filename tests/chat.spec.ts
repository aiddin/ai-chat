import { test, expect } from '@playwright/test';

test.describe('AI Chat FAQ Display', () => {
  test('should display text response, not JSON', async ({ page }) => {
    // Mock the API response
    await page.route('**/ask', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: "MySTI mempunyai beberapa fungsi utama:\n\n1. Sebagai medium untuk pemohon yang layak memohon logo dan sijil bagi produk dan perkhidmatan hasil penyelidikan dan pembangunan (R&D) tempatan.\n\n2. Menjadi pangkalan data yang mengumpulkan barangan dan perkhidmatan R&D tempatan yang telah diluluskan dengan logo dan sijil MySTI.\n\n3. Menjadi rujukan untuk program Perolehan Kerajaan bagi barangan dan perkhidmatan yang dihasilkan dari R&D tempatan.\n\nObjektif utamanya adalah untuk merangsang pertumbuhan industri tempatan, mengurangkan kebergantungan kepada import, dan memacu pertumbuhan ekonomi berasaskan teknologi tempatan.",
          faqs_used: [
            { "no.": "1", "question": "Apakah MySTI?" },
            { "no.": "5", "question": "Mengapa MySTI diwujudkan?" },
            { "no.": "7", "question": "Apakah objektif utama program MySTI?" }
          ]
        })
      });
    });

    // Navigate to the app
    await page.goto('/');

    // Wait for the chat component to load
    await page.waitForSelector('ai-chat');

    // Click the widget button to open chat
    const chatWidget = page.locator('ai-chat');
    await chatWidget.locator('button.widget-button').click();

    // Wait for chat window to open
    await page.waitForSelector('.widget-window.open');

    // Type a message
    const input = page.locator('.input-field');
    await input.fill('What is MySTI?');

    // Send the message
    const sendButton = page.locator('.send-button');
    await sendButton.click();

    // Wait for the response
    await page.waitForSelector('.message.assistant', { timeout: 10000 });

    // Get the response message content
    const messageContent = page.locator('.message.assistant .message-content');
    const messageText = await messageContent.locator('.message-text').textContent();

    console.log('Message text:', messageText);

    // Verify it's NOT displaying JSON
    expect(messageText).not.toContain('"no."');
    expect(messageText).not.toContain('"question"');
    expect(messageText).not.toContain('"response"');
    expect(messageText).not.toContain('faqs_used');
    expect(messageText).not.toContain('{');
    expect(messageText).not.toContain('}');

    // Verify it contains the actual text
    expect(messageText).toContain('MySTI mempunyai beberapa fungsi utama');
    expect(messageText).toContain('Sebagai medium untuk pemohon');

    // Verify FAQs are displayed separately
    const faqSection = messageContent.locator('.faq-section');
    await expect(faqSection).toBeVisible();

    // Check FAQ title
    await expect(faqSection.locator('.faq-title')).toHaveText('Related FAQs:');

    // Check FAQ items
    const faqItems = faqSection.locator('.faq-item');
    await expect(faqItems).toHaveCount(3);

    // Verify FAQ content
    await expect(faqItems.nth(0)).toContainText('1.');
    await expect(faqItems.nth(0)).toContainText('Apakah MySTI?');
    await expect(faqItems.nth(1)).toContainText('5.');
    await expect(faqItems.nth(2)).toContainText('7.');

    console.log('✅ Test passed: Text displayed correctly, no JSON format');
  });
});
