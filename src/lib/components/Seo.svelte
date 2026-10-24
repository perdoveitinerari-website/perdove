<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/config.ts';

	let {
		title,
		description,
		image = site.defaultOgImage,
		imageAlt = 'PerDove – Itinerari che ti portano lontano',
		type = 'website',
		noindex = false,
		jsonLd
	}: {
		title: string;
		description: string;
		image?: string;
		imageAlt?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	} = $props();

	const fullTitle = $derived(title.includes('PerDove') ? title : `${title} | PerDove`);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const imageUrl = $derived(new URL(image, site.url).href);
	// Escape "<" so content can never close the script tag.
	const ld = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<link rel="canonical" href={canonical} />
	{/if}

	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:secure_url" content={imageUrl} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if ld}
		{@html `<script type="application/ld+json">${ld}</script>`}
	{/if}
</svelte:head>
