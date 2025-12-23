import { headers } from 'next/headers';
import { auth } from '@paircode/auth';
import { ActionButtonsClient } from './action-buttons-client';

async function ActionButtons({ showGithub = false }: {
    showGithub?: boolean
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return <ActionButtonsClient session={session} showGithub={showGithub} />;
}

export default ActionButtons