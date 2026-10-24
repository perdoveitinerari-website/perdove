<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import PdfActions from '#lib/components/PdfActions.svelte';
	import ItineraryCard from '#lib/components/ItineraryCard.svelte';
	import { reveal } from '#lib/reveal.ts';
	import { imageSet } from '#lib/images.ts';
	import { site } from '#lib/config.ts';
	import { itineraries, daysLabel, regionLabel } from '#lib/data/itineraries.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const it = $derived(data.itinerary);
	const wide = $derived(imageSet(`${it.slug}-wide`));
	const cover = $derived(imageSet(`${it.slug}-cover`));
	const others = $derived(itineraries.filter((i) => i.slug !== it.slug));

	// Mobile sticky download bar: visible once the hero buttons scroll out of view.
	let heroActions: HTMLElement | undefined = $state();
	let showBar = $state(false);
	$effect(() => {
		if (!heroActions) return;
		const io = new IntersectionObserver(([e]) => (showBar = !e.isIntersecting && e.boundingClientRect.top < 0));
		io.observe(heroActions);
		return () => io.disconnect();
	});

	const description = $derived(
		`${it.title}: itinerario gratuito in PDF con programma giorno per giorno, ${it.maps} mappe interattive, tempi di visita, prezzi, hotel, ristoranti e budget. Scaricalo gratis.`
	);

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'TouristTrip',
			name: it.title,
			description: it.summary,
			inLanguage: 'it-IT',
			url: `${site.url}/itinerari/${it.slug}`,
			image: `${site.url}/og/${it.slug}.jpg`,
			provider: { '@type': 'Organization', name: site.name, url: site.url },
			offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Itinerari', item: `${site.url}/itinerari` },
				{ '@type': 'ListItem', position: 3, name: it.title, item: `${site.url}/itinerari/${it.slug}` }
			]
		}
	]);
</script>

<Seo
	title={`${it.title} – Itinerario gratuito in PDF`}
	{description}
	image={`/og/${it.slug}.jpg`}
	imageAlt={`Foto di ${it.city}, itinerario PerDove ${it.title}`}
	type="article"
	{jsonLd}
/>

<!-- HERO -->
<section class="hero" aria-labelledby="it-title">
	<img
		class="hero-img"
		src={wide.src}
		srcset={wide.srcset}
		sizes="100vw"
		width={wide.width}
		height={wide.height}
		alt=""
		fetchpriority="high"
	/>
	<div class="hero-shade" aria-hidden="true"></div>
	<div class="container hero-inner">
		<nav class="crumbs" aria-label="Percorso di navigazione">
			<ol>
				<li><a href="/">Home</a></li>
				<li><a href="/itinerari">Itinerari</a></li>
				<li aria-current="page">{it.city}</li>
			</ol>
		</nav>
		<p class="tags">
			<span>{regionLabel(it.region)}</span>
			{#if it.country !== regionLabel(it.region)}<span>{it.country}</span>{/if}
		</p>
		<h1 id="it-title">{it.title}</h1>
		<p class="tagline">{it.tagline}</p>
		<ul class="facts">
			<li><Icon name="calendar" size={18} />{daysLabel(it.days)}</li>
			<li><Icon name="map" size={18} />{it.maps} mappe interattive</li>
			<li><Icon name="book" size={18} />PDF · {it.pdf.pages} pagine · {it.pdf.sizeMb.toLocaleString('it-IT')} MB</li>
		</ul>
		<div bind:this={heroActions}>
			<PdfActions itinerary={it} position="hero" tone="light" />
		</div>
	</div>
</section>

<!-- OVERVIEW -->
<section class="section overview" aria-labelledby="overview-title">
	<div class="container overview-grid">
		<div {@attach reveal()}>
			<p class="eyebrow">Panoramica</p>
			<h2 id="overview-title">{it.summary}</h2>
			{#each it.intro as paragraph, i (i)}
				<p class="intro">{paragraph}</p>
			{/each}

			<h3 class="included-title">Cosa trovi nel PDF</h3>
			<ul class="included">
				{#each it.features as feature (feature)}
					<li><span class="tick"><Icon name="check" size={16} /></span>{feature}</li>
				{/each}
			</ul>
		</div>

		<aside class="pdf-card" aria-label="Scarica l’itinerario" {@attach reveal(120)}>
			<img
				src={cover.src}
				srcset={cover.srcset}
				sizes="(max-width: 900px) 70vw, 340px"
				width={cover.width}
				height={cover.height}
				alt={`Copertina del PDF ${it.title}`}
				loading="lazy"
				decoding="async"
			/>
			<div class="pdf-card-body">
				<p class="pdf-card-title">Itinerario completo in PDF</p>
				<p class="pdf-card-meta">{it.pdf.pages} pagine · {it.pdf.sizeMb.toLocaleString('it-IT')} MB · gratuito</p>
				<PdfActions itinerary={it} position="scheda" />
				<p class="pdf-card-note">Nessuna registrazione richiesta.</p>
			</div>
		</aside>
	</div>
</section>

<!-- DOWNLOAD CTA -->
<section class="download" aria-labelledby="download-title">
	<div class="container">
		<div class="download-card" {@attach reveal()}>
			<div>
				<h2 id="download-title">Buon viaggio e buona scoperta di {it.city}!</h2>
				<p>Porta l’itinerario sempre con te: scaricalo sul telefono e consultalo anche offline.</p>
			</div>
			<PdfActions itinerary={it} position="cta-finale" tone="light" />
		</div>
	</div>
</section>

<!-- OTHER ITINERARIES -->
{#if others.length}
	<section class="section others" aria-labelledby="others-title">
		<div class="container">
			<header class="section-head" {@attach reveal()}>
				<p class="eyebrow">Continua a esplorare</p>
				<h2 id="others-title">Altri itinerari</h2>
			</header>
			<ul class="others-grid">
				{#each others as other, i (other.slug)}
					<li {@attach reveal(i * 90)}><ItineraryCard itinerary={other} /></li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<div class="sticky-bar" class:show={showBar} aria-hidden={!showBar} inert={!showBar}>
	<PdfActions itinerary={it} position="barra-mobile" compact />
</div>

<style>
	/* ---------- Hero ---------- */
	.hero {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: min(88svh, 760px);
		margin-top: calc(-1 * var(--header-h));
		padding: calc(var(--header-h) + 3rem) 0 clamp(2.5rem, 6vw, 4.5rem);
		color: #fff;
		overflow: hidden;
		isolation: isolate;
	}

	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -2;
		animation: ken-burns 18s ease-out both;
	}

	@keyframes ken-burns {
		from {
			transform: scale(1.12);
		}
	}

	.hero-shade {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgb(251 247 242 / 0.85) 0, rgb(251 247 242 / 0) calc(var(--header-h) + 40px)),
			linear-gradient(0deg, rgb(30 16 12 / 0.88) 0%, rgb(30 16 12 / 0.45) 50%, rgb(30 16 12 / 0.1) 80%);
	}

	.hero-inner > * {
		animation: rise 0.9s var(--ease-out) both;
	}

	.hero-inner > :nth-child(2) {
		animation-delay: 60ms;
	}
	.hero-inner > :nth-child(3) {
		animation-delay: 120ms;
	}
	.hero-inner > :nth-child(4) {
		animation-delay: 180ms;
	}
	.hero-inner > :nth-child(5) {
		animation-delay: 240ms;
	}
	.hero-inner > :nth-child(6) {
		animation-delay: 300ms;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	.crumbs ol {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0 0 1.25rem;
		padding: 0;
		font-size: 0.9rem;
		color: #f1e4da;
	}

	.crumbs li + li::before {
		content: '/';
		margin-right: 0.4rem;
		opacity: 0.6;
	}

	.crumbs a {
		color: #fff;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tags span {
		padding: 0.3rem 0.85rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.16);
		border: 1px solid rgb(255 255 255 / 0.35);
		backdrop-filter: blur(6px);
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.hero h1 {
		font-size: clamp(2.6rem, 1.6rem + 4.4vw, 5.2rem);
		color: #fff;
		margin-bottom: 0.75rem;
		text-shadow: 0 2px 30px rgb(0 0 0 / 0.25);
	}

	.tagline {
		max-width: 46ch;
		font-size: var(--step-1);
		color: #f6ece5;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 1.5rem;
		list-style: none;
		margin: 0 0 2rem;
		padding: 0;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.facts li {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	/* ---------- Overview ---------- */
	.overview-grid {
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: clamp(2rem, 6vw, 5rem);
		align-items: start;
	}

	.overview h2 {
		font-size: var(--step-2);
		line-height: 1.3;
	}

	.intro {
		color: var(--text-muted);
		font-size: 1.05rem;
	}

	.included-title {
		margin-top: 2rem;
	}

	.included {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.included li {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		font-weight: 600;
	}

	.tick {
		display: grid;
		place-items: center;
		flex: none;
		width: 26px;
		height: 26px;
		margin-top: 0.05rem;
		border-radius: 50%;
		background: var(--glacier);
		color: var(--chambray-ink);
	}

	.pdf-card {
		position: sticky;
		top: calc(var(--header-h) + 24px);
		background: var(--surface);
		border-radius: var(--radius-l);
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.pdf-card img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: top;
	}

	.pdf-card-body {
		padding: 1.5rem;
	}

	.pdf-card-title {
		font-family: var(--font-display);
		font-size: var(--step-1);
		margin-bottom: 0.2rem;
	}

	.pdf-card-meta,
	.pdf-card-note {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.pdf-card-note {
		margin: 0.9rem 0 0;
	}

	.pdf-card :global(.actions) {
		flex-direction: column;
	}

	/* ---------- Download CTA ---------- */
	.download-card {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem 3rem;
		padding: clamp(2rem, 5vw, 3.5rem);
		border-radius: clamp(28px, 4vw, 44px);
		background:
			radial-gradient(500px 260px at 100% 0%, rgb(121 163 195 / 0.45), transparent 70%),
			linear-gradient(135deg, #4a2c22, var(--espresso));
		color: #f3e7dc;
	}

	.download-card h2 {
		color: #fff;
		font-size: var(--step-3);
		max-width: 20ch;
	}

	.download-card p {
		margin: 0;
	}

	/* ---------- Others ---------- */
	.others-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* ---------- Mobile sticky CTA ---------- */
	.sticky-bar {
		display: none;
	}

	@media (max-width: 900px) {
		.overview-grid {
			grid-template-columns: 1fr;
		}

		.pdf-card {
			position: static;
			max-width: 420px;
		}

		.sticky-bar {
			display: block;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 40;
			padding: 0.75rem var(--gutter) calc(0.75rem + env(safe-area-inset-bottom));
			background: rgb(251 247 242 / 0.94);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			box-shadow: 0 -1px 0 var(--line), 0 -10px 30px -12px rgb(58 33 25 / 0.25);
			transform: translateY(110%);
			transition: transform 0.45s var(--ease-out);
		}

		.sticky-bar.show {
			transform: none;
		}
	}

	@media (max-width: 720px) {
		.included {
			grid-template-columns: 1fr;
		}
	}
</style>
