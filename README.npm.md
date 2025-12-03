# @a.izzuddin/ai-chat

A beautiful, configurable AI chat component for React applications. Built with Radix UI, Tailwind CSS, and TypeScript.

## Features

- 🎨 **Beautiful UI** - Modern chat interface with dark mode support
- ⚡ **Lightweight** - Minimal dependencies, optimized bundle size
- 🔧 **Configurable** - Customize API endpoint, session management, styling
- 📱 **Responsive** - Works great on mobile and desktop
- 🎯 **TypeScript** - Full type safety out of the box
- ♿ **Accessible** - Built on Radix UI primitives

## Installation

```bash
npm install @a.izzuddin/ai-chat
# or
yarn add @a.izzuddin/ai-chat
# or
pnpm add @a.izzuddin/ai-chat
```

### Peer Dependencies

This package requires React 18+ or React 19+:

```bash
npm install react react-dom
```

## Quick Start

```tsx
import { AIChat } from "@a.izzuddin/ai-chat";
import "@a.izzuddin/ai-chat/styles";

function App() {
  return (
    <AIChat
      apiUrl="https://your-api-endpoint.com"
      sessionId="user-123"
      title="My AI Assistant"
    />
  );
}
```

## Tailwind CSS Setup

This component uses Tailwind CSS. Add the component path to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add this line:
    "./node_modules/@a.izzuddin/ai-chat/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};
```

Or if using Tailwind v4, add to your CSS:

```css
@import "tailwindcss";
@import "@a.izzuddin/ai-chat/styles";
```

## API Requirements

Your API endpoint should accept POST requests to `/ask` with this format:

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
  "response": "string"
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | *required* | Your API endpoint URL |
| `sessionId` | `string` | `"default-session"` | Session identifier for conversation context |
| `title` | `string` | `"My AI Agent"` | Chat header title |
| `initialMessages` | `Message[]` | `[]` | Pre-populate chat with messages |
| `className` | `string` | `undefined` | Custom CSS class for container |
| `onMessageSent` | `(message: Message) => void` | `undefined` | Callback when user sends a message |
| `onResponseReceived` | `(message: Message) => void` | `undefined` | Callback when AI responds |
| `onError` | `(error: Error) => void` | `undefined` | Callback when an error occurs |

## Advanced Usage

### With Custom Styling

```tsx
<AIChat
  apiUrl="https://api.example.com"
  className="max-w-4xl mx-auto shadow-lg"
  title="Customer Support Bot"
/>
```

### With Event Handlers

```tsx
<AIChat
  apiUrl="https://api.example.com"
  onMessageSent={(message) => {
    // Track analytics
    analytics.track("message_sent", { content: message.content });
  }}
  onResponseReceived={(message) => {
    // Log responses
    console.log("AI responded:", message.content);
  }}
  onError={(error) => {
    // Handle errors
    toast.error(error.message);
  }}
/>
```

### With Initial Messages

```tsx
const welcomeMessages = [
  {
    id: "1",
    role: "assistant" as const,
    content: "Hello! How can I help you today?",
  },
];

<AIChat
  apiUrl="https://api.example.com"
  initialMessages={welcomeMessages}
/>
```

### With Dynamic Session Management

```tsx
import { useUser } from "@/hooks/useUser";

function ChatPage() {
  const user = useUser();

  return (
    <AIChat
      apiUrl={process.env.NEXT_PUBLIC_API_URL!}
      sessionId={user.id}
      title={`Chat with ${user.name}'s Assistant`}
    />
  );
}
```

## TypeScript

Full TypeScript support is included. Import types as needed:

```tsx
import type { Message, AIChatProps } from "@a.izzuddin/ai-chat";

const customMessage: Message = {
  id: "123",
  role: "user",
  content: "Hello!",
};
```

## Styling

The component uses Tailwind CSS with custom theme variables. You can customize the appearance by:

1. **Using Tailwind's dark mode**: The component automatically supports dark mode
2. **Custom CSS variables**: Override theme colors in your global CSS
3. **className prop**: Add custom Tailwind classes to the container

### Custom Theme Colors

```css
@layer base {
  :root {
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    /* ... other variables */
  }

  .dark {
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    /* ... other variables */
  }
}
```

## Framework Support

### Next.js (App Router)

```tsx
"use client";

import { AIChat } from "@a.izzuddin/ai-chat";
import "@a.izzuddin/ai-chat/styles";

export default function ChatPage() {
  return <AIChat apiUrl={process.env.NEXT_PUBLIC_API_URL!} />;
}
```

### Next.js (Pages Router)

```tsx
import { AIChat } from "@a.izzuddin/ai-chat";
import "@a.izzuddin/ai-chat/styles";

export default function ChatPage() {
  return <AIChat apiUrl={process.env.NEXT_PUBLIC_API_URL!} />;
}
```

### Vite + React

```tsx
import { AIChat } from "@a.izzuddin/ai-chat";
import "@a.izzuddin/ai-chat/styles";

function App() {
  return <AIChat apiUrl={import.meta.env.VITE_API_URL} />;
}
```

### Create React App

```tsx
import { AIChat } from "@a.izzuddin/ai-chat";
import "@a.izzuddin/ai-chat/styles";

function App() {
  return <AIChat apiUrl={process.env.REACT_APP_API_URL} />;
}
```

## Examples

Check out the [examples directory](./examples) for complete working examples with:
- Next.js App Router
- Vite + React
- Custom styling
- Advanced features

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

MIT © [Your Name]

## Related

- [Radix UI](https://radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI

## Support

- 📖 [Documentation](https://github.com/aiddin/ai-chat#readme)
- 🐛 [Issue Tracker](https://github.com/aiddin/ai-chat/issues)
- 💬 [Discussions](https://github.com/aiddin/ai-chat/discussions)
