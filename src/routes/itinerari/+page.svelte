<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import ItineraryBrowser from '#lib/components/ItineraryBrowser.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { site } from '#lib/config.ts';
	import { itineraries } from '#lib/data/itineraries.ts';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Itinerari di viaggio gratuiti',
		url: `${site.url}/itinerari`,
		inLanguage: 'it-IT',
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: itineraries.map((it, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `${site.url}/itinerari/${it.slug}`,
				name: it.title
			}))
		}
	};
</script>

<Seo
	title="Itinerari di viaggio gratuiti in PDF: Italia, Europa e mondo"
	description="Tutti gli itinerari PerDove: Roma, Vienna e New York, organizzati giorno per giorno con mappe interattive, tempi di visita e consigli. Gratis in PDF, senza registrazione."
	{jsonLd}
/>

<PageHero
	eyebrow="Catalogo"
	title="Tutti gli itinerari"
	lead="Scegli la destinazione, consulta il programma giorno per giorno e scarica il PDF gratuito da portare con te."
/>

<section class="catalogue" aria-label="Elenco degli itinerari">
	<div class="container">
		<ItineraryBrowser syncUrl headingLevel="h2" />

		<aside class="soon">
			<span class="soon-icon"><Icon name="plus" size={22} /></span>
			<div>
				<h2>Nuove destinazioni in arrivo</h2>
				<p>
					Stiamo preparando nuovi itinerari. Hai un consiglio su dove andare? <a href="/contatti">Scrivici</a> oppure
					seguici su <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a> per non
					perderti le novità.
				</p>
			</div>
		</aside>
	</div>
</section>

<style>
	.catalogue {
		padding-bottom: clamp(2rem, 6vw, 4rem);
	}

	.soon {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-top: clamp(2.5rem, 6vw, 4rem);
		padding: 1.5rem 1.75rem;
		border: 2px dashed var(--bisque);
		border-radius: var(--radius-l);
	}

	.soon h2 {
		font-size: var(--step-1);
		margin-bottom: 0.3rem;
	}

	.soon p {
		margin: 0;
		color: var(--text-muted);
	}

	.soon-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--bisque-soft);
		color: var(--clay-ink);
	}

	@media (max-width: 560px) {
		.soon {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
