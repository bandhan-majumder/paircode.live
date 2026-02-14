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
import { authClient } from "@/lib/auth-client";
import { useRef } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/utils/trpc";

export function ShareRoomDialog({ session, roomId }: {
    session: typeof authClient.$Infer.Session;
    roomId: string
}) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();

    if (!session || !roomId) {
        return null;
    }

    const mutation = useMutation(
        trpc.room.updateShare.mutationOptions({
            onSuccess: (response) => {
                formRef.current?.reset();
                closeRef.current?.click();
                queryClient.invalidateQueries({ queryKey: ['public-rooms'] });
                toast.success("Session share successfully! Link copied to your clipboard");
                navigator.clipboard.writeText("https://localhost/3001/room/"+roomId);
            },
            onError: (error) => {
                console.error("Error sharing room:", error);
            },
        })
    );

    const handleShare = async () => {
        if (roomId && session.user.id) {
            await mutation.mutateAsync({ roomId });
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