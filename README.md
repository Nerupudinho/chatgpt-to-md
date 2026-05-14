# ChatGPT to Markdown

A Chrome extension that exports ChatGPT conversations as clean markdown files. One click to save any conversation locally.

## What it does

Injects a **Download as Markdown** button into ChatGPT's UI. Click it to get a `.md` file with the full conversation — clean formatting, ready to use in Obsidian, Claude Code context, or any second-brain tool.

## Why

ChatGPT conversations are trapped in the browser with no native export. This bridges ChatGPT output into local AI workflows — feed yesterday's conversation as context for today's build session.

## Install

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder

## Stack

Chrome Extension (Manifest V3) · JavaScript · CSS

## Files

```
chatgpt-to-md/
├── manifest.json    # Extension config (Manifest V3)
├── content.js       # Injects download button into ChatGPT
├── styles.css       # Button styling
└── icon.png         # Extension icon
```
