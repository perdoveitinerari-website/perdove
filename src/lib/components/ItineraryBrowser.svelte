<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ItineraryCard from './ItineraryCard.svelte';
	import Icon from './Icon.svelte';
	import { itineraries, REGIONS, type Region } from '#lib/data/itineraries.ts';
	import { track, EVENTS } from '#lib/analytics.ts';

	type Filter = Region | 'tutti';

	let {
		filter = $bindable<Filter>('tutti'),
		syncUrl = false,
		headingLevel = 'h2'
	}: { filter?: Filter; syncUrl?: boolean; headingLevel?: 'h2' | 'h3' } = $props();

	const filters: { id: Filter; label: string; icon: string }[] = [
		{ id: 'tutti', label: 'Tutti', icon: 'compass' },
		...REGIONS.map((r) => ({ id: r.id as Filter, label: r.label, icon: 'pin' }))
	];

	const count = (id: Filter) => (id === 'tutti' ? itineraries.length : itineraries.filter((i) => i.region === id).length);
	const visible = $derived(filter === 'tutti' ? itineraries : itineraries.filter((i) => i.region === filter));
	const current = $derived(filters.find((f) => f.id === filter)!);

	// Read ?regione= after hydration (prerendered pages can't read query strings at build time).
	$effect(() => {
		if (!syncUrl) return;
		const param = new URLSearchParams(window.location.search).get('regione');
		if (param && filters.some((f) => f.id === param)) filter = param as Filter;
	});

	function select(id: Filter) {
		if (id === filter) return;
		filter = id;
		track(EVENTS.filter, { regione: id });
		if (syncUrl) {
			const url = new URL(window.location.href);
			if (id === 'tutti') url.searchParams.delete('regione');
			else url.searchParams.set('regione', id);
			history.replaceState(history.state, '', url);
		}
	}
</script>

<div class="browser">
	<div class="filters" role="group" aria-label="Filtra gli itinerari per destinazione">
		{#each filters as f (f.id)}
			<button
				type="button"
				class="chip"
				class:active={filter === f.id}
				aria-pressed={filter === f.id}
				onclick={() => select(f.id)}
			>
				<Icon name={f.icon} size={17} />
				{f.label}
				<span class="count" aria-label={`${count(f.id)} itinerari`}>{count(f.id)}</span>
			</button>
		{/each}
	</div>

	<p class="visually-hidden" aria-live="polite">
		{visible.length === 1 ? '1 itinerario' : `${visible.length} itinerari`} per {current.label}
	</p>

	{#if visible.length}
		<ul class="grid">
			{#each visible as it, i (it.slug)}
				<li
					animate:flip={{ duration: 500, easing: cubicOut }}
					in:scale={{ start: 0.94, duration: 450, delay: i * 70, easing: cubicOut }}
					out:fade={{ duration: 150 }}
				>
					<ItineraryCard itinerary={it} />
				</li>
			{/each}
		</ul>
	{:else}
		<div class="empty" in:fade>
			<svelte:element this={headingLevel}>Nuovi itinerari in arrivo</svelte:element>
			<p>Stiamo preparando nuove destinazioni per questa area. Nel frattempo, dai un’occhiata agli altri itinerari.</p>
			<button type="button" class="btn btn-outline" onclick={() => select('tutti')}>Vedi tutti gli itinerari</button>
		</div>
	{/if}
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.6rem;
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}

	/* Filter chips: the fourth and last interactive style (pill toggles). */
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 48px;
		padding: 0.55rem 0.7rem 0.55rem 1.15rem;
		border-radius: 999px;
		border: 1.5px solid var(--line);
		background: var(--surface);
		color: var(--espresso);
		font-weight: 700;
		cursor: pointer;
		transition:
			background-color 0.25s,
			border-color 0.25s,
			color 0.25s,
			transform 0.3s var(--ease-out),
			box-shadow 0.3s var(--ease-out);
	}

	.chip:hover {
		border-color: var(--clay);
		transform: translateY(-2px);
	}

	.chip.active {
		background: var(--espresso);
		border-color: var(--espresso);
		color: #fff;
		box-shadow: 0 10px 24px -12px rgb(58 33 25 / 0.6);
	}

	.count {
		display: grid;
		place-items: center;
		min-width: 1.7rem;
		height: 1.7rem;
		padding-inline: 0.4rem;
		border-radius: 999px;
		background: var(--sand);
		color: var(--espresso);
		font-size: 0.8rem;
	}

	.active .count {
		background: rgb(255 255 255 / 0.18);
		color: #fff;
	}

	@media (max-width: 520px) {
		.filters {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		.chip {
			justify-content: center;
			padding-inline: 0.75rem 0.55rem;
			font-size: 0.92rem;
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: clamp(1.25rem, 3vw, 2rem);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.empty {
		max-width: 520px;
		margin: 0 auto;
		text-align: center;
		padding: 3rem 1.5rem;
		border: 1.5px dashed var(--bisque);
		border-radius: var(--radius-l);
	}
</style>
