import Link from "next/link";
import UserMenuWrapper from "./user-menu-wrapper";
import { AnnouncementBanner } from "./announcement-header";

export default function NavBar() {
	const links = [
		// { to: "/", label: "Home" },
	] as const;

	return (
		<header>
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
				<div className="flex">
					<div className="flex flex-col justify-center items-center">
						<Link target="blank" href={"https://github.com/bandhan-majumder/paircode.live"}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={24}
								height={24}
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.533 1.032 1.533 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.094.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.594 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.852 0 1.337-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.02C22 6.484 17.523 2 12 2z" />
							</svg>
						</Link>
					</div>
					<UserMenuWrapper />
				</div>
			</div>
			{/* <hr /> */}
		</header>
	);
}