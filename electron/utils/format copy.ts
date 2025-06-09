// @ts-ignore
import rtfToHTML from "@iarna/rtf-to-html";

export function convertRtfToHtml(rtfString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    rtfToHTML.fromString(rtfString, (err: any, html: string) => {
      if (err) {
        console.error("Error parsing RTF:", err);
        reject(err);
        return;
      }

      try {
        // Remove <script> and <style> tags and content
        let cleaned = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "");

        // Extract content inside <body>...</body>
        const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
          resolve(bodyMatch[1].trim());
        } else {
          // No <body> found, return cleaned whole html
          resolve(cleaned.trim());
        }
      } catch (e) {
        // fallback: return full html if error
        resolve(html);
      }
    });
  });
}
