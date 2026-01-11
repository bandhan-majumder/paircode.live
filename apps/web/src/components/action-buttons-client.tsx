"use client";

import type { authClient } from '@/lib/auth-client';
import { CreateRoomDialog } from './create-room-dialog';
import { StyledButton } from './styled-buttons';
import { Github, Plus } from 'lucide-react';

interface ActionButtonsClientProps {
    session: typeof authClient.$Infer.Session | null;
    showLive?: boolean;
}

export function ActionButtonsClient({ session, showLive = false }: ActionButtonsClientProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center mt-10">
            {session && <CreateRoomDialog session={session} />}
            {!session && (
                <StyledButton
                    className='bg-[#BD9267] dark:bg-[#BD9267] w-full sm:w-auto min-w-[200px] text-nowrap'
                    text=""
                    url="/login"
                >
                    <div className="flex justify-center items-center gap-2 text-nowrap">
                        <Plus className="h-5 w-5" />
                        <span>Create a room</span>
                    </div>
                </StyledButton>
            )}
            {showLive && (
                <StyledButton text="" variant="default" url="/live" className="w-full sm:w-auto min-w-[200px]">
                    <div className="flex justify-center items-center gap-2 text-nowrap">
                    View live shares
                    </div>
                </StyledButton>
            )}
        </div>
    )
}
