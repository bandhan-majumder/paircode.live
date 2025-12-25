import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	images: {
		domains: ["lh3.googleusercontent.com", "cdn.jsdelivr.net", "qaqtvoxob8zyd7wl.public.blob.vercel-storage.com"],
	}
};

export default nextConfig;
