import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Tìm context từ metadata của message mới nhất (message cuối cùng)
  let context: string | undefined;
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.metadata && typeof lastMessage.metadata === "object") {
      const metadata = lastMessage.metadata as any;
      context = metadata.context;
    }
  }

  // Tạo system message với context nếu có
  const systemMessage = context
    ? {
        role: "system" as const,
        content: context,
      }
    : null;

  // Kết hợp system message với messages
  const allMessages = systemMessage
    ? [systemMessage, ...convertToModelMessages(messages)]
    : convertToModelMessages(messages);

  const result = streamText({
    model: google.languageModel("gemini-2.5-flash"),
    messages: allMessages,
  });

  return result.toUIMessageStreamResponse();
}
