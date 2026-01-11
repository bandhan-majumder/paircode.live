"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { useRef, useState } from "react";
import { Share2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ShareRoomDialogProps {
    roomId: string;
    isShared: boolean;
    onShared?: () => void;
}

export function ShareRoomDialog({ roomId, isShared, onShared }: ShareRoomDialogProps) {
    const queryClient = useQueryClient();
    const closeRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = authClient.useSession();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!session?.user?.id) {
                throw new Error("Not authenticated");
            }
            return axios.put("/api/room", {
                roomId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room', roomId] });
            queryClient.invalidateQueries({ queryKey: ['public-rooms'] });
            queryClient.setQueryData(['room', roomId], (oldData: unknown) => {
                if (oldData && typeof oldData === 'object' && 'room' in oldData) {
                    return {
                        ...oldData,
                        room: {
                            ...(oldData as { room: { isShared?: boolean } }).room,
                            isShared: true
                        }
                    };
                }
                return oldData;
            });
            toast.success("Room is now public!");
            setIsOpen(false);
            onShared?.();
        },
        onError: (error: Error) => {
            console.error("Error sharing room:", error);
            toast.error(error.message || "Failed to share room");
        },
    });

    const handleConfirm = async () => {
        await mutation.mutateAsync();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={isShared}
                >
                    <Share2 className="h-4 w-4" />
                    {isShared ? "Shared" : "Share Room"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Share Room
                    </DialogTitle>
                    <DialogDescription>
                        Make this room public so others can join.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="bg-amber-50 dark:bg-[#49392f] border border-amber-200 dark:border-none rounded-lg p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-100">
                            <strong>Warning:</strong> It&apos;s recommended to share only when your pair has already joined.
                            Making your room public before that will allow others to join.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" ref={closeRef}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        onClick={handleConfirm}
                        disabled={mutation.isPending || !session?.user}
                        className="bg-[#73563C] text-white hover:bg-[#503728]"
                    >
                        {mutation.isPending ? "Sharing..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
