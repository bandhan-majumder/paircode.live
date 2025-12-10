import type { Socket } from "socket.io";

export class RoomManager {
    constructor() {
    }
    
    joinRoom(roomId: string, socket: Socket) {
        if (!roomId || !socket) {
            socket.emit("error", { message: "Inefficient info provided" });
            return;
        }
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
        socket.emit('lobby');
        socket.to(roomId).emit("user-joined", {
            socketId: socket.id,
            timestamp: Date.now()
        })
    }

    sendMessageToRoom(roomId: string, content: string, socket: Socket) {
        if (!roomId) {
            socket.emit("error", { message: "No roomId provided" });
            return;
        }

        if (!content) {
            socket.emit("error", { message: "No content provided" });
            return;
        }

        // Broadcast to all clients in the room except sender
        socket.to(roomId).emit("receive-message", {
            content,
            senderId: socket.id,
            timestamp: Date.now()
        });

        console.log(`Message sent to room ${roomId} from ${socket.id}`);
    }

    leaveRoom(roomId: string, socket: Socket) {
        if (!roomId) {
            socket.emit('error', {
                message: "No room id"
            });
            return;
        }
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room: ${roomId}`);

        socket.to(roomId).emit("user-left", {
            socketId: socket.id,
            timestamp: Date.now()
        });
    }

    initHandlers() {}
}