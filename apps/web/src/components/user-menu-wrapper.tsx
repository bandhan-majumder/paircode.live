import { auth } from "@paircode/auth";
import UserMenu from "./user-menu-client"
import { headers } from "next/headers";

export default async function UserMenuWrapper() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	return <UserMenu initialSession={session} />
}