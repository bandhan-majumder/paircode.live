"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutSourceCodeActionsStoreProvider } from "@/providers/outsource-source-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<OutSourceCodeActionsStoreProvider>
					{children}
				</OutSourceCodeActionsStoreProvider>
				<Toaster richColors />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
