import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { IncomingMessage } from "http";
import cookie from "cookie";
import signature from "cookie-signature";
import { sessionStore } from "./index";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

const clients = new Map<string, Set<AuthenticatedWebSocket>>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws"
  });

  // Heartbeat to detect broken connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as AuthenticatedWebSocket;
      if (client.isAlive === false) {
        client.terminate();
        return;
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  wss.on("connection", async (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
    ws.isAlive = true;
    
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Extract userId from session cookie
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      ws.close(1008, "No authentication");
      return;
    }

    const cookies = cookie.parse(cookieHeader);
    const sessionCookie = cookies["connect.sid"];
    
    if (!sessionCookie) {
      ws.close(1008, "No session");
      return;
    }

    // Parse session ID (this is simplified, in production you'd validate the signature)
    let sessionId: string;
    try {
      const secret = process.env.SESSION_SECRET || "pintukerja-secret-key-change-in-production";
      
      // Remove 's:' prefix if present
      const cookieValue = sessionCookie.startsWith('s:') 
        ? sessionCookie.slice(2) 
        : sessionCookie;
      
      // Unsign the cookie
      sessionId = signature.unsign(cookieValue, secret) || cookieValue;
      
      if (!sessionId) {
        throw new Error("Invalid signature");
      }
    } catch (error) {
      console.error("Failed to parse session:", error);
      ws.close(1008, "Invalid session");
      return;
    }

    // Validate session on backend - NEVER trust client-supplied userId
    // We'll store the authenticated userId from the session
    let userId: string | undefined = undefined;
    let sessionVerified = false;

    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Handle authentication message - verify session on backend
        if (message.type === "auth" && message.userId) {
          // SECURITY: Server-side session validation
          const claimedUserId = message.userId as string;
          
          // Verify session on backend - query session store
          sessionStore.get(sessionId, (error: any, session: any) => {
            if (error) {
              console.error("Session validation error:", error);
              ws.close(1008, "Session validation failed");
              return;
            }
            
            if (!session || session.userId !== claimedUserId) {
              console.warn("Invalid session or userId mismatch", { sessionId, claimedUserId, sessionUserId: session?.userId });
              ws.close(1008, "Unauthorized");
              return;
            }
            
            // Session validated successfully
            userId = claimedUserId;
            ws.userId = userId;
            sessionVerified = true;
            
            // Register client
            if (!clients.has(userId)) {
              clients.set(userId, new Set());
            }
            clients.get(userId)!.add(ws);
            
            // Send confirmation
            ws.send(JSON.stringify({ type: "auth_success", userId }));
          });
          return;
        }

        if (!userId || !sessionVerified) {
          ws.send(JSON.stringify({ type: "error", message: "Not authenticated" }));
          return;
        }

        // Handle different message types
        switch (message.type) {
          case "message":
            // Broadcast message to receiver
            const receiverId = message.receiverId;
            if (receiverId && clients.has(receiverId)) {
              const payload = JSON.stringify({
                type: "new_message",
                message: message.data,
              });
              
              clients.get(receiverId)!.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(payload);
                }
              });
            }
            
            // Send confirmation to sender
            ws.send(JSON.stringify({
              type: "message_sent",
              messageId: message.data.id,
            }));
            break;

          case "notification":
            // Broadcast notification to specific user
            const targetUserId = message.targetUserId;
            if (targetUserId && clients.has(targetUserId)) {
              const payload = JSON.stringify({
                type: "new_notification",
                notification: message.data,
              });
              
              clients.get(targetUserId)!.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(payload);
                }
              });
            }
            break;

          case "typing":
            // Broadcast typing indicator
            const typingReceiverId = message.receiverId;
            if (typingReceiverId && clients.has(typingReceiverId)) {
              const payload = JSON.stringify({
                type: "user_typing",
                userId,
                isTyping: message.isTyping,
              });
              
              clients.get(typingReceiverId)!.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(payload);
                }
              });
            }
            break;

          case "mark_read":
            // Notify sender that messages were read
            const senderId = message.senderId;
            if (senderId && clients.has(senderId)) {
              const payload = JSON.stringify({
                type: "messages_read",
                userId,
              });
              
              clients.get(senderId)!.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(payload);
                }
              });
            }
            break;

          default:
            ws.send(JSON.stringify({ 
              type: "error", 
              message: "Unknown message type" 
            }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({ 
          type: "error", 
          message: "Failed to process message" 
        }));
      }
    });

    ws.on("close", () => {
      // Remove client from registry
      if (userId && clients.has(userId)) {
        clients.get(userId)!.delete(ws);
        if (clients.get(userId)!.size === 0) {
          clients.delete(userId);
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  console.log("WebSocket server initialized");
  return wss;
}

// Helper function to broadcast notification to a specific user
export function broadcastNotification(userId: string, notification: any) {
  if (clients.has(userId)) {
    const payload = JSON.stringify({
      type: "new_notification",
      notification,
    });
    
    clients.get(userId)!.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
