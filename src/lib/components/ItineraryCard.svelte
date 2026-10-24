<script lang="ts">
	import Icon from './Icon.svelte';
	import { imageSet } from '#lib/images.ts';
	import { daysLabel, regionLabel, type Itinerary } from '#lib/data/itineraries.ts';

	let { itinerary, eager = false }: { itinerary: Itinerary; eager?: boolean } = $props();

	const img = $derived(imageSet(`${itinerary.slug}-cover`));
</script>

<article class="card">
	<div class="media">
		<img
			src={img.src}
			srcset={img.srcset}
			sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
			width={img.width}
			height={img.height}
			alt={`Copertina dell’itinerario ${itinerary.title}`}
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
		/>
		<span class="badge">{regionLabel(itinerary.region)}</span>
		<span class="free">Gratis</span>
	</div>
	<div class="body">
		<p class="meta">
			<span><Icon name="pin" size={16} />{itinerary.country}</span>
			<span><Icon name="calendar" size={16} />{daysLabel(itinerary.days)}</span>
			<span><Icon name="book" size={16} />PDF · {itinerary.pdf.pages} pagine</span>
		</p>
		<h3>
			<a href={`/itinerari/${itinerary.slug}`} class="stretched">{itinerary.title}</a>
		</h3>
		<p class="summary">{itinerary.summary}</p>
		<span class="link-arrow" aria-hidden="true">Scopri l’itinerario <Icon name="arrow" /></span>
	</div>
</article>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--surface);
		border-radius: var(--radius-l);
		overflow: hidden;
		box-shadow: var(--shadow-s);
		transition:
			transform 0.5s var(--ease-out),
			box-shadow 0.5s var(--ease-out);
	}

	.card:hover,
	.card:focus-within {
		transform: translateY(-6px);
		box-shadow: var(--shadow);
	}

	.media {
		position: relative;
		aspect-ratio: 4 / 3.4;
		overflow: hidden;
		background: var(--glacier);
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 1.2s var(--ease-out);
	}

	.card:hover .media img {
		transform: scale(1.06);
	}

	.badge,
	.free {
		position: absolute;
		top: 1rem;
		padding: 0.3rem 0.8rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.badge {
		left: 1rem;
		background: rgb(255 255 255 / 0.92);
		color: var(--espresso);
		backdrop-filter: blur(6px);
	}

	.free {
		right: 1rem;
		background: var(--espresso);
		color: #fff;
	}

	.body {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 1.4rem 1.5rem 1.6rem;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
		margin-bottom: 0.7rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--clay-ink);
	}

	.meta span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	h3 {
		font-size: var(--step-2);
		margin-bottom: 0.5rem;
	}

	.stretched {
		color: inherit;
		text-decoration: none;
	}

	/* Whole card clickable, while keeping a single accessible link. */
	.stretched::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	.stretched:focus-visible {
		outline: none;
	}

	.card:has(.stretched:focus-visible) {
		outline: 3px solid var(--chambray);
		outline-offset: 4px;
	}

	.summary {
		color: var(--text-muted);
		font-size: 0.97rem;
		flex: 1;
	}

	.body .link-arrow {
		align-self: flex-start;
	}

	.card:hover .link-arrow {
		background-size: 100% 1.5px;
	}

	.card:hover .link-arrow :global(svg) {
		transform: translateX(4px);
	}
</style>
