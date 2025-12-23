import type { Server, Socket } from "socket.io";

export class RoomManager {
    constructor(private io: Server) { }

    async joinRoom(roomId: string, socket: Socket) {
        if (!roomId || !socket) {
            socket.emit("error", { message: "Inefficient info provided" });
            return;
        }
        await socket.join(roomId);
        socket.emit('lobby');
        socket.to(roomId).emit("user-joined", {
            socketId: socket.id,
            timestamp: Date.now()
        })
        
        const totalSocketInRoom = await this.io.in(roomId).fetchSockets();
        if (totalSocketInRoom.length === 2) {
            totalSocketInRoom.forEach((s) => {
                s.emit("send-offer", { roomId });
            });
        }
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
    }

    leaveRoom(roomId: string, socket: Socket) {
        if (!roomId) {
            socket.emit('error', {
                message: "No room id"
            });
            return;
        }
        socket.leave(roomId);

        socket.to(roomId).emit("user-left", {
            socketId: socket.id,
            timestamp: Date.now()
        });
    }

    private async getOtherSocketsInRoom(roomId: string, senderId: string) {
        const sockets = await this.io.in(roomId).fetchSockets();
        return sockets.filter((s) => s.id !== senderId);
    }

    async onOffer(roomId: string, sdp: string, senderSocketId: string) {
        const others = await this.getOtherSocketsInRoom(roomId, senderSocketId);
        if (!others.length || !others[0]) return;
        others[0].emit("offer", { sdp, roomId });
    }

    async onAnswer(roomId: string, sdp: string, senderSocketId: string) {
        const others = await this.getOtherSocketsInRoom(roomId, senderSocketId);
        if (!others.length || !others[0]) return;
        others[0].emit("answer", { sdp, roomId });
    }

    async onIceCandidates(roomId: string, senderSocketId: string, candidate: any, type: "sender" | "receiver") {
        const others = await this.getOtherSocketsInRoom(roomId, senderSocketId);
        if (!others.length || !others[0]) return;
        others[0].emit("add-ice-candidate", { candidate, type });
    }

}