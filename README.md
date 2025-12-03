# @a.izzuddin/ai-chat

A **framework-agnostic** AI chat web component built with Lit and TypeScript. Works seamlessly with React, Vue, Svelte, Angular, and vanilla JavaScript.

[![npm version](https://img.shields.io/npm/v/@a.izzuddin/ai-chat)](https://www.npmjs.com/package/@a.izzuddin/ai-chat)
[![npm downloads](https://img.shields.io/npm/dm/@a.izzuddin/ai-chat)](https://www.npmjs.com/package/@a.izzuddin/ai-chat)

## 📑 Table of Contents

- [Why Choose This Component?](#-why-choose-this-component)
- [What's New](#-whats-new-in-v024)
- [Features](#-features)
- [Installation](#-installation) - NPM or CDN
- [Quick Start](#-quick-start) - Get running in 60 seconds
  - [Loading Methods](#loading-methods)
  - [Framework Examples](#framework-specific-examples)
- [🔥 CDN Embed Guide](./EMBED.md) - Complete guide for no-build deployment
- [API Reference](#-api)
- [Backend Requirements](#-backend-api-requirements)
- [Display Modes](#-display-modes)
- [Theming & Customization](#-theming--customization)
- [FAQ Feature](#-faq-feature)
- [Advanced Usage](#-advanced-usage)
- [Examples](#-examples)
- [Browser Support](#-browser-support)
- [Migration Guide](#-migration-from-react-version)
- [Troubleshooting](#-troubleshooting)
- [Performance & Best Practices](#-performance--best-practices)
- [Getting Help](#-getting-help)

## 🚀 Quick Links

- 🎯 **[CDN Embed Guide](./EMBED.md)** - Add to any website in 30 seconds (no build required)
- 🎨 **[Embed Code Generator](./embed.html)** - Visual tool to generate custom embed code
- 📋 **[Copy-Paste Snippets](./EMBED_SNIPPET.txt)** - Ready-to-use code snippets
- 📚 **[Live Examples](./examples/)** - Working examples for all frameworks

## 🎯 Why Choose This Component?

- **True Framework Agnostic**: Not a React wrapper - works natively in any framework
- **Zero Dependencies** (runtime): Only Lit as a build dependency
- **Production Ready**: Used in real-world applications
- **Modern Standards**: Built with Web Components, Shadow DOM, and ES Modules
- **Developer Friendly**: Full TypeScript support, detailed docs, and examples
- **Small Bundle**: Just ~15KB gzipped with all features included

## 🆕 What's New in v0.2.4

- **Widget Mode**: Floating chat button for easy integration into existing websites
- **Custom Bot Avatars**: Replace default "AI" text with your own bot avatar image
- **Background Images**: Add custom background patterns to personalize your chat interface
- **Smart FAQs**: Display clickable FAQ suggestions from bot responses to guide users
- **Enhanced Theming**: Better dark mode support and customization options

## ✨ Features

- 🌐 **Framework Agnostic** - Works with any framework or no framework
- 🎨 **Beautiful UI** - Modern chat interface with light/dark mode
- 💬 **Widget & Fullscreen Modes** - Floating chat widget or fullscreen interface
- 🖼️ **Customizable Branding** - Custom bot avatars and background images
- 📋 **Smart FAQs** - Display clickable FAQ suggestions from your bot
- ⚡ **Lightweight** - Only ~15KB (gzipped)
- 🔧 **Fully Customizable** - Configure API endpoint, styling, and behavior
- 📱 **Responsive** - Mobile-friendly design
- 🎯 **TypeScript** - Full type safety and IntelliSense
- ♿ **Accessible** - Semantic HTML and ARIA attributes
- 🎪 **Event-Driven** - Listen to messages, responses, and errors

## 📦 Installation

### Option 1: NPM (For Build Tools)

```bash
npm install @a.izzuddin/ai-chat
# or
yarn add @a.izzuddin/ai-chat
# or
pnpm add @a.izzuddin/ai-chat
```

### Option 2: CDN Embed (No Build Required)

**Just copy and paste this into your HTML:**

```html
<!-- Add to your <head> tag -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>

<!-- Add to your <body> tag -->
<ai-chat
  api-url="YOUR_API_URL"
  session-id="user-123"
  title="AI Assistant">
</ai-chat>
```

**That's it!** No npm, no build step, no configuration needed.

#### 🎨 [Generate Custom Embed Code](./embed.html)

Use our interactive embed code generator to customize:
- API endpoint
- Display mode (fullscreen/widget)
- Theme (light/dark)
- Bot avatar
- Background image
- And more!

#### Available CDN Providers

| Provider | URL | Notes |
|----------|-----|-------|
| **jsDelivr** (recommended) | `https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs` | Fast, reliable, with global CDN |
| **unpkg** | `https://unpkg.com/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs` | Simple, automatic |
| **esm.sh** | `https://esm.sh/@a.izzuddin/ai-chat@0.2.4` | ES modules CDN |

**Tip:** Replace `@0.2.4` with `@latest` for automatic updates (not recommended for production).

## 🚀 Quick Start

**Just want to get started?** Copy this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chat</title>
  <style>body { margin: 0; height: 100vh; }</style>

  <!-- Import in head - recommended -->
  <script type="module">
    import '@a.izzuddin/ai-chat';
  </script>
</head>
<body>
  <!-- Use the component in body -->
  <ai-chat
    api-url="https://your-api.com"
    session-id="user-123"
    title="AI Assistant">
  </ai-chat>
</body>
</html>
```

**Alternative:** Using CDN (no build step required)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chat</title>
  <style>body { margin: 0; height: 100vh; }</style>

  <!-- Load from CDN -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@latest/dist/index.mjs"></script>
</head>
<body>
  <ai-chat
    api-url="https://your-api.com"
    session-id="user-123"
    title="AI Assistant">
  </ai-chat>
</body>
</html>
```

### Loading Methods

#### 1. Load in `<head>` (Recommended)

Loading the component in the `<head>` ensures it's registered before the DOM is parsed:

```html
<head>
  <script type="module">
    import '@a.izzuddin/ai-chat';
  </script>
</head>
<body>
  <ai-chat api-url="..."></ai-chat>
</body>
```

**Benefits:**
- Component is ready when the page loads
- No flash of unstyled content
- Works with server-side rendering

#### 2. Load in `<body>` (Also works)

```html
<body>
  <script type="module">
    import '@a.izzuddin/ai-chat';
  </script>

  <ai-chat api-url="..."></ai-chat>
</body>
```

**Note:** Place the import before using the element.

#### 3. CDN (No Build Step)

Perfect for quick prototypes or static HTML sites:

```html
<head>
  <!-- Specific version (recommended for production) -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@0.2.4/dist/index.mjs"></script>

  <!-- Or latest version -->
  <script type="module" src="https://unpkg.com/@a.izzuddin/ai-chat@latest/dist/index.mjs"></script>
</head>
```

**CDN Options:**
- [jsDelivr](https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@latest/dist/index.mjs) - Fast, reliable
- [unpkg](https://unpkg.com/@a.izzuddin/ai-chat@latest/dist/index.mjs) - Simple, automatic
- [esm.sh](https://esm.sh/@a.izzuddin/ai-chat) - ES modules CDN

#### 4. Defer/Async Loading

For better page load performance:

```html
<head>
  <!-- Load asynchronously, execute when ready -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/@a.izzuddin/ai-chat@latest/dist/index.mjs" async></script>
</head>
```

**Tip:** Use `async` for widget mode, since it's not critical for initial page render.

### Framework-Specific Examples

#### Widget Mode (Floating Chat Button)

```html
<!DOCTYPE html>
<html>
<body>
  <script type="module">
    import '@a.izzuddin/ai-chat';
  </script>

  <!-- Your page content here -->
  <h1>My Website</h1>
  <p>This is my content...</p>

  <!-- Chat widget appears as floating button -->
  <ai-chat
    mode="widget"
    api-url="https://your-api.com"
    session-id="user-123"
    title="Support Chat"
    theme="dark">
  </ai-chat>
</body>
</html>
```

#### With Custom Branding

```html
<ai-chat
  api-url="https://your-api.com"
  session-id="user-123"
  title="Customer Support"
  theme="light"
  bot-avatar-url="https://example.com/bot-avatar.png"
  background-image-url="https://example.com/bg-pattern.svg">
</ai-chat>
```

#### React

```tsx
import '@a.izzuddin/ai-chat';

function App() {
  return (
    <ai-chat
      api-url={process.env.REACT_APP_API_URL}
      session-id="user-123"
      title="AI Assistant"
      theme="dark"
      mode="widget"
      bot-avatar-url="/bot-avatar.png"
    />
  );
}
```

**TypeScript users**: Add type definitions:

```tsx
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-chat': any;
    }
  }
}
```

#### Vue 3

```vue
<template>
  <ai-chat
    :api-url="apiUrl"
    session-id="user-123"
    title="AI Assistant"
    :theme="theme"
    mode="widget"
  />
</template>

<script setup>
import '@a.izzuddin/ai-chat';
import { ref } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL;
const theme = ref('light');
</script>
```

#### Svelte

```svelte
<script>
  import '@a.izzuddin/ai-chat';

  export let apiUrl = 'https://your-api.com';
  let theme = 'light';
</script>

<ai-chat
  api-url={apiUrl}
  session-id="user-123"
  title="AI Assistant"
  {theme}
  mode="fullscreen"
/>
```

#### Angular

```typescript
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@a.izzuddin/ai-chat';

@Component({
  selector: 'app-root',
  template: `
    <ai-chat
      api-url="https://your-api.com"
      session-id="user-123"
      title="AI Assistant"
      mode="widget"
      theme="dark">
    </ai-chat>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {}
```

## 📖 API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | `string` | **required** | Your API endpoint URL |
| `session-id` | `string` | `"default-session"` | Session identifier for conversation context |
| `title` | `string` | `"My AI Agent"` | Chat header title |
| `theme` | `"light" \| "dark"` | `"light"` | UI theme (light or dark mode) |
| `mode` | `"fullscreen" \| "widget"` | `"fullscreen"` | Display mode: fullscreen or floating widget |
| `bot-avatar-url` | `string` | `""` | URL for custom bot avatar image |
| `background-image-url` | `string` | `""` | URL for custom background pattern/image |
| `initial-messages` | `Message[]` | `[]` | Pre-populate chat with messages |

### Properties (JavaScript)

```javascript
const chat = document.querySelector('ai-chat');

// Set properties programmatically
chat.apiUrl = 'https://api.example.com';
chat.sessionId = 'user-123';
chat.chatTitle = 'Support Bot';
chat.theme = 'dark';
chat.mode = 'widget';
chat.botAvatarUrl = 'https://example.com/avatar.png';
chat.backgroundImageUrl = 'https://example.com/pattern.svg';
chat.initialMessages = [
  { id: '1', role: 'assistant', content: 'Hello! How can I help?' }
];
```

### Events

```javascript
const chat = document.querySelector('ai-chat');

// User sends a message
chat.addEventListener('message-sent', (event) => {
  console.log('User message:', event.detail);
  // event.detail: { id: string, role: 'user', content: string }
});

// AI responds
chat.addEventListener('response-received', (event) => {
  console.log('AI response:', event.detail);
  // event.detail: { id: string, role: 'assistant', content: string }
});

// Error occurs
chat.addEventListener('error', (event) => {
  console.error('Chat error:', event.detail);
  // event.detail: Error object
});
```

### TypeScript Types

```typescript
import type { Message, FAQ } from '@a.izzuddin/ai-chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  faqs?: FAQ[];  // Optional FAQs from your bot
}

interface FAQ {
  "no.": string;
  question: string;
}
```

## 🔌 Backend API Requirements

Your API must implement this endpoint:

**POST `/ask`**

Request:
```json
{
  "session_id": "string",
  "question": "string"
}
```

Response (Basic):
```json
{
  "response": "string"
}
```

Response (With FAQs):
```json
{
  "response": "Your answer here",
  "faqs_used": [
    {
      "no.": "1",
      "question": "How do I reset my password?"
    },
    {
      "no.": "2",
      "question": "What are your business hours?"
    }
  ]
}
```

**Note:** The `faqs_used` field is optional. When provided, clickable FAQ suggestions will appear below the bot's response.

## 💬 Display Modes

### Fullscreen Mode (Default)

Perfect for dedicated chat pages or full-screen chat applications.

```html
<ai-chat
  mode="fullscreen"
  api-url="https://your-api.com"
  title="AI Assistant">
</ai-chat>
```

**CSS Tip:** Ensure the component fills the viewport:
```css
body {
  margin: 0;
  height: 100vh;
}
```

### Widget Mode

Floating chat button that appears in the bottom-right corner. Great for adding chat to existing websites.

```html
<ai-chat
  mode="widget"
  api-url="https://your-api.com"
  title="Support Chat"
  theme="dark">
</ai-chat>
```

Features:
- Floating button with smooth animations
- Click to open/close chat window
- Responsive design (adapts to mobile screens)
- Appears above page content with high z-index (9999)
- Chat window: 380x600px (desktop), full-screen on mobile

## 🎨 Theming & Customization

### Built-in Themes

```html
<!-- Light mode (default) -->
<ai-chat theme="light"></ai-chat>

<!-- Dark mode -->
<ai-chat theme="dark"></ai-chat>
```

### Custom Bot Avatar

Replace the default "AI" text with your own bot avatar image:

```html
<ai-chat
  bot-avatar-url="https://example.com/bot-avatar.png"
  api-url="https://your-api.com">
</ai-chat>
```

**Best practices:**
- Use square images (1:1 aspect ratio)
- Recommended size: 40x40px to 128x128px
- Formats: PNG, JPG, SVG, WebP
- Transparent backgrounds work great

### Background Image

Add a subtle background pattern or image to the chat area:

```html
<ai-chat
  background-image-url="https://example.com/pattern.svg"
  api-url="https://your-api.com">
</ai-chat>
```

**Background styling:**
- Image appears centered in the chat area
- Automatically sized and positioned
- 50% opacity for subtlety
- Works with both light and dark themes

### CSS Custom Properties

Customize colors by overriding CSS variables:

```css
ai-chat {
  --ai-chat-primary: #2563eb;
  --ai-chat-background: #ffffff;
  --ai-chat-text: #09090b;
  /* ... more variables */
}
```

### Shadow DOM

The component uses Shadow DOM for style encapsulation. To style internal elements, use `::part()`:

```css
ai-chat::part(header) {
  background: linear-gradient(to right, #667eea, #764ba2);
}
```

## 📋 FAQ Feature

The component supports displaying clickable FAQ suggestions from your bot's responses. When a user clicks an FAQ, it automatically sends that question.

### How It Works

1. Your backend includes FAQs in the response:
```json
{
  "response": "I can help with that!",
  "faqs_used": [
    { "no.": "1", "question": "How do I reset my password?" },
    { "no.": "2", "question": "Where can I find my order history?" }
  ]
}
```

2. FAQs appear as clickable items below the bot's message
3. Clicking an FAQ sends it as a new question
4. Great for guiding users through common topics

### Example Use Cases

- **Customer Support**: Suggest related help articles
- **Onboarding**: Guide new users through setup steps
- **Product Discovery**: Show related product questions
- **Troubleshooting**: Offer next troubleshooting steps

## 🚀 Advanced Usage

### Pre-populate with Initial Messages

```javascript
const chat = document.querySelector('ai-chat');
chat.initialMessages = [
  {
    id: '1',
    role: 'assistant',
    content: 'Welcome! How can I assist you today?',
    faqs: [
      { "no.": "1", question: "Tell me about your services" },
      { "no.": "2", question: "How do I get started?" }
    ]
  }
];
```

### Listen to Events

```javascript
const chat = document.querySelector('ai-chat');

// Track user messages
chat.addEventListener('message-sent', (e) => {
  console.log('User asked:', e.detail.content);
  // Send to analytics, log, etc.
});

// Track bot responses
chat.addEventListener('response-received', (e) => {
  console.log('Bot replied:', e.detail.content);
});

// Handle errors
chat.addEventListener('error', (e) => {
  console.error('Chat error:', e.detail);
  // Show custom error UI, retry logic, etc.
});
```

### Dynamic Configuration

```javascript
const chat = document.querySelector('ai-chat');

// Switch themes dynamically
document.querySelector('#theme-toggle').addEventListener('click', () => {
  chat.theme = chat.theme === 'light' ? 'dark' : 'light';
});

// Change API endpoint based on environment
if (window.location.hostname === 'localhost') {
  chat.apiUrl = 'http://localhost:8000';
} else {
  chat.apiUrl = 'https://api.production.com';
}

// Update session ID per user
chat.sessionId = `user-${currentUser.id}`;
```

### React with TypeScript (Complete Example)

```tsx
import { useEffect, useRef } from 'react';
import '@a.izzuddin/ai-chat';

// Type declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-chat': any;
    }
  }
}

function ChatPage() {
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;

    // Set initial configuration
    chat.initialMessages = [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help?'
      }
    ];

    // Event listeners
    const handleMessage = (e: CustomEvent) => {
      console.log('Message sent:', e.detail);
    };

    const handleResponse = (e: CustomEvent) => {
      console.log('Response received:', e.detail);
    };

    chat.addEventListener('message-sent', handleMessage);
    chat.addEventListener('response-received', handleResponse);

    return () => {
      chat.removeEventListener('message-sent', handleMessage);
      chat.removeEventListener('response-received', handleResponse);
    };
  }, []);

  return (
    <ai-chat
      ref={chatRef}
      api-url={process.env.REACT_APP_API_URL}
      session-id={`user-${Date.now()}`}
      title="AI Support"
      theme="dark"
      mode="fullscreen"
    />
  );
}
```

### Multiple Chat Instances

```html
<!-- Support chat widget -->
<ai-chat
  id="support-chat"
  mode="widget"
  api-url="https://api.example.com"
  session-id="support-session"
  title="Customer Support"
  theme="light">
</ai-chat>

<!-- Sales chat widget -->
<ai-chat
  id="sales-chat"
  mode="widget"
  api-url="https://api.example.com"
  session-id="sales-session"
  title="Sales Inquiry"
  theme="dark"
  style="right: 100px;">
</ai-chat>
```

**Note**: Position multiple widgets using CSS:
```css
#sales-chat {
  right: 100px !important;
}
```

## 📚 Examples

Check out the [examples](./examples) directory for complete working examples:

### Basic Examples
- [CDN Example](./examples/cdn-example.html) - Load from CDN in `<head>`, fullscreen mode
- [Widget CDN](./examples/widget-cdn.html) - Complete website with floating chat widget
- [Vanilla JavaScript](./examples/vanilla.html) - Basic HTML/JS implementation
- [Static Demo](./demo.html) - Interactive demo with all features

### Framework Examples
- [React](./examples/react.tsx) - React integration with TypeScript
- [Vue](./examples/vue.vue) - Vue 3 with Composition API
- [Svelte](./examples/svelte.svelte) - Svelte component example
- [Angular](./examples/angular.component.ts) - Angular component with schemas

### Live Examples

Try it yourself:

```bash
# Clone the repo
git clone https://github.com/aiddin/ai-chat.git
cd ai-chat

# Install dependencies
npm install

# Run the demo
npm run dev

# Open http://localhost:3000
```

## 🌍 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

Requires native Web Components support (Custom Elements v1, Shadow DOM v1).

## 🔄 Migration from React Version

If you were using the React-only version:

**Before:**
```tsx
import { AIChat } from '@a.izzuddin/ai-chat';
<AIChat apiUrl="..." />
```

**After:**
```tsx
import '@a.izzuddin/ai-chat';
<ai-chat api-url="..." />
```

Key differences:
- Component name is lowercase: `<ai-chat>` instead of `<AIChat>`
- Attributes use kebab-case: `api-url` instead of `apiUrl`
- Events instead of callback props

## 🔧 Troubleshooting

### Component Not Rendering

**Issue**: The chat component doesn't appear on the page.

**Solutions**:
- Ensure you've imported the component: `import '@a.izzuddin/ai-chat';`
- Check that `api-url` attribute is set
- For fullscreen mode, ensure the body has proper height: `body { height: 100vh; margin: 0; }`
- Open browser console to check for errors

### TypeScript Errors in React/Vue

**Issue**: TypeScript doesn't recognize `<ai-chat>` element.

**Solution**: Add type declarations:
```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-chat': any;
    }
  }
}
```

### CORS Errors

**Issue**: "CORS policy" errors when connecting to API.

**Solution**: Your backend must include proper CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Widget Not Appearing

**Issue**: Widget mode button doesn't show.

**Solutions**:
- Verify `mode="widget"` attribute is set
- Check z-index conflicts with other elements
- Ensure the component is not hidden by CSS

### Events Not Firing

**Issue**: Event listeners not triggering.

**Solution**: Use `addEventListener` on the DOM element:
```javascript
// ✅ Correct
const chat = document.querySelector('ai-chat');
chat.addEventListener('message-sent', handler);

// ❌ Wrong (React)
<ai-chat onMessageSent={handler} />  // Won't work
```

## ⚡ Performance & Best Practices

### Bundle Size Optimization

The component is already lightweight (~15KB gzipped), but you can optimize further:

```javascript
// Tree-shakeable import (if your bundler supports it)
import '@a.izzuddin/ai-chat';

// For production, ensure your bundler minifies the code
```

### Session Management

Use meaningful session IDs to maintain conversation context:

```javascript
// ✅ Good: User-specific sessions
chat.sessionId = `user-${userId}`;

// ✅ Good: Page-specific sessions
chat.sessionId = `page-${window.location.pathname}`;

// ❌ Avoid: Same session for all users
chat.sessionId = 'default-session';
```

### API Response Time

Keep your API responses fast for better UX:
- Aim for < 2 seconds response time
- Consider streaming responses for longer answers
- Cache common responses on the backend

### Accessibility Tips

- Provide meaningful `title` attribute for screen readers
- Ensure sufficient color contrast (component handles this by default)
- Test keyboard navigation (Tab, Enter, Escape)
- Widget mode includes proper ARIA labels

### Security Considerations

- **Never** expose API keys in frontend code
- Use session tokens for authentication
- Implement rate limiting on your backend
- Sanitize user input on the backend
- Validate and sanitize bot responses if they contain user-generated content

## 🆘 Getting Help

- **Documentation**: You're reading it!
- **Issues**: [GitHub Issues](https://github.com/aiddin/ai-chat/issues)
- **Examples**: Check the [examples](./examples) directory
- **Questions**: Open a discussion on GitHub

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## 📄 License

MIT © a.izzuddin

## 🔗 Links

- [Documentation](https://github.com/aiddin/ai-chat#readme)
- [Examples](./examples)
- [Issue Tracker](https://github.com/aiddin/ai-chat/issues)
- [npm Package](https://www.npmjs.com/package/@a.izzuddin/ai-chat)

## ⭐ Similar Projects

- [@n8n/chat](https://www.npmjs.com/package/@n8n/chat) - n8n's chat widget
- [Lit](https://lit.dev/) - The library powering this component

---

**Built with [Lit](https://lit.dev/)** • **Powered by Web Components**
