import { convertRtfToHtml as convertRtfToHtmlFn } from "rtf-to-html-converter";

export const convertRtfToHtml = async (rtfString: string) => {
  try {
    const html = convertRtfToHtmlFn(String.raw`${rtfString}`);
    let cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "");

    // Extract content inside <body>...</body>
    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let replacedHtml = "";
    if (bodyMatch && bodyMatch[1]) {
      replacedHtml = bodyMatch[1].trim();
    } else {
      // No <body> found, return cleaned whole html
      replacedHtml = cleaned.trim();
    }

    const match = html.match(/^<div[^>]*>\s*;{3,}[\s\S]*?<\/div>/i);

    if (match) {
      // Remove that first suspicious div entirely
      return replacedHtml.replace(match[0], "").trim();
    }
    return replacedHtml;
  } catch (err) {
    throw err;
  }
};
