# AI Chat Widget

A modern, customizable chat widget built with Lit web components. Features a clean UI, responsive design, and extensive theming options.

## Features

- 🎨 **Fully Customizable Theme** - Change colors, backgrounds, and styles
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌓 **Dark Mode Support** - Built-in light and dark themes
- 📦 **Two Display Modes** - Fullscreen or floating widget
- 🔧 **Easy Integration** - Simple HTML attributes for configuration
- ⚡ **Built with Lit** - Fast, lightweight web component
- 🎯 **TypeScript Support** - Full type safety
- 📝 **List Formatting** - Automatic rendering of bulleted and numbered lists
- 💡 **Suggested Questions** - Clickable follow-up questions for better UX
- 🔗 **Related FAQs** - Display related FAQ references

## Quick Start

### Installation

```bash
npm install @a.izzuddin/ai-chat
```

### Basic Usage

**HTML:**
```html
<script type="module">
  import '@a.izzuddin/ai-chat';
</script>

<ai-chat
  api-url="https://your-api-endpoint.com"
  session-id="user-123"
  title="AI Assistant">
</ai-chat>
```

**React:**
```jsx
import '@a.izzuddin/ai-chat';

function App() {
  return (
    <ai-chat
      api-url="https://your-api-endpoint.com"
      session-id="user-123"
      title="AI Assistant"
    />
  );
}
```

**Vue:**
```vue
<template>
  <ai-chat
    api-url="https://your-api-endpoint.com"
    session-id="user-123"
    title="AI Assistant">
  </ai-chat>
</template>

<script setup>
import '@a.izzuddin/ai-chat';
</script>
```

## Configuration

### Display Modes

#### Fullscreen Mode (Default)
```html
<ai-chat
  api-url="https://api.example.com"
  session-id="user-123"
  title="AI Assistant"
  mode="fullscreen">
</ai-chat>
```

#### Widget Mode
```html
<ai-chat
  api-url="https://api.example.com"
  session-id="user-123"
  title="AI Assistant"
  mode="widget"
  widget-width="400px"
  widget-height="650px">
</ai-chat>
```

### Theme Customization

#### Custom Colors
```html
<ai-chat
  api-url="https://api.example.com"
  session-id="user-123"
  title="AI Assistant"
  primary-color="#10B981"
  primary-color-hover="#059669"
  user-message-bg="#D1FAE5"
  bot-message-bg="#F3F4F6">
</ai-chat>
```

#### Custom Avatars and Background
```html
<ai-chat
  api-url="https://api.example.com"
  session-id="user-123"
  title="AI Assistant"
  bot-avatar-url="/path/to/avatar.png"
  background-image-url="/path/to/background.png">
</ai-chat>
```

### Dark Mode
```html
<ai-chat
  api-url="https://api.example.com"
  session-id="user-123"
  title="AI Assistant"
  theme="dark">
</ai-chat>
```

## Available Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | '' | API endpoint URL for chat backend |
| `session-id` | string | 'default-session' | Unique session identifier |
| `title` | string | 'My AI Agent' | Chat widget title |
| `theme` | 'light' or 'dark' | 'light' | Color theme |
| `mode` | 'fullscreen' or 'widget' | 'fullscreen' | Display mode |
| `widget-width` | string | '380px' | Widget width (widget mode only) |
| `widget-height` | string | '600px' | Widget height (widget mode only) |
| `primary-color` | string | '#4169E1' | Primary brand color |
| `primary-color-hover` | string | '#3457C7' | Hover state color |
| `user-message-bg` | string | '#D6E4FF' | User message background |
| `bot-message-bg` | string | '#F5F5F5' | Bot message background |
| `bot-avatar-url` | string | '' | Custom bot avatar image |
| `background-image-url` | string | '' | Chat background image |

## API Integration

The chat widget sends POST requests to the configured api-url with the following payload:

```json
{
  "session_id": "string",
  "question": "string"
}
```

Expected response format:

```json
{
  "response": "string",
  "faq_used": [
    {
      "no.": "1",
      "question": "What is MySTI?"
    }
  ],
  "suggested_follow_ups": [
    "What are the main objectives of the program?",
    "How can companies apply?",
    "Who is eligible for the MySTI logo?"
  ]
}
```

**Supported field variations:**
- `faq_used` or `faqs_used` for related FAQs
- `suggested_follow_ups` or `suggested_questions` for clickable follow-up questions

### Response Behavior

- **Related FAQs** - Displayed as non-clickable text references
- **Suggested Questions** - Displayed as clickable buttons that send the question when clicked
- **List Formatting** - Messages support automatic list rendering:
  - Unordered lists: Lines starting with `-`, `*`, or `•`
  - Ordered lists: Lines starting with `1.`, `2.`, etc.

### List Formatting Example

Your API can return text with lists:

```
MySTI is a government initiative. Key objectives include:

1. Stimulating local industry growth
2. Driving technology-based economic growth
3. Creating job opportunities

Key features:
- Platform for applicants
- Database of approved goods
- Reference for procurement
```

This will be automatically rendered as proper HTML lists.

## Events

The component fires custom events you can listen to:

```javascript
const chat = document.querySelector('ai-chat');

// User sends a message
chat.addEventListener('message-sent', (event) => {
  console.log('Message sent:', event.detail);
});

// AI responds
chat.addEventListener('response-received', (event) => {
  console.log('Response received:', event.detail);
});

// Error occurs
chat.addEventListener('error', (event) => {
  console.error('Error:', event.detail);
});
```

## Theme Examples

### Green Theme (Success)
```html
<ai-chat
  primary-color="#10B981"
  primary-color-hover="#059669"
  user-message-bg="#D1FAE5"
  bot-message-bg="#F3F4F6">
</ai-chat>
```

### Purple Theme (Creative)
```html
<ai-chat
  primary-color="#8B5CF6"
  primary-color-hover="#7C3AED"
  user-message-bg="#EDE9FE"
  bot-message-bg="#F5F3FF">
</ai-chat>
```

### Red Theme (Alert)
```html
<ai-chat
  primary-color="#EF4444"
  primary-color-hover="#DC2626"
  user-message-bg="#FEE2E2"
  bot-message-bg="#FEF2F2">
</ai-chat>
```

### Orange Theme (Warm)
```html
<ai-chat
  primary-color="#F97316"
  primary-color-hover="#EA580C"
  user-message-bg="#FFEDD5"
  bot-message-bg="#FFF7ED">
</ai-chat>
```

## Responsive Behavior

The widget automatically adapts to different screen sizes:

- **Desktop (>1024px)**: Full widget size
- **Tablet (769-1024px)**: Slightly larger widget (400px × 650px)
- **Small Tablet (481-768px)**: Compact widget (360px × 550px)
- **Mobile Portrait (≤480px)**: Nearly fullscreen (90vw × 70vh)
- **Mobile Landscape**: Wider widget (500px × adjusted height)

## Development

### Build for Production
```bash
npm run build
```

### Run Development Server
```bash
npm run dev
```

### Lint Code
```bash
npm run lint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern mobile browsers

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
