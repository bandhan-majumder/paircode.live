"use client";

import { authClient } from '@/lib/auth-client';
import { CreateRoomDialog } from './create-room-dialog';
import { StyledButton } from './styled-buttons';
import { Github, Plus, Star } from 'lucide-react';

function ActionButtons({ showGithub = false }: {
    showGithub?: boolean
}) {
    const { data: session, isPending } = authClient.useSession();

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center mt-10">
            {!isPending && session && <CreateRoomDialog session={session} />}
            {!session && (
                <StyledButton
                    className='bg-[#BD9267] dark:bg-[#BD9267] w-full sm:w-auto text-nowrap'
                    text=""
                    url="/login"
                >
                   <div className="flex justify-center items-center gap-2 text-nowrap">
                                    <Plus className="h-5 w-5" />
                                    <span>Create a room</span>
                                </div>
                </StyledButton>
            )}
            {showGithub && (
                <StyledButton text="" variant="default" url="https://github.com/bandhan-majumder/paircode.live" className="w-full sm:w-auto min-w-[200px]">
                                <div className="flex justify-center items-center gap-2 text-nowrap">
                                    <Github className="h-5 w-5" />
                                    <span>Star on GitHub</span>
                                </div>
                            </StyledButton>
            )}
        </div>
    )
}

export default ActionButtons