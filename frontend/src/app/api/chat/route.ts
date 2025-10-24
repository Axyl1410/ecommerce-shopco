import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Find context from metadata of the latest message (last message)
  let context: string | undefined;
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.metadata &&
      typeof lastMessage.metadata === "object" &&
      "context" in lastMessage.metadata &&
      typeof (lastMessage.metadata as { context?: unknown }).context ===
        "string"
    ) {
      context = (lastMessage.metadata as { context: string }).context;
    }
  }

  // Create system message with context if available
  const systemMessage = context
    ? {
        role: "system" as const,
        content: context,
      }
    : null;

  // Combine system message with messages
  const allMessages = systemMessage
    ? [systemMessage, ...convertToModelMessages(messages)]
    : convertToModelMessages(messages);

  const result = streamText({
    model: google.languageModel("gemini-2.5-flash"),
    messages: allMessages,
  });

  return result.toUIMessageStreamResponse();
}
