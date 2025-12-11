"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "@/lib/auth-client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { room } from "@paircode/db/schema/room";
import { toast } from "sonner";

export function ShareRoomDialog({ session, roomId }: {
    session: typeof authClient.$Infer.Session;
    roomId: string
}) {
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();

    if (!session || !roomId) {
        return null;
    }

    const mutation = useMutation({
        mutationFn: async (data: { roomId: string, member: string }) => {
            return axios.put("/api/room", data);
        },
        onSuccess: (response) => {
            formRef.current?.reset();
            closeRef.current?.click();
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            return response;
        },
        onError: (error) => {
            console.error("Error creating room:", error);
        },
        retry: 2
    });

    const handleShare = async () => {
        if (roomId && session.user.id) {
            const response = await mutation.mutateAsync({ roomId, member: session.user.id });
            if (response.data.newRoom.id){
                toast.success("Session share successfully! Link copied to your clipboard");
                navigator.clipboard.writeText("https://localhost/3001/room/"+roomId);
            }
            return;
        }
        throw new Error("Unable to share session!")
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-[#3C6E41] text-white hover:bg-[#3C6E41] w-27">
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share session</DialogTitle>
                    <DialogDescription>
                        Sharing sessions will allow other participants make changes.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <DialogClose asChild>
                        <Button variant="outline" type="button" ref={closeRef}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        onClick={async () => {
                            await handleShare();
                        }}
                        className="bg-[#6fa173] text-white hover:bg-[#638d66]"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Sharing..." : "Share"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}