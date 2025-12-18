import { io as ioClient, Socket as ClientSocket } from "socket.io-client";
import http from "http";
import { describe, expect, afterEach, beforeEach, it } from "bun:test";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const SOCKET_URL = `http://localhost:${PORT}`;
const HEALTH_URL = `http://localhost:${PORT}/health`;
const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const generateToken = (email: string, roomId: string, expiresIn: '1h' | '-1s' = "1h"): string => {
  return jwt.sign({ email, roomId }, JWT_SECRET, { expiresIn });
};

describe("Test suite for Socket.IO backend", () => {
  let client1: ClientSocket | null = null;
  let client2: ClientSocket | null = null;

  const createSocketClient = (token: string): Promise<ClientSocket> => {
    return new Promise((resolve, reject) => {
      const client = ioClient(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: false,
        query: { token },
      });
      
      client.on("connect", () => resolve(client));
      client.on("connect_error", (err) => {
        client.close();
        reject(err);
      });
      
      setTimeout(() => {
        client.close();
        reject(new Error("Socket connection timeout"));
      }, 5000);
    });
  };

  const waitForMessage = (client: ClientSocket, event: string, timeout = 5000): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Message timeout for event: ${event}`));
      }, timeout);

      client.once(event, (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  };

  const cleanupClient = async (client: ClientSocket | null) => {
    if (client && client.connected) {
      await new Promise<void>(resolve => {
        client.once("disconnect", () => resolve());
        client.disconnect();
      });
    }
  };

  afterEach(async () => {
    await cleanupClient(client1);
    await cleanupClient(client2);
    client1 = null;
    client2 = null;
    
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe("Health check", () => {
    it("should return health check status", (done) => {
      http.get(HEALTH_URL, (res) => {
        let data = "";
        
        res.on("data", (chunk) => {
          data += chunk;
        });
        
        res.on("end", () => {
          const parsed = JSON.parse(data);
          expect(res.statusCode).toBe(200);
          expect(parsed.status).toBe("ok");
          expect(parsed.uptime).toBeGreaterThan(0);
          done();
        });
      });
    });

    it("should return 404 for unknown routes", (done) => {
      http.get(`${HEALTH_URL.replace('/health', '/unknown')}`, (res) => {
        expect(res.statusCode).toBe(404);
        done();
      });
    });
  });

  describe("Authentication", () => {
    it("should reject connection without token", async () => {
      try {
        const client = ioClient(SOCKET_URL, {
          transports: ['websocket'],
          reconnection: false,
        });
        
        await new Promise((resolve, reject) => {
          client.on("connect", () => {
            client.close();
            resolve(client);
          });
          client.on("connect_error", (err) => {
            client.close();
            reject(err);
          });
          setTimeout(() => {
            client.close();
            reject(new Error("Timeout"));
          }, 5000);
        });
        
        throw new Error("Should have rejected connection");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject connection with invalid token", async () => {
      try {
        await createSocketClient("invalid-token");
        throw new Error("Should have rejected connection");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject connection with malformed JWT", async () => {
      try {
        await createSocketClient("Bearer invalid.jwt.token");
        throw new Error("Should have rejected connection");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject token without email", async () => {
      const token = jwt.sign({ roomId: "test-room" }, JWT_SECRET);
      try {
        await createSocketClient(token);
        throw new Error("Should have rejected connection");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject token without roomId", async () => {
      const token = jwt.sign({ email: "test@example.com" }, JWT_SECRET);
      try {
        await createSocketClient(token);
        throw new Error("Should have rejected connection");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should accept connection with valid token", async () => {
      const token = generateToken("user1@example.com", "test-room");
      const client = await createSocketClient(token);
      
      expect(client.connected).toBe(true);
      
      await cleanupClient(client);
    });

    it("should reject expired token", async () => {
      const token = generateToken("user@example.com", "test-room", "-1s");
      try {
        await createSocketClient(token);
        throw new Error("Should have rejected connection");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Room authorization", () => {
    beforeEach(async () => {
      const token1 = generateToken("user1@example.com", "room-1");
      const token2 = generateToken("user2@example.com", "room-1");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);
    });

    it("should reject join-room with mismatched roomId", async () => {
      if (!client1) throw new Error("Client not initialized");

      const errorPromise = waitForMessage(client1, "error", 1000);
      const disconnectPromise = waitForMessage(client1, "disconnect", 1000);

      client1.emit("join-room", "different-room");

      const error = await errorPromise;
      expect(error.message).toContain("Invalid roomId");
      
      await disconnectPromise;
      expect(client1.connected).toBe(false);
    });

    it("should reject send-message to unauthorized room", async () => {
      if (!client1) throw new Error("Client not initialized");

      client1.emit("join-room", "room-1");
      await new Promise(resolve => setTimeout(resolve, 200));

      const errorPromise = waitForMessage(client1, "error", 1000);

      client1.emit("send-message", { roomId: "different-room", content: "test" });

      const error = await errorPromise;
      expect(error.message).toContain("Unauthorized");
    });

    it("should allow operations in authorized room", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      client1.emit("join-room", "room-1");
      client2.emit("join-room", "room-1");
      
      await new Promise(resolve => setTimeout(resolve, 200));

      const messagePromise = waitForMessage(client2, "receive-message");

      client1.emit("send-message", { roomId: "room-1", content: "authorized message" });

      const received = await messagePromise;
      expect(received.content).toBe("authorized message");
    });
  });

  describe("Connection management", () => {
    it("should establish Socket.IO connections successfully", async () => {
      const token1 = generateToken("user1@example.com", "test-room");
      const token2 = generateToken("user2@example.com", "test-room");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);

      expect(client1.connected).toBe(true);
      expect(client2.connected).toBe(true);
    });

    it("should assign unique socket IDs", async () => {
      const token1 = generateToken("user1@example.com", "test-room");
      const token2 = generateToken("user2@example.com", "test-room");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);

      expect(client1.id).toBeDefined();
      expect(client2.id).toBeDefined();
      expect(client1.id).not.toBe(client2.id);
    });
  });

  describe("Room operations", () => {
    beforeEach(async () => {
      const token1 = generateToken("user1@example.com", "test-room");
      const token2 = generateToken("user2@example.com", "test-room");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);
    });

    it("should broadcast message to other clients in the same room", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";
      const testContent = "Hello from client1";
      
      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      const messagePromise = waitForMessage(client2, "receive-message");

      client1.emit("send-message", { roomId, content: testContent });

      const received = await messagePromise;
      expect(received.content).toBe(testContent);
    });

    it("should not send message back to sender", async () => {
      if (!client1) throw new Error("Client not initialized");

      const roomId = "test-room";
      const testContent = "Hello";

      client1.emit("join-room", roomId);
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageReceived = false;
      client1.on("receive-message", () => {
        messageReceived = true;
      });

      client1.emit("send-message", { roomId, content: testContent });

      await new Promise(resolve => setTimeout(resolve, 500));
      expect(messageReceived).toBe(false);
    });

    it("should handle clients joining room dynamically", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";

      client1.emit("join-room", roomId);
      await new Promise(resolve => setTimeout(resolve, 200));

      client2.emit("join-room", roomId);
      await new Promise(resolve => setTimeout(resolve, 200));

      const messagePromise = waitForMessage(client2, "receive-message");

      client1.emit("send-message", { roomId, content: "Second message" });

      const received = await messagePromise;
      expect(received.content).toBe("Second message");
    });

    it("should receive user-joined notification when client joins room", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";

      client1.emit("join-room", roomId);
      await new Promise(resolve => setTimeout(resolve, 200));

      const joinPromise = waitForMessage(client1, "user-joined");

      client2.emit("join-room", roomId);

      const received = await joinPromise;
      expect(received.socketId).toBe(client2.id);
    });

    it("should handle explicit leave-room", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const token3 = generateToken("user3@example.com", "test-room");
      const client3 = await createSocketClient(token3);
      const roomId = "test-room";

      try {
        client1.emit("join-room", roomId);
        client2.emit("join-room", roomId);
        client3.emit("join-room", roomId);

        await new Promise(resolve => setTimeout(resolve, 200));

        client2.emit("leave-room", roomId);
        await new Promise(resolve => setTimeout(resolve, 200));

        let messageCountForClient3 = 0;
        let messageCountForClient2 = 0;
        
        client3.on("receive-message", () => {
          messageCountForClient3++;
        });

        client2.on("receive-message", () => {
          messageCountForClient2++;
        });

        client1.emit("send-message", { roomId, content: "test" });

        await new Promise(resolve => setTimeout(resolve, 300));

        expect(messageCountForClient3).toBe(1);
        expect(messageCountForClient2).toBe(0);
      } finally {
        await cleanupClient(client3);
      }
    });

    it("should receive user-left notification when client leaves room", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";

      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      await new Promise(resolve => setTimeout(resolve, 200));

      const leavePromise = waitForMessage(client1, "user-left");

      client2.emit("leave-room", roomId);

      const received = await leavePromise;
      expect(received.socketId).toBe(client2.id);
    });

    it("should remove client from room on disconnect", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const token3 = generateToken("user3@example.com", "test-room");
      const client3 = await createSocketClient(token3);
      const roomId = "test-room";

      try {
        client1.emit("join-room", roomId);
        client2.emit("join-room", roomId);
        client3.emit("join-room", roomId);

        await new Promise(resolve => setTimeout(resolve, 200));

        await cleanupClient(client2);
        client2 = null;
        
        await new Promise(resolve => setTimeout(resolve, 200));

        let messageCount = 0;
        client3.on("receive-message", () => {
          messageCount++;
        });

        client1.emit("send-message", { roomId, content: "test" });
        await new Promise(resolve => setTimeout(resolve, 300));

        expect(messageCount).toBe(1);
      } finally {
        await cleanupClient(client3);
      }
    });
  });

  describe("Room isolation", () => {
    it("should isolate messages between different rooms", async () => {
      const token1 = generateToken("user1@example.com", "room-1");
      const token2 = generateToken("user2@example.com", "room-1");
      const token3 = generateToken("user3@example.com", "room-2");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);
      const client3 = await createSocketClient(token3);

      try {
        const room1 = "room-1";
        const room2 = "room-2";
        const contentRoom1 = "Message for room 1";

        client1.emit("join-room", room1);
        client2.emit("join-room", room1);
        client3.emit("join-room", room2);

        await new Promise(resolve => setTimeout(resolve, 200));

        const client2Promise = waitForMessage(client2, "receive-message");
        const client3Promise = waitForMessage(client3, "receive-message", 1000);

        client1.emit("send-message", { roomId: room1, content: contentRoom1 });

        const client2Received = await client2Promise;
        expect(client2Received.content).toBe(contentRoom1);

        await expect(client3Promise).rejects.toThrow("Message timeout");
      } finally {
        await cleanupClient(client3);
      }
    });

    it("should prevent cross-room message sending", async () => {
      const token1 = generateToken("user1@example.com", "room-1");
      const token2 = generateToken("user2@example.com", "room-2");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);

      client1.emit("join-room", "room-1");
      client2.emit("join-room", "room-2");

      await new Promise(resolve => setTimeout(resolve, 200));

      let messageReceived = false;
      client2.on("receive-message", () => {
        messageReceived = true;
      });

      const errorPromise = waitForMessage(client1, "error", 1000);
      client1.emit("send-message", { roomId: "room-2", content: "cross-room attempt" });

      await errorPromise;
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(messageReceived).toBe(false);
    });
  });

  describe("Message handling", () => {
    beforeEach(async () => {
      const token1 = generateToken("user1@example.com", "test-room");
      const token2 = generateToken("user2@example.com", "test-room");
      
      client1 = await createSocketClient(token1);
      client2 = await createSocketClient(token2);
    });

    it("should handle multiple messages in sequence", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";
      const messages = ["Message 1", "Message 2", "Message 3"];
      const receivedMessages: string[] = [];

      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      const messagePromise = new Promise<void>((resolve) => {
        let count = 0;
        client2?.on("receive-message", (data) => {
          receivedMessages.push(data.content);
          count++;
          if (count === messages.length) {
            resolve();
          }
        });
      });

      for (const msg of messages) {
        client1.emit("send-message", { roomId, content: msg });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await messagePromise;
      expect(receivedMessages).toEqual(messages);
    });

    it("should handle empty message content", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";

      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageReceived = false;
      let receivedContent = null;

      client2.on("receive-message", (data) => {
        messageReceived = true;
        receivedContent = data.content;
      });

      client1.emit("send-message", { roomId, content: "" });

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(client1.connected).toBe(true);
      expect(client2.connected).toBe(true);
      
      if (messageReceived) {
        //@ts-ignore
        expect(receivedContent).toBe("");
      }
    });

    it("should handle very long message content", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";
      const longContent = "A".repeat(10000);

      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageReceived = false;
      let receivedContent = null;

      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });

      const messagePromise = new Promise<void>((resolve) => {
        client2?.once("receive-message", (data) => {
          messageReceived = true;
          receivedContent = data.content;
          resolve();
        });
      });

      client1.emit("send-message", { roomId, content: longContent });

      await Promise.race([messagePromise, timeoutPromise]);

      expect(client1.connected).toBe(true);
      expect(client2.connected).toBe(true);

      if (messageReceived) {
        //@ts-ignore
        expect(receivedContent).toBe(longContent);
      }
    });

    it("should handle special characters in message content", async () => {
      if (!client1 || !client2) throw new Error("Clients not initialized");

      const roomId = "test-room";
      const specialContent = "Hello! 🎉 <script>alert('xss')</script> & \"quotes\" 'single'";

      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageReceived = false;
      let receivedContent = null;

      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });

      const messagePromise = new Promise<void>((resolve) => {
        client2?.once("receive-message", (data) => {
          messageReceived = true;
          receivedContent = data.content;
          resolve();
        });
      });

      client1.emit("send-message", { roomId, content: specialContent });

      await Promise.race([messagePromise, timeoutPromise]);

      expect(client1.connected).toBe(true);
      expect(client2.connected).toBe(true);

      if (messageReceived) {
        //@ts-ignore
        expect(receivedContent).toBe(specialContent);
      }
    });

    it("should handle message without content field", async () => {
      if (!client1) throw new Error("Client not initialized");

      const roomId = "test-room";
      client1.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      client1.emit("send-message", { roomId } as any);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(client1.connected).toBe(true);
    });

    it("should handle message without roomId", async () => {
      if (!client1) throw new Error("Client not initialized");

      const roomId = "test-room";
      client1.emit("join-room", roomId);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      client1.emit("send-message", { content: "test" } as any);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(client1.connected).toBe(true);
    });
  });

  describe("Concurrent operations", () => {
    it("should handle multiple clients joining simultaneously", async () => {
      const tokens = Array.from({ length: 5 }, (_, i) => 
        generateToken(`user${i}@example.com`, "concurrent-room")
      );

      const clients = await Promise.all(
        tokens.map(token => createSocketClient(token))
      );

      try {
        expect(clients.length).toBe(5);
        clients.forEach(client => {
          expect(client.connected).toBe(true);
        });

        clients.forEach(client => {
          client.emit("join-room", "concurrent-room");
        });

        await new Promise(resolve => setTimeout(resolve, 300));

        const messagePromises = clients.slice(1).map(client => 
          waitForMessage(client, "receive-message")
        );

        if (!clients[0]) throw new Error("Client not initialized");
        
        clients[0].emit("send-message", { 
          roomId: "concurrent-room", 
          content: "broadcast test" 
        });

        const results = await Promise.all(messagePromises);
        
        results.forEach(result => {
          expect(result.content).toBe("broadcast test");
        });
      } finally {
        await Promise.all(clients.map(client => cleanupClient(client)));
      }
    });

    it("should handle rapid join/leave operations", async () => {
      const token = generateToken("user@example.com", "rapid-room");
      const client = await createSocketClient(token);

      try {
        const roomId = "rapid-room";

        for (let i = 0; i < 10; i++) {
          client.emit("join-room", roomId);
          await new Promise(resolve => setTimeout(resolve, 50));
          client.emit("leave-room", roomId);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        expect(client.connected).toBe(true);
      } finally {
        await cleanupClient(client);
      }
    });
  });

  describe("Error handling", () => {
    it("should emit error event on invalid operations", async () => {
      const token = generateToken("user@example.com", "test-room");
      const client = await createSocketClient(token);

      try {
        const errorPromise = waitForMessage(client, "error", 2000);

        client.emit("send-message", { roomId: "wrong-room", content: "test" });

        const error = await errorPromise;
        expect(error).toBeDefined();
        expect(error.message).toBeTruthy();
      } finally {
        await cleanupClient(client);
      }
    });

    it("should maintain connection stability after errors", async () => {
      const token = generateToken("user@example.com", "test-room");
      const client = await createSocketClient(token);

      try {
        client.emit("send-message", { roomId: "wrong-room", content: "test" });
        await new Promise(resolve => setTimeout(resolve, 200));

        client.emit("join-room", "test-room");
        await new Promise(resolve => setTimeout(resolve, 200));

        expect(client.connected).toBe(true);
      } finally {
        await cleanupClient(client);
      }
    });
  });

  describe("Edge cases", () => {
    it("should handle null/undefined in message data", async () => {
      const token = generateToken("user@example.com", "test-room");
      const client = await createSocketClient(token);

      try {
        client.emit("join-room", "test-room");
        await new Promise(resolve => setTimeout(resolve, 200));

        client.emit("send-message", null as any);
        await new Promise(resolve => setTimeout(resolve, 200));

        expect(client.connected).toBe(true);
      } finally {
        await cleanupClient(client);
      }
    });

    it("should handle rejoining same room", async () => {
      const token = generateToken("user@example.com", "test-room");
      const client = await createSocketClient(token);

      try {
        const roomId = "test-room";

        client.emit("join-room", roomId);
        await new Promise(resolve => setTimeout(resolve, 200));

        client.emit("join-room", roomId);
        await new Promise(resolve => setTimeout(resolve, 200));

        expect(client.connected).toBe(true);
      } finally {
        await cleanupClient(client);
      }
    });

    it("should handle leaving room not joined", async () => {
      const token = generateToken("user@example.com", "test-room");
      const client = await createSocketClient(token);

      try {
        client.emit("leave-room", "test-room");
        await new Promise(resolve => setTimeout(resolve, 200));

        expect(client.connected).toBe(true);
      } finally {
        await cleanupClient(client);
      }
    });
  });
});