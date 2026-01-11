import { headers } from 'next/headers';
import { auth } from '@paircode/auth';
import { ActionButtonsClient } from './action-buttons-client';

async function ActionButtons({ showLive = false }: {
    showLive?: boolean
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return <ActionButtonsClient session={session} showLive={showLive} />;
}

export default ActionButtons