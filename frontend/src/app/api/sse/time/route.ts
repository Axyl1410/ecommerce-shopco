import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Create a readable stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ message: "Connected!" })}\n\n`,
        ),
      );

      // Send time updates every second
      const interval = setInterval(() => {
        const data = {
          time: new Date().toISOString(),
          timestamp: Date.now(),
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }, 1000);

      // Cleanup on connection close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  // Return the stream with proper headers
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for Nginx
    },
  });
}
