# @a.izzuddin/ai-chat

A **framework-agnostic** AI chat web component built with Lit and TypeScript. Works seamlessly with React, Vue, Svelte, Angular, and vanilla JavaScript.

[![npm version](https://img.shields.io/npm/v/@a.izzuddin/ai-chat)](https://www.npmjs.com/package/@a.izzuddin/ai-chat)
[![npm downloads](https://img.shields.io/npm/dm/@a.izzuddin/ai-chat)](https://www.npmjs.com/package/@a.izzuddin/ai-chat)

## ✨ Features

- 🌐 **Framework Agnostic** - Works with any framework or no framework
- 🎨 **Beautiful UI** - Modern chat interface with light/dark mode
- ⚡ **Lightweight** - Only ~15KB (gzipped)
- 🔧 **Fully Customizable** - Configure API endpoint, styling, and behavior
- 📱 **Responsive** - Mobile-friendly design
- 🎯 **TypeScript** - Full type safety and IntelliSense
- ♿ **Accessible** - Semantic HTML and ARIA attributes
- 🎪 **Event-Driven** - Listen to messages, responses, and errors

## 📦 Installation

```bash
npm install @a.izzuddin/ai-chat
# or
yarn add @a.izzuddin/ai-chat
# or
pnpm add @a.izzuddin/ai-chat
```

## 🚀 Quick Start

### Vanilla JavaScript / HTML

```html
<!DOCTYPE html>
<html>
<body>
  <script type="module">
    import '@a.izzuddin/ai-chat';
  </script>

  <ai-chat
    api-url="https://your-api.com"
    session-id="user-123"
    title="My AI Assistant">
  </ai-chat>
</body>
</html>
```

### React

```tsx
import '@a.izzuddin/ai-chat';

function App() {
  return (
    <ai-chat
      api-url={process.env.REACT_APP_API_URL}
      session-id="user-123"
      title="AI Assistant"
    />
  );
}
```

### Vue

```vue
<template>
  <ai-chat
    :api-url="apiUrl"
    session-id="user-123"
    title="AI Assistant"
  />
</template>

<script setup>
import '@a.izzuddin/ai-chat';
const apiUrl = import.meta.env.VITE_API_URL;
</script>
```

### Svelte

```svelte
<script>
  import '@a.izzuddin/ai-chat';
  export let apiUrl;
</script>

<ai-chat
  api-url={apiUrl}
  session-id="user-123"
  title="AI Assistant"
/>
```

### Angular

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@a.izzuddin/ai-chat';

@Component({
  selector: 'app-root',
  template: '<ai-chat api-url="..." session-id="user-123"></ai-chat>',
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
| `theme` | `"light" \| "dark"` | `"light"` | UI theme |
| `initial-messages` | `Message[]` | `[]` | Pre-populate chat with messages |

### Properties (JavaScript)

```javascript
const chat = document.querySelector('ai-chat');

// Set properties
chat.apiUrl = 'https://api.example.com';
chat.sessionId = 'user-123';
chat.title = 'Support Bot';
chat.theme = 'dark';
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
import type { Message } from '@a.izzuddin/ai-chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
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

Response:
```json
{
  "response": "string"
}
```

## 🎨 Theming

### Built-in Themes

```html
<!-- Light mode (default) -->
<ai-chat theme="light"></ai-chat>

<!-- Dark mode -->
<ai-chat theme="dark"></ai-chat>
```

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

## 📚 Examples

Check out the [examples](./examples) directory for complete working examples:

- [Vanilla JavaScript](./examples/vanilla.html)
- [React](./examples/react.tsx)
- [Vue](./examples/vue.vue)
- [Svelte](./examples/svelte.svelte)
- [Angular](./examples/angular.component.ts)

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

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## 📄 License

MIT © a.izzuddin

## 🔗 Links

- [Documentation](https://github.com/a.izzuddin/ai-chat#readme)
- [Examples](./examples)
- [Issue Tracker](https://github.com/a.izzuddin/ai-chat/issues)
- [npm Package](https://www.npmjs.com/package/@a.izzuddin/ai-chat)

## ⭐ Similar Projects

- [@n8n/chat](https://www.npmjs.com/package/@n8n/chat) - n8n's chat widget
- [Lit](https://lit.dev/) - The library powering this component

---

**Built with [Lit](https://lit.dev/)** • **Powered by Web Components**
