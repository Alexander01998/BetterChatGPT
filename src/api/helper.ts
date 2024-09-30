import { EventSourceData } from '@type/api';

export const parseEventSource = (
  data: string
): (string | Record<string, unknown>)[] => {
  const result: (string | Record<string, unknown>)[] = [];
  const events = data.split("\n\n");

  for (const event of events) {
    if (event === ": OPENROUTER PROCESSING") {
      // Ignore this message
    } else if (event.startsWith("data: ")) {
      const jsonData = event.replace(/^data: /, "").trim();
      if (jsonData === "[DONE]") {
        result.push("[DONE]");
      } else {
        try {
          const parsed = JSON.parse(jsonData);
          result.push(parsed);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          result.push(jsonData);
        }
      }
    } else if (event.trim() !== "") {
      result.push(event);
    }
  }

  return result;
};

export const createMultipartRelatedBody = (
  metadata: object,
  file: File,
  boundary: string
): Blob => {
  const encoder = new TextEncoder();

  const metadataPart = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
      metadata
    )}\r\n`
  );
  const filePart = encoder.encode(
    `--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`
  );
  const endBoundary = encoder.encode(`\r\n--${boundary}--`);

  return new Blob([metadataPart, filePart, file, endBoundary], {
    type: 'multipart/related; boundary=' + boundary,
  });
};
