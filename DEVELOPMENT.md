# Development Guide

## Quick Start - Local Development

### 1. Start Next.js Dev Server (Easiest!)

```bash
npm run dev
```

Then visit: **http://localhost:3001**

This gives you:
- ✅ Hot reload - changes update automatically
- ✅ TypeScript checking
- ✅ Full dev experience
- ✅ Web component working in Next.js

### 2. Make Changes

Edit the web component:
```bash
# Edit this file:
src/components/ai-chat.ts
```

The Next.js dev server will auto-reload when you save!

## Development Workflows

### Option A: Next.js Demo (Recommended)

**Best for rapid development with hot reload:**

```bash
npm run dev
```

- Visit http://localhost:3001
- Edit `src/components/ai-chat.ts`
- Save and see changes instantly
- Demo page: `app/page.tsx`

### Option B: Build + Test Demo HTML

**Best for testing the actual packaged component:**

```bash
# Build the component
npm run build

# Serve the demo
npx serve .

# Visit http://localhost:3000/demo.html
```

**With watch mode:**

Terminal 1:
```bash
npx tsup --watch
```

Terminal 2:
```bash
npx serve .
```

Then refresh `demo.html` after each build.

### Option C: Test in Another Project

```bash
# In this project
npm run build
npm pack

# In another project
npm install /path/to/a.izzuddin-ai-chat-0.1.0.tgz
```

## File Structure

```
src/components/ai-chat.ts    # Main web component (edit this!)
app/page.tsx                 # Next.js demo page
demo.html                    # Standalone demo
dist/                        # Built package (generated)
```

## Development Tips

### 1. Checking TypeScript

```bash
npx tsc --noEmit
```

### 2. Linting

```bash
npm run lint
```

### 3. Building

```bash
# Build once
npm run build

# Build on file change
npx tsup --watch
```

### 4. Testing Events

Open browser console and try:

```javascript
const chat = document.querySelector('ai-chat');

// Change properties
chat.theme = 'dark';
chat.apiUrl = 'https://new-api.com';

// Listen to events
chat.addEventListener('message-sent', (e) => console.log(e.detail));
```

## Common Tasks

### Add a New Feature

1. Edit `src/components/ai-chat.ts`
2. Add properties with `@property()` decorator
3. Update the `render()` method
4. Save and test at http://localhost:3001

### Change Styling

Edit the `static styles` in `src/components/ai-chat.ts`:

```typescript
static styles = css`
  :host {
    /* Your styles here */
  }
`;
```

### Add Event

```typescript
// In your method
this.dispatchEvent(new CustomEvent('your-event', {
  detail: { /* your data */ },
  bubbles: true,
  composed: true,
}));
```

### Test with API

Your API needs to be running on `http://localhost:8000` with `/ask` endpoint.

Or change in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Debugging

### Browser DevTools

1. Open DevTools (F12)
2. Check Console for events
3. Use Elements tab to inspect Shadow DOM
4. Network tab to see API calls

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug Next.js",
  "url": "http://localhost:3001",
  "webRoot": "${workspaceFolder}"
}
```

## Before Publishing

### 1. Build and Test

```bash
npm run build
npm pack
```

### 2. Check Package Contents

```bash
tar -tzf a.izzuddin-ai-chat-0.1.0.tgz
```

Should include:
- `dist/` folder
- `custom-elements.json`
- `package.json`
- `README.md`

### 3. Test in Clean Project

```bash
mkdir test-project
cd test-project
npm init -y
npm install /path/to/a.izzuddin-ai-chat-0.1.0.tgz
```

Create `test.html`:
```html
<!DOCTYPE html>
<html>
<body>
  <script type="module">
    import './node_modules/@a.izzuddin/ai-chat/dist/index.mjs';
  </script>
  <ai-chat api-url="http://localhost:8000"></ai-chat>
</body>
</html>
```

## Troubleshooting

### "Module not found" in Next.js

Restart the dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Changes not reflecting

1. Check if file saved
2. Check console for errors
3. Hard refresh browser (Ctrl+Shift+R)
4. Restart dev server

### TypeScript errors

```bash
# Check types
npx tsc --noEmit

# Fix decorator issues
# Already configured in tsconfig.json
```

### Build fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules/.cache
npm run build
```

## Performance Tips

1. **Shadow DOM** - Styles are encapsulated, no conflicts
2. **Lit** - Efficient updates, only re-renders changed parts
3. **Tree-shaking** - Unused code is removed
4. **Source maps** - Debug original TypeScript code

## Resources

- [Lit Documentation](https://lit.dev/)
- [Web Components Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)

---

**Happy coding!** 🚀

For questions, check:
- `README.md` - Package usage
- `WEB_COMPONENT_SUMMARY.md` - Architecture details
- `PUBLISHING.md` - How to publish
