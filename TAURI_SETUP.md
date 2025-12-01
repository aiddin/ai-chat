# Tauri Setup Guide

Your Next.js chat application is now configured to build as a cross-platform desktop app using Tauri!

## Quick Start

### 1. Install Rust (Required)

Tauri requires Rust to be installed on your system.

**Windows:**
```bash
# Download and run rustup-init.exe from:
https://rustup.rs/

# Also install Microsoft Visual Studio C++ Build Tools:
https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

**macOS:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
xcode-select --install  # Install Xcode Command Line Tools
```

**Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Ubuntu/Debian dependencies:
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

### 2. Configure Your API Endpoint

Edit `.env.local` to set your API endpoint:

```bash
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

Or keep the default `http://localhost:8000` for local development.

### 3. Add App Icons (Recommended)

Generate app icons using the Tauri icon generator:

```bash
# Install the icon generator
npm install --save-dev @tauri-apps/cli

# Generate icons from a single 1024x1024 PNG
npx tauri icon path/to/your-icon.png
```

This will automatically create all required icon formats in `src-tauri/icons/`.

### 4. Run in Development Mode

```bash
npm run tauri:dev
```

This will:
- Start the Next.js dev server
- Open your app in a native window
- Enable hot reload for development

### 5. Build for Production

```bash
npm run tauri:build
```

This creates platform-specific installers in `src-tauri/target/release/bundle/`:

- **Windows**: `.msi` and `.exe` installers
- **macOS**: `.dmg` and `.app` bundle
- **Linux**: `.deb`, `.AppImage`, and other formats

## Configuration

### App Settings

Edit `src-tauri/tauri.conf.json` to customize:

```json
{
  "productName": "AI Chat App",        // Change app name
  "identifier": "com.aichat.app",      // Change bundle identifier
  "version": "0.1.0",                  // App version

  "app": {
    "windows": [{
      "title": "AI Chat",              // Window title
      "width": 1200,                   // Default window width
      "height": 800,                   // Default window height
      "minWidth": 800,                 // Minimum width
      "minHeight": 600                 // Minimum height
    }]
  }
}
```

### Build Targets

To build for specific platforms:

```bash
# Windows only
npm run tauri:build -- --target x86_64-pc-windows-msvc

# macOS only (Intel)
npm run tauri:build -- --target x86_64-apple-darwin

# macOS only (Apple Silicon)
npm run tauri:build -- --target aarch64-apple-darwin

# Linux only
npm run tauri:build -- --target x86_64-unknown-linux-gnu
```

## API Integration

Your chat interface will make requests to the configured API endpoint with:

**Request:**
```
POST {NEXT_PUBLIC_API_URL}/ask
Content-Type: application/json

{
  "session_id": "string",
  "question": "string"
}
```

**Expected Response:**
```json
{
  "response": "string"
}
```

Make sure your API endpoint supports CORS if it's hosted remotely.

## Troubleshooting

### Build Fails on Windows
- Ensure Visual Studio C++ Build Tools are installed
- Restart terminal after installing Rust

### Build Fails on macOS
- Run `xcode-select --install` if you haven't
- For Apple Silicon, ensure Rust supports `aarch64-apple-darwin` target

### Build Fails on Linux
- Ensure all webkit2gtk dependencies are installed
- Check the full dependency list: https://v2.tauri.app/start/prerequisites/#linux

### Icons Not Showing
- Run `npx tauri icon your-icon.png` to generate all formats
- Ensure icon.ico (Windows), icon.icns (macOS), and PNG files exist in `src-tauri/icons/`

### Hot Reload Not Working
- Check if Next.js dev server is running on port 3001
- Verify `devUrl` in `src-tauri/tauri.conf.json` matches your dev server port

## Distribution

After building, you'll find installers in:
```
src-tauri/target/release/bundle/
├── msi/         (Windows installer)
├── nsis/        (Windows installer)
├── dmg/         (macOS disk image)
├── macos/       (macOS .app bundle)
├── deb/         (Linux Debian package)
└── appimage/    (Linux AppImage)
```

Distribute these files to users who can install and run your app without any development dependencies.

## Next Steps

- Customize the app name and identifier in `src-tauri/tauri.conf.json`
- Add proper app icons using `npx tauri icon`
- Configure your production API endpoint
- Test builds on all target platforms
- Set up code signing for distribution (see Tauri docs)

## Resources

- [Tauri Documentation](https://v2.tauri.app/)
- [Tauri API Reference](https://v2.tauri.app/reference/)
- [Icon Generator](https://tauri.app/v1/guides/features/icons/)
- [Code Signing Guide](https://v2.tauri.app/distribute/)
