<script lang="ts">
	import { page } from '$app/state';
	import Seo from '#lib/components/Seo.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { itineraries } from '#lib/data/itineraries.ts';

	const notFound = $derived(page.status === 404);
</script>

<Seo
	title={notFound ? 'Pagina non trovata' : 'Si è verificato un errore'}
	description="La pagina che cerchi non esiste o è stata spostata. Torna alla home o scopri gli itinerari gratuiti di PerDove."
	noindex
/>

<section class="error">
	<div class="container inner">
		<svg class="art" viewBox="0 0 320 200" aria-hidden="true">
			<path class="route" d="M20 170 C 90 170 90 90 160 100 S 250 160 300 40" />
			<circle cx="20" cy="170" r="7" fill="#957662" />
			<g class="pin">
				<path
					d="M300 8c-11 0-20 8.8-20 19.6C280 42 300 61 300 61s20-19 20-33.4C320 16.8 311 8 300 8z"
					fill="#3A2119"
				/>
				<text x="300" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">?</text>
			</g>
		</svg>

		<p class="code">{notFound ? 'Errore 404' : `Errore ${page.status}`}</p>
		<h1>{notFound ? 'Ops, hai sbagliato strada!' : 'Qualcosa è andato storto'}</h1>
		<p class="lead">
			{notFound
				? 'La pagina che cerchi non esiste o è stata spostata. Nessun problema: ogni viaggio ha le sue deviazioni.'
				: 'Si è verificato un errore imprevisto. Riprova tra qualche istante.'}
		</p>
		<div class="btn-row center">
			<a class="btn" href="/"><Icon name="arrow-left" /> Torna alla home</a>
			<a class="btn btn-outline" href="/itinerari">Vedi gli itinerari</a>
		</div>

		<nav class="suggest" aria-label="Itinerari suggeriti">
			<p>Oppure riparti da qui:</p>
			<ul>
				{#each itineraries as it (it.slug)}
					<li><a class="link-arrow" href={`/itinerari/${it.slug}`}>{it.title} <Icon name="arrow" /></a></li>
				{/each}
			</ul>
		</nav>
	</div>
</section>

<style>
	.error {
		padding: clamp(3rem, 8vw, 6rem) 0;
		text-align: center;
	}

	.inner {
		max-width: 640px;
	}

	.art {
		width: min(320px, 80%);
		margin: 0 auto 1.5rem;
		overflow: visible;
	}

	.route {
		fill: none;
		stroke: #c98a6b;
		stroke-width: 3;
		stroke-dasharray: 4 10;
		stroke-linecap: round;
		animation: dash 2.2s linear infinite;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: -28;
		}
	}

	.pin {
		animation: bob 2.4s ease-in-out infinite;
	}

	@keyframes bob {
		50% {
			transform: translateY(-8px);
		}
	}

	.code {
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--clay-ink);
		font-size: 0.85rem;
	}

	.center {
		justify-content: center;
		margin-top: 2rem;
	}

	.suggest {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--line);
	}

	.suggest p {
		color: var(--text-muted);
	}

	.suggest ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem 1.75rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
