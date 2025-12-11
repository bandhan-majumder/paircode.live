"use client";

import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { CreateRoomDialog } from './create-room-dialog';
import Link from 'next/link';

function ActionButtons() {
    const { data: session, isPending } = authClient.useSession();

    return (
        <div className="flex justify-center gap-10 mt-10">
            {!isPending && session && <CreateRoomDialog session={session} />}
            {!session && <Button variant="default" className="bg-[#8F6E4D] text-white hover:bg-[#3C6E41] drop-shadow-xs " asChild>
                <Link href={"/login"}>
                    Create a room
                </Link>
            </Button>}
            <Button className="bg-[#242424] text-white hover:bg-[#242424] drop-shadow-lg drop-shadow-inherit dark:drop-shadow-gray-700" variant={"default"}>
                View live Shares
            </Button>
        </div>
    )
}

export default ActionButtons