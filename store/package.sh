#!/bin/bash
# Package the Chrome extension for Web Store submission
# Creates a .zip file containing only the extension files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
VERSION=$(grep '"version"' "$ROOT_DIR/manifest.json" | sed 's/.*"version": *"\([^"]*\)".*/\1/')
OUTPUT_FILE="$SCRIPT_DIR/chatgpt-to-markdown-v${VERSION}.zip"

cd "$ROOT_DIR"

# Remove existing package if present
rm -f "$OUTPUT_FILE"

# Create zip with only extension files (no store assets, no git)
zip -r "$OUTPUT_FILE" \
    manifest.json \
    content.js \
    styles.css \
    icon16.png \
    icon48.png \
    icon128.png \
    -x "*.DS_Store"

echo "Created: $OUTPUT_FILE"
echo "Contents:"
unzip -l "$OUTPUT_FILE"
