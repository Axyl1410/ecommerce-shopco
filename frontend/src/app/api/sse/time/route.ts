import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Store connections by room
type Connection = {
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
};

type Room = {
  connections: Set<Connection>;
  intervalId: NodeJS.Timeout | undefined;
};

const rooms = new Map<string, Room>();

// Cleanup function
function removeConnection(room: string, connection: Connection) {
  const roomData = rooms.get(room);
  if (!roomData) return;

  roomData.connections.delete(connection);

  // If room is empty, cleanup interval and remove room
  if (roomData.connections.size === 0 && roomData.intervalId) {
    clearInterval(roomData.intervalId);
    rooms.delete(room);
  }
}

// Broadcast to all connections in a room
function broadcastToRoom(room: string, data: unknown) {
  const roomData = rooms.get(room);
  if (!roomData) return;

  const message = `data: ${JSON.stringify(data)}\n\n`;

  for (const connection of roomData.connections) {
    try {
      connection.controller.enqueue(connection.encoder.encode(message));
    } catch {
      // Connection closed, remove it
      removeConnection(room, connection);
    }
  }
}

// Start broadcasting for a room (only if not already started)
function startRoomBroadcast(room: string) {
  const roomData = rooms.get(room);
  if (!roomData || roomData.intervalId) return; // Already broadcasting

  roomData.intervalId = setInterval(() => {
    const data = {
      time: new Date().toISOString(),
      timestamp: Date.now(),
      room,
    };
    broadcastToRoom(room, data);
  }, 1000);
}

export async function GET(req: NextRequest) {
  // Get room from query parameter (default to "default")
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room") || "default";

  // Create a readable stream
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Initialize room if it doesn't exist
      if (!rooms.has(room)) {
        rooms.set(room, {
          connections: new Set(),
          intervalId: undefined,
        });
      }

      // Add connection to room
      const connection: Connection = {
        controller,
        encoder,
      };

      const roomData = rooms.get(room);
      if (roomData) {
        roomData.connections.add(connection);
        // Start broadcasting if this is the first connection
        if (roomData.connections.size === 1) {
          startRoomBroadcast(room);
        }
      }

      // Send initial connection message
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ message: "Connected!", room })}\n\n`,
        ),
      );

      // Cleanup on connection close
      req.signal.addEventListener("abort", () => {
        removeConnection(room, connection);
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
