import type { Server, Socket } from "socket.io";
import { RoomManager } from "./room-managers";

export class UserManager {
    private roomManager: RoomManager;

    constructor(io: Server) {
        this.roomManager = new RoomManager(io);
    }

    async addUser(roomId: string, socket: Socket) {
        const joined = await this.roomManager.joinRoom(roomId, socket);
        if (joined) {
            this.initHandlers(socket);
        }
    }

    async removeUser(roomId: string, socket: Socket) {
        await this.roomManager.leaveRoom(roomId, socket);
    }

    sendMessage(roomId: string, socket: Socket, content: string) {
        this.roomManager.sendMessageToRoom(roomId, content, socket);
    }

    initHandlers(socket: Socket) {
        socket.on("offer", ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id);
        })
        socket.on("answer", ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        })
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });

    }
}