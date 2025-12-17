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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { authClient } from "@/lib/auth-client";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOutSourceCodeActionsStore } from "@/providers/outsource-source-provider";
import { StyledButton } from "./styled-buttons";

export function CreateRoomDialog({ 
    session, 
    isOutSourced, 
    outSourcedCode, 
    outSourcedLanguage 
}: {
    session: typeof authClient.$Infer.Session,
    isOutSourced?: boolean,
    outSourcedCode?: string,
    outSourcedLanguage?: string
}) {
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();
    const hasSavedOutsourcedCode = useRef(false);
    
    const { setCode, setLanguage } = useOutSourceCodeActionsStore(
        (state) => state,
    );

    useEffect(() => {
        if (isOutSourced && !hasSavedOutsourcedCode.current) {
            hasSavedOutsourcedCode.current = true;
            setCode(outSourcedCode || '');
            setLanguage(outSourcedLanguage || '');
        }
    }, [isOutSourced, outSourcedCode, outSourcedLanguage, setCode, setLanguage]);

    if (!session) {
        router.push("/");
        return null;
    }

    const mutation = useMutation({
        mutationFn: async (data: { topic: string, createdBy: string }) => {
            return axios.post("/api/room", data);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const topic = formData.get("topic") as string;

        if (topic?.trim()) {
            const response = await mutation.mutateAsync({ 
                topic, 
                createdBy: session.user.id 
            });
            router.push(`/room/${response.data.newRoom.id}`);
            return;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <StyledButton className="bg-[#BD9267] dark:bg-[#BD9267]" text="Create a room" url="/login" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} ref={formRef}>
                    <DialogHeader>
                        <DialogTitle>Create a new session</DialogTitle>
                        <DialogDescription>
                            Enter session details here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                name="topic"
                                placeholder="ex: debugging memory in c"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" ref={closeRef}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="default"
                            type="submit"
                            className="bg-[#73563C] text-white hover:bg-[#503728]"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}