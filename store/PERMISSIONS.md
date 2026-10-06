# Permission Justifications

## Single Purpose Statement

This extension exports ChatGPT conversations to Markdown files for local download.

## Host Permissions

| Host Match | Justification |
|------------|---------------|
| `https://chatgpt.com/*` | Required to inject the download button and read conversation content from ChatGPT's web interface. |
| `https://chat.openai.com/*` | Required to support OpenAI's legacy ChatGPT domain for users who access it via this URL. |

## API Permissions

*None required.*

The extension uses only standard web APIs:
- DOM manipulation to inject the download button
- DOM reading to extract conversation text
- Blob API to create the Markdown file
- Anchor click to trigger the browser's native download

No Chrome extension APIs (`chrome.*`) are used.
