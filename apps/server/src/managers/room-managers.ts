import type { Server, Socket } from "socket.io";

export class RoomManager {
    constructor(private io: Server) { }

    async joinRoom(roomId: string, socket: Socket): Promise<boolean> {
        if (!roomId || !socket) {
            socket.emit("error", { message: "Inefficient info provided" });
            return false;
        }

        const room = this.io.sockets.adapter.rooms.get(roomId);
        const roomSize = room ? room.size : 0;

        // '>' is for safety, should not exceed 2
        if (roomSize >= 2) {
            socket.emit("error", { message: "Room is full" });
            return false;
        };

        try {
            await socket.join(roomId);

            const updatedRoom = this.io.sockets.adapter.rooms.get(roomId);
            if (updatedRoom && updatedRoom.size > 2) {
                await socket.leave(roomId);
                socket.emit("error", { message: "Room is full" });
                return false;
            }

            socket.data.isJoined = true;

            socket.emit('lobby');
            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                timestamp: Date.now()
            });

            if (roomSize === 1) {
                this.io.in(roomId).emit("send-offer", { roomId });
            }
            return true;
        } catch (err) {
            socket.emit("error", { message: "Failed to join room" });
            console.error("Join room error:", err);
            return false;
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

    async leaveRoom(roomId: string, socket: Socket) {
        if (!roomId) {
            socket.emit('error', {
                message: "No room id"
            });
            return;
        }

        if (socket.data.isJoined) {
            socket.to(roomId).emit("user-left", {
                socketId: socket.id,
                timestamp: Date.now()
            });
            socket.data.isJoined = false;
        }

        await socket.leave(roomId);
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