import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	images: {
		domains: ["lh3.googleusercontent.com", "cdn.jsdelivr.net"],
	}
};

export default nextConfig;
