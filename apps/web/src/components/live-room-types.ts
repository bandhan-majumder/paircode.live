export interface RoomMember {
    id: string;
    userId: string;
    userName: string | null;
    userImage: string | null;
}

export interface Room {
    id: string;
    topic: string;
    banner: string | null;
    isShared: boolean;
    isFull: boolean;
    createdBy: string;
    creatorName: string | null;
    creatorImage: string | null;
    createdAt: string;
    members: RoomMember[];
}
