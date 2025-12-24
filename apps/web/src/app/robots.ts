import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://paircode.live';
    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/terms-and-services', '/vscode-extension', '/feedback', '/login'],
            disallow: ['/api/', '/room/', '/end-call/']
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: 'https://paircode.live',
    };
}