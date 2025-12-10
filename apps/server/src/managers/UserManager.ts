import type { Server, Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export class UserManager {
    private roomManager: RoomManager;

    constructor(io: Server) {
        this.roomManager = new RoomManager(io);
    }

    addUser(roomId: string, socket: Socket) {
        this.roomManager.joinRoom(roomId, socket);
        this.initHandlers(socket);
    }

    removeUser(roomId: string, socket: Socket) {
        this.roomManager.leaveRoom(roomId, socket);
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