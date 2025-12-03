# 🚀 AI Chat - CDN Embed Guide

Quick guide to embedding AI Chat in any website using CDN.

## ⚡ Quick Embed (Copy & Paste)

### Fullscreen Chat

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>
  <style>body { margin: 0; height: 100vh; }</style>
</head>
<body>
  <ai-chat api-url="YOUR_API_URL" session-id="user-123" title="AI Assistant"></ai-chat>
</body>
</html>
```

### Widget Mode (Floating Button)

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>
</head>
<body>
  <!-- Your website content here -->
  <h1>My Website</h1>

  <!-- Chat widget -->
  <ai-chat mode="widget" api-url="YOUR_API_URL" session-id="user-123" title="Support"></ai-chat>
</body>
</html>
```

## 🎨 Interactive Generator

Open [embed.html](./embed.html) in your browser for a visual embed code generator with live preview!

## 📦 CDN Options

| Provider | Pros | CDN URL |
|----------|------|---------|
| **jsDelivr** ⭐ | Fast, global CDN, automatic minification | `https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs` |
| **unpkg** | Simple, no config needed | `https://unpkg.com/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs` |
| **esm.sh** | ES modules optimized | `https://esm.sh/@a.izzuddin/ai-chat@0.2.4` |

## 🔧 Customization Options

Add these attributes to customize your chat:

```html
<ai-chat
  api-url="https://your-api.com"           <!-- Required: Your API endpoint -->
  session-id="user-123"                    <!-- Session identifier -->
  title="AI Assistant"                     <!-- Chat title -->
  mode="fullscreen"                        <!-- or "widget" -->
  theme="light"                            <!-- or "dark" -->
  bot-avatar-url="https://..."             <!-- Custom bot avatar -->
  background-image-url="https://...">      <!-- Custom background -->
</ai-chat>
```

## 📝 Examples

### 1. Customer Support Widget

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>

<ai-chat
  mode="widget"
  api-url="https://api.yourcompany.com"
  session-id="support-chat"
  title="Customer Support"
  theme="dark"
  bot-avatar-url="https://yourcompany.com/support-bot.png">
</ai-chat>
```

### 2. Fullscreen AI Assistant

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Assistant</title>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>
  <style>body { margin: 0; height: 100vh; }</style>
</head>
<body>
  <ai-chat
    api-url="https://api.example.com"
    session-id="assistant"
    title="My AI Assistant"
    theme="light"
    background-image-url="https://example.com/pattern.svg">
  </ai-chat>
</body>
</html>
```

### 3. Multiple Chat Instances

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>

<!-- Sales chat -->
<ai-chat
  id="sales"
  mode="widget"
  api-url="https://api.example.com"
  session-id="sales-chat"
  title="Sales Inquiry"
  theme="light">
</ai-chat>

<!-- Support chat -->
<ai-chat
  id="support"
  mode="widget"
  api-url="https://api.example.com"
  session-id="support-chat"
  title="Support"
  theme="dark"
  style="right: 100px;">
</ai-chat>
```

## 🔌 Backend API Requirements

Your API endpoint should accept POST requests:

**Endpoint:** `POST /ask`

**Request:**
```json
{
  "session_id": "string",
  "question": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "faqs_used": [
    {
      "no.": "1",
      "question": "Related question 1"
    }
  ]
}
```

## 🎯 Version Pinning

### Production (Recommended)
Pin to specific version for stability:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>
```

### Development/Testing
Use latest version (updates automatically):
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@latest/dist/index.mjs"></script>
```

### Specific Minor Version
Get latest patch updates only:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2/dist/index.mjs"></script>
```

## ⚡ Performance Tips

### 1. Async Loading (Widget Mode)
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs" async></script>
```

### 2. Preload for Faster Loading
```html
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs">
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>
```

### 3. DNS Prefetch
```html
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

## 🔒 Security Notes

1. **API Keys**: Never expose API keys in frontend code
2. **CORS**: Configure your API to allow requests from your domain
3. **Rate Limiting**: Implement rate limiting on your backend
4. **Session Security**: Use secure session IDs
5. **Content Security Policy**: Add CDN to your CSP if using one

## 🆘 Troubleshooting

### Component Not Loading
- Check browser console for errors
- Verify CDN is accessible (check network tab)
- Ensure you're using a modern browser with ES modules support

### Styles Not Applying
- Component uses Shadow DOM, styles are encapsulated
- Use CSS custom properties or `::part()` pseudo-element

### CORS Errors
Add these headers to your API:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 📚 More Resources

- [Full Documentation](./README.md)
- [Interactive Demo](./demo.html)
- [Examples](./examples/)
- [GitHub Repository](https://github.com/aiddin/ai-chat)

---

**Built with [Lit](https://lit.dev/)** • **v0.2.4**
