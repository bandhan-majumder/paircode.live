import Link from "next/link";
import UserMenuWrapper from "./user-menu-wrapper";
import { AnnouncementBanner } from "./announcement-header";

export default function NavBar() {
	const links = [
		// { to: "/", label: "Home" },
	] as const;

	return (
		<div>
			<AnnouncementBanner />
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} href={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<UserMenuWrapper />
			</div>
			{/* <hr /> */}
		</div>
	);
}