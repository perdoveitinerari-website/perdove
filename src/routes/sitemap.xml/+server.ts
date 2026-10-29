import { site } from '#lib/config.ts';
import { itineraries } from '#lib/data/itineraries.ts';

export const prerender = true;

const LASTMOD = '2026-10-24';

const pages: { path: string; priority: string; changefreq: string }[] = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/itinerari', priority: '0.9', changefreq: 'weekly' },
	...itineraries.map((it) => ({ path: `/itinerari/${it.slug}`, priority: '0.8', changefreq: 'monthly' })),
	{ path: '/faq', priority: '0.5', changefreq: 'monthly' },
	{ path: '/contatti', priority: '0.5', changefreq: 'yearly' },
	{ path: '/feedback', priority: '0.4', changefreq: 'yearly' },
	{ path: '/privacy', priority: '0.2', changefreq: 'yearly' },
	{ path: '/termini', priority: '0.2', changefreq: 'yearly' }
];

export function GET() {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `	<url>
		<loc>${site.url}${p.path === '/' ? '/' : p.path}</loc>
		<lastmod>${LASTMOD}</lastmod>
		<changefreq>${p.changefreq}</changefreq>
		<priority>${p.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
