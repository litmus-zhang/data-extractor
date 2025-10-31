import { MastraMessageV2 } from "@mastra/core";
import { Processor } from "@mastra/core/processors";
import { z } from 'zod';

export class ResponseValidator implements Processor {
  readonly name = 'response-validator';

  constructor(private schema: z.ZodObject<any>) {}

  processOutputResult({
    messages,
    abort,
  }: {
    messages: MastraMessageV2[];
    abort: (reason?: string) => never;
  }): MastraMessageV2[] {
    const responseText = messages
      .map((msg) =>
        msg.content.parts
          .filter((part) => part.type === 'text')
          .map((part) => (part as any).text)
          .join('')
      )
      .join('');

    try {
      // Attempt to parse the response text as a structured object
      const parsedResponse = this.parseResponse(responseText);
      
      // Validate the parsed object against the schema
      this.schema.parse(parsedResponse);

      // Replace the original text content with the structured data
      const structuredPart = {
        // type: 'json' as const,
        json: parsedResponse,
      };

      // Create a new message with the structured content
      const newMessages: MastraMessageV2[] = messages.map(msg => ({
        ...msg,
        content: {
          ...msg.content,
          parts: [structuredPart],
        }
      }));

      return newMessages;

    } catch (error) {
      if (error instanceof z.ZodError) {
        abort(`Response validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      abort(`Failed to parse or validate response: ${error}`);
    }
  }

  private parseResponse(text: string): any {
    const lines = text.split('\\n').filter(line => line.trim() !== '');
    const result: { [key: string]: any } = {};
    let currentKey: string | null = null;
    let currentValue = '';

    for (const line of lines) {
        const match = line.match(/^\s*\\*\\s*\\*(.*?):\\*\\*\\s*(.*)/) || line.match(/^\s*\\*\\s*(.*?):\\*\\s*(.*)/);
        if (match) {
            if (currentKey) {
                result[currentKey.trim().replace(/\s+/g, '_')] = currentValue.trim();
            }
            currentKey = match[1];
            currentValue = match[2];
        } else if (currentKey) {
            currentValue += '\\n' + line;
        }
    }
    if (currentKey) {
        result[currentKey.trim().replace(/\s+/g, '_')] = currentValue.trim();
    }

    // A simple heuristic to convert string values to correct types for the schema
    for(const key in result) {
        if (result[key].toLowerCase() === 'true') {
            result[key] = true;
        } else if (result[key].toLowerCase() === 'false') {
            result[key] = false;
        } else if (!isNaN(result[key]) && result[key].trim() !== '') {
            result[key] = Number(result[key]);
        }
    }

    return result;
  }
}