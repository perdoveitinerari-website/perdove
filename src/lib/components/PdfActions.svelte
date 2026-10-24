<script lang="ts">
	import Icon from './Icon.svelte';
	import { trackAttrs, EVENTS } from '#lib/analytics.ts';
	import type { Itinerary } from '#lib/data/itineraries.ts';

	let {
		itinerary,
		position,
		tone = 'dark',
		compact = false
	}: { itinerary: Itinerary; position: string; tone?: 'dark' | 'light'; compact?: boolean } = $props();

	const data = $derived({ itinerario: itinerary.slug, posizione: position });
</script>

<div class="actions" class:light={tone === 'light'} class:compact>
	<a
		class="btn"
		href={itinerary.pdf.file}
		download={itinerary.pdf.downloadName}
		type="application/pdf"
		{...trackAttrs(EVENTS.pdfDownload, data)}
	>
		<Icon name="download" />
		{compact ? 'Scarica gratis' : 'Scarica il PDF gratis'}
	</a>
	<a
		class="btn btn-outline"
		href={itinerary.pdf.file}
		target="_blank"
		rel="noopener"
		type="application/pdf"
		{...trackAttrs(EVENTS.pdfView, data)}
	>
		<Icon name="eye" />
		{compact ? 'Visualizza' : 'Visualizza online'}
		<span class="visually-hidden">(PDF, si apre in una nuova scheda)</span>
	</a>
</div>

<style>
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.light .btn {
		--btn-bg: #fff;
		--btn-fg: var(--espresso);
		--btn-border: #fff;
	}

	.light .btn-outline {
		--btn-bg: transparent;
		--btn-fg: #fff;
	}

	.light .btn-outline:hover {
		--btn-bg: #fff;
		--btn-fg: var(--espresso);
	}

	.compact {
		flex-wrap: nowrap;
	}

	.compact .btn {
		flex: 1;
		padding-inline: 1em;
	}
</style>
