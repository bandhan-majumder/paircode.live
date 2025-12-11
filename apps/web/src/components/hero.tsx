"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { CreateRoomDialog } from './create-room-dialog';
import Link from 'next/link';

function Hero() {
    const { data: session, isPending } = authClient.useSession();

    return (
        <div className="flex justify-center gap-10 mt-10">
            {session && <CreateRoomDialog session={session} />}
            {!session && <Button variant="default" className="bg-[#8F6E4D] text-white hover:bg-[#3C6E41]" asChild>
                <Link href={"/login"}>
                    Create a room
                </Link>
            </Button>}
            <Button className="bg-[#73563C] text-white hover:bg-[#503728]" variant={"default"}>
                View live Shares
            </Button>
        </div>
    )
}

export default Hero