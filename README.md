# ChatGPT to Markdown

A Chrome extension that exports ChatGPT conversations as clean Markdown files. One click to download any conversation locally.

## What It Does

Adds a **Download .md** button to ChatGPT's interface. Click it to save the current conversation as a properly formatted Markdown file—ready for Obsidian, Notion, or any text editor.

## Features

- Exports the full conversation with speaker labels (**You** / **ChatGPT**)
- Preserves code blocks with syntax highlighting markers
- Handles lists, tables, links, and other formatting
- Works on both `chatgpt.com` and `chat.openai.com`
- Zero configuration required

## Install

### From Source (Developer Mode)

1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the repository folder

The green **Download .md** button appears in the bottom-right corner of any ChatGPT conversation.

## Privacy

This extension runs entirely in your browser. Conversations are processed locally and saved directly to your device. No data is collected or transmitted. See [PRIVACY.md](PRIVACY.md) for details.

## Files

```
chatgpt-to-md/
├── manifest.json     # Extension config (Manifest V3)
├── content.js        # Injects button, converts HTML to Markdown
├── styles.css        # Button styling
├── icon16.png        # Toolbar icon
├── icon48.png        # Extensions page icon
├── icon128.png       # Chrome Web Store icon
├── LICENSE           # MIT License
├── PRIVACY.md        # Privacy policy
└── store/            # Chrome Web Store submission assets
```

## License

MIT License — see [LICENSE](LICENSE)
