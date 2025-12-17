"use client";

import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { CreateRoomDialog } from './create-room-dialog';
import Link from 'next/link';
import { StyledButton } from './styled-buttons';
import { Github } from 'lucide-react';

function ActionButtons({ showGithub = false } : {
    showGithub?: boolean
}) {
    const { data: session, isPending } = authClient.useSession();

    return (
        <div className="flex justify-center gap-10 mt-10">
            {!isPending && session && <CreateRoomDialog session={session} />}
            {!session && <StyledButton className='bg-[#BD9267] dark:bg-[#BD9267]' text="Create a room" url="/login" />}
            {showGithub && <StyledButton text="" variant="default" url="https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode">
                <Link target="blank" href={"https://github.com/bandhan-majumder/paircode.live"} className="flex justify-center items-center">
                    <Github className="mr-2 h-5 w-5" />
                    Give us a ⭐</Link>
            </StyledButton>}
        </div>
    )
}

export default ActionButtons