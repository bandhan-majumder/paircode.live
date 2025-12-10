import type { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export class UserManager {
    private roomManager: RoomManager;

    constructor() {
        this.roomManager = new RoomManager();
    }

    addUser(roomId: string, socket: Socket) {
        this.roomManager.joinRoom(roomId, socket);
        this.initHandlers();
    }

    removeUser(roomId: string, socket: Socket) {
        this.roomManager.leaveRoom(roomId, socket);
    }

    sendMessage(roomId: string, socket: Socket, content: string) {
        this.roomManager.sendMessageToRoom(roomId, content, socket);
    }

    initHandlers() {}
}