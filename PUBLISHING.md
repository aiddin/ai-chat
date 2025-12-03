# Publishing Guide

This document explains how to publish your AI Chat component as an npm package.

## Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup
2. **npm CLI**: Should already be installed with Node.js
3. **Login**: Run `npm login` and enter your credentials

## Before Publishing

### 1. Update Package Information

Edit `package.json`:

```json
{
  "name": "@a.izzuddin/ai-chat",
  "version": "0.2.4",
  "description": "A framework-agnostic AI chat web component. Works with React, Vue, Svelte, Angular, and vanilla JavaScript.",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/aiddin/ai-chat.git"
  },
  "author": "a.izzuddin",
  "license": "MIT"
}
```

### 2. Add a License

Create a `LICENSE` file. For MIT license:

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

### 3. Update README

Rename `README.npm.md` to `README.md`:

```bash
mv README.npm.md README.md
```

Update all instances of `@a.izzuddin/ai-chat` with your actual package name.

### 4. Test the Build

```bash
npm run build
```

Verify the `dist/` folder contains:
- `index.js` (CommonJS)
- `index.mjs` (ES Module)
- `index.d.ts` (TypeScript types)
- Source maps

### 5. Test Locally (Optional but Recommended)

Test your package in another project before publishing:

```bash
# In your package directory
npm pack

# This creates a .tgz file. In another project:
npm install /path/to/your-package/a.izzuddin-ai-chat-0.1.0.tgz
```

## Publishing

### First Time Publishing

For scoped packages (e.g., `@a.izzuddin/ai-chat`), you need to publish as public:

```bash
npm publish --access public
```

### Subsequent Publishes

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   # or
   npm version minor  # 0.1.0 -> 0.2.0
   # or
   npm version major  # 0.1.0 -> 1.0.0
   ```

2. **Build and publish**:
   ```bash
   npm run build
   npm publish
   ```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

Add your npm token as a GitHub secret:
1. Generate token at https://www.npmjs.com/settings/a.izzuddin/tokens
2. Add as `NPM_TOKEN` in your repo's Settings > Secrets

## Post-Publishing

### 1. Verify Package

Visit: `https://www.npmjs.com/package/@a.izzuddin/ai-chat`

### 2. Test Installation

In a new project:

```bash
npm install @a.izzuddin/ai-chat
```

### 3. Update Documentation

Add badges to your README:

```markdown
[![npm version](https://badge.fury.io/js/@a.izzuddin%2Fai-chat.svg)](https://www.npmjs.com/package/@a.izzuddin/ai-chat)
[![npm downloads](https://img.shields.io/npm/dm/@a.izzuddin/ai-chat.svg)](https://www.npmjs.com/package/@a.izzuddin/ai-chat)
```

## Package Structure

Your published package will include:

```
@a.izzuddin/ai-chat/
├── dist/
│   ├── index.js          # CommonJS build
│   ├── index.mjs         # ES Module build
│   ├── index.d.ts        # TypeScript types
│   └── *.map             # Source maps
├── components/ui/        # UI components
├── lib/                  # Utilities
├── app/globals.css       # Styles
├── package.json
├── README.md
└── LICENSE
```

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes

## Unpublishing

**Warning**: Only unpublish within 72 hours of publishing!

```bash
npm unpublish @a.izzuddin/ai-chat@0.1.0  # Specific version
npm unpublish @a.izzuddin/ai-chat --force  # All versions (not recommended)
```

After 72 hours, you can only deprecate:

```bash
npm deprecate @a.izzuddin/ai-chat@0.1.0 "Use version 0.2.0 instead"
```

## Troubleshooting

### "Package name too similar"
- npm may reject if name is too similar to existing packages
- Choose a more unique name or add your username scope

### "You do not have permission to publish"
- Ensure you're logged in: `npm whoami`
- For scoped packages, use `--access public`

### "Version already exists"
- Increment version in package.json
- Use `npm version patch/minor/major`

### Build fails before publish
- The `prepublishOnly` script runs automatically
- Fix any build errors before publishing

## Best Practices

1. **Always test locally** before publishing
2. **Use semantic versioning** properly
3. **Write good commit messages** and changelogs
4. **Tag releases** in git: `git tag v0.1.0`
5. **Keep README updated** with examples and API docs
6. **Respond to issues** promptly
7. **Don't publish secrets** (.env files, API keys)

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm Scope Packages](https://docs.npmjs.com/cli/v10/using-npm/scope)
