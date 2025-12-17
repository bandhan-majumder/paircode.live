"use client";

import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { CreateRoomDialog } from './create-room-dialog';
import Link from 'next/link';
import { StyledButton } from './styled-buttons';
import { Github, Star } from 'lucide-react';

function ActionButtons({ showGithub = false } : {
    showGithub?: boolean
}) {
    const { data: session, isPending } = authClient.useSession();

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-8 md:mt-10 px-4">
            {!isPending && session && <CreateRoomDialog session={session} />}
            {!session && (
                <StyledButton 
                    className='bg-[#BD9267] dark:bg-[#BD9267] w-full sm:w-auto' 
                    text="Create a room" 
                    url="/login" 
                />
            )}
            {showGithub && (
                <StyledButton 
                    text="" 
                    variant="default" 
                    url="https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode"
                    className="w-full sm:w-auto"
                >
                    <Link 
                        target="blank" 
                        href={"https://github.com/bandhan-majumder/paircode.live"} 
                        className="flex justify-center items-center gap-1"
                    >
                        <Github className="mr-2 h-5 w-5" />
                        Give us a <Star className="fill-yellow-400 text-yellow-400" />
                    </Link>
                </StyledButton>
            )}
        </div>
    )
}

export default ActionButtons