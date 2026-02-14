"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { OutSourceCodeActionsStoreProvider } from "@/providers/outsource-source-provider";
import { queryClient } from "@/lib/utils/trpc";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
		<QueryClientProvider client={queryClient}>
			
				<OutSourceCodeActionsStoreProvider>
					{children}
				</OutSourceCodeActionsStoreProvider>
				<Toaster richColors />
		</QueryClientProvider>
		</ThemeProvider>
	);
}
