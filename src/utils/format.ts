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
