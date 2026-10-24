#!/bin/bash
set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

echo "🧹 Removendo pacotes .dmg antigos da raiz de Chess Mastery..."
rm -f "$APP_DIR"/*.dmg

if command -v pnpm >/dev/null 2>&1 && command -v cargo >/dev/null 2>&1; then
  echo "📦 Compilando via Tauri v2 (pnpm tauri build)..."
  pnpm install
  pnpm tauri build
  DMG_FILE=$(find "$APP_DIR/src-tauri/target/release/bundle/dmg" -name "*.dmg" | head -n 1)
  if [ -n "$DMG_FILE" ]; then
    cp "$DMG_FILE" "$APP_DIR/"
    echo "✅ Instalador movido para: $APP_DIR/$(basename "$DMG_FILE")"
    exit 0
  fi
fi

echo "🍎 Compilando bundle nativo macOS Apple Silicon (WKWebView + Cocoa)..."
BUILD_TMP="/tmp/ChessMasteryBuild"
APP_BUNDLE="$BUILD_TMP/Chess Mastery.app"
DMG_STAGING="/tmp/ChessMasteryDMG"
DMG_OUTPUT="$APP_DIR/Chess Mastery_1.0.0_aarch64.dmg"

rm -rf "$BUILD_TMP" "$DMG_STAGING"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources"

cat > "$APP_BUNDLE/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>pt-BR</string>
    <key>CFBundleDisplayName</key>
    <string>Chess Mastery</string>
    <key>CFBundleExecutable</key>
    <string>chess-mastery</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.antigravity.chessmastery</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>Chess Mastery</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

/usr/bin/clang -O2 -fobjc-arc \
  -framework Cocoa \
  -framework WebKit \
  "$APP_DIR/src-tauri/macos-native/main.m" \
  -o "$APP_BUNDLE/Contents/MacOS/chess-mastery"

cp "$APP_DIR/src-tauri/icons/icon.icns" "$APP_BUNDLE/Contents/Resources/icon.icns"
cp -R "$APP_DIR/dist" "$APP_BUNDLE/Contents/Resources/dist"

codesign --force --deep --sign - "$APP_BUNDLE" 2>/dev/null || true

mkdir -p "$DMG_STAGING"
cp -R "$APP_BUNDLE" "$DMG_STAGING/"
ln -s /Applications "$DMG_STAGING/Applications"

echo "💿 Empacotando DMG..."
/usr/bin/hdiutil create \
  -volname "Chess Mastery" \
  -srcfolder "$DMG_STAGING" \
  -ov -format UDZO \
  "$DMG_OUTPUT"

rm -rf "$BUILD_TMP" "$DMG_STAGING"
echo "✅ Build concluído com sucesso: $DMG_OUTPUT"
ls -lh "$DMG_OUTPUT"
