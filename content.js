// ChatGPT to Markdown — content script
// Injects a download button and converts the active conversation to .md

(function () {
  const BUTTON_ID = "cgpt-md-download-btn";

  // ─── DOM helpers ─────────────────────────────────────────────────────────

  function getTitle() {
    // ChatGPT sets <title> as "conversation name | ChatGPT"
    const raw = document.title || "conversation";
    return raw.replace(/\s*[\|—]\s*ChatGPT.*$/i, "").trim() || "conversation";
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  // ─── HTML → Markdown conversion ──────────────────────────────────────────

  function nodeToMd(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const tag = node.tagName.toLowerCase();
    const children = () => Array.from(node.childNodes).map(nodeToMd).join("");

    switch (tag) {
      case "br":
        return "\n";
      case "p":
        return children() + "\n\n";
      case "strong":
      case "b":
        return `**${children()}**`;
      case "em":
      case "i":
        return `_${children()}_`;
      case "code": {
        // inline code (not inside pre)
        if (node.parentElement?.tagName.toLowerCase() === "pre") {
          return node.textContent; // handled by pre
        }
        return `\`${node.textContent}\``;
      }
      case "pre": {
        const codeEl = node.querySelector("code");
        const lang = codeEl
          ? (codeEl.className.match(/language-(\S+)/) || [])[1] || ""
          : "";
        const text = (codeEl || node).textContent;
        return `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
      }
      case "h1":
        return `# ${children()}\n\n`;
      case "h2":
        return `## ${children()}\n\n`;
      case "h3":
        return `### ${children()}\n\n`;
      case "h4":
        return `#### ${children()}\n\n`;
      case "ul": {
        const items = Array.from(node.querySelectorAll(":scope > li"))
          .map((li) => `- ${li.textContent.trim()}`)
          .join("\n");
        return items + "\n\n";
      }
      case "ol": {
        const items = Array.from(node.querySelectorAll(":scope > li"))
          .map((li, i) => `${i + 1}. ${li.textContent.trim()}`)
          .join("\n");
        return items + "\n\n";
      }
      case "li":
        return children();
      case "a": {
        const href = node.getAttribute("href") || "";
        const text = children().trim();
        return href ? `[${text}](${href})` : text;
      }
      case "hr":
        return "\n---\n\n";
      case "table": {
        const rows = Array.from(node.querySelectorAll("tr"));
        if (!rows.length) return children();
        const toRow = (tr) =>
          "| " +
          Array.from(tr.querySelectorAll("th,td"))
            .map((c) => c.textContent.trim())
            .join(" | ") +
          " |";
        const header = toRow(rows[0]);
        const divider =
          "| " +
          Array.from(rows[0].querySelectorAll("th,td"))
            .map(() => "---")
            .join(" | ") +
          " |";
        const body = rows.slice(1).map(toRow).join("\n");
        return [header, divider, body].join("\n") + "\n\n";
      }
      default:
        return children();
    }
  }

  function elementToMd(el) {
    return nodeToMd(el)
      .replace(/\n{3,}/g, "\n\n") // collapse excess blank lines
      .trim();
  }

  // ─── Conversation scraper ────────────────────────────────────────────────

  function scrapeConversation() {
    // ChatGPT marks each turn with data-testid="conversation-turn-N"
    const turns = document.querySelectorAll(
      "[data-testid^='conversation-turn']"
    );

    if (!turns.length) {
      alert("No conversation found on this page.");
      return null;
    }

    const lines = [];
    const title = getTitle();
    lines.push(`# ${title}\n`);

    turns.forEach((turn) => {
      // Role is stored in a descendant attribute
      const roleEl = turn.querySelector("[data-message-author-role]");
      const role = roleEl
        ? roleEl.getAttribute("data-message-author-role")
        : null;

      // The actual message content lives inside the prose container
      // (assistant) or the user message container
      let contentEl =
        turn.querySelector(".markdown") || // assistant prose
        turn.querySelector("[data-message-author-role='user'] .whitespace-pre-wrap") || // user
        turn.querySelector("[data-message-author-role]"); // fallback

      if (!contentEl) return;

      const label = role === "user" ? "**You**" : "**ChatGPT**";
      const md = elementToMd(contentEl);

      lines.push(`${label}\n\n${md}\n\n---\n`);
    });

    return lines.join("\n");
  }

  // ─── Download ────────────────────────────────────────────────────────────

  function download(content, filename) {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Button injection ────────────────────────────────────────────────────

  function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.textContent = "Download .md";
    btn.title = "Download conversation as Markdown";

    btn.addEventListener("click", () => {
      const md = scrapeConversation();
      if (!md) return;
      const filename = slugify(getTitle()) + ".md";
      download(md, filename);
    });

    document.body.appendChild(btn);
  }

  // ─── Init ────────────────────────────────────────────────────────────────

  // Inject immediately, then watch for navigation (ChatGPT is a SPA)
  injectButton();

  const observer = new MutationObserver(() => {
    injectButton();
  });

  observer.observe(document.body, { childList: true, subtree: false });
})();
