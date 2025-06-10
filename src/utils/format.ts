export const rtfToPlainText = (rtf: string): string => {
  return rtf
    .replace(/\\par[d]?/g, "\n") // Convert paragraph tags to newlines
    .replace(/\\'[0-9a-fA-F]{2}/g, "") // Remove hex escaped chars (e.g., \'91)
    .replace(/\\[a-z]+\d* ?/g, "") // Remove other RTF control words
    .replace(/{|}/g, "") // Remove RTF braces
    .replace(/\n{2,}/g, "\n") // Collapse extra newlines
    .trim();
};

export const stripStyleTags = (html: string): string => {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
};

export const htmlTOArray = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const elements = Array.from(doc.body.children); // p, div, etc.

  const lines: string[] = [];

  elements.forEach((el) => {
    const fragment = document.createElement("div");
    fragment.innerHTML = el.outerHTML;

    // Split inner content by <br> and preserve text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fragment.innerHTML;

    tempDiv.childNodes.forEach((node) => {
      if (node.nodeName === "BR") {
        lines.push(""); // blank line
      } else if (node.nodeType === Node.TEXT_NODE) {
        lines.push((node.textContent || "").trim());
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.nodeName === "BR") {
          lines.push("");
        } else {
          const parts = el.innerHTML.split(/<br\s*\/?>/i);
          lines.push(...parts.map((s) => s.trim()).filter(Boolean));
        }
      }
    });
  });

  // Filter out truly empty lines
  const cleaned = lines.filter((line) => line !== "");
  return cleaned;
};
