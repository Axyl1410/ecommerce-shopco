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

/**
 * Remove a connection from the named room and, if the room becomes empty, stop its broadcast interval and delete the room.
 *
 * @param room - The room name whose connection should be removed
 * @param connection - The connection object to remove; no-op if the room does not exist
 */
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

/**
 * Send a server-sent event containing the given data to every active connection in the specified room.
 *
 * Formats `data` as a JSON `data: ...` SSE event and enqueues it to each connection; connections that fail to accept the message are removed.
 *
 * @param room - The name of the room whose connections should receive the event
 * @param data - The payload to send (will be JSON-stringified)
 */
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

/**
 * Begins a per-room periodic broadcast that sends a timestamp payload to all connections in the room every second.
 *
 * If the room does not exist or a broadcast is already active for that room, the function does nothing.
 *
 * @param room - The name of the room to start broadcasting for
 */
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

/**
 * Attaches the incoming GET request as a Server-Sent Events (SSE) client to a named room and returns the SSE response stream.
 *
 * The room name is taken from the request query parameter `room`, defaulting to `"default"`. The connection is registered in the room's connection set, receives an initial `{ message: "Connected!", room }` event, and will receive subsequent room broadcasts. When the request is aborted the connection is removed and the stream is closed.
 *
 * @param req - Incoming NextRequest containing the `room` query parameter and an abort signal
 * @returns A Response that streams Server-Sent Events for the requested room with appropriate SSE headers
 */
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