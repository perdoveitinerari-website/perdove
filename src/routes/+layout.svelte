<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { UMAMI } from '#lib/config.ts';
	import frauncesFont from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url';
	import manropeFont from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Smooth cross-fade between pages where the View Transitions API is supported.
	onNavigate((navigation) => {
		if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="preload" href={frauncesFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={manropeFont} as="font" type="font/woff2" crossorigin="anonymous" />
	{#if UMAMI.websiteId}
		<script defer src={UMAMI.src} data-website-id={UMAMI.websiteId} data-domains={UMAMI.domains}></script>
	{/if}
</svelte:head>

<Header />
<main id="contenuto" tabindex="-1">
	{@render children()}
</main>
<Footer />

<style>
	main {
		display: block;
		min-height: 60vh;
	}

	main:focus {
		outline: none;
	}
</style>
